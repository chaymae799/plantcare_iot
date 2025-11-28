# 🔧 Fix: Ça marche sur PC mais pas sur iPhone

## Problème
- ✅ Fonctionne sur PC: `http://192.168.1.128:3000/api/plants`
- ❌ Ne fonctionne PAS sur iPhone: même URL

## Cause
Le firewall Windows bloque les connexions entrantes depuis d'autres appareils sur le réseau.

## ✅ Solution Rapide

### Option 1: Script PowerShell (Recommandé)

1. **Ouvrez PowerShell en tant qu'administrateur:**
   - Clic droit sur PowerShell
   - "Exécuter en tant qu'administrateur"

2. **Exécutez le script:**
   ```powershell
   cd C:\Users\lenovo\Desktop\chaymae\IOT
   .\fix-firewall.ps1
   ```

### Option 2: Manuellement

1. Ouvrez **Paramètres Windows**
2. Allez dans **Sécurité** > **Pare-feu Windows Defender**
3. Cliquez sur **Paramètres avancés**
4. Cliquez sur **Règles de trafic entrant** (à gauche)
5. Cliquez sur **Nouvelle règle...** (à droite)
6. Sélectionnez **Port** > **Suivant**
7. Sélectionnez **TCP** et entrez **3000** > **Suivant**
8. Sélectionnez **Autoriser la connexion** > **Suivant**
9. Cochez **TOUS** les profils (Domaine, Privé, Public) > **Suivant**
10. Nommez la règle: **PlantCare Backend Port 3000** > **Terminer**

### Option 3: Désactiver temporairement le firewall (pour tester)

⚠️ **ATTENTION:** Ne faites ça que pour tester! Réactivez-le après.

1. Ouvrez **Paramètres Windows**
2. **Sécurité** > **Pare-feu Windows Defender**
3. Cliquez sur **Activer ou désactiver le pare-feu Windows Defender**
4. Désactivez pour **Réseau privé** et **Réseau public**
5. Testez depuis l'iPhone
6. **Réactivez le firewall après le test!**

## ✅ Vérification

### Test 1: Depuis le PC
```powershell
Test-NetConnection -ComputerName 192.168.1.128 -Port 3000
```
**Doit afficher:** `TcpTestSucceeded : True`

### Test 2: Depuis Safari sur iPhone
1. Ouvrez Safari sur l'iPhone
2. Allez à: `http://192.168.1.128:3000/api/plants`
3. **Vous devriez voir du JSON avec les plantes**

### Test 3: Vérifier les règles firewall
```powershell
Get-NetFirewallRule -DisplayName "*PlantCare*" | Format-List DisplayName, Enabled, Direction, Action
```

## 🔍 Autres Causes Possibles

### 1. iPhone et PC sur des réseaux différents
- Vérifiez que l'iPhone et le PC sont sur le **même réseau Wi-Fi**
- L'iPhone n'est pas sur un réseau invité ou isolé

### 2. Routeur bloque les communications entre appareils
- Certains routeurs ont une option "Isolation des clients" ou "AP Isolation"
- Désactivez cette option dans les paramètres du routeur

### 3. Antivirus bloque les connexions
- Vérifiez les paramètres de votre antivirus
- Ajoutez une exception pour Node.js ou le port 3000

## 📱 Après avoir corrigé le firewall

1. **Redémarrez le backend** (si nécessaire)
2. **Testez dans Safari** sur iPhone: `http://192.168.1.128:3000/api/plants`
3. **Redémarrez l'app Expo** avec `npm start -- --clear`
4. **Scannez le QR code** avec Expo Go

## ✅ Checklist

- [ ] Règle firewall créée pour le port 3000
- [ ] Règle activée pour tous les profils (Domaine, Privé, Public)
- [ ] Test Safari iPhone fonctionne
- [ ] iPhone et PC sur le même Wi-Fi
- [ ] Backend démarré et accessible

