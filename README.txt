============================================
    BATHYMETRY EXPLORER v2.0
    Mappe Batimetriche per Pesca Sportiva
============================================

TODO PROSSIMA SESSIONE (v2.1.0)
-------------------------------
[ ] Rotazione forme (angolo custom per rettangoli/triangoli)
[ ] Persistenza nome punto raduno quando modificato
[ ] Undo/Redo per modifiche editing
[ ] Export campo singolo come GeoJSON
[ ] Import campo da GeoJSON
[ ] Copia campo esistente come template
[ ] Keyboard shortcuts (Esc=annulla, Enter=salva)

NUOVE FUNZIONALITA v2.0.0 (2026-01-15)
--------------------------------------
[x] MIRINO CENTRALE (Crosshair)
    - Mirino sottilissimo al centro della mappa
    - Visibile durante lo spostamento della mappa (opacity 60%)
    - Quasi invisibile a riposo (opacity 8%) ma percepibile
    - Transizione fluida (0.4s ease-out)
    - Linee bianche sottili con punto centrale
    - Posizionato correttamente considerando la sidebar

[x] SMART BOAT TRACKING
    - La mappa rimane ferma finche la barca e visibile
    - Quando la barca esce dalla viewport, la mappa si ricentra automaticamente
    - Click sulla barca per centrare immediatamente la mappa
    - Tooltip "La tua barca (click per centrare)"
    - Funziona in combinazione con GPS tracking

[x] ROSA DEI VENTI (Compass Rose)
    - Piccola bussola in basso a destra sulla mappa
    - Punta Nord colorata in rosso per orientamento immediato
    - Lettere cardinali: N (rosso), S, E, W
    - Design elegante con sfondo scuro semi-trasparente
    - Hover: effetto ingrandimento
    - Click: mostra conferma "Nord in alto"

NUOVE FUNZIONALITA v1.9.0 (2026-01-15)
--------------------------------------
[x] SEZIONE GARE DEDICATA (nuova nella sidebar)
    - Sezione separata per modalita competizione
    - Pulsante "Avvia Gara" prominente
    - Info e istruzioni visibili prima dell'avvio
    - Help dedicato con guida completa

[x] TOURNAMENT MODE (Modalita Gara)
    - Richiede selezione di un campo di gara obbligatorio
    - Zoom automatico sul campo selezionato
    - Timer durata gara in tempo reale
    - Campo di gara evidenziato con bordo rosso tratteggiato

    ALLARME PROSSIMITA:
    - Monitoraggio GPS continuo durante la gara
    - Avviso giallo quando a <0.5 nm dal confine
    - Avviso rosso lampeggiante se FUORI ZONA
    - Indicatore stato GPS nel pannello gara

    PULSANTE STRIKE:
    - Registrazione istantanea con GPS + ora
    - Usa posizione GPS reale (o centro mappa se non disponibile)
    - Marker giallo con fulmine sulla mappa
    - Click sul marker per completare registrazione

    CONVERSIONE STRIKE → RILASCIO:
    - Seleziona specie da lista italiana (18+ specie)
    - Aggiungi video rilascio (opzionale)
    - Marker diventa verde con pesce
    - Contatori separati Strike/Rilasci

    FINE GARA (3 opzioni):
    - Salva nel Catch Log: integra catture nel log principale
    - Esporta JSON e Chiudi: download file con dati completi
    - Cancella Tutto: elimina dati senza salvare

    STATISTICHE IN TEMPO REALE:
    - Contatore Strike e Rilasci
    - Lista catture con orario e posizione
    - Nome campo di gara visibile

NUOVE FUNZIONALITA v1.8.0 (2026-01-15)
--------------------------------------
[x] ROTTE DEMO NAVIGAZIONE
    - 3 rotte pre-caricate da Forio (caricamento automatico):
      * Forio → Napoli via Procida (blu) - 25.3 nm
      * Forio → Ponza via Ventotene (verde) - 48.2 nm
      * Forio → Sabaudia/Circeo (arancione) - 58.5 nm
    - Rotte realistiche che non incrociano terraferma
    - Partenza da porti reali

[x] TOOLTIP HOVER SULLE ROTTE
    - Passa il mouse sulla rotta per vedere statistiche rapide
    - Mostra: nome, distanza (nm), durata, velocita media (nodi)
    - Effetto highlight: la rotta si ispessisce al passaggio del mouse

[x] POPUP CLICK DETTAGLIATO
    - Click sulla rotta apre popup con statistiche complete:
      * Distanza in nm e km
      * Durata totale
      * Velocita media e massima
      * Numero punti GPS
    - Stile popup scuro coordinato con l'interfaccia

