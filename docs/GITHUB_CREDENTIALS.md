# Credenziali GitHub - BathymetryExplorer

**Data:** 2026-01-15
**Progetto:** BathymetryExplorer PWA

---

## Account GitHub

| Campo | Valore |
|-------|--------|
| **Username** | Marinovinc |
| **Email** | marino@unitec.it |
| **Nome** | Vincenzo Marino |

---

## Repository

| Campo | Valore |
|-------|--------|
| **Nome** | BathymetryExplorer |
| **URL Repository** | https://github.com/Marinovinc/BathymetryExplorer |
| **URL GitHub Pages** | https://marinovinc.github.io/BathymetryExplorer/ |
| **Visibilità** | Public |

---

## Accesso da Browser

1. Vai su https://github.com/login
2. Inserisci username: `Marinovinc`
3. Inserisci password (non memorizzata in questo documento)
4. Completa eventuale 2FA se abilitato

---

## Accesso da Linea di Comando (Git)

### Verifica configurazione attuale
```bash
git config user.name
git config user.email
```

### Configurazione (se necessario)
```bash
git config --global user.name "Vincenzo Marino"
git config --global user.email "marino@unitec.it"
```

### Autenticazione GitHub CLI
```bash
# Verifica se autenticato
gh auth status

# Login (se necessario)
gh auth login
```

---

## Comandi Git Essenziali

### Push modifiche
```bash
cd D:/Dev/BathymetryExplorer
git add .
git commit -m "descrizione modifica"
git push
```

### Pull aggiornamenti
```bash
cd D:/Dev/BathymetryExplorer
git pull
```

### Verifica stato
```bash
git status
git log --oneline -5
```

---

## GitHub Pages

L'app è accessibile pubblicamente all'URL:

**https://marinovinc.github.io/BathymetryExplorer/**

### Come funziona
- GitHub Pages serve i file statici dal branch `master`
- Ogni `git push` aggiorna automaticamente il sito
- Tempo di propagazione: ~1-2 minuti dopo il push

### PWA su Smartphone
1. Apri l'URL sopra nel browser del telefono
2. Il browser mostrerà "Installa app" o "Aggiungi a Home"
3. L'app sarà disponibile come icona sulla home screen
4. Scarica le mappe offline PRIMA di andare in mare

---

## Struttura Repository

```
BathymetryExplorer/
├── index.html          # App principale
├── manifest.json       # Manifest PWA
├── sw.js              # Service Worker (offline)
├── zones_data.js      # Dati zone di gara
├── icons/             # Icone PWA (72-512px)
├── screenshots/       # Screenshot documentazione
└── docs/              # Documentazione
```

---

## Note di Sicurezza

- La password GitHub NON è memorizzata in questo documento
- L'autenticazione Git usa il credential manager di Windows
- Per cambiare password: https://github.com/settings/security
- Per gestire 2FA: https://github.com/settings/two_factor_authentication

---

**Documento creato da:** Claude Code (Opus 4.5)
**Ultima modifica:** 2026-01-15
