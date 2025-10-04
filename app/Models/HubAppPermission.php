<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HubAppPermission extends Model
{
    protected $fillable = [
        'user_id',
        'app_id',
        'granted_scopes',
        'expires_at',
    ];

    protected $casts = [
        'granted_scopes' => 'array',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns this permission
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the app this permission is for
     */
    public function app(): BelongsTo
    {
        return $this->belongsTo(App::class);
    }

    /**
     * Check if this permission has a specific scope
     */
    public function hasScope(string $scope): bool
    {
        return in_array($scope, $this->granted_scopes ?? []);
    }

    /**
     * Check if this permission is still valid
     */
    public function isValid(): bool
    {
        return $this->expires_at === null || $this->expires_at->isFuture();
    }

    /**
     * Check if permission has expired
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && $this->expires_at->isPast();
    }

    /**
     * Add a scope to granted scopes
     */
    public function addScope(string $scope): void
    {
        $scopes = $this->granted_scopes ?? [];

        if (!in_array($scope, $scopes)) {
            $scopes[] = $scope;
            $this->update(['granted_scopes' => $scopes]);
        }
    }

    /**
     * Remove a scope from granted scopes
     */
    public function removeScope(string $scope): void
    {
        $scopes = $this->granted_scopes ?? [];
        $scopes = array_values(array_filter($scopes, fn($s) => $s !== $scope));

        $this->update(['granted_scopes' => $scopes]);
    }
}
