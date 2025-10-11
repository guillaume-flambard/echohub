# CI/CD Pipeline Quickstart Guide

**Goal:** Get the new CI/CD pipeline operational in 30 minutes.

---

## Step 1: Verify New Workflow Files (2 minutes)

The following workflows have been created:

```bash
ls -la .github/workflows/

# You should see:
# ci.yml                 - Unified CI (tests, lint, build)
# deploy-dev.yml         - Development deployment
# deploy-staging.yml     - Staging with smoke tests
# deploy-prod.yml        - Production with approval
# rollback.yml           - Emergency rollback
```

---

## Step 2: Configure GitHub Secrets (5 minutes)

### Required Secrets

Go to **GitHub Repository → Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

```bash
# VPS Access
VPS_HOST: your-vps-hostname.com
VPS_USER: deployer
VPS_SSH_KEY: [paste private SSH key - see generation below]

# Laravel
APP_KEY: [generate with: php artisan key:generate --show]

# Database Passwords
DB_PASSWORD_PROD: your-prod-password
DB_PASSWORD_STAGING: your-staging-password
DB_PASSWORD_DEV: your-dev-password

# Optional: Notifications
SLACK_WEBHOOK_URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
CODECOV_TOKEN: your-codecov-token
```

### Generate SSH Key

```bash
# Generate new deployment key
ssh-keygen -t ed25519 -C "github-actions@echohub" -f ~/.ssh/github_deploy_echohub

# Copy public key to VPS
ssh-copy-id -i ~/.ssh/github_deploy_echohub.pub user@your-vps-hostname.com

# Test connection
ssh -i ~/.ssh/github_deploy_echohub user@your-vps-hostname.com "echo 'SSH OK'"

# Add private key to GitHub secrets
cat ~/.ssh/github_deploy_echohub  # Copy entire content including BEGIN/END
```

### Generate Laravel APP_KEY

```bash
# If you have Laravel installed locally
php artisan key:generate --show

# Or use Docker
docker run --rm php:8.3-cli php -r "echo 'base64:' . base64_encode(random_bytes(32)) . PHP_EOL;"
```

---

## Step 3: Configure GitHub Environments (10 minutes)

### Create Environments

Go to **GitHub Repository → Settings → Environments**

#### 3.1: Production Environment

1. Click **New environment** → Name: `production`
2. **Environment protection rules:**
   - ✅ Required reviewers: Add 2 reviewers
   - ✅ Wait timer: 5 minutes
   - ✅ Deployment branches: `main` and tags matching `v*.*.*`
3. **Environment secrets:**
   - (None needed - uses repository secrets)
4. **Environment variables:**
   - `ENVIRONMENT_NAME`: production
5. Click **Save**

#### 3.2: Production Approval Environment

1. Click **New environment** → Name: `production-approval`
2. **Environment protection rules:**
   - ✅ Required reviewers: Add 2 reviewers
   - ✅ Wait timer: 5 minutes
3. Click **Save**

#### 3.3: Staging Environment

1. Click **New environment** → Name: `staging`
2. **Environment protection rules:**
   - ✅ Required reviewers: Add 1 reviewer (optional)
   - ✅ Deployment branches: `staging`, `main`
3. Click **Save**

#### 3.4: Development Environment

1. Click **New environment** → Name: `development`
2. **Environment protection rules:**
   - (No restrictions for dev)
   - ✅ Deployment branches: `develop`
3. Click **Save**

---

## Step 4: Enable Branch Protection (5 minutes)

Go to **Settings → Branches → Add rule**

### Protect `main` branch:

- Branch name pattern: `main`
- ✅ Require a pull request before merging
- ✅ Require approvals: 2
- ✅ Require status checks to pass before merging
  - Required checks: `CI Success` (from ci.yml)
- ✅ Require conversation resolution before merging
- ✅ Do not allow bypassing the above settings
- ✅ Restrict who can push to matching branches (admins only)

