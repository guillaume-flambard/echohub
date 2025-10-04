<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ServiceAccount;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class ServiceAccountController extends Controller
{
    use AuthorizesRequests;

    /**
     * List all service accounts
     */
    public function index(Request $request)
    {
        $query = ServiceAccount::query();

        // Filter by active status
        if ($request->has('active')) {
            $query->where('is_active', $request->boolean('active'));
        }

        // Filter by expiration
        if ($request->has('expired')) {
            if ($request->boolean('expired')) {
                $query->whereNotNull('expires_at')->where('expires_at', '<=', now());
            } else {
                $query->where(function ($q) {
                    $q->whereNull('expires_at')->orWhere('expires_at', '>', now());
                });
            }
        }

        $serviceAccounts = $query->orderBy('created_at', 'desc')->get();

        return response()->json([
            'success' => true,
            'service_accounts' => $serviceAccounts,
        ]);
    }

    /**
     * Create a new service account
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'scopes' => 'required|array',
            'scopes.*' => 'string',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $apiKey = ServiceAccount::generateApiKey();

        $serviceAccount = ServiceAccount::create([
            'name' => $validated['name'],
            'api_key' => $apiKey,
            'scopes' => $validated['scopes'],
            'expires_at' => $validated['expires_at'] ? Carbon::parse($validated['expires_at']) : null,
            'is_active' => true,
        ]);

        return response()->json([
            'success' => true,
            'service_account' => $serviceAccount,
            'api_key' => $apiKey, // Only returned once!
            'message' => 'Service account created. Save the API key - it will not be shown again.',
        ], 201);
    }

    /**
     * Show service account details
     */
    public function show(ServiceAccount $serviceAccount)
    {
        return response()->json([
            'success' => true,
            'service_account' => $serviceAccount,
        ]);
    }

    /**
     * Update service account
     */
    public function update(Request $request, ServiceAccount $serviceAccount)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'scopes' => 'sometimes|array',
            'scopes.*' => 'string',
            'expires_at' => 'nullable|date|after:now',
            'is_active' => 'sometimes|boolean',
        ]);

        $serviceAccount->update($validated);

        return response()->json([
            'success' => true,
            'service_account' => $serviceAccount->fresh(),
            'message' => 'Service account updated successfully',
        ]);
    }

    /**
     * Delete service account
     */
    public function destroy(ServiceAccount $serviceAccount)
    {
        $serviceAccount->delete();

        return response()->json([
            'success' => true,
            'message' => 'Service account deleted successfully',
        ]);
    }

    /**
     * Rotate API key
     */
    public function rotateKey(ServiceAccount $serviceAccount)
    {
        $newKey = $serviceAccount->rotateKey();

        return response()->json([
            'success' => true,
            'api_key' => $newKey,
            'message' => 'API key rotated. Save the new key - it will not be shown again.',
        ]);
    }

    /**
     * Activate service account
     */
    public function activate(ServiceAccount $serviceAccount)
    {
        $serviceAccount->activate();

        return response()->json([
            'success' => true,
            'service_account' => $serviceAccount->fresh(),
            'message' => 'Service account activated',
        ]);
    }

    /**
     * Deactivate service account
     */
    public function deactivate(ServiceAccount $serviceAccount)
    {
        $serviceAccount->deactivate();

        return response()->json([
            'success' => true,
            'service_account' => $serviceAccount->fresh(),
            'message' => 'Service account deactivated',
        ]);
    }

    /**
     * Verify current service account (for testing)
     */
    public function verify(Request $request)
    {
        $serviceAccount = $request->get('service_account');

        return response()->json([
            'success' => true,
            'service_account' => $serviceAccount,
            'valid' => $serviceAccount->isValid(),
            'message' => 'Service account is valid',
        ]);
    }
}
