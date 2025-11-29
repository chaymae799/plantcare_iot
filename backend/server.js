const express = require("express");
const cors = require("cors");
const http = require("http");
const WebSocket = require("ws");
const os = require("os");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Database (ajouté)
const db = require("./database");

// ML Service
const mlService = require("./services/mlService");
mlService.loadModel().catch((err) => {
  console.error("❌ Failed to load ML model:", err.message);
});
let mlNotifications = [];

function getLocalIP() {
  if (process.env.LOCAL_IP) return process.env.LOCAL_IP;

  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        if (
          iface.address.startsWith("192.168.") ||
          iface.address.startsWith("10.")
        ) {
          return iface.address;
        }
      }
    }
  }
  return "localhost";
}

// Middleware
app.use(cors());
app.use(express.json());

// Import services
const sensorSimulator = require("./services/sensorSimulator");
const plantService = require("./services/plantService");

// ✅ Init plant data - Charger depuis DB
let plants = [];
db.loadPlants().then((data) => {
  if (data.length > 0) {
    plants = data;
    console.log(`💾 ${plants.length} plantes chargées depuis la DB`);
  } else {
    plants = plantService.initializePlants();
    console.log("📦 Plantes par défaut chargées");
  }
  sensorSimulator.initializeAll(plants.map((p) => p.id));
});

// ===================== API ROUTES ========================

// GET /api
app.get("/api", (req, res) => {
  res.json({
    message: "PlantCare IoT API",
    version: "1.0.0",
    database: "SQLite", // ✅ Ajouté
  });
});

// GET - all plants
app.get("/api/plants", (req, res) => {
  try {
    const plantsWithSensors = plants.map((plant) => ({
      ...plant,
      ...sensorSimulator.getCurrentReadings(plant.id),
    }));
    res.json(plantsWithSensors);
  } catch (error) {
    console.error("Error getting plants:", error);
    res
      .status(500)
      .json({ error: "Failed to get plants", message: error.message });
  }
});

// GET - single plant
app.get("/api/plants/:id", (req, res) => {
  try {
    const plantId = parseInt(req.params.id);
    const plant = plants.find((p) => p.id === plantId);

    if (!plant) return res.status(404).json({ error: "Plant not found" });

    const history = sensorSimulator.getHistory(plantId);

    res.json({
      ...plant,
      ...sensorSimulator.getCurrentReadings(plantId),
      history: history || [],
    });
  } catch (error) {
    console.error("Error getting plant:", error);
    res
      .status(500)
      .json({ error: "Failed to get plant", message: error.message });
  }
});

// GET - sensors only
app.get("/api/plants/:id/sensors", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const plant = plants.find((p) => p.id === id);

    if (!plant) return res.status(404).json({ error: "Plant not found" });

    res.json({
      current: sensorSimulator.getCurrentReadings(id),
      history: sensorSimulator.getHistory(id) || [],
    });
  } catch (error) {
    console.error("Error getting sensors:", error);
    res
      .status(500)
      .json({ error: "Failed to get sensors", message: error.message });
  }
});

// POST - Water a plant
app.post("/api/plants/:id/water", (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const plant = plants.find((p) => p.id === id);

    if (!plant) return res.status(404).json({ error: "Plant not found" });

    plant.lastWatered = new Date().toISOString();
    plant.humidite = Math.min(100, plant.humidite + 40);
    plant.health = Math.min(100, plant.health + 5);

    sensorSimulator.resetAfterWatering(id);

    broadcastUpdate(id);

    res.json({
      success: true,
      message: `${plant.name} arrosée`,
      data: {
        ...plant,
        ...sensorSimulator.getCurrentReadings(id),
      },
    });
  } catch (error) {
    console.error("Error watering plant:", error);
    res.status(500).json({
      success: false,
      error: "Failed to water plant",
      message: error.message,
    });
  }
});

