<?php

namespace App\Http\Controllers\Hub;

use App\Http\Controllers\Controller;
use App\Models\AppAccessLog;
use App\Services\AppIntegrationService;
use App\Services\PermissionService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AggregatorController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        protected AppIntegrationService $appIntegration,
        protected PermissionService $permissionService
    ) {}

    /**
     * Display aggregator dashboard
     */
    public function index(Request $request)
    {
        $userApps = $this->permissionService->getUserApps($request->user());

        // Get stats summary from all apps
        $stats = $this->getAggregatedStats($request->user(), $userApps);

        // Get recent activity across all apps
        $recentActivity = $this->getRecentActivity($request->user(), 20);

        return Inertia::render('hub/aggregator/index', [
            'apps' => $userApps,
            'stats' => $stats,
            'recentActivity' => $recentActivity,
        ]);
    }

    /**
     * Get aggregated stats from all permitted apps
     */
    public function stats(Request $request)
    {
        $userApps = $this->permissionService->getUserApps($request->user());
        $stats = $this->getAggregatedStats($request->user(), $userApps);

        return response()->json([
            'success' => true,
            'stats' => $stats,
        ]);
    }

    /**
     * Get aggregated stats for a specific metric
     */
    protected function getAggregatedStats($user, $apps)
    {
        $aggregated = [
            'total_apps' => $apps->count(),
            'online_apps' => 0,
            'offline_apps' => 0,
            'apps_with_errors' => 0,
            'total_data_points' => 0,
            'by_app' => [],
        ];

        foreach ($apps as $app) {
            try {
                // Test if app is online
                if ($this->appIntegration->testConnection($app)) {
                    $aggregated['online_apps']++;

                    // Try to get stats from app
                    try {
                        $stats = $this->appIntegration->getAppStats($user, $app, 'summary');
                        $aggregated['by_app'][$app->id] = [
                            'app_name' => $app->name,
                            'status' => 'online',
                            'stats' => $stats['data'] ?? [],
                        ];

                        // Count data points
                        if (isset($stats['data']) && is_array($stats['data'])) {
                            $aggregated['total_data_points'] += count($stats['data']);
                        }
                    } catch (\Exception $e) {
                        $aggregated['apps_with_errors']++;
                        $aggregated['by_app'][$app->id] = [
                            'app_name' => $app->name,
                            'status' => 'error',
                            'error' => $e->getMessage(),
                        ];
                    }
                } else {
                    $aggregated['offline_apps']++;
                    $aggregated['by_app'][$app->id] = [
                        'app_name' => $app->name,
                        'status' => 'offline',
                    ];
                }
            } catch (\Exception $e) {
                $aggregated['apps_with_errors']++;
                $aggregated['by_app'][$app->id] = [
                    'app_name' => $app->name,
                    'status' => 'error',
                    'error' => $e->getMessage(),
                ];
            }
        }

        return $aggregated;
    }

    /**
     * Get recent activity across all apps
     */
    public function activity(Request $request)
    {
        $limit = $request->input('limit', 20);
        $activity = $this->getRecentActivity($request->user(), $limit);

        return response()->json([
            'success' => true,
            'activity' => $activity,
        ]);
    }

    /**
     * Get recent activity from access logs
     */
    protected function getRecentActivity($user, $limit = 20)
    {
        return AppAccessLog::where('user_id', $user->id)
            ->with('app')
            ->orderBy('created_at', 'desc')
            ->limit($limit)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'app_name' => $log->app->name ?? 'Unknown',
                    'endpoint' => $log->endpoint,
                    'method' => $log->method,
                    'status' => $log->response_code,
                    'success' => $log->wasSuccessful(),
                    'timestamp' => $log->created_at,
                ];
            });
    }

    /**
     * Get cross-app search results
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string',
            'apps' => 'nullable|array',
            'apps.*' => 'exists:apps,id',
        ]);

        $userApps = $this->permissionService->getUserApps($request->user());

        // Filter to specified apps if provided
        if (! empty($validated['apps'])) {
            $userApps = $userApps->whereIn('id', $validated['apps']);
        }

        $results = [];

        foreach ($userApps as $app) {
            try {
                $searchResults = $this->appIntegration->callApp(
                    $request->user(),
                    $app,
                    'search',
                    'GET',
                    ['q' => $validated['query']],
                    ['search:read']
                );

                $results[$app->id] = [
                    'app_name' => $app->name,
                    'results' => $searchResults['data'] ?? [],
                ];
            } catch (\Exception $e) {
                $results[$app->id] = [
                    'app_name' => $app->name,
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'success' => true,
            'results' => $results,
        ]);
    }

    /**
     * Get access logs with filtering
     */
    public function logs(Request $request)
    {
        $validated = $request->validate([
            'app_id' => 'nullable|exists:apps,id',
            'status' => 'nullable|in:success,failed',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'limit' => 'nullable|integer|min:1|max:100',
        ]);

        $query = AppAccessLog::where('user_id', $request->user()->id)
            ->with('app');

        if (! empty($validated['app_id'])) {
            $query->where('app_id', $validated['app_id']);
        }

        if (! empty($validated['status'])) {
            if ($validated['status'] === 'success') {
                $query->where('response_code', '>=', 200)->where('response_code', '<', 300);
            } else {
                $query->where(function ($q) {
                    $q->where('response_code', '<', 200)->orWhere('response_code', '>=', 300);
                });
            }
        }

        if (! empty($validated['from'])) {
            $query->where('created_at', '>=', $validated['from']);
        }

        if (! empty($validated['to'])) {
            $query->where('created_at', '<=', $validated['to']);
        }

        $limit = $validated['limit'] ?? 50;
        $logs = $query->orderBy('created_at', 'desc')->limit($limit)->get();

        return response()->json([
            'success' => true,
            'logs' => $logs,
        ]);
    }

    /**
     * Get analytics summary
     */
    public function analytics(Request $request)
    {
        $validated = $request->validate([
            'app_id' => 'nullable|exists:apps,id',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
        ]);

        $query = AppAccessLog::where('user_id', $request->user()->id);

        if (! empty($validated['app_id'])) {
            $query->where('app_id', $validated['app_id']);
        }

        if (! empty($validated['from'])) {
            $query->where('created_at', '>=', $validated['from']);
        }

        if (! empty($validated['to'])) {
            $query->where('created_at', '<=', $validated['to']);
        }

        $totalRequests = $query->count();
        $successfulRequests = (clone $query)->where('response_code', '>=', 200)->where('response_code', '<', 300)->count();
        $failedRequests = $totalRequests - $successfulRequests;

        $byApp = (clone $query)
            ->selectRaw('app_id, COUNT(*) as total,
                SUM(CASE WHEN response_code >= 200 AND response_code < 300 THEN 1 ELSE 0 END) as successful')
            ->groupBy('app_id')
            ->with('app')
            ->get()
            ->map(function ($stat) {
                return [
                    'app_id' => $stat->app_id,
                    'app_name' => $stat->app->name ?? 'Unknown',
                    'total' => $stat->total,
                    'successful' => $stat->successful,
                    'failed' => $stat->total - $stat->successful,
                    'success_rate' => $stat->total > 0 ? round(($stat->successful / $stat->total) * 100, 2) : 0,
                ];
            });

        return response()->json([
            'success' => true,
            'analytics' => [
                'total_requests' => $totalRequests,
                'successful_requests' => $successfulRequests,
                'failed_requests' => $failedRequests,
                'success_rate' => $totalRequests > 0 ? round(($successfulRequests / $totalRequests) * 100, 2) : 0,
                'by_app' => $byApp,
            ],
        ]);
    }
}
