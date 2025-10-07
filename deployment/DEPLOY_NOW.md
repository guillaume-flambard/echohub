# Deploy EchoHub to Dokploy - Step by Step

Follow these steps exactly to deploy EchoHub through Dokploy.

## Prerequisites

- ✅ VPS: 51.79.55.171
- ✅ GitHub repo with EchoHub code
- ✅ Domain: echotravel.app

---

## Step 1: Install Dokploy on Server (5 min)

SSH into your server:

```bash
ssh memo@51.79.55.171
```

Run the installation command:

```bash
curl -sSL https://dokploy.com/install.sh | sh
```

**Wait for installation to complete** (2-5 minutes)

You'll see:
```
✓ Dokploy installed successfully
Access the dashboard at: http://51.79.55.171:3000
```

---

## Step 2: Access Dokploy Dashboard (1 min)

Open in your browser:
```
http://51.79.55.171:3000
```

**Create your admin account:**
- Username: `admin`
- Email: `your@email.com`
- Password: `YourStrongPassword123!`

**Save these credentials!**

---

## Step 3: Create PostgreSQL Databases (5 min)

### Production Database

1. Click **+ Create** button (top right)
2. Select **Database**
3. Fill in:
   - **Name**: `echohub_production`
   - **Type**: PostgreSQL
   - **Version**: 16
   - **Database Name**: `echohub_production`
   - **Username**: `echohub`
   - **Password**: (click Generate or use your own strong password)
   - **Port**: 5432
4. Click **Create**

**📝 Save the password!** You'll need it in Step 5.

### Staging Database

Repeat the process:
- **Name**: `echohub_staging`
- **Database Name**: `echohub_staging`
- **Username**: `echohub`
- **Password**: (generate new password)

**📝 Save this password too!**

### Development Database

One more time:
- **Name**: `echohub_development`
- **Database Name**: `echohub_development`
- **Username**: `echohub`
- **Password**: (generate new password)

**📝 Save this password!**

---

## Step 4: Connect GitHub (2 min)

1. In Dokploy dashboard, go to **Settings** → **Git Providers**
2. Click **Add GitHub**
3. Authorize Dokploy to access your GitHub
4. Select your EchoHub repository

---

## Step 5: Create Production Application (10 min)

1. Click **+ Create** → **Application**

### General Tab

- **Name**: `echohub-production`
- **Description**: EchoHub Production Environment

### Source Tab

- **Source Provider**: GitHub
- **Repository**: Select your EchoHub repo
- **Branch**: `main`
- **Build Path**: `/` (root)

### Build Tab

- **Build Type**: Nixpacks (recommended) or Dockerfile
- **Port**: 8000

### Environment Tab

Click **Add Environment Variable** and add these (one by one):

```env
APP_NAME=EchoHub
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hub.echotravel.app
APP_KEY=

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=pgsql
DB_HOST=echohub_production
DB_PORT=5432
DB_DATABASE=echohub_production
DB_USERNAME=echohub
DB_PASSWORD=YOUR_PRODUCTION_DB_PASSWORD_FROM_STEP_3

SESSION_DRIVER=database
SESSION_LIFETIME=120
QUEUE_CONNECTION=database
CACHE_STORE=database

SANCTUM_STATEFUL_DOMAINS=hub.echotravel.app

MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_SERVER_NAME=echohub.local

MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b
```

**Important:** Leave `APP_KEY` empty for now, we'll generate it after first deploy.

### Domains Tab

1. Click **Add Domain**
2. **Domain**: `hub.echotravel.app`
3. **HTTPS**: ✅ Enabled
4. Click **Save**

### Deploy

Click **Create & Deploy** button

**Watch the build logs** (3-5 minutes for first deploy)

---

## Step 6: Generate APP_KEY (2 min)

After deployment completes:

1. Go to your application → **Terminal** tab
2. Run:
```bash
php artisan key:generate --show
```

3. Copy the output (starts with `base64:`)
4. Go to **Environment** tab
5. Edit `APP_KEY` variable
6. Paste the key
7. Click **Save**
8. Click **Deploy** again (quick redeploy)

---

## Step 7: Run Migrations (2 min)

In the **Terminal** tab:

```bash
php artisan migrate --force
php artisan db:seed --force
```

**Expected output:**
```
Migration table created successfully.
Migrating: ...
Migrated: ...
Seeding: AppSeeder
```

**📝 Save the API keys shown** in the seeder output!

---

## Step 8: Update DNS (5 min)

In your Cloudflare (or DNS provider):

