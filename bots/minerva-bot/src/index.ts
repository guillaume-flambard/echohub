import dotenv from 'dotenv';
import { BotManager } from './BotManager.js';

// Load environment variables
dotenv.config();

const HOMESERVER_URL = process.env.MATRIX_HOMESERVER_URL || 'http://localhost:8008';
const LARAVEL_API_URL = process.env.LARAVEL_API_URL || 'http://localhost:8000/api';
const LARAVEL_API_TOKEN = process.env.LARAVEL_API_TOKEN || '';

async function main() {
  console.log('🚀 Starting Minerva Bot Manager...');

  const botManager = new BotManager(HOMESERVER_URL, LARAVEL_API_URL, LARAVEL_API_TOKEN);

  // Load and start all app bots
  await botManager.loadApps();

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n⚠️  Received SIGINT, shutting down...');
    await botManager.stopAll();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n⚠️  Received SIGTERM, shutting down...');
    await botManager.stopAll();
    process.exit(0);
  });

  console.log('✅ Minerva Bot Manager is running');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
