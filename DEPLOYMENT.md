# EchoHub Deployment Guide

Deploy EchoHub to OVH VPS with dev, staging, and production environments.

## Server Requirements

- **OS**: Ubuntu 22.04 LTS or similar
- **PHP**: 8.2+
- **Node.js**: 18+ (or Bun)
- **Database**: PostgreSQL 15+ or SQLite
- **Web Server**: Nginx
- **Docker**: For Matrix Synapse homeserver
- **SSL**: Certbot for Let's Encrypt certificates

## Domain Structure

- **Production**: https://hub.echotravel.app
- **Staging**: https://staging.hub.echotravel.app
- **Development**: https://dev.hub.echotravel.app

## Environment Setup

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx postgresql postgresql-contrib \
  php8.2-fpm php8.2-cli php8.2-mbstring php8.2-xml php8.2-curl \
  php8.2-zip php8.2-gd php8.2-pgsql php8.2-sqlite3 \
  git curl unzip supervisor certbot python3-certbot-nginx

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo apt install docker-compose-plugin

# Install Bun (recommended) or Node.js
curl -fsSL https://bun.sh/install | bash

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
```

### 2. Create Directory Structure

```bash
sudo mkdir -p /var/www/echohub/{production,staging,development}
sudo chown -R $USER:$USER /var/www/echohub
```

### 3. PostgreSQL Database Setup

```bash
sudo -u postgres psql

CREATE DATABASE echohub_production;
CREATE DATABASE echohub_staging;
CREATE DATABASE echohub_development;

CREATE USER echohub WITH PASSWORD 'your_secure_password';

GRANT ALL PRIVILEGES ON DATABASE echohub_production TO echohub;
GRANT ALL PRIVILEGES ON DATABASE echohub_staging TO echohub;
GRANT ALL PRIVILEGES ON DATABASE echohub_development TO echohub;

\q
```

### 4. Clone Repository

```bash
cd /var/www/echohub/production
git clone https://github.com/guillaume-flambard/echohub.git .
git checkout main

cd /var/www/echohub/staging
git clone https://github.com/guillaume-flambard/echohub.git .
git checkout development

cd /var/www/echohub/development
git clone https://github.com/guillaume-flambard/echohub.git .
git checkout development
```

### 5. Configure Environment Files

For each environment (production, staging, development), create `.env`:

**Production** (`/var/www/echohub/production/.env`):
```env
APP_NAME=EchoHub
APP_ENV=production
APP_KEY=base64:...  # Generate with: php artisan key:generate
APP_DEBUG=false
APP_URL=https://hub.echotravel.app

DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=echohub_production
DB_USERNAME=echohub
DB_PASSWORD=your_secure_password

# Matrix Configuration
MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_SERVER_NAME=hub.echotravel.app
MATRIX_ADMIN_USER=admin
MATRIX_ADMIN_PASSWORD=your_secure_matrix_password

# Minerva AI Configuration
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b

SANCTUM_STATEFUL_DOMAINS=hub.echotravel.app

CACHE_STORE=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

**Staging** (`/var/www/echohub/staging/.env`):
```env
APP_NAME=EchoHub-Staging
APP_ENV=staging
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=https://staging.hub.echotravel.app

DB_CONNECTION=pgsql
DB_DATABASE=echohub_staging
# ... similar to production with staging URLs
```

**Development** (`/var/www/echohub/development/.env`):
```env
APP_NAME=EchoHub-Dev
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=https://dev.hub.echotravel.app

DB_CONNECTION=pgsql
DB_DATABASE=echohub_development
# ... similar to production with dev URLs
```

### 6. Install Dependencies & Build

For each environment:

```bash
cd /var/www/echohub/production

# PHP dependencies
composer install --no-dev --optimize-autoloader

# Generate app key
php artisan key:generate

# Frontend build
bun install
bun run build

# Run migrations
php artisan migrate --force

# Seed database
php artisan db:seed --force

# Optimize
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Storage permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

Repeat for staging and development (use `--dev` for composer in non-production).

### 7. Matrix Synapse Setup

Update `docker-compose.matrix.yml` for production:

```yaml
version: '3.8'

services:
  synapse:
    image: matrixdotorg/synapse:latest
    container_name: echohub_synapse_production
    restart: unless-stopped
    ports:
      - "8008:8008"
    volumes:
      - /var/www/echohub/production/synapse/data:/data
    environment:
      - SYNAPSE_SERVER_NAME=hub.echotravel.app
      - SYNAPSE_REPORT_STATS=no
    depends_on:
      - synapse_db
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8008/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  synapse_db:
    image: postgres:15
    container_name: echohub_synapse_db_production
    restart: unless-stopped
    environment:
      POSTGRES_DB: synapse
      POSTGRES_USER: synapse
      POSTGRES_PASSWORD: your_synapse_db_password
    volumes:
      - synapse_db_data:/var/lib/postgresql/data

