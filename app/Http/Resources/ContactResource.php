<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'name' => $this->name,
            'matrix_id' => $this->matrix_id,
            'type' => $this->type,
            'avatar' => $this->avatar,
            'metadata' => $this->metadata,

            // Include app details if loaded and is app type
            'app' => $this->when(
                $this->type === 'app' && $this->relationLoaded('app'),
                fn () => AppResource::make($this->app)
            ),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
