# PROGETTO APP MOBILE - FISHINGTOOLS Bathymetry Explorer

**Versione:** 2.0
**Data:** 2026-04-09
**Stato:** Documento di Progetto
**PWA attuale:** v2.5.1 (~11.000 righe)

---

## 1. EXECUTIVE SUMMARY

Trasformazione della PWA "FISHINGTOOLS Bathymetry Explorer" in applicazione mobile nativa per iOS e Android, con modello di business **freemium + pubblicità**.

### Obiettivi
- Pubblicazione su Apple App Store e Google Play Store
- Monetizzazione tramite pubblicità in-app + acquisti in-app (IAP)
- Base utenti gratuita con funzionalità limitate ma demo funzionanti
- Conversione utenti free → premium

---

## 2. MODELLO DI BUSINESS

### 2.1 Versione FREE (con pubblicità)

| Funzionalità | Stato | Note |
|--------------|-------|------|
| Mappa base (OpenStreetMap) | **ATTIVA** | Sempre disponibile |
| Navigazione e zoom | **ATTIVA** | Sempre disponibile |
| Ricerca posizione | **ATTIVA** | Max 5 ricerche/giorno |
| 1 Layer batimetria (EMODnet base) | **ATTIVA** | Solo questo layer |
| Selettore lingue | **ATTIVA** | Tutte le 10 lingue |
| GPS posizione corrente | **ATTIVA** | Singola lettura |
| Guida utente | **ATTIVA** | 18 sezioni, sempre accessibile |
| **DEMO Zone Gara** | **DEMO** | Solo visualizzazione zone predefinite |
| **DEMO Catch Log** | **DEMO** | Max 3 catture salvabili |
| **DEMO Righello** | **DEMO** | Max 2 misurazioni/sessione |
| **DEMO OWC 2026** | **DEMO** | Solo visualizzazione spot/rotte predefinite |
| Luoghi preferiti | **BLOCCATA** | Visibile ma non utilizzabile |
| Creazione zone custom | **BLOCCATA** | Visibile ma non utilizzabile |
| Layer avanzati (18+ layer) | **BLOCCATA** | Visibile ma non utilizzabile |
| Isobate profonde 1000/2000m | **BLOCCATA** | Visibile ma non utilizzabile |
| GPS tracking continuo | **BLOCCATA** | Visibile ma non utilizzabile |
| Rotte GPS | **BLOCCATA** | Visibile ma non utilizzabile |
| Export GPX/GeoJSON/CSV | **BLOCCATA** | Visibile ma non utilizzabile |
| Modalità torneo OWC | **BLOCCATA** | Visibile ma non utilizzabile |
| WhatsApp integration | **BLOCCATA** | Visibile ma non utilizzabile |
| Download offline | **BLOCCATA** | Visibile ma non utilizzabile |
| Nascondi/mostra spot | **BLOCCATA** | Visibile ma non utilizzabile |

### 2.2 Versione PREMIUM (acquisto in-app)

**Prezzo suggerito:** €9.99/anno oppure €24.99 lifetime

| Funzionalità | Descrizione |
|--------------|-------------|
| Tutti i 18+ layer | Batimetria, SST, correnti, onde, vento, MPA, isobate |
| Isobate profonde | Linee 1000m (rosso) e 2000m (viola) via GeoJSON |
| Zone gara illimitate | Crea, modifica, elimina zone personalizzate |
| OWC 2026 completo | Spot pesca, rotte, cerchio 50NM, nascondi/mostra spot |
| Catch log illimitato | Registro catture senza limiti, specie Quepos precaricate |
| GPS tracking continuo | Tracciamento rotta in tempo reale |
| Righello illimitato | Misura distanze in NM, funziona sopra zone/cerchi |
| Export completo | GPX, GeoJSON, CSV, JSON |
| Modalità torneo | Timer, proximity alert, WhatsApp |
| Download offline | Scarica mappe per uso senza connessione |
| Luoghi preferiti illimitati | Salva tutti i punti che vuoi |
| Guida utente integrata | 18 sezioni, tema scuro oceanico |
| Nessuna pubblicità | Esperienza pulita |

