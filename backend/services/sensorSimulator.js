// Service de simulation réaliste des capteurs IoT

const sensorData = new Map(); // Store sensor data for each plant

// Initialize sensor data for a plant WITH SOME INITIAL HISTORY
function initializePlant(plantId) {
  const hour = new Date().getHours();
  const baseTemp = hour >= 6 && hour <= 18 ? 24 : 20;

  const data = {
    humidite: 50 + Math.random() * 20, // 50-70%
    temperature: baseTemp + (Math.random() * 4 - 2), // ±2°C from base
    lumiere:
      hour >= 6 && hour <= 20 ? 60 + Math.random() * 30 : Math.random() * 20,
    history: [],
    lastUpdate: Date.now(),
  };

  // ✅ NOUVEAU: Générer 10 points d'historique initiaux pour avoir des données immédiatement
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    const pastTime = new Date(now.getTime() - i * 5 * 60 * 1000); // 5 min intervals
    const pastHour = pastTime.getHours();

    // Simuler l'humidité qui baisse progressivement
    const humidite = Math.max(
      30,
      data.humidite - (10 - i) * 2 + Math.random() * 5
    );

    // Température selon l'heure
    let temp =
      pastHour >= 6 && pastHour <= 18
        ? 22 + Math.random() * 4
        : 18 + Math.random() * 3;

    // Lumière selon l'heure
    let lumiere =
      pastHour >= 6 && pastHour <= 20
        ? 40 + Math.random() * 40
        : Math.random() * 15;

    data.history.push({
      time: pastTime.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      humidite: parseFloat(humidite.toFixed(1)),
      temperature: parseFloat(temp.toFixed(1)),
      lumiere: parseFloat(lumiere.toFixed(1)),
    });
  }

  sensorData.set(plantId, data);
}

// Get current sensor readings for a plant
function getCurrentReadings(plantId) {
  const data = sensorData.get(plantId);
  if (!data) {
    initializePlant(plantId);
    return getCurrentReadings(plantId);
  }

  return {
    humidite: parseFloat(data.humidite.toFixed(1)),
    temperature: parseFloat(data.temperature.toFixed(1)),
    lumiere: parseFloat(data.lumiere.toFixed(1)),
  };
}

// Update sensor readings (simulates real sensor behavior)
function updateReadings(plantId) {
  const data = sensorData.get(plantId);
  if (!data) {
    initializePlant(plantId);
    return;
  }

  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();

  // Simulate gradual humidity decrease (plant uses water)
  const humidityDecrease = 0.1 + Math.random() * 0.3; // 0.1-0.4% per update
  data.humidite = Math.max(0, data.humidite - humidityDecrease);

  // Simulate temperature based on time of day
  let baseTemp;
  if (hour >= 6 && hour <= 18) {
    // Daytime: warmer
    baseTemp = 22 + (hour - 6) * 0.5; // Gradually increases during day
  } else if (hour >= 19 && hour <= 23) {
    // Evening: cooling down
    baseTemp = 24 - (hour - 18) * 0.8;
  } else {
    // Night: cooler
    baseTemp = 18 + (hour / 6) * 0.5;
  }

  // Add some natural variation
  data.temperature = baseTemp + (Math.random() * 3 - 1.5); // ±1.5°C variation
  data.temperature = Math.max(15, Math.min(30, data.temperature)); // Clamp between 15-30°C

  // Simulate light based on time of day
  if (hour >= 6 && hour <= 20) {
    // Daytime light simulation
    const sunIntensity = Math.sin(((hour - 6) / 14) * Math.PI); // Peak at noon
    data.lumiere = 40 + sunIntensity * 50 + Math.random() * 10;
  } else {
    // Night: very low light
    data.lumiere = Math.random() * 10;
  }
  data.lumiere = Math.max(0, Math.min(100, data.lumiere));

  // Add to history (keep last 50 readings)
  const historyEntry = {
    time: now.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    humidite: parseFloat(data.humidite.toFixed(1)),
    temperature: parseFloat(data.temperature.toFixed(1)),
    lumiere: parseFloat(data.lumiere.toFixed(1)),
  };

  data.history.push(historyEntry);
  if (data.history.length > 50) {
    data.history.shift(); // Keep only last 50 entries
  }

  data.lastUpdate = Date.now();
}

// Get history for a plant
function getHistory(plantId, limit = 20) {
  const data = sensorData.get(plantId);
  if (!data || !data.history) {
    return [];
  }
  return data.history.slice(-limit);
}

// Reset sensor readings after watering
function resetAfterWatering(plantId) {
  const data = sensorData.get(plantId);
  if (data) {
    data.humidite = Math.min(100, data.humidite + 50);
    // Temperature and light remain natural
  }
}

// Initialize all plants
function initializeAll(plantIds) {
  plantIds.forEach((id) => initializePlant(id));
}

module.exports = {
  initializePlant,
  getCurrentReadings,
  updateReadings,
  getHistory,
  resetAfterWatering,
  initializeAll,
};
