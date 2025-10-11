<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'organization_id',
        'name',
        'slug',
        'description',
        'owner_id',
        'settings',
        'metadata',
        'max_members',
        'max_apps',
    ];

    protected $casts = [
        'settings' => 'array',
        'metadata' => 'array',
        'max_members' => 'integer',
        'max_apps' => 'integer',
    ];

    /**
     * Relationship: Team belongs to organization
     */
    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    /**
     * Relationship: Team has an owner
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    /**
     * Relationship: Team has many users
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_user')
            ->withPivot('role')
            ->withTimestamps();
    }

    /**
     * Scope: Teams for specific organization
     */
    public function scopeForOrganization($query, $organizationId)
    {
        return $query->where('organization_id', $organizationId);
    }

    /**
     * Check if user is a member of the team
     */
    public function hasMember(User $user): bool
    {
        return $this->users()->where('user_id', $user->id)->exists();
    }

    /**
     * Check if user is the team lead
     */
    public function isLead(User $user): bool
    {
        return $this->users()
            ->where('user_id', $user->id)
            ->wherePivot('role', 'lead')
            ->exists();
    }

    /**
     * Check if team can add more members
     */
    public function canAddMember(): bool
    {
        if ($this->max_members === null) {
            return true;
        }

        return $this->users()->count() < $this->max_members;
    }
}
