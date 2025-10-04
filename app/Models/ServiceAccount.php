<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ServiceAccount extends Model
{
    protected $fillable = [
        'name',
        'api_key',
        'scopes',
        'expires_at',
        'is_active',
    ];

    protected $casts = [
        'scopes' => 'array',
        'expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'api_key',
    ];

    /**
     * Generate a new API key
     */
    public static function generateApiKey(): string
    {
        return 'sk_'.Str::random(64);
    }

    /**
     * Check if this service account has a specific scope
     */
    public function hasScope(string $scope): bool
    {
        return in_array($scope, $this->scopes ?? []);
    }

    /**
     * Check if this service account is valid
     */
    public function isValid(): bool
    {
        return $this->is_active
            && ($this->expires_at === null || $this->expires_at->isFuture());
    }

    /**
     * Check if this service account has expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    /**
     * Rotate the API key
     */
    public function rotateKey(): string
    {
        $newKey = self::generateApiKey();
        $this->update(['api_key' => $newKey]);

        return $newKey;
    }

    /**
     * Deactivate this service account
     */
    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    /**
     * Activate this service account
     */
    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }
}