### Protect `staging` branch:

- Branch name pattern: `staging`
- ✅ Require a pull request before merging
- ✅ Require approvals: 1
- ✅ Require status checks to pass: `CI Success`

---

## Step 5: Test CI Workflow (3 minutes)

### Test on a feature branch:

```bash
# Create test branch
git checkout -b test-new-ci

# Make a small change (add comment to any file)
echo "# Testing new CI" >> README.md

# Commit and push
git add README.md
git commit -m "test: validate new CI workflow"
git push origin test-new-ci

# Create PR on GitHub
# Watch the CI workflow run in Actions tab
```

**Expected Result:**
- 6 jobs run in parallel: php-tests, frontend-quality, php-quality, frontend-build, docker-validation, security
- All jobs complete in ~8 minutes
- `CI Success` job shows overall status

---

## Step 6: Test Development Deployment (5 minutes)

### Deploy to development:

```bash
# Merge test branch to develop
git checkout develop
git pull origin develop
git merge test-new-ci
git push origin develop

# Watch deployment in Actions tab
```

**Expected Result:**
- `deploy-dev.yml` workflow triggers
- Docker image builds and pushes to GHCR
- Deployment to VPS completes
- Health check passes
- Application available at https://dev-hub.echotravel.app

**If deployment fails:**
1. Check VPS access: `ssh -i ~/.ssh/github_deploy_echohub user@vps "docker ps"`
2. Check Docker registry: Ensure GHCR is accessible
3. Check secrets: Verify all required secrets are set
4. Check logs: View workflow logs in Actions tab

---

## Step 7: Test Staging Deployment (Optional)

```bash
# Merge to staging branch
git checkout staging
git pull origin staging
git merge develop
git push origin staging

# Watch deployment + smoke tests
```

**Expected Result:**
- `deploy-staging.yml` workflow runs
- Smoke tests pass (health, homepage, login, assets, database)
- Slack notification sent (if configured)

---

## Step 8: Archive Old Workflows (2 minutes)

Once new workflows are validated:

```bash
# Create archive directory
mkdir -p .github/workflows/archive

# Move old workflows
git mv .github/workflows/ci-cd.yml .github/workflows/archive/
git mv .github/workflows/tests.yml .github/workflows/archive/
git mv .github/workflows/lint.yml .github/workflows/archive/

# Keep deploy.yml temporarily as backup
git add .github/workflows/archive/
git commit -m "chore: archive old CI/CD workflows"
git push origin develop
```

---

## Troubleshooting

### Issue: SSH Connection Fails

```bash
# Test SSH manually
ssh -i ~/.ssh/github_deploy_echohub user@vps-host "whoami"

# Check SSH key format in GitHub
# Must include:
# -----BEGIN OPENSSH PRIVATE KEY-----
# ... key content ...
# -----END OPENSSH PRIVATE KEY-----

# Verify VPS has public key
ssh user@vps-host "cat ~/.ssh/authorized_keys"
```

### Issue: Docker Image Pull Fails

```bash
# Check GitHub Container Registry
# Go to: https://github.com/orgs/YOUR_ORG/packages

# Ensure package is public or GITHUB_TOKEN has access
# Settings → Packages → echohub → Danger Zone → Change visibility
```

### Issue: Health Check Fails

```bash
# SSH to VPS
ssh user@vps-host

# Check container status
cd /opt/echohub-development
docker-compose ps
docker-compose logs --tail=100 echohub

# Test health endpoint directly
docker exec echohub-dev curl -sf http://localhost:8000/up

# Check Traefik logs
docker logs traefik 2>&1 | tail -50
```

### Issue: Database Connection Fails

```bash
# Verify PostgreSQL is running
docker ps | grep postgres

# Check database credentials
docker exec echohub-dev env | grep DB_

# Test database connection
docker exec echohub-dev php artisan tinker --execute="DB::connection()->getPdo();"
```

