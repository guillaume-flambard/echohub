# EchoHub

A unified hub for managing your apps through AI-powered conversations with Minerva.

## ✨ Features

- 🤖 **Minerva AI**: Chat with your apps using local Ollama models or Cloud AI (Claude/GPT)
- 💬 **Unified Hub**: Manage all your apps (EchoTravels, Phangan.AI, etc.) in one place
- 🔒 **Matrix Protocol**: Decentralized, secure real-time communication
- 🎯 **Context-Aware**: Each AI instance knows about its specific app
- 🚀 **Fast & Free**: Uses Ollama for local AI processing (no API costs!)
- 🎨 **Modern UI**: Beautiful React interface with dark/light mode

## 🚀 Quick Start

```bash
# 1. Install Ollama (for AI)
brew install ollama              # macOS
ollama serve                     # Start Ollama
ollama pull llama3.2:3b          # Pull AI model

# 2. Install dependencies
composer install
npm install

# 3. Setup database
php artisan migrate
php artisan db:seed --class=AppSeeder

# 4. Start development
composer dev                     # All services
# or
php artisan serve                # Backend
npm run dev                      # Frontend (in another terminal)

# 5. Visit http://localhost:8000/hub
```

**See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.**

## 📖 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get running in 5 minutes
- **[HUB_SETUP.md](HUB_SETUP.md)** - Complete setup guide
- **[OLLAMA_SETUP.md](OLLAMA_SETUP.md)** - Ollama configuration & model selection
- **[CLAUDE.md](CLAUDE.md)** - Architecture & development guide

## 🎯 What Can You Do?

Chat with your apps naturally:

```
You: What's the current status of EchoTravels?
Minerva: EchoTravels is online and healthy. All systems operational.

You: How many bookings this week?
Minerva: You have 47 bookings this week, up 12% from last week.

You: Show me revenue trends
Minerva: [Analyzes data] Revenue is up 23% with peak on weekends...
```

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│         EchoHub (Laravel)           │
│                                     │
│  ┌─────────┐      ┌──────────┐    │
│  │   Hub   │◄────►│ Minerva  │    │
│  │   UI    │      │    AI    │    │
│  └─────────┘      └────┬─────┘    │
│                         │           │
└─────────────────────────┼───────────┘
                          │
                 ┌────────▼────────┐
                 │  Ollama (Local) │
                 │  llama3.2:3b    │
                 └─────────────────┘
```

## 🛠️ Tech Stack

- **Backend**: Laravel 12, PHP 8.2+
- **Frontend**: React 19, TypeScript, Inertia.js
- **UI**: Radix UI, Tailwind CSS v4
- **AI**: Ollama (local) or Anthropic/OpenAI (cloud)
- **Communication**: Matrix Protocol (Synapse)
- **Testing**: Pest (PHP)

## 📦 What's Included

### Sample Apps
- **EchoTravels** - Travel booking management
- **Phangan.AI** - AI query analytics

### Features
- 💬 Real-time chat interface
- 📊 Conversation history per app
- 🔍 Search and filter contacts
- 🎨 Beautiful UI with dark mode
- ⚡ Fast local AI responses
- 🔐 Secure authentication (Laravel Fortify)

## 🔄 Switch AI Providers

Using Ollama by default (free, local):
```bash
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_MODEL=llama3.2:3b
```

Want to use Claude or GPT? Just update `.env`:
```bash
# Anthropic Claude
MINERVA_AI_PROVIDER=anthropic
MINERVA_AI_API_KEY=sk-ant-your-key
MINERVA_AI_MODEL=claude-3-5-sonnet-20250219

# OpenAI
MINERVA_AI_PROVIDER=openai
MINERVA_AI_API_KEY=sk-your-key
MINERVA_AI_MODEL=gpt-4-turbo-preview
```

## 🧪 Development

```bash
# Code quality
npm run lint          # ESLint
npm run format        # Prettier
npm run types         # TypeScript check
./vendor/bin/pint     # PHP formatting

# Testing
composer test         # Run PHP tests
php artisan test      # Alternative
```

## 📝 Common Commands

```bash
# Development
composer dev                      # Start all services
php artisan serve                 # Backend only
npm run dev                       # Frontend only

# Database
php artisan migrate              # Run migrations
php artisan db:seed              # Seed data
php artisan migrate:fresh --seed # Reset & seed

# Build
npm run build                    # Production build
npm run build:ssr                # SSR build
```

## 🤝 Contributing

This is a starter kit showcasing the Matrix + Minerva AI integration pattern. Feel free to:
- Add more apps
- Customize AI prompts
- Extend functionality
- Share improvements

## 📄 License

MIT License - feel free to use this as a starter for your projects.

## 🙏 Acknowledgments

Built with:
- [Laravel](https://laravel.com)
- [Inertia.js](https://inertiajs.com)
- [React](https://react.dev)
- [Ollama](https://ollama.com)
- [Matrix Protocol](https://matrix.org)
- [Radix UI](https://radix-ui.com)

---

**Ready to chat with your apps?** → See [QUICKSTART.md](QUICKSTART.md)