### 2.3 Pubblicità

| Tipo | Posizione | Frequenza |
|------|-----------|-----------|
| Banner | Bottom (sotto mappa) | Sempre visibile |
| Interstitial | Cambio sezione | Ogni 3 azioni |
| Rewarded Video | Sblocco temporaneo | Su richiesta utente |

**Network pubblicitari:**
- Google AdMob (principale)
- Facebook Audience Network (secondario)

---

## 3. ARCHITETTURA TECNICA

### 3.1 Opzioni di Sviluppo

| Opzione | Pro | Contro | Costo Stimato |
|---------|-----|--------|---------------|
| **A) Capacitor/Ionic** | Riuso codice PWA esistente, rapido | Performance media | €5.000-10.000 |
| **B) React Native** | Performance buona, community | Riscrittura parziale | €15.000-25.000 |
| **C) Flutter** | Performance ottima, UI nativa | Riscrittura totale | €20.000-35.000 |
| **D) Nativo (Swift+Kotlin)** | Performance massima | Doppio sviluppo | €40.000-60.000 |

### 3.2 Raccomandazione: CAPACITOR (Opzione A)

**Motivazione:**
- La PWA esistente è già funzionante e testata
- Capacitor wrappa il codice web in container nativo
- Accesso a API native (GPS, storage, ads)
- Time-to-market più rapido
- Costo contenuto

### 3.3 Stack Tecnologico Proposto

```
┌─────────────────────────────────────────────┐
│            APP MOBILE                        │
├─────────────────────────────────────────────┤
│  Capacitor 5.x (Bridge nativo)              │
│  ├── @capacitor/core                        │
│  ├── @capacitor/ios                         │
│  ├── @capacitor/android                     │
│  ├── @capacitor/geolocation                 │
│  ├── @capacitor/filesystem                  │
│  ├── @capacitor/preferences                 │
│  └── @capacitor/share                       │
├─────────────────────────────────────────────┤
│  Plugin Aggiuntivi                          │
│  ├── @capacitor-community/admob             │
│  ├── capacitor-purchases (RevenueCat)       │
│  └── @capacitor/splash-screen               │
├─────────────────────────────────────────────┤
│  Web App (esistente — v2.5.1)               │
│  ├── index.html (~11.000 righe)             │
│  ├── guide.html (guida utente 18 sezioni)   │
│  ├── zones_data.js (zone torneo)            │
│  ├── isobaths_1000_2000.geojson             │
│  ├── Leaflet.js 1.9.4                       │
│  ├── Font Awesome 6.5.1                     │
│  └── Service Worker v2.5.1 (offline)        │
└─────────────────────────────────────────────┘
```

---

## 4. IMPLEMENTAZIONE FREEMIUM

### 4.1 Sistema di Blocco Funzionalità

```javascript
// config/premium.js
const PREMIUM_CONFIG = {
    FREE_LIMITS: {
        searchesPerDay: 5,
        catchLogMax: 3,
        rulerMeasurementsPerSession: 2,
        favoritesMax: 0,
        customZonesMax: 0
    },
    BLOCKED_FEATURES: [
        'advanced-layers',
        'deep-isobaths',
        'gps-tracking',
        'routes',
        'export',
        'tournament-mode',
        'owc-full',
        'whatsapp',
        'offline-download',
        'favorites',
        'custom-zones',
        'hide-spots'
    ],
    DEMO_FEATURES: [
        'predefined-zones-view',
        'catch-log-limited',
        'ruler-limited',
        'owc-spots-view',
        'guide'
    ]
};
```

### 4.2 UI per Funzionalità Bloccate

