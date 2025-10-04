<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\App;
use App\Services\AppIntegrationService;
use App\Services\PermissionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AppManagementController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected AppIntegrationService $appIntegration,
        protected PermissionService $permissionService
    ) {}

    /**
     * Display list of all apps
     */
    public function index(Request $request)
    {
        $apps = App::with(['permissions' => function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        }])->get();

        return Inertia::render('hub/apps/index', [
            'apps' => $apps,
        ]);
    }

    /**
     * Show app details
     */
    public function show(Request $request, App $app)
    {
        $permission = $this->permissionService->getPermission($request->user(), $app);

        return Inertia::render('hub/apps/show', [
            'app' => $app,
            'permission' => $permission,
            'hasPermission' => $permission && $permission->isValid(),
        ]);
    }

    /**
     * Show form to create new app
     */
    public function create()
    {
        return Inertia::render('hub/apps/create');
    }

    /**
     * Store a new app
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'app_url' => 'required|url',
            'service_api_key' => 'required|string',
            'description' => 'nullable|string',
            'available_scopes' => 'required|array',
            'available_scopes.*' => 'string',
            'capabilities' => 'nullable|array',
            'capabilities.*' => 'string',
        ]);

        $validated['status'] = 'offline'; // Will be updated after health check

        $app = App::create($validated);

        // Test connection
        $isOnline = $this->appIntegration->testConnection($app);
        $app->update(['status' => $isOnline ? 'online' : 'offline']);

        // Sync app metadata
        if ($isOnline) {
            $this->appIntegration->syncAppMetadata($app);
        }

        return redirect()->route('hub.apps.show', $app)
            ->with('success', 'App registered successfully');
    }

    /**
     * Show form to edit app
     */
    public function edit(App $app)
    {
        return Inertia::render('hub/apps/edit', [
            'app' => $app,
        ]);
    }

    /**
     * Update app
     */
    public function update(Request $request, App $app)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|max:255',
            'app_url' => 'required|url',
            'service_api_key' => 'nullable|string',
            'description' => 'nullable|string',
            'available_scopes' => 'required|array',
            'available_scopes.*' => 'string',
            'capabilities' => 'nullable|array',
            'capabilities.*' => 'string',
        ]);

        // Only update API key if provided
        if (empty($validated['service_api_key'])) {
            unset($validated['service_api_key']);
        }

        $app->update($validated);

        return redirect()->route('hub.apps.show', $app)
            ->with('success', 'App updated successfully');
    }

    /**
     * Delete app
     */
    public function destroy(App $app)
    {
        $app->delete();

        return redirect()->route('hub.apps.index')
            ->with('success', 'App deleted successfully');
    }

    /**
     * Test app connection
     */
    public function testConnection(App $app)
    {
        $isOnline = $this->appIntegration->testConnection($app);
        $app->update(['status' => $isOnline ? 'online' : 'offline']);

        return response()->json([
            'success' => $isOnline,
            'status' => $app->status,
            'message' => $isOnline ? 'Connection successful' : 'Connection failed',
        ]);
    }

    /**
     * Sync app metadata
     */
    public function syncMetadata(App $app)
    {
        $this->appIntegration->syncAppMetadata($app);

        return response()->json([
            'success' => true,
            'app' => $app->fresh(),
            'message' => 'Metadata synced successfully',
        ]);
    }

    /**
     * Get app stats
     */
    public function stats(Request $request, App $app)
    {
        try {
            $statsType = $request->input('type', 'summary');
            $stats = $this->appIntegration->getAppStats($request->user(), $app, $statsType);

            return response()->json([
                'success' => true,
                'stats' => $stats['data'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get app recent activity
     */
    public function activity(Request $request, App $app)
    {
        try {
            $limit = $request->input('limit', 10);
            $activity = $this->appIntegration->getRecentActivity($request->user(), $app, $limit);

            return response()->json([
                'success' => true,
                'activity' => $activity['data'],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
