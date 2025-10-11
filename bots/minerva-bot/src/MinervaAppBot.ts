import {
  MatrixClient,
  SimpleFsStorageProvider,
  AutojoinRoomsMixin,
  RichRepliesPreprocessor,
  MessageEvent,
} from 'matrix-bot-sdk';
import axios from 'axios';
import type { AppConfig, MinervaResponse } from './types.js';

export class MinervaAppBot {
  private client: MatrixClient;
  private app: AppConfig;
  private laravelApiUrl: string;
  private laravelApiToken: string;
  private startTime: number;

  constructor(
    homeserverUrl: string,
    accessToken: string,
    app: AppConfig,
    laravelApiUrl: string,
    laravelApiToken: string
  ) {
    const storage = new SimpleFsStorageProvider(`./storage/${app.matrix_user_id}.json`);
    this.client = new MatrixClient(homeserverUrl, accessToken, storage);
    this.app = app;
    this.laravelApiUrl = laravelApiUrl;
    this.laravelApiToken = laravelApiToken;
    this.startTime = Date.now();

    // Auto-join rooms when invited
    AutojoinRoomsMixin.setupOnClient(this.client);

    // Enable rich replies
    this.client.addPreprocessor(new RichRepliesPreprocessor(false));
  }

  async start() {
    // Set display name
    await this.client.setDisplayName(this.app.name);

    // Listen for messages
    this.client.on('room.message', this.handleMessage.bind(this));

    // Start syncing
    await this.client.start();

    console.log(`✅ ${this.app.name} bot started (${this.app.matrix_user_id})`);
  }

  private async handleMessage(roomId: string, event: MessageEvent<Record<string, unknown>>) {
    // Ignore our own messages
    if (event.sender === this.app.matrix_user_id) return;

    // Only respond to text messages
    if (event.content?.msgtype !== 'm.text') return;

    // CRITICAL: Ignore messages sent before bot started (prevents processing old sync backfill)
    if (event.origin_server_ts && event.origin_server_ts < this.startTime) {
      console.log(`⏭️ [${this.app.name}] Ignoring old message (sent before bot started)`);
      return;
    }

    // Ignore encrypted messages (bot can't decrypt them)
    if (event.content?.msgtype === 'm.encrypted') {
      console.warn(`⚠️ [${this.app.name}] Ignoring encrypted message from ${event.sender}`);
      return;
    }

    const message = event.content.body;

    console.log(`📨 [${this.app.name}] Message from ${event.sender}: ${message}`);

    try {
      // Send typing indicator
      await this.client.setTyping(roomId, true, 5000);

      // Get Minerva response from Laravel API
      const response = await this.getMinervaResponse(message, event.sender);

      // Stop typing
      await this.client.setTyping(roomId, false, 0);

      if (response.success && response.response) {
        // Send response
        await this.client.replyNotice(roomId, event, response.response);

        console.log(`✅ [${this.app.name}] Responded to ${event.sender}`);
      } else {
        await this.client.replyNotice(
          roomId,
          event,
          `Sorry, I encountered an error: ${response.error || 'Unknown error'}`
        );
      }
    } catch (error) {
      console.error(`❌ [${this.app.name}] Error handling message:`, error);
      await this.client.setTyping(roomId, false, 0);
      await this.client.replyNotice(
        roomId,
        event,
        'Sorry, I encountered an unexpected error. Please try again later.'
      );
    }
  }

  private async getMinervaResponse(message: string, userId: string): Promise<MinervaResponse> {
    try {
      // Call Laravel API to get Minerva response
      // This simulates the flow - in production, you'd call the actual endpoint
      const response = await axios.post(
        `${this.laravelApiUrl}/minerva/chat`,
        {
          app_id: this.app.id,
          message,
          user_id: userId,
        },
        {
          headers: {
            Authorization: `Bearer ${this.laravelApiToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data;
    } catch (error: unknown) {
      console.error('Error calling Minerva API:', error instanceof Error ? error.message : String(error));
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async stop() {
    await this.client.stop();
    console.log(`🛑 ${this.app.name} bot stopped`);
  }
}
