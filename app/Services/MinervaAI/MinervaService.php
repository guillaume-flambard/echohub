<?php

namespace App\Services\MinervaAI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MinervaService
{
    private string $provider;
    private string $apiKey;
    private string $model;
    private string $baseUrl;

    public function __construct()
    {
        $this->provider = config('minerva.provider', 'ollama');
        $this->apiKey = config('minerva.api_key', '');
        $this->model = config('minerva.model', 'llama3.2:3b');
        $this->baseUrl = config('minerva.base_url', 'http://localhost:11434');
    }

    /**
     * Chat with Minerva AI with app context
     */
    public function chat(array $params): array
    {
        $message = $params['message'];
        $context = $params['context'] ?? [];
        $instanceId = $params['instanceId'] ?? null;
        $conversationHistory = $params['conversationHistory'] ?? [];

        return match ($this->provider) {
            'ollama' => $this->chatOllama($message, $context, $instanceId, $conversationHistory),
            'anthropic' => $this->chatAnthropic($message, $context, $instanceId, $conversationHistory),
            'openai' => $this->chatOpenAI($message, $context, $instanceId, $conversationHistory),
            default => throw new \Exception("Unsupported AI provider: {$this->provider}"),
        };
    }

    /**
     * Chat using Ollama local models
     */
    private function chatOllama(string $message, array $context, ?string $instanceId, array $history): array
    {
        $systemPrompt = $this->buildSystemPrompt($context, $instanceId);

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        foreach ($history as $msg) {
            $messages[] = [
                'role' => $msg['role'] === 'assistant' ? 'assistant' : 'user',
                'content' => $msg['content'],
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $message,
        ];

        try {
            $response = Http::timeout(60)->post("{$this->baseUrl}/api/chat", [
                'model' => $this->model,
                'messages' => $messages,
                'stream' => false,
            ]);

            if (! $response->successful()) {
                Log::error('Minerva AI (Ollama) API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'error' => 'Failed to communicate with Ollama',
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'response' => $data['message']['content'] ?? '',
                'usage' => [
                    'input_tokens' => $data['prompt_eval_count'] ?? 0,
                    'output_tokens' => $data['eval_count'] ?? 0,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Minerva AI (Ollama) exception', [
                'message' => $e->getMessage(),
                'instance' => $instanceId,
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Chat using Anthropic Claude API
     */
    private function chatAnthropic(string $message, array $context, ?string $instanceId, array $history): array
    {
        $systemPrompt = $this->buildSystemPrompt($context, $instanceId);

        $messages = [];
        foreach ($history as $msg) {
            $messages[] = [
                'role' => $msg['role'],
                'content' => $msg['content'],
            ];
        }
        $messages[] = [
            'role' => 'user',
            'content' => $message,
        ];

        try {
            $response = Http::withHeaders([
                'x-api-key' => $this->apiKey,
                'anthropic-version' => '2023-06-01',
                'content-type' => 'application/json',
            ])->post('https://api.anthropic.com/v1/messages', [
                'model' => $this->model,
                'max_tokens' => 4096,
                'system' => $systemPrompt,
                'messages' => $messages,
            ]);

            if (! $response->successful()) {
                Log::error('Minerva AI API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'error' => 'Failed to communicate with Minerva AI',
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'response' => $data['content'][0]['text'] ?? '',
                'usage' => [
                    'input_tokens' => $data['usage']['input_tokens'] ?? 0,
                    'output_tokens' => $data['usage']['output_tokens'] ?? 0,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Minerva AI exception', [
                'message' => $e->getMessage(),
                'instance' => $instanceId,
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Chat using OpenAI API
     */
    private function chatOpenAI(string $message, array $context, ?string $instanceId, array $history): array
    {
        $systemPrompt = $this->buildSystemPrompt($context, $instanceId);

        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
        ];

        foreach ($history as $msg) {
            $messages[] = [
                'role' => $msg['role'],
                'content' => $msg['content'],
            ];
        }

        $messages[] = [
            'role' => 'user',
            'content' => $message,
        ];

        try {
            $response = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'Content-Type' => 'application/json',
            ])->post('https://api.openai.com/v1/chat/completions', [
                'model' => $this->model,
                'messages' => $messages,
                'max_tokens' => 4096,
            ]);

            if (! $response->successful()) {
                Log::error('Minerva AI API error', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'error' => 'Failed to communicate with Minerva AI',
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'response' => $data['choices'][0]['message']['content'] ?? '',
                'usage' => [
                    'input_tokens' => $data['usage']['prompt_tokens'] ?? 0,
                    'output_tokens' => $data['usage']['completion_tokens'] ?? 0,
                ],
            ];
        } catch (\Exception $e) {
            Log::error('Minerva AI exception', [
                'message' => $e->getMessage(),
                'instance' => $instanceId,
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Build system prompt with app context
     */
    private function buildSystemPrompt(array $context, ?string $instanceId): string
    {
        $basePrompt = "You are Minerva, an AI assistant integrated into EchoHub - a unified hub for managing multiple applications.\n\n";

        if ($instanceId) {
            $appName = $context['app_name'] ?? $instanceId;
            $appDomain = $context['app_domain'] ?? 'unknown';
            $capabilities = $context['capabilities'] ?? [];

            $basePrompt .= "You are currently operating as the Minerva instance for {$appName} ({$appDomain}).\n\n";
            $basePrompt .= "Your role is to help users manage and understand this application. You have access to the following capabilities:\n";

            foreach ($capabilities as $capability) {
                $basePrompt .= "- {$capability}\n";
            }

            $basePrompt .= "\n";

            if (! empty($context['current_data'])) {
                $basePrompt .= "Current application data:\n";
                $basePrompt .= json_encode($context['current_data'], JSON_PRETTY_PRINT)."\n\n";
            }
        }

        $basePrompt .= "Be helpful, concise, and actionable. When users ask questions, provide clear answers. ";
        $basePrompt .= "When they need insights, analyze the data and provide meaningful observations. ";
        $basePrompt .= "When they want to perform actions, guide them or execute commands if available.";

        return $basePrompt;
    }

    /**
     * Execute an app command through Minerva
     */
    public function executeCommand(string $instanceId, string $command, array $params = []): array
    {
        // This will be implemented to execute app-specific commands
        // For now, return a placeholder
        return [
            'success' => true,
            'message' => "Command execution for {$command} is not yet implemented",
        ];
    }
}
