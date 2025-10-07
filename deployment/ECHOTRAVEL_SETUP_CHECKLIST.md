# EchoTravel Integration Checklist

Quick checklist to set up EchoTravel app access to EchoHub.

## On Production Server

### 1. Start Matrix Homeserver

```bash
docker compose -f docker-compose.matrix.yml up -d
docker ps | grep echohub_synapse
```

**Status:** ☐ Matrix running

---

### 2. Seed Database with Apps

```bash
cd /var/www/echohub/production
php artisan db:seed --class=AppSeeder
```

**Output to save:**
- [ ] EchoTravel Service API Key: `_______________________________`
- [ ] Phangan.AI Service API Key: `_______________________________`

**Status:** ☐ Apps seeded

---

### 3. Create Matrix Bot Users

```bash
cd /var/www/echohub/production
./deployment/create-matrix-bot.sh echotravel
```

**Output to save:**
- [ ] EchoTravel Matrix User: `@echotravel:echohub.local`
- [ ] EchoTravel Matrix Password: `_______________________________`

```bash
./deployment/create-matrix-bot.sh phangan_ai
```

**Output to save:**
- [ ] Phangan.AI Matrix User: `@phangan_ai:echohub.local`
- [ ] Phangan.AI Matrix Password: `_______________________________`

**Status:** ☐ Matrix bots created

---

### 4. Configure Environment Variables

```bash
nano /var/www/echohub/production/.env
```

Add these lines:

```env
# Matrix Bot Credentials
ECHOTRAVEL_MATRIX_PASSWORD=<password_from_step_3>
PHANGAN_AI_MATRIX_PASSWORD=<password_from_step_3>

# Laravel API Token for Minerva Bot
LARAVEL_API_TOKEN=<token_from_step_5>
```

**Status:** ☐ Environment configured

---

### 5. Generate Laravel API Token

```bash
php artisan tinker
```

In tinker:
```php
$user = User::first();
$token = $user->createToken('minerva-bot')->plainTextToken;
echo $token;
exit
```

**Output to save:**
- [ ] Laravel API Token: `_______________________________`

Add this token to `.env` as `LARAVEL_API_TOKEN`.

**Status:** ☐ API token generated and configured

---

### 6. Start Minerva Bot

```bash
cd /var/www/echohub/production/bots/minerva-bot

# Install dependencies (first time)
bun install

# Build
bun run build

# Start (or use pm2/supervisor for production)
bun start

# Or for development/testing
bun run dev
```

**Check output:** Should show "✅ Started 2 Minerva bot instances" (EchoTravel + Phangan.AI)

**Status:** ☐ Minerva bot running

---

## On EchoTravel App

### 7. Implement Hub API Endpoints

Create these endpoints in EchoTravel:

- [ ] `GET /api/v1/hub/health` - Health check
- [ ] `GET /api/v1/hub/bookings` - Get bookings with stats
- [ ] `GET /api/v1/hub/revenue` - Get revenue data
- [ ] `GET /api/v1/hub/analytics` - Get analytics

**Authentication:** Use the Service API Key from Step 2 (Bearer token)

See `deployment/SETUP_APP_INTEGRATION.md` for detailed endpoint specs.

**Status:** ☐ API endpoints implemented

---

## Testing

### 8. Test Integration

1. Visit: `https://hub.echotravel.app`
2. Log in
3. Navigate to `/hub`
4. Click "EchoTravels" in contacts list
5. Send message: "How many bookings this week?"
6. Verify Minerva AI responds with data

**Status:** ☐ Integration working

---

## Deployment

### 9. Deploy Changes

```bash
# From your Mac
./scripts/deploy production
```

This will:
- Deploy updated AppSeeder
- Deploy Minerva bot code
- Deploy integration docs

**Status:** ☐ Changes deployed

---

## Monitoring

### Check Bot Logs

```bash
cd /var/www/echohub/production/bots/minerva-bot
bun run dev  # See live logs
```

### Check Laravel Logs

```bash
tail -f /var/www/echohub/production/storage/logs/laravel.log
```

### Check Matrix Logs

```bash
docker logs -f echohub_synapse
```

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Start Matrix | `docker compose -f docker-compose.matrix.yml up -d` |
| Stop Matrix | `docker compose -f docker-compose.matrix.yml down` |
| Restart Minerva | `cd bots/minerva-bot && bun start` |
| Check bot status | `ps aux \| grep minerva` |
| Test EchoTravel API | `curl -H "Authorization: Bearer <KEY>" https://echotravels.app/api/v1/hub/health` |

---

## Production Setup (Optional)

For production, run Minerva bot with PM2 or Supervisor:

### Using PM2

```bash
bun add -g pm2
cd /var/www/echohub/production/bots/minerva-bot
pm2 start bun --name "minerva-bot" -- start
pm2 save
pm2 startup
```

### Using Supervisor

Create `/etc/supervisor/conf.d/minerva-bot.conf`:

```ini
[program:minerva-bot]
directory=/var/www/echohub/production/bots/minerva-bot
command=bun start
autostart=true
autorestart=true
user=memo
redirect_stderr=true
stdout_logfile=/var/log/minerva-bot.log
```

Then:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start minerva-bot
```

---

**All done?** Your EchoTravel app is now integrated with EchoHub! 🎉
