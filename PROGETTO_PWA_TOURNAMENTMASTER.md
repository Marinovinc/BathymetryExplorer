# PROGETTO FISHINGTOOLS - Distribuzione su TournamentMaster.it

**Versione:** 3.0
**Data:** 2026-04-09
**Dominio:** tournamentmaster.it
**Strategia:** App Flutter Compilata + Distribuzione Ibrida
**PWA attuale:** v2.5.1 (~11.000 righe)

---

## 1. STRATEGIA DISTRIBUZIONE FINALE

```
┌─────────────────────────────────────────────────────────┐
│              DISTRIBUZIONE IBRIDA                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ANDROID (70% mercato):                                 │
│  ├── App Flutter compilata (APK)                        │
│  ├── Download da tournamentmaster.it/fishing/download   │
│  ├── Pagamenti: Stripe (commissione 3%)                 │
│  ├── Aggiornamenti: Istantanei                          │
│  └── Protezione codice: 70-75%                          │
│                                                          │
│  iOS (30% mercato):                                     │
│  ├── App Flutter compilata (IPA)                        │
│  ├── Distribuzione: App Store                           │
│  ├── Pagamenti: In-App Purchase (15-30%)                │
│  ├── Aggiornamenti: Dopo review Apple (1-7 giorni)      │
│  └── Protezione codice: 70-75%                          │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Confronto Strategia

| Aspetto | Android (Sito) | iOS (App Store) |
|---------|----------------|-----------------|
| Fee pubblicazione | €0 | €99/anno (esistente) |
| Commissione vendite | 3% (Stripe) | 15-30% (Apple) |
| Review time | Nessuna | 1-7 giorni |
| Aggiornamenti | Istantanei | Dopo review |
| Protezione codice | 70-75% | 70-75% |

### Vantaggi Strategia Ibrida

- **Zero dipendenza server** per funzionalità core
- **Codice compilato** (Dart → ARM nativo)
- **Nessuna commissione Google** (APK diretto)
- **Presenza App Store** per utenti iOS
- **Aggiornamenti istantanei** su Android

---

## 2. STRUTTURA SITO tournamentmaster.it

```
tournamentmaster.it/
└── fishing/
    │
    ├── index.html                  # Landing page app
    │
    ├── download/
    │   ├── index.html              # Pagina download con detect OS
    │   ├── fishingtools-v1.0.0.apk # APK Android (Flutter)
    │   ├── version.json            # Info versione per auto-update
    │   └── changelog.html          # Note di rilascio
    │
    ├── purchase/
    │   ├── monthly.html            # Checkout Stripe mensile
    │   ├── yearly.html             # Checkout Stripe annuale
    │   └── lifetime.html           # Checkout Stripe lifetime
    │
    ├── api/
    │   ├── activate.php            # Verifica codice attivazione
    │   └── stripe-webhook.php      # Webhook Stripe
    │
    ├── icons/
    │   ├── icon-192.png
    │   ├── icon-512.png
    │   ├── android-icon.svg
    │   └── apple-icon.svg
    │
    ├── privacy-policy.html         # Privacy policy
    ├── terms.html                  # Termini servizio
    └── .htaccess                   # HTTPS + cache