[x] GUIDE DETTAGLIATE PER FUNZIONI
    - 5 pulsanti help (?) aggiuntivi per funzioni complesse
    - Guide passo-passo per ogni funzione

NUOVE FUNZIONALITA v1.7.0 (2026-01-15)
--------------------------------------
[x] SEZIONI SIDEBAR COLLASSABILI
    - Tutte le 13 sezioni della sidebar ora sono collassabili
    - Click sul titolo per espandere/comprimere
    - Le sezioni meno usate partono chiuse per risparmiare spazio
    - Freccia indica lo stato aperto/chiuso

[x] GUIDE INTERATTIVE (?)
    - Pulsante "?" blu accanto a ogni titolo sezione
    - Click apre popup con guida dettagliata
    - Contenuto specifico per ogni funzionalita
    - Suggerimenti pratici per la pesca
    - Chiudi con X o cliccando fuori dal popup

[x] 13 GUIDE DISPONIBILI:
    - Cerca Posizione: come cercare luoghi e coordinate
    - Luoghi Interessanti: gestione preferiti
    - Batimetria: interpretazione layer profondita
    - Layer Pesca: dati oceanografici per trovare pesce
    - Layer Base: segnali nautici e AMP
    - Controlli Display: regolazione opacita e luminosita
    - Righello: misurazione distanze e aree
    - Campi di Gara: gestione zone torneo
    - Gare: modalita competizione e allarme prossimita
    - Catch Log: registro catture in 2 passi
    - GPS Tracking: tracciamento rotta completo
    - Legende: interpretazione colori
    - Posizione: info vista corrente

[x] GUIDE DETTAGLIATE PER FUNZIONI COMPLESSE
    - Ogni guida ora include istruzioni d'uso passo-passo
    - Suggerimenti pratici per situazioni reali
    - 5 pulsanti help (?) aggiuntivi per funzioni specifiche:
      * Nuovo Campo (Centro + Raggio): workflow completo creazione campo
      * Sposta Centro: editing avanzato con vertici
      * Segna Punto: registrazione rapida catture
      * Salva Rotta: salvataggio percorsi GPS
      * Export GPX/GeoJSON: formati e compatibilita

NUOVE FUNZIONALITA v1.6.0 (2026-01-15)
--------------------------------------
[x] GPS TRACKING - Sistema completo di tracciamento rotta
    - Switch on/off per attivare il tracking GPS
    - Icona barca personalizzata che si orienta con la direzione
    - Statistiche real-time: velocita, direzione, distanza, durata
    - Pausa/Riprendi tracking
    - Colore traccia personalizzabile con color picker

[x] GESTIONE ROTTE MULTIPLE
    - Salvataggio rotte con nome e colore personalizzato
    - Limite massimo 10 rotte salvate
    - Visualizzazione multipla: piu rotte contemporaneamente sulla mappa
    - Toggle visibilita per ogni rotta (icona occhio)
    - Ogni rotta mantiene il proprio colore
    - Cancellazione rotte con conferma

[x] EXPORT ROTTE
    - Export GPX con estensione colore (gpx_style)
    - Export GeoJSON con proprieta stroke/stroke-width
    - Export singola rotta o tutte insieme

[x] DEMO NAVIGAZIONE
    - Simulazione percorso Forio -> Campo Gara Big Game
    - Utile per testare il sistema senza GPS reale

NUOVE FUNZIONALITA v1.5.0 (2026-01-14)
--------------------------------------
[x] Checkbox eliminazione vertici - Alternativa al doppio-click
[x] 10 forme geometriche - Cerchio, semicerchi, quadrato, rettangoli, triangoli
[x] Misure nel pannello editing - Area visibile durante drag vertici
[x] Marker punto raduno trascinabile - Separato dal centro geometrico
[x] Fix eliminazione campo - Pulizia completa tutti i marker

FUNZIONALITA v1.4.0 (2026-01-14)
--------------------------------
[x] Selezione centro da mappa - Click sulla mappa per scegliere il centro
[x] Marker centro separato - Viola con crosshairs (diverso dal punto raduno)
[x] Editing vertici con drag - Trascina i pallini sulla circonferenza
[x] Cancellazione vertici - Doppio click per eliminare un vertice
[x] Superficie campo - Mostra area in nm^2 e km^2 invece di distanza
[x] Aggiornamento poligono in tempo reale durante editing
[x] Dialog spostabili - Trascina i popup dalla barra del titolo
[x] Eliminazione campi - Pulsante rosso per rimuovere campi creati dall'utente
[x] Persistenza campi utente - I campi creati vengono salvati in localStorage

