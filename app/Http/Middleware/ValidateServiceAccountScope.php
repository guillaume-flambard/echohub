<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateServiceAccountScope
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$scopes
     */
    public function handle(Request $request, Closure $next, string ...$scopes): Response
    {
        $serviceAccount = $request->get('service_account');

        if (!$serviceAccount) {
            return response()->json([
                'message' => 'Service account not found in request',
            ], 401);
        }

        // Check if service account has all required scopes
        foreach ($scopes as $scope) {
            if (!$serviceAccount->hasScope($scope)) {
                return response()->json([
                    'message' => "Missing required scope: {$scope}",
                ], 403);
            }
        }

        return $next($request);
    }
}
