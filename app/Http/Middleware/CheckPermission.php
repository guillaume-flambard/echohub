<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * This middleware checks if the authenticated user has a specific permission
     * in the current organization context.
     *
     * Usage in routes:
     * Route::get('/users', [UserController::class, 'index'])
     *     ->middleware('permission:users.view');
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (! $request->user()) {
            abort(401, 'Unauthenticated');
        }

        $organization = $request->attributes->get('current_organization');

        if (! $organization) {
            abort(400, 'No organization context available');
        }

        // Check if user has permission in this organization
        if (! $request->user()->hasPermissionInOrganization($permission, $organization)) {
            return $this->handleUnauthorized($request, $permission);
        }

        return $next($request);
    }

    /**
     * Handle unauthorized access
     */
    private function handleUnauthorized(Request $request, string $permission): Response
    {
        $message = "You don't have permission to perform this action.";

        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message,
                'required_permission' => $permission,
            ], 403);
        }

        abort(403, $message);
    }
}
