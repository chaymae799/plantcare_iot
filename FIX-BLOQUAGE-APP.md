# 🔧 Fix: App reste bloquée sur "Opening project..."

## Problème
L'app reste bloquée sur l'écran de chargement Expo même après un timeout.

## ✅ Modifications effectuées

1. **Header ngrok ajouté** - `ngrok-skip-browser-warning: true` pour contourner la page de warning
2. **Vérification du Content-Type** - Détecte si la réponse est HTML (page de warning) au lieu de JSON
3. **Timeout de secours** - 10 secondes maximum pour éviter le blocage
4. **Meilleure gestion d'erreur** - L'app affiche une alerte et arrête le chargement

## 🚀 Testez maintenant

### 1. Redémarrer l'app Expo

```bash
cd plantcare-mobile
npm start -- --clear
```

### 2. Scannez le QR code

L'app devrait maintenant:
- ✅ Se connecter en 5-10 secondes maximum
- ✅ Afficher une alerte si la connexion échoue
- ✅ Ne plus rester bloquée indéfiniment

### 3. Si ça ne fonctionne toujours pas

**Testez dans Safari sur iPhone:**
```
https://2a4f7a5fe0fe.ngrok-free.app/api/plants
```

**Si Safari affiche une page de warning ngrok:**
1. Cliquez sur "Visit Site"
2. Vous devriez voir du JSON
3. L'app devrait maintenant fonctionner (le header `ngrok-skip-browser-warning` devrait contourner ça)

**Si Safari ne charge rien:**
- Vérifiez que ngrok tourne toujours
- Vérifiez que le backend est démarré
- Redémarrez ngrok et mettez à jour l'URL dans `api.ts`

## 📋 Checklist

- [ ] Header `ngrok-skip-browser-warning` ajouté (✅ fait)
- [ ] Vérification Content-Type ajoutée (✅ fait)
- [ ] Timeout de secours ajouté (✅ fait)
- [ ] App Expo redémarrée avec `--clear`
- [ ] Test Safari iPhone fonctionne
- [ ] App mobile se connecte correctement

## 🆘 Si l'app reste bloquée

1. **Fermez complètement Expo Go** sur l'iPhone
2. **Redémarrez Expo** avec `npm start -- --clear`
3. **Scannez un nouveau QR code**
4. **Attendez 10 secondes maximum** - une alerte devrait apparaître

## 💡 Note

Si vous voyez l'alerte d'erreur, c'est bon signe! Cela signifie que l'app ne reste plus bloquée et vous indique le problème.