```

---

## 3. LANDING PAGE (index.html)

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FishingTools - Mappe Batimetriche per Pesca</title>
    <meta name="description" content="App mappe batimetriche mondiali per pesca sportiva. 16 layer, GPS tracking, zone gara.">

    <!-- Open Graph -->
    <meta property="og:title" content="FishingTools - Mappe Batimetriche">
    <meta property="og:description" content="L'app definitiva per pescatori. Mappe batimetriche mondiali, GPS tracking, zone gara.">
    <meta property="og:image" content="https://tournamentmaster.it/fishing/icons/og-image.png">
    <meta property="og:url" content="https://tournamentmaster.it/fishing/">

    <link rel="icon" href="icons/icon-192.png">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
            min-height: 100vh;
            color: white;
        }
        .hero {
            text-align: center;
            padding: 60px 20px;
        }
        .logo {
            width: 120px;
            height: 120px;
            margin-bottom: 20px;
        }
        h1 { font-size: 2.5rem; margin-bottom: 10px; }
        .subtitle { color: #94a3b8; font-size: 1.2rem; margin-bottom: 40px; }

        .download-buttons {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
            margin-bottom: 60px;
        }
        .download-btn {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 32px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 1.1rem;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .download-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        .android-btn {
            background: linear-gradient(135deg, #3ddc84 0%, #2da65a 100%);
            color: white;
        }
        .ios-btn {
            background: linear-gradient(135deg, #007aff 0%, #0055b3 100%);
            color: white;
        }
        .download-btn img { width: 28px; height: 28px; }

        .features {
            max-width: 1000px;
            margin: 0 auto;
            padding: 0 20px;
        }
        .features h2 {
            text-align: center;
            margin-bottom: 40px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
        }
        .feature-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 24px;
        }
        .feature-card h3 {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            color: #0ea5e9;
        }
        .feature-card p { color: #94a3b8; }

        .pricing {
            max-width: 800px;
            margin: 60px auto;
            padding: 0 20px;
            text-align: center;
        }
        .pricing h2 { margin-bottom: 40px; }
        .price-cards {
            display: flex;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }
        .price-card {
            background: rgba(255,255,255,0.05);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            padding: 30px;
            min-width: 200px;
        }
        .price-card.recommended {
            border-color: #0ea5e9;
            position: relative;
        }
        .price-card.recommended::before {
            content: 'Consigliato';
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: #0ea5e9;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
        }
        .price-card h3 { margin-bottom: 10px; }
        .price-card .price {
            font-size: 2rem;
            font-weight: bold;
            color: #0ea5e9;
        }
        .price-card .period { color: #94a3b8; }

        footer {
            text-align: center;
            padding: 40px 20px;
            color: #64748b;
        }
        footer a { color: #94a3b8; }
    </style>
</head>
<body>
    <section class="hero">
        <img src="icons/icon-192.png" alt="FishingTools" class="logo">
        <h1>FishingTools</h1>
        <p class="subtitle">Mappe batimetriche mondiali per pesca sportiva</p>

        <div class="download-buttons">
            <a href="download/" class="download-btn android-btn">
                <img src="icons/android-icon.svg" alt="">
                <span>Scarica per Android</span>
            </a>
            <a href="https://apps.apple.com/app/fishingtools/idXXXXXXXXX" class="download-btn ios-btn">
                <img src="icons/apple-icon.svg" alt="">
                <span>App Store</span>
            </a>
        </div>
    </section>

    <section class="features">
        <h2>Funzionalita</h2>
        <div class="feature-grid">
            <div class="feature-card">
                <h3>18+ Layer Batimetrici</h3>
                <p>EMODnet, GEBCO, NOAA, Esri e altri layer mondiali. Isobate globali + profonde 1000m/2000m colorate.</p>
            </div>
            <div class="feature-card">
                <h3>OWC 2026 Quepos</h3>
                <p>Spot pesca precaricati (The Corner, Furuno Bank), rotte, cerchio 50 miglia nautiche.</p>
            </div>
            <div class="feature-card">
                <h3>GPS Tracking</h3>
                <p>Registra le tue rotte di pesca e ritorna sui punti migliori.</p>
            </div>
            <div class="feature-card">
                <h3>Zone Gara</h3>
                <p>Crea e gestisci zone per tornei di pesca sportiva.</p>
            </div>
            <div class="feature-card">
                <h3>Catch Log</h3>
                <p>Registra catture con specie Quepos precaricate (Sailfish, Marlin, Tuna).</p>
            </div>
            <div class="feature-card">
                <h3>Righello Distanze</h3>
                <p>Misura distanze in miglia nautiche. Funziona anche sopra zone e cerchi.</p>
            </div>
            <div class="feature-card">
                <h3>10 Lingue</h3>
                <p>Italiano, English, Espanol, Deutsch, Francais, Portugues, e altre.</p>
            </div>
            <div class="feature-card">
                <h3>Guida + Offline</h3>
                <p>Guida utente integrata (18 sezioni). Scarica mappe per uso offline in mare.</p>
            </div>
        </div>
    </section>

    <section class="pricing">
        <h2>Prezzi Premium</h2>
        <div class="price-cards">
            <div class="price-card">
                <h3>Mensile</h3>
                <div class="price">€2.99</div>
                <div class="period">/mese</div>
            </div>
            <div class="price-card recommended">
                <h3>Annuale</h3>
                <div class="price">€19.99</div>
                <div class="period">/anno</div>
                <div style="color: #22c55e; margin-top: 10px;">Risparmia 44%</div>
            </div>
            <div class="price-card">
                <h3>Lifetime</h3>
                <div class="price">€49.99</div>
                <div class="period">per sempre</div>
            </div>
        </div>
    </section>

    <footer>
        <p>
            <a href="privacy-policy.html">Privacy Policy</a> |
            <a href="terms.html">Termini di Servizio</a>
        </p>
        <p style="margin-top: 10px;">© 2026 FishingTools - TournamentMaster.it</p>
    </footer>
</body>
</html>
```

