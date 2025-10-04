<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class App extends Model
{
    protected $fillable = [
        'name',
        'domain',
        'matrix_user_id',
        'status',
        'capabilities',
        'api_config',
        'metadata',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'api_config' => 'array',
        'metadata' => 'array',
    ];

    /**
     * Get the contacts for this app
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Check if app is online
     */
    public function isOnline(): bool
    {
        return $this->status === 'online';
    }

    /**
     * Check if app has a specific capability
     */
    public function hasCapability(string $capability): bool
    {
        return in_array($capability, $this->capabilities ?? []);
    }
}
