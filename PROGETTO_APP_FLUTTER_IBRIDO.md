# PROGETTO APP FLUTTER - FISHINGTOOLS

**Versione:** 3.0
**Data:** 2026-04-09
**Strategia:** Flutter compilato + Distribuzione Ibrida
**PWA attuale:** v2.4.3 (~11.000 righe)

---

## 1. STRATEGIA DISTRIBUZIONE

```
┌─────────────────────────────────────────────────────────┐
│              DISTRIBUZIONE IBRIDA                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ANDROID (70% mercato):                                 │
│  └── APK scaricabile da tournamentmaster.it             │
│      ✓ Zero commissioni                                 │
│      ✓ Zero costi Play Store                            │
│      ✓ Aggiornamenti istantanei                         │
│      ✓ Codice compilato (protetto)                      │
│                                                          │
│  iOS (30% mercato):                                     │
│  └── App Store (account esistente)                      │
│      ✓ Distribuzione ufficiale Apple                    │
│      ✓ Codice compilato (protetto)                      │
│      ✓ In-App Purchase nativo                           │
│      - Commissione 15-30%                               │
│      - €99/anno (già pagato)                            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Confronto Costi

| Voce | Android (Sito) | iOS (App Store) |
|------|----------------|-----------------|
| Fee pubblicazione | €0 | €99/anno (esistente) |
| Commissione vendite | 3% (Stripe) | 15-30% (Apple) |
| Review time | 0 (istantaneo) | 1-7 giorni |
| Aggiornamenti | Istantanei | Dopo review |

---

## 2. ARCHITETTURA FLUTTER

### 2.1 Struttura Progetto

```
fishingtools_flutter/
├── lib/
│   ├── main.dart                     # Entry point
│   │
│   ├── config/
│   │   ├── app_config.dart           # Configurazioni app
│   │   ├── layer_config.dart         # URL layer batimetrici
│   │   └── premium_config.dart       # Configurazione premium
│   │
│   ├── models/
│   │   ├── zone.dart                 # Modello zona gara
│   │   ├── catch_record.dart         # Modello cattura
│   │   ├── favorite_place.dart       # Modello luogo preferito
│   │   ├── gps_route.dart            # Modello rotta GPS
│   │   └── user_settings.dart        # Impostazioni utente
│   │
│   ├── services/
│   │   ├── location_service.dart     # GPS e tracking
│   │   ├── storage_service.dart      # Persistenza locale (Hive/SQLite)
│   │   ├── premium_service.dart      # Gestione premium/free
│   │   ├── export_service.dart       # Export GPX/CSV
│   │   ├── update_service.dart       # Check aggiornamenti (Android)
│   │   ├── purchase_service.dart     # IAP per iOS
│   │   └── offline_service.dart      # Download mappe offline
│   │
│   ├── screens/
│   │   ├── home_screen.dart          # Schermata principale con mappa
│   │   ├── layers_screen.dart        # Selezione layer (18+ layer)
│   │   ├── zones_screen.dart         # Gestione zone torneo
│   │   ├── owc_screen.dart           # OWC 2026 (spot, rotte, 50NM)
│   │   ├── favorites_screen.dart     # Luoghi preferiti
│   │   ├── catch_log_screen.dart     # Registro catture (specie Quepos)
│   │   ├── routes_screen.dart        # Rotte GPS
│   │   ├── ruler_screen.dart         # Righello distanze NM
│   │   ├── guide_screen.dart         # Guida utente (18 sezioni)
│   │   ├── settings_screen.dart      # Impostazioni
│   │   └── premium_screen.dart       # Acquisto premium
│   │
│   ├── widgets/
│   │   ├── map_widget.dart           # Widget mappa principale
│   │   ├── layer_selector.dart       # Selettore layer (18+ layer)
│   │   ├── zone_overlay.dart         # Overlay zone su mappa
│   │   ├── owc_overlay.dart          # Overlay OWC 2026 (spot, rotte, 50NM)
│   │   ├── isobath_overlay.dart      # Isobate 1000m/2000m colorate
│   │   ├── ruler_overlay.dart        # Overlay righello (click forwarding)
│   │   ├── catch_marker.dart         # Marker cattura
│   │   ├── fishing_spot_marker.dart  # Marker spot pesca OWC
│   │   ├── gps_track_overlay.dart    # Traccia GPS su mappa
│   │   ├── premium_badge.dart        # Badge "Premium" su features
│   │   └── language_selector.dart    # Selettore lingua
│   │
│   └── l10n/
│       ├── app_en.arb                # Traduzioni inglese
│       ├── app_it.arb                # Traduzioni italiano
│       ├── app_es.arb                # Traduzioni spagnolo
│       ├── app_de.arb                # Traduzioni tedesco
│       ├── app_fr.arb                # Traduzioni francese
│       ├── app_pt.arb                # Traduzioni portoghese
│       ├── app_ru.arb                # Traduzioni russo
│       ├── app_zh.arb                # Traduzioni cinese
│       ├── app_ja.arb                # Traduzioni giapponese
│       └── app_hi.arb                # Traduzioni hindi
│
├── android/
│   ├── app/
│   │   ├── build.gradle              # Config build Android
│   │   └── src/main/
│   │       ├── AndroidManifest.xml   # Permessi
│   │       └── res/                  # Icone e risorse
│   └── key.properties                # Signing key (NON in git!)
│
├── ios/
│   ├── Runner/
│   │   ├── Info.plist                # Config iOS
│   │   └── Assets.xcassets/          # Icone iOS
│   └── Runner.xcodeproj/
│
├── assets/
│   ├── images/
│   │   └── logo.png
│   ├── icons/
│   │   └── app_icon.png
│   ├── zones/
│   │   └── predefined_zones.json     # Zone gara predefinite
│   ├── owc/
│   │   └── owc_2026_spots.json       # Spot pesca OWC 2026 Quepos
│   └── isobaths/
│       └── isobaths_1000_2000.geojson # Isobate profonde colorate
│
├── pubspec.yaml                      # Dipendenze Flutter
└── README.md
```

### 2.2 Dipendenze (pubspec.yaml)

```yaml
name: fishingtools
description: Mappe batimetriche per pesca sportiva
version: 1.0.0+1

