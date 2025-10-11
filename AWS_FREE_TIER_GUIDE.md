# Déploiement AWS Free Tier - EchoHub

## 🎁 Configuration GRATUITE (12 mois)

Ce guide vous permet de déployer EchoHub sur AWS en utilisant le **Free Tier** avec **$0/mois** de coût pendant 12 mois.

## 📊 Ce qui est GRATUIT

### Services AWS Inclus (12 mois)
- ✅ **EC2 t3.micro** - 750 heures/mois (24/7) - Instance principale
- ✅ **EBS Storage** - 30 GB SSD
- ✅ **Data Transfer** - 100 GB sortant/mois
- ✅ **Elastic IP** - Gratuit quand attaché à l'instance
- ✅ **VPC** - Gratuit

### Services Externes GRATUITS
- ✅ **Google Gemini AI** - 1,500 requêtes/jour (API gratuite)
- ✅ **GitHub Container Registry** - Stockage images Docker
- ✅ **GitHub Actions** - 2,000 minutes/mois

### Coût Total: $0/mois 🎉

---

## 🚀 Option Recommandée: GitHub Actions + Docker + EC2

Cette approche utilise:
- ✅ **GitHub Container Registry** - GRATUIT
- ✅ **EC2 t3.micro** - GRATUIT (750h/mois pendant 12 mois)
- ✅ **SQLite Database** - GRATUIT (pas besoin de RDS)
- ✅ **Google Gemini AI** - GRATUIT (1,500 requêtes/jour)
- ✅ **Déploiement automatique** via GitHub Actions

---

## 📋 Prérequis

### Sur AWS
1. Compte AWS avec Free Tier actif
2. IAM user avec permissions:
   - `AmazonEC2FullAccess`
   - `AmazonVPCFullAccess`
3. Access Key ID et Secret Access Key

### Sur GitHub
1. Repository forké: https://github.com/guillaume-flambard/echohub
2. Secrets GitHub configurés (voir ci-dessous)

### Local
1. AWS CLI installé et configuré ✅ (déjà fait)
2. Compte Google pour Gemini API

---

## 🔧 Configuration Étape par Étape

### Étape 1: Infrastructure AWS (Déjà Créée ✅)

Votre infrastructure est **DÉJÀ PRÊTE**:

- **Instance EC2**: `i-05e9d5420d1e959ae`
- **Type**: t3.micro (2 vCPU, 1GB RAM)
- **IP Publique**: `100.26.171.158`
- **Security Group**: `sg-0edb9989ac8e4e85b`
- **SSH Key**: `~/.ssh/echohub-key.pem`

**Ports ouverts**:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)
- 8008 (Matrix)

### Étape 2: Obtenir l'API Key Google Gemini (GRATUIT)

1. Visitez: https://aistudio.google.com/
2. Connectez-vous avec votre compte Google
3. Cliquez sur "**Get API key**"
4. Créez une nouvelle clé API
5. **Copiez la clé** (format: `AIzaSy...`)

**Limites gratuites**:
- 1,500 requêtes/jour
- Suffisant pour 30-60 utilisateurs actifs

### Étape 3: Configurer les Secrets GitHub

Dans votre repository GitHub, ajoutez ces secrets:

**Settings → Secrets and variables → Actions → New repository secret**

```yaml
# AWS Credentials
AWS_ACCESS_KEY_ID: [Votre AWS Access Key]
AWS_SECRET_ACCESS_KEY: [Votre AWS Secret Key]
AWS_REGION: us-east-1

# EC2 Configuration
EC2_HOST: 100.26.171.158
EC2_USER: ubuntu
EC2_SSH_KEY: [Contenu de ~/.ssh/echohub-key.pem]

# Application Configuration
APP_KEY: [Généré automatiquement au déploiement]
APP_ENV: production
APP_DEBUG: false

# AI Configuration
MINERVA_AI_PROVIDER: google
MINERVA_AI_API_KEY: [Votre clé Gemini de l'Étape 2]
MINERVA_AI_MODEL: gemini-2.0-flash-exp

# Matrix Configuration
MATRIX_HOMESERVER_URL: http://localhost:8008
MATRIX_SERVER_NAME: echohub.local
MATRIX_ADMIN_USER: admin
MATRIX_ADMIN_PASSWORD: [Mot de passe sécurisé]
```

