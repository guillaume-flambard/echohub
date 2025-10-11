# EchoHub Deployment Solution

## Current Situation Analysis

Your VPS is **correctly configured** with:
- ✅ SSH access working (port 22 open)
- ✅ Docker running (version 28.5.0)
- ✅ Dokploy installed and managing services
- ✅ EchoHub already deployed via Dokploy
- ✅ PostgreSQL database running with `echohub_production` database
- ✅ Traefik routing traffic
- ✅ dokploy-network configured

## The Problem

**You have TWO deployment methods conflicting:**

1. **Dokploy** (currently active) - manages `echohub-echohub-4a90tn` service
2. **GitHub Actions CI/CD** (failing) - trying to create separate `echohub-production` container

**Why GitHub Actions fails:**
- Timeout connecting to SSH: `dial tcp ***:22: i/o timeout`
- This happens because GitHub Actions runners use dynamic IPs that may be rate-limited or blocked

## Solution Options

### Option 1: Use Dokploy Only (Recommended)

**Best for:** Simple deployments, UI-based management

Dokploy has built-in GitHub integration. Remove GitHub Actions CI/CD entirely:

```bash
# 1. Connect Dokploy to your GitHub repo
# Go to: http://51.79.55.171:3000
# Settings → GitHub Integration
# Follow the OAuth flow

# 2. Configure auto-deployment in Dokploy
# Applications → EchoHub → Settings
# Enable: "Auto deploy on push to main"

# 3. Delete GitHub Actions workflow
rm .github/workflows/ci-cd.yml
git add .github/workflows/ci-cd.yml
git commit -m "chore: remove CI/CD workflow, using Dokploy"
git push
```

**Pros:**
- No SSH timeout issues
- Built-in UI for logs and management
- Automatic SSL certificates
- Database backups
- Monitoring

**Cons:**
- Less control over build process
- Dependent on Dokploy platform

### Option 2: Use GitHub Actions Only

**Best for:** Full control, custom CI/CD pipelines

Remove Dokploy's EchoHub deployment and use GitHub Actions:

```bash
# 1. Set GitHub Secrets (Repository → Settings → Secrets):

VPS_HOST=51.79.55.171
VPS_USER=memo
VPS_SSH_KEY=<contents of ~/.ssh/id_ed25519_memo>
APP_KEY=<run: php artisan key:generate --show>
DB_PASSWORD_PROD=<your-production-db-password>

# 2. Fix SSH timeout by allowing GitHub Actions IPs on VPS:

ssh vps-simple
sudo ufw allow from 140.82.112.0/20 to any port 22
sudo ufw allow from 143.55.64.0/20 to any port 22
sudo ufw allow from 185.199.108.0/22 to any port 22
sudo ufw allow from 192.30.252.0/22 to any port 22
sudo ufw reload

# 3. Stop Dokploy's EchoHub service:

docker service rm echohub-echohub-4a90tn

# 4. Push to main branch to trigger GitHub Actions
```

**Pros:**
- Full control over CI/CD
- Custom testing/linting steps
- Version control of deployment process

**Cons:**
- More complex setup
- Need to manage secrets
- Potential SSH timeout issues

### Option 3: Hybrid (GitHub Actions → Dokploy)

**Best for:** CI/CD testing + Dokploy deployment

Use GitHub Actions for testing, Dokploy for deployment:

```yaml
# Keep .github/workflows/ci-cd.yml but remove deploy job
# Only run tests, lint, and build
# Let Dokploy handle actual deployment via GitHub webhook
```

## Recommended Approach: Option 1 (Dokploy Only)

Since Dokploy is already set up and working, this is the simplest path:

### Step 1: Access Dokploy

```
URL: http://51.79.55.171:3000
```

### Step 2: Configure GitHub Integration

1. Go to **Settings** in Dokploy
2. Click **GitHub Integration**
3. Authorize Dokploy to access your repository
4. Select the `echohub` repository

