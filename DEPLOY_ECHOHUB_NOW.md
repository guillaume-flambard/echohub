# Deploy EchoHub to Dokploy - Quick Guide

Fast deployment of EchoHub to your VPS at **51.79.55.171**

## Prerequisites

✅ VPS: 51.79.55.171
✅ GitHub: https://github.com/guillaume-flambard/echohub
✅ Domain: echotravel.app (will use hub.echotravel.app)

---

## Step 1: Install Dokploy on VPS (5 min)

SSH into your server:
```bash
ssh memo@51.79.55.171
```

Install Dokploy:
```bash
curl -sSL https://dokploy.com/install.sh | sh
```

**Wait for completion** (2-5 minutes)

Access dashboard at: **http://51.79.55.171:3000**

**Create admin account** (first login)

---

## Step 2: Create PostgreSQL Database (3 min)

In Dokploy dashboard:

1. Click **+ Create** → **Database**
2. Fill in:
   - **Name**: `echohub-production-db`
   - **Type**: PostgreSQL
   - **Version**: 16
   - **Database Name**: `echohub_production`
   - **Username**: `echohub`
   - **Password**: Click **Generate** (or create strong password)
   - **Port**: 5432
3. Click **Create**

**📝 SAVE THE PASSWORD!** You'll need it in Step 4.

---

## Step 3: Connect GitHub (2 min)

1. In Dokploy, go to **Settings** → **Git Providers**
2. Click **Add GitHub**
3. Authorize Dokploy
4. Select repository: `guillaume-flambard/echohub`

---

## Step 4: Create Application (10 min)

1. Click **+ Create** → **Application**

### General
- **Name**: `echohub-production`
- **Description**: EchoHub Production

### Source
- **Provider**: GitHub
- **Repository**: `guillaume-flambard/echohub`
- **Branch**: `main`
- **Build Path**: `/`

### Build
- **Build Type**: Dockerfile
- **Dockerfile**: `Dockerfile`
- **Port**: 8000

### Environment Variables

Click **Add Environment Variable** and add these:

```env
APP_NAME=EchoHub
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hub.echotravel.app
APP_KEY=

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=echohub-production-db
DB_PORT=5432
DB_DATABASE=echohub_production
DB_USERNAME=echohub
DB_PASSWORD=YOUR_DB_PASSWORD_FROM_STEP_2

SESSION_DRIVER=database
SESSION_LIFETIME=120
QUEUE_CONNECTION=database
CACHE_STORE=database

SANCTUM_STATEFUL_DOMAINS=hub.echotravel.app

MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_SERVER_NAME=echohub.local
MATRIX_ADMIN_USER=admin
MATRIX_ADMIN_PASSWORD=changeme123

MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b
```

**Note:** Leave `APP_KEY` empty for now.

### Domain
1. Click **Add Domain**
2. Enter: `hub.echotravel.app`
3. Enable **HTTPS**
4. Click **Save**

### Deploy
Click **Create & Deploy**

**Watch the build logs** (5-10 minutes for first build)

---

## Step 5: Generate APP_KEY (2 min)

After deployment completes:

1. Go to application → **Terminal** tab
2. Run:
```bash
php artisan key:generate --show
```

3. **Copy the output** (starts with `base64:`)
4. Go to **Environment** tab
5. Find `APP_KEY` variable
6. Paste the generated key
7. Click **Save**
8. Click **Deploy** button (quick redeploy)

---

## Step 6: Run Database Migrations (3 min)

In **Terminal** tab:

```bash
php artisan migrate --force
```

Seed the database:
```bash
php artisan db:seed --force
```

**📝 SAVE API KEYS** shown in the output!

---

## Step 7: Configure DNS (5 min)

In your DNS provider (Cloudflare/Namecheap):

Add A record:
```
Type: A
Name: hub
Value: 51.79.55.171
TTL: Auto
```

**Wait 2-5 minutes** for DNS propagation.

Test DNS:
```bash
dig hub.echotravel.app
# Should return 51.79.55.171
```

---

## Step 8: Test Your Deployment (2 min)

Visit: **https://hub.echotravel.app**

**Expected:**
- ✅ HTTPS working (green lock)
- ✅ Application loads
- ✅ Can register/login
- ✅ No database errors

If you see errors, check application logs in Dokploy.

---

## Step 9: Set Up Auto-Deploy (1 min)

In application settings:
1. Go to **Settings** tab
2. Toggle **Auto Deploy** to ON
3. Save

Now pushes to `main` branch auto-deploy!

---

## Step 10: Enable Backups (2 min)

For database:
1. Go to database → **Backups** tab
2. Click **Configure Backup**
3. **Schedule**: Daily
4. **Time**: 02:00 (2 AM)
5. **Retention**: 7 days
6. Enable & Save

---

## ✅ Deployment Complete!

**Your EchoHub is live!**

- 🌐 **URL**: https://hub.echotravel.app
- 📊 **Dashboard**: http://51.79.55.171:3000
- 💾 **Database**: PostgreSQL 16 (backed up daily)

---

## Common Commands

### View Logs
```
Dokploy → echohub-production → Logs
```

### Run Artisan Commands
```
Dokploy → echohub-production → Terminal

php artisan cache:clear
php artisan config:clear
php artisan migrate
```

### Deploy New Version
```bash
# Option 1: Push to GitHub (auto-deploys)
git push origin main

# Option 2: Manual deploy
# Dokploy → Application → Deploy button
```

### Rollback Deployment
```
Dokploy → Application → Deployments → Select previous → Redeploy
```

---

## Troubleshooting

### Build Failed
- Check build logs in Dokploy
- Verify Dockerfile syntax
- Check all dependencies in composer.json/package.json

### Database Connection Error
- Verify DB_HOST = `echohub-production-db` (database name in Dokploy)
- Check DB_PASSWORD matches
- Ensure database is running (green status)

### SSL Certificate Not Working
- Verify DNS points to 51.79.55.171
- Wait 5 minutes for Let's Encrypt to provision
- Check domain is configured in Dokploy

### Application Not Loading
- Check APP_KEY is set
- Run migrations: `php artisan migrate --force`
- Check logs for errors

---

## Next Steps

1. **Integrate EchoTravel API**
   - Follow `ECHOTRAVEL_API_SETUP.md`
   - Update EchoHub's App model with EchoTravel production URL

2. **Set Up Matrix (Optional)**
   - For Minerva AI chat functionality
   - Requires additional Docker container

3. **Invite Team**
   - Dokploy → Settings → Users

4. **Monitor**
   - Dokploy → Application → Metrics
   - Set up alerts

---

## Important Notes

### Security
- ✅ APP_KEY is unique and secret
- ✅ Database password is strong
- ✅ HTTPS enabled
- ✅ APP_DEBUG=false in production
- ✅ Regular backups enabled

### Performance
- First build takes 5-10 minutes
- Subsequent deploys take 2-3 minutes
- Dokploy handles zero-downtime deployments

### Cost
- Dokploy is free and open-source
- Only pay for VPS hosting
- No hidden fees

---

## Support

- **Dokploy Docs**: https://docs.dokploy.com
- **EchoHub Repo**: https://github.com/guillaume-flambard/echohub
- **Dashboard**: http://51.79.55.171:3000

---

**Happy deploying! 🚀**
