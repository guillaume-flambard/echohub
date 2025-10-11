<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organization extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'logo_url',
        'subscription_tier',
        'status',
        'trial_ends_at',
        'stripe_customer_id',
        'stripe_subscription_id',
        'database_name',
        'database_host',
        'settings',
        'metadata',
        'max_users',
        'max_apps',
        'max_messages_per_month',
        'billing_email',
        'support_email',
        'phone',
    ];

    protected $casts = [
        'settings' => 'array',
        'metadata' => 'array',
        'trial_ends_at' => 'datetime',
        'max_users' => 'integer',
        'max_apps' => 'integer',
        'max_messages_per_month' => 'integer',
    ];

    /**
     * Relationship: Organization has many users
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'organization_user')
            ->withPivot('role_id', 'status', 'invited_by', 'invited_at', 'joined_at', 'permissions')
            ->withTimestamps();
    }

    /**
     * Relationship: Organization has many teams
     */
    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    /**
     * Relationship: Organization has many roles
     */
    public function roles(): HasMany
    {
        return $this->hasMany(Role::class);
    }

    /**
     * Relationship: Organization has many apps
     */
    public function apps(): HasMany
    {
        return $this->hasMany(App::class);
    }

    /**
     * Relationship: Organization has many contacts
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Relationship: Organization has many minerva contexts
     */
    public function minervaContexts(): HasMany
    {
        return $this->hasMany(MinervaContext::class);
    }

    /**
     * Relationship: Organization has many audit logs
     */
    public function auditLogs(): HasMany
    {
        return $this->hasMany(AuditLog::class);
    }

    /**
     * Scope: Active organizations only
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope: Organizations on trial
     */
    public function scopeOnTrial($query)
    {
        return $query->where('status', 'trial')
            ->where('trial_ends_at', '>', now());
    }

    /**
     * Scope: Expired trials
     */
    public function scopeExpiredTrial($query)
    {
        return $query->where('status', 'trial')
            ->where('trial_ends_at', '<=', now());
    }

    /**
     * Check if organization is on active subscription
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if organization is on trial
     */
    public function isOnTrial(): bool
    {
        return $this->status === 'trial' && $this->trial_ends_at && $this->trial_ends_at->isFuture();
    }

    /**
     * Check if trial has expired
     */
    public function hasExpiredTrial(): bool
    {
        return $this->status === 'trial' && $this->trial_ends_at && $this->trial_ends_at->isPast();
    }

    /**
     * Check if organization is suspended
     */
    public function isSuspended(): bool
    {
        return $this->status === 'suspended';
    }

    /**
     * Check if organization can perform action based on limits
     */
    public function canAddUser(): bool
    {
        return $this->users()->count() < $this->max_users;
    }

    public function canAddApp(): bool
    {
        return $this->apps()->count() < $this->max_apps;
    }

    /**
     * Get current message usage for the month
     */
    public function getCurrentMonthMessageCount(): int
    {
        // This would query audit logs or a usage tracking table
        // For now, return 0 as placeholder
        return 0;
    }

    /**
     * Check if organization has reached message limit
     */
    public function hasReachedMessageLimit(): bool
    {
        return $this->getCurrentMonthMessageCount() >= $this->max_messages_per_month;
    }

    /**
     * Get subscription tier display name
     */
    public function getSubscriptionTierNameAttribute(): string
    {
        return match ($this->subscription_tier) {
            'free' => 'Free',
            'professional' => 'Professional',
            'business' => 'Business',
            'enterprise' => 'Enterprise',
            default => 'Unknown',
        };
    }

    /**
     * Get status display name
     */
    public function getStatusDisplayAttribute(): string
    {
        return match ($this->status) {
            'trial' => 'Trial',
            'active' => 'Active',
            'suspended' => 'Suspended',
            'cancelled' => 'Cancelled',
            default => 'Unknown',
        };
    }
}
