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
    } catch (error: unknown) {
      console.error('❌ Error loading apps:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Start a bot for a specific app
   */
  private async startBot(app: AppConfig) {
    try {
      // Get access token from config, or login to get one
      let accessToken = app.api_config?.matrix_access_token;

      if (!accessToken) {
        console.log(`🔑 No access token found for ${app.name}, logging in...`);
        accessToken = await this.loginBot(app);
      }

      const bot = new MinervaAppBot(
        this.homeserverUrl,
        accessToken,
        app,
        this.laravelApiUrl,
        this.laravelApiToken
      );

      await bot.start();
      this.bots.set(app.matrix_user_id, bot);
    } catch (error: unknown) {
      console.error(`❌ Failed to start bot for ${app.name}:`, error instanceof Error ? error.message : String(error));
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
    for (const [, bot] of this.bots.entries()) {
      await bot.stop();
    }
    this.bots.clear();
    console.log('✅ All bots stopped');
  }

  /**
   * Login to Matrix and get access token
   */
  private async loginBot(app: AppConfig): Promise<string> {
    // Get bot credentials from app config
    const username = app.api_config?.matrix_bot_username;
    const password = app.api_config?.matrix_bot_password;

    if (!username || !password) {
      throw new Error(
        `Missing Matrix credentials for ${app.name}. ` +
        `Set matrix_bot_username and matrix_bot_password in api_config.`
      );
    }

    try {
      // Login to Matrix
      const response = await axios.post(`${this.homeserverUrl}/_matrix/client/r0/login`, {
        type: 'm.login.password',
        user: username,
        password: password,
      });

      const accessToken = response.data.access_token;
      console.log(`✅ Logged in to Matrix as ${username}`);

      return accessToken;
    } catch (error: unknown) {
      throw new Error(
        `Failed to login to Matrix for ${app.name}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}
