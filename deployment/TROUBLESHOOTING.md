# EchoHub Deployment Troubleshooting Guide

This guide helps diagnose and fix common deployment issues.

## Table of Contents
- [Health Check Failures](#health-check-failures)
- [SSH Connection Issues](#ssh-connection-issues)
- [Container Startup Problems](#container-startup-problems)
- [Database Connection Issues](#database-connection-issues)
- [Network and Traefik Issues](#network-and-traefik-issues)

---

## Health Check Failures

### Symptom
```
❌ Health check failed after X attempts
HTTP Code: 000, 502, 503, or timeout
```

### Common Causes & Solutions

#### 1. Container Not Ready
**Cause:** Application needs more time to initialize (database migrations, cache warming, etc.)

**Solution:** The CI/CD pipeline now waits 45 seconds and retries 10 times with progressive backoff. If still failing:
```bash
# SSH into VPS and check container status
ssh user@vps-host
cd /opt/echohub-production
docker-compose ps
docker-compose logs echohub
```

#### 2. Database Connection Failure
**Cause:** Database not accessible or wrong credentials

**Solution:**
```bash
# Check database connectivity
docker exec echohub-production php artisan tinker
>>> DB::connection()->getPdo();

# Verify database exists
docker exec dokploy-postgres psql -U postgres -l

# Check environment variables
docker exec echohub-production env | grep DB_
```

#### 3. Missing APP_KEY
**Cause:** `APP_KEY` secret not set in GitHub

**Solution:**
1. Generate a new key: `php artisan key:generate --show`
2. Add to GitHub Secrets: Settings → Secrets → Actions → New secret
   - Name: `APP_KEY`
   - Value: `base64:...` (output from above)

#### 4. Traefik Not Routing
**Cause:** Traefik configuration or domain DNS issues

**Solution:**
```bash
# Check if Traefik is running
docker ps | grep traefik

# Check Traefik logs
docker logs traefik-container-name 2>&1 | grep echohub

# Verify domain resolves to VPS
nslookup hub.echotravel.app

# Test direct container access (bypassing Traefik)
docker exec echohub-production curl -s http://localhost:8000/up
```

---

## SSH Connection Issues

### Symptom
```
dial tcp ***:22: i/o timeout
Error: Process completed with exit code 255
```

### Common Causes & Solutions

#### 1. VPS Firewall Blocking GitHub Actions
**Cause:** VPS firewall doesn't allow GitHub Actions IPs

**Solution:**
```bash
# Option A: Allow GitHub Actions IP ranges (recommended for security)
# Get current GitHub Actions IPs: https://api.github.com/meta
# Add to firewall (example for UFW):
sudo ufw allow from 140.82.112.0/20 to any port 22
sudo ufw allow from 143.55.64.0/20 to any port 22

# Option B: Allow all SSH (less secure)
sudo ufw allow 22/tcp
```

#### 2. Wrong SSH Configuration
**Cause:** Incorrect `VPS_HOST`, `VPS_USER`, or `VPS_SSH_KEY`

**Solution:**
1. Verify secrets in GitHub: Settings → Secrets → Actions
2. Test SSH manually:
```bash
# Test connection
ssh -i ~/.ssh/vps_key user@vps-host

# If using password, ensure key-based auth is set up:
ssh-keygen -t ed25519 -C "github-actions"
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@vps-host
```

#### 3. VPS Down or Unreachable
**Cause:** VPS is offline or network issue

**Solution:**
```bash
# Check if VPS is reachable
ping vps-host

# Check if SSH port is open
nc -zv vps-host 22

# Contact hosting provider if unreachable
```

---

## Container Startup Problems

### Symptom
```
❌ Container failed to start!
Container exits immediately or shows "Restarting" status
```

### Common Causes & Solutions

#### 1. Docker Image Pull Failure
**Cause:** Can't pull image from GitHub Container Registry

**Solution:**
```bash
# Check if image exists
docker images | grep echohub

# Try manual pull
docker login ghcr.io -u USERNAME -p GITHUB_TOKEN
docker pull ghcr.io/guillaume-flambard/echohub:production-latest

# Check registry permissions (must be public or PAT with read:packages)
```

#### 2. Port Conflict
**Cause:** Port 8000 already in use

**Solution:**
```bash
# Check what's using port 8000
sudo lsof -i :8000

# Stop conflicting service or change EchoHub port
docker-compose down
# Edit docker-compose.yml to change port mapping
docker-compose up -d
```

#### 3. Volume/Permission Issues
**Cause:** Container can't write to volumes

**Solution:**
```bash
# Check volume permissions
ls -la /opt/echohub-production

# Fix permissions (Laravel needs writable storage)
sudo chown -R 1000:1000 /opt/echohub-production/storage
```

---

## Database Connection Issues

### Symptom
```
SQLSTATE[08006] [7] could not connect to server
Connection refused
```

### Common Causes & Solutions

#### 1. Database Not Created
**Cause:** Database doesn't exist in PostgreSQL

**Solution:**
```bash
# Create database
docker exec dokploy-postgres psql -U postgres -c "CREATE DATABASE echohub_production;"

# Create user with password
docker exec dokploy-postgres psql -U postgres -c "CREATE USER echohub_prod WITH PASSWORD 'your-password';"
docker exec dokploy-postgres psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE echohub_production TO echohub_prod;"
```

#### 2. Wrong Database Host
**Cause:** Can't reach `dokploy-postgres` container

**Solution:**
```bash
# Check if containers are on same network
docker network inspect dokploy-network

# Verify database container name
docker ps | grep postgres

# Test connection from app container
docker exec echohub-production ping dokploy-postgres
```

#### 3. Database Password Mismatch
**Cause:** `DB_PASSWORD_PROD` secret doesn't match database password

**Solution:**
1. Reset password in PostgreSQL:
```bash
docker exec dokploy-postgres psql -U postgres -c "ALTER USER echohub_prod WITH PASSWORD 'new-password';"
```
2. Update GitHub Secret: `DB_PASSWORD_PROD`

---

## Network and Traefik Issues

### Symptom
```
502 Bad Gateway
503 Service Unavailable
SSL certificate errors
```

### Common Causes & Solutions

#### 1. Container Not on Traefik Network
**Cause:** Container not attached to `dokploy-network`

**Solution:**
```bash
# Check network exists
docker network ls | grep dokploy-network

# If missing, create it
docker network create dokploy-network

# Recreate container
cd /opt/echohub-production
docker-compose down
docker-compose up -d
```

#### 2. Traefik Labels Incorrect
**Cause:** Wrong labels in docker-compose.yml

**Solution:** Verify labels match this format:
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.echohub-production.rule=Host(`hub.echotravel.app`)"
  - "traefik.http.routers.echohub-production.entrypoints=websecure"
  - "traefik.http.routers.echohub-production.tls=true"
  - "traefik.http.routers.echohub-production.tls.certresolver=letsencrypt"
  - "traefik.http.services.echohub-production.loadbalancer.server.port=8000"
```

#### 3. SSL Certificate Not Generated
**Cause:** Let's Encrypt rate limit or DNS not propagated

**Solution:**
```bash
# Check Traefik certificates
docker exec traefik-container ls -la /letsencrypt/

# Check DNS propagation
dig hub.echotravel.app

# Wait for DNS (can take up to 48 hours)
# Use staging cert resolver for testing to avoid rate limits
```

---

## Quick Diagnostic Commands

Run these on the VPS to get a full health snapshot:

```bash
#!/bin/bash
echo "=== Docker Containers ==="
docker ps -a

echo -e "\n=== EchoHub Container Logs (last 50 lines) ==="
docker logs --tail=50 echohub-production

echo -e "\n=== Network Connections ==="
docker network inspect dokploy-network | grep -A 5 echohub

echo -e "\n=== Disk Space ==="
df -h

echo -e "\n=== Memory Usage ==="
free -h

echo -e "\n=== Environment Variables ==="
docker exec echohub-production env | grep -E "(APP_|DB_|REDIS_)" | sort

echo -e "\n=== Health Check ==="
docker exec echohub-production curl -s http://localhost:8000/up || echo "Health check failed"

echo -e "\n=== Database Connectivity ==="
docker exec echohub-production php artisan db:show
```

---

## Getting Help

If issues persist:

1. **Collect Logs:**
   ```bash
   cd /opt/echohub-production
   docker-compose logs > echohub-debug.log 2>&1
   ```

2. **Check GitHub Actions:** Review the full workflow logs for exact error messages

3. **Test Locally:** Try deploying the same Docker image locally to isolate VPS-specific issues

4. **Contact Support:** Provide:
   - Full error logs
   - Output of diagnostic commands above
   - GitHub Actions workflow URL
   - VPS provider and configuration details
