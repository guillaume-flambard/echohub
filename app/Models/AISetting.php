<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AISetting extends Model
{
    protected $table = 'ai_settings';

    protected $fillable = [
        'user_id',
        'provider',
        'model',
        'api_key',
        'base_url',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected $hidden = [
        'api_key',
    ];

    /**
     * Get the user that owns the AI setting
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Encrypt/decrypt API key
     */
    protected function apiKey(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? decrypt($value) : null,
            set: fn (?string $value) => $value ? encrypt($value) : null,
        );
    }

    /**
     * Get the active AI setting for a user (or global if no user)
     */
    public static function getActive(?int $userId = null): ?self
    {
        return static::where('user_id', $userId)
            ->where('is_active', true)
            ->first() ?? static::whereNull('user_id')
            ->where('is_active', true)
            ->first();
    }
}