### Étape 4: Configuration du Workflow GitHub Actions

Créez `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS Free Tier

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to EC2
        env:
          HOST: ${{ secrets.EC2_HOST }}
          USER: ${{ secrets.EC2_USER }}
        run: |
          ssh ${USER}@${HOST} << 'ENDSSH'
            cd ~/echohub || {
              git clone https://github.com/guillaume-flambard/echohub.git
              cd echohub
            }

            git pull

            # Update .env
            cat > .env << EOF
            APP_NAME="EchoHub"
            APP_ENV=production
            APP_DEBUG=false
            APP_URL=http://${{ secrets.EC2_HOST }}

            DB_CONNECTION=sqlite
            DB_DATABASE=/var/www/html/database/database.sqlite

            MINERVA_AI_PROVIDER=${{ secrets.MINERVA_AI_PROVIDER }}
            MINERVA_AI_API_KEY=${{ secrets.MINERVA_AI_API_KEY }}
            MINERVA_AI_MODEL=${{ secrets.MINERVA_AI_MODEL }}

            MATRIX_HOMESERVER_URL=${{ secrets.MATRIX_HOMESERVER_URL }}
            MATRIX_SERVER_NAME=${{ secrets.MATRIX_SERVER_NAME }}
            MATRIX_ADMIN_USER=${{ secrets.MATRIX_ADMIN_USER }}
            MATRIX_ADMIN_PASSWORD=${{ secrets.MATRIX_ADMIN_PASSWORD }}
            EOF

            # Deploy
            docker compose build
            docker compose up -d
            docker compose exec -T app php artisan migrate --force
            docker compose exec -T app php artisan config:cache
            docker compose exec -T app php artisan route:cache
            docker compose exec -T app php artisan view:cache

            echo "✅ Deployment complete!"
          ENDSSH
```

### Étape 5: Déploiement Manuel Initial

Pour le premier déploiement, connectez-vous au serveur:

```bash
# Connexion SSH
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158

# Cloner le repository
git clone https://github.com/guillaume-flambard/echohub.git
cd echohub

# Exécuter le script de déploiement
chmod +x deploy-aws.sh
./deploy-aws.sh
```

Le script vous demandera:
1. **Gemini API Key** - Collez votre clé de l'Étape 2
2. **Email admin** - Votre email
3. **Mot de passe admin** - Choisissez un mot de passe sécurisé

**Durée**: ~15 minutes

### Étape 6: Déploiements Automatiques

Après le premier déploiement, chaque `git push` déclenchera automatiquement:

1. GitHub Actions build l'application
2. Connexion SSH au serveur EC2
3. Pull des dernières modifications
4. Rebuild des containers Docker
5. Redémarrage des services
6. Migrations de base de données

**Monitoring**: https://github.com/[votre-username]/echohub/actions

---

## 🌐 Accès à l'Application

### URL d'accès
```
http://100.26.171.158
```

### Login Admin
- Email: [celui que vous avez configuré]
- Mot de passe: [celui que vous avez configuré]

---

## 📊 Architecture de Déploiement

```
GitHub Repository
       ↓
   git push
       ↓
GitHub Actions (CI/CD)
       ↓
   SSH Deploy
       ↓
AWS EC2 t3.micro (Free Tier)
├── Docker Compose
│   ├── Laravel App (port 8000)
│   ├── Nginx (port 80)
│   ├── Matrix Synapse (port 8008)
│   └── Minerva Bots
└── SQLite Database

External Services (FREE):
├── Google Gemini AI (1,500 req/day)
└── GitHub Container Registry
```

---

## 💾 Base de Données

### SQLite vs PostgreSQL

**Configuration actuelle: SQLite** ✅
- ✅ **100% gratuit**
- ✅ Pas de serveur séparé nécessaire
- ✅ Parfait pour < 100 utilisateurs
- ✅ Backups simples
- ✅ Performance suffisante

**Alternative: RDS PostgreSQL (Free Tier)**
- 750 heures/mois db.t2.micro
- 20 GB stockage
- Meilleure performance pour > 100 utilisateurs
- Coût après 12 mois: ~$15/mois

