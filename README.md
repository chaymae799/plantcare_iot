# 🌱 PlantCare IoT - Système de Plantes Connectées

Projet IoT complet pour la gestion de plantes connectées avec simulation de capteurs.

## 📁 Structure du Projet

```
IOT/
├── backend/              # Backend Node.js/Express
│   ├── server.js        # Serveur principal
│   ├── services/        # Services (simulation capteurs, gestion plantes)
│   └── package.json
│
└── plantcare-mobile/    # Application mobile React Native/Expo
    ├── src/
    │   ├── App.tsx      # Application principale
    │   ├── screens/      # Écrans de l'app
    │   ├── components/   # Composants réutilisables
    │   └── services/     # Services API
    └── package.json
```

## 🚀 Démarrage Rapide

### 1. Backend (Serveur API)

```bash
cd backend
npm install
npm start
```

Le serveur démarre sur `http://localhost:3000`

### 2. Application Mobile

```bash
cd plantcare-mobile
npm install
npm start
```

Puis scannez le QR code avec Expo Go sur votre iPhone.

## ⚙️ Configuration pour iPhone

**IMPORTANT:** Pour que votre iPhone se connecte au backend, vous devez:

1. **Trouver l'IP de votre PC:**
   ```powershell
   ipconfig
   ```
   Cherchez "IPv4 Address" (ex: `192.168.1.100`)

2. **Modifier `plantcare-mobile/src/services/api.ts`:**
   ```typescript
   const YOUR_PC_IP = '192.168.1.100'; // Remplacez par votre IP
   ```

3. **Assurez-vous que:**
   - Votre iPhone et PC sont sur le même réseau Wi-Fi
   - Le backend est démarré
   - Le firewall Windows autorise le port 3000

## 🎯 Fonctionnalités

### Backend
- ✅ Simulation réaliste de capteurs IoT (humidité, température, lumière)
- ✅ API REST complète
- ✅ WebSocket pour mises à jour en temps réel
- ✅ Notifications automatiques
- ✅ Historique des données

### Application Mobile
- ✅ Affichage des plantes et leurs données
- ✅ Détails en temps réel
- ✅ Arrosage des plantes
- ✅ Notifications
- ✅ Graphiques et analytics
- ✅ Ajout de nouvelles plantes

## 📡 API Endpoints

- `GET /api/plants` - Liste des plantes
- `GET /api/plants/:id` - Détails d'une plante
- `GET /api/plants/:id/sensors` - Données capteurs
- `POST /api/plants/:id/water` - Arroser une plante
- `POST /api/plants` - Ajouter une plante
- `GET /api/notifications` - Notifications

## 🔧 Technologies

- **Backend:** Node.js, Express, WebSocket
- **Mobile:** React Native, Expo, TypeScript
- **Simulation:** Capteurs IoT simulés (pas de matériel requis)

## 📝 Notes

- Les données des capteurs sont simulées de manière réaliste
- Les mises à jour se font toutes les 5 secondes
- Aucun matériel IoT requis - tout est simulé en software

## 🐛 Dépannage

**L'app ne se connecte pas au backend:**
1. Vérifiez que le backend est démarré
2. Vérifiez l'IP dans `api.ts`
3. Vérifiez que l'iPhone et PC sont sur le même Wi-Fi
4. Vérifiez le firewall Windows

**Erreur "Cannot connect":**
- Testez l'API dans votre navigateur: `http://VOTRE_IP:3000/api/plants`
- Si ça marche dans le navigateur mais pas dans l'app, c'est un problème d'IP

