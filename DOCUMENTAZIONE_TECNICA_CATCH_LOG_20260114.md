# DOCUMENTAZIONE TECNICA - BathymetryExplorer Catch Log

**Versione:** 1.2.0 (Workflow Semplificato)
**Data:** 2026-01-14
**File principale:** `D:\Dev\BathymetryExplorer\index.html`

---

## WORKFLOW SEMPLIFICATO

### Flusso in 2 passi:

1. **SEGNA PUNTO** (salvataggio immediato)
   - Click "Segna" + click su mappa
   - Oppure click "GPS" per posizione smartphone
   - Il punto viene salvato SUBITO con solo coordinate e timestamp
   - Marker grigio con "?" appare sulla mappa

2. **COMPLETA DATI** (quando vuoi)
   - Click sul punto nella lista
   - Si apre dialog per aggiungere: tipo, specie, peso, ecc.
   - Marker cambia colore in base al tipo

---

## ARCHITETTURA

### Struttura Dati Cattura

```javascript
{
    id: "catch_1705123456789",       // ID univoco con timestamp
    type: null | "strike" | "release" | "sighting" | "weighed_catch",  // null = da completare
    timestamp: "2026-01-14T08:35:00.000Z",
    location: {
        lat: 40.73,
        lng: 13.90,
        source: "gps" | "manual"
    },
    species: null | "tonno_rosso" | "marlin_blu" | "ricciola" | ... | "custom_nome_specie",
    weight: null | { value: 45.5, unit: "kg" },  // Solo per weighed_catch
    depth: null | { value: 120, unit: "m" },
    bait: null | "live" | "artificial" | "trolling_lure" | "jig",
    weather: null | "sunny" | "cloudy" | "rain" | "windy",
    notes: "",
    photo: null | "data:image/jpeg;base64,..."
}
```

**Nota:**
- I campi `type` e `species` sono `null` al salvataggio iniziale
- Le specie custom hanno ID formato `custom_nome_specie`
- Coordinate visualizzate in formato DDM (es. N 40° 29.700' E 13° 50.319')

---

## VARIABILI GLOBALI

```javascript
let catches = [];                    // Array catture caricate da localStorage
let catchMarkers = [];               // Marker Leaflet sulla mappa
let catchLogActive = false;          // Modalita registrazione cattura attiva
let pendingCatchLocation = null;     // Coordinate in attesa conferma dialog
```

**Posizione nel file:** Linee 2441-2444

---

## COSTANTI

### CATCH_TYPES (linea 2446-2451)
```javascript
const CATCH_TYPES = {
    strike: { label: 'Strike', icon: 'fa-bolt', color: '#f59e0b' },
    release: { label: 'Rilascio', icon: 'fa-fish', color: '#22c55e' },
    sighting: { label: 'Avvistamento', icon: 'fa-eye', color: '#3b82f6' },
    weighed_catch: { label: 'Cattura Pesata', icon: 'fa-weight-hanging', color: '#ef4444' }
};
```

### SPECIES_LIST (linea 2793-2816)
```javascript
const SPECIES_LIST = [
    // Grandi pelagici
    { id: 'tonno_rosso', label: 'Tonno Rosso' },
    { id: 'tonno_pinna_gialla', label: 'Tonno Pinna Gialla' },
    { id: 'alalunga', label: 'Alalunga' },
    { id: 'marlin_blu', label: 'Marlin Blu' },
    { id: 'marlin_bianco', label: 'Marlin Bianco' },
    { id: 'pesce_spada', label: 'Pesce Spada' },
    { id: 'aguglia_imperiale', label: 'Aguglia Imperiale' },
    // Pelagici medi
    { id: 'lampuga', label: 'Lampuga' },
    { id: 'ricciola', label: 'Ricciola' },
    { id: 'leccia', label: 'Leccia' },
    { id: 'leccia_stella', label: 'Leccia Stella' },
    { id: 'palamita', label: 'Palamita' },
    { id: 'tombarello', label: 'Tombarello' },
    // Predatori
    { id: 'dentice', label: 'Dentice' },
    { id: 'cernia', label: 'Cernia' },
    { id: 'spigola', label: 'Spigola' },
    { id: 'barracuda', label: 'Barracuda' },
    // Opzione custom
    { id: '_custom_', label: '➕ Altra specie...' }
];

// Specie personalizzate in localStorage: bathyExplorerCustomSpecies
```

