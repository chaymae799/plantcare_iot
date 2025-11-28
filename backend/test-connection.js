// Script de test pour vérifier la connectivité du backend

const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/plants',
  method: 'GET',
  timeout: 5000
};

console.log('🔍 Test de connexion au backend...\n');

const req = http.request(options, (res) => {
  console.log(`✅ Status: ${res.statusCode}`);
  console.log(`✅ Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const plants = JSON.parse(data);
      console.log(`\n✅ Backend fonctionne! ${plants.length} plante(s) trouvée(s)`);
      if (plants.length > 0) {
        console.log(`\n📊 Exemple de données:`);
        console.log(`   - ${plants[0].name}:`);
        console.log(`     Humidité: ${plants[0].humidite}%`);
        console.log(`     Température: ${plants[0].temperature}°C`);
        console.log(`     Lumière: ${plants[0].lumiere}%`);
      }
      process.exit(0);
    } catch (e) {
      console.log('⚠️ Réponse reçue mais format invalide');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error(`\n❌ Erreur de connexion: ${error.message}`);
  console.error('\n🔧 Solutions:');
  console.error('   1. Vérifiez que le backend est démarré: cd backend && npm start');
  console.error('   2. Vérifiez que le port 3000 n\'est pas utilisé par un autre programme');
  console.error('   3. Vérifiez les logs du serveur backend');
  process.exit(1);
});

req.on('timeout', () => {
  console.error('\n❌ Timeout: Le serveur ne répond pas');
  console.error('\n🔧 Solutions:');
  console.error('   1. Vérifiez que le backend est démarré');
  console.error('   2. Vérifiez que le port 3000 est accessible');
  req.destroy();
  process.exit(1);
});

req.end();

