<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationship: User belongs to many organizations
     */
    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'organization_user')
            ->withPivot('role_id', 'status', 'invited_by', 'invited_at', 'joined_at', 'permissions')
            ->withTimestamps();
    }

    /**
     * Relationship: User belongs to many teams
     */
    public function teams(): BelongsToMany
    {
        return $this->belongsToMany(Team::class, 'team_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Get user's role in specific organization
     */
    public function roleInOrganization(Organization $organization): ?Role
    {
        $pivot = $this->organizations()->where('organization_id', $organization->id)->first()?->pivot;

        return $pivot?->role_id ? Role::find($pivot->role_id) : null;
    }

    /**
     * Check if user has permission in organization
     */
    public function hasPermissionInOrganization(string $permission, Organization $organization): bool
    {
        $role = $this->roleInOrganization($organization);

        if (! $role) {
            return false;
        }

        // Check user-specific permission overrides first
        $pivot = $this->organizations()->where('organization_id', $organization->id)->first()?->pivot;

        if ($pivot && $pivot->permissions) {
            $userPermissions = is_string($pivot->permissions) ? json_decode($pivot->permissions, true) : $pivot->permissions;

            if (in_array($permission, $userPermissions ?? [])) {
                return true;
            }
        }

        // Check role permissions
        return $role->hasPermission($permission);
    }

    /**
     * Check if user belongs to organization
     */
    public function belongsToOrganization(Organization $organization): bool
    {
        return $this->organizations()->where('organization_id', $organization->id)->exists();
    }

    /**
     * Check if user is active in organization
     */
    public function isActiveInOrganization(Organization $organization): bool
    {
        return $this->organizations()
            ->where('organization_id', $organization->id)
            ->wherePivot('status', 'active')
            ->exists();
    }
}
