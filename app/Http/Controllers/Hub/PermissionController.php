<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\App;
use App\Models\User;
use App\Services\PermissionService;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PermissionController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected PermissionService $permissionService
    ) {}

    /**
     * Display permissions management page
     */
    public function index(Request $request)
    {
        $userApps = $this->permissionService->getUserApps($request->user());

        return Inertia::render('hub/permissions/index', [
            'userApps' => $userApps->load('permissions'),
        ]);
    }

    /**
     * Show permission details for a specific app
     */
    public function show(Request $request, App $app)
    {
        $permission = $this->permissionService->getPermission($request->user(), $app);

        return Inertia::render('hub/permissions/show', [
            'app' => $app,
            'permission' => $permission,
        ]);
    }

    /**
     * Grant permission to user for an app
     */
    public function grant(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'app_id' => 'required|exists:apps,id',
            'scopes' => 'required|array',
            'scopes.*' => 'string',
            'expires_at' => 'nullable|date|after:now',
        ]);

        try {
            $user = User::findOrFail($validated['user_id']);
            $app = App::findOrFail($validated['app_id']);
            $expiresAt = $validated['expires_at'] ? Carbon::parse($validated['expires_at']) : null;

            $permission = $this->permissionService->grantPermission(
                $user,
                $app,
                $validated['scopes'],
                $expiresAt
            );

            return response()->json([
                'success' => true,
                'permission' => $permission,
                'message' => 'Permission granted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Revoke permission from user for an app
     */
    public function revoke(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'app_id' => 'required|exists:apps,id',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $app = App::findOrFail($validated['app_id']);

        $revoked = $this->permissionService->revokePermission($user, $app);

        return response()->json([
            'success' => $revoked,
            'message' => $revoked ? 'Permission revoked successfully' : 'Permission not found',
        ]);
    }

    /**
     * Add scopes to existing permission
     */
    public function addScopes(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'app_id' => 'required|exists:apps,id',
            'scopes' => 'required|array',
            'scopes.*' => 'string',
        ]);

        try {
            $user = User::findOrFail($validated['user_id']);
            $app = App::findOrFail($validated['app_id']);

            $permission = $this->permissionService->addScopes($user, $app, $validated['scopes']);

            return response()->json([
                'success' => true,
                'permission' => $permission,
                'message' => 'Scopes added successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove scopes from existing permission
     */
    public function removeScopes(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'app_id' => 'required|exists:apps,id',
            'scopes' => 'required|array',
            'scopes.*' => 'string',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $app = App::findOrFail($validated['app_id']);

        $permission = $this->permissionService->removeScopes($user, $app, $validated['scopes']);

        return response()->json([
            'success' => true,
            'permission' => $permission,
            'message' => 'Scopes removed successfully',
        ]);
    }

    /**
     * Extend permission expiration
     */
    public function extend(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'app_id' => 'required|exists:apps,id',
            'expires_at' => 'required|date|after:now',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $app = App::findOrFail($validated['app_id']);
        $expiresAt = Carbon::parse($validated['expires_at']);

        $permission = $this->permissionService->extendPermission($user, $app, $expiresAt);

        return response()->json([
            'success' => true,
            'permission' => $permission,
            'message' => 'Permission extended successfully',
        ]);
    }

    /**
     * Make permission permanent (remove expiration)
     */
    public function makePermanent(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'app_id' => 'required|exists:apps,id',
        ]);

        $user = User::findOrFail($validated['user_id']);
        $app = App::findOrFail($validated['app_id']);

        $permission = $this->permissionService->makePermissionPermanent($user, $app);

        return response()->json([
            'success' => true,
            'permission' => $permission,
            'message' => 'Permission made permanent',
        ]);
    }

    /**
     * Bulk grant permissions
     */
    public function bulkGrant(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'app_id' => 'required|exists:apps,id',
            'scopes' => 'required|array',
            'scopes.*' => 'string',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $app = App::findOrFail($validated['app_id']);
        $expiresAt = $validated['expires_at'] ? Carbon::parse($validated['expires_at']) : null;

        $permissions = $this->permissionService->bulkGrantPermissions(
            $validated['user_ids'],
            $app,
            $validated['scopes'],
            $expiresAt
        );

        return response()->json([
            'success' => true,
            'permissions' => $permissions,
            'message' => "Granted permissions to {$permissions->count()} users",
        ]);
    }

    /**
     * Bulk revoke permissions
     */
    public function bulkRevoke(Request $request)
    {
        $validated = $request->validate([
            'user_ids' => 'required|array',
            'user_ids.*' => 'exists:users,id',
            'app_id' => 'required|exists:apps,id',
        ]);

        $app = App::findOrFail($validated['app_id']);

        $count = $this->permissionService->bulkRevokePermissions($validated['user_ids'], $app);

        return response()->json([
            'success' => true,
            'message' => "Revoked permissions from {$count} users",
        ]);
    }

    /**
     * Get all users with permission to an app
     */
    public function appUsers(Request $request, App $app)
    {
        $users = $this->permissionService->getAppUsers($app, $request->input('only_valid', true));

        return response()->json([
            'success' => true,
            'users' => $users,
        ]);
    }

    /**
     * Get all apps a user has permission to
     */
    public function userApps(Request $request, User $user)
    {
        $apps = $this->permissionService->getUserApps($user, $request->input('only_valid', true));

        return response()->json([
            'success' => true,
            'apps' => $apps,
        ]);
    }

    /**
     * Get expired permissions
     */
    public function expired()
    {
        $permissions = $this->permissionService->getExpiredPermissions();

        return response()->json([
            'success' => true,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Cleanup expired permissions
     */
    public function cleanup()
    {
        $count = $this->permissionService->cleanupExpiredPermissions();

        return response()->json([
            'success' => true,
            'message' => "Cleaned up {$count} expired permissions",
        ]);
    }
}
