<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'organization_id',
        'user_id',
        'action',
        'resource_type',
        'resource_id',
        'resource_name',
        'old_values',
        'new_values',
        'ip_address',
        'user_agent',
        'request_method',
        'request_url',
        'metadata',
        'description',
        'severity',
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
        'metadata' => 'array',
        'created_at' => 'datetime',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    public function scopeBySeverity($query, string $severity)
    {
        return $query->where('severity', $severity);
    }

    public function scopeByAction($query, string $action)
    {
        return $query->where('action', $action);
    }

    public function scopeByResource($query, string $resourceType, $resourceId = null)
    {
        $query = $query->where('resource_type', $resourceType);

        if ($resourceId !== null) {
            $query->where('resource_id', $resourceId);
        }

        return $query;
    }
}