### Specie Personalizzate

Le specie custom vengono salvate in `localStorage` con chiave `bathyExplorerCustomSpecies`.

**Funzioni helper:**
- `getAllSpecies()` - Restituisce lista completa (base + custom)
- `addCustomSpecies(name)` - Aggiunge nuova specie personalizzata
- `getSpeciesLabel(speciesId)` - Ottiene label da ID (include custom)

### BAIT_TYPES (linea 2464-2469)
```javascript
const BAIT_TYPES = [
    { id: 'live', label: 'Esca viva' },
    { id: 'artificial', label: 'Artificiale' },
    { id: 'trolling_lure', label: 'Trolling Lure' },
    { id: 'jig', label: 'Jig' }
];
```

### WEATHER_OPTIONS (linea 2471-2476)
```javascript
const WEATHER_OPTIONS = [
    { id: 'sunny', label: 'Soleggiato', icon: 'fa-sun' },
    { id: 'cloudy', label: 'Nuvoloso', icon: 'fa-cloud' },
    { id: 'rain', label: 'Pioggia', icon: 'fa-cloud-rain' },
    { id: 'windy', label: 'Ventoso', icon: 'fa-wind' }
];
```

---

## FUNZIONI PRINCIPALI

### Storage

#### `getCatches()` (linea 3585)
**Scopo:** Carica catture da localStorage
**Return:** Array di catture o array vuoto

#### `saveCatchesToStorage()` (linea 3593)
**Scopo:** Salva array catches in localStorage
**Key:** `bathyExplorerCatches`

#### `initCatchLog()` (linea 3600)
**Scopo:** Inizializza Catch Log all'avvio
- Carica catture da localStorage
- Popola dropdown specie
- Renderizza marker e lista

---

### Utility

#### `formatCoordDDM(lat, lng)` (linea 2774)
**Scopo:** Converte coordinate decimali in formato DDM (gradi minuti decimali)
**Input:** `lat` (numero), `lng` (numero)
**Output:** Stringa formato `N 40° 29.700'  E 13° 50.319'`
**Usato in:** Dialog `editCatch()` per visualizzare coordinate

---

### Registrazione

#### `toggleCatchMode()` (linea 3621)
**Scopo:** Attiva/disattiva modalita registrazione
**Comportamento:**
- Se attivo: pulsante verde, cursore crosshair
- Click su mappa apre dialog

#### `useCurrentGPS()` (linea 3639)
**Scopo:** Richiede posizione GPS da smartphone
**API:** `navigator.geolocation.getCurrentPosition()`
**Opzioni:**
- `enableHighAccuracy: true`
- `timeout: 15000`
- `maximumAge: 60000`

---

### Dialog

#### `showCatchDialog(lat, lng, source)` (linea 3664)
**Scopo:** Mostra dialog form per nuova cattura
**Parametri:**
- `lat, lng`: Coordinate GPS
- `source`: "gps" o "manual"
**Genera:** DOM overlay con form completo

#### `selectCatchType(type)` (linea 3757)
**Scopo:** Seleziona tipo cattura nel dialog
**Comportamento:** Mostra/nasconde campo peso se `weighed_catch`

#### `handlePhotoUpload(event)` (linea 3776)
**Scopo:** Converte immagine caricata in base64
**API:** `FileReader.readAsDataURL()`

#### `confirmCatch()` (linea 3801)
**Scopo:** Valida form e salva cattura
**Validazioni:**
- Tipo cattura obbligatorio
- Specie obbligatoria
- Peso obbligatorio se `weighed_catch`

---

### Marker Mappa

#### `createCatchMarkerIcon(type)` (linea 3855)
**Scopo:** Crea L.divIcon colorato per tipo
**Return:** Leaflet divIcon 24x24px

#### `renderCatchMarkers()` (linea 3872)
**Scopo:** Disegna marker catture su mappa
**Comportamento:**
- Rimuove marker esistenti
- Applica filtri tipo/specie
- Marker incompleti: click apre direttamente `editCatch()` (no popup)
- Marker completi: click apre popup con dettagli + pulsante "Modifica"