DOCUMENTAZIONE TECNICA
----------------------
>>> SESSIONE v1.5.0 (Editing Avanzato) <<<

- HANDOVER_SESSIONE_EDITING_AVANZATO_20260114.md
  Riepilogo sessione con CONFESSIONE ERRORI, modifiche, test eseguiti

- DOCUMENTAZIONE_TECNICA_EDITING_AVANZATO_20260114.md
  Riferimento completo: variabili globali, funzioni, strutture dati,
  eventi, storage, riferimenti linee codice

>>> SESSIONE v1.3-1.4 (Righello e Zone) <<<

- HANDOVER_SESSIONE_BATHYMETRY_RULER_20260114.md
  Riepilogo sessione righello con errori commessi e stato funzionalita

- DOCUMENTAZIONE_TECNICA_RIGHELLO_20260114.md
  Riferimento completo righello: variabili, funzioni, API, strutture dati

- DOCUMENTAZIONE_TECNICA_CATCH_LOG_20260114.md
  Riferimento completo catch log: struttura dati, funzioni, costanti

- DOCUMENTAZIONE_ZONE_CREATION_20260114.md
  Riferimento creazione campi da centro + raggio (v1.3)

INSTALLAZIONE
-------------
1. Estrai lo ZIP in una cartella qualsiasi
2. Apri index.html con il tuo browser (Chrome, Firefox, Safari, Edge)

Funziona su: Windows, macOS, Linux

CONTENUTO
---------
- index.html    : Applicazione principale
- zones_data.js : Dati campi di gara (modificabile)
- screenshots/  : Screenshot test Playwright

FUNZIONALITA
------------
- 6 layer batimetrici (EMODnet, GEBCO, NOAA, Esri...)
- Temperatura mare (SST), Clorofilla, Correnti, Onde, Vento
- Ricerca luoghi e coordinate GPS
- Preferiti salvati nel browser
- Campi di gara con zone e punti di raduno
- Export dati in JSON

RIGHELLO AVANZATO (v1.1.0)
--------------------------
- Misurazione distanze multipoint con preview tempo reale
- Visualizzazione miglia nautiche (nm) e km
- Chiusura poligono automatica cliccando sul primo punto
- Dialog salvataggio con auto-rilevamento luogo (geocoding)
- Modalita editing: trascina i punti per aggiustare posizioni
- Modifica campi salvati con drag dei vertici

CATCH LOG (v1.2.0)
------------------
Sistema di registrazione catture con workflow semplificato:

WORKFLOW IN 2 PASSI:
1. SEGNA: Clicca "Segna" + click mappa (o "GPS" per smartphone)
   -> Il punto viene salvato SUBITO con coordinate e ora
   -> Funziona anche all'interno dei campi di gara (zone poligonali)
2. COMPLETA: Clicca sul punto (lista o marker sulla mappa):
   - Tipo evento (Strike, Rilascio, Avvistamento, Cattura Pesata)
   - Specie (18 specie italiane + possibilita di aggiungere custom)
   - Peso, Profondita, Esca, Meteo, Note, Foto

I punti "Da completare" sono evidenziati con:
- Icona grigia con ? sulla mappa (click apre dialog modifica)
- Bordo arancione pulsante nella lista

SPECIE DISPONIBILI (italiano):
- Grandi pelagici: Tonno Rosso, Tonno Pinna Gialla, Alalunga,
  Marlin Blu, Marlin Bianco, Pesce Spada, Aguglia Imperiale
- Pelagici medi: Lampuga, Ricciola, Leccia, Leccia Stella,
  Palamita, Tombarello
- Predatori: Dentice, Cernia, Spigola, Barracuda
- Custom: seleziona "Altra specie..." per aggiungerne di nuove

Funzionalita:
- Salvataggio immediato (nessun form iniziale)
- Marker colorati per tipo sulla mappa
- Coordinate in formato DDM (es. N 40° 29.700' E 13° 50.319')
- Lista scrollabile con filtri tipo/specie
- Statistiche giornata (oggi/totale)
- Export dati in JSON e CSV
- Geolocation API per smartphone
- Persistenza dati in localStorage
- Specie personalizzate salvate nel browser

CREAZIONE CAMPI DA CENTRO + RAGGIO (v1.3.0)
-------------------------------------------
Nuova funzione per creare campi di gara partendo da coordinate centrali:

1. Clicca "Nuovo Campo (Centro + Raggio)" nella sidebar
2. Inserisci:
   - Nome campo e torneo
   - Coordinate centro (lat/lng)
   - Raggio in miglia nautiche o km
   - Tipo zona: Cerchio completo, Semicerchio Oceano (ovest), Semicerchio Sud
   - Colore del campo
