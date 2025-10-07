# Dokploy Quick Start for EchoHub

Fast-track guide to get EchoHub running on Dokploy in under 30 minutes.

## 1. Install Dokploy (5 min)

```bash
# SSH into your server
ssh memo@51.79.55.171

# Run installation script
./deployment/install-dokploy.sh

# Or manually:
curl -sSL https://dokploy.com/install.sh | sh
```

**Access dashboard:** http://51.79.55.171:3000

**Create admin account** (first user becomes admin)

---

## 2. Create PostgreSQL Databases (3 min)

In Dokploy dashboard:

**Production:**
- Click **+ Create** → **Database**
- Type: PostgreSQL 16
- Name: `echohub_production`
- Database: `echohub_production`
- User: `echohub`
- Password: (generate strong)
- Port: 5432

**Repeat for staging and development**

---

## 3. Create Applications (10 min per environment)

### Production App

**General:**
- Name: `echohub-production`
- Source: GitHub → Your repo
- Branch: `main`

**Build:**
- Type: Nixpacks (or Dockerfile)
- Port: 8000

**Environment Variables:**
Copy from `deployment/dokploy-env-template.txt`

**Key variables:**
```env
APP_ENV=production
APP_URL=https://hub.echotravel.app
DB_HOST=echohub_production
DB_DATABASE=echohub_production
```

**Domain:**
- Add: `hub.echotravel.app`
- HTTPS: Enabled

**Deploy** → Watch logs

### Staging App

Same as production but:
- Branch: `development`
- APP_ENV: `staging`
- APP_URL: `https://hub-staging.echotravel.app`
- DB_HOST: `echohub_staging`
- Domain: `hub-staging.echotravel.app`

### Development App

Same as staging but:
- APP_ENV: `local`
- APP_DEBUG: `true`
- APP_URL: `https://hub-dev.echotravel.app`
- DB_HOST: `echohub_development`
- Domain: `hub-dev.echotravel.app`

---

## 4. Run Migrations (2 min per app)

For each deployed app:

1. Go to app → **Terminal**
2. Run:

```bash
php artisan migrate --force
php artisan db:seed --force
```

---

## 5. Configure Auto-Deploy (1 min)

For each app:
- Settings → **Auto Deploy** → Enable
- Dokploy will deploy on git push automatically

---

## 6. Set Up Backups (2 min)

For each database:
- Database → **Backups**
- Schedule: Daily at 2 AM
- Retention: 7 days
- Enable

---

## 7. Test Your Deployment (5 min)

Visit:
- https://hub.echotravel.app (production)
- https://hub-staging.echotravel.app (staging)
- https://hub-dev.echotravel.app (development)

**Expected:**
- ✅ SSL working
- ✅ Application loads
- ✅ Database connected
- ✅ Assets loading

---

## Common Commands

### View Logs
```
Dashboard → Application → Logs
```

### Run Artisan Commands
```
Dashboard → Application → Terminal
php artisan cache:clear
php artisan migrate
```

### Redeploy
```
Dashboard → Application → Deploy
```

### Rollback
```
Dashboard → Application → Deployments → Select previous → Redeploy
```

---

## Troubleshooting

### Build fails
- Check build logs
- Verify Dockerfile or use Nixpacks
- Check dependencies in package.json/composer.json

### Database connection error
- Verify DB_HOST matches database name
- Check DB_PASSWORD is correct
- Database must be running (check status)

### SSL not working
- DNS must point to server (check with `dig hub.echotravel.app`)
- Wait 5 min for cert provisioning
- Traefik handles this automatically

### App not responding
- Check port is 8000
- View application logs
- Check health endpoint: `/up`

---

## Next Steps

✅ **Set up Matrix homeserver** (for Minerva AI)
✅ **Configure Minerva bot** (see ECHOTRAVEL_SETUP_CHECKLIST.md)
✅ **Invite team members** (Dashboard → Settings → Users)
✅ **Set up monitoring** (Dashboard → Application → Metrics)
✅ **Configure webhooks** (for deployment notifications)

---

## Resources

- **Full Migration Guide**: `deployment/DOKPLOY_MIGRATION.md`
- **Env Template**: `deployment/dokploy-env-template.txt`
- **Dashboard**: http://51.79.55.171:3000
- **Dokploy Docs**: https://docs.dokploy.com

---

**That's it!** Your EchoHub is now running on Dokploy with PostgreSQL 🎉