Add A record:
```
A    hub.echotravel.app    →    51.79.55.171
```

**Wait 2-5 minutes** for DNS propagation.

---

## Step 9: Test Production (2 min)

Visit: **https://hub.echotravel.app**

**Expected:**
- ✅ SSL certificate working (https)
- ✅ Application loads
- ✅ Can log in
- ✅ No errors

**If you see errors**, check application logs in Dokploy dashboard.

---

## Step 10: Create Staging Application (10 min)

Repeat Step 5 with these differences:

**General:**
- **Name**: `echohub-staging`

**Source:**
- **Branch**: `development`

**Environment:**
- `APP_ENV=staging`
- `APP_DEBUG=true`
- `APP_URL=https://hub-staging.echotravel.app`
- `DB_HOST=echohub_staging`
- `DB_DATABASE=echohub_staging`
- `DB_PASSWORD=YOUR_STAGING_DB_PASSWORD`
- `SANCTUM_STATEFUL_DOMAINS=hub-staging.echotravel.app`

**Domains:**
- `hub-staging.echotravel.app`

Then:
1. Deploy
2. Generate APP_KEY
3. Run migrations
4. Update DNS (A record for `hub-staging.echotravel.app`)
5. Test at https://hub-staging.echotravel.app

---

## Step 11: Create Development Application (10 min)

Same as staging, but:

**General:**
- **Name**: `echohub-development`

**Environment:**
- `APP_ENV=local`
- `APP_URL=https://hub-dev.echotravel.app`
- `DB_HOST=echohub_development`
- `DB_DATABASE=echohub_development`
- `DB_PASSWORD=YOUR_DEV_DB_PASSWORD`
- `SANCTUM_STATEFUL_DOMAINS=hub-dev.echotravel.app`
- `LOG_LEVEL=debug`

**Domains:**
- `hub-dev.echotravel.app`

Deploy, generate key, migrate, update DNS, test.

---

## Step 12: Enable Auto-Deploy (1 min per app)

For each application:

1. Go to **Settings** tab
2. Toggle **Auto Deploy** to ON
3. Save

**Now when you:**
- Push to `main` → Production auto-deploys
- Push to `development` → Staging & Dev auto-deploy

---

## Step 13: Set Up Database Backups (2 min per database)

For each database:

1. Go to database → **Backups** tab
2. Click **Configure Backup**
3. **Schedule**: Daily
4. **Time**: 02:00 (2 AM)
5. **Retention**: 7 days
6. Enable
7. Save

---

## ✅ Deployment Complete!

Your EchoHub is now live on Dokploy with PostgreSQL!

**Access:**
- 🌐 **Production**: https://hub.echotravel.app
- 🧪 **Staging**: https://hub-staging.echotravel.app
- 🔧 **Development**: https://hub-dev.echotravel.app
- 📊 **Dashboard**: http://51.79.55.171:3000

---

## Common Commands

### Deploy New Version
```bash
# Option 1: Push to GitHub (auto-deploys)
git push origin main

# Option 2: Manual deploy
# Go to Dokploy → Application → Deploy button
```

### View Logs
```
Dokploy → Application → Logs tab
```

### Run Artisan Commands
```
Dokploy → Application → Terminal tab
php artisan cache:clear
php artisan migrate
```

### Rollback
```
Dokploy → Application → Deployments tab
Click on previous deployment → Redeploy
```

---

## Troubleshooting

### Build Failed
**Check:** Build logs in Dokploy
**Fix:** Ensure all dependencies in composer.json/package.json

### Database Connection Error
**Check:**
- DB_HOST matches database name in Dokploy
- DB_PASSWORD is correct
**Fix:** Update environment variables and redeploy

### SSL Not Working
**Check:**
- DNS points to 51.79.55.171
- Domain configured in Dokploy
**Fix:** Wait 5 minutes for Let's Encrypt provisioning

### Application Not Loading
**Check:** Application logs
**Fix:** Verify APP_KEY is set, run migrations

---

## Next Steps

1. ✅ **Integrate EchoTravel** - Follow `ECHOTRAVEL_API_SETUP.md`
2. ✅ **Set up Matrix** - For Minerva AI bots
3. ✅ **Configure monitoring** - Alerts in Dokploy
4. ✅ **Invite team** - Add users in Dokploy settings

---

**Need help?**
- Check full guide: `DOKPLOY_MIGRATION.md`
- Dokploy docs: https://docs.dokploy.com
- Your dashboard: http://51.79.55.171:3000