// POST - Add new plant
app.post("/api/plants", async (req, res) => {
  // ✅ Ajouté async
  try {
    const { name, type, room, image, wateringFrequency } = req.body;

    if (!name || !type) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "type"],
      });
    }

    const newPlant = {
      id: plants.length + 1,
      name: name,
      type: type,
      room: room || "Maison",
      image: image || "🌱",
      humidite: 60,
      temperature: 22,
      lumiere: 60,
      lastWatered: new Date().toISOString(),
      health: 80,
      wateringFrequency: wateringFrequency || 7,
    };

    plants.push(newPlant);
    sensorSimulator.initializePlant(newPlant.id);

    // ✅ Sauvegarder dans la DB
    await db.savePlant(newPlant);
    console.log(`💾 Plante "${newPlant.name}" sauvegardée dans la DB`);

    res.status(201).json(newPlant);
  } catch (error) {
    console.error("Error adding plant:", error);
    res.status(500).json({
      error: "Failed to add plant",
      message: error.message,
    });
  }
});

// GET - Notifications
app.get("/api/notifications", (req, res) => {
  try {
    const notifications = [];

    plants.forEach((plant) => {
      const readings = sensorSimulator.getCurrentReadings(plant.id);
      const daysSinceWatered = Math.floor(
        (Date.now() - new Date(plant.lastWatered)) / (1000 * 60 * 60 * 24)
      );

      if (readings.humidite < 30) {
        notifications.push({
          id: Date.now() + plant.id,
          type: "danger",
          message: `${plant.name} - Humidité critique (${readings.humidite}%)`,
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }

      if (daysSinceWatered >= plant.wateringFrequency) {
        notifications.push({
          id: Date.now() + plant.id + 1000,
          type: "warning",
          message: `${plant.name} a besoin d'eau (${daysSinceWatered} jours)`,
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }

      if (readings.temperature < 15 || readings.temperature > 30) {
        notifications.push({
          id: Date.now() + plant.id + 2000,
          type: "warning",
          message: `${plant.name} - Température anormale (${readings.temperature}°C)`,
          time: new Date().toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        });
      }
    });

    // Ajouter les notifications ML
    notifications.push(...mlNotifications);
    mlNotifications = []; // vider après envoi

    res.json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    res.status(500).json({ error: "Failed to get notifications" });
  }
});

// ===================== WEBSOCKET ========================
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const clients = new Set();

wss.on("connection", (ws) => {
  clients.add(ws);
  console.log("✅ Client connected");

  ws.on("close", () => {
    clients.delete(ws);
    console.log("❌ Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });

  try {
    ws.send(
      JSON.stringify({
        type: "initial",
        data: plants.map((p) => ({
          ...p,
          ...sensorSimulator.getCurrentReadings(p.id),
        })),
      })
    );
  } catch (error) {
    console.error("Error sending initial data:", error);
  }
});

function broadcastUpdate(plantId) {
  try {
    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return;

    const message = JSON.stringify({
      type: "update",
      plantId,
      data: { ...plant, ...sensorSimulator.getCurrentReadings(plantId) },
    });

    clients.forEach((c) => {
      if (c.readyState === WebSocket.OPEN) {
        c.send(message);
      }
    });
  } catch (error) {
    console.error("Error broadcasting update:", error);
  }
}

// ===================== ML LOOP ========================
setInterval(() => {
  plants.forEach((plant) => {
    try {
      const r = sensorSimulator.getCurrentReadings(plant.id);

      mlService
        .predictWatering(plant.id, r.temperature, r.humidite, r.lumiere)
        .then((pred) => {
          if (pred === 1) {
            const notif = {
              id: Date.now() + plant.id + 3000,
              type: "ml",
              message: `${plant.name} nécessite un arrosage (ML)`,
              time: new Date().toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            };

            mlNotifications.push(notif);

            clients.forEach((c) => {
              if (c.readyState === WebSocket.OPEN)
                c.send(JSON.stringify({ type: "notification", data: notif }));
            });
          }

          broadcastUpdate(plant.id);
        })
        .catch((err) => {
          console.error(
            `ML prediction error for plant ${plant.id}:`,
            err.message
          );
        });

      sensorSimulator.updateReadings(plant.id);
    } catch (error) {
      console.error(`Error updating plant ${plant.id}:`, error);
    }
  });
}, 5000);

// ===================== START SERVER ========================

const HOST = "0.0.0.0";
const localIP = getLocalIP();

server.listen(PORT, HOST, () => {
  console.log(`🌱 Server: http://localhost:${PORT}`);
  console.log(`📱 Mobile: http://${localIP}:${PORT}/api`);
  console.log(`💾 Database: SQLite`);
});
