export interface AppConfig {
  id: number;
  name: string;
  domain: string;
  matrix_user_id: string;
  status: 'online' | 'offline' | 'degraded';
  capabilities: string[];
  api_config?: Record<string, any>;
  metadata?: Record<string, any>;
}

export interface MinervaMessage {
  message: string;
  context: AppContext;
  instanceId: string;
  conversationHistory: ConversationMessage[];
}

export interface AppContext {
  app_name: string;
  app_domain: string;
  capabilities: string[];
  current_data: Record<string, any>;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface MinervaResponse {
  success: boolean;
  response?: string;
  usage?: {
    input_tokens: number;
    output_tokens: number;
  };
  error?: string;
}
