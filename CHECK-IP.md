# 🔍 Comment trouver et vérifier votre IP

## Étape 1: Trouver votre IP

### Sur Windows (PowerShell):
```powershell
ipconfig
```

Cherchez sous votre connexion Wi-Fi:
```
Carte réseau sans fil Wi-Fi :
   Adresse IPv4. . . . . . . . . . . . . . . : 192.168.1.XXX
```

### Sur Windows (CMD):
```cmd
ipconfig | findstr IPv4
```

## Étape 2: Vérifier que l'IP est accessible

### Test 1: Depuis votre PC
Ouvrez votre navigateur et allez à:
```
http://VOTRE_IP:3000/api/plants
```
(ex: http://192.168.1.128:3000/api/plants)

**Si ça ne fonctionne pas:**
- Le backend n'est peut-être pas démarré
- Le firewall bloque peut-être l'accès depuis l'extérieur

### Test 2: Vérifier le firewall

1. Ouvrez **Paramètres Windows**
2. Allez dans **Sécurité** > **Pare-feu Windows Defender**
3. Cliquez sur **Paramètres avancés**
4. Cliquez sur **Règles de trafic entrant**
5. Cherchez une règle pour **Node.js** ou **Port 3000**
6. Si elle n'existe pas, créez-en une:
   - **Nouvelle règle** > **Port** > **TCP** > **3000** > **Autoriser la connexion**

## Étape 3: Configurer l'app mobile

Dans `plantcare-mobile/src/services/api.ts`, mettez votre IP:

```typescript
const YOUR_PC_IP = '192.168.1.XXX'; // Remplacez XXX par votre IP
```

## Étape 4: Tester la connexion

### Test du backend:
```bash
cd backend
node test-connection.js
```

Si ça fonctionne, le backend est OK.

### Test depuis l'iPhone:
1. Assurez-vous que l'iPhone est sur le même Wi-Fi
2. Ouvrez Safari sur l'iPhone
3. Allez à: `http://VOTRE_IP:3000/api/plants`
4. Si ça fonctionne, l'app mobile devrait aussi fonctionner

## ⚠️ Problèmes courants

**"L'IP change à chaque fois"**
→ Configurez une IP statique dans les paramètres de votre routeur

**"L'iPhone ne peut pas accéder à l'IP"**
→ Vérifiez que vous n'êtes pas sur un réseau invité ou isolé

**"Le firewall bloque"**
→ Créez une règle pour autoriser le port 3000

