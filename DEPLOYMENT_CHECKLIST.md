# EchoHub Deployment Checklist

Quick reference for deploying EchoHub to Dokploy.

## Pre-Deployment ✅

- [x] Code pushed to GitHub (main branch)
- [x] Dockerfile ready
- [x] Environment template ready
- [x] VPS accessible: 51.79.55.171
- [x] Domain ready: echotravel.app

---

## Deployment Steps

### 1. Install Dokploy (5 min)
```bash
ssh memo@51.79.55.171
curl -sSL https://dokploy.com/install.sh | sh
```

- [ ] Dokploy installed
- [ ] Accessed dashboard at http://51.79.55.171:3000
- [ ] Created admin account

---

### 2. Create Database (3 min)

Dashboard → + Create → Database

- [ ] Name: `echohub-production-db`
- [ ] Type: PostgreSQL 16
- [ ] Database: `echohub_production`
- [ ] Username: `echohub`
- [ ] Password: **[SAVED]** _______________
- [ ] Port: 5432
- [ ] Created

---

### 3. Connect GitHub (2 min)

Dashboard → Settings → Git Providers

- [ ] GitHub connected
- [ ] Repository authorized: `guillaume-flambard/echohub`

---

### 4. Create Application (10 min)

Dashboard → + Create → Application

**General:**
- [ ] Name: `echohub-production`

**Source:**
- [ ] GitHub repository selected
- [ ] Branch: `main`

**Build:**
- [ ] Type: Dockerfile
- [ ] Port: 8000

**Environment Variables:**
- [ ] All variables added from `deployment/dokploy-env-template.txt`
- [ ] DB_PASSWORD set
- [ ] APP_KEY left empty (for now)

**Domain:**
- [ ] Domain added: `hub.echotravel.app`
- [ ] HTTPS enabled

**Deploy:**
- [ ] Clicked "Create & Deploy"
- [ ] Build completed successfully

---

### 5. Generate APP_KEY (2 min)

Dashboard → Application → Terminal

```bash
php artisan key:generate --show
```

- [ ] APP_KEY generated
- [ ] APP_KEY copied: **[SAVED]** _______________
- [ ] Updated in Environment tab
- [ ] Redeployed

---

### 6. Run Migrations (3 min)

Dashboard → Application → Terminal

```bash
php artisan migrate --force
php artisan db:seed --force
```

- [ ] Migrations completed
- [ ] Seeder run
- [ ] API keys saved:
  - EchoTravel: **[SAVED]** _______________
  - Phangan.AI: **[SAVED]** _______________

---

### 7. Configure DNS (5 min)

DNS Provider → Add A Record

```
Type: A
Name: hub
Value: 51.79.55.171
```

- [ ] A record added
- [ ] DNS propagated (test with `dig hub.echotravel.app`)

---

### 8. Test Deployment (2 min)

Visit: https://hub.echotravel.app

- [ ] HTTPS working
- [ ] Application loads
- [ ] Can register/login
- [ ] No errors

---

### 9. Enable Auto-Deploy (1 min)

Dashboard → Application → Settings

- [ ] Auto Deploy enabled
- [ ] Saved

---

### 10. Configure Backups (2 min)

Dashboard → Database → Backups

- [ ] Schedule: Daily at 2 AM
- [ ] Retention: 7 days
- [ ] Enabled

---

## Post-Deployment

### Verify Services

- [ ] Application: https://hub.echotravel.app
- [ ] Dashboard: http://51.79.55.171:3000
- [ ] Database: Connected
- [ ] SSL: Valid

### Save Credentials

**Dokploy Admin:**
- Username: _______________
- Password: _______________

**Database:**
- Password: _______________

**Application Keys:**
- APP_KEY: _______________
- EchoTravel API Key: _______________
- Phangan.AI API Key: _______________

---

## Next Steps

- [ ] Integrate EchoTravel API (see `ECHOTRAVEL_API_SETUP.md`)
- [ ] Set up Matrix homeserver (optional, for Minerva AI)
- [ ] Invite team members
- [ ] Configure monitoring
- [ ] Test all features

---

## Troubleshooting

### Build Failed
- Check build logs in Dokploy
- Verify Dockerfile syntax
- Check dependencies

### Database Connection Error
- Verify DB_HOST = `echohub-production-db`
- Check DB_PASSWORD
- Ensure database is running

### SSL Not Working
- Verify DNS points to 51.79.55.171
- Wait 5 minutes for Let's Encrypt
- Check domain configured in Dokploy

### Application Errors
- Check logs in Dashboard → Logs
- Verify APP_KEY is set
- Run migrations if needed

---

## Resources

- **Deployment Guide**: `DEPLOY_ECHOHUB_NOW.md`
- **Environment Template**: `deployment/dokploy-env-template.txt`
- **Dashboard**: http://51.79.55.171:3000
- **Dokploy Docs**: https://docs.dokploy.com

---

**Deployment Date**: _______________
**Deployed By**: _______________
**Notes**:

_______________________________________________

_______________________________________________

_______________________________________________
