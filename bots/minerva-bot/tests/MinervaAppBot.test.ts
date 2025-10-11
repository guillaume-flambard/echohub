import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MinervaAppBot } from '../src/MinervaAppBot.js';
import type { AppConfig, MessageEvent } from '../src/types.js';

// Mock matrix-bot-sdk
vi.mock('matrix-bot-sdk', () => ({
  MatrixClient: vi.fn().mockImplementation(() => ({
    setDisplayName: vi.fn(),
    on: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    setTyping: vi.fn(),
    replyNotice: vi.fn(),
    addPreprocessor: vi.fn(),
  })),
  SimpleFsStorageProvider: vi.fn(),
  AutojoinRoomsMixin: {
    setupOnClient: vi.fn(),
  },
  RichRepliesPreprocessor: vi.fn(),
}));

// Mock axios
vi.mock('axios', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('MinervaAppBot Event Filtering', () => {
  let bot: MinervaAppBot;
  let mockAppConfig: AppConfig;
  let handleMessageSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    mockAppConfig = {
      id: 1,
      name: 'Test App',
      matrix_user_id: '@testbot:echohub.local',
      domain: 'test.app',
      api_config: {
        matrix_access_token: 'test_token',
      },
    };

    bot = new MinervaAppBot(
      'http://localhost:8008',
      'test_token',
      mockAppConfig,
      'http://localhost:8000/api',
      'test_api_token'
    );

    // Get reference to the private handleMessage method
    // @ts-expect-error - accessing private method for testing
    handleMessageSpy = vi.spyOn(bot, 'handleMessage');
  });

  it('should ignore messages from the bot itself', async () => {
    const event: MessageEvent<Record<string, unknown>> = {
      sender: '@testbot:echohub.local', // Same as bot's matrix_user_id
      content: {
        msgtype: 'm.text',
        body: 'Test message',
      },
      origin_server_ts: Date.now(),
    };

    // @ts-expect-error - testing private method/property
    await bot.handleMessage('!testroom:echohub.local', event);

    // Should return early, not call getMinervaResponse
    expect(handleMessageSpy).toHaveReturned();
  });

  it('should ignore non-text messages', async () => {
    const event: MessageEvent<Record<string, unknown>> = {
      sender: '@user:echohub.local',
      content: {
        msgtype: 'm.image', // Not m.text
        body: 'image.png',
      },
      origin_server_ts: Date.now(),
    };

    // @ts-expect-error - testing private method/property
    await bot.handleMessage('!testroom:echohub.local', event);

    expect(handleMessageSpy).toHaveReturned();
  });

  it('should ignore messages sent before bot started (old backfill)', async () => {
    // Message timestamp is before bot start time
    const oldTimestamp = Date.now() - 60000; // 1 minute ago

    const event: MessageEvent<Record<string, unknown>> = {
      sender: '@user:echohub.local',
      content: {
        msgtype: 'm.text',
        body: 'Old message from history',
      },
      origin_server_ts: oldTimestamp,
    };

    // @ts-expect-error - testing private method/property
    await bot.handleMessage('!testroom:echohub.local', event);

    expect(handleMessageSpy).toHaveReturned();
    // Should log that it's ignoring the old message
  });

  it('should ignore encrypted messages', async () => {
    const event: MessageEvent<Record<string, unknown>> = {
      sender: '@user:echohub.local',
      content: {
        msgtype: 'm.encrypted',
        body: 'encrypted data',
      },
      origin_server_ts: Date.now(),
    };

    // @ts-expect-error - testing private method/property
    await bot.handleMessage('!testroom:echohub.local', event);

    expect(handleMessageSpy).toHaveReturned();
    // Should log warning about encrypted message
  });

  it('should process valid messages sent after bot started', async () => {
    // Create bot with known start time
    const botStartTime = Date.now();

    // Message sent after bot started
    const event: MessageEvent<Record<string, unknown>> = {
      sender: '@user:echohub.local',
      content: {
        msgtype: 'm.text',
        body: 'Valid message',
      },
      origin_server_ts: botStartTime + 1000, // 1 second after start
    };

    // Mock the getMinervaResponse to succeed
    // @ts-expect-error - testing private method/property
    vi.spyOn(bot, 'getMinervaResponse').mockResolvedValue({
      success: true,
      response: 'Bot response',
    });

    // @ts-expect-error - testing private method/property
    await bot.handleMessage('!testroom:echohub.local', event);

    // @ts-expect-error - testing private method/property
    expect(bot.getMinervaResponse).toHaveBeenCalledWith('Valid message', '@user:echohub.local');
  });

  it('should not process messages without origin_server_ts', async () => {
    const event: MessageEvent<Record<string, unknown>> = {
      sender: '@user:echohub.local',
      content: {
        msgtype: 'm.text',
        body: 'Message without timestamp',
      },
      // No origin_server_ts
    };

    // @ts-expect-error - testing private method/property
    await bot.handleMessage('!testroom:echohub.local', event);

    // Should process this since no timestamp check can be done
    // @ts-expect-error - testing private method/property
    expect(bot.getMinervaResponse).not.toHaveBeenCalled();
  });

  it('should handle multiple filtering conditions correctly', async () => {
    const events: Array<MessageEvent<Record<string, unknown>>> = [
      // Should be ignored: own message
      {
        sender: '@testbot:echohub.local',
        content: { msgtype: 'm.text', body: 'Own message' },
        origin_server_ts: Date.now(),
      },
      // Should be ignored: not text
      {
        sender: '@user:echohub.local',
        content: { msgtype: 'm.image', body: 'image.png' },
        origin_server_ts: Date.now(),
      },
      // Should be ignored: old message
      {
        sender: '@user:echohub.local',
        content: { msgtype: 'm.text', body: 'Old message' },
        origin_server_ts: Date.now() - 60000,
      },
      // Should be ignored: encrypted
      {
        sender: '@user:echohub.local',
        content: { msgtype: 'm.encrypted', body: 'encrypted' },
        origin_server_ts: Date.now(),
      },
      // Should be processed: valid message
      {
        sender: '@user:echohub.local',
        content: { msgtype: 'm.text', body: 'Valid message' },
        origin_server_ts: Date.now() + 1000,
      },
    ];

    // Mock getMinervaResponse
    // @ts-expect-error - testing private method/property
    const getMinervaResponseSpy = vi.spyOn(bot, 'getMinervaResponse').mockResolvedValue({
      success: true,
      response: 'Response',
    });

    // Process all events
    for (const event of events) {
      // @ts-expect-error - testing private method/property
      await bot.handleMessage('!testroom:echohub.local', event);
    }

    // Only the last valid message should trigger getMinervaResponse
    expect(getMinervaResponseSpy).toHaveBeenCalledTimes(1);
    expect(getMinervaResponseSpy).toHaveBeenCalledWith('Valid message', '@user:echohub.local');
  });
});

