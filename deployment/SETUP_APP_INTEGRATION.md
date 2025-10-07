# EchoHub App Integration Setup Guide

This guide explains how to integrate your application (like EchoTravel) with EchoHub, allowing users to chat with your app through Minerva AI in the hub interface.

## Overview

EchoHub uses:
- **Matrix Protocol** for real-time messaging
- **Minerva AI** for intelligent responses (Ollama/Claude/OpenAI)
- **Service API Keys** for secure app-to-hub communication

## Prerequisites

- Matrix homeserver running (Docker container)
- EchoHub deployed and accessible
- Your app (EchoTravel) has an API

---

## Step 1: Start Matrix Homeserver

If not already running:

```bash
# From EchoHub directory
docker compose -f docker-compose.matrix.yml up -d

# Verify it's running
docker ps | grep echohub_synapse
```

---

## Step 2: Seed Database with Your App

The AppSeeder already includes EchoTravel configuration. Run it:

```bash
# On development machine
php artisan db:seed --class=AppSeeder

# Or on production server
ssh memo@51.79.55.171
cd /var/www/echohub/production
php artisan db:seed --class=AppSeeder
```

**What this creates:**
- App entry with domain, capabilities, API config
- Service API key (shown in output - save it!)
- Contact entries for all users

**Save the API key shown in the output!** You'll need it to configure your EchoTravel app.

---

## Step 3: Create Matrix Bot User

Create a Matrix user for your app's bot:

```bash
# Run the bot creation script
./deployment/create-matrix-bot.sh echotravel

# Or specify a custom password
./deployment/create-matrix-bot.sh echotravel your_secure_password
```

**Save the credentials shown!** You'll need:
- Username: `@echotravel:echohub.local`
- Password: (generated or specified)

---

## Step 4: Configure Environment Variables

Add the Matrix password to your `.env`:

```bash
# On production server
echo "ECHOTRAVEL_MATRIX_PASSWORD=your_password_here" >> .env

# Or use nano
nano .env
```

Add these lines:

```env
# Matrix Bot Credentials
ECHOTRAVEL_MATRIX_PASSWORD=your_matrix_password
PHANGAN_AI_MATRIX_PASSWORD=your_phangan_password (if using)

# Laravel API Token for Minerva Bot
LARAVEL_API_TOKEN=your_laravel_api_token
```

**Generate Laravel API token:**

```bash
# Create a personal access token for the bot
php artisan tinker

# In tinker:
$user = User::first(); // Or create a service user
$token = $user->createToken('minerva-bot')->plainTextToken;
echo $token;
exit
```

Save this token and add it to `.env` as `LARAVEL_API_TOKEN`.

---

## Step 5: Start Minerva Bot

The Minerva bot manager will automatically discover and start bots for all registered apps.

```bash
cd bots/minerva-bot

# Install dependencies (first time only)
bun install

# Build the bot
bun run build

# Start the bot
bun start

# Or for development with auto-reload
bun run dev
```

**What happens:**
1. Bot manager fetches all apps from `/api/apps`
2. For each app, it logs in to Matrix using stored credentials
3. Bot starts listening for messages in Matrix rooms
4. When users message the app, bot routes to Minerva AI
5. Minerva AI processes with app context and responds

---

## Step 6: Implement App API Endpoints

Your EchoTravel app needs to expose data endpoints for Minerva AI to query.

### Required Endpoints

**Base URL:** `https://echotravels.app/api/v1/hub/`

**Authentication:** Bearer token using the service_api_key from Step 2

#### 1. Health Check

```
GET /api/v1/hub/health
```

Returns:
```json
{
  "status": "ok",
  "app": "EchoTravel",
  "version": "1.0.0"
}
```

#### 2. Get Bookings

```
GET /api/v1/hub/bookings
```

Query params:
- `start_date` (optional) - Filter from date
- `end_date` (optional) - Filter to date
- `status` (optional) - Filter by status

Returns:
```json
{
  "bookings": [
    {
      "id": 1,
      "property": "Beach Villa",
      "guest": "John Doe",
      "check_in": "2025-10-10",
      "check_out": "2025-10-15",
      "status": "confirmed",
      "total": 1500.00
    }
  ],
  "total": 1,
  "stats": {
    "total_bookings": 47,
    "total_revenue": 12450.00
  }
}
```

#### 3. Get Revenue

```
GET /api/v1/hub/revenue
```

Query params:
- `period` - "week", "month", "year"

Returns:
```json
{
  "period": "week",
  "revenue": 5600.00,
  "change_percent": 12.5,
  "breakdown": [
    {"date": "2025-10-01", "revenue": 800},
    {"date": "2025-10-02", "revenue": 1200}
  ]
}
```

