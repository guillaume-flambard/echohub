<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MinervaContext extends Model
{
    protected $fillable = [
        'instance_id',
        'user_id',
        'conversation_history',
        'app_state',
    ];

    protected $casts = [
        'conversation_history' => 'array',
        'app_state' => 'array',
    ];

    /**
     * Get the user that owns this context
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Add a message to conversation history
     */
    public function addMessage(string $role, string $content): void
    {
        $history = $this->conversation_history ?? [];
        $history[] = [
            'role' => $role,
            'content' => $content,
            'timestamp' => now()->toIso8601String(),
        ];

        // Keep only last 40 messages
        if (count($history) > 40) {
            $history = array_slice($history, -40);
        }

        $this->update(['conversation_history' => $history]);
    }

    /**
     * Clear conversation history
     */
    public function clearHistory(): void
    {
        $this->update(['conversation_history' => []]);
    }

    /**
     * Get message count
     */
    public function getMessageCount(): int
    {
        return count($this->conversation_history ?? []);
    }
}
