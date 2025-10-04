# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

EchoHub is a Laravel 12 application with React 19 frontend using Inertia.js. The stack includes:
- **Backend**: Laravel 12 (PHP 8.2+) with Laravel Fortify for authentication
- **Frontend**: React 19 with TypeScript, Inertia.js for SPA-like experience
- **UI Components**: Radix UI primitives with custom components in `resources/js/components/ui/`
- **Styling**: Tailwind CSS v4 with custom appearance (light/dark/system) theming
- **Testing**: Pest (PHP) for backend tests
- **Build Tools**: Vite 7 with Laravel Vite Plugin and Wayfinder

## Common Commands

### Development
```bash
# Start development server (Laravel + Queue + Logs + Vite in parallel)
composer dev

# Start development with SSR
composer dev:ssr

# Frontend dev server only
npm run dev

# Build frontend for production
npm run build

# Build with SSR support
npm run build:ssr
```

### Testing
```bash
# Run all tests
composer test

# Run PHP tests directly
php artisan test

# Run specific test file
php artisan test tests/Feature/Auth/AuthenticationTest.php
```

### Code Quality
```bash
# Run ESLint and auto-fix
npm run lint

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check

# Type check TypeScript
npm run types

# Format PHP code (Laravel Pint)
./vendor/bin/pint
```

### Database
```bash
# Run migrations
php artisan migrate

# Refresh database and seed
php artisan migrate:fresh --seed
```

## Architecture

### Backend Structure

**Routes**: Routes are organized into separate files:
- `routes/web.php` - Main application routes
- `routes/auth.php` - Authentication routes (included via `web.php`)
- `routes/settings.php` - Settings routes (included via `web.php`)

**Controllers**: Follow Laravel conventions in `app/Http/Controllers/`
- Auth controllers in `app/Http/Controllers/Auth/`
- Settings controllers in `app/Http/Controllers/Settings/`

**Middleware**:
- `HandleInertiaRequests` - Shares global data to all Inertia views (auth user, app name, inspirational quote, sidebar state)
- `HandleAppearance` - Manages appearance cookie (light/dark/system theme)

**Authentication**: Uses Laravel Fortify with two-factor authentication support
- Configuration in `app/Providers/FortifyServiceProvider.php`
- Custom Inertia views for two-factor challenge and password confirmation

### Frontend Structure

**Entry Points**:
- `resources/js/app.tsx` - Client-side entry point
- `resources/js/ssr.tsx` - Server-side rendering entry point (when using SSR)

**Pages**: Inertia pages in `resources/js/pages/`
- Pages automatically resolved via `./pages/${name}.tsx` pattern
- Auth pages in `pages/auth/`
- Settings pages in `pages/settings/`

**Layouts**: Reusable layout components in `resources/js/layouts/`
- `app-layout.tsx` - Main application layout wrapper (delegates to `app/app-sidebar-layout.tsx`)
- `auth-layout.tsx` - Authentication pages layout
- Specific layout variants in subdirectories (`app/`, `auth/`, `settings/`)

**Components**:
- Application components in `resources/js/components/`
- Reusable UI primitives in `resources/js/components/ui/` (built on Radix UI)
- Icons from `lucide-react` library, accessed via `resources/js/components/icon.tsx`

**TypeScript**:
- Path alias `@/*` maps to `resources/js/*`
- Type definitions in `resources/js/types/index.d.ts`
- Strict mode enabled with target ESNext

**Theming**:
- Custom appearance system (light/dark/system) via `use-appearance` hook
- Appearance state stored in cookies and synced with middleware
- Theme initialized on page load via `initializeTheme()` in `app.tsx`

### Key Patterns

**Inertia.js Integration**:
- Pages receive props from controller responses
- Shared data (user, app name, etc.) available globally via `HandleInertiaRequests`
- Use `Inertia::render('page-name')` in controllers to render React components

**Wayfinder Integration**:
- Laravel Wayfinder generates TypeScript route helpers from PHP routes
- Configured with `formVariants: true` in `vite.config.ts`
- Use generated route helpers instead of hardcoded URLs

**Component Organization**:
- UI components use `class-variance-authority` for variant-based styling
- Utilities like `cn()` (from `tailwind-merge`) for conditional classes
- Custom hooks in `resources/js/hooks/` (e.g., `use-mobile`, `use-initials`, `use-appearance`)

**SSR Considerations**:
- SSR entry point at `resources/js/ssr.tsx`
- Build SSR with `npm run build:ssr`
- Start SSR server with `composer dev:ssr` or `php artisan inertia:start-ssr`

## Matrix & Minerva AI Hub Architecture

EchoHub features a unified hub for managing apps and contacts powered by Matrix protocol and Minerva AI.

### Core Concept

- **Matrix Protocol**: Decentralized real-time communication layer
- **Minerva AI**: AI service using Ollama (local), Claude, or OpenAI for intelligent app management
- **App Contacts**: Each app (echotravels.app, phangan.ai) is a Minerva AI instance
- **Human Contacts**: Regular Matrix users
- **Unified Interface**: Chat with apps and humans in the same hub

### Backend Components

**Database Models** (`app/Models/`):
- `App` - Registered applications with Matrix integration
- `Contact` - User's contacts (apps or humans)
- `MinervaContext` - Conversation history per user/app instance