```javascript
function showPremiumOverlay(featureName) {
    const overlay = document.createElement('div');
    overlay.className = 'premium-overlay';
    overlay.innerHTML = `
        <div class="premium-modal">
            <i class="fas fa-lock"></i>
            <h3>Funzionalità Premium</h3>
            <p>${getFeatureDescription(featureName)}</p>
            <button onclick="showPurchaseOptions()">
                Sblocca Premium - €9.99/anno
            </button>
            <button onclick="watchAdToUnlock('${featureName}')">
                <i class="fas fa-play"></i> Guarda video per 30 min gratis
            </button>
            <button onclick="closePremiumOverlay()">
                Continua con versione Free
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}
```

### 4.3 Visual Design Sezioni Bloccate

```css
/* Sezione bloccata - visibile ma non cliccabile */
.sidebar-section.locked {
    position: relative;
    pointer-events: none;
    opacity: 0.6;
}

.sidebar-section.locked::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(15, 23, 42, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
}

.sidebar-section.locked .lock-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #f59e0b;
    color: #000;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: bold;
    z-index: 10;
    pointer-events: auto;
}

.sidebar-section.locked .lock-badge i {
    margin-right: 4px;
}
```

---

## 5. REQUISITI STORE

### 5.1 Apple App Store

| Requisito | Valore |
|-----------|--------|
| Account Developer | €99/anno |
| Bundle ID | com.fishingtools.bathymetry |
| Minimum iOS | 14.0 |
| Categoria | Navigation / Sports |
| Screenshot | 6.5" (1284x2778), 5.5" (1242x2208) |
| App Icon | 1024x1024 PNG |
| Privacy Policy | URL obbligatorio |
| App Review | 1-7 giorni |

**Requisiti Specifici Apple:**
- Restore purchases obbligatorio
- Sign in with Apple (se login presente)
- App Tracking Transparency (ATT) per ads
- No external payment links

### 5.2 Google Play Store

| Requisito | Valore |
|-----------|--------|
| Account Developer | €25 (una tantum) |
| Package Name | com.fishingtools.bathymetry |
| Minimum Android | 7.0 (API 24) |
| Categoria | Maps & Navigation |
| Screenshot | Min 2, max 8 per tipo dispositivo |
| App Icon | 512x512 PNG |
| Feature Graphic | 1024x500 PNG |
| Privacy Policy | URL obbligatorio |
| Review | 1-3 giorni |

**Requisiti Specifici Google:**
- Target API level 34+ (Android 14)
- Dichiarazione permessi location
- Data Safety form compilato

---

## 6. PERMESSI RICHIESTI

### 6.1 iOS (Info.plist)

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>Necessario per mostrare la tua posizione sulla mappa e registrare le catture</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>Necessario per il tracking GPS durante le sessioni di pesca</string>

<key>NSUserTrackingUsageDescription</key>
<string>Utilizziamo identificatori per mostrarti pubblicità pertinenti</string>
```

