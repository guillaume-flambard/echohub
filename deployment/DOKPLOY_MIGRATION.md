# Migrate EchoHub to Dokploy

Complete guide to migrate EchoHub from manual deployment to Dokploy PaaS platform.

## Why Dokploy?

- ✅ **PostgreSQL Built-in**: Automatic database provisioning and backups
- ✅ **Simple Deployment**: Replace GitHub Actions with dashboard management
- ✅ **Multi-Environment**: Easy production/staging/dev setup
- ✅ **Auto SSL**: Traefik handles Let's Encrypt certificates automatically
- ✅ **Open Source**: Self-hosted, no vendor lock-in ($0/month or $4.50/month managed)

---

## Prerequisites

- VPS server (already have: 51.79.55.171)
- Ubuntu 24.04
- Ports 80, 443, and 3000 available
- GitHub repository access
- Domain configured (echotravel.app)

---

## Step 1: Install Dokploy on VPS

SSH into your server:

```bash
ssh memo@51.79.55.171
```

Run the Dokploy installation script:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

**What this does:**
- Installs Docker (if not installed)
- Installs Dokploy
- Sets up Traefik reverse proxy
- Creates admin dashboard

**Wait for installation** (2-5 minutes)

---

## Step 2: Access Dokploy Dashboard

Open your browser:

```
http://51.79.55.171:3000
```

**Create admin account:**
- Username: `admin`
- Email: `your@email.com`
- Password: (choose a strong password)

**Save these credentials!**

---

## Step 3: Configure Server in Dokploy

In the Dokploy dashboard:

1. Go to **Settings** → **Server**
2. Verify server details
3. Add your server SSH key if deploying to multiple servers (optional)

---

## Step 4: Create PostgreSQL Databases

### Production Database

1. Click **+ Create** → **Database**
2. Configure:
   - **Name**: `echohub_production`
   - **Database Type**: PostgreSQL
   - **Version**: 16 (latest)
   - **Database Name**: `echohub_production`
   - **Username**: `echohub`
   - **Password**: (generate strong password)
   - **Port**: 5432
3. Click **Create**

**Save the connection details!**

### Staging Database

Repeat for staging:
- **Name**: `echohub_staging`
- **Database Name**: `echohub_staging`
- **Username**: `echohub`
- **Password**: (different from production)

### Development Database

Repeat for development:
- **Name**: `echohub_development`
- **Database Name**: `echohub_development`
- **Username**: `echohub`
- **Password**: (different from others)

**💡 Tip:** Click the database to see connection details and test connection.

---

## Step 5: Create EchoHub Applications

### Production Application

1. Click **+ Create** → **Application**
2. Configure:

**General:**
- **Name**: `echohub-production`
- **Description**: EchoHub Production Environment

**Source:**
- **Source Provider**: GitHub
- **Repository**: Select your EchoHub repo
- **Branch**: `main`
- **Build Path**: `/` (root)

**Build:**
- **Build Type**: Nixpacks (auto-detects Laravel)
- **Port**: 8000

**Environment Variables:**
Click **Add Environment Variable** and add:

```env
APP_NAME=EchoHub
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hub.echotravel.app
APP_KEY=base64:your_key_here

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=echohub_production  # Name of your database in Dokploy
DB_PORT=5432
DB_DATABASE=echohub_production
DB_USERNAME=echohub
DB_PASSWORD=your_production_db_password

SESSION_DRIVER=database
SESSION_LIFETIME=120
QUEUE_CONNECTION=database
CACHE_STORE=database

SANCTUM_STATEFUL_DOMAINS=hub.echotravel.app

# Matrix
MATRIX_HOMESERVER_URL=http://echohub_synapse:8008
MATRIX_SERVER_NAME=echohub.local

# Minerva AI
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b
```

**Domain:**
- Click **Add Domain**
- **Domain**: `hub.echotravel.app`
- **HTTPS**: Enabled (Dokploy handles SSL automatically)

3. Click **Create & Deploy**

### Staging Application

Repeat for staging:
- **Name**: `echohub-staging`
- **Branch**: `development`
- **Domain**: `hub-staging.echotravel.app`
- **DB_HOST**: `echohub_staging`
- Update all environment variables for staging

### Development Application

Repeat for development:
- **Name**: `echohub-development`
- **Branch**: `development`
- **Domain**: `hub-dev.echotravel.app`
- **DB_HOST**: `echohub_development`
- Update all environment variables for development

---

## Step 6: Deploy Applications

For each application:

1. Go to the application in Dokploy
2. Click **Deploy** button
3. Watch the build logs
4. Wait for deployment to complete

**First deployment takes 3-5 minutes** (installing dependencies, building assets)

---

## Step 7: Run Database Migrations

For each application after deployment:

1. Go to application → **Terminal** tab
2. Run migrations:

```bash
php artisan migrate --force
php artisan db:seed --force
```

**Or use the Advanced → Commands section:**
- Add command: `php artisan migrate --force`
- Run it

---

## Step 8: Configure Auto-Deploy (Optional)

To enable automatic deployments on git push:

1. Go to application → **Settings**
2. Enable **Auto Deploy**
3. Dokploy will deploy automatically when you push to the configured branch

**How it works:**
- Push to `main` → Production deploys
- Push to `development` → Staging & Dev deploy

---

## Step 9: Set Up Matrix Homeserver (Optional)

If you need Matrix for Minerva AI:

### Option A: Add as Docker Compose Service