### Migration vers RDS (si nécessaire)

Si vous dépassez 100 utilisateurs, migrez vers RDS:

```bash
# Créer instance RDS
aws rds create-db-instance \
  --db-instance-identifier echohub-db \
  --db-instance-class db.t2.micro \
  --engine postgres \
  --master-username echohub \
  --master-user-password [secure-password] \
  --allocated-storage 20

# Mettre à jour .env
DB_CONNECTION=pgsql
DB_HOST=[endpoint-rds]
DB_DATABASE=echohub
```

---

## 🔄 Gestion & Maintenance

### Commandes Utiles

```bash
# Se connecter au serveur
ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158

# Voir les logs
cd ~/echohub
docker compose logs -f

# Redémarrer les services
docker compose restart

# Voir le status
docker compose ps

# Backup de la base de données
docker compose exec app php artisan backup:run

# Mettre à jour manuellement
git pull
docker compose build
docker compose up -d
```

### Monitoring

```bash
# Utilisation CPU/RAM
top
htop

# Espace disque
df -h

# Utilisation réseau
vnstat
```

### Backups Automatiques

Créez un script de backup dans `/home/ubuntu/backup.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"

mkdir -p $BACKUP_DIR

# Backup SQLite database
cp /home/ubuntu/echohub/database/database.sqlite $BACKUP_DIR/db-$DATE.sqlite

# Backup .env
cp /home/ubuntu/echohub/.env $BACKUP_DIR/env-$DATE

# Upload to S3 (optionnel, Free Tier: 5GB)
# aws s3 cp $BACKUP_DIR s3://echohub-backups/ --recursive

# Nettoyer vieux backups (garder 7 jours)
find $BACKUP_DIR -type f -mtime +7 -delete

echo "Backup completed: $DATE"
```

Configurez le cron:
```bash
crontab -e
# Ajouter: 0 2 * * * /home/ubuntu/backup.sh
```

---

## 🔒 Sécurité

### Configuration SSL (Recommandé)

Si vous avez un nom de domaine:

```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx

# Pointer votre domaine vers 100.26.171.158
# Puis:
sudo certbot --nginx -d echohub.votredomaine.com

# Auto-renouvellement
sudo systemctl enable certbot.timer
```

### Firewall (UFW)

```bash
# Activer UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 8008/tcp
sudo ufw enable
```

### Mises à Jour Système

```bash
# Auto-updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## 💰 Optimisation des Coûts

### Rester dans le Free Tier

**Surveillance**:
```bash
# Vérifier l'utilisation
aws ce get-cost-and-usage \
  --time-period Start=2025-10-01,End=2025-10-31 \
  --granularity MONTHLY \
  --metrics UnblendedCost
```

**Alertes Billing**:
1. AWS Console → Billing → Budgets
2. Créer un budget à $5
3. Recevoir une alerte si dépassement

### Après 12 mois (fin du Free Tier)

**Coûts estimés**:
- EC2 t3.micro: $7.50/mois
- EBS 30GB: $3/mois
- Data transfer: $0-5/mois
- **Total: ~$10-15/mois**

**Alternatives**:
- Migrer vers Lightsail: $7-12/mois (plus simple)
- Utiliser des Reserved Instances: -30% de réduction
- Spot Instances pour dev/staging: -70% de réduction

---

## 📈 Scalabilité

### Quand Upgrader?

**Upgrade vers t3.small (2GB RAM) si**:
- CPU constamment > 70%
- RAM constamment > 80%
- Plus de 50 utilisateurs actifs
- Besoin d'Ollama local (au lieu de Gemini)

**Commande**:
```bash
aws ec2 modify-instance-attribute \
  --instance-id i-05e9d5420d1e959ae \
  --instance-type t3.small
```

**Coût**: $15/mois après Free Tier

### Architecture Multi-Serveur (Future)

Pour > 200 utilisateurs:
```
Load Balancer (ALB)
       ↓
┌──────┴──────┐
│  App Server │  App Server  │
│  (t3.small) │  (t3.small)  │
└──────┬──────┘
       ↓
RDS PostgreSQL (db.t3.small)
```

---

## 🆘 Troubleshooting

### L'instance ne répond pas

```bash
# Vérifier l'état
aws ec2 describe-instance-status \
  --instance-ids i-05e9d5420d1e959ae

