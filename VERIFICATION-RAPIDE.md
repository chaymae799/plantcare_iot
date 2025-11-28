# ✅ Vérification Rapide - Timeout Expo Go

## 📋 Checklist

### 1. IP Wi-Fi correcte
Votre IP Wi-Fi est: **192.168.1.128** ✅

Vérifiez dans `plantcare-mobile/src/services/api.ts`:
```typescript
const YOUR_PC_IP = '192.168.1.128'; // ✅ Correct
```

### 2. Backend écoute sur 0.0.0.0
Le backend doit être redémarré pour écouter sur toutes les interfaces.

**Redémarrez le backend:**
```bash
cd backend
npm start
```

Vous devriez voir:
```
📱 Access from mobile: http://192.168.1.128:3000/api
```

### 3. Port du backend
Le backend utilise **TOUJOURS le port 3000** (ne change pas).

Le port qui change (8082/8083) est pour **Expo Metro bundler**, pas pour le backend.

### 4. Test depuis iPhone (Safari)
Sur votre iPhone, ouvrez Safari et testez:
```
http://192.168.1.128:3000/api/plants
```

- ✅ Si ça fonctionne → L'IP est correcte, problème Expo Go
- ❌ Si ça ne fonctionne pas → Problème réseau/firewall

### 5. Firewall Windows
Autorisez le port 3000:

```powershell
# Exécutez en tant qu'administrateur
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

## 🔍 Diagnostic

**Le timeout vient probablement de:**
1. ❌ Backend n'écoute pas sur 0.0.0.0 (redémarrez-le)
2. ❌ Firewall bloque le port 3000
3. ❌ iPhone et PC pas sur le même Wi-Fi
4. ❌ IP incorrecte dans api.ts

**Le port Expo (8082/8083) n'est PAS le problème** - c'est juste pour Metro bundler.

## ✅ Solution rapide

1. **Redémarrez le backend** (pour écouter sur 0.0.0.0)
2. **Vérifiez l'IP** dans api.ts (192.168.1.128)
3. **Testez dans Safari iPhone** (http://192.168.1.128:3000/api/plants)
4. **Autorisez le firewall** si nécessaire
5. **Redémarrez Expo** après modifications

