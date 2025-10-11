<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppResource extends JsonResource
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
            'domain' => $this->domain,
            'matrix_user_id' => $this->matrix_user_id,
            'app_url' => $this->app_url,
            'status' => $this->status,
            'capabilities' => $this->capabilities,
            'available_scopes' => $this->available_scopes,
            'metadata' => $this->metadata,
            'description' => $this->description,

            // Don't expose sensitive data
            // 'service_api_key' is hidden
            // 'api_config' may contain sensitive tokens

            // Computed properties
            'is_online' => $this->isOnline(),

            // Timestamps
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
