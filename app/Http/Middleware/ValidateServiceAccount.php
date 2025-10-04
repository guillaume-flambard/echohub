<?php

namespace App\Http\Middleware;

use App\Models\ServiceAccount;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateServiceAccount
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $apiKey = $request->bearerToken();

        if (!$apiKey) {
            return response()->json([
                'message' => 'No API key provided',
            ], 401);
        }

        // Find service account by API key
        $serviceAccount = ServiceAccount::where('api_key', $apiKey)->first();

        if (!$serviceAccount) {
            return response()->json([
                'message' => 'Invalid API key',
            ], 401);
        }

        // Check if service account is active
        if (!$serviceAccount->is_active) {
            return response()->json([
                'message' => 'Service account is inactive',
            ], 403);
        }

        // Check if service account has expired
        if ($serviceAccount->isExpired()) {
            return response()->json([
                'message' => 'Service account has expired',
            ], 403);
        }

        // Check if service account is valid
        if (!$serviceAccount->isValid()) {
            return response()->json([
                'message' => 'Service account is not valid',
            ], 403);
        }

        // Add service account to request for later use
        $request->merge(['service_account' => $serviceAccount]);

        return $next($request);
    }
}
