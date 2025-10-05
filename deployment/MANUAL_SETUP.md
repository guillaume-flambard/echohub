# Manual Server Setup Steps

Run these commands on your server after SSH'ing in:

```bash
ssh -i ~/.ssh/id_ed25519_memo memo@51.79.55.171
```

## 1. Navigate to repository

```bash
cd ~/echohub
git checkout development
git pull
```

## 2. Initialize environments

```bash
sudo ./deployment/init-environments.sh
```

This will:
- Create `/var/www/echohub/{production,staging,development}` directories
- Clone repos to each environment
- Setup Nginx configs
- Request SSL certificates (provide email: memo@echotravel.app)
- Configure Supervisor

**When prompted for email by Certbot, use:** `memo@echotravel.app`

## 3. After initialization completes

You're ready for GitHub Actions deployment!

Just push to the repository and it will auto-deploy:
- Push to `development` branch → Deploys to staging
- Push to `main` branch → Deploys to production
