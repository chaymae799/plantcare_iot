# 🚀 Solution ngrok - Le Plus Simple!

## Pourquoi ngrok?

Si le routeur bloque les communications entre appareils, ngrok crée un tunnel HTTPS qui fonctionne depuis n'importe où!

## 📥 Installation

### Option 1: Téléchargement direct
1. Allez sur: https://ngrok.com/download
2. Téléchargez pour Windows
3. Extrayez `ngrok.exe` dans un dossier (ex: `C:\ngrok\`)

### Option 2: Via PowerShell (si vous avez Chocolatey)
```powershell
choco install ngrok
```

## 🚀 Utilisation

### Étape 1: Démarrer le backend
```bash
cd backend
npm start
```

### Étape 2: Dans un NOUVEAU terminal, démarrez ngrok
```bash
ngrok http 3000
```

**Vous verrez quelque chose comme:**
```
Forwarding: https://abc123def456.ngrok.io -> http://localhost:3000
```

**Copiez l'URL HTTPS** (ex: `https://abc123def456.ngrok.io`)

### Étape 3: Modifier api.ts

Ouvrez `plantcare-mobile/src/services/api.ts` et modifiez:

```typescript
// Remplacez cette ligne:
const API_BASE_URL = __DEV__ 
  ? `http://${YOUR_PC_IP}:3000/api`
  : 'https://your-production-url.com/api';

// Par:
const API_BASE_URL = __DEV__ 
  ? 'https://abc123def456.ngrok.io/api'  // ⚠️ Remplacez par votre URL ngrok!
  : 'https://your-production-url.com/api';
```

**Ou plus simplement, remplacez toute la section:**

```typescript
// API service pour communiquer avec le backend

// URL ngrok (obtenue avec: ngrok http 3000)
const NGROK_URL = 'https://abc123def456.ngrok.io'; // ⚠️ CHANGEZ CETTE URL!

const API_BASE_URL = __DEV__ 
  ? `${NGROK_URL}/api`
  : 'https://your-production-url.com/api';
```

### Étape 4: Redémarrer l'app Expo
```bash
cd plantcare-mobile
npm start -- --clear
```

## ✅ Avantages

- ✅ Fonctionne même si le routeur bloque
- ✅ HTTPS sécurisé
- ✅ Fonctionne depuis n'importe où (pas besoin du même Wi-Fi!)
- ✅ Pas besoin de configurer le firewall
- ✅ Simple et rapide

## ⚠️ Notes

1. **L'URL ngrok change** à chaque fois que vous redémarrez ngrok (sauf avec un compte payant)
2. **Mettez à jour `api.ts`** si vous redémarrez ngrok
3. **Gardez ngrok ouvert** pendant que vous testez l'app

## 🎯 Workflow Complet

1. Terminal 1: `cd backend && npm start`
2. Terminal 2: `ngrok http 3000` (copiez l'URL)
3. Modifiez `api.ts` avec l'URL ngrok
4. Terminal 3: `cd plantcare-mobile && npm start -- --clear`
5. Scannez le QR code avec Expo Go

## 🆘 Si ngrok ne fonctionne pas

1. Vérifiez que le backend est démarré
2. Vérifiez que ngrok pointe vers le bon port (3000)
3. Vérifiez que l'URL dans `api.ts` est correcte (avec `/api` à la fin)
4. Redémarrez ngrok et mettez à jour l'URL

