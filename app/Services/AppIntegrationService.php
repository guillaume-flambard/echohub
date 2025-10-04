<?php

namespace App\Services;

use App\Models\App;
use App\Models\AppAccessLog;
use App\Models\HubAppPermission;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AppIntegrationService
{
    /**
     * Call an external app API endpoint
     *
     * @param User $user
     * @param App $app
     * @param string $endpoint
     * @param string $method
     * @param array $data
     * @param array $requiredScopes
     * @return array
     * @throws \Exception
     */
    public function callApp(
        User $user,
        App $app,
        string $endpoint,
        string $method = 'GET',
        array $data = [],
        array $requiredScopes = []
    ): array {
        // Check if user has permission to access this app
        $permission = HubAppPermission::where('user_id', $user->id)
            ->where('app_id', $app->id)
            ->first();

        if (!$permission || !$permission->isValid()) {
            throw new \Exception('User does not have permission to access this app');
        }

        // Check if user has all required scopes
        foreach ($requiredScopes as $scope) {
            if (!$permission->hasScope($scope)) {
                throw new \Exception("User does not have required scope: {$scope}");
            }
        }

        // Check if app is online
        if (!$app->isOnline()) {
            throw new \Exception('App is currently offline');
        }

        // Build full URL
        $url = $app->getApiUrl($endpoint);

        // Make the API call
        try {
            $response = $this->makeRequest($app, $url, $method, $data);

            // Log successful access
            $this->logAccess($user, $app, $endpoint, $method, $data, $response['status'], $response['data']);

            return $response;
        } catch (\Exception $e) {
            // Log failed access
            $this->logAccess($user, $app, $endpoint, $method, $data, 500, ['error' => $e->getMessage()]);

            throw $e;
        }
    }

    /**
     * Make HTTP request to external app
     *
     * @param App $app
     * @param string $url
     * @param string $method
     * @param array $data
     * @return array
     */
    protected function makeRequest(App $app, string $url, string $method, array $data): array
    {
        $request = Http::timeout(30)
            ->withHeaders([
                'Authorization' => 'Bearer ' . $app->service_api_key,
                'Accept' => 'application/json',
            ])
            ->retry(3, 100); // Retry 3 times with 100ms delay

        $response = match (strtoupper($method)) {
            'GET' => $request->get($url, $data),
            'POST' => $request->post($url, $data),
            'PUT' => $request->put($url, $data),
            'PATCH' => $request->patch($url, $data),
            'DELETE' => $request->delete($url, $data),
            default => throw new \Exception("Unsupported HTTP method: {$method}"),
        };

        if ($response->failed()) {
            throw new \Exception(
                "App API request failed: {$response->status()} - {$response->body()}"
            );
        }

        return [
            'status' => $response->status(),
            'data' => $response->json(),
        ];
    }

    /**
     * Log API access for audit trail
     *
     * @param User $user
     * @param App $app
     * @param string $endpoint
     * @param string $method
     * @param array $requestData
     * @param int $responseCode
     * @param array $responseData
     * @return void
     */
    protected function logAccess(
        User $user,
        App $app,
        string $endpoint,
        string $method,
        array $requestData,
        int $responseCode,
        array $responseData
    ): void {
        AppAccessLog::create([
            'user_id' => $user->id,
            'app_id' => $app->id,
            'endpoint' => $endpoint,
            'method' => $method,
            'response_code' => $responseCode,
            'request_data' => $requestData,
            'response_data' => $responseData,
        ]);
    }

    /**
     * Get aggregated stats from an app
     *
     * @param User $user
     * @param App $app
     * @param string $statsType
     * @return array
     */
    public function getAppStats(User $user, App $app, string $statsType = 'summary'): array
    {
        $endpoint = match ($statsType) {
            'summary' => 'stats/summary',
            'bookings' => 'stats/bookings',
            'users' => 'stats/users',
            'revenue' => 'stats/revenue',
            default => "stats/{$statsType}",
        };

        $requiredScopes = ["stats:read"];

        return $this->callApp($user, $app, $endpoint, 'GET', [], $requiredScopes);
    }

    /**
     * Get recent activity from an app
     *
     * @param User $user
     * @param App $app
     * @param int $limit
     * @return array
     */
    public function getRecentActivity(User $user, App $app, int $limit = 10): array
    {
        return $this->callApp(
            $user,
            $app,
            'activity/recent',
            'GET',
            ['limit' => $limit],
            ['activity:read']
        );
    }

    /**
     * Test connection to an app
     *
     * @param App $app
     * @return bool
     */
    public function testConnection(App $app): bool
    {
        try {
            $url = $app->getApiUrl('health');
            $response = Http::timeout(5)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $app->service_api_key,
                    'Accept' => 'application/json',
                ])
                ->get($url);

            return $response->successful();
        } catch (\Exception $e) {
            Log::error("App connection test failed for {$app->name}: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Sync app metadata (capabilities, scopes, etc.)
     *
     * @param App $app
     * @return void
     */
    public function syncAppMetadata(App $app): void
    {
        try {
            $url = $app->getApiUrl('metadata');
            $response = Http::timeout(10)
                ->withHeaders([
                    'Authorization' => 'Bearer ' . $app->service_api_key,
                    'Accept' => 'application/json',
                ])
                ->get($url);

            if ($response->successful()) {
                $metadata = $response->json();

                $app->update([
                    'capabilities' => $metadata['capabilities'] ?? $app->capabilities,
                    'available_scopes' => $metadata['scopes'] ?? $app->available_scopes,
                    'metadata' => array_merge($app->metadata ?? [], $metadata['metadata'] ?? []),
                ]);
            }
        } catch (\Exception $e) {
            Log::error("Failed to sync app metadata for {$app->name}: {$e->getMessage()}");
        }
    }
}
