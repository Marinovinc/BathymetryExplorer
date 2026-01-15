# Documentazione Tecnica - Creazione Campi di Gara
**Versione:** 1.3.0
**Data:** 2026-01-14
**File:** index.html

---

## PANORAMICA

Funzionalita per creare campi di gara da coordinate centrali e raggio, con supporto per cerchi completi e semicerchi orientati verso l'oceano.

---

## FUNZIONI JAVASCRIPT

### showCreateZoneDialog()
**Linea:** ~2743
**Descrizione:** Apre il dialog modale per la creazione di un nuovo campo

```javascript
function showCreateZoneDialog() {
    const center = map.getCenter();
    // Crea overlay modale con form
    // Campi: nome, torneo, lat, lng, raggio, unita (nm/km), tipo, colore
}
```

**Form fields:**
- `#newZoneName` - Nome del campo
- `#newZoneTournament` - Nome torneo
- `#newZoneLat` - Latitudine centro
- `#newZoneLng` - Longitudine centro
- `#newZoneRadius` - Raggio numerico
- `#newZoneUnit` - Unita: nm (miglia nautiche) o km
- `#newZoneType` - Tipo: circle, semicircle_ocean, semicircle_south
- `#newZoneColor` - Colore del campo (#hex)

---

### generateCirclePolygon(centerLat, centerLng, radiusNm, type, numPoints)
**Linea:** ~2857
**Descrizione:** Genera array di vertici per un poligono circolare

**Parametri:**
| Nome | Tipo | Default | Descrizione |
|------|------|---------|-------------|
| centerLat | number | - | Latitudine centro |
| centerLng | number | - | Longitudine centro |
| radiusNm | number | - | Raggio in miglia nautiche |
| type | string | 'circle' | Tipo: 'circle', 'semicircle_ocean', 'semicircle_south' |
| numPoints | number | 36 | Numero punti per cerchio completo |

**Ritorna:** `Array<{lat: number, lng: number}>`

**Algoritmo:**
```javascript
// Conversione nm -> km
const radiusKm = radiusNm * 1.852;

// Calcolo offset (approssimazione sferica)
// 1 grado lat = ~111.32 km
const latOffset = radiusKm / 111.32;
// 1 grado lng varia con la latitudine
const lngOffset = radiusKm / (111.32 * Math.cos(centerLat * Math.PI / 180));

// Per ogni punto del cerchio
for (let i = 0; i < numPoints; i++) {
    const angle = startAngle + (i / numPoints) * (endAngle - startAngle);
    vertices.push({
        lat: centerLat + latOffset * Math.sin(angle),
        lng: centerLng + lngOffset * Math.cos(angle)
    });
}
```

**Tipi di zona:**
| Tipo | Angolo Start | Angolo End | Punti | Descrizione |
|------|--------------|------------|-------|-------------|
| circle | 0 | 2*PI | 36 | Cerchio completo |
| semicircle_ocean | PI/2 | 3*PI/2 | 18 | Semicerchio verso ovest (oceano) |
| semicircle_south | PI | 2*PI | 18 | Semicerchio verso sud |

---

### createZoneFromDialog()
**Linea:** ~2908
**Descrizione:** Crea la zona dal form e la aggiunge alla mappa

**Flusso:**
1. Legge valori dal form
2. Valida input (nome, torneo, coordinate, raggio)
3. Converte raggio in nm se necessario
4. Chiama `generateCirclePolygon()`
5. Crea oggetto zona con struttura ZONES_DATA
6. Aggiunge a `ZONES_DATA`
7. Aggiorna dropdown
8. Chiude dialog
9. Chiama `loadZone()` per visualizzare

**Struttura zona creata:**
```javascript
{
    id: 'zona-1705236000000',  // timestamp
    name: 'Test Quepos 50nm',
    tournament: 'Test Tournament',
    year: 2026,
    gatheringPoint: {
        lat: 9.4264,
        lng: -84.1728,
        name: 'Centro Test Quepos 50nm'
    },
    vertices: [
        { lat: ..., lng: ... },
        // 18-36 vertici
    ],
    color: '#8b5cf6',
    createdAt: '2026-01-14T...'
}
```

---

## COSTANTI E FORMULE

### Conversione unita
```javascript
1 nm = 1.852 km
1 grado latitudine = 111.32 km
1 grado longitudine = 111.32 * cos(lat) km
```

### Calcolo offset geografico
```javascript
latOffset = radiusKm / 111.32
lngOffset = radiusKm / (111.32 * cos(lat * PI / 180))
```

---

## TEST EFFETTUATI

### Test Quepos (Marina Pez Vela)
**Coordinate:** 9.4264, -84.1728
**Raggio:** 50 nm
**Tipo:** semicircle_ocean

**Risultato:** 21 vertici generati, semicerchio corretto verso ovest (Pacifico)

**Screenshot:** `screenshots/test_quepos_zone.png`

---

## DIPENDENZE

- **Leaflet.js** - Libreria mappe
- **ZONES_DATA** - Array globale zone (zones_data.js)
- **loadZone()** - Funzione esistente per visualizzare zona

---

---

## EDITING CENTRO CAMPO

### showEditCenterDialog()
**Linea:** ~2985
**Descrizione:** Apre dialog per modificare centro di campi creati con centro+raggio

**Requisiti:**
- Campo deve avere `centerMeta` (creato con centro+raggio)
- Campi senza `centerMeta` devono usare editing vertici standard

### addCenterEditMarker(lat, lng)
**Linea:** ~3115
**Descrizione:** Aggiunge marker viola draggabile al centro della zona

**Caratteristiche:**
- Marker draggabile con icona crosshairs
- Preview del poligono durante il drag (tempo reale)
- Coordinate aggiornate nel dialog durante il drag
- Toast notification quando il drag termina

### applyCenterEdit()
**Linea:** ~3209
**Descrizione:** Applica le modifiche dal dialog

**Flusso:**
1. Legge coordinate/raggio/tipo dal dialog
2. Rigenera vertici con `generateCirclePolygon()`
3. Aggiorna ZONES_DATA
4. Ridisegna zona sulla mappa
5. Chiude dialog

### clearCenterEditMarker(clearZoneId)
**Linea:** ~3173
**Descrizione:** Rimuove marker editing e opzionalmente resetta zona ID

**Parametri:**
- `clearZoneId` (boolean, default false): se true, resetta anche editingCenterZoneId

---

## TEST EDITING

### test_edit_center.py
Test Playwright per editing centro:
1. Crea campo Quepos 30nm
2. Apre dialog "Sposta Centro"
3. Modifica lat +0.5° e raggio a 40nm
4. Applica e verifica

**Risultato:** PASSED

---

## MIGLIORAMENTI FUTURI

1. Supporto per ellissi (raggio X e Y diversi)
2. Orientamento semicerchio personalizzabile (angolo)
3. Export zona singola in JSON
4. Import zona da coordinate GPS (GPX/KML)
