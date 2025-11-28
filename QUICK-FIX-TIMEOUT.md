# ⚡ Fix Rapide - Timeout sur iPhone

## ✅ Modifications effectuées

1. **Timeout réduit de 15s à 5s** - L'erreur apparaîtra plus rapidement
2. **Meilleure détection d'erreurs** - Messages plus clairs
3. **Serveur écoute sur toutes les interfaces** - Accessible depuis l'iPhone

## 🔍 Diagnostic Rapide (2 minutes)

### Étape 1: Vérifier que le backend est démarré

Dans un terminal PowerShell:
```bash
cd backend
npm start
```

**Vous devez voir:**
```
🌱 PlantCare Backend Server running on http://localhost:3000
📡 WebSocket server ready for real-time updates
🔌 API endpoints available at http://localhost:3000/api

📱 Pour connecter votre iPhone, utilisez cette IP:
   http://192.168.1.128:3000/api
```

**Notez l'IP affichée!** (ex: 192.168.1.128)

### Étape 2: Vérifier l'IP dans api.ts

Ouvrez `plantcare-mobile/src/services/api.ts` ligne 7:

```typescript
const YOUR_PC_IP = '192.168.1.128'; // ⚠️ Doit correspondre à l'IP du backend!
```

**L'IP doit être EXACTEMENT la même que celle affichée par le backend!**

### Étape 3: Tester depuis votre PC

Ouvrez votre navigateur et allez à:
```
http://192.168.1.128:3000/api/plants
```
(Remplacez par votre IP)

**Si ça ne fonctionne PAS:**
- Le backend n'est pas démarré, ou
- Le firewall bloque

**Si ça fonctionne:**
- Le backend est OK, continuez à l'étape 4

### Étape 4: Autoriser le Firewall (IMPORTANT!)

**Option A - PowerShell (Admin):**
```powershell
New-NetFirewallRule -DisplayName "Node.js Backend Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

**Option B - Interface Windows:**
1. Ouvrez **Paramètres Windows**
2. **Sécurité** > **Pare-feu Windows Defender**
3. **Paramètres avancés**
4. **Règles de trafic entrant** > **Nouvelle règle**
5. **Port** > **TCP** > **3000** > **Autoriser la connexion**

### Étape 5: Tester depuis Safari sur iPhone

1. **Assurez-vous que l'iPhone et le PC sont sur le MÊME réseau Wi-Fi**
2. Ouvrez **Safari** sur l'iPhone
3. Allez à: `http://192.168.1.128:3000/api/plants`
   (Remplacez par votre IP)

**Si ça ne fonctionne PAS:**
- Vérifiez que vous êtes sur le même Wi-Fi
- Vérifiez le firewall (étape 4)
- Essayez de désactiver temporairement le firewall pour tester

**Si ça fonctionne:**
- Le problème vient de l'app Expo, pas du backend
- Redémarrez l'app Expo (étape 6)

### Étape 6: Redémarrer l'app Expo

```bash
cd plantcare-mobile
npm start -- --clear
```

Scannez le nouveau QR code avec Expo Go.

## 🎯 Checklist Express

- [ ] Backend démarré et affiche l'IP
- [ ] IP dans `api.ts` = IP du backend
- [ ] Test navigateur PC: `http://VOTRE_IP:3000/api/plants` fonctionne
- [ ] Firewall autorise le port 3000
- [ ] Test Safari iPhone: `http://VOTRE_IP:3000/api/plants` fonctionne
- [ ] App Expo redémarrée avec `--clear`

## ⚠️ Problèmes Courants

### "L'IP change à chaque fois"
→ Configurez une IP statique dans les paramètres de votre routeur

### "Safari fonctionne mais l'app ne fonctionne pas"
→ Redémarrez Expo avec `npm start -- --clear`
→ Vérifiez les logs Expo pour voir les erreurs exactes

### "Timeout après 5 secondes"
→ Le backend n'est pas accessible depuis l'iPhone
→ Vérifiez le firewall (étape 4)
→ Vérifiez que vous êtes sur le même Wi-Fi

### "Network request failed"
→ Problème de connexion réseau
→ Vérifiez l'IP dans `api.ts`
→ Testez dans Safari d'abord

## 🆘 Si rien ne fonctionne

1. **Désactivez temporairement le firewall** pour tester
2. **Utilisez un hotspot mobile** - Connectez votre PC au hotspot de l'iPhone
3. **Vérifiez les logs Expo** dans le terminal pour voir les erreurs exactes

