# DOCUMENTAZIONE TECNICA - EDITING AVANZATO v1.5
**Data:** 2026-01-14
**File principale:** `index.html`
**Versione:** 1.5.0

---

## INDICE

1. [Architettura Generale](#architettura-generale)
2. [Variabili Globali](#variabili-globali)
3. [Funzioni Principali](#funzioni-principali)
4. [Strutture Dati](#strutture-dati)
5. [Eventi e Handler](#eventi-e-handler)
6. [Storage e Persistenza](#storage-e-persistenza)
7. [Riferimenti Linee Codice](#riferimenti-linee-codice)

---

## ARCHITETTURA GENERALE

```
┌─────────────────────────────────────────────────────────────┐
│                    MAPPA LEAFLET                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ zonePolygon │  │ Marker      │  │ Marker Editing      │  │
│  │ (poligono)  │  │ Normali     │  │ (durante editing)   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│                   │             │  │                       │
│                   │ gathering   │  │ centerEditMarker     │
│                   │ Marker      │  │ gatheringEditMarker  │
│                   │ (verde)     │  │ vertexEditMarkers[]  │
│                   │             │  │                       │
│                   │ zoneCenter  │  └───────────────────────┘
│                   │ Marker      │
│                   │ (viola)     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                     ZONES_DATA[]                            │
│  Array di oggetti zona con:                                 │
│  - id, name, tournament, year                               │
│  - vertices[] (array coordinate)                            │
│  - gatheringPoint {lat, lng, name}                          │
│  - centerMeta {lat, lng, radiusNm, type, unit}             │
│  - color, isUserCreated                                     │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    localStorage                             │
│  Key: 'bathyExplorerUserZones'                             │
│  Value: JSON array di zone con isUserCreated=true          │
└─────────────────────────────────────────────────────────────┘
```

---

## VARIABILI GLOBALI

### Marker Editing (linee 3346-3350)

```javascript
var centerEditMarker = null;      // Marker centro draggabile (viola, crosshairs)
var editingCenterZoneId = null;   // ID zona attualmente in editing
var vertexEditMarkers = [];       // Array marker vertici draggabili
var directEditPanel = null;       // Pannello floating salva/annulla
var gatheringEditMarker = null;   // Marker punto di raduno draggabile (verde, bandiera)
```

### Marker Normali (linee ~2700)

```javascript
var zonePolygon = null;           // Poligono Leaflet della zona
var gatheringMarker = null;       // Marker punto raduno (NON editing)
var zoneCenterMarker = null;      // Marker centro (NON editing)
```

### Dati

```javascript
var ZONES_DATA = [];              // Array zone (caricato da zones_data.js + localStorage)
```

---

## FUNZIONI PRINCIPALI

### Creazione Forme Geometriche

#### `generateCirclePolygon(lat, lng, radiusNm, type)` (linee 3057-3169)

Genera array di vertici per diverse forme geometriche.

**Parametri:**
- `lat` (number): Latitudine centro
- `lng` (number): Longitudine centro
- `radiusNm` (number): Raggio in miglia nautiche
- `type` (string): Tipo forma

**Tipi supportati:**

| Tipo | Descrizione | Vertici |
|------|-------------|---------|
| `circle` | Cerchio completo | 36 |
| `semicircle_north` | Semicerchio verso nord | 19 |
| `semicircle_south` | Semicerchio verso sud | 19 |
| `semicircle_east` | Semicerchio verso est | 19 |
| `semicircle_west` | Semicerchio verso ovest | 19 |
| `square` | Quadrato | 4 |
| `rectangle_ns` | Rettangolo allungato N-S | 4 |
| `rectangle_ew` | Rettangolo allungato E-O | 4 |
| `triangle_north` | Triangolo punta nord | 3 |
| `triangle_south` | Triangolo punta sud | 3 |

**Ritorna:** `Array<{lat: number, lng: number}>`

**Esempio:**
```javascript
const vertices = generateCirclePolygon(40.75, 14.0, 10, 'square');
// Ritorna 4 vertici che formano un quadrato di 10nm di lato
```

---

### Editing Centro e Raduno

#### `enableDirectCenterDrag(zone)` (linee 3353-3380)

Attiva la modalità editing per una zona.

**Azioni:**
1. Imposta `editingCenterZoneId`
2. Chiama `addCenterEditMarker()` - marker centro viola
3. Chiama `addGatheringEditMarker()` - marker raduno verde (se esiste)
4. Chiama `showDirectEditPanel()` - pannello floating
5. Chiama `showZoneArea()` - mostra misure iniziali

---

#### `addGatheringEditMarker(lat, lng, name)` (linee 3620-3673)

Crea marker trascinabile per il punto di raduno.

**Parametri:**
- `lat` (number): Latitudine iniziale
- `lng` (number): Longitudine iniziale
- `name` (string): Nome punto raduno (per tooltip)

**Caratteristiche:**
- Icona: cerchio verde con bandiera bianca
- Dimensioni: 32x32px
- zIndexOffset: 900
- Tooltip: "Trascina: {name}"

**Eventi:**
- `drag`: Aggiorna `zone.gatheringPoint` in tempo reale
- `dragend`: Mostra toast "Raduno spostato"

---

#### `addCenterEditMarker(lat, lng)` (linee 3676-3729)

Crea marker trascinabile per il centro geometrico.

**Caratteristiche:**
- Icona: cerchio viola con crosshairs bianco
- Dimensioni: 36x36px
- zIndexOffset: 1000
- Tooltip: "Trascina per spostare il centro"

**Eventi:**
- `drag`: Aggiorna input dialog + chiama `updateZonePreview()`
- `dragend`: Mostra toast coordinate

---

#### `addVertexEditMarkers()` (linee 3732-3809)

Crea marker draggabili su tutti i vertici della zona.

**Per ogni vertice:**
- Icona: cerchio colorato (colore zona) con bordo viola
- Dimensioni: 16x16px
- zIndexOffset: 500

**Eventi:**
- `drag`: Chiama `handleVertexDrag(index, lat, lng)`
- Click: Se `deleteVertexMode` checked, chiama `handleVertexDelete(index)`

---

### Eliminazione Vertici

#### `toggleDeleteMode(enabled)` (linee 3844-3862)

Attiva/disattiva modalità eliminazione vertici.

**Parametri:**
- `enabled` (boolean): true = modalità eliminazione attiva

**Effetti visivi:**
- `enabled=true`: bordo rosso, cursore crosshair, toast warning
- `enabled=false`: bordo viola, cursore grab, toast info

---

#### `handleVertexDelete(index)` (linee 3863-3893)

Elimina un vertice dal poligono.

**Parametri:**
- `index` (number): Indice vertice da eliminare

**Logica:**
1. Verifica minimo 3 vertici (altrimenti toast errore)
2. Rimuove vertice da `zone.vertices`
3. Chiama `addVertexEditMarkers()` per ridisegnare
4. Chiama `drawTournamentZone()` per aggiornare poligono
5. Chiama `showZoneArea()` per aggiornare misure

---

### Salvataggio e Cancellazione

#### `saveDirectEdit()` (linee 3438-3471)

Salva le modifiche dell'editing.

**Azioni:**
1. Salva posizione raduno da `gatheringEditMarker.getLatLng()`
2. Salva posizione centro da `centerEditMarker.getLatLng()`
3. Chiama `saveUserZones()` per persistenza
4. Chiama `clearCenterEditMarker(true)` per cleanup
5. Rimuove `directEditPanel`
6. Chiama `drawTournamentZone()` per ridisegnare

---

#### `cancelDirectEdit()` (linee 3473-3488)

Annulla le modifiche.

**Azioni:**
1. Chiama `clearCenterEditMarker(true)` per cleanup
2. Rimuove `directEditPanel`
3. Chiama `drawTournamentZone()` con dati originali

---

#### `clearCenterEditMarker(clearZoneId)` (linee 3897-3916)

Rimuove tutti i marker di editing dalla mappa.

**Parametri:**
- `clearZoneId` (boolean): Se true, resetta anche `editingCenterZoneId`

**Rimuove:**
- `centerEditMarker` (viola)
- `gatheringEditMarker` (verde)
- Tutti i `vertexEditMarkers[]`

---

### Eliminazione Campo

#### `deleteSelectedZone()` (linee 2617-2659)

Elimina completamente un campo di gara.

**Flusso:**
1. Conferma utente con `confirm()`
2. Se in editing sulla zona, chiama `clearCenterEditMarker(true)` e rimuove panel
3. Chiama `clearTournamentZone()` - rimuove marker normali
4. Rimuove da `ZONES_DATA`
5. Chiama `saveUserZones()` per persistenza
6. Aggiorna dropdown

---

#### `clearTournamentZone()` (linee 2787-2800)

Rimuove marker normali dalla mappa.

**Rimuove:**
- `zonePolygon` (poligono)
- `gatheringMarker` (bandiera verde normale)
- `zoneCenterMarker` (centro viola normale)

---

### Calcolo Area

#### `showZoneArea(zone)` (linee 4200-4275)

Calcola e mostra l'area di una zona.

**Algoritmo:** Formula Shoelace con proiezione equirettangolare

**Aggiorna:**
- `#rulerAreaNmSq` - area in nm²
- `#rulerAreaKmSq` - area in km²
- `#editAreaNm` - pannello editing nm²
- `#editAreaKm` - pannello editing km²

---

## STRUTTURE DATI

### Oggetto Zona

```javascript
{
    id: 'unique-id-string',           // Identificativo univoco
    name: 'Nome Campo',               // Nome visualizzato
    tournament: 'Nome Torneo',        // Torneo di appartenenza
    year: 2026,                       // Anno
    description: 'Descrizione',       // Opzionale

    vertices: [                       // Array vertici poligono
        { lat: 40.75, lng: 14.0 },
        { lat: 40.80, lng: 14.1 },
        // ...
    ],

    gatheringPoint: {                 // Punto di raduno
        lat: 40.75,
        lng: 14.0,
        name: 'Centro / Punto Raduno'
    },

    centerMeta: {                     // Metadati centro (se creato da centro+raggio)
        lat: 40.75,
        lng: 14.0,
        radiusNm: 10,
        type: 'square',               // Tipo forma
        unit: 'nm'                    // Unità raggio
    },

    color: '#8b5cf6',                 // Colore poligono
    isUserCreated: true               // true = creato dall'utente (salvato in localStorage)
}
```

---

## EVENTI E HANDLER

### Click su Marker Centro (zona normale)

```javascript
zoneCenterMarker.on('click', function() {
    enableDirectCenterDrag(zone);  // Attiva editing
});
```

### Click su Vertice (in editing)

```javascript
markerElement.addEventListener('click', function(e) {
    const deleteMode = document.getElementById('deleteVertexMode');
    if (deleteMode && deleteMode.checked) {
        e.stopPropagation();
        e.preventDefault();
        handleVertexDelete(index);
    }
});
```

### Drag Marker Raduno

```javascript
gatheringEditMarker.on('drag', function(e) {
    const latlng = e.target.getLatLng();
    zone.gatheringPoint.lat = latlng.lat;
    zone.gatheringPoint.lng = latlng.lng;
});
```

### Drag Marker Vertice

```javascript
marker.on('drag', function(e) {
    const latlng = e.target.getLatLng();
    handleVertexDrag(index, latlng.lat, latlng.lng);
});
```

---

## STORAGE E PERSISTENZA

### localStorage Key

```
'bathyExplorerUserZones'
```

### Funzione Salvataggio

```javascript
function saveUserZones() {
    const userZones = ZONES_DATA.filter(z => z.isUserCreated === true);
    localStorage.setItem('bathyExplorerUserZones', JSON.stringify(userZones));
}
```

### Caricamento (all'avvio)

```javascript
function loadUserZones() {
    const saved = localStorage.getItem('bathyExplorerUserZones');
    if (saved) {
        const userZones = JSON.parse(saved);
        userZones.forEach(z => {
            if (!ZONES_DATA.find(existing => existing.id === z.id)) {
                ZONES_DATA.push(z);
            }
        });
    }
}
```

---

## RIFERIMENTI LINEE CODICE

### Variabili Globali
| Variabile | Linea | Descrizione |
|-----------|-------|-------------|
| `centerEditMarker` | 3346 | Marker centro editing |
| `editingCenterZoneId` | 3347 | ID zona in editing |
| `vertexEditMarkers` | 3348 | Array marker vertici |
| `directEditPanel` | 3349 | Pannello floating |
| `gatheringEditMarker` | 3350 | Marker raduno editing |

### Funzioni Editing
| Funzione | Linea | Descrizione |
|----------|-------|-------------|
| `enableDirectCenterDrag()` | 3353 | Attiva editing |
| `showDirectEditPanel()` | 3382 | Mostra pannello |
| `saveDirectEdit()` | 3438 | Salva modifiche |
| `cancelDirectEdit()` | 3473 | Annulla |
| `addGatheringEditMarker()` | 3620 | Crea marker raduno |
| `addCenterEditMarker()` | 3676 | Crea marker centro |
| `addVertexEditMarkers()` | 3732 | Crea marker vertici |
| `toggleDeleteMode()` | 3844 | Toggle eliminazione |
| `handleVertexDelete()` | 3863 | Elimina vertice |
| `clearCenterEditMarker()` | 3897 | Cleanup marker |

### Funzioni Zone
| Funzione | Linea | Descrizione |
|----------|-------|-------------|
| `saveUserZones()` | 2611 | Salva su localStorage |
| `deleteSelectedZone()` | 2617 | Elimina zona |
| `clearTournamentZone()` | 2787 | Rimuove marker normali |
| `generateCirclePolygon()` | 3057 | Genera vertici forma |

### UI Elementi
| Elemento | Linea | Descrizione |
|----------|-------|-------------|
| Dropdown forme | 3010-3021 | Select tipo forma |
| Checkbox elimina | 3411-3413 | Modalità eliminazione |
| Display area | 3408-3410 | Misure nel pannello |

---

## CSS CLASSI MARKER

```css
.zone-center-marker     /* Centro normale (cliccabile per editing) */
.center-edit-marker     /* Centro editing (viola, draggable) */
.gathering-edit-marker  /* Raduno editing (verde, draggable) */
.vertex-edit-marker     /* Vertice editing (draggable) */
.gathering-marker-wrapper /* Raduno normale */
```

---

**Fine Documentazione Tecnica**
