<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MinervaContextResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'instance_id' => $this->instance_id,

            // Include contact if loaded
            'contact' => $this->when(
                $this->relationLoaded('contact'),
                fn () => ContactResource::make($this->contact)
            ),

            // Conversation history as message resources
            'conversation_history' => $this->when(
                $this->conversation_history !== null,
                fn () => MessageResource::collection($this->conversation_history ?? [])
            ),

            // System prompt (may be sensitive, only include if explicitly loaded)
            'system_prompt' => $this->when(
                $request->user()?->can('viewSystemPrompt', $this->resource),
                $this->system_prompt
            ),

            // Message count helper
            'message_count' => count($this->conversation_history ?? []),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