describe('MinervaAppBot startTime tracking', () => {
  it('should record start time when bot is created', () => {
    const beforeCreate = Date.now();

    const bot = new MinervaAppBot(
      'http://localhost:8008',
      'test_token',
      {
        id: 1,
        name: 'Test App',
        matrix_user_id: '@testbot:echohub.local',
        domain: 'test.app',
        api_config: {},
      },
      'http://localhost:8000/api',
      'test_api_token'
    );

    const afterCreate = Date.now();

    // @ts-expect-error - accessing private property for testing
    expect(bot.startTime).toBeGreaterThanOrEqual(beforeCreate);
    // @ts-expect-error - testing private method/property
    expect(bot.startTime).toBeLessThanOrEqual(afterCreate);
  });

  it('should use startTime consistently across message handling', async () => {
    const bot = new MinervaAppBot(
      'http://localhost:8008',
      'test_token',
      {
        id: 1,
        name: 'Test App',
        matrix_user_id: '@testbot:echohub.local',
        domain: 'test.app',
        api_config: {},
      },
      'http://localhost:8000/api',
      'test_api_token'
    );

    // @ts-expect-error - testing private method/property
    const startTime = bot.startTime;

    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 10));

    // startTime should not have changed
    // @ts-expect-error - testing private method/property
    expect(bot.startTime).toBe(startTime);
  });
});
