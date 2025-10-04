import axios from 'axios';
import { MinervaAppBot } from './MinervaAppBot.js';
import type { AppConfig } from './types.js';

export class BotManager {
  private bots: Map<string, MinervaAppBot> = new Map();
  private homeserverUrl: string;
  private laravelApiUrl: string;
  private laravelApiToken: string;

  constructor(homeserverUrl: string, laravelApiUrl: string, laravelApiToken: string) {
    this.homeserverUrl = homeserverUrl;
    this.laravelApiUrl = laravelApiUrl;
    this.laravelApiToken = laravelApiToken;
  }

  /**
   * Load all apps from Laravel API and start bots
   */
  async loadApps() {
    try {
      console.log('📡 Fetching apps from Laravel API...');

      const response = await axios.get(`${this.laravelApiUrl}/apps`, {
        headers: {
          Authorization: `Bearer ${this.laravelApiToken}`,
        },
      });

      const apps: AppConfig[] = response.data.apps;

      console.log(`Found ${apps.length} apps`);

      for (const app of apps) {
        await this.startBot(app);
      }

      console.log(`✅ Started ${this.bots.size} Minerva bot instances`);
    } catch (error: any) {
      console.error('❌ Error loading apps:', error.message);
      throw error;
    }
  }

  /**
   * Start a bot for a specific app
   */
  private async startBot(app: AppConfig) {
    try {
      // In production, you would get the access token from Matrix registration
      // For now, we'll assume it's stored in the app config or generate it
      const accessToken = app.api_config?.matrix_access_token || this.generateBotToken(app);

      const bot = new MinervaAppBot(
        this.homeserverUrl,
        accessToken,
        app,
        this.laravelApiUrl,
        this.laravelApiToken
      );

      await bot.start();
      this.bots.set(app.matrix_user_id, bot);
    } catch (error: any) {
      console.error(`❌ Failed to start bot for ${app.name}:`, error.message);
    }
  }

  /**
   * Stop a specific bot
   */
  async stopBot(matrixUserId: string) {
    const bot = this.bots.get(matrixUserId);
    if (bot) {
      await bot.stop();
      this.bots.delete(matrixUserId);
    }
  }

  /**
   * Stop all bots
   */
  async stopAll() {
    console.log('🛑 Stopping all bots...');
    for (const [matrixUserId, bot] of this.bots.entries()) {
      await bot.stop();
    }
    this.bots.clear();
    console.log('✅ All bots stopped');
  }

  /**
   * Generate or retrieve bot token
   * In production, this should call Matrix API to register the bot
   */
  private generateBotToken(app: AppConfig): string {
    // TODO: Implement actual Matrix bot registration
    // For now, return a placeholder
    return `bot_token_for_${app.matrix_user_id}`;
  }
}