# Redémarrer
aws ec2 reboot-instances --instance-ids i-05e9d5420d1e959ae
```

### Out of Memory

```bash
# Ajouter swap
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Docker ne démarre pas

```bash
# Réinstaller Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl start docker
```

### Gemini API ne fonctionne pas

```bash
# Tester l'API
curl -H "Content-Type: application/json" \
     -d '{"contents":[{"parts":[{"text":"Hello"}]}]}' \
     "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=VOTRE_CLE"

# Vérifier .env
cat ~/echohub/.env | grep MINERVA
```

---

## 📞 Support & Ressources

### Documentation
- Guide de déploiement complet: `AWS_SETUP_COMPLETE.md`
- Options de déploiement: `AWS_DEPLOYMENT_GUIDE.md`
- Quick start: `DEPLOY_NOW.md`

### Liens Utiles
- **AWS Console**: https://console.aws.amazon.com/
- **EC2 Dashboard**: https://console.aws.amazon.com/ec2/
- **Votre Instance**: https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#Instances:instanceId=i-05e9d5420d1e959ae
- **Google AI Studio**: https://aistudio.google.com/
- **GitHub Actions**: https://github.com/[username]/echohub/actions

### Monitoring Free Tier

- **AWS Free Tier Dashboard**: https://console.aws.amazon.com/billing/home#/freetier
- **Billing Alerts**: https://console.aws.amazon.com/billing/home#/budgets

---

## ✅ Checklist de Déploiement

### Avant de Déployer
- [ ] Compte AWS avec Free Tier actif
- [ ] AWS CLI configuré ✅
- [ ] Clé API Google Gemini obtenue
- [ ] Infrastructure EC2 créée ✅
- [ ] Repository GitHub configuré

### Déploiement Initial
- [ ] SSH vers EC2 fonctionne
- [ ] Script deploy-aws.sh exécuté
- [ ] Services Docker démarrés
- [ ] Migrations exécutées
- [ ] Admin user créé
- [ ] Application accessible via IP

### Après Déploiement
- [ ] Tests de connexion
- [ ] Tests d'envoi de messages
- [ ] Tests Minerva AI
- [ ] Configuration des backups
- [ ] Configuration des alertes billing
- [ ] (Optionnel) Configuration SSL avec domaine

### Monitoring Continu
- [ ] Vérifier les logs quotidiennement
- [ ] Surveiller l'utilisation CPU/RAM
- [ ] Vérifier les coûts AWS mensuellement
- [ ] Tester les backups mensuellement

---

## 🎯 Prochaines Étapes

### Immédiatement
1. **Obtenir Gemini API Key**: https://aistudio.google.com/
2. **Se connecter au serveur**: `ssh -i ~/.ssh/echohub-key.pem ubuntu@100.26.171.158`
3. **Exécuter le déploiement**: `./deploy-aws.sh`

### Cette Semaine
1. Configurer GitHub Actions pour déploiement automatique
2. Tester toutes les fonctionnalités
3. Configurer les backups automatiques
4. (Optionnel) Configurer un domaine + SSL

### Ce Mois
1. Monitorer l'utilisation et les performances
2. Optimiser la configuration si nécessaire
3. Former les utilisateurs
4. Planifier la stratégie post-Free Tier (après 12 mois)

---

## 💡 Conseils Pro

1. **Utilisez tags AWS** pour organiser vos ressources
2. **Configurez CloudWatch** pour des métriques détaillées
3. **Documentez vos modifications** dans un CHANGELOG
4. **Testez les backups** régulièrement
5. **Gardez une instance de staging** (peut utiliser une plus petite instance)
6. **Automatisez tout** avec GitHub Actions
7. **Surveillez les logs** pour détecter les problèmes tôt

---

## 🚀 Déployer Maintenant

Votre infrastructure est **PRÊTE** et **GRATUITE** pour 12 mois!

**Commencez ici**: Ouvrez `DEPLOY_NOW.md` et suivez les 3 étapes.

**Questions?** Consultez `AWS_SETUP_COMPLETE.md` pour la documentation complète.

**Bonne chance avec votre déploiement! 🎉**
