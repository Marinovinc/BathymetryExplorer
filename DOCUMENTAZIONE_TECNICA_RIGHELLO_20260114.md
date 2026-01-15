# DOCUMENTAZIONE TECNICA - BathymetryExplorer Righello

**Versione:** 1.1.0
**Data:** 2026-01-14
**File principale:** `D:\Dev\BathymetryExplorer\index.html`

---

## ARCHITETTURA

### Stack Tecnologico
- **Frontend:** HTML5, CSS3, JavaScript vanilla
- **Mappe:** Leaflet.js v1.9.4
- **Geocoding:** Nominatim OpenStreetMap API
- **Storage:** localStorage (preferiti), memoria (zone temporanee)

### Struttura File

```
D:\Dev\BathymetryExplorer\
├── index.html          # Applicazione monolitica (HTML+CSS+JS)
├── zones_data.js       # Dati campi di gara (importato via <script>)
├── README.txt          # Istruzioni utente
└── screenshots/        # Screenshot test Playwright
```

---

## VARIABILI GLOBALI RIGHELLO

```javascript
let rulerActive = false;            // Righello in modalità misurazione
let editMode = false;               // Modalità editing punti attiva
let rulerPoints = [];               // Array di L.LatLng - punti del poligono
let rulerMarkers = [];              // Array di L.Marker - marker visuali
let rulerLines = [];                // Array di {line: L.Polyline, label: L.Marker}
let previewLine = null;             // L.Polyline - linea anteprima
let previewLabel = null;            // L.Marker - label anteprima
let editingZoneId = null;           // ID zona in modifica (da ZONES_DATA)
let currentZonePolygon = null;      // L.Polygon - poligono zona per editing
let currentGatheringMarker = null;  // L.Marker - marker punto raduno
const CLOSE_THRESHOLD = 20;         // Pixel per attivare chiusura poligono
```

---

## FUNZIONI PRINCIPALI

### Calcolo Distanze

#### `haversineDistance(lat1, lon1, lat2, lon2)`
**Scopo:** Calcola distanza great-circle tra due punti GPS.
**Algoritmo:** Formula di Haversine
**Input:** 4 coordinate decimali
**Output:** Distanza in km
**Linea:** 2436-2445

```javascript
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Raggio Terra in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}
```

#### `kmToNauticalMiles(km)`
**Scopo:** Converte km in miglia nautiche.
**Formula:** `km / 1.852`
**Linea:** 2448-2450

#### `calculateTotalDistance(includeClosing = false)`
**Scopo:** Somma distanze di tutti i segmenti.
**Opzione:** `includeClosing` aggiunge segmento ultimo→primo
**Linea:** 2453-2469

---

### Gestione Punti

#### `addRulerPoint(latlng)`
**Scopo:** Aggiunge punto al righello, crea marker e linea.
**Comportamento speciale:**
- Se `isNearFirstPoint()` → chiude poligono
- Primo punto: verde, più grande, tooltip
- Altri punti: arancione, popup con coordinate
**Drag:** Tutti i marker sono `draggable: true`
**Linea:** 2720-2810

#### `isNearFirstPoint(latlng)`
**Scopo:** Verifica se click è vicino al primo punto.
**Algoritmo:** Distanza euclidea in pixel
**Threshold:** 20px
**Linea:** 2706-2715

```javascript
function isNearFirstPoint(latlng) {
    if (rulerPoints.length < 3) return false;
    const firstPoint = rulerPoints[0];
    const firstPixel = map.latLngToContainerPoint(L.latLng(firstPoint.lat, firstPoint.lng));
    const clickPixel = map.latLngToContainerPoint(latlng);
    const distance = Math.sqrt(
        Math.pow(firstPixel.x - clickPixel.x, 2) +
        Math.pow(firstPixel.y - clickPixel.y, 2)
    );
    return distance < CLOSE_THRESHOLD;
}
```

---

### Chiusura Poligono

#### `closePolygonAndSave()`
**Scopo:** Chiude poligono e mostra dialog salvataggio.
**Async:** Sì (attende geocoding)
**Passaggi:**
1. Disegna linea chiusura (verde)
2. Disattiva righello
3. Calcola centroide
4. Reverse geocoding → nome luogo
5. Mostra dialog `showSaveZoneDialog()`
**Linea:** 2527-2557

#### `getLocationName(lat, lng)`
**Scopo:** Reverse geocoding via Nominatim.
**API:** `https://nominatim.openstreetmap.org/reverse`
**Fallback:** "Lat X.XX, Lng Y.YY"
**Linea:** 2512-2524

#### `calculateCentroid(points)`
**Scopo:** Calcola centro geometrico del poligono.
**Algoritmo:** Media aritmetica coordinate
**Linea:** 2499-2509

---

### Dialog Salvataggio

#### `showSaveZoneDialog(centroid, locationName, perimeterNm)`
**Scopo:** Crea e mostra dialog modale per salvare campo.
**DOM:** Overlay + form dinamico
**Campi auto-rilevati:** Luogo, centro, vertici
**Campo richiesto:** Nome (input)
**Linea:** 2560-2625

#### `confirmSaveZone(locationName, centerLat, centerLng, year)`
**Scopo:** Valida input e salva zona in `ZONES_DATA`.
**Validazione:** Nome non vuoto
**ID generato:** `nome-slugificato-timestamp`
**Colore:** Random hex
**Linea:** 2633-2691

