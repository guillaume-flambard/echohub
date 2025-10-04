<?php

namespace App\Services\MinervaAI;

use App\Models\App;
use App\Models\MinervaContext as MinervaContextModel;

class InstanceManager
{
    public function __construct(
        private MinervaService $minervaService
    ) {}

    /**
     * Get or create a Minerva context for an app instance
     */
    public function getOrCreateContext(string $instanceId, int $userId): MinervaContextModel
    {
        return MinervaContextModel::firstOrCreate(
            [
                'instance_id' => $instanceId,
                'user_id' => $userId,
            ],
            [
                'conversation_history' => [],
                'app_state' => [],
            ]
        );
    }

    /**
     * Send a message to a Minerva instance
     */
    public function sendMessage(App $app, string $message, int $userId): array
    {
        $context = $this->getOrCreateContext($app->matrix_user_id, $userId);

        // Build app context
        $appContext = AppContext::build($app);

        // Get conversation history
        $history = $context->conversation_history ?? [];

        // Send to Minerva AI
        $response = $this->minervaService->chat([
            'message' => $message,
            'context' => $appContext,
            'instanceId' => $app->matrix_user_id,
            'conversationHistory' => $history,
        ]);

        if ($response['success']) {
            // Update conversation history with timestamps
            $timestamp = now()->toIso8601String();
            $history[] = ['role' => 'user', 'content' => $message, 'timestamp' => $timestamp];
            $history[] = ['role' => 'assistant', 'content' => $response['response'], 'timestamp' => $timestamp];

            // Keep only last 20 messages to prevent context from growing too large
            if (count($history) > 40) {
                $history = array_slice($history, -40);
            }

            $context->update([
                'conversation_history' => $history,
                'updated_at' => now(),
            ]);
        }

        return $response;
    }

    /**
     * Clear conversation history for an instance
     */
    public function clearHistory(string $instanceId, int $userId): bool
    {
        $context = MinervaContextModel::where('instance_id', $instanceId)
            ->where('user_id', $userId)
            ->first();

        if ($context) {
            $context->update([
                'conversation_history' => [],
            ]);

            return true;
        }

        return false;
    }

    /**
     * Get conversation history for an instance
     */
    public function getHistory(string $instanceId, int $userId): array
    {
        $context = MinervaContextModel::where('instance_id', $instanceId)
            ->where('user_id', $userId)
            ->first();

        return $context?->conversation_history ?? [];
    }
}