### 6.2 Android (AndroidManifest.xml)

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    android:maxSdkVersion="28" />
```

---

## 7. MONETIZZAZIONE - DETTAGLIO

### 7.1 Proiezione Ricavi (Anno 1)

**Ipotesi:**
- 10.000 download nel primo anno
- 5% conversione premium
- €3 CPM medio per banner
- €15 CPM per interstitial

| Fonte | Calcolo | Ricavo Stimato |
|-------|---------|----------------|
| Premium annuale | 500 utenti × €9.99 | €4.995 |
| Banner ads | 9.500 utenti × 30 impression/giorno × 365 × €3/1000 | €3.120 |
| Interstitial | 9.500 utenti × 5 imp/giorno × 365 × €15/1000 | €2.600 |
| Rewarded video | 2.000 visualizzazioni/mese × 12 × €20/1000 | €480 |
| **TOTALE ANNO 1** | | **€11.195** |

### 7.2 Costi Stimati (Anno 1)

| Voce | Costo |
|------|-------|
| Sviluppo Capacitor | €8.000 |
| Apple Developer | €99 |
| Google Play | €25 |
| Server/Hosting | €0 (tutto client-side) |
| RevenueCat | Gratuito fino 10K MTR |
| Manutenzione | €2.000 |
| **TOTALE COSTI** | **€10.124** |

**Break-even previsto:** Fine Anno 1

---

## 8. PIANO DI IMPLEMENTAZIONE

### Fase 1: Setup Progetto (1 settimana)
- [ ] Creare progetto Capacitor
- [ ] Configurare iOS e Android
- [ ] Integrare codice PWA esistente
- [ ] Test base su simulatori

### Fase 2: Sistema Premium (2 settimane)
- [ ] Implementare logica blocco funzionalità
- [ ] Creare UI overlay premium
- [ ] Integrare RevenueCat per IAP
- [ ] Implementare restore purchases
- [ ] Test flusso acquisto

### Fase 3: Pubblicità (1 settimana)
- [ ] Integrare AdMob SDK
- [ ] Implementare banner persistente
- [ ] Implementare interstitial su azioni
- [ ] Implementare rewarded video
- [ ] Test monetizzazione

### Fase 4: Polishing (1 settimana)
- [ ] Splash screen personalizzato
- [ ] App icon per tutti i formati
- [ ] Screenshot per store
- [ ] Video preview (opzionale)
- [ ] Testi descrizione multilingua

### Fase 5: Submission (1-2 settimane)
- [ ] Privacy Policy pubblicata
- [ ] Compilare metadata App Store
- [ ] Compilare metadata Play Store
- [ ] Submit per review
- [ ] Rispondere a eventuali rejection
- [ ] Pubblicazione

**Timeline totale stimata: 6-8 settimane**

---

## 9. STRUTTURA FILE PROGETTO

```
BathymetryExplorer-Mobile/
├── package.json
├── capacitor.config.ts
├── ionic.config.json
│
├── src/                      # Web app esistente (v2.4.3)
│   ├── index.html            # ~11.000 righe, app principale
│   ├── guide.html            # Guida utente (18 sezioni)
│   ├── sw.js                 # Service Worker v2.4.3
│   ├── zones_data.js         # Zone torneo predefinite
│   ├── isobaths_1000_2000.geojson  # Isobate profonde
│   ├── manifest.json
│   └── icons/
│
├── src/premium/              # Sistema premium
│   ├── config.js
│   ├── premium-manager.js
│   ├── purchase-handler.js
│   └── ad-manager.js
│
├── ios/                      # Progetto Xcode
│   └── App/
│       ├── App/
│       │   ├── Info.plist
│       │   └── AppDelegate.swift
│       └── App.xcodeproj
│
├── android/                  # Progetto Android Studio
│   └── app/
│       ├── src/main/
│       │   ├── AndroidManifest.xml
│       │   └── java/
│       └── build.gradle
│
├── resources/                # Asset per store
│   ├── icon.png              # 1024x1024
│   ├── splash.png            # 2732x2732
│   ├── screenshots/
│   │   ├── ios/
│   │   └── android/
│   └── feature-graphic.png   # 1024x500
│
└── store-listing/            # Testi per store
    ├── description-it.md
    ├── description-en.md
    ├── keywords.txt
    └── privacy-policy.md
```

---

## 10. TESTI STORE (BOZZA)

### Nome App
**FISHINGTOOLS - Mappe Batimetriche**

### Sottotitolo (30 caratteri)
Pesca sportiva d'altura

### Descrizione Breve (80 caratteri)
Mappe batimetriche mondiali per pescatori. OWC 2026, GPS, registro catture.

### Descrizione Completa

```
FISHINGTOOLS Bathymetry Explorer - L'app definitiva per la pesca sportiva d'altura!

