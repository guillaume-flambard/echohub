<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'name',
        'display_name',
        'description',
        'is_system',
        'permissions',
    ];

    protected $casts = [
        'is_system' => 'boolean',
        'permissions' => 'array',
    ];

    /**
     * Relationship: Role belongs to organization (null for global roles)
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Relationship: Role has many permissions
     */
    public function permissionsList(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role');
    }

    /**
     * Scope: Global (system) roles
     */
    public function scopeGlobal($query)
    {
        return $query->whereNull('organization_id');
    }

    /**
     * Scope: Organization-specific roles
     */
    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    /**
     * Scope: System roles (protected)
     */
    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }

    /**
     * Check if role has specific permission
     */
    public function hasPermission(string $permission): bool
    {
        if (is_array($this->permissions)) {
            return in_array($permission, $this->permissions);
        }

        return $this->permissionsList()->where('name', $permission)->exists();
    }

    /**
     * Check if role has any of the given permissions
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if role has all of the given permissions
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $permission) {
            if (! $this->hasPermission($permission)) {
                return false;
            }
        }

        return true;
    }
}
