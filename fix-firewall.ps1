# Script pour autoriser le port 3000 dans le firewall Windows
# À exécuter en tant qu'administrateur

Write-Host "🔧 Configuration du Firewall pour PlantCare Backend..." -ForegroundColor Cyan
Write-Host ""

# Vérifier si la règle existe déjà
$existingRule = Get-NetFirewallRule -DisplayName "PlantCare Backend Port 3000" -ErrorAction SilentlyContinue

if ($existingRule) {
    Write-Host "✅ Règle existante trouvée, suppression..." -ForegroundColor Yellow
    Remove-NetFirewallRule -DisplayName "PlantCare Backend Port 3000"
}

# Créer une nouvelle règle pour le port 3000
Write-Host "📝 Création de la règle firewall..." -ForegroundColor Yellow
try {
    New-NetFirewallRule -DisplayName "PlantCare Backend Port 3000" `
        -Direction Inbound `
        -LocalPort 3000 `
        -Protocol TCP `
        -Action Allow `
        -Profile Domain,Private,Public `
        -Description "Autorise les connexions au backend PlantCare depuis le réseau local" | Out-Null
    
    Write-Host "✅ Règle firewall créée avec succès!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Détails de la règle:" -ForegroundColor Cyan
    Get-NetFirewallRule -DisplayName "PlantCare Backend Port 3000" | Format-List DisplayName, Enabled, Direction, Action, Profile
} catch {
    Write-Host "❌ Erreur lors de la création de la règle:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Assurez-vous d'exécuter ce script en tant qu'administrateur!" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "✅ Configuration terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Testez maintenant depuis votre iPhone:" -ForegroundColor Cyan
Write-Host "   http://192.168.1.128:3000/api/plants" -ForegroundColor White