1. Go to **+ Create** → **Compose**
2. Name: `matrix-homeserver`
3. Paste your `docker-compose.matrix.yml` content
4. Deploy

### Option B: Keep existing Docker Compose

Your existing Matrix setup will still work alongside Dokploy.

---

## Step 10: Configure DNS

Update your DNS records to point to your server:

```
A     hub.echotravel.app              → 51.79.55.171
A     hub-staging.echotravel.app      → 51.79.55.171
A     hub-dev.echotravel.app          → 51.79.55.171
```

**SSL Certificates:** Dokploy's Traefik automatically provisions Let's Encrypt certificates for all domains.

---

## Step 11: Test Your Deployments

Visit each environment:
- **Production**: https://hub.echotravel.app
- **Staging**: https://hub-staging.echotravel.app
- **Development**: https://hub-dev.echotravel.app

**Expected:** SSL working, application loading, database connected

---

## Step 12: Set Up Backups

Dokploy includes built-in database backups.

For each database:
1. Go to database → **Backups** tab
2. Configure:
   - **Schedule**: Daily at 2 AM
   - **Retention**: Keep last 7 backups
3. Enable backups

**Backups are stored in Dokploy's volume** and can be downloaded from the dashboard.

---

## Step 13: Monitor Your Applications

Dokploy dashboard shows:
- **CPU/Memory usage** (real-time)
- **Deployment history**
- **Logs** (application & build)
- **Database metrics**

Access:
- **Application Logs**: Application → Logs tab
- **Database Logs**: Database → Logs tab
- **Server Metrics**: Dashboard → Monitoring

---

## Cleanup Old Setup (Optional)

Once Dokploy is working, you can clean up:

### Remove GitHub Actions Workflow

```bash
git rm .github/workflows/deploy.yml
git commit -m "Remove old deployment workflow (using Dokploy now)"
git push
```

### Remove Deployment Scripts

```bash
git rm -r deployment/
git commit -m "Remove manual deployment scripts (using Dokploy now)"
git push
```

### Keep These:
- `docker-compose.matrix.yml` (if using Matrix)
- `.env.example`
- Documentation files

---

## Common Tasks

### Deploy a New Version

**Option 1: Git Push (with Auto-Deploy enabled)**
```bash
git push origin main  # Deploys production automatically
```

**Option 2: Manual Deploy**
1. Go to Dokploy dashboard
2. Select application
3. Click **Deploy**

### Run Artisan Commands

1. Go to application → **Terminal**
2. Run commands:
```bash
php artisan migrate
php artisan cache:clear
php artisan queue:work
```

### View Logs

1. Go to application → **Logs**
2. Filter by:
   - Build logs
   - Application logs
   - Error logs

### Rollback Deployment

1. Go to application → **Deployments**
2. Find previous deployment
3. Click **Redeploy**

### Scale Application (Advanced)

1. Go to application → **Advanced**
2. Set **Replicas**: 2 (for load balancing)
3. Dokploy handles the rest

---

## Troubleshooting

### Build Fails

**Check:**
- Build logs in Dokploy dashboard
- Ensure all dependencies in `composer.json`
- Verify Nixpacks detects Laravel correctly

**Fix:** Use custom Dockerfile if Nixpacks fails (see `deployment/Dockerfile`)

### Database Connection Error

**Check:**
- Environment variables correct
- `DB_HOST` matches database name in Dokploy
- Database is running (check database status in dashboard)

**Fix:** Update env vars and redeploy

### SSL Certificate Not Working

**Check:**
- DNS points to server IP
- Domain configured in Dokploy
- Port 80 and 443 open

**Fix:** Traefik handles this automatically, wait 5 minutes for cert provisioning

### Application Not Responding

**Check:**
- Application logs
- Port 8000 configured correctly
- Health check passing

**Fix:** Restart application from Dokploy dashboard

---

## Cost Comparison

### Old Setup
- Manual server management
- GitHub Actions (free but complex)
- Manual backups
- Manual SSL renewal
- **Time**: High maintenance

### Dokploy
- Dashboard management
- Auto-deployments
- Auto backups
- Auto SSL
- **Cost**: Free (self-hosted) or $4.50/month (managed)
- **Time**: Low maintenance

---

## Next Steps

1. **Set up monitoring alerts** (Dokploy supports webhooks for Discord/Slack)
2. **Configure staging environment** for testing before production
3. **Enable auto-deploy** for faster iteration
4. **Set up database backups** with retention policy
5. **Invite team members** (Dokploy supports multi-user with roles)

---

## Resources

- **Dokploy Docs**: https://docs.dokploy.com
- **Dokploy GitHub**: https://github.com/Dokploy/dokploy
- **Community**: https://discord.gg/dokploy
- **Your Dashboard**: http://51.79.55.171:3000

---

## Quick Reference

| Task | Command/Location |
|------|------------------|
| Access Dashboard | http://51.79.55.171:3000 |
| Deploy Production | Push to `main` or click Deploy |
| View Logs | Dashboard → Application → Logs |
| Run Migrations | Dashboard → Application → Terminal |
| Check Database | Dashboard → Database → Metrics |
| Manage Backups | Dashboard → Database → Backups |
| Update Domains | Dashboard → Application → Domains |
| Roll Back | Dashboard → Application → Deployments |

---

**Migration Complete!** 🎉

Your EchoHub is now running on Dokploy with:
- ✅ PostgreSQL with automatic backups
- ✅ Auto-deployments from GitHub
- ✅ SSL certificates (Let's Encrypt)
- ✅ Multi-environment support
- ✅ Dashboard monitoring
