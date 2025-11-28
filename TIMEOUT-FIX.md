# 🔧 Fix du Timeout sur iPhone

## Problème: "Connection timeout" sur iPhone

Si votre iPhone affiche un timeout, suivez ces étapes dans l'ordre:

## ✅ Étape 1: Vérifier que le backend est démarré

Dans un terminal PowerShell:
```bash
cd backend
npm start
```

Vous devriez voir:
```
🌱 PlantCare Backend Server running on http://localhost:3000
📡 WebSocket server ready for real-time updates
🔌 API endpoints available at http://localhost:3000/api

📱 Pour connecter votre iPhone, utilisez cette IP:
   http://192.168.1.128:3000/api
```

**Notez l'IP affichée!** C'est celle que vous devez utiliser.

## ✅ Étape 2: Vérifier l'IP dans api.ts

Ouvrez `plantcare-mobile/src/services/api.ts` et vérifiez que l'IP correspond à celle affichée par le backend:

```typescript
const YOUR_PC_IP = '192.168.1.128'; // ⚠️ Doit correspondre à l'IP du backend!
```

## ✅ Étape 3: Tester depuis votre navigateur PC

Ouvrez votre navigateur et allez à:
```
http://192.168.1.128:3000/api/plants
```
(Remplacez par votre IP)

**Si ça ne fonctionne PAS:**
- Le backend n'est pas démarré, ou
- Le firewall bloque le port 3000

**Si ça fonctionne:**
- Le backend est OK, le problème vient de la connexion iPhone

## ✅ Étape 4: Tester depuis Safari sur iPhone

1. Assurez-vous que votre iPhone est sur le **même réseau Wi-Fi** que votre PC
2. Ouvrez Safari sur l'iPhone
3. Allez à: `http://192.168.1.128:3000/api/plants`
   (Remplacez par votre IP)

**Si ça ne fonctionne PAS:**
- Vérifiez le firewall Windows (voir Étape 5)
- Vérifiez que l'iPhone et le PC sont sur le même Wi-Fi
- Essayez de désactiver temporairement le firewall pour tester

**Si ça fonctionne:**
- Le problème vient de l'app Expo, pas du backend

## ✅ Étape 5: Autoriser le port 3000 dans le Firewall

### Méthode rapide (PowerShell en Admin):
```powershell
New-NetFirewallRule -DisplayName "Node.js Backend Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

### Méthode manuelle:
1. Ouvrez **Paramètres Windows**
2. Allez dans **Sécurité** > **Pare-feu Windows Defender**
3. Cliquez sur **Paramètres avancés**
4. Cliquez sur **Règles de trafic entrant** > **Nouvelle règle**
5. Sélectionnez **Port** > **Suivant**
6. Sélectionnez **TCP** et entrez **3000** > **Suivant**
7. Sélectionnez **Autoriser la connexion** > **Suivant**
8. Cochez tous les profils > **Suivant**
9. Nommez la règle "Node.js Backend" > **Terminer**

## ✅ Étape 6: Vérifier le réseau Wi-Fi

**IMPORTANT:** L'iPhone et le PC doivent être sur le **même réseau Wi-Fi**.

Vérifiez:
- L'iPhone n'est pas sur un réseau invité
- L'iPhone n'est pas sur un réseau isolé
- Les deux appareils sont sur le même routeur

## ✅ Étape 7: Redémarrer l'app Expo

1. Arrêtez l'app Expo (Ctrl+C dans le terminal)
2. Redémarrez:
   ```bash
   cd plantcare-mobile
   npm start -- --clear
   ```
3. Scannez le nouveau QR code avec Expo Go

## ✅ Étape 8: Vérifier les logs

Dans le terminal du backend, vous devriez voir des requêtes quand l'app essaie de se connecter.

Si vous ne voyez **aucune requête**, c'est que:
- L'IP est incorrecte dans `api.ts`
- Le firewall bloque complètement
- L'iPhone n'est pas sur le bon réseau

## 🎯 Checklist rapide

- [ ] Backend démarré et affiche l'IP
- [ ] IP dans `api.ts` correspond à l'IP du backend
- [ ] Test navigateur PC fonctionne: `http://VOTRE_IP:3000/api/plants`
- [ ] Test Safari iPhone fonctionne: `http://VOTRE_IP:3000/api/plants`
- [ ] Firewall autorise le port 3000
- [ ] iPhone et PC sur le même Wi-Fi
- [ ] App Expo redémarrée avec `--clear`

## 🆘 Si rien ne fonctionne

1. **Désactivez temporairement le firewall** pour tester
2. **Utilisez un hotspot mobile** sur votre iPhone et connectez votre PC à ce hotspot
3. **Vérifiez les logs Expo** dans le terminal pour voir les erreurs exactes

