# EchoHub - Minerva AI Hub Setup Guide

This guide will help you set up and use EchoHub's unified hub for managing your apps through Minerva AI.

## Quick Start

### 1. Environment Setup

Copy and configure environment files:

```bash
# Matrix configuration
cp .env.matrix.example .env.matrix
# Edit .env.matrix with your settings

# Add to your main .env file
cat >> .env << 'EOF'

# Matrix Configuration
MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_SERVER_NAME=echohub.local
MATRIX_ADMIN_USER=admin
MATRIX_ADMIN_PASSWORD=changeme_secure_password

# Minerva AI Configuration (Ollama - Local)
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b
EOF
```

### 1.5 Install and Start Ollama (if not already installed)

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Start Ollama service
ollama serve

# Pull a small model (in another terminal)
ollama pull llama3.2:3b

# Alternative small models:
# ollama pull llama3.2:1b  # Even smaller (1B params)
# ollama pull qwen2.5:3b   # Good alternative
# ollama pull phi3.5       # Microsoft's small model
```

### 2. Run Database Migrations

```bash
php artisan migrate
```

This creates tables for:
- `apps` - Your registered applications
- `contacts` - App and human contacts
- `minerva_contexts` - Conversation history

### 3. Start Matrix Homeserver

```bash
# Generate Synapse configuration (first time only)
docker compose -f docker-compose.matrix.yml run --rm synapse generate

# Start the services
docker compose -f docker-compose.matrix.yml up -d

# Check status
docker compose -f docker-compose.matrix.yml ps
```

### 4. Create Matrix Admin User

```bash
docker exec -it echohub_synapse register_new_matrix_user \
  -u admin \
  -p your_secure_password \
  -a \
  -c /data/homeserver.yaml \
  http://localhost:8008
```

### 5. Register Your First App

Use Tinker or create a seeder:

```bash
php artisan tinker
```

```php
$app = App\Models\App::create([
    'name' => 'EchoTravels',
    'domain' => 'echotravels.app',
    'matrix_user_id' => '@echotravels:echohub.local',
    'status' => 'online',
    'capabilities' => ['bookings', 'revenue', 'status'],
]);

// Create contact for current user
$user = Auth::user(); // or User::first()
App\Models\Contact::create([
    'user_id' => $user->id,
    'matrix_id' => $app->matrix_user_id,
    'type' => 'app',
    'app_id' => $app->id,
    'name' => $app->name,
]);
```

### 6. Start Minerva Bots

```bash
cd bots/minerva-bot

# Install dependencies (first time)
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start in development mode
npm run dev
```

### 7. Access the Hub

Navigate to: `http://localhost:8000/hub`

You should see:
- EchoTravels in your contacts list
- Chat interface ready to use

## Usage Examples

### Chat with EchoTravels

```
You: "What's the current status?"
EchoTravels (Minerva): "EchoTravels is currently online and healthy..."

You: "How many bookings this week?"
EchoTravels (Minerva): "Based on the data, you have [X] bookings this week..."
```

### Add More Apps

```php
// Phangan.AI
App\Models\App::create([
    'name' => 'Phangan.AI',
    'domain' => 'phangan.ai',
    'matrix_user_id' => '@phangan_ai:echohub.local',
    'status' => 'online',
    'capabilities' => ['queries', 'usage', 'status'],
]);
```

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         EchoHub                              │
│                      (Laravel + React)                       │
│                                                              │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │   Hub Page   │◄───────►│  API Routes  │                 │
│  │              │         │              │                 │
│  │  - Contact   │         │  - Contacts  │                 │
│  │    List      │         │  - Messages  │                 │
│  │  - Chat View │         │  - Apps      │                 │
│  └──────────────┘         └──────┬───────┘                 │
│                                   │                          │
│                                   ▼                          │
│                          ┌────────────────┐                 │
│                          │ InstanceManager│                 │
│                          └────────┬───────┘                 │
│                                   │                          │
│                                   ▼                          │
│                          ┌────────────────┐                 │
│                          │ MinervaService │                 │
│                          │   (AI Core)    │                 │
│                          └────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
                                   │
                                   │ AI Responses
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
           ┌────────▼─────────┐         ┌────────▼─────────┐
           │ Claude API       │   or    │  OpenAI API      │
           │ (Anthropic)      │         │                  │
           └──────────────────┘         └──────────────────┘
```

## Troubleshooting

### Matrix Homeserver Won't Start

```bash
# Check logs
docker compose -f docker-compose.matrix.yml logs synapse

# Restart services
docker compose -f docker-compose.matrix.yml restart
```

### Bots Not Responding

1. Check bot logs in `bots/minerva-bot`
2. Verify Laravel API is accessible
3. Check Matrix access tokens
4. Ensure apps are registered in database

### Messages Not Sending

1. Check browser console for errors
2. Verify API routes in `routes/api.php`
3. Check Laravel logs: `tail -f storage/logs/laravel.log`
4. Verify Minerva AI API key is configured

## Next Steps

- [ ] Add app-specific data connectors in `AppContext.php`
- [ ] Implement real-time Matrix sync for human contacts
- [ ] Add rich message types (charts, buttons, etc.)
- [ ] Configure webhooks for app events
- [ ] Set up production Matrix homeserver

## Resources

- **Matrix Documentation**: https://matrix.org/docs/
- **Anthropic Claude API**: https://docs.anthropic.com/
- **matrix-bot-sdk**: https://github.com/turt2live/matrix-bot-sdk
- **EchoHub Documentation**: See CLAUDE.md for full architecture details
