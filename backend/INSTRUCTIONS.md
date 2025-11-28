# Instructions pour démarrer le backend

## 🚀 Démarrage rapide

1. **Installer les dépendances:**
   ```bash
   cd backend
   npm install
   ```

2. **Démarrer le serveur:**
   ```bash
   npm start
   ```
   Ou en mode développement avec auto-reload:
   ```bash
   npm run dev
   ```

3. **Le serveur démarre sur:** `http://localhost:3000`

## 📱 Configuration de l'app mobile

Pour que l'app mobile se connecte au backend, vous devez:

### Option 1: Utiliser l'adresse IP de votre PC (recommandé pour iPhone)

1. Trouvez l'adresse IP de votre PC:
   - Windows: Ouvrez PowerShell et tapez `ipconfig`
   - Cherchez "IPv4 Address" (ex: 192.168.1.100)

2. Modifiez `plantcare-mobile/src/services/api.ts`:
   ```typescript
   const API_BASE_URL = 'http://192.168.1.100:3000/api';
   ```
   (Remplacez 192.168.1.100 par votre IP)

### Option 2: Utiliser localhost (pour émulateur Android)

Si vous utilisez un émulateur Android, vous pouvez utiliser:
```typescript
const API_BASE_URL = 'http://10.0.2.2:3000/api';
```

## ✅ Vérification

Une fois le backend démarré, vous devriez voir:
```
🌱 PlantCare Backend Server running on http://localhost:3000
📡 WebSocket server ready for real-time updates
🔌 API endpoints available at http://localhost:3000/api
```

Testez l'API dans votre navigateur:
- http://localhost:3000/api/plants
- http://localhost:3000/api/notifications

## 🔧 Dépannage

**Erreur "Cannot connect to server":**
- Vérifiez que le backend est bien démarré
- Vérifiez que le port 3000 n'est pas utilisé par un autre programme
- Vérifiez votre firewall Windows

**L'app ne reçoit pas les données:**
- Vérifiez que l'IP dans `api.ts` correspond à l'IP de votre PC
- Assurez-vous que votre iPhone et PC sont sur le même réseau Wi-Fi
- Vérifiez que le backend est accessible depuis votre navigateur

