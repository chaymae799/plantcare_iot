# PlantCare Backend - API IoT pour Plantes Connectées

Backend Node.js/Express pour le système IoT de plantes connectées.

## 🚀 Fonctionnalités

- **Simulation réaliste de capteurs IoT** (humidité, température, lumière)
- **API REST** pour gérer les plantes et leurs données
- **WebSocket** pour les mises à jour en temps réel
- **Notifications automatiques** basées sur les seuils de capteurs
- **Historique des données** de capteurs

## 📦 Installation

```bash
cd backend
npm install
```

## 🏃 Démarrer le serveur

### Mode développement (avec auto-reload)
```bash
npm run dev
```

### Mode production
```bash
npm start
```

Le serveur démarre sur `http://localhost:3000`

## 📡 API Endpoints

### GET `/api/plants`
Récupère toutes les plantes avec leurs données de capteurs actuelles

### GET `/api/plants/:id`
Récupère une plante spécifique avec son historique

### GET `/api/plants/:id/sensors`
Récupère les données de capteurs d'une plante

### POST `/api/plants/:id/water`
Arrose une plante (augmente l'humidité)

### POST `/api/plants`
Ajoute une nouvelle plante

### GET `/api/notifications`
Récupère les notifications (besoin d'eau, alertes, etc.)

## 🔌 WebSocket

Le serveur WebSocket écoute sur le même port et envoie des mises à jour en temps réel toutes les 5 secondes.

**Message format:**
```json
{
  "type": "update",
  "plantId": 1,
  "data": {
    "id": 1,
    "name": "Monstera",
    "humidite": 45.2,
    "temperature": 24.5,
    "lumiere": 65.8,
    ...
  }
}
```

## 🎯 Simulation des Capteurs

Les capteurs sont simulés de manière réaliste :
- **Humidité**: Diminue graduellement (plante consomme l'eau)
- **Température**: Varie selon l'heure de la journée (jour/nuit)
- **Lumière**: Suit un cycle jour/nuit naturel

Les données sont mises à jour toutes les 5 secondes.

