const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const os = require('os');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Fonction pour obtenir l'IP locale
function getLocalIP() {
  // Permettre de spécifier l'IP manuellement via variable d'environnement
  if (process.env.LOCAL_IP) {
    return process.env.LOCAL_IP;
  }
  
  const interfaces = os.networkInterfaces();
  const preferredIPs = [];
  const otherIPs = [];
  
  for (const name of Object.keys(interfaces)) {
    // Ignorer les interfaces virtuelles communes (VirtualBox, VMware, etc.)
    if (name.toLowerCase().includes('virtualbox') || 
        name.toLowerCase().includes('vmware') ||
        name.toLowerCase().includes('hyper-v') ||
        name.toLowerCase().includes('vpn')) {
      continue;
    }
    
    for (const iface of interfaces[name]) {
      // Ignorer les adresses internes et non-IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        const ip = iface.address;
        
        // Prioriser 192.168.1.x (réseau Wi-Fi typique)
        if (ip.startsWith('192.168.1.')) {
          preferredIPs.unshift(ip); // Ajouter au début
        }
        // Ensuite 192.168.0.x
        else if (ip.startsWith('192.168.0.')) {
          preferredIPs.push(ip);
        }
        // Autres 192.168.x.x (mais pas 192.168.56.x qui est souvent VirtualBox)
        else if (ip.startsWith('192.168.') && !ip.startsWith('192.168.56.')) {
          preferredIPs.push(ip);
        }
        // 10.x.x.x
        else if (ip.startsWith('10.')) {
          otherIPs.push(ip);
        }
      }
    }
  }
  
  // Retourner la première IP préférée, sinon la première autre IP, sinon localhost
  if (preferredIPs.length > 0) {
    return preferredIPs[0];
  }
  if (otherIPs.length > 0) {
    return otherIPs[0];
  }
  return 'localhost';
}

// Middleware
app.use(cors());
app.use(express.json());

// Import sensor simulator
const sensorSimulator = require('./services/sensorSimulator');
const plantService = require('./services/plantService');

// Initialize plants data
let plants = plantService.initializePlants();

// Initialize sensor data for all plants
sensorSimulator.initializeAll(plants.map(p => p.id));

// Routes

// GET /api - API info
app.get('/api', (req, res) => {
  res.json({
    message: 'PlantCare IoT API',
    version: '1.0.0',
    endpoints: {
      plants: 'GET /api/plants',
      plantById: 'GET /api/plants/:id',
      sensors: 'GET /api/plants/:id/sensors',
      water: 'POST /api/plants/:id/water',
      addPlant: 'POST /api/plants',
      notifications: 'GET /api/notifications'
    }
  });
});

// GET all plants
app.get('/api/plants', (req, res) => {
  const plantsWithSensors = plants.map(plant => ({
    ...plant,
    ...sensorSimulator.getCurrentReadings(plant.id)
  }));
  res.json(plantsWithSensors);
});

// GET single plant by ID
app.get('/api/plants/:id', (req, res) => {
  const plantId = parseInt(req.params.id);
  const plant = plants.find(p => p.id === plantId);
  
  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  
  const sensorData = sensorSimulator.getCurrentReadings(plantId);
  const history = sensorSimulator.getHistory(plantId);
  
  res.json({
    ...plant,
    ...sensorData,
    history: history
  });
});

// GET sensor data for a plant
app.get('/api/plants/:id/sensors', (req, res) => {
  const plantId = parseInt(req.params.id);
  const readings = sensorSimulator.getCurrentReadings(plantId);
  const history = sensorSimulator.getHistory(plantId);
  
  res.json({
    current: readings,
    history: history
  });
});

