<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This resource is used for individual message objects
     * from conversation histories
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // If resource is already an array (from JSON conversation_history)
        if (is_array($this->resource)) {
            return [
                'role' => $this->resource['role'] ?? 'user',
                'content' => $this->resource['content'] ?? '',
                'timestamp' => $this->resource['timestamp'] ?? now()->toIso8601String(),
            ];
        }

        // If resource is an object/model
        return [
            'role' => $this->role ?? 'user',
            'content' => $this->content ?? '',
            'timestamp' => $this->timestamp ?? $this->created_at?->toIso8601String() ?? now()->toIso8601String(),
        ];
    }
}
