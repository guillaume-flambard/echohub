# PostgreSQL Deployment Checklist for Dokploy

Quick checklist to deploy EchoHub with PostgreSQL databases through Dokploy.

## ✅ Pre-Deployment Checklist

- [ ] VPS accessible: `ssh memo@51.79.55.171`
- [ ] GitHub repo ready with latest code
- [ ] Domain DNS can be updated: echotravel.app
- [ ] Cloudflare/DNS access available

---

## Step 1: Install Dokploy ⏱️ 5 min

```bash
ssh memo@51.79.55.171
curl -sSL https://dokploy.com/install.sh | sh
```

- [ ] Installation complete
- [ ] Dashboard accessible at http://51.79.55.171:3000
- [ ] Admin account created

---

## Step 2: Create PostgreSQL Databases ⏱️ 5 min

### Production Database

In Dokploy dashboard:

1. Click **+ Create** → **Database**
2. Fill in:
   ```
   Type: PostgreSQL
   Version: 16
   Name: echohub_production
   Database Name: echohub_production
   Username: echohub
   Password: [Generate Strong Password]
   Port: 5432
   ```
3. Click **Create**

- [ ] Production PostgreSQL database created
- [ ] Password saved: `_________________________________`

### Staging Database

Repeat:
```
Name: echohub_staging
Database Name: echohub_staging
Username: echohub
Password: [Generate Different Password]
Port: 5432
```

- [ ] Staging PostgreSQL database created
- [ ] Password saved: `_________________________________`

### Development Database

Repeat:
```
Name: echohub_development
Database Name: echohub_development
Username: echohub
Password: [Generate Different Password]
Port: 5432
```

- [ ] Development PostgreSQL database created
- [ ] Password saved: `_________________________________`

---

## Step 3: Create Production Application ⏱️ 10 min

### General
- Name: `echohub-production`
- Description: EchoHub Production with PostgreSQL

### Source
- Provider: GitHub
- Repository: [Your EchoHub repo]
- Branch: `main`
- Build Path: `/`

### Build
- Build Type: **Nixpacks** (auto-detects Laravel + Bun)
- Port: **8000**

### Environment Variables (PostgreSQL Config)

Add these environment variables:

