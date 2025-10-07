# EchoHub Deployment

Complete deployment guide for EchoHub on OVH VPS.

## 🚀 Deployment Options

### **Option 1: Dokploy (Recommended)**
- ✅ PostgreSQL with automatic backups
- ✅ Auto-deployments from GitHub
- ✅ SSL certificates (Let's Encrypt)
- ✅ Dashboard management
- ✅ Built-in monitoring
- **Setup time:** ~30 minutes

👉 **[Start with Dokploy Quick Start →](DOKPLOY_QUICKSTART.md)**

### **Option 2: Manual Deployment**
- Traditional server setup
- GitHub Actions CI/CD
- Manual configuration
- Full control
- **Setup time:** ~2 hours

👉 **[Continue with manual setup below ↓](#manual-deployment)**

---

## Dokploy Deployment (Recommended)

### Quick Links
- **[Quick Start Guide](DOKPLOY_QUICKSTART.md)** - Get running in 30 minutes
- **[PostgreSQL Checklist](POSTGRESQL_DEPLOY_CHECKLIST.md)** - Step-by-step with PostgreSQL
- **[Complete Migration Guide](DOKPLOY_MIGRATION.md)** - Full documentation
- **[Environment Template](dokploy-env-template.txt)** - Variables configuration
- **[Installation Script](install-dokploy.sh)** - One-command install

### Ollama AI Configuration
- **[Ollama Quick Fix](OLLAMA_QUICK_FIX.md)** - 5-minute setup for Dokploy AI
- **[Ollama Complete Guide](OLLAMA_DOKPLOY_FIX.md)** - Detailed troubleshooting

### Quick Install

```bash
ssh memo@51.79.55.171
./deployment/install-dokploy.sh
```

Then follow [DOKPLOY_QUICKSTART.md](DOKPLOY_QUICKSTART.md)

**After Dokploy is running, configure Ollama AI:**
Follow [OLLAMA_QUICK_FIX.md](OLLAMA_QUICK_FIX.md) to enable free AI features

---

## Manual Deployment

## Directory Structure

```
deployment/
├── README.md                    # This file
├── setup-server.sh              # Initial server setup script
├── deploy.sh                    # Deployment script
├── .env.production.example      # Production environment template
├── .env.staging.example         # Staging environment template
├── nginx/                       # Nginx configuration files
│   ├── production.conf
│   ├── staging.conf
│   └── development.conf
└── supervisor/                  # Supervisor configuration
    └── echohub-production.conf
```

## Quick Start

### 1. Initial Server Setup

On your OVH VPS, run:

```bash
# SSH into your server
ssh user@your-server-ip

# Clone repository
git clone https://github.com/guillaume-flambard/echohub.git
cd echohub

# Run server setup script
./deployment/setup-server.sh
```

This will install:
- Nginx
- PHP 8.2
- PostgreSQL
- Redis
- Docker & Docker Compose
- Bun
- Composer
- Supervisor
- Certbot
- Fail2ban
- Ollama (optional)

### 2. DNS Configuration

Add these DNS A records to `echotravel.app`:

| Subdomain | Type | Value |
|-----------|------|-------|
| hub | A | YOUR_SERVER_IP |
| staging.hub | A | YOUR_SERVER_IP |
| dev.hub | A | YOUR_SERVER_IP |

### 3. Clone Repositories

```bash
# Production
cd /var/www/echohub/production
git clone https://github.com/guillaume-flambard/echohub.git .
git checkout main

# Staging
cd /var/www/echohub/staging
git clone https://github.com/guillaume-flambard/echohub.git .
git checkout development

# Development
cd /var/www/echohub/development
git clone https://github.com/guillaume-flambard/echohub.git .
git checkout development
```

### 4. Configure Environments

```bash
# Production
cd /var/www/echohub/production
cp deployment/.env.production.example .env
nano .env  # Edit with your settings
php artisan key:generate

# Staging
cd /var/www/echohub/staging
cp deployment/.env.staging.example .env
nano .env
php artisan key:generate

# Development (similar)
```

### 5. Install Dependencies

For each environment:

```bash
cd /var/www/echohub/production

# PHP
composer install --no-dev --optimize-autoloader

# Frontend
bun install
bun run build

# Database
php artisan migrate --force
php artisan db:seed --force

# Permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 6. Configure Nginx

```bash
# Copy configs
sudo cp deployment/nginx/production.conf /etc/nginx/sites-available/echohub-production
sudo cp deployment/nginx/staging.conf /etc/nginx/sites-available/echohub-staging
sudo cp deployment/nginx/development.conf /etc/nginx/sites-available/echohub-development

# Enable sites
sudo ln -s /etc/nginx/sites-available/echohub-production /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/echohub-staging /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/echohub-development /etc/nginx/sites-enabled/

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL Certificates

```bash
# Production
sudo certbot --nginx -d hub.echotravel.app

# Staging
sudo certbot --nginx -d staging.hub.echotravel.app

# Development
sudo certbot --nginx -d dev.hub.echotravel.app
```

### 8. Setup Supervisor

```bash
# Copy config
sudo cp deployment/supervisor/echohub-production.conf /etc/supervisor/conf.d/

# Update and start
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### 9. Start Matrix Synapse

```bash
cd /var/www/echohub/production
docker compose -f docker-compose.matrix.yml up -d

# Create admin user
docker exec -it echohub_synapse register_new_matrix_user \
    -u admin -a -c /data/homeserver.yaml http://localhost:8008
```

## Deployment

### Using Deploy Script

```bash
# Deploy to production
cd /var/www/echohub
./deployment/deploy.sh production

# Deploy to staging
./deployment/deploy.sh staging
```

### Manual Deployment

```bash
cd /var/www/echohub/production
git pull origin main
composer install --no-dev --optimize-autoloader
bun install && bun run build
php artisan migrate --force
php artisan optimize
sudo systemctl reload php8.2-fpm
sudo supervisorctl restart echohub-production-worker:*
```

## GitHub Actions (CI/CD)

The repository includes GitHub Actions workflow for automated deployment.

### Setup Secrets

In your GitHub repository, add these secrets:

- `PRODUCTION_HOST`: Your server IP/domain
- `STAGING_HOST`: Your server IP/domain (can be same)
- `SSH_USERNAME`: SSH username
- `SSH_PRIVATE_KEY`: SSH private key
- `SSH_PORT`: SSH port (default: 22)

### Auto-Deploy

- **Push to `main`**: Auto-deploys to production
- **Push to `development`**: Auto-deploys to staging

## Monitoring

### Logs

```bash
# Application logs
tail -f /var/www/echohub/production/storage/logs/laravel.log

# Nginx logs
tail -f /var/log/nginx/echohub-production-error.log
tail -f /var/log/nginx/echohub-production-access.log

# Worker logs
tail -f /var/www/echohub/production/storage/logs/worker.log

# Matrix logs
docker logs -f echohub_synapse
```

### Health Checks

```bash
# Application
curl https://hub.echotravel.app

# Matrix
curl http://localhost:8008/health

# Database
sudo -u postgres psql -c "SELECT version();"

# Redis
redis-cli ping
```

## Troubleshooting

### Permission Issues

```bash
sudo chown -R www-data:www-data /var/www/echohub/production/storage
sudo chown -R www-data:www-data /var/www/echohub/production/bootstrap/cache
sudo chmod -R 775 /var/www/echohub/production/storage
sudo chmod -R 775 /var/www/echohub/production/bootstrap/cache
```

### Clear All Caches

```bash
cd /var/www/echohub/production
php artisan optimize:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
```

### Restart Services

```bash
sudo systemctl restart php8.2-fpm
sudo systemctl restart nginx
sudo supervisorctl restart all
```

## Backup

### Database Backup

```bash
# Create backup script
cat > /root/backup-echohub.sh << 'EOF'
#!/bin/bash
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/echohub"
mkdir -p $BACKUP_DIR

# Database
pg_dump -U echohub echohub_production > $BACKUP_DIR/db-production-$TIMESTAMP.sql

# Application files
tar -czf $BACKUP_DIR/app-production-$TIMESTAMP.tar.gz /var/www/echohub/production

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
EOF

chmod +x /root/backup-echohub.sh

# Add to crontab (daily at 2 AM)
echo "0 2 * * * /root/backup-echohub.sh" | sudo crontab -
```

## Security Checklist

- [ ] Firewall enabled (UFW)
- [ ] SSH key-based authentication
- [ ] Fail2ban configured
- [ ] SSL certificates installed
- [ ] Strong database passwords
- [ ] `.env` files secured
- [ ] File permissions correct
- [ ] Debug mode off in production
- [ ] Regular updates scheduled

## EchoTravel App Integration

### Quick Links
- **[App Integration Guide](ECHOTRAVEL_APP_INTEGRATION.md)** - API endpoints for EchoTravel
- **[Setup Checklist](ECHOTRAVEL_SETUP_CHECKLIST.md)** - Step-by-step integration
- **[Matrix Bot Script](create-matrix-bot.sh)** - Create Matrix bot users

### What You Need to Do in EchoTravel

1. **Add API routes** (`/api/hub/*`)
2. **Create authentication middleware** (verify service API key)
3. **Implement data endpoints** (bookings, revenue, analytics)
4. **Test integration** (curl commands provided in guide)

👉 **[Start Integration →](ECHOTRAVEL_APP_INTEGRATION.md)**

---

## Support

For detailed documentation, see:
- **Dokploy Setup**: [DOKPLOY_QUICKSTART.md](DOKPLOY_QUICKSTART.md)
- **App Integration**: [ECHOTRAVEL_APP_INTEGRATION.md](ECHOTRAVEL_APP_INTEGRATION.md)
- **Main README**: `/README.md` (project root)
- **Claude Code Guide**: `/CLAUDE.md`

## URLs

- **Production**: https://hub.echotravel.app
- **Staging**: https://hub-staging.echotravel.app
- **Development**: https://hub-dev.echotravel.app
- **Dokploy Dashboard**: http://51.79.55.171:3000