volumes:
  synapse_db_data:
```

Start Matrix:
```bash
cd /var/www/echohub/production
docker compose -f docker-compose.matrix.yml up -d
```

### 8. Nginx Configuration

Create `/etc/nginx/sites-available/echohub-production`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name hub.echotravel.app;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name hub.echotravel.app;

    root /var/www/echohub/production/public;
    index index.php;

    # SSL certificates (will be generated by Certbot)
    ssl_certificate /etc/letsencrypt/live/hub.echotravel.app/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hub.echotravel.app/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Logs
    access_log /var/log/nginx/echohub-production-access.log;
    error_log /var/log/nginx/echohub-production-error.log;

    # Laravel
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
        fastcgi_hide_header X-Powered-By;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    # Matrix federation (if needed)
    location /_matrix {
        proxy_pass http://localhost:8008;
        proxy_set_header X-Forwarded-For $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $host;
    }

    client_max_body_size 100M;
}
```

Create similar configs for staging and development, then:

```bash
# Enable sites
sudo ln -s /etc/nginx/sites-available/echohub-production /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/echohub-staging /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/echohub-development /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 9. SSL Certificates

```bash
# Production
sudo certbot --nginx -d hub.echotravel.app

# Staging
sudo certbot --nginx -d staging.hub.echotravel.app

# Development
sudo certbot --nginx -d dev.hub.echotravel.app
```

### 10. Supervisor for Queue Workers

Create `/etc/supervisor/conf.d/echohub-production-worker.conf`:

```ini
[program:echohub-production-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/echohub/production/artisan queue:work --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/echohub/production/storage/logs/worker.log
stopwaitsecs=3600
```

Create similar files for staging and development, then:

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### 11. Cron Jobs

Add to crontab (`sudo crontab -e -u www-data`):

```cron
# Production
* * * * * cd /var/www/echohub/production && php artisan schedule:run >> /dev/null 2>&1

# Staging
* * * * * cd /var/www/echohub/staging && php artisan schedule:run >> /dev/null 2>&1

# Development
* * * * * cd /var/www/echohub/development && php artisan schedule:run >> /dev/null 2>&1
```

## Deployment Workflow

### Manual Deployment

Production:
```bash
cd /var/www/echohub/production
git pull origin main
composer install --no-dev --optimize-autoloader
bun install
bun run build
php artisan migrate --force
php artisan optimize
sudo systemctl reload php8.2-fpm
sudo supervisorctl restart echohub-production-worker:*
```

Staging/Development:
```bash
cd /var/www/echohub/staging
git pull origin development
composer install
bun install
bun run build
php artisan migrate --force
php artisan optimize:clear
sudo systemctl reload php8.2-fpm
```

### Automated Deployment (GitHub Actions)

See `.github/workflows/deploy.yml` for CI/CD setup.

## Security Checklist

- [ ] Firewall configured (ufw)
- [ ] SSH key-based authentication only
- [ ] Regular security updates enabled
- [ ] Strong database passwords
- [ ] SSL certificates installed
- [ ] Fail2ban configured
- [ ] File permissions correct (775 storage, 755 public)
- [ ] Environment files secured (.env not in web root)
- [ ] Debug mode off in production
- [ ] CSRF protection enabled
- [ ] Rate limiting configured

## Monitoring

- **Logs**: `/var/log/nginx/`, `/var/www/echohub/*/storage/logs/`
- **Health check**: https://hub.echotravel.app/health (create endpoint)
- **Matrix health**: http://localhost:8008/health

## Backup Strategy

```bash
# Database backup script
pg_dump echohub_production > /backups/echohub-production-$(date +%Y%m%d).sql

# Application files
tar -czf /backups/echohub-app-$(date +%Y%m%d).tar.gz /var/www/echohub/production

# Automate with cron (daily at 2 AM)
0 2 * * * /path/to/backup-script.sh
```

## Troubleshooting

### Common Issues

1. **500 Error**: Check `storage/logs/laravel.log`
2. **Permission denied**: Run `sudo chown -R www-data:www-data storage bootstrap/cache`
3. **Queue not processing**: Check supervisor status
4. **Matrix not working**: Check Docker logs: `docker logs echohub_synapse_production`

### Useful Commands

```bash
# View logs
tail -f storage/logs/laravel.log
tail -f /var/log/nginx/echohub-production-error.log

# Clear cache
php artisan optimize:clear

# Restart services
sudo systemctl restart php8.2-fpm nginx
sudo supervisorctl restart all

# Check queue status
php artisan queue:work --once
```
