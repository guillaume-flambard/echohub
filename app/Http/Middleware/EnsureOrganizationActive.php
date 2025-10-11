<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureOrganizationActive
{
    /**
     * Handle an incoming request.
     *
     * This middleware ensures the current organization is active and not suspended.
     * It also checks subscription limits and trial expiration.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $organization = $request->attributes->get('current_organization');

        if (! $organization) {
            return response()->json([
                'message' => 'No organization context available.',
            ], 400);
        }

        // Check if organization is active
        if (! $organization->isActive()) {
            return $this->handleInactiveOrganization($request, $organization);
        }

        // Check if trial has expired
        if ($organization->isOnTrial() && $organization->trial_ends_at && $organization->trial_ends_at->isPast()) {
            return $this->handleExpiredTrial($request, $organization);
        }

        return $next($request);
    }

    /**
     * Handle inactive organization
     */
    private function handleInactiveOrganization(Request $request, $organization): Response
    {
        $message = 'Your organization is currently inactive.';

        if ($organization->status === 'suspended') {
            $message = 'Your organization has been suspended. Please contact support or update your billing information.';
        }

        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message,
                'status' => $organization->status,
                'organization_id' => $organization->id,
            ], 403);
        }

        return redirect()->route('settings.billing')
            ->with('error', $message);
    }

    /**
     * Handle expired trial
     */
    private function handleExpiredTrial(Request $request, $organization): Response
    {
        $message = 'Your trial period has expired. Please upgrade to continue using EchoHub.';

        if ($request->expectsJson()) {
            return response()->json([
                'message' => $message,
                'status' => 'trial_expired',
                'trial_ends_at' => $organization->trial_ends_at,
                'organization_id' => $organization->id,
            ], 402); // 402 Payment Required
        }

        return redirect()->route('settings.billing')
            ->with('warning', $message);
    }
}
