<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MatrixService
{
    private string $homeserverUrl;
    private ?string $accessToken;

    public function __construct(?string $accessToken = null)
    {
        $this->homeserverUrl = config('matrix.homeserver_url', 'http://localhost:8008');
        $this->accessToken = $accessToken;
    }

    /**
     * Register a new Matrix user
     */
    public function register(string $username, string $password, bool $admin = false): array
    {
        try {
            $response = Http::post("{$this->homeserverUrl}/_synapse/admin/v1/register", [
                'nonce' => $this->getNonce(),
                'username' => $username,
                'password' => $password,
                'admin' => $admin,
            ]);

            if (!$response->successful()) {
                Log::error('Matrix registration failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return [
                    'success' => false,
                    'error' => 'Registration failed',
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'user_id' => $data['user_id'],
                'access_token' => $data['access_token'],
                'device_id' => $data['device_id'] ?? null,
            ];
        } catch (\Exception $e) {
            Log::error('Matrix registration exception', [
                'message' => $e->getMessage(),
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Login to Matrix
     */
    public function login(string $username, string $password): array
    {
        try {
            $response = Http::post("{$this->homeserverUrl}/_matrix/client/v3/login", [
                'type' => 'm.login.password',
                'identifier' => [
                    'type' => 'm.id.user',
                    'user' => $username,
                ],
                'password' => $password,
            ]);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'error' => 'Login failed',
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'user_id' => $data['user_id'],
                'access_token' => $data['access_token'],
                'device_id' => $data['device_id'],
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Send a message to a room
     */
    public function sendMessage(string $roomId, string $message, string $msgType = 'm.text'): array
    {
        if (!$this->accessToken) {
            return ['success' => false, 'error' => 'No access token'];
        }

        try {
            $txnId = uniqid();
            $response = Http::withToken($this->accessToken)
                ->put("{$this->homeserverUrl}/_matrix/client/v3/rooms/{$roomId}/send/m.room.message/{$txnId}", [
                    'msgtype' => $msgType,
                    'body' => $message,
                ]);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'error' => 'Failed to send message',
                ];
            }

            return [
                'success' => true,
                'event_id' => $response->json('event_id'),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Create or get a direct message room with a user
     */
    public function createDirectRoom(string $userId): array
    {
        if (!$this->accessToken) {
            return ['success' => false, 'error' => 'No access token'];
        }

        try {
            $response = Http::withToken($this->accessToken)
                ->post("{$this->homeserverUrl}/_matrix/client/v3/createRoom", [
                    'is_direct' => true,
                    'invite' => [$userId],
                    'preset' => 'trusted_private_chat',
                ]);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'error' => 'Failed to create room',
                ];
            }

            return [
                'success' => true,
                'room_id' => $response->json('room_id'),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get room messages
     */
    public function getRoomMessages(string $roomId, int $limit = 50, ?string $from = null): array
    {
        if (!$this->accessToken) {
            return ['success' => false, 'error' => 'No access token'];
        }

        try {
            $query = ['limit' => $limit, 'dir' => 'b'];
            if ($from) {
                $query['from'] = $from;
            }

            $response = Http::withToken($this->accessToken)
                ->get("{$this->homeserverUrl}/_matrix/client/v3/rooms/{$roomId}/messages", $query);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'error' => 'Failed to get messages',
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'messages' => $data['chunk'] ?? [],
                'start' => $data['start'] ?? null,
                'end' => $data['end'] ?? null,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get user profile
     */
    public function getUserProfile(string $userId): array
    {
        try {
            $response = Http::get("{$this->homeserverUrl}/_matrix/client/v3/profile/{$userId}");

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'error' => 'Failed to get profile',
                ];
            }

            $data = $response->json();

            return [
                'success' => true,
                'displayname' => $data['displayname'] ?? null,
                'avatar_url' => $data['avatar_url'] ?? null,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Set user profile
     */
    public function setDisplayName(string $userId, string $displayName): array
    {
        if (!$this->accessToken) {
            return ['success' => false, 'error' => 'No access token'];
        }

        try {
            $response = Http::withToken($this->accessToken)
                ->put("{$this->homeserverUrl}/_matrix/client/v3/profile/{$userId}/displayname", [
                    'displayname' => $displayName,
                ]);

            return [
                'success' => $response->successful(),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    /**
     * Get registration nonce for admin registration
     */
    private function getNonce(): string
    {
        $response = Http::get("{$this->homeserverUrl}/_synapse/admin/v1/register");

        return $response->json('nonce', '');
    }

    /**
     * Sync with Matrix server
     */
    public function sync(?string $since = null, int $timeout = 30000): array
    {
        if (!$this->accessToken) {
            return ['success' => false, 'error' => 'No access token'];
        }

        try {
            $query = ['timeout' => $timeout];
            if ($since) {
                $query['since'] = $since;
            }

            $response = Http::withToken($this->accessToken)
                ->timeout(($timeout / 1000) + 10) // Add buffer to HTTP timeout
                ->get("{$this->homeserverUrl}/_matrix/client/v3/sync", $query);

            if (!$response->successful()) {
                return [
                    'success' => false,
                    'error' => 'Sync failed',
                ];
            }

            return [
                'success' => true,
                'data' => $response->json(),
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
