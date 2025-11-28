# ✅ ngrok est maintenant configuré!

## 📋 Ce qui a été fait

1. ✅ ngrok installé et démarré
2. ✅ URL ngrok: `https://2a4f7a5fe0fe.ngrok-free.app`
3. ✅ `api.ts` modifié pour utiliser ngrok

## 🚀 Prochaines étapes

### 1. Redémarrer l'app Expo

Dans le terminal où Expo tourne:
1. Appuyez sur **Ctrl+C** pour arrêter
2. Redémarrez avec:
   ```bash
   cd plantcare-mobile
   npm start -- --clear
   ```

### 2. Scannez le QR code avec Expo Go

L'app devrait maintenant se connecter via ngrok!

## ⚠️ Notes importantes

### Si vous redémarrez ngrok:
L'URL changera! Vous devrez:
1. Copier la nouvelle URL ngrok
2. Modifier `plantcare-mobile/src/services/api.ts` ligne 7:
   ```typescript
   const NGROK_URL = 'https://NOUVELLE-URL.ngrok-free.app';
   ```
3. Redémarrer l'app Expo

### Gardez ngrok ouvert:
- **Ne fermez pas** le terminal où ngrok tourne
- Si vous fermez ngrok, l'app ne pourra plus se connecter

### Test rapide:
Ouvrez dans Safari sur iPhone:
```
https://2a4f7a5fe0fe.ngrok-free.app/api/plants
```

Vous devriez voir du JSON avec les plantes!

## ✅ Checklist

- [ ] ngrok tourne et affiche l'URL
- [ ] `api.ts` modifié avec l'URL ngrok
- [ ] App Expo redémarrée avec `--clear`
- [ ] Test Safari iPhone fonctionne
- [ ] App mobile se connecte correctement

## 🎉 C'est tout!

Votre app devrait maintenant fonctionner depuis l'iPhone via ngrok!