environment:
  sdk: '>=3.0.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # Mappa
  flutter_map: ^6.0.0
  latlong2: ^0.9.0

  # GPS e Location
  geolocator: ^10.0.0
  permission_handler: ^11.0.0

  # Storage locale
  hive: ^2.2.3
  hive_flutter: ^1.1.0
  path_provider: ^2.1.0

  # In-App Purchase (iOS)
  in_app_purchase: ^3.1.0

  # Export
  gpx: ^2.2.0
  csv: ^5.1.0
  share_plus: ^7.2.0

  # UI
  flutter_svg: ^2.0.0
  cached_network_image: ^3.3.0

  # Utilities
  intl: ^0.18.0
  url_launcher: ^6.2.0
  package_info_plus: ^5.0.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  hive_generator: ^2.0.0
  build_runner: ^2.4.0
  flutter_launcher_icons: ^0.13.0

flutter:
  uses-material-design: true
  generate: true  # Per l10n

  assets:
    - assets/images/
    - assets/icons/
    - assets/zones/
```

---

## 3. MODELLO FREEMIUM

### 3.1 Funzionalità FREE vs PREMIUM

| Funzionalità | FREE | PREMIUM |
|--------------|------|---------|
| Mappa base OSM | ✅ | ✅ |
| Layer EMODnet base | ✅ | ✅ |
| Isobate GEBCO (globale) | ✅ | ✅ |
| GPS posizione singola | ✅ | ✅ |
| Ricerca luoghi | 5/giorno | Illimitata |
| Navigazione zoom | ✅ | ✅ |
| 10 lingue | ✅ | ✅ |
| Guida utente (18 sezioni) | ✅ | ✅ |
| | | |
| 18+ layer avanzati | ❌ | ✅ |
| Isobate profonde 1000/2000m | ❌ | ✅ |
| OWC 2026 completo (spot, rotte, 50NM) | Demo | ✅ |
| Nascondi/mostra spot individuali | ❌ | ✅ |
| Zone gara personalizzate | ❌ | ✅ |
| Luoghi preferiti | ❌ | ✅ |
| GPS tracking continuo | ❌ | ✅ |
| Rotte salvate | ❌ | ✅ |
| Catch log illimitato (specie Quepos) | 3 max | ✅ |
| Righello misure (click forwarding) | 2/sessione | ✅ |
| Export GPX/CSV | ❌ | ✅ |
| Condivisione WhatsApp | ❌ | ✅ |
| Mappe offline (SW v2.4.3) | ❌ | ✅ |
| Pubblicità | Sì | No |

### 3.2 Prezzi

| Piano | Android (Stripe) | iOS (App Store) |
|-------|------------------|-----------------|
| Mensile | €2.99 | €2.99 |
| Annuale | €19.99 | €19.99 |
| Lifetime | €49.99 | €54.99* |

*iOS leggermente più alto per coprire commissione Apple

### 3.3 Implementazione Premium Service

```dart
// lib/services/premium_service.dart
import 'dart:io';
import 'package:in_app_purchase/in_app_purchase.dart';
import 'package:hive/hive.dart';