---

## 4. PAGINA DOWNLOAD (download/index.html)

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Download FishingTools</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
            min-height: 100vh;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .container {
            max-width: 500px;
            padding: 40px 20px;
            text-align: center;
        }
        .logo { width: 100px; margin-bottom: 20px; }
        h1 { margin-bottom: 30px; }

        .download-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            padding: 20px 40px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 20px;
            transition: transform 0.2s;
        }
        .download-btn:hover { transform: translateY(-3px); }
        .download-btn img { width: 32px; }

        .android-btn {
            background: linear-gradient(135deg, #3ddc84 0%, #2da65a 100%);
            color: white;
        }
        .ios-btn {
            background: linear-gradient(135deg, #007aff 0%, #0055b3 100%);
            color: white;
        }

        .version-info {
            margin-top: 30px;
            padding: 20px;
            background: rgba(255,255,255,0.05);
            border-radius: 12px;
            text-align: left;
        }
        .version-info h3 { margin-bottom: 15px; text-align: center; }
        .version-info ul { padding-left: 20px; color: #94a3b8; }
        .version-info li { margin-bottom: 8px; }

        .instructions {
            margin-top: 20px;
            padding: 20px;
            background: rgba(255,193,7,0.1);
            border: 1px solid rgba(255,193,7,0.3);
            border-radius: 12px;
            text-align: left;
        }
        .instructions h4 { color: #ffc107; margin-bottom: 10px; }
        .instructions ol { padding-left: 20px; color: #94a3b8; }
        .instructions li { margin-bottom: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <img src="../icons/icon-192.png" alt="FishingTools" class="logo">
        <h1>Download FishingTools</h1>

        <!-- Android -->
        <div id="android-section">
            <a href="fishingtools-v1.0.0.apk" class="download-btn android-btn">
                <img src="../icons/android-icon.svg" alt="">
                <span>Scarica APK Android</span>
            </a>
            <p style="color: #94a3b8; font-size: 0.9rem;">Versione 1.0.0 - 48 MB</p>
        </div>

        <!-- iOS -->
        <div id="ios-section" style="margin-top: 20px;">
            <a href="https://apps.apple.com/app/fishingtools/idXXXXXXXXX" class="download-btn ios-btn">
                <img src="../icons/apple-icon.svg" alt="">
                <span>Scarica da App Store</span>
            </a>
        </div>

        <div class="version-info">
            <h3>Novita v1.0.0 (basata su PWA v2.5.1)</h3>
            <ul>
                <li>18+ layer batimetrici mondiali</li>
                <li>Isobate profonde 1000m/2000m colorate</li>
                <li>OWC 2026 Quepos: spot, rotte, cerchio 50NM</li>
                <li>GPS tracking continuo</li>
                <li>Zone gara personalizzate</li>
                <li>Registro catture (specie Quepos precaricate)</li>
                <li>Righello distanze in miglia nautiche</li>
                <li>Guida utente integrata (18 sezioni)</li>
                <li>Export GPX/CSV</li>
                <li>10 lingue supportate</li>
            </ul>
        </div>

        <div class="instructions" id="android-instructions">
            <h4>Installazione Android</h4>
            <ol>
                <li>Clicca "Scarica APK Android"</li>
                <li>Apri il file scaricato</li>
                <li>Se richiesto, abilita "Installa da origini sconosciute"</li>
                <li>Completa l'installazione</li>
                <li>Apri FishingTools!</li>
            </ol>
        </div>
    </div>

    <script>
        // Nascondi sezione non pertinente in base all'OS
        const isAndroid = /Android/i.test(navigator.userAgent);
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (isIOS) {
            document.getElementById('android-section').style.display = 'none';
            document.getElementById('android-instructions').style.display = 'none';
        }
        if (isAndroid) {
            document.getElementById('ios-section').style.display = 'none';
        }
    </script>
</body>
</html>
```

---

## 5. FILE version.json (Auto-Update Android)

```json
{
    "latestVersion": "1.0.0",
    "latestVersionCode": 1,
    "minRequiredVersion": "1.0.0",
    "apkUrl": "https://tournamentmaster.it/fishing/download/fishingtools-v1.0.0.apk",
    "apkSize": "48 MB",
    "releaseDate": "2026-04-09",
    "releaseNotes": [
        "Prima release pubblica (basata su PWA v2.5.1)",
        "18+ layer batimetrici globali",
        "Isobate profonde 1000m/2000m colorate",
        "OWC 2026 Quepos: spot, rotte, cerchio 50NM",
        "GPS tracking + registro catture (specie Quepos)",
        "Zone gara personalizzate",
        "Righello distanze in miglia nautiche",
        "Guida utente integrata (18 sezioni)",
        "Export GPX/CSV"
    ],
    "forceUpdate": false
}
```

---

## 6. SISTEMA PAGAMENTI ANDROID (Stripe)

### 6.1 Flusso Acquisto

```
┌─────────────────────────────────────────────────────────┐
│           FLUSSO PAGAMENTO ANDROID                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Utente clicca "Acquista Premium" nell'app           │
│                       │                                  │
│                       ▼                                  │
│  2. App apre browser → tournamentmaster.it/purchase     │
│                       │                                  │
│                       ▼                                  │
│  3. Utente sceglie piano e paga con Stripe              │
│                       │                                  │
│                       ▼                                  │
│  4. Stripe webhook genera codice: FISH-XXXX-XXXX-XXXX   │
│                       │                                  │
│                       ▼                                  │
│  5. Pagina mostra codice + email inviata                │
│                       │                                  │
│                       ▼                                  │
│  6. Utente torna all'app e inserisce codice             │
│                       │                                  │
│                       ▼                                  │
│  7. App verifica codice → Premium attivato!             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Backend PHP - api/activate.php

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$code = $_POST['code'] ?? $_GET['code'] ?? '';

if (empty($code)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Codice mancante']);
    exit;
}

try {
    $db = new PDO(
        'mysql:host=localhost;dbname=fishingtools;charset=utf8mb4',
        'username',
        'password'
    );
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->prepare('
        SELECT * FROM activation_codes
        WHERE code = ? AND used = 0
    ');
    $stmt->execute([$code]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // Marca come usato
        $db->prepare('
            UPDATE activation_codes
            SET used = 1, used_at = NOW()
            WHERE id = ?
        ')->execute([$row['id']]);

        echo json_encode([
            'success' => true,
            'type' => $row['type'],
            'expiresAt' => $row['expires_at']
                ? strtotime($row['expires_at']) * 1000
                : null
        ]);
    } else {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'error' => 'Codice non valido o gia utilizzato'
        ]);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Errore server']);
}
```

### 6.3 Backend PHP - api/stripe-webhook.php

```php
<?php
require 'vendor/autoload.php';

\Stripe\Stripe::setApiKey('sk_live_XXXXXXX');

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';
$endpoint_secret = 'whsec_XXXXXXX';

try {
    $event = \Stripe\Webhook::constructEvent(
        $payload, $sig_header, $endpoint_secret
    );
} catch(\Exception $e) {
    http_response_code(400);
    exit();
}

if ($event->type === 'checkout.session.completed') {
    $session = $event->data->object;

    // Genera codice attivazione
    $code = 'FISH-' .
            strtoupper(bin2hex(random_bytes(4))) . '-' .
            strtoupper(bin2hex(random_bytes(4))) . '-' .
            strtoupper(bin2hex(random_bytes(4)));

    $type = $session->metadata->type; // monthly, yearly, lifetime
    $email = $session->customer_email;

    // Calcola scadenza
    $expiresAt = null;
    if ($type === 'monthly') {
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 month'));
    } else if ($type === 'yearly') {
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 year'));
    }
    // lifetime = null (mai scade)

    // Salva nel database
    $db = new PDO(
        'mysql:host=localhost;dbname=fishingtools;charset=utf8mb4',
        'username',
        'password'
    );
    $stmt = $db->prepare('
        INSERT INTO activation_codes (code, type, email, expires_at, created_at)
        VALUES (?, ?, ?, ?, NOW())
    ');
    $stmt->execute([$code, $type, $email, $expiresAt]);

    // Invia email con codice
    $subject = 'FishingTools - Il tuo codice di attivazione';
    $message = "
        Grazie per l'acquisto di FishingTools Premium!

        Il tuo codice di attivazione:
        $code

        Come attivare:
        1. Apri l'app FishingTools
        2. Vai su Impostazioni > Premium
        3. Clicca 'Ho gia un codice'
        4. Inserisci il codice sopra

        Buona pesca!
        Team FishingTools
    ";

    mail($email, $subject, $message, "From: noreply@tournamentmaster.it");
}

http_response_code(200);
```

### 6.4 Schema Database

```sql
CREATE TABLE activation_codes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    type ENUM('monthly', 'yearly', 'lifetime') NOT NULL,
    email VARCHAR(255) NOT NULL,
    expires_at DATETIME NULL,
    used TINYINT(1) DEFAULT 0,
    used_at DATETIME NULL,
    created_at DATETIME NOT NULL,
    INDEX idx_code (code),
    INDEX idx_email (email)
);
```

---

## 7. .htaccess

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Cache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType application/json "access plus 1 day"
    ExpiresByType image/png "access plus 1 month"
    ExpiresByType image/svg+xml "access plus 1 month"
    ExpiresByType application/vnd.android.package-archive "access plus 1 week"
</IfModule>

# CORS per API
<IfModule mod_headers.c>
    <FilesMatch "\.(php)$">
        Header set Access-Control-Allow-Origin "*"
        Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
        Header set Access-Control-Allow-Headers "Content-Type"
    </FilesMatch>
</IfModule>

# MIME type per APK
AddType application/vnd.android.package-archive .apk
```

---

## 8. CHECKLIST DEPLOY

### Pre-Deploy
- [ ] Certificato SSL attivo su tournamentmaster.it
- [ ] Accesso FTP/cPanel funzionante
- [ ] Account Stripe configurato
- [ ] Database MySQL creato

### File da Caricare
- [ ] /fishing/index.html (landing page)
- [ ] /fishing/download/index.html
- [ ] /fishing/download/version.json
- [ ] /fishing/download/fishingtools-v1.0.0.apk (quando pronto)
- [ ] /fishing/api/activate.php
- [ ] /fishing/api/stripe-webhook.php
- [ ] /fishing/icons/ (4 file)
- [ ] /fishing/privacy-policy.html
- [ ] /fishing/terms.html
- [ ] /fishing/.htaccess

### Configurazioni
- [ ] Stripe webhook URL: https://tournamentmaster.it/fishing/api/stripe-webhook.php
- [ ] Database credentials in api/*.php
- [ ] App Store URL reale in tutti i link iOS

### Post-Deploy Test
- [ ] https://tournamentmaster.it/fishing/ carica
- [ ] Download APK funziona
- [ ] Link App Store corretto
- [ ] API activate.php risponde
- [ ] Stripe test payment funziona
- [ ] Email codice arriva

---

## 9. URL FINALI

| Risorsa | URL |
|---------|-----|
| Landing Page | https://tournamentmaster.it/fishing/ |
| Download | https://tournamentmaster.it/fishing/download/ |
| APK Android | https://tournamentmaster.it/fishing/download/fishingtools-v1.0.0.apk |
| App Store iOS | https://apps.apple.com/app/fishingtools/idXXXXXXXXX |
| API Activate | https://tournamentmaster.it/fishing/api/activate.php |
| Privacy | https://tournamentmaster.it/fishing/privacy-policy.html |
| Termini | https://tournamentmaster.it/fishing/terms.html |

---

## 10. COSTI ANNUALI

| Voce | Costo |
|------|-------|
| Apple Developer | €99/anno (esistente) |
| Google Play | €0 (non usato) |
| Hosting | €0 (esistente) |
| Stripe | 1.4% + €0.25/transazione |
| **TOTALE FISSO** | **€99/anno** |

---

*Documento aggiornato: 2026-04-09 — PWA v2.5.1*
*Strategia: App Flutter Compilata - Android APK da sito + iOS App Store*
