# Easy Deployment Guide 🚀

Three simple improvements to make deploying EchoHub effortless and safe.

## 1. One-Command Deploy from Terminal ⌨️

Deploy to any environment with a single command from your Mac:

```bash
# Deploy to staging
./scripts/deploy staging

# Deploy to production
./scripts/deploy production
```

**What it does:**
- ✅ Automatically pushes latest code
- ✅ Triggers GitHub Actions deployment
- ✅ Watches deployment progress in real-time
- ✅ Shows you the URL when complete

**No more:**
- ❌ Visiting GitHub website
- ❌ Clicking through Actions tab
- ❌ Manually checking deployment status

---

## 2. Automatic Database Backup 💾

Every deployment now automatically backs up your database **before** running migrations.

**Location:** `/var/backups/echohub/`

**Format:** `{environment}-{database}-{timestamp}.sqlite`

**Examples:**
```
production-database-2025-10-05-14-30-00.sqlite
staging-database-2025-10-05-14-30-00.sqlite
```

**Features:**
- ✅ Backs up before every migration
- ✅ Keeps last 5 backups automatically
- ✅ Deletes older backups to save space
- ✅ Runs completely automatically

**Manual backup anytime:**
```bash
# On server
./deployment/backup-database.sh production
```

**Restore a backup:**
```bash
# On server
sudo cp /var/backups/echohub/production-database-2025-10-05-14-30-00.sqlite \
        /var/www/echohub/production/database/database.sqlite

sudo chown www-data:www-data /var/www/echohub/production/database/database.sqlite
sudo chmod 664 /var/www/echohub/production/database/database.sqlite
```

---

## 3. Health Check After Deploy 🏥

Every deployment now verifies the application is responding correctly.

**What it checks:**
- ✅ HTTP 200 response from `/up` endpoint
- ✅ Tries 3 times with 3-second delays
- ✅ Fails deployment if app doesn't respond

**What happens:**
1. Deployment completes
2. Waits 5 seconds for services to restart
3. Pings `https://hub.echotravel.app/up` (or staging URL)
4. If healthy → ✅ Success notification
5. If unhealthy → ❌ Deployment marked as failed

**Manual health check:**
```bash
# From your Mac
curl https://hub.echotravel.app/up
# Should return: "OK" with HTTP 200

# Or visit in browser
open https://hub.echotravel.app/up
```

**Benefits:**
- Know immediately if deployment succeeded
- Catch issues before users do
- GitHub Actions shows red ❌ if health check fails

---

## Complete Deployment Flow

Here's what happens when you run `./scripts/deploy production`:

```
1. 📤 Push code to GitHub (main branch)
2. 🤖 GitHub Actions starts deployment
3. 🔧 Fix file permissions
4. 📥 Pull latest code
5. 📦 Install dependencies
6. 🏗️  Build frontend assets
7. 💾 Backup database automatically
8. 🗃️  Run migrations (safe, only adds)
9. 🧹 Clear caches
10. 🔐 Set permissions
11. 🔄 Restart services
12. 🏥 Health check (3 attempts)
13. ✅ Success! (or ❌ Failed)
```

**Total time:** ~30-60 seconds

---

## Safety Features

### Your Data is Protected ✅

1. **Database backed up** before every migration
2. **Health checks** verify app works after deployment
3. **Migrations are safe** - only add, never delete
4. **.env never changes** - protected by .gitignore
5. **Database files preserved** - protected by .gitignore

See `deployment/DEPLOYMENT_SAFETY.md` for full details.

---

## Quick Reference

| Task | Command |
|------|---------|
| Deploy to staging | `./scripts/deploy staging` |
| Deploy to production | `./scripts/deploy production` |
| Manual backup | `./deployment/backup-database.sh production` |
| List backups | `ls -lh /var/backups/echohub/` (on server) |
| Health check | `curl https://hub.echotravel.app/up` |
| Watch deployment | `gh run watch` |

---

## Troubleshooting

### Deployment fails health check

**Symptoms:** Deployment shows ❌ with "Health check failed"

**Solutions:**
1. Check logs on server:
   ```bash
   tail -f /var/www/echohub/production/storage/logs/laravel.log
   ```

2. Check Nginx error logs:
   ```bash
   sudo tail -f /var/log/nginx/echohub-production-error.log
   ```

3. Manually verify site loads:
   ```bash
   curl -I https://hub.echotravel.app
   ```

4. Check PHP-FPM is running:
   ```bash
   sudo systemctl status php8.2-fpm
   ```

### Script says "gh not found"

**Install GitHub CLI:**
```bash
# Mac
brew install gh

# Or visit: https://cli.github.com/
```

**Authenticate:**
```bash
gh auth login
```

### Backup directory full

**Clean old backups manually:**
```bash
# On server
sudo find /var/backups/echohub -name "production-*.sqlite" -type f -mtime +30 -delete
```

This deletes backups older than 30 days.

---

## Next Level (Future)

Want even more automation? Consider:

- **Deployment notifications** (Discord/Slack when deploy completes)
- **Automatic rollback** (if health check fails)
- **Deploy specific commits** (not just latest)
- **Deployment dashboard** (see deployment history)

See `deployment/README.md` for the full roadmap.

---

**You're all set! Deploy with confidence.** 🎉