class PremiumService {
  static const String _boxName = 'premium_status';

  // Product IDs
  static const String monthlyId = 'fishingtools_monthly';
  static const String yearlyId = 'fishingtools_yearly';
  static const String lifetimeId = 'fishingtools_lifetime';

  late Box _box;

  Future<void> init() async {
    _box = await Hive.openBox(_boxName);
  }

  bool get isPremium {
    final status = _box.get('isPremium', defaultValue: false);
    final expiresAt = _box.get('expiresAt');

    if (status == true) {
      // Lifetime
      if (expiresAt == null) return true;
      // Subscription
      if (DateTime.now().millisecondsSinceEpoch < expiresAt) return true;
    }
    return false;
  }

  Future<bool> purchasePremium(String productId) async {
    if (Platform.isIOS) {
      return await _purchaseIOS(productId);
    } else {
      return await _purchaseAndroid(productId);
    }
  }

  // iOS: In-App Purchase
  Future<bool> _purchaseIOS(String productId) async {
    final bool available = await InAppPurchase.instance.isAvailable();
    if (!available) return false;

    final ProductDetailsResponse response =
        await InAppPurchase.instance.queryProductDetails({productId});

    if (response.productDetails.isEmpty) return false;

    final PurchaseParam param = PurchaseParam(
      productDetails: response.productDetails.first,
    );

    return await InAppPurchase.instance.buyNonConsumable(
      purchaseParam: param,
    );
  }

  // Android: Stripe (redirect a pagina web)
  Future<bool> _purchaseAndroid(String productId) async {
    // Apre pagina Stripe sul sito
    final url = 'https://tournamentmaster.it/fishing/purchase/$productId';
    // Dopo pagamento, Stripe chiama webhook che genera codice attivazione
    // Utente inserisce codice nell'app
    return false; // Gestito via activation code
  }

  // Android: Attivazione con codice
  Future<bool> activateWithCode(String code) async {
    // Verifica codice su server
    final response = await http.post(
      Uri.parse('https://tournamentmaster.it/fishing/api/activate'),
      body: {'code': code},
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      await _box.put('isPremium', true);
      await _box.put('expiresAt', data['expiresAt']);
      await _box.put('type', data['type']);
      return true;
    }
    return false;
  }

  void savePremiumStatus({
    required bool isPremium,
    required String type,
    int? expiresAt,
  }) {
    _box.put('isPremium', isPremium);
    _box.put('type', type);
    if (expiresAt != null) {
      _box.put('expiresAt', expiresAt);
    }
  }
}
```

---

## 4. DISTRIBUZIONE ANDROID (APK da Sito)

### 4.1 Pagina Download

```
tournamentmaster.it/fishing/
├── index.html              # Landing page app
├── download/
│   ├── index.html          # Pagina download
│   ├── fishingtools-v1.0.0.apk
│   ├── version.json        # Info versione corrente
│   └── changelog.html      # Novità versione
└── purchase/
    ├── monthly/
    ├── yearly/
    └── lifetime/
