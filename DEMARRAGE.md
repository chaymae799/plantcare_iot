# 🚀 Guide de Démarrage - PlantCare IoT

## Étape 1: Démarrer le Backend (Simulation des Capteurs)

Le backend simule les capteurs IoT et génère les données automatiquement.

```bash
cd backend
npm install
npm start
```

✅ Vous devriez voir:
```
🌱 PlantCare Backend Server running on http://localhost:3000
📡 WebSocket server ready for real-time updates
🔌 API endpoints available at http://localhost:3000/api
```

**Les capteurs sont maintenant actifs et génèrent des données toutes les 5 secondes!**

## Étape 2: Configurer l'App Mobile

### Trouver l'IP de votre PC:

1. Ouvrez PowerShell
2. Tapez: `ipconfig`
3. Cherchez **"IPv4 Address"** (ex: `192.168.1.100`)

### Modifier l'API dans l'app:

Ouvrez `plantcare-mobile/src/services/api.ts` et changez:

```typescript
const YOUR_PC_IP = '192.168.1.100'; // ⚠️ Remplacez par VOTRE IP!
```

## Étape 3: Démarrer l'App Mobile

```bash
cd plantcare-mobile
npm start
```

Puis scannez le QR code avec Expo Go sur votre iPhone.

## ✅ Vérification

### Test 1: Backend fonctionne?
Ouvrez dans votre navigateur:
- http://localhost:3000/api/plants

Vous devriez voir les données des plantes avec les valeurs des capteurs.

### Test 2: Capteurs simulés?
Les données changent automatiquement:
- **Humidité**: Diminue graduellement (plante consomme l'eau)
- **Température**: Varie selon l'heure (jour/nuit)
- **Lumière**: Suit un cycle jour/nuit

### Test 3: App se connecte?
Si l'app affiche les plantes avec des données qui changent, c'est bon! ✅

## 📊 Ce qui est simulé

### Capteurs IoT simulés:
- ✅ **Capteur d'humidité**: Mesure l'humidité du sol (0-100%)
- ✅ **Capteur de température**: Mesure la température ambiante (15-30°C)
- ✅ **Capteur de lumière**: Mesure l'intensité lumineuse (0-100%)

### Comportement réaliste:
- L'humidité diminue avec le temps (plante boit)
- La température suit un cycle jour/nuit
- La lumière est forte le jour, faible la nuit
- Les données sont mises à jour toutes les 5 secondes

## 🎯 Fonctionnalités disponibles

1. **Voir les plantes** avec leurs données de capteurs en temps réel
2. **Arroser une plante** (augmente l'humidité)
3. **Recevoir des notifications** si une plante a besoin d'eau
4. **Voir l'historique** des données de capteurs
5. **Ajouter de nouvelles plantes**

## 🐛 Problèmes courants

**"Cannot connect to server"**
- ✅ Vérifiez que le backend est démarré
- ✅ Vérifiez l'IP dans `api.ts`
- ✅ Vérifiez que iPhone et PC sont sur le même Wi-Fi

**Les données ne changent pas**
- ✅ Attendez 5 secondes (mise à jour automatique)
- ✅ Vérifiez la console du backend pour les logs

**Port 3000 déjà utilisé**
- ✅ Changez le port dans `backend/.env`: `PORT=3001`
- ✅ Changez aussi dans `api.ts`: `:3001`

## 🎉 C'est tout!

Votre système IoT de plantes connectées est maintenant opérationnel avec simulation complète des capteurs!