**Services** (`app/Services/`):
- `MinervaAI/MinervaService` - Core AI orchestration (Ollama/Claude/OpenAI integration)
- `MinervaAI/AppContext` - App-specific context and data providers
- `MinervaAI/InstanceManager` - Manages Minerva instances per user/app
- `MatrixService` - Matrix Client-Server API wrapper
- `MatrixAuthService` - Matrix user provisioning for Laravel users

**API Routes** (`routes/api.php`):
- `GET /api/contacts` - List user's contacts (filter by type)
- `POST /api/contacts/{id}/messages` - Send message to contact (routes to Minerva for apps)
- `GET /api/contacts/{id}/messages` - Get conversation history
- `DELETE /api/contacts/{id}/messages` - Clear conversation history
- `GET /api/apps` - List all registered apps

**Configuration**:
- `config/minerva.php` - Minerva AI provider (ollama/anthropic/openai), base URL, model settings
- `config/matrix.php` - Matrix homeserver URL, credentials

### Matrix Infrastructure

**Docker Setup** (`docker-compose.matrix.yml`):
- Synapse homeserver (matrixdotorg/synapse:latest)
- PostgreSQL database for Synapse
- Health checks and auto-restart

**Setup Commands**:
```bash
# Start Matrix homeserver
docker compose -f docker-compose.matrix.yml up -d

# Create admin user
docker exec -it echohub_synapse register_new_matrix_user -u admin -a -c /data/homeserver.yaml http://localhost:8008
```

### Minerva Bot Framework

**Location**: `bots/minerva-bot/` (Node.js/TypeScript)

**Components**:
- `BotManager` - Loads apps from Laravel API, manages bot lifecycle
- `MinervaAppBot` - Individual bot instance per app
  - Listens for Matrix messages
  - Routes to Laravel API for Minerva AI processing
  - Sends AI responses back to Matrix

**Commands**:
```bash
cd bots/minerva-bot
npm install
npm run dev  # Development with auto-reload
npm run build && npm start  # Production
```

### Frontend Integration

**Hooks** (`resources/js/hooks/`):
- `use-contacts` - Fetch and manage contacts
- `use-messages` - Send messages and manage conversation history
- `use-matrix` - Matrix client context (for future direct Matrix integration)

**Hub Components** (`resources/js/components/hub/`):
- `contact-list.tsx` - Sidebar with all contacts (apps/humans)
- `chat-view.tsx` - Main chat interface with header and controls
- `message-list.tsx` - Scrollable message timeline
- `message-input.tsx` - Send message input with keyboard shortcuts

**Hub Page** (`resources/js/pages/hub.tsx`):
- Accessible at `/hub` route
- Two-column layout: contacts sidebar + chat view
- Real-time messaging with Minerva AI instances

**Types** (`resources/js/types/index.d.ts`):
- `App` - Application model
- `Contact` - Contact model (app or human)
- `Message` - Chat message
- `MinervaResponse` - AI response format

### Workflow

1. **App Registration**: Apps registered in database with Matrix user ID
2. **Bot Provisioning**: BotManager starts Minerva instance for each app
3. **User Chat**: User selects app contact in hub, sends message
4. **API Routing**: Frontend calls `/api/contacts/{id}/messages`
5. **Minerva Processing**: InstanceManager routes to MinervaService with app context
6. **AI Response**: Minerva AI generates response based on app data
7. **Response Display**: AI response shown in chat interface

### Example: EchoTravels Bot

```typescript
// Bot automatically knows about EchoTravels
User: "How many bookings this week?"
Minerva (EchoTravels): "You have 47 bookings this week, up 12% from last week."

// AI understands app context
User: "Show revenue trends"
Minerva: [Analyzes data] "Revenue is up 23% with peak on weekends."
```

### Environment Variables

Add to `.env`:
```bash
# Matrix
MATRIX_HOMESERVER_URL=http://localhost:8008
MATRIX_SERVER_NAME=echohub.local
MATRIX_ADMIN_USER=admin
MATRIX_ADMIN_PASSWORD=your_password

# Minerva AI (Default: Ollama - Free & Local)
MINERVA_AI_PROVIDER=ollama
MINERVA_AI_BASE_URL=http://localhost:11434
MINERVA_AI_MODEL=llama3.2:3b

# Alternative: Anthropic Claude (requires API key)
# MINERVA_AI_PROVIDER=anthropic
# MINERVA_AI_API_KEY=your_api_key
# MINERVA_AI_MODEL=claude-3-5-sonnet-20250219

# Alternative: OpenAI (requires API key)
# MINERVA_AI_PROVIDER=openai
# MINERVA_AI_API_KEY=your_api_key
# MINERVA_AI_MODEL=gpt-4-turbo-preview
```

### Quick Start with Ollama

```bash
# Install Ollama
brew install ollama  # macOS
# or: curl -fsSL https://ollama.com/install.sh | sh  # Linux

# Start Ollama
ollama serve

# Pull a small model (in another terminal)
ollama pull llama3.2:3b

# Done! See OLLAMA_SETUP.md for more options
```

## Development Notes

- The application is NOT currently a git repository (initialize if needed)
- Uses Bun lock file (`bun.lock`) alongside npm
- Prettier configured with import organization and Tailwind class sorting
- ESLint configured for React with React 19 settings
- TypeScript strict mode enabled - maintain type safety
- Database uses SQLite by default (check `database/database.sqlite`)
- Matrix homeserver runs in Docker (see `docker-compose.matrix.yml`)
- Minerva bots run separately from Laravel (see `bots/minerva-bot/`)
