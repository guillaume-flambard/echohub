<?php

namespace App\Services;

use App\Models\App;
use App\Models\HubAppPermission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class PermissionService
{
    /**
     * Grant user permission to access an app with specific scopes
     *
     * @param User $user
     * @param App $app
     * @param array $scopes
     * @param Carbon|null $expiresAt
     * @return HubAppPermission
     * @throws \Exception
     */
    public function grantPermission(
        User $user,
        App $app,
        array $scopes,
        ?Carbon $expiresAt = null
    ): HubAppPermission {
        // Validate scopes are available in the app
        $invalidScopes = array_diff($scopes, $app->available_scopes ?? []);
        if (!empty($invalidScopes)) {
            throw new \Exception(
                'Invalid scopes: ' . implode(', ', $invalidScopes) . '. Available scopes: ' . implode(', ', $app->available_scopes ?? [])
            );
        }

        // Create or update permission
        $permission = HubAppPermission::updateOrCreate(
            [
                'user_id' => $user->id,
                'app_id' => $app->id,
            ],
            [
                'granted_scopes' => $scopes,
                'expires_at' => $expiresAt,
            ]
        );

        return $permission;
    }

    /**
     * Revoke user permission to access an app
     *
     * @param User $user
     * @param App $app
     * @return bool
     */
    public function revokePermission(User $user, App $app): bool
    {
        return HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->delete() > 0;
    }

    /**
     * Add scopes to existing permission
     *
     * @param User $user
     * @param App $app
     * @param array $scopes
     * @return HubAppPermission|null
     * @throws \Exception
     */
    public function addScopes(User $user, App $app, array $scopes): ?HubAppPermission
    {
        $permission = HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->first();

        if (!$permission) {
            throw new \Exception('Permission not found');
        }

        // Validate scopes
        $invalidScopes = array_diff($scopes, $app->available_scopes ?? []);
        if (!empty($invalidScopes)) {
            throw new \Exception('Invalid scopes: ' . implode(', ', $invalidScopes));
        }

        foreach ($scopes as $scope) {
            $permission->addScope($scope);
        }

        return $permission->fresh();
    }

    /**
     * Remove scopes from existing permission
     *
     * @param User $user
     * @param App $app
     * @param array $scopes
     * @return HubAppPermission|null
     */
    public function removeScopes(User $user, App $app, array $scopes): ?HubAppPermission
    {
        $permission = HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->first();

        if (!$permission) {
            return null;
        }

        foreach ($scopes as $scope) {
            $permission->removeScope($scope);
        }

        return $permission->fresh();
    }

    /**
     * Check if user has permission to access an app
     *
     * @param User $user
     * @param App $app
     * @param array $requiredScopes
     * @return bool
     */
    public function hasPermission(User $user, App $app, array $requiredScopes = []): bool
    {
        $permission = HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->first();

        if (!$permission || !$permission->isValid()) {
            return false;
        }

        // If no specific scopes required, just check if permission exists and is valid
        if (empty($requiredScopes)) {
            return true;
        }

        // Check if user has all required scopes
        foreach ($requiredScopes as $scope) {
            if (!$permission->hasScope($scope)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Get all apps a user has permission to access
     *
     * @param User $user
     * @param bool $onlyValid
     * @return Collection
     */
    public function getUserApps(User $user, bool $onlyValid = true): Collection
    {
        $query = HubAppPermission::where('user_id', $user->id)
            ->with('app');

        if ($onlyValid) {
            $query->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
        }

        return $query->get()
            ->pluck('app')
            ->filter(); // Remove null apps
    }

    /**
     * Get all users with permission to access an app
     *
     * @param App $app
     * @param bool $onlyValid
     * @return Collection
     */
    public function getAppUsers(App $app, bool $onlyValid = true): Collection
    {
        $query = HubAppPermission::where('app_id', $app->id)
            ->with('user');

        if ($onlyValid) {
            $query->where(function ($q) {
                $q->whereNull('expires_at')
                    ->orWhere('expires_at', '>', now());
            });
        }

        return $query->get()
            ->pluck('user')
            ->filter(); // Remove null users
    }

    /**
     * Get user's permission for a specific app
     *
     * @param User $user
     * @param App $app
     * @return HubAppPermission|null
     */
    public function getPermission(User $user, App $app): ?HubAppPermission
    {
        return HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->first();
    }

    /**
     * Extend permission expiration
     *
     * @param User $user
     * @param App $app
     * @param Carbon $newExpiresAt
     * @return HubAppPermission|null
     */
    public function extendPermission(User $user, App $app, Carbon $newExpiresAt): ?HubAppPermission
    {
        $permission = HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->first();

        if (!$permission) {
            return null;
        }

        $permission->update(['expires_at' => $newExpiresAt]);

        return $permission->fresh();
    }

    /**
     * Remove expiration from permission (make it permanent)
     *
     * @param User $user
     * @param App $app
     * @return HubAppPermission|null
     */
    public function makePermissionPermanent(User $user, App $app): ?HubAppPermission
    {
        $permission = HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->first();

        if (!$permission) {
            return null;
        }

        $permission->update(['expires_at' => null]);

        return $permission->fresh();
    }

    /**
     * Get expired permissions
     *
     * @return Collection
     */
    public function getExpiredPermissions(): Collection
    {
        return HubAppPermission::whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->get();
    }

    /**
     * Clean up expired permissions
     *
     * @return int Number of deleted permissions
     */
    public function cleanupExpiredPermissions(): int
    {
        return HubAppPermission::whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->delete();
    }

    /**
     * Bulk grant permissions to multiple users
     *
     * @param array $userIds
     * @param App $app
     * @param array $scopes
     * @param Carbon|null $expiresAt
     * @return Collection
     */
    public function bulkGrantPermissions(
        array $userIds,
        App $app,
        array $scopes,
        ?Carbon $expiresAt = null
    ): Collection {
        $permissions = collect();

        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if ($user) {
                try {
                    $permissions->push($this->grantPermission($user, $app, $scopes, $expiresAt));
                } catch (\Exception $e) {
                    // Log error but continue with other users
                    \Log::error("Failed to grant permission to user {$userId}: {$e->getMessage()}");
                }
            }
        }

        return $permissions;
    }

    /**
     * Bulk revoke permissions from multiple users
     *
     * @param array $userIds
     * @param App $app
     * @return int Number of revoked permissions
     */
    public function bulkRevokePermissions(array $userIds, App $app): int
    {
        return HubAppPermission::whereIn('user_id', $userIds)
            ->where('app_id', $app->id)
            ->delete();
    }
}
