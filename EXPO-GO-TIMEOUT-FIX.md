# 🔧 Résoudre le Timeout avec Expo Go

## Problème: Timeout dans Expo Go alors que le backend fonctionne

### ✅ Solution 1: Redémarrer le backend (IMPORTANT)

Le serveur doit écouter sur `0.0.0.0` pour être accessible depuis l'iPhone.

1. **Arrêtez le backend** (Ctrl+C)
2. **Redémarrez-le:**
   ```bash
   cd backend
   npm start
   ```

3. **Vérifiez le message** - vous devriez voir:
   ```
   📱 Access from mobile: http://192.168.1.128:3000/api
   💡 Configurez cette IP dans plantcare-mobile/src/services/api.ts
   ```

### ✅ Solution 2: Vérifier l'IP dans api.ts

L'IP actuelle est `192.168.1.128`. Vérifiez que c'est la bonne:

1. **Trouvez votre IP:**
   ```powershell
   ipconfig
   ```
   Cherchez "IPv4 Address" sous votre connexion Wi-Fi

2. **Mettez à jour** `plantcare-mobile/src/services/api.ts`:
   ```typescript
   const YOUR_PC_IP = '192.168.1.128'; // Votre IP réelle
   ```

3. **Redémarrez Expo** (arrêtez et relancez `npm start`)

### ✅ Solution 3: Tester depuis l'iPhone (Safari)

Sur votre iPhone, ouvrez Safari et allez à:
```
http://192.168.1.128:3000/api/plants
```

- ✅ **Si ça fonctionne**: L'IP est correcte, le problème vient d'Expo Go
- ❌ **Si ça ne fonctionne pas**: Problème de réseau/firewall

### ✅ Solution 4: Autoriser le Firewall Windows

Le firewall peut bloquer les connexions entrantes:

```powershell
# Exécutez en tant qu'administrateur
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### ✅ Solution 5: Vérifier le réseau

- ✅ iPhone et PC sur **exactement le même Wi-Fi**
- ❌ Pas de réseau invité ou isolé
- ❌ Pas de VPN qui bloque

### ✅ Solution 6: Utiliser l'IP affichée par le backend

Quand vous démarrez le backend, il affiche maintenant votre IP. Utilisez exactement cette IP dans `api.ts`.

## 🔍 Diagnostic étape par étape

1. **Backend redémarré?** (écoute sur 0.0.0.0)
2. **IP correcte dans api.ts?** (même que celle affichée par le backend)
3. **Test Safari sur iPhone fonctionne?** (http://VOTRE_IP:3000/api/plants)
4. **Firewall autorisé?** (port 3000)
5. **Même réseau Wi-Fi?** (iPhone et PC)
6. **Expo redémarré?** (après modification de l'IP)

## ⚠️ Erreurs courantes

**"Connection timeout"**
→ Vérifiez que le backend écoute sur 0.0.0.0 (redémarrez-le)

**"Network request failed"**
→ Vérifiez l'IP et que iPhone/PC sont sur le même réseau

**"Cannot connect"**
→ Testez d'abord dans Safari sur iPhone

## 🎯 Test rapide

1. Démarrez le backend → notez l'IP affichée
2. Testez dans Safari iPhone → http://IP:3000/api/plants
3. Si ça marche, mettez la même IP dans api.ts
4. Redémarrez Expo Go