```

### 4.2 version.json (per auto-update check)

```json
{
  "latestVersion": "1.0.0",
  "latestVersionCode": 1,
  "minRequiredVersion": "1.0.0",
  "apkUrl": "https://tournamentmaster.it/fishing/download/fishingtools-v1.0.0.apk",
  "apkSize": "48 MB",
  "releaseDate": "2026-04-09",
  "releaseNotes": [
    "Prima release pubblica (basata su PWA v2.4.3)",
    "18+ layer batimetrici globali",
    "Isobate profonde 1000m/2000m colorate",
    "OWC 2026 Quepos: spot, rotte, cerchio 50NM",
    "GPS tracking + registro catture (specie Quepos)",
    "Zone gara personalizzate",
    "Guida utente integrata (18 sezioni)"
  ]
}
```

### 4.3 Update Service (Android)

```dart
// lib/services/update_service.dart
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:package_info_plus/package_info_plus.dart';
import 'package:url_launcher/url_launcher.dart';

class UpdateService {
  static const String versionUrl =
      'https://tournamentmaster.it/fishing/download/version.json';

  Future<UpdateInfo?> checkForUpdate() async {
    // Solo Android (iOS usa App Store)
    if (!Platform.isAndroid) return null;

    try {
      final response = await http.get(Uri.parse(versionUrl));
      if (response.statusCode != 200) return null;

      final data = jsonDecode(response.body);
      final packageInfo = await PackageInfo.fromPlatform();

      final currentVersion = int.parse(
        packageInfo.buildNumber,
      );
      final latestVersion = data['latestVersionCode'] as int;

      if (latestVersion > currentVersion) {
        return UpdateInfo(
          version: data['latestVersion'],
          apkUrl: data['apkUrl'],
          releaseNotes: List<String>.from(data['releaseNotes']),
          isRequired: currentVersion < data['minRequiredVersion'],
        );
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  Future<void> downloadUpdate(String apkUrl) async {
    await launchUrl(
      Uri.parse(apkUrl),
      mode: LaunchMode.externalApplication,
    );
  }
}

class UpdateInfo {
  final String version;
  final String apkUrl;
  final List<String> releaseNotes;
  final bool isRequired;

  UpdateInfo({
    required this.version,
    required this.apkUrl,
    required this.releaseNotes,
    required this.isRequired,
  });
}
```

### 4.4 Landing Page Download (HTML)

```html
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FishingTools - Download</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%);
            min-height: 100vh;
            color: white;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 40px 20px;
            text-align: center;
        }
        .logo {
            width: 120px;
            height: 120px;
            margin-bottom: 20px;
        }
        h1 { font-size: 2rem; margin-bottom: 10px; }
        .subtitle { color: #94a3b8; margin-bottom: 40px; }

        .download-options {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        .download-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            padding: 20px 30px;
            border-radius: 12px;
            text-decoration: none;
            font-size: 1.1rem;
            font-weight: 600;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        .download-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        .download-btn img {
            width: 32px;
            height: 32px;
        }

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
            background: rgba(255,255,255,0.1);
            border-radius: 12px;
        }
        .version-info h3 { margin-bottom: 10px; }
        .version-info ul {
            text-align: left;
            padding-left: 20px;
            color: #94a3b8;
        }

        .instructions {
            margin-top: 30px;
            padding: 20px;
            background: rgba(255,193,7,0.1);
            border: 1px solid rgba(255,193,7,0.3);
            border-radius: 12px;
            text-align: left;
        }
        .instructions h4 {
            color: #ffc107;
            margin-bottom: 10px;
        }
        .instructions ol {
            padding-left: 20px;
            color: #94a3b8;
        }
    </style>
</head>
<body>
    <div class="container">
        <img src="../icons/icon-192.png" alt="FishingTools" class="logo">
        <h1>FishingTools</h1>
        <p class="subtitle">Mappe batimetriche per pesca sportiva</p>

        <div class="download-options">
            <a href="fishingtools-v1.0.0.apk" class="download-btn android-btn" id="androidBtn">
                <img src="../icons/android-icon.svg" alt="Android">
                <span>Scarica per Android</span>
                <span style="font-size: 0.8rem; opacity: 0.8;">(48 MB)</span>
            </a>

            <a href="https://apps.apple.com/app/fishingtools/idXXXXXXXXX"
               class="download-btn ios-btn">
                <img src="../icons/apple-icon.svg" alt="iOS">
                <span>Scarica su App Store</span>
            </a>
        </div>

        <div class="version-info">
            <h3>Versione 1.0.0</h3>
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
            </ul>
        </div>

        <div class="instructions" id="androidInstructions" style="display: none;">
            <h4>⚠️ Installazione Android</h4>
            <ol>
                <li>Scarica il file APK</li>
                <li>Apri il file scaricato</li>
                <li>Se richiesto, abilita "Installa da origini sconosciute"</li>
                <li>Completa l'installazione</li>
            </ol>
        </div>
    </div>

    <script>
        // Rileva Android e mostra istruzioni
        if (/Android/i.test(navigator.userAgent)) {
            document.getElementById('androidInstructions').style.display = 'block';
        }
    </script>
</body>
</html>
```

---

## 5. DISTRIBUZIONE iOS (App Store)

### 5.1 Checklist Pubblicazione

- [ ] Account Apple Developer attivo (€99/anno) ✅ GIÀ PRESENTE
- [ ] App ID registrato su App Store Connect
- [ ] Certificati di distribuzione generati
- [ ] Provisioning profile creato
- [ ] Screenshots per tutti i device (6.7", 6.5", 5.5")
- [ ] App icon 1024x1024
- [ ] Privacy policy URL
- [ ] Descrizione app (IT, EN)
- [ ] Categoria: Navigation / Sports
- [ ] In-App Purchase configurati (monthly, yearly, lifetime)
- [ ] TestFlight build caricata
- [ ] Beta testing completato
- [ ] Submit for Review

### 5.2 Info.plist Permessi

```xml
<!-- ios/Runner/Info.plist -->
<key>NSLocationWhenInUseUsageDescription</key>
<string>FishingTools usa la tua posizione per mostrarti sulla mappa e registrare i punti di pesca.</string>

<key>NSLocationAlwaysAndWhenInUseUsageDescription</key>
<string>FishingTools usa la tua posizione in background per il tracking GPS durante la pesca.</string>

<key>UIBackgroundModes</key>
<array>
    <string>location</string>
</array>
```

### 5.3 In-App Purchase Setup

```
App Store Connect → In-App Purchases:

1. fishingtools_monthly
   - Type: Auto-Renewable Subscription
   - Price: €2.99
   - Duration: 1 month

2. fishingtools_yearly
   - Type: Auto-Renewable Subscription
   - Price: €19.99
   - Duration: 1 year

3. fishingtools_lifetime
   - Type: Non-Consumable
   - Price: €54.99
```

---

## 6. SISTEMA PAGAMENTI ANDROID (Stripe)

### 6.1 Flusso Pagamento

```
┌─────────────────────────────────────────────────────────┐
│                 FLUSSO ANDROID                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. Utente clicca "Acquista Premium" nell'app           │
│                      │                                   │
│                      ▼                                   │
│  2. App apre browser: tournamentmaster.it/purchase      │
│                      │                                   │
│                      ▼                                   │
│  3. Utente paga con Stripe (carta/PayPal)               │
│                      │                                   │
│                      ▼                                   │
│  4. Stripe webhook genera CODICE ATTIVAZIONE            │
│                      │                                   │
│                      ▼                                   │
│  5. Pagina mostra codice: "FISH-XXXX-XXXX-XXXX"        │
│     + Invia email con codice                            │
│                      │                                   │
│                      ▼                                   │
│  6. Utente torna all'app, inserisce codice              │
│                      │                                   │
│                      ▼                                   │
│  7. App verifica codice su server → Attiva Premium      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 6.2 Backend Semplice (PHP)

```php
<?php
// api/activate.php
header('Content-Type: application/json');

$code = $_POST['code'] ?? '';

// Verifica codice nel database
$db = new PDO('mysql:host=localhost;dbname=fishingtools', 'user', 'pass');
$stmt = $db->prepare('SELECT * FROM activation_codes WHERE code = ? AND used = 0');
$stmt->execute([$code]);
$row = $stmt->fetch();

if ($row) {
    // Marca come usato
    $db->prepare('UPDATE activation_codes SET used = 1, used_at = NOW() WHERE id = ?')
       ->execute([$row['id']]);

    echo json_encode([
        'success' => true,
        'type' => $row['type'], // monthly, yearly, lifetime
        'expiresAt' => $row['expires_at'] ? strtotime($row['expires_at']) * 1000 : null
    ]);
} else {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Codice non valido']);
}
```

### 6.3 Stripe Webhook

```php
<?php
// api/stripe-webhook.php
require 'vendor/autoload.php';

\Stripe\Stripe::setApiKey('sk_live_xxx');

$payload = @file_get_contents('php://input');
$sig_header = $_SERVER['HTTP_STRIPE_SIGNATURE'];
$endpoint_secret = 'whsec_xxx';

try {
    $event = \Stripe\Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
} catch(\Exception $e) {
    http_response_code(400);
    exit();
}

if ($event->type == 'checkout.session.completed') {
    $session = $event->data->object;

    // Genera codice attivazione
    $code = 'FISH-' . strtoupper(bin2hex(random_bytes(4))) . '-' .
            strtoupper(bin2hex(random_bytes(4))) . '-' .
            strtoupper(bin2hex(random_bytes(4)));

    $type = $session->metadata->type; // monthly, yearly, lifetime
    $email = $session->customer_email;

    // Calcola scadenza
    $expiresAt = null;
    if ($type == 'monthly') {
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 month'));
    } else if ($type == 'yearly') {
        $expiresAt = date('Y-m-d H:i:s', strtotime('+1 year'));
    }

    // Salva nel database
    $db = new PDO('mysql:host=localhost;dbname=fishingtools', 'user', 'pass');
    $stmt = $db->prepare('INSERT INTO activation_codes (code, type, email, expires_at) VALUES (?, ?, ?, ?)');
    $stmt->execute([$code, $type, $email, $expiresAt]);

    // Invia email con codice
    mail($email, 'FishingTools - Codice Attivazione',
         "Grazie per l'acquisto!\n\nIl tuo codice: $code\n\nInseriscilo nell'app per attivare Premium.");
}

http_response_code(200);
```

---

## 7. PUBBLICITÀ (Solo FREE)

### 7.1 Implementazione AdMob

```dart
// lib/services/ad_service.dart
import 'package:google_mobile_ads/google_mobile_ads.dart';

class AdService {
  BannerAd? _bannerAd;

  // Test IDs (sostituire con reali in produzione)
  static const String _bannerAdUnitId = Platform.isAndroid
      ? 'ca-app-pub-3940256099942544/6300978111'  // Test Android
      : 'ca-app-pub-3940256099942544/2934735716'; // Test iOS

  Future<void> init() async {
    await MobileAds.instance.initialize();
  }

  void loadBannerAd({required Function(BannerAd) onLoaded}) {
    _bannerAd = BannerAd(
      adUnitId: _bannerAdUnitId,
      size: AdSize.banner,
      request: const AdRequest(),
      listener: BannerAdListener(
        onAdLoaded: (ad) => onLoaded(ad as BannerAd),
        onAdFailedToLoad: (ad, error) {
          ad.dispose();
        },
      ),
    );
    _bannerAd!.load();
  }

  void dispose() {
    _bannerAd?.dispose();
  }
}
```

### 7.2 Widget Banner

```dart
// lib/widgets/ad_banner_widget.dart
class AdBannerWidget extends StatefulWidget {
  @override
  _AdBannerWidgetState createState() => _AdBannerWidgetState();
}

class _AdBannerWidgetState extends State<AdBannerWidget> {
  BannerAd? _bannerAd;
  bool _isLoaded = false;

  @override
  void initState() {
    super.initState();
    // Non mostrare ads a utenti premium
    if (!premiumService.isPremium) {
      _loadAd();
    }
  }

  void _loadAd() {
    adService.loadBannerAd(onLoaded: (ad) {
      setState(() {
        _bannerAd = ad;
        _isLoaded = true;
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!_isLoaded || _bannerAd == null) {
      return const SizedBox(height: 50);
    }

    return SizedBox(
      width: _bannerAd!.size.width.toDouble(),
      height: _bannerAd!.size.height.toDouble(),
      child: AdWidget(ad: _bannerAd!),
    );
  }
}
```

---

## 8. TIMELINE SVILUPPO

```
SETTIMANA 1-2: Setup + Mappa
├── Setup progetto Flutter
├── Configurazione build Android/iOS
├── Implementazione mappa base (flutter_map)
├── Integrazione tutti i 16 layer batimetrici
└── Selettore layer con preview

SETTIMANA 3: Funzionalità Core
├── GPS posizione singola
├── GPS tracking continuo
├── Salvataggio rotte
├── Luoghi preferiti
└── Storage locale (Hive)

SETTIMANA 4: Zone e Catture
├── Zone gara (visualizzazione)
├── Zone personalizzate (creazione/modifica)
├── Catch log
├── Righello misure
└── Export GPX/CSV

SETTIMANA 5: Premium + Pagamenti
├── Sistema FREE/Premium
├── UI lock sezioni premium
├── AdMob integrazione
├── iOS In-App Purchase
├── Android Stripe integration
└── Backend codici attivazione

SETTIMANA 6: Localizzazione + Polish
├── 10 lingue (traduzioni)
├── UI polish e animazioni
├── Performance optimization
├── Bug fixing
└── Testing su device reali

SETTIMANA 7: Release
├── Build APK release firmato
├── Upload APK su sito
├── Build iOS release
├── Submit App Store
├── Landing page download
└── Documentazione utente
```

---

## 9. CHECKLIST PRE-RELEASE

### Android
- [ ] APK firmato con release key
- [ ] ProGuard/R8 abilitato (offuscamento)
- [ ] Testato su Android 8, 10, 12, 14
- [ ] Permessi minimi necessari
- [ ] Pagina download pronta
- [ ] version.json configurato

### iOS
- [ ] Certificati distribuzione validi
- [ ] TestFlight testing completato
- [ ] Screenshots tutti i formati
- [ ] Privacy policy pubblicata
- [ ] In-App Purchase testati
- [ ] Review guidelines rispettate

### Backend
- [ ] Stripe account configurato
- [ ] Webhook funzionante
- [ ] Database attivazioni pronto
- [ ] Email transazionali funzionanti
- [ ] SSL attivo su tutti gli endpoint

---

## 10. STIMA COSTI ANNUALI

| Voce | Costo |
|------|-------|
| Apple Developer | €99 (già pagato) |
| Google Play | €0 (non usato) |
| Hosting (tournamentmaster.it) | €0 (esistente) |
| Stripe | 1.4% + €0.25 per transazione |
| AdMob | €0 (guadagno) |
| **TOTALE FISSO** | **€99/anno** |

### Revenue Stimata (conservativa)

```
Anno 1:
├── 1000 download Android
├── 500 download iOS
├── 10% conversione premium = 150 utenti
├── €19.99 × 150 = €2,998 lordi
├── - Commissioni Apple (30% su iOS): ~€300
├── - Commissioni Stripe (Android): ~€50
└── NETTO: ~€2,648

Pubblicità (utenti free):
├── 1350 utenti free
├── €0.50-2 CPM stimato
├── ~€200-500/anno
```

---

*Documento aggiornato: 2026-04-09 — PWA v2.4.3*
*Strategia: Flutter + Distribuzione Ibrida (APK sito + iOS App Store)*
