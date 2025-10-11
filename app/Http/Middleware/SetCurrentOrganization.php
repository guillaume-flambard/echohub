<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetCurrentOrganization
{
    /**
     * Handle an incoming request.
     *
     * This middleware sets the current organization context for the authenticated user.
     * It uses the following priority:
     * 1. Organization ID from request (header or query parameter)
     * 2. Organization ID from session
     * 3. User's first active organization
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()) {
            return $next($request);
        }

        $user = $request->user();

        // Try to get organization ID from request
        $organizationId = $this->getOrganizationIdFromRequest($request);

        // If no organization ID in request, try session
        if (! $organizationId && $request->hasSession()) {
            $organizationId = $request->session()->get('current_organization_id');
        }

        // If still no organization ID, use user's first active organization
        if (! $organizationId) {
            $firstOrg = $user->organizations()
                ->wherePivot('status', 'active')
                ->first();

            $organizationId = $firstOrg?->id;
        }

        // Verify user has access to this organization
        if ($organizationId) {
            $organization = Organization::find($organizationId);

            if ($organization && $user->isActiveInOrganization($organization)) {
                // Set current organization in request
                $request->attributes->set('current_organization', $organization);

                // Store in session for future requests
                if ($request->hasSession()) {
                    $request->session()->put('current_organization_id', $organization->id);
                }

                // Share with views
                view()->share('currentOrganization', $organization);
            }
        }

        return $next($request);
    }

    /**
     * Get organization ID from request (header or query parameter)
     */
    private function getOrganizationIdFromRequest(Request $request): ?int
    {
        // Check X-Organization-ID header
        if ($request->hasHeader('X-Organization-ID')) {
            return (int) $request->header('X-Organization-ID');
        }

        // Check organization_id query parameter
        if ($request->has('organization_id')) {
            return (int) $request->query('organization_id');
        }

        return null;
    }
}
