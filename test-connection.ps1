# Script de test de connexion pour PlantCare IoT
# Utilisez ce script pour diagnostiquer les problèmes de connexion

Write-Host "🔍 Test de connexion PlantCare IoT" -ForegroundColor Cyan
Write-Host ""

# 1. Vérifier l'IP
Write-Host "1️⃣ Vérification de l'IP locale..." -ForegroundColor Yellow
$ipv4 = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" } | Select-Object -First 1).IPAddress

if ($ipv4) {
    Write-Host "   ✅ IP trouvée: $ipv4" -ForegroundColor Green
} else {
    Write-Host "   ❌ Aucune IP locale trouvée" -ForegroundColor Red
    $ipv4 = "192.168.1.128" # IP par défaut
    Write-Host "   ⚠️  Utilisation de l'IP par défaut: $ipv4" -ForegroundColor Yellow
}

Write-Host ""

# 2. Vérifier si le port 3000 est ouvert
Write-Host "2️⃣ Vérification du port 3000..." -ForegroundColor Yellow
$port = Test-NetConnection -ComputerName localhost -Port 3000 -WarningAction SilentlyContinue

if ($port.TcpTestSucceeded) {
    Write-Host "   ✅ Port 3000 est ouvert et accessible" -ForegroundColor Green
} else {
    Write-Host "   ❌ Port 3000 n'est PAS accessible" -ForegroundColor Red
    Write-Host "   ⚠️  Le backend n'est peut-être pas démarré!" -ForegroundColor Yellow
}

Write-Host ""

# 3. Vérifier le firewall
Write-Host "3️⃣ Vérification du firewall..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "*Node.js*" -ErrorAction SilentlyContinue

if ($firewallRule) {
    Write-Host "   ✅ Règle firewall trouvée pour Node.js" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Aucune règle firewall spécifique trouvée" -ForegroundColor Yellow
    Write-Host "   💡 Vous devrez peut-être autoriser le port 3000 manuellement" -ForegroundColor Cyan
}

Write-Host ""

# 4. Test de connexion HTTP
Write-Host "4️⃣ Test de connexion HTTP..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/plants" -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Backend répond correctement!" -ForegroundColor Green
    Write-Host "   📊 Status: $($response.StatusCode)" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Impossible de se connecter au backend" -ForegroundColor Red
    Write-Host "   ⚠️  Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# 5. Résumé et instructions
Write-Host "📋 Résumé:" -ForegroundColor Cyan
Write-Host "   IP à utiliser dans api.ts: $ipv4" -ForegroundColor White
Write-Host "   URL de test: http://$ipv4:3000/api/plants" -ForegroundColor White
Write-Host ""

Write-Host "📱 Pour tester depuis votre iPhone:" -ForegroundColor Cyan
Write-Host "   1. Ouvrez Safari sur l'iPhone" -ForegroundColor White
Write-Host "   2. Allez à: http://$ipv4:3000/api/plants" -ForegroundColor White
Write-Host "   3. Si ça fonctionne, l'app devrait aussi fonctionner" -ForegroundColor White
Write-Host ""

Write-Host "✅ Test terminé!" -ForegroundColor Green

