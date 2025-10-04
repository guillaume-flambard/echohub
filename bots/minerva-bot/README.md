# Minerva Bot

Matrix bots for EchoHub app instances powered by Minerva AI.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Build:
```bash
npm run build
```

## Development

Run in development mode with auto-reload:
```bash
npm run dev
```

## Production

Build and run:
```bash
npm run build
npm start
```

## How It Works

- **BotManager**: Loads all apps from Laravel API and manages bot instances
- **MinervaAppBot**: Individual bot instance for each app
  - Listens for messages in Matrix rooms
  - Routes messages to Laravel API for Minerva AI processing
  - Sends AI responses back to Matrix

Each app registered in EchoHub gets its own Minerva bot instance that:
- Has the app's name as display name
- Uses the app's Matrix user ID
- Responds to messages with AI-powered context about that specific app
