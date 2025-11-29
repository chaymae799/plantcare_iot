const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./plants.db");

// Créer la table au démarrage
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS plants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      type TEXT,
      room TEXT,
      image TEXT,
      lastWatered TEXT,
      wateringFrequency INTEGER
    )
  `);
  console.log("✅ Base de données SQLite prête");
});

// Sauvegarder une plante
function savePlant(plant) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO plants (name, type, room, image, lastWatered, wateringFrequency) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        plant.name,
        plant.type,
        plant.room,
        plant.image,
        plant.lastWatered,
        plant.wateringFrequency,
      ],
      function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      }
    );
  });
}

// Charger toutes les plantes
function loadPlants() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM plants", [], (err, rows) => {
      if (err) reject(err);
      else resolve(rows || []);
    });
  });
}

module.exports = { savePlant, loadPlants };
