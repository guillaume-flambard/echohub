# Deployment Safety Guide

## 🛡️ Your Data is Safe

This document explains what happens during deployment and confirms that **your database and user data will NOT be destroyed**.

## Protected Files & Data

The following are **NEVER touched** by deployments:

### 1. Database Files
- **Location:** `/var/www/echohub/{env}/database/*.sqlite`
- **Protection:** Listed in `.gitignore`, never committed to git
- **Result:** Database persists across all deployments
- **Your data:** Users, apps, contacts, messages - all preserved

### 2. Environment Configuration
- **Location:** `/var/www/echohub/{env}/.env`
- **Protection:** Listed in `.gitignore`, never committed to git
- **Result:** Configuration (API keys, secrets, database path) persists
- **Your settings:** All environment variables preserved

### 3. User Uploads & Storage
- **Location:** `/var/www/echohub/{env}/storage/`
- **Protection:** Only code files are updated by git, storage content remains
- **Result:** Uploaded files, logs, sessions all preserved
- **Your files:** All user-uploaded content safe

## What Gets Updated

On each deployment, **only these are updated**:

### 1. Application Code
```bash
git reset --hard origin/{branch}
```
- Updates PHP files, JavaScript, views
- Does NOT touch .env or database files

### 2. Dependencies
```bash
composer install
bun install
```
- Updates PHP packages and Node modules
- Does NOT affect your data

### 3. Frontend Assets
```bash
bun run build
```
- Rebuilds CSS/JS bundles
- Does NOT touch backend data

### 4. Database Schema (Safe Migrations)
```bash
php artisan migrate --force
```
- **ONLY adds new tables/columns** from new migrations
- **NEVER drops existing tables**
- **NEVER deletes data**
- Existing data remains untouched

## Dangerous Commands (NOT Used)

These commands would destroy data, but **are NOT in the deployment workflow**:

❌ `php artisan migrate:fresh` - Would drop all tables
❌ `php artisan migrate:rollback` - Would remove migrations
❌ `php artisan db:wipe` - Would destroy database
❌ `rm database/*.sqlite` - Would delete database files

**None of these are used in automated deployments!**

## Deployment Workflow Safety Checklist

Every deployment runs this exact sequence:

1. ✅ Fix file ownership (code files only)
2. ✅ Pull latest code via git (respects .gitignore)
3. ✅ Install PHP dependencies
4. ✅ Install Node dependencies
5. ✅ Build frontend assets
6. ✅ **Run safe migrations** (adds only, never deletes)
7. ✅ Clear caches (config, routes, views)
8. ✅ Set file permissions
9. ✅ Restart services

**At no point is the database deleted, dropped, or recreated.**

## Verification

You can verify the safety yourself:

### Check .gitignore
```bash
# Database files are ignored
cat database/.gitignore
# Output: *.sqlite*

# .env is ignored
grep "\.env" .gitignore
# Output: .env
```

### Check Deployment Script
```bash
# View the exact deployment commands
cat .github/workflows/deploy.yml
# Confirm: only "migrate --force" is used (safe)
# Confirm: no "migrate:fresh" or "db:wipe" commands
```

### Check Database Persistence
```bash
# On server, check database file timestamps
ssh user@server "ls -la /var/www/echohub/production/database/*.sqlite"
# File date never changes on deployment (only modified when data changes)
```

## Manual Database Operations

If you ever need to reset the database manually (testing, etc), these commands are **ONLY run when you explicitly execute them**:

```bash
# These require manual execution and confirmation
php artisan migrate:fresh        # Drops all tables (asks for confirmation in production)
php artisan migrate:fresh --seed # Drops and reseeds (asks for confirmation in production)
```

Laravel's production mode requires explicit "Yes" confirmation for destructive operations.

## Backup Recommendations

Even though deployments are safe, you should still backup your database periodically:

```bash
# Create a backup script
./deployment/backup-database.sh production

# This creates:
# /var/backups/echohub/production-YYYY-MM-DD-HH-MM-SS.sqlite
```

## Summary

✅ **Database files:** Protected by .gitignore, never destroyed
✅ **.env configuration:** Protected by .gitignore, never overwritten
✅ **User uploads:** Preserved in storage/ directory
✅ **Migration safety:** Only adds new tables, never deletes data
✅ **Production safeguards:** Laravel asks for confirmation before destructive operations

**Your data is safe. Deploy with confidence!**

---

Last updated: 2025-10-05
Deployment system: GitHub Actions
Database: SQLite