```env
APP_NAME=EchoHub
APP_ENV=production
APP_DEBUG=false
APP_URL=https://hub.echotravel.app
APP_KEY=

LOG_CHANNEL=stack
LOG_LEVEL=error

# PostgreSQL Configuration
DB_CONNECTION=pgsql
DB_HOST=echohub_production
DB_PORT=5432
DB_DATABASE=echohub_production
DB_USERNAME=echohub
DB_PASSWORD=[Your Production DB Password from Step 2]

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

**Critical:** Make sure `DB_CONNECTION=pgsql` and `DB_HOST=echohub_production` (database name from Step 2)

### Domain
- Domain: `hub.echotravel.app`
- HTTPS: ✅ Enabled

### Deploy

- [ ] Application created
- [ ] Build started (watch logs)
- [ ] Build completed successfully (3-5 min)

---

## Step 4: Post-Deployment Setup ⏱️ 5 min

### Generate APP_KEY

In Dokploy → Application → **Terminal**:
```bash
php artisan key:generate --show
```

- [ ] APP_KEY generated
- [ ] Added to Environment variables
- [ ] Redeployed

### Run Migrations

In **Terminal**:
```bash
php artisan migrate --force
php artisan db:seed --force
```

- [ ] Migrations completed
- [ ] Database seeded
- [ ] API keys saved from output

### Verify PostgreSQL Connection

In **Terminal**:
```bash
php artisan tinker
# Run this:
DB::connection()->getPdo();
echo DB::connection()->getDatabaseName();
exit
```

Expected output:
```
=> PDO {...}
=> "echohub_production"
```

- [ ] PostgreSQL connection verified
- [ ] Correct database name shown

---

## Step 5: Configure DNS ⏱️ 2 min

In Cloudflare/DNS provider:

```
Type: A
Name: hub
Value: 51.79.55.171
Proxy: Yes (orange cloud)
```

- [ ] DNS record added
- [ ] Waiting for propagation (2-5 min)

---

## Step 6: Test Production ⏱️ 2 min

Visit: **https://hub.echotravel.app**

- [ ] SSL certificate active (https://)
- [ ] Application loads
- [ ] No database errors
- [ ] Can create account
- [ ] Can log in
- [ ] Dashboard shows data

Check PostgreSQL in Dokploy:
- [ ] Database → Metrics shows connections
- [ ] Database size is growing

---

## Step 7: Staging Environment ⏱️ 10 min

Repeat Steps 3-6 with these changes:

**Application:**
- Name: `echohub-staging`
- Branch: `development`

**Environment:**
```env
APP_ENV=staging
APP_DEBUG=true
APP_URL=https://hub-staging.echotravel.app
DB_HOST=echohub_staging
DB_DATABASE=echohub_staging
DB_PASSWORD=[Your Staging DB Password]
SANCTUM_STATEFUL_DOMAINS=hub-staging.echotravel.app
```

**Domain:**
- `hub-staging.echotravel.app`

**DNS:**
```
Type: A
Name: hub-staging
Value: 51.79.55.171
```

- [ ] Staging deployed with PostgreSQL
- [ ] https://hub-staging.echotravel.app working

---

## Step 8: Development Environment ⏱️ 10 min

Same as staging but:

**Application:**
- Name: `echohub-development`

**Environment:**
```env
APP_ENV=local
APP_URL=https://hub-dev.echotravel.app
DB_HOST=echohub_development
DB_DATABASE=echohub_development
DB_PASSWORD=[Your Dev DB Password]
SANCTUM_STATEFUL_DOMAINS=hub-dev.echotravel.app
LOG_LEVEL=debug
```

**Domain:**
- `hub-dev.echotravel.app`

**DNS:**
```
Type: A
Name: hub-dev
Value: 51.79.55.171
```

- [ ] Development deployed with PostgreSQL
- [ ] https://hub-dev.echotravel.app working

---

## Step 9: Configure Auto-Deploy ⏱️ 1 min

For each application:
- [ ] Production → Settings → Auto Deploy → ON
- [ ] Staging → Settings → Auto Deploy → ON
- [ ] Development → Settings → Auto Deploy → ON

Now:
- Push to `main` → Production auto-deploys
- Push to `development` → Staging & Dev auto-deploy

---

## Step 10: PostgreSQL Backups ⏱️ 2 min per DB

### Production Backup

Database → `echohub_production` → **Backups**:
```
Schedule: Daily
Time: 02:00
Retention: 7 days
Enabled: Yes
```

- [ ] Production backup configured

### Staging Backup

Database → `echohub_staging` → **Backups**:
- [ ] Staging backup configured

### Development Backup

Database → `echohub_development` → **Backups**:
- [ ] Development backup configured

---

## ✅ Deployment Complete!

### Verify Everything

- [ ] **3 PostgreSQL databases** running (check Dokploy → Databases)
- [ ] **3 applications** deployed (check Dokploy → Applications)
- [ ] **3 domains** working with SSL
- [ ] **Auto-deploy** enabled
- [ ] **Backups** configured

### Access Points

- 🌐 Production: https://hub.echotravel.app (PostgreSQL: echohub_production)
- 🧪 Staging: https://hub-staging.echotravel.app (PostgreSQL: echohub_staging)
- 🔧 Development: https://hub-dev.echotravel.app (PostgreSQL: echohub_development)
- 📊 Dashboard: http://51.79.55.171:3000

### PostgreSQL Info

Check database metrics in Dokploy:
- Database → Select database → **Metrics** tab
- See connections, size, performance

---

## Common PostgreSQL Commands

### In Dokploy Terminal:

```bash
# Check connection
php artisan tinker
DB::connection()->getPdo();

# Check database name
echo config('database.connections.pgsql.database');

# Run query
DB::select('SELECT version()');

# Check tables
DB::select("SELECT tablename FROM pg_tables WHERE schemaname='public'");
```

### In Database Terminal (Dokploy → Database → Terminal):

```bash
# Connect to database
psql -U echohub -d echohub_production

# List tables
\dt

# Show table structure
\d users

# Count records
SELECT COUNT(*) FROM users;

# Exit
\q
```

---

## Troubleshooting

### "Database does not exist"
- Check `DB_HOST` matches database name in Dokploy
- Verify database is running (Dokploy → Database → Status)

### "Password authentication failed"
- Check `DB_PASSWORD` in environment variables
- Verify password matches what you set in Step 2

### "Could not connect to server"
- Ensure `DB_HOST=echohub_production` (not localhost or 127.0.0.1)
- Database must use the name you gave it in Dokploy

### Migration fails
- Check logs: Dokploy → Application → Logs
- Verify database is running
- Check permissions on database

---

## Next Steps

- [ ] **Integrate EchoTravel** - See `ECHOTRAVEL_API_SETUP.md`
- [ ] **Set up Matrix** - For Minerva AI bots
- [ ] **Monitor databases** - Check Dokploy metrics daily
- [ ] **Test backups** - Download a backup and verify it works

---

**PostgreSQL Deployment: Complete!** 🎉

All 3 environments now running with dedicated PostgreSQL 16 databases, automatic backups, and auto-deployment from GitHub.
