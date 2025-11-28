// Service de gestion des plantes

function initializePlants() {
  return [
    {
      id: 1,
      name: "Monstera",
      type: "Tropicale",
      room: "Salon",
      image: "🌿",
      humidite: 45,
      temperature: 24,
      lumiere: 65,
      lastWatered: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      health: 75,
      wateringFrequency: 7, // days
      history: []
    },
    {
      id: 2,
      name: "Cactus",
      type: "Succulente",
      room: "Bureau",
      image: "🌵",
      humidite: 25,
      temperature: 26,
      lumiere: 85,
      lastWatered: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      health: 90,
      wateringFrequency: 21, // days
      history: []
    },
    {
      id: 3,
      name: "Fougère",
      type: "Tropicale",
      room: "Salle de bain",
      image: "🪴",
      humidite: 70,
      temperature: 22,
      lumiere: 45,
      lastWatered: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      health: 85,
      wateringFrequency: 3, // days
      history: []
    }
  ];
}

module.exports = {
  initializePlants
};