#### 4. Get Analytics

```
GET /api/v1/hub/analytics
```

Returns:
```json
{
  "occupancy_rate": 0.85,
  "average_stay": 4.2,
  "top_properties": [
    {"name": "Beach Villa", "bookings": 23},
    {"name": "Garden Cottage", "bookings": 18}
  ]
}
```

### Authentication Example

```php
// In your EchoTravel app's middleware or controller
$apiKey = $request->bearerToken();

// Verify with EchoHub
$response = Http::withToken($apiKey)
    ->get('https://hub.echotravel.app/api/external/verify');

if (!$response->successful()) {
    return response()->json(['error' => 'Unauthorized'], 401);
}
```

---

## Step 7: Test Integration

### Test in EchoHub

1. Log in to EchoHub: `https://hub.echotravel.app`
2. Navigate to Hub (`/hub`)
3. Click on "EchoTravels" in the contacts list
4. Send a test message: "How many bookings this week?"
5. Minerva AI should respond with data from your EchoTravel API

### Test Flow:

```
User → EchoHub → Minerva Bot → Matrix → EchoHub API →
Minerva AI (with EchoTravel context) → Matrix → User
```

### Debugging

**Check Minerva Bot logs:**
```bash
cd bots/minerva-bot
bun run dev  # See real-time logs
```

**Check Matrix messages:**
```bash
# In another terminal
docker logs -f echohub_synapse
```

**Check Laravel logs:**
```bash
tail -f storage/logs/laravel.log
```

**Check EchoTravel API:**
```bash
# Test endpoint manually
curl -H "Authorization: Bearer YOUR_SERVICE_API_KEY" \
     https://echotravels.app/api/v1/hub/health
```

---

## Architecture Diagram

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Chat in Hub
       ▼
┌─────────────────────┐
│    EchoHub Web      │
│  (React + Inertia)  │
└──────┬──────────────┘
       │ API: /api/contacts/{id}/messages
       ▼
┌─────────────────────┐
│   EchoHub API       │
│   (Laravel)         │
└──────┬──────────────┘
       │ Routes to Minerva
       ▼
┌─────────────────────┐      ┌──────────────────┐
│   Minerva Bot       │◄────►│  Matrix Server   │
│   (Node.js)         │      │   (Synapse)      │
└──────┬──────────────┘      └──────────────────┘
       │ Get data via API
       ▼
┌─────────────────────┐
│  EchoTravel API     │
│  (Your App)         │
└─────────────────────┘
```

---

## Quick Reference

| Task | Command |
|------|---------|
| Seed apps | `php artisan db:seed --class=AppSeeder` |
| Create Matrix bot | `./deployment/create-matrix-bot.sh echotravel` |
| Start Minerva bot | `cd bots/minerva-bot && bun start` |
| View bot logs | `cd bots/minerva-bot && bun run dev` |
| Test API health | `curl -H "Authorization: Bearer KEY" https://echotravels.app/api/v1/hub/health` |
| View Matrix logs | `docker logs -f echohub_synapse` |

---

## Troubleshooting

### Bot won't start - "Missing Matrix credentials"

**Solution:** Make sure you added the Matrix password to `.env`:

```bash
echo "ECHOTRAVEL_MATRIX_PASSWORD=your_password" >> .env
```

Then restart the bot.

### Bot can't connect to Matrix

**Solution:** Check Matrix homeserver is running:

```bash
docker ps | grep echohub_synapse
curl http://localhost:8008/health
```

### Minerva AI not responding

**Solution:** Check Laravel API token is valid:

```bash
# In Laravel
php artisan tinker
User::first()->tokens
```

Make sure the token in `bots/minerva-bot/.env` matches.

### App API returns 401 Unauthorized

**Solution:** Check the service_api_key:

1. Get the key from database:
```bash
php artisan tinker
App::where('domain', 'echotravels.app')->first()->service_api_key
```

2. Use it in your EchoTravel app to verify requests from EchoHub

---

## Security Notes

- **Service API keys** are encrypted in the database
- **Matrix passwords** should be stored in `.env`, never committed to git
- **Access tokens** are cached by the bot, regenerated on restart
- **HTTPS required** for production API endpoints
- **Rate limiting** recommended on your app's API endpoints

---

## Next Steps

Once integration is working:

1. **Enhance Minerva context** - Add more detailed app data to responses
2. **Add more capabilities** - Implement additional API endpoints
3. **Improve UI** - Customize chat interface for app-specific actions
4. **Monitor usage** - Track API calls and Minerva AI costs
5. **Scale** - Add more apps to the hub

---

**Need help?** Check the logs, review error messages, and verify each step was completed.
