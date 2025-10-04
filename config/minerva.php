<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Minerva AI Provider
    |--------------------------------------------------------------------------
    |
    | The AI provider to use for Minerva instances.
    | Supported: "ollama", "anthropic", "openai"
    |
    */

    'provider' => env('MINERVA_AI_PROVIDER', 'ollama'),

    /*
    |--------------------------------------------------------------------------
    | Minerva AI Base URL
    |--------------------------------------------------------------------------
    |
    | The base URL for Ollama or custom AI providers
    |
    */

    'base_url' => env('MINERVA_AI_BASE_URL', 'http://localhost:11434'),

    /*
    |--------------------------------------------------------------------------
    | Minerva AI API Key
    |--------------------------------------------------------------------------
    |
    | The API key for your chosen AI provider (not needed for Ollama)
    |
    */

    'api_key' => env('MINERVA_AI_API_KEY', ''),

    /*
    |--------------------------------------------------------------------------
    | Minerva AI Model
    |--------------------------------------------------------------------------
    |
    | The model to use for AI responses
    | Ollama: llama3.2:3b, llama3.2:1b, qwen2.5:3b, phi3.5, etc.
    | Anthropic: claude-3-5-sonnet-20250219
    | OpenAI: gpt-4-turbo-preview
    |
    */

    'model' => env('MINERVA_AI_MODEL', 'llama3.2:3b'),

    /*
    |--------------------------------------------------------------------------
    | Max Context Messages
    |--------------------------------------------------------------------------
    |
    | Maximum number of messages to keep in conversation history per instance
    |
    */

    'max_context_messages' => env('MINERVA_MAX_CONTEXT_MESSAGES', 40),

];
