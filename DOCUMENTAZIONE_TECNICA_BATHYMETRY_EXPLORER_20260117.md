# DOCUMENTAZIONE TECNICA - FISHINGTOOLS BathymetryExplorer PWA

**Versione:** 2.4.3
**Data:** 2026-04-09
**Autore:** Claude Code (Opus 4)
**File principale:** `index.html`
**Repository:** https://github.com/Marinovinc/BathymetryExplorer
**GitHub Pages:** https://marinovinc.github.io/BathymetryExplorer/
**Service Worker cache:** v2.4.3

---

## INDICE

1. [Architettura Generale](#1-architettura-generale)
2. [Mappa e Layer](#2-mappa-e-layer)
3. [OWC 2026 - Punti Pesca e Rotte](#3-owc-2026---punti-pesca-e-rotte)
4. [Zone Torneo](#4-zone-torneo)
5. [Righello (Misura Distanze)](#5-righello-misura-distanze)
6. [Catch Log (Registro Catture)](#6-catch-log-registro-catture)
7. [Luoghi Preferiti](#7-luoghi-preferiti)
8. [GPS Tracking e Rotte](#8-gps-tracking-e-rotte)
9. [Layer Meteo e Oceanografici](#9-layer-meteo-e-oceanografici)
10. [Service Worker e Offline](#10-service-worker-e-offline)
11. [Guida Utente](#11-guida-utente)
12. [LocalStorage](#12-localstorage)
13. [Cronologia Commit](#13-cronologia-commit)

---

## 1. ARCHITETTURA GENERALE

### Stack Tecnologico
- **Frontend:** HTML5 + CSS3 + JavaScript vanilla (singolo file `index.html`)
- **Mappa:** Leaflet.js
- **API Meteo:** Open-Meteo (vento, onde), PacIOOS (SST), Copernicus (clorofilla)
- **API Batimetria:** GEBCO, EMODnet, BlueTopo, ETOPO, NOAA, Esri
- **Isobate:** ArcGIS GEBCO_contours tiles (globale) + GeoJSON locale (1000m/2000m)
- **Geocoding:** Nominatim (OpenStreetMap)
- **Storage:** localStorage (browser)
- **PWA:** Service Worker con cache offline (tile + app shell)
- **Hosting:** GitHub Pages

### Struttura File
```
D:/Dev/BathymetryExplorer/
├── index.html                       # App principale (tutto-in-uno, ~11000 righe)
├── guide.html                       # Guida utente (18 sezioni)
├── sw.js                            # Service Worker (cache offline)
├── manifest.json                    # PWA manifest
├── zones_data.js                    # Dati zone torneo predefinite
├── isobaths_1000_2000.geojson       # Isobate profonde colorate (rosso/viola)
├── icons/                           # Icone layer e UI
├── screenshots/                     # Screenshot per debug/test
├── docs/                            # Documentazione
├── DOCUMENTAZIONE_TECNICA_*.md      # Doc tecniche per sessione
└── HANDOVER_SESSIONE_*.md           # Handover per continuita'
```

### Centro Mappa Default
Quepos, Costa Rica (9.43, -84.16) — sede OWC 2026.

---

## 2. MAPPA E LAYER

### Layer Batimetrici
| Layer ID | Descrizione | Provider | Copertura |
|----------|-------------|----------|-----------|
| `layerBathy` | Batimetria base | EMODnet WMS | Europa |
| `layerBathyHR` | Batimetria alta risoluzione | EMODnet HR WMS | Europa |
| `layerGEBCO` | GEBCO 2024 Global | GEBCO WMS | Globale |
| `layerBlueTopo` | BlueTopo navigazionale | NOAA | USA |
| `layerETOPO` | Esri Ocean Base | Esri World Ocean | Globale |
| `layerOceanRef` | Etichette profondita' | CartoDB | Globale |
| `layerContours` | Isobate (linee profondita') | ArcGIS GEBCO tiles | **Globale** |
| `layerDeepContours` | Isobate 1000m (rosso) / 2000m (viola) | GeoJSON locale | Globale |

**IMPORTANTE:** `contoursLayer` (isobate GEBCO) ha copertura **globale** — NON viene disattivato fuori dall'Europa. Usava `setupLayerToggleWithCoverage` per errore — corretto in v2.4.3.

### Layer di default attivi all'avvio
- GEBCO 2024 WMS (`gebcoLayer`)
- Esri Ocean Base (`esriOceanLayer`)
- Isobate GEBCO (`contoursLayer`) — checkbox `checked`
- Isobate profonde 1000/2000m (`deepContoursLayer`) — checkbox `checked`
- Segnali nautici (`seamarkLayer`)

### Auto-switch Europa/Globale
`checkActiveLayers()` (triggerata su `moveend`) disattiva automaticamente i layer solo-Europa (EMODnet, MPA) quando la mappa esce dall'area europea, attivando Esri Ocean come sostituto. Le isobate GEBCO restano sempre attive.

### Layer Meteo e Oceanografici
| Layer ID | Descrizione | API |
|----------|-------------|-----|
| `layerSST` | Sea Surface Temperature | PacIOOS WMS |
| `layerChlorophyll` | Clorofilla | Copernicus WMS |
| `layerCurrents` | Correnti marine | Open-Meteo |
| `layerWaves` | Onde | Open-Meteo |
| `layerWindArrows` | Vento (frecce statiche) | Open-Meteo |
| `layerWindAnimation` | Vento (animazione particelle) | Open-Meteo |

### Layer POI/Base
| Layer ID | Descrizione |
|----------|-------------|
| `layerSeamarks` | Segnali marittimi (OpenSeaMap) |
| `layerHarbours` | Porti |
| `layerMPA` | Aree Marine Protette (solo Europa) |
| `layerSatellite` | Immagini satellitari (Esri World Imagery) |

---

## 3. OWC 2026 - PUNTI PESCA E ROTTE

### Fishing Spots
Layer `fishingSpots` (L.layerGroup) con marker personalizzati per OWC 2026 Quepos:
- **Marina Pez Vela** — partenza, icona verde
- **The Corner** — spot chiave Sailfish/Marlin, icona arancione
- **The Furuno Bank** — spot sonda, icona blu
- **Quepos Canyon** — spot profondo, icona rossa
- Altri spot OWC con profondita', coordinate, specie target

### Rotte
- `routeCornerFuruno` — rotta da porto a The Corner + Furuno Bank
- `routeLa26` — rotta alternativa La 26

### Cerchio 50 Miglia Nautiche
`owcLimitCircle` — cerchio L.circle centrato su Marina Pez Vela, raggio 92.600m (50NM), visualizza il limite di pesca OWC. Interattivo (click forwarding a righello/catchLog).

### Toggle OWC
Sezione sidebar "OWC 2026" con checkbox per:
- Spots pesca (on/off, con possibilita' di nascondere singoli spot)
- Rotte
- Cerchio 50NM

### Nascondi/Mostra Spot Individuali
Ogni popup spot ha un pulsante "Nascondi questo spot" in cima. Gli spot nascosti sono persistiti in `localStorage` (`bathyHiddenSpots`). Pulsante "Mostra tutti" nella sidebar per ripristinare.

---

## 4. ZONE TORNEO

### Tipi
- Zone predefinite in `zones_data.js` (cerchi con centro + raggio)
- Zone custom create dall'utente (persistite in localStorage)

### Click Forwarding
I poligoni/cerchi delle zone intercettano i click. Se `rulerActive` o `catchLogActive` sono true, il click viene inoltrato a `addRulerPoint()` o `quickSaveCatch()` rispettivamente, evitando che i popup blocchino l'uso degli strumenti.

Stessa logica applicata a `owcLimitCircle`, `routeCornerFuruno`, `routeLa26`.

---

## 5. RIGHELLO (MISURA DISTANZE)

### Attivazione
Pulsante nella sidebar, setta `rulerActive = true`. I click sulla mappa (incluso sopra zone/rotte/cerchio 50NM) aggiungono punti. Mostra distanza cumulativa in miglia nautiche.

### Funzioni chiave
- `toggleRuler()` — attiva/disattiva
- `addRulerPoint(latlng)` — aggiunge punto con polyline e label distanza
- `clearRuler()` — cancella tutti i punti

---

## 6. CATCH LOG (REGISTRO CATTURE)

### Specie
Specie target Quepos precaricate: Sailfish, Blue/Black/Striped Marlin, Yellowfin Tuna, Mahi-Mahi, Wahoo, Roosterfish, Snapper, Grouper. Supporto specie custom via `bathyExplorerCustomSpecies`.

### Funzionalita'
- Click sulla mappa per segnare punto cattura
- Form per specie, peso, note
- Esportazione dati
- Integrazione WhatsApp per condivisione

### localStorage
- `bathyExplorerCatches` — array catture
- `bathyExplorerCustomSpecies` — specie personalizzate
- `bathyExplorerWhatsAppNumber` — numero WhatsApp
- `bathyExplorerWhatsAppEnabled` — flag attivazione

---

## 7. LUOGHI PREFERITI

### Luoghi Default
Quepos (Costa Rica), Ischia (Italia), Big Game Forio 2026.

### Salvataggio
`bathyExplorerFavorites` in localStorage. Bottoni nella sidebar con possibilita' di aggiungere/rimuovere.

### Funzioni
- `goToPlace(lat, lng, name)` — naviga con flyTo
- `searchPlace()` — geocoding Nominatim
- `goToCoordinates()` — input manuale lat/lng
- `renderFavoritePlaces()` — rendering bottoni

---

## 8. GPS TRACKING E ROTTE

### Funzionalita'
- Tracking GPS in tempo reale
- Registrazione rotte con salvataggio
- Esportazione GeoJSON di tutte le rotte

### localStorage
- `bathyExplorerRoutes` — rotte GPS salvate

---

## 9. LAYER METEO E OCEANOGRAFICI

### Vento - Open-Meteo API
```javascript
// Endpoint: https://api.open-meteo.com/v1/forecast
// Parametri: wind_speed_10m, wind_direction_10m
// Frecce SVG con colore basato su velocita'
```

### SST - PacIOOS WMS
```javascript
L.tileLayer.wms('https://pae-paha.pacioos.hawaii.edu/thredds/wms/dhw_5km', {
    layers: 'CRW_SST', format: 'image/png', transparent: true
});
```

---

## 10. SERVICE WORKER E OFFLINE

### File: `sw.js`
- Cache version: `v2.4.3`
- Cache name: `bathyexplorer-v2.4.3`
- Tiles cache: `bathyexplorer-tiles-v2.4.3`

### Strategia caching
- **App shell** (index.html, guide.html, zones_data.js, manifest.json, isobaths GeoJSON): Cache-first
- **Tile mappe** (OSM, ArcGIS, EMODnet, GEBCO, NOAA, PacIOOS): Cache-first, salva in cache al primo download
- **Dati dinamici** (SST, meteo): Network-first

### APP_SHELL cachato
```javascript
const APP_SHELL = [
    './', './index.html', './zones_data.js',
    './manifest.json', './isobaths_1000_2000.geojson', './guide.html'
];
```

### Download offline
- `downloadAreaForOffline()` — scarica tile per area corrente
- `downloadZoneForOffline()` — scarica tile per zona specifica
- `getOfflineCacheSize()` — dimensione cache (chiamata automatica ogni 30s, **silent**)
- `clearOfflineCache()` — pulisce cache tile

### getActiveServiceWorker(silent)
Parametro `silent` (default false):
- `true`: chiamate automatiche passive — nessun toast di errore se SW non disponibile
- `false`: azioni utente esplicite — mostra toast di errore

Risolve il problema del toast "file:// non supportato" che appariva ogni 30 secondi nelle chiamate automatiche di `getOfflineCacheSize()`.

---

## 11. GUIDA UTENTE

### File: `guide.html`
Guida utente completa con 18 sezioni, tema scuro oceanico coerente con l'app. Accessibile tramite pulsante "Guida" nella navbar (header, tra logo e selettore lingua).

### Sezioni
Panoramica, Ricerca, Preferiti, Tornei, Offline, Zone, GPS, Catch Log, Righello, Pesca, Batimetria, Layer Base, Visualizzazione, Legenda, Posizione, Impostazioni, Scorciatoie, Mobile.

---

## 12. LOCALSTORAGE

### Chiavi Utilizzate
| Chiave | Descrizione | Formato |
|--------|-------------|---------|
| `bathyExplorerFavorites` | Luoghi salvati | JSON array |
| `bathyExplorerCompetitionField` | Campo gara attivo | JSON object |
| `bathyExplorerUserZones` | Zone custom utente | JSON array |
| `bathyExplorerCatches` | Registro catture | JSON array |
| `bathyExplorerCustomSpecies` | Specie personalizzate | JSON array |
| `bathyExplorerWhatsAppNumber` | Numero WhatsApp | string |
| `bathyExplorerWhatsAppEnabled` | WhatsApp attivo | 'true'/'false' |
| `bathyExplorerRoutes` | Rotte GPS salvate | JSON |
| `bathyHiddenSpots` | ID spot nascosti | JSON array |

---

## 13. CRONOLOGIA COMMIT

```
b5e9969 fix: keep GEBCO isobaths active outside Europe (global coverage)
73a5218 fix: suppress recurring offline error toast on automatic cache checks
529fedc fix: ruler points now work over tournament zones and OWC circle
9649787 feat: add comprehensive user guide with navbar button
3b77a32 fix: move hide button to top of popup + add maxHeight scroll
330ce4e feat: hide/show individual fishing spots
0fe91e9 feat: add Quepos fish species to Catch Log
1d6a1de fix: replace OWC/Bisbees polygon zones with proper 50NM circles
1c63a23 fix: increase 50NM limit circle visibility
91b4edd feat: add OWC 2026 features (routes, 50NM limit, toggle, spots)
bd72559 feat: add OWC 2026 key spots (The Corner + The Furuno Bank)
d4ad8fc fix: bump SW cache version to force refresh after rollback
d4906b2 feat: add deep isobaths 1000m/2000m + migrate to Quepos Costa Rica
c1165f8 feat: lazy loading + category comments for 198 functions
f5641cb feat: add language selector with Google Translate (10 languages)
173de97 feat: rename app to FISHINGTOOLS Bathymetry Explorer
215cf78 feat: WhatsApp integration for tournament mode
068ec95 feat: coordinate display in DDM format
b03250b feat: crosshair follows sidebar + compass rotation
661229c fix: toggle sidebar mobile + riordino sezioni
527bfc4 feat: BathymetryExplorer PWA v2.0 - Mappe batimetriche offline
```

---

**Fine documentazione tecnica — v2.4.3**
