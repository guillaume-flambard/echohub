# EchoHub Quick Start Guide

Get EchoHub's Minerva AI Hub running in 5 minutes!

## Prerequisites

- PHP 8.2+
- Composer
- Node.js & npm
- Ollama (for local AI)

## Step 1: Install Ollama

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com/download
```

## Step 2: Start Ollama & Pull Model

```bash
# Terminal 1: Start Ollama (keep this running)
ollama serve

# Terminal 2: Pull a small model
ollama pull llama3.2:3b

# Test it (optional)
ollama run llama3.2:3b
>>> Hello!
>>> /bye
```

## Step 3: Install Dependencies

```bash
# Backend dependencies
composer install

# Frontend dependencies
npm install
```

## Step 4: Setup Database

```bash
# Run migrations
php artisan migrate

# Seed sample apps (EchoTravels & Phangan.AI)
php artisan db:seed --class=AppSeeder
```

## Step 5: Start Development Servers

```bash
# Terminal 3: Start Laravel (with queue, logs, and Vite)
composer dev

# Or if you prefer separate terminals:
# Terminal 3: Laravel
php artisan serve

# Terminal 4: Vite
npm run dev
```

## Step 6: Access the Hub

Open your browser:
- **Main App**: http://localhost:8000
- **Login**: Use your account or register
- **Hub**: Click "Hub" in the sidebar or go to http://localhost:8000/hub

## Test It Out

You should see 2 app contacts:
1. **EchoTravels** - Sample travel app
2. **Phangan.AI** - Sample AI app

Try chatting:
```
You: Hello! What can you help me with?
EchoTravels (Minerva): Hello! I'm Minerva, your AI assistant for EchoTravels...

You: What's the current status?
EchoTravels (Minerva): EchoTravels is currently online and healthy...
```

## What's Next?

### Add Real App Data

Edit `app/Services/MinervaAI/AppContext.php` to connect your real apps:

```php
private static function buildEchoTravelsContext(App $app): array
{
    // TODO: Connect to real EchoTravels database/API
    return [
        'status' => 'healthy',
        'stats' => [
            'bookings_today' => DB::table('bookings')->whereDate('created_at', today())->count(),
            'revenue_this_month' => DB::table('bookings')->whereMonth('created_at', now())->sum('total'),
        ],
    ];
}
```

### Customize Minerva AI

Want different AI responses? Edit the system prompt in `MinervaService.php`:

```php
private function buildSystemPrompt(array $context, ?string $instanceId): string
{
    $basePrompt = "You are Minerva, [your custom instructions]...";
    // ...
}
```

### Use Better Models

```bash
# Try different Ollama models
ollama pull qwen2.5:3b      # Alternative small model
ollama pull llama3.1:8b     # Larger, better quality
ollama pull mistral:7b      # Another great option

# Update .env
MINERVA_AI_MODEL=qwen2.5:3b
```

### Switch to Cloud AI

Already have Claude or GPT API keys?

```bash
# .env - Use Anthropic Claude
MINERVA_AI_PROVIDER=anthropic
MINERVA_AI_API_KEY=sk-ant-your-key
MINERVA_AI_MODEL=claude-3-5-sonnet-20250219

# Or OpenAI
MINERVA_AI_PROVIDER=openai
MINERVA_AI_API_KEY=sk-your-key
MINERVA_AI_MODEL=gpt-4-turbo-preview
```

## Troubleshooting

### Ollama Not Responding

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Restart Ollama
pkill ollama
ollama serve
```

### "Model not found" Error

```bash
# Verify model is pulled
ollama list

# Pull it if missing
ollama pull llama3.2:3b
```

### Messages Not Sending

1. Check Laravel logs: `tail -f storage/logs/laravel.log`
2. Check browser console (F12)
3. Verify Ollama is running: `curl http://localhost:11434/api/tags`
4. Make sure migrations ran: `php artisan migrate:status`

## Full Documentation

- **Complete Setup**: See `HUB_SETUP.md`
- **Ollama Guide**: See `OLLAMA_SETUP.md`
- **Architecture**: See `CLAUDE.md`

## Commands Reference

```bash
# Development
composer dev              # Start all services
npm run dev              # Frontend only
php artisan serve        # Backend only

# Database
php artisan migrate      # Run migrations
php artisan db:seed      # Seed sample apps

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run types            # TypeScript check
./vendor/bin/pint        # PHP formatting

# Ollama
ollama serve             # Start Ollama
ollama pull <model>      # Download model
ollama list              # List models
ollama rm <model>        # Remove model
```

Enjoy your Minerva AI-powered hub! 🚀
