# ✅ Test Maintenant - Étapes Simples

## 🚀 Étape 1: Redémarrer le Backend

Dans le terminal où le backend tourne:
1. Appuyez sur **Ctrl+C** pour arrêter le backend
2. Redémarrez-le:
   ```bash
   cd backend
   npm start
   ```

**Vous devez voir:**
```
📱 Pour connecter votre iPhone, utilisez cette IP:
   http://192.168.1.128:3000/api
```

✅ Si vous voyez `192.168.1.128`, c'est bon! Passez à l'étape 2.
❌ Si vous voyez encore `192.168.56.1`, dites-moi.

## 🔥 Étape 2: Autoriser le Firewall (IMPORTANT!)

Ouvrez PowerShell **en tant qu'administrateur** et exécutez:

```powershell
New-NetFirewallRule -DisplayName "Node.js Backend Port 3000" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow
```

✅ Si ça dit "Ok" ou ne montre pas d'erreur, c'est bon!

## 📱 Étape 3: Tester depuis Safari sur iPhone

1. **Assurez-vous que votre iPhone et PC sont sur le MÊME réseau Wi-Fi**
2. Ouvrez **Safari** sur l'iPhone
3. Allez à: `http://192.168.1.128:3000/api/plants`

**Résultats possibles:**
- ✅ **Vous voyez du JSON avec des plantes** → C'est parfait! Passez à l'étape 4
- ❌ **Erreur ou page blanche** → Vérifiez le firewall (étape 2) et le Wi-Fi

## 📲 Étape 4: Redémarrer l'App Expo

Dans un **nouveau terminal PowerShell**:

```bash
cd plantcare-mobile
npm start -- --clear
```

Scannez le QR code avec Expo Go sur votre iPhone.

## ✅ Résultat Attendu

L'app devrait maintenant:
- ✅ Se connecter en **5 secondes maximum** (au lieu de 15)
- ✅ Afficher les plantes avec leurs données
- ✅ Ne plus faire de timeout

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifiez les logs Expo** - Regardez le terminal où Expo tourne pour voir les erreurs
2. **Vérifiez les logs du backend** - Regardez si des requêtes arrivent
3. **Testez dans Safari d'abord** - Si Safari ne fonctionne pas, l'app ne fonctionnera pas non plus

## 📋 Checklist Rapide

- [ ] Backend redémarré et affiche `192.168.1.128`
- [ ] Firewall autorise le port 3000
- [ ] Test Safari iPhone fonctionne: `http://192.168.1.128:3000/api/plants`
- [ ] App Expo redémarrée avec `--clear`
- [ ] iPhone et PC sur le même Wi-Fi

