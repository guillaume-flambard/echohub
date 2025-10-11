# EchoHub Deployment Checklist

Use this checklist before deploying to ensure all prerequisites are met.

## 1. GitHub Secrets Configuration

Navigate to: **Repository → Settings → Secrets and variables → Actions**

### Required Secrets

- [ ] `VPS_HOST` - VPS IP address or hostname (e.g., `192.168.1.100` or `vps.example.com`)
- [ ] `VPS_USER` - SSH username (e.g., `deploy` or `root`)
- [ ] `VPS_SSH_KEY` - Private SSH key for authentication (run `cat ~/.ssh/id_ed25519`)
- [ ] `APP_KEY` - Laravel app key (generate with `php artisan key:generate --show`)

### Environment-Specific Database Secrets

- [ ] `DB_PASSWORD_PROD` - Production database password
- [ ] `DB_PASSWORD_STAGING` - Staging database password (if using staging)
- [ ] `DB_PASSWORD_DEV` - Development database password (if using dev)

## 2. VPS Prerequisites

### SSH Access
```bash
# Test SSH connection
ssh -i ~/.ssh/your_key user@vps-host

# If password-based, set up key auth:
ssh-keygen -t ed25519 -C "github-actions-echohub"
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@vps-host
```

### Docker & Docker Compose
```bash
# Check Docker is installed
docker --version
docker-compose --version

# If not installed:
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Dokploy Network
```bash
# Check if dokploy-network exists
docker network ls | grep dokploy-network

# Create if missing
docker network create dokploy-network
```

### PostgreSQL Container
```bash
# Check if Dokploy PostgreSQL is running
docker ps | grep postgres

# Create databases for each environment
docker exec dokploy-postgres psql -U postgres << 'EOF'
-- Production
CREATE DATABASE echohub_production;
CREATE USER echohub_prod WITH PASSWORD 'your-prod-password';
GRANT ALL PRIVILEGES ON DATABASE echohub_production TO echohub_prod;
ALTER DATABASE echohub_production OWNER TO echohub_prod;

-- Staging (optional)
CREATE DATABASE echohub_staging;
CREATE USER echohub_staging WITH PASSWORD 'your-staging-password';
GRANT ALL PRIVILEGES ON DATABASE echohub_staging TO echohub_staging;
ALTER DATABASE echohub_staging OWNER TO echohub_staging;
EOF
```

### Firewall Configuration
```bash
# Allow GitHub Actions IPs (get from https://api.github.com/meta)
# Example for UFW:
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Or allow specific GitHub IP ranges:
sudo ufw allow from 140.82.112.0/20 to any port 22
sudo ufw allow from 143.55.64.0/20 to any port 22
```

## 3. Traefik Configuration

### Check Traefik is Running
```bash
docker ps | grep traefik
```

### Verify Traefik Network
```bash
# Traefik should be on dokploy-network
docker network inspect dokploy-network | grep -A 5 traefik
```

### DNS Configuration
```bash
# Verify domain points to VPS
dig hub.echotravel.app
nslookup hub.echotravel.app

# Should return your VPS IP address
```

## 4. Local Testing

Before pushing to trigger deployment:

```bash
# Run all checks
pnpm run lint
pnpm run types
pnpm run build:ssr

# Test PHP
composer test

# Test health endpoint locally
php artisan serve &
sleep 3
curl http://localhost:8000/up
# Should return: {"status":"ok"}
```

## 5. Container Registry Access

```bash
# GitHub Container Registry should be accessible
# Make package public or use PAT with read:packages scope

# Test pulling image (after first build)
docker login ghcr.io -u YOUR_USERNAME -p YOUR_GITHUB_TOKEN
docker pull ghcr.io/guillaume-flambard/echohub:production-latest
```

## 6. Initial Deployment Steps

### First Time Setup on VPS

```bash
# 1. Create deployment directories
sudo mkdir -p /opt/echohub-production
sudo mkdir -p /opt/echohub-staging
sudo chown -R $USER:$USER /opt/echohub-*

# 2. Test database connectivity
docker exec dokploy-postgres psql -U echohub_prod -d echohub_production -c "SELECT 1;"

# 3. Create a test deployment
cd /opt/echohub-production
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  echohub:
    image: ghcr.io/guillaume-flambard/echohub:production-latest
    container_name: echohub-production
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    networks:
      - dokploy-network
networks:
  dokploy-network:
    external: true
EOF

# 4. Test deployment
docker-compose pull
docker-compose up -d
docker-compose logs -f
```

## 7. Post-Deployment Verification

After deployment completes:

```bash
# 1. Check container is running
ssh user@vps-host "cd /opt/echohub-production && docker-compose ps"

# 2. Check logs for errors
ssh user@vps-host "cd /opt/echohub-production && docker-compose logs --tail=50"

# 3. Test health endpoint internally
ssh user@vps-host "docker exec echohub-production curl -sf http://localhost:8000/up"

# 4. Test external access
curl https://hub.echotravel.app/up

# 5. Check database connection
ssh user@vps-host "docker exec echohub-production php artisan db:show"
```

## 8. Troubleshooting Quick Checks

If deployment fails, run these diagnostics:

```bash
# On VPS:
cd /opt/echohub-production

# Container status
docker-compose ps

# Recent logs
docker-compose logs --tail=100 echohub

# Test internal health
docker exec echohub-production curl -v http://localhost:8000/up

# Check environment variables
docker exec echohub-production env | grep -E "(APP_|DB_)"

# Test database connection
docker exec echohub-production php artisan tinker --execute="DB::connection()->getPdo();"

# Network connectivity
docker network inspect dokploy-network | grep echohub

# Traefik logs
docker logs $(docker ps | grep traefik | awk '{print $1}') 2>&1 | grep echohub
```

## 9. Rollback Procedure

If something goes wrong:

```bash
# Automatic rollback (now built into CI/CD)
# If deployment fails, it will automatically rollback

# Manual rollback:
cd /opt/echohub-production

# List available images
docker images | grep echohub

# Roll back to previous version
docker-compose down
# Edit docker-compose.yml to use previous image tag
docker-compose up -d
```

## 10. Monitoring

After successful deployment:

- [ ] Check application is accessible: https://hub.echotravel.app
- [ ] Verify login functionality works
- [ ] Check database migrations ran successfully
- [ ] Monitor logs for errors in first 24 hours
- [ ] Set up monitoring/alerting (optional)

---

## Quick Reference Commands

```bash
# SSH into VPS
ssh -i ~/.ssh/key user@vps-host

# View logs
docker logs echohub-production -f

# Restart application
cd /opt/echohub-production && docker-compose restart

# Update deployment
cd /opt/echohub-production && docker-compose pull && docker-compose up -d

# Check health
curl https://hub.echotravel.app/up

# Database backup
docker exec dokploy-postgres pg_dump -U echohub_prod echohub_production > backup.sql
```

---

## Support

If issues persist after following this checklist:
1. Review `TROUBLESHOOTING.md` for detailed diagnostics
2. Check GitHub Actions logs for exact error messages
3. Collect VPS logs and container status for debugging
