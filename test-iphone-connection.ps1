# Script pour tester la connexion depuis l'iPhone
# Ce script simule ce que l'iPhone devrait pouvoir faire

Write-Host "🔍 Test de connexion iPhone -> Backend" -ForegroundColor Cyan
Write-Host ""

# IP du PC
$PC_IP = "192.168.1.128"
$PORT = 3000
$URL = "http://${PC_IP}:${PORT}/api/plants"

Write-Host "📱 Test depuis l'iPhone vers:" -ForegroundColor Yellow
Write-Host "   $URL" -ForegroundColor White
Write-Host ""

# Test 1: Vérifier que le serveur écoute
Write-Host "1️⃣ Vérification que le serveur écoute sur toutes les interfaces..." -ForegroundColor Yellow
$listening = netstat -an | Select-String "0.0.0.0:3000.*LISTENING"

if ($listening) {
    Write-Host "   ✅ Serveur écoute sur 0.0.0.0:3000" -ForegroundColor Green
} else {
    Write-Host "   ❌ Serveur n'écoute pas sur toutes les interfaces!" -ForegroundColor Red
    Write-Host "   💡 Redémarrez le backend" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Vérifier le firewall
Write-Host "2️⃣ Vérification du firewall..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "*PlantCare*" -ErrorAction SilentlyContinue

if ($firewallRule -and $firewallRule.Enabled -eq $true) {
    Write-Host "   ✅ Règle firewall activée" -ForegroundColor Green
} else {
    Write-Host "   ❌ Règle firewall manquante ou désactivée!" -ForegroundColor Red
    Write-Host "   💡 Exécutez: .\fix-firewall.ps1" -ForegroundColor Yellow
}

Write-Host ""

# Test 3: Test de connexion HTTP
Write-Host "3️⃣ Test de connexion HTTP..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri $URL -TimeoutSec 5 -ErrorAction Stop
    Write-Host "   ✅ Connexion réussie! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   📊 Données reçues: $($response.Content.Length) bytes" -ForegroundColor Cyan
} catch {
    Write-Host "   ❌ Impossible de se connecter!" -ForegroundColor Red
    Write-Host "   ⚠️  Erreur: $($_.Exception.Message)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   💡 Causes possibles:" -ForegroundColor Cyan
    Write-Host "      - Routeur bloque les communications (AP Isolation)" -ForegroundColor White
    Write-Host "      - iPhone et PC sur réseaux différents" -ForegroundColor White
    Write-Host "      - Antivirus bloque les connexions" -ForegroundColor White
    Write-Host ""
    Write-Host "   🚀 Solution: Utilisez ngrok (voir SOLUTION-NGROK.md)" -ForegroundColor Green
}

Write-Host ""

# Test 4: Vérifier les interfaces réseau
Write-Host "4️⃣ Interfaces réseau du PC..." -ForegroundColor Yellow
$interfaces = Get-NetIPAddress -AddressFamily IPv4 | Where-Object { 
    $_.IPAddress -like "192.168.*" -and $_.PrefixOrigin -eq "Dhcp" 
} | Select-Object IPAddress, InterfaceAlias

if ($interfaces) {
    Write-Host "   Interfaces actives:" -ForegroundColor Cyan
    foreach ($iface in $interfaces) {
        $marker = if ($iface.IPAddress -eq $PC_IP) { " ← Utilisée" } else { "" }
        Write-Host "   - $($iface.IPAddress) ($($iface.InterfaceAlias))$marker" -ForegroundColor White
    }
} else {
    Write-Host "   ⚠️  Aucune interface 192.168.x.x trouvée" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📋 Résumé:" -ForegroundColor Cyan
Write-Host "   Si le test HTTP échoue mais que le serveur écoute," -ForegroundColor White
Write-Host "   c'est probablement le routeur qui bloque." -ForegroundColor White
Write-Host ""
Write-Host "   Solution recommandee: Utilisez ngrok" -ForegroundColor Green
Write-Host "   Voir: SOLUTION-NGROK.md" -ForegroundColor Cyan