### Step 3: Enable Auto-Deploy

1. Go to your EchoHub application
2. Navigate to **Git** settings
3. Enable: **"Deploy on push to main branch"**
4. Dokploy will automatically deploy on every push

### Step 4: Remove GitHub Actions

```bash
# Disable GitHub Actions CI/CD
git rm .github/workflows/ci-cd.yml
git commit -m "chore: use Dokploy for deployments"
git push
```

### Step 5: Verify

```bash
# Make a small change and push
echo "# Test" >> README.md
git add README.md
git commit -m "test: trigger Dokploy deployment"
git push

# Check Dokploy logs at: http://51.79.55.171:3000
```

## If You Still Want GitHub Actions

You **must** fix the SSH timeout first:

### Fix SSH Timeout

The timeout happens because GitHub Actions IPs are not explicitly allowed. Add them:

```bash
ssh vps-simple

# Add GitHub Actions IP ranges
sudo ufw allow from 140.82.112.0/20 to any port 22 comment 'GitHub Actions 1'
sudo ufw allow from 143.55.64.0/20 to any port 22 comment 'GitHub Actions 2'
sudo ufw allow from 185.199.108.0/22 to any port 22 comment 'GitHub Actions 3'
sudo ufw allow from 192.30.252.0/22 to any port 22 comment 'GitHub Actions 4'

sudo ufw reload
sudo ufw status numbered
```

### Set GitHub Secrets

Copy these exactly into GitHub (Settings → Secrets → Actions):

| Secret | Value |
|--------|-------|
| `VPS_HOST` | `51.79.55.171` |
| `VPS_USER` | `memo` |
| `VPS_SSH_KEY` | Run: `cat ~/.ssh/id_ed25519_memo` (entire content) |
| `APP_KEY` | Run: `php artisan key:generate --show` |
| `DB_PASSWORD_PROD` | Your production database password |

### Test SSH from GitHub Actions

Create a test workflow to verify SSH works:

```bash
cat > .github/workflows/test-ssh.yml << 'EOF'
name: Test SSH Connection

on:
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - name: Test SSH
        uses: appleboy/ssh-action@v1.0.3
        with:
          host: ${{ secrets.VPS_HOST }}
          username: ${{ secrets.VPS_USER }}
          key: ${{ secrets.VPS_SSH_KEY }}
          script: |
            echo "SSH connection successful!"
            whoami
            hostname
            docker --version
EOF

git add .github/workflows/test-ssh.yml
git commit -m "test: add SSH connection test"
git push
```

Go to Actions tab and manually run "Test SSH Connection". If it succeeds, full CI/CD will work.

## My Recommendation

**Use Dokploy Only** because:
1. It's already working
2. No SSH timeout issues
3. Simpler to manage
4. Built-in monitoring and backups
5. Automatic SSL certificates
6. You can always add GitHub Actions later for testing

Remove `.github/workflows/ci-cd.yml` and let Dokploy handle deployments via its GitHub integration.

## Current VPS Configuration

For reference, here's what I found on your VPS:

```
VPS IP: 51.79.55.171
User: memo
SSH Key: ~/.ssh/id_ed25519_memo

Docker Version: 28.5.0
Dokploy: Running on port 3000
PostgreSQL: dokploy-postgres (user: dokploy)

Databases:
- echohub_production (owner: echohub_prod)
- echohub_staging (owner: echohub_staging)

Networks:
- dokploy-network (overlay, swarm mode)

Services Running:
- dokploy-traefik (routing HTTP/HTTPS)
- dokploy-postgres (database)
- ollama-service (AI)
- echohub-echohub (your app)
- echotravel-frontend (other app)

Firewall (UFW):
- Port 22: Open to Anywhere
- Port 80: Open to Anywhere
- Port 443: Open to Anywhere
```

## Next Steps

Choose one of the options above and follow the steps. I recommend **Option 1: Dokploy Only** for simplicity.

If you have questions or need help with any option, let me know!