---

## Production Deployment Process

### When ready to deploy to production:

#### Option 1: Tag-based deployment (Recommended)

```bash
# Ensure main branch is up to date
git checkout main
git pull origin main

# Create version tag
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0

# This triggers deploy-prod.yml
# Workflow will:
# 1. Run pre-deployment checks
# 2. Create backup
# 3. Build production image
# 4. Wait for manual approval (2 reviewers)
# 5. Deploy to production
# 6. Run comprehensive health checks
# 7. Run smoke tests
# 8. Send Slack notification
```

#### Option 2: Manual deployment

```bash
# Go to Actions → Deploy to Production → Run workflow
# Input: Type "deploy-production" to confirm
# Click "Run workflow"
# Approve deployment when requested
```

---

## Rollback Procedure

### If production deployment fails:

```bash
# Go to Actions → Rollback Deployment → Run workflow
# Select environment: production
# Backup timestamp: latest (or specific timestamp)
# Confirm: production
# Click "Run workflow"

# Workflow will:
# 1. Stop current container
# 2. Restore database backup
# 3. Restore previous Docker image
# 4. Start with previous configuration
# 5. Verify health
# 6. Send Slack notification
```

### Manual rollback (if GitHub Actions unavailable):

```bash
# SSH to VPS
ssh user@vps-host

# Navigate to production directory
cd /opt/echohub-production

# Find available backups
ls -lh /var/backups/echohub/production/

# Stop current container
docker-compose down

# Restore database
sudo cp /var/backups/echohub/production/database-v1.0.0-2025-10-11_14-30-00.sqlite database/database.sqlite
sudo chown www-data:www-data database/database.sqlite

# Get previous image
PREVIOUS_IMAGE=$(sudo cat /var/backups/echohub/production/image-v1.0.0-2025-10-11_14-30-00.txt)

# Start with previous image
export IMAGE_TAG="$PREVIOUS_IMAGE"
docker-compose up -d

# Verify
curl https://hub.echotravel.app/up
```

---

## Next Steps

After successful deployment:

1. **Set up monitoring:**
   - [ ] Integrate Sentry for error tracking
   - [ ] Configure uptime monitoring (BetterUptime/Pingdom)
   - [ ] Add synthetic health checks

2. **Improve security:**
   - [ ] Add Trivy vulnerability scanning
   - [ ] Enable CodeQL analysis
   - [ ] Implement secret rotation

3. **Optimize further:**
   - [ ] Add frontend unit tests
   - [ ] Implement E2E tests
   - [ ] Optimize Dockerfile (use FPM)

See **CI_CD_RECOMMENDATIONS.md** for complete roadmap.

---

## Quick Reference

### Workflow Triggers

| Workflow | Trigger | Environment |
|----------|---------|-------------|
| ci.yml | Push/PR to main/staging/develop | N/A |
| deploy-dev.yml | Push to develop | development |
| deploy-staging.yml | Push to staging/main | staging |
| deploy-prod.yml | Tag v*.*.* or manual | production |
| rollback.yml | Manual only | any |

### Common Commands

```bash
# View workflow runs
gh run list --workflow=ci.yml

# Watch specific run
gh run watch

# View logs
gh run view --log

# Cancel run
gh run cancel <run-id>

# Re-run failed jobs
gh run rerun <run-id> --failed
```

### Deployment URLs

- **Development:** https://dev-hub.echotravel.app
- **Staging:** https://staging-hub.echotravel.app
- **Production:** https://hub.echotravel.app

---

**Setup Complete!**

Your CI/CD pipeline is now operational. Monitor the Actions tab for workflow execution and check Slack for deployment notifications.

For issues or questions, refer to:
- **CI_CD_RECOMMENDATIONS.md** - Comprehensive guide
- **GitHub Actions logs** - Detailed error information
- **VPS logs** - Application and container logs
