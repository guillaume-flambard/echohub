<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'organization_id',
        'matrix_id',
        'type',
        'app_id',
        'name',
        'avatar',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the user that owns the contact
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the organization this contact belongs to
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the app if this contact is an app type
     */
    public function app(): BelongsTo
    {
        return $this->belongsTo(App::class);
    }

    /**
     * Check if contact is an app
     */
    public function isApp(): bool
    {
        return $this->type === 'app';
    }

    /**
     * Check if contact is a human
     */
    public function isHuman(): bool
    {
        return $this->type === 'human';
    }

    /**
     * Scope a query to only include app contacts
     */
    public function scopeApps($query)
    {
        return $query->where('type', 'app');
    }

    /**
     * Scope a query to only include human contacts
     */
    public function scopeHumans($query)
    {
        return $query->where('type', 'human');
    }

    /**
     * Scope a query to a specific organization
     */
    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }
}