---

### Modalità Editing

#### `toggleEditMode()`
**Scopo:** Attiva/disattiva editing punti.
**Quando attivo:**
- Pulsante diventa verde "Fine"
- Cursore "move" sui marker
- Righello misurazione disattivato
**Linea:** 2939-2967

#### `updateAllLines()`
**Scopo:** Ridisegna tutte le linee dopo drag.
**Chiamata:** Durante `marker.on('drag')`
**Linea:** 2903-2936

---

### Editing Zone Salvate

#### `editSelectedZone()`
**Scopo:** Carica zona esistente per modifica.
**Stato:** ✅ Funzionante (fix applicato 2026-01-14)
**Passaggi:**
1. Rimuove eventuale poligono zona dalla mappa
2. Legge zona da `ZONES_DATA`
3. Pulisce righello
4. Carica vertici come marker draggabili
5. Attiva edit mode
6. Mostra pulsante "Salva Modifiche"
**Linea:** 2989-3110

#### `showSaveChangesButton(zoneName)`
**Scopo:** Aggiunge pulsante "Salva Modifiche" alla sidebar.
**Linea:** 3113-3132

#### `saveZoneChanges(zoneName)`
**Scopo:** Aggiorna zona in `ZONES_DATA` con nuovi vertici.
**Linea:** 3135-3168

---

## EVENT HANDLERS

### Map Events

```javascript
// Preview linea durante movimento mouse
map.on('mousemove', function(e) {
    if (!rulerActive || rulerPoints.length === 0) return;
    // Disegna linea preview + label
    // Se vicino a punto 1: verde + "CHIUDI"
});

// Aggiunta punti su click
map.on('click', function(e) {
    if (rulerActive) {
        addRulerPoint(e.latlng);
    }
});
```

### Marker Events

```javascript
// Click su primo marker per chiudere
marker.on('click', function(e) {
    if (rulerPoints.length >= 3 && rulerActive && !editMode) {
        L.DomEvent.stopPropagation(e);
        closePolygonAndSave();
    }
});

// Drag per editing
marker.on('drag', function(e) {
    if (editMode) {
        rulerPoints[marker.pointIndex] = e.target.getLatLng();
        updateAllLines();
        updateRulerDisplay();
    }
});
```

---

## API ESTERNE

### Nominatim Reverse Geocoding
**URL:** `https://nominatim.openstreetmap.org/reverse`
**Parametri:**
- `format=json`
- `lat={latitude}`
- `lon={longitude}`
- `zoom=10`

**Campi usati:**
- `address.city`
- `address.town`
- `address.municipality`
- `address.county`
- `address.state`
- `address.country`

---

## STRUTTURA DATI

### ZONES_DATA (zones_data.js)
```javascript
{
    id: 'string-univoco',           // es. 'forio-biggame-2026'
    name: 'Nome Campo',
    tournament: 'Nome Torneo',
    year: 2026,
    description: 'Descrizione opzionale',
    gatheringPoint: {
        lat: 40.1234,
        lng: 13.5678,
        name: 'Punto di Raduno'
    },
    vertices: [
        { lat: 40.1, lng: 13.5 },
        { lat: 40.2, lng: 13.6 },
        // ...
    ],
    color: '#8b5cf6'
}
```

---

## ELEMENTI DOM

### Sezione Righello (sidebar)
```html
<div class="sidebar-section">
    <h3><i class="fas fa-ruler"></i> Righello</h3>
    <div class="ruler-controls">
        <button id="rulerToggleBtn">Misura</button>
        <button id="rulerEditBtn" style="display:none;">Modifica</button>
        <button onclick="clearRuler()">Pulisci</button>
    </div>
    <div id="rulerResult">
        <span id="rulerNm">0.00</span> nm
        <span id="rulerKm">0.00</span> km
        <div id="rulerPoints">...</div>
    </div>
</div>
```

### Sezione Campi di Gara (sidebar)
```html
<select id="zoneSelect">...</select>
<input id="showZoneCheckbox" type="checkbox">
<div class="zone-actions">
    <button onclick="goToSelectedZone()">Vai</button>
    <button onclick="editSelectedZone()">Modifica</button>
    <button onclick="exportZonesData()">Esporta</button>
</div>
```

---

## STILI CSS PRINCIPALI

### Label Distanza
```css
color: #1e293b;
font-size: 10px;
font-weight: 500;
white-space: nowrap;
text-shadow: 1px 1px 0 white, -1px -1px 0 white,
             1px -1px 0 white, -1px 1px 0 white;
```

### Marker Punti
- **Primo punto:** Verde (#22c55e), 28x28px, pulsante
- **Altri punti:** Arancione (#f59e0b), 24x24px

### Linee
- **Misura:** Arancione, tratteggiata `dashArray: '10, 5'`
- **Chiusura:** Verde, solida
- **Preview:** Arancione/verde, tratteggiata più fine `dashArray: '5, 10'`

---

## DIPENDENZE

```html
<!-- Leaflet -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<!-- Dati Zone -->
<script src="zones_data.js"></script>
```

---

## COSTANTI

| Nome | Valore | Descrizione |
|------|--------|-------------|
| `CLOSE_THRESHOLD` | 20 | Pixel per chiusura poligono |
| `R` (Haversine) | 6371 | Raggio Terra in km |
| `1 nm` | 1.852 km | Conversione miglia nautiche |