3. Clicca "Crea Campo"

Il sistema genera automaticamente un poligono con 21-36 vertici.
Testato con: Marina Pez Vela, Quepos (9.4264, -84.1728) - 50nm

EDITING CENTRO (metodo veloce):
1. Seleziona un campo creato con centro+raggio
2. Clicca sulla BANDIERA VERDE (marker centro) sulla mappa
3. Appare il pannello "Salva/Annulla" in basso
4. Trascina il marker viola (centro) o i pallini (vertici)
5. Clicca "Salva" per confermare o "Annulla" per annullare

EDITING CENTRO (metodo avanzato):
1. Clicca "Sposta Centro" nella sidebar
2. Si apre un dialog con coordinate e raggio modificabili
3. Trascina il marker viola sulla mappa (preview tempo reale)
4. Clicca "Applica" per confermare

EDITING VERTICI (v1.4.0):
Durante la modalita "Sposta Centro" compaiono anche i marker sui vertici:
- Pallini colorati sulla circonferenza del campo
- Trascina un pallino per modificare la forma del poligono
- Doppio click su un pallino per eliminare quel vertice (minimo 3)
- Il poligono si aggiorna in tempo reale durante il drag
- Quando modifichi i vertici manualmente, il campo diventa "personalizzato"

SUPERFICIE CAMPO (v1.4.0):
Quando selezioni un campo di gara, viene mostrata la SUPERFICIE invece della distanza:
- Area in nm^2 (miglia nautiche quadrate)
- Area in km^2 (chilometri quadrati)
- Calcolo basato su formula Shoelace con proiezione equirettangolare
- Precisione: ~0.5% rispetto al cerchio teorico

AGGIUNGERE CAMPI DI GARA (manuale)
----------------------------------
Modifica zones_data.js seguendo questo formato:

{
    id: 'mio-torneo-2026',
    name: 'Nome Campo',
    tournament: 'Nome Torneo',
    year: 2026,
    gatheringPoint: {
        lat: 40.1234,
        lng: 14.5678,
        name: 'Punto di Raduno'
    },
    vertices: [
        { lat: 40.1, lng: 14.5 },
        { lat: 40.2, lng: 14.6 },
        { lat: 40.1, lng: 14.7 },
        { lat: 40.0, lng: 14.6 }
    ],
    color: '#8b5cf6'
}

GPS TRACKING (v1.6.0)
---------------------
Sistema completo per tracciare la tua rotta di navigazione:

ATTIVAZIONE:
1. Espandi la sezione "GPS Tracking" nella sidebar
2. Attiva lo switch "Abilita Tracking"
3. Consenti l'accesso GPS quando richiesto dal browser

DURANTE LA NAVIGAZIONE:
- Icona barca sulla mappa che si orienta automaticamente
- Traccia colorata che mostra il percorso
- Statistiche real-time: velocita (nodi), direzione, distanza, durata
- Coordinate correnti in formato decimale
- Bottoni Pausa/Riprendi e Cancella

PERSONALIZZAZIONE:
- Color picker per cambiare colore traccia in tempo reale
- Il colore viene salvato con la rotta

SALVATAGGIO ROTTE:
1. Clicca "Salva Rotta" dopo aver tracciato un percorso
2. Inserisci un nome descrittivo
3. La rotta viene salvata con colore, punti e statistiche
4. Limite massimo: 10 rotte salvate

GESTIONE ROTTE SALVATE:
- Icona occhio: mostra/nascondi rotta sulla mappa
- Puoi visualizzare PIU ROTTE contemporaneamente
- Icona download: esporta singola rotta in GPX
- Icona cestino: elimina rotta (con conferma)
- Ogni rotta ha un pallino colorato del suo colore

EXPORT:
- GPX: compatibile con Garmin, Navionics, OpenCPN
- GeoJSON: per GIS e applicazioni web
- I colori vengono inclusi nei metadati export

DEMO:
- Bottone "Demo: Forio -> Campo Gara" per testare senza GPS
- Simula una navigazione di ~7.5 nm in 30 punti

NOTE TECNICHE
-------------
- Richiede connessione internet per i layer WMS
- I preferiti sono salvati in localStorage del browser
- Testato su Chrome 120+, Firefox 120+, Safari 17+
- Formula distanza: Haversine (great-circle)
- Conversione: 1 nm = 1.852 km

LICENZA
-------
Uso libero per scopi non commerciali.
Layer cartografici soggetti alle rispettive licenze.

============================================