MAPPE BATIMETRICHE MONDIALI
Visualizza la profondità del mare ovunque nel mondo con dati EMODnet, GEBCO e NOAA. Isobate globali GEBCO + linee profonde 1000m/2000m colorate. Identifica canyon, secche e strutture sottomarine dove si concentrano i pesci.

OWC 2026 QUEPOS - COSTA RICA
Spot pesca precaricati (The Corner, Furuno Bank, Quepos Canyon), rotte navigate, cerchio limite 50 miglia nautiche. Nascondi/mostra spot individuali. Perfetto per prepararsi alla competizione.

FUNZIONALITÀ GRATUITE:
• Mappa base con navigazione completa
• 1 layer batimetria (EMODnet)
• Ricerca posizione (5/giorno)
• GPS posizione corrente
• Guida utente integrata (18 sezioni)
• Demo zone gara e spot OWC 2026
• Demo registro catture (3 max)
• 10 lingue supportate

FUNZIONALITÀ PREMIUM:
• 18+ layer professionali (SST, correnti, onde, vento, MPA, isobate)
• Isobate profonde 1000m (rosso) e 2000m (viola)
• OWC 2026 completo: spot, rotte, cerchio 50NM
• Zone gara personalizzate illimitate
• Registro catture illimitato (specie Quepos precaricate)
• Righello distanze illimitato (funziona sopra zone e cerchi)
• GPS tracking continuo
• Modalità torneo con timer e alert
• Download mappe offline
• Integrazione WhatsApp
• Nessuna pubblicità

PERFETTO PER:
• Big Game Fishing (OWC 2026)
• Drifting
• Traina d'altura
• Jigging
• Tornei di pesca

Scarica ora e scopri dove si nascondono i pesci!
```

### Keywords
pesca, fishing, batimetria, bathymetry, mare, sea, GPS, mappa, map, torneo, tournament, big game, traina, trolling, OWC, Quepos, isobate, offshore

---

## 11. PRIVACY POLICY (SINTESI)

Deve includere:
- Dati raccolti (posizione GPS, preferenze)
- Uso dei dati (solo locale, no server)
- Pubblicità e tracking (AdMob, ATT)
- Diritti utente (cancellazione dati)
- Contatti

URL suggerito: `https://marinovinc.github.io/BathymetryExplorer/privacy-policy.html`

---

## 12. NOTE COMPATIBILITA' ANDROID (v2.5.1)

**Fix tremolio schermo su Android (Redmi/Xiaomi/Huawei):**

La PWA v2.5.1 include un fix critico per dispositivi Android con GPU deboli. L'API `deviceorientation` (giroscopio bussola) causava repaint continui a 60+ Hz dell'intero schermo. Fix applicato:

- `deviceorientation` NON auto-attivato su Android (richiede doppio-tap)
- `filter: none` e `transition: none` sulla SVG bussola su Android
- Rilevamento via `const isAndroid = /Android/i.test(navigator.userAgent)` + classe `.android-device` su `<html>`

**IMPORTANTE per Capacitor:** Il fix e' gia' nel codice web. Se si wrappa con Capacitor, il comportamento e' identico. Nessuna modifica aggiuntiva necessaria per la build nativa.

---

## 13. NEXT STEPS

1. **Approvazione documento** - Conferma strategia e budget
2. **Setup ambiente** - Installare Capacitor, Xcode, Android Studio
3. **Account developer** - Creare account Apple e Google
4. **Sviluppo** - Seguire piano Fase 1-5
5. **Beta testing** - TestFlight (iOS) e Internal Testing (Android)
6. **Launch** - Pubblicazione su entrambi gli store

---

## CONTATTI

**Progetto:** FISHINGTOOLS Bathymetry Explorer
**Repository:** https://github.com/Marinovinc/BathymetryExplorer
**Web:** https://marinovinc.github.io/BathymetryExplorer/

---

*Documento aggiornato: 2026-04-09 — PWA v2.5.1*