// POST - Water a plant
app.post('/api/plants/:id/water', (req, res) => {
  const plantId = parseInt(req.params.id);
  const plant = plants.find(p => p.id === plantId);
  
  if (!plant) {
    return res.status(404).json({ error: 'Plant not found' });
  }
  
  // Update plant after watering
  plant.lastWatered = new Date();
  plant.humidite = Math.min(100, plant.humidite + 50);
  plant.health = Math.min(100, plant.health + 5);
  
  // Reset sensor readings after watering
  sensorSimulator.resetAfterWatering(plantId);
  
  // Broadcast update via WebSocket
  broadcastUpdate(plantId);
  
  res.json({
    success: true,
    message: `${plant.name} arrosée avec succès`,
    plant: {
      ...plant,
      ...sensorSimulator.getCurrentReadings(plantId)
    }
  });
});

// POST - Add new plant
app.post('/api/plants', (req, res) => {
  const { name, type, room, image, wateringFrequency } = req.body;
  
  const newPlant = {
    id: plants.length + 1,
    name: name || 'Nouvelle Plante',
    type: type || 'Générale',
    room: room || 'Maison',
    image: image || '🌱',
    humidite: 60,
    temperature: 22,
    lumiere: 60,
    lastWatered: new Date(),
    health: 80,
    wateringFrequency: wateringFrequency || 7,
    history: []
  };
  
  plants.push(newPlant);
  sensorSimulator.initializePlant(newPlant.id);
  
  res.status(201).json(newPlant);
});

// GET - Health status and notifications
app.get('/api/notifications', (req, res) => {
  const notifications = [];
  
  plants.forEach(plant => {
    const readings = sensorSimulator.getCurrentReadings(plant.id);
    const daysSinceWatered = Math.floor(
      (Date.now() - new Date(plant.lastWatered).getTime()) / (1000 * 60 * 60 * 24)
    );
    
    // Check if plant needs water
    if (readings.humidite < 30) {
      notifications.push({
        id: Date.now() + plant.id,
        type: 'danger',
        message: `${plant.name} - Humidité critique! (${readings.humidite.toFixed(1)}%)`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        plant: plant.name
      });
    }
    
    // Check watering schedule
    if (daysSinceWatered >= plant.wateringFrequency) {
      notifications.push({
        id: Date.now() + plant.id + 1000,
        type: 'warning',
        message: `${plant.name} a besoin d'eau (${daysSinceWatered} jours)`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        plant: plant.name
      });
    }
    
    // Check temperature
    if (readings.temperature < 15 || readings.temperature > 30) {
      notifications.push({
        id: Date.now() + plant.id + 2000,
        type: 'warning',
        message: `${plant.name} - Température anormale (${readings.temperature.toFixed(1)}°C)`,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        plant: plant.name
      });
    }
  });
  
  res.json(notifications.sort((a, b) => b.id - a.id));
});

// WebSocket server for real-time updates
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });
  
  // Send initial data
  const plantsWithSensors = plants.map(plant => ({
    ...plant,
    ...sensorSimulator.getCurrentReadings(plant.id)
  }));
  ws.send(JSON.stringify({ type: 'initial', data: plantsWithSensors }));
});

function broadcastUpdate(plantId) {
  const plant = plants.find(p => p.id === plantId);
  if (plant) {
    const update = {
      type: 'update',
      plantId: plantId,
      data: {
        ...plant,
        ...sensorSimulator.getCurrentReadings(plantId)
      }
    };
    
    const message = JSON.stringify(update);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}

// Start sensor data updates simulation
setInterval(() => {
  plants.forEach(plant => {
    sensorSimulator.updateReadings(plant.id);
    broadcastUpdate(plant.id);
  });
}, 5000); // Update every 5 seconds

// Start server - écouter sur toutes les interfaces (0.0.0.0) pour permettre les connexions depuis d'autres appareils
const HOST = '0.0.0.0'; // Écouter sur toutes les interfaces réseau
const localIP = getLocalIP();

server.listen(PORT, HOST, () => {
  console.log(`🌱 PlantCare Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready for real-time updates`);
  console.log(`🔌 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`\n📱 Pour connecter votre iPhone, utilisez cette IP:`);
  console.log(`   http://${localIP}:${PORT}/api`);
  console.log(`   (Assurez-vous que cette IP est configurée dans plantcare-mobile/src/services/api.ts)\n`);
});