#### `handleSpeciesChange(value)` (linea 3904)
**Scopo:** Gestisce selezione specie nel dialog
**Comportamento:** Se `_custom_` selezionato, mostra campo input per nome specie

---

### Zone Poligonali

Il sistema supporta la registrazione catture anche all'interno dei campi di gara:
```javascript
zonePolygon.on('click', function(e) {
    if (catchLogActive) {
        quickSaveCatch(e.latlng.lat, e.latlng.lng, 'manual');
    }
});
```

---

### Lista Sidebar

#### `renderCatchList()` (linea 3929)
**Scopo:** Aggiorna lista catture in sidebar
**Comportamento:**
- Applica filtri
- Mostra empty state se nessuna cattura
- Item cliccabili per navigare

#### `applyCatchFilters()` (linea 3988)
**Scopo:** Applica filtri e aggiorna vista

#### `updateCatchStats()` (linea 3994)
**Scopo:** Aggiorna contatori oggi/totale

#### `goToCatch(catchId)` (linea 4006)
**Scopo:** Centra mappa su cattura e apre popup

#### `deleteCatch(catchId)` (linea 4018)
**Scopo:** Elimina cattura con conferma

---

### Export

#### `exportCatchesJSON()` (linea 4030)
**Scopo:** Scarica catture in formato JSON
**File:** `catches_YYYY-MM-DD.json`

#### `exportCatchesCSV()` (linea 4038)
**Scopo:** Scarica catture in formato CSV
**Colonne:** ID, Tipo, Data/Ora, Lat, Lng, Specie, Peso, Profondita, Esca, Meteo, Note

---

## ELEMENTI DOM

### Sidebar Section (linee 1489-1547)
```html
<div class="sidebar-section">
    <h3><i class="fas fa-fish"></i> Catch Log</h3>

    <div class="catch-controls">
        <button id="catchModeBtn">Registra</button>
        <button>GPS</button>
    </div>

    <div id="catchStats" class="catch-stats">
        <span id="todayCount">0</span> Oggi
        <span id="totalCount">0</span> Totale
    </div>

    <select id="catchFilterType">...</select>
    <select id="catchFilterSpecies">...</select>

    <div id="catchListContainer">...</div>

    <button onclick="exportCatchesJSON()">JSON</button>
    <button onclick="exportCatchesCSV()">CSV</button>
</div>
```

---

## STILI CSS (linee 917-1159)

### Marker Cattura
```css
.catch-marker-icon {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 10px;
    border: 2px solid white;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
}
```

### Dialog Cattura
```css
.catch-dialog-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
}

.catch-dialog {
    background: #1e293b;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    max-height: 90vh;
    overflow-y: auto;
}
```

---

## API ESTERNE

### Geolocation API
**Metodo:** `navigator.geolocation.getCurrentPosition()`
**Opzioni:**
```javascript
{
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 60000
}
```

---

## PERSISTENZA

### localStorage

**Catture:**
- **Key:** `bathyExplorerCatches`
- **Formato:** JSON array di oggetti cattura
- **Limite:** ~5MB (dipende dal browser)

**Specie personalizzate:**
- **Key:** `bathyExplorerCustomSpecies`
- **Formato:** JSON array di stringhe (nomi specie)
- **Esempio:** `["Orata", "Sarago", "Pagello"]`

---

## MARKER COLORS

| Tipo | Colore | Icona | Hex |
|------|--------|-------|-----|
| Strike | Arancione | fa-bolt | #f59e0b |
| Rilascio | Verde | fa-fish | #22c55e |
| Avvistamento | Blu | fa-eye | #3b82f6 |
| Cattura Pesata | Rosso | fa-weight-hanging | #ef4444 |

---

## TEST

**File test:** `test_catch_log.py`
**Risultato:** Tutti i test superati (2026-01-14)

Verifiche eseguite:
- Sezione HTML presente
- Pulsanti funzionanti
- Dialog apertura/chiusura
- Salvataggio in localStorage
- Marker su mappa
- Lista con filtri
- Statistiche corrette
- Nessun errore JavaScript
