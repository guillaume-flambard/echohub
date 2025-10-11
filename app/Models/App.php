<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class App extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'domain',
        'organization_id',
        'matrix_user_id',
        'app_url',
        'service_api_key',
        'status',
        'capabilities',
        'available_scopes',
        'api_config',
        'metadata',
        'description',
    ];

    protected $casts = [
        'capabilities' => 'array',
        'available_scopes' => 'array',
        'api_config' => 'array',
        'metadata' => 'array',
    ];

    protected $hidden = [
        'service_api_key',
    ];

    /**
     * Encrypt service API key when setting
     */
    public function setServiceApiKeyAttribute($value)
    {
        $this->attributes['service_api_key'] = $value ? encrypt($value) : null;
    }

    /**
     * Decrypt service API key when getting
     */
    public function getServiceApiKeyAttribute($value)
    {
        return $value ? decrypt($value) : null;
    }

    /**
     * Get the organization this app belongs to
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Get the contacts for this app
     */
    public function contacts(): HasMany
    {
        return $this->hasMany(Contact::class);
    }

    /**
     * Get permissions for this app
     */
    public function permissions(): HasMany
    {
        return $this->hasMany(HubAppPermission::class);
    }

    /**
     * Get access logs for this app
     */
    public function accessLogs(): HasMany
    {
        return $this->hasMany(AppAccessLog::class);
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

    /**
     * Check if app has a specific scope
     */
    public function hasScope(string $scope): bool
    {
        return in_array($scope, $this->available_scopes ?? []);
    }

    /**
     * Get the full API endpoint URL
     */
    public function getApiUrl(string $endpoint = ''): string
    {
        $baseUrl = rtrim($this->app_url ?: '', '/');
        $endpoint = ltrim($endpoint, '/');

        return $endpoint ? "{$baseUrl}/api/v1/{$endpoint}" : "{$baseUrl}/api/v1";
    }

    /**
     * Scope a query to a specific organization
     */
    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }
}
