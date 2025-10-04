<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Str;

class MatrixAuthService
{
    public function __construct(
        private MatrixService $matrixService
    ) {}

    /**
     * Provision a Matrix account for a Laravel user
     */
    public function provisionMatrixUser(User $user): array
    {
        // Generate Matrix username from email or name
        $matrixUsername = $this->generateMatrixUsername($user);

        // Generate a secure password
        $password = Str::random(32);

        // Register the user on Matrix
        $result = $this->matrixService->register($matrixUsername, $password, false);

        if (! $result['success']) {
            return $result;
        }

        // Set display name to match Laravel user
        $matrixService = new MatrixService($result['access_token']);
        $matrixService->setDisplayName($result['user_id'], $user->name);

        // Store Matrix credentials in user's record
        // Note: You may want to add matrix_id, matrix_access_token, matrix_device_id columns to users table
        // For now, we'll just return the credentials
        return [
            'success' => true,
            'matrix_id' => $result['user_id'],
            'access_token' => $result['access_token'],
            'device_id' => $result['device_id'],
        ];
    }

    /**
     * Login existing Matrix user
     */
    public function loginMatrixUser(User $user, string $password): array
    {
        $matrixUsername = $this->generateMatrixUsername($user);

        return $this->matrixService->login($matrixUsername, $password);
    }

    /**
     * Generate Matrix username from Laravel user
     */
    private function generateMatrixUsername(User $user): string
    {
        // Use email local part or sanitized name
        $username = Str::before($user->email, '@');
        $username = Str::slug($username, '_');
        $username = Str::lower($username);

        // Remove any invalid characters
        $username = preg_replace('/[^a-z0-9_\-\.]/', '', $username);

        return $username;
    }

    /**
     * Get or create Matrix account for user
     */
    public function getOrCreateMatrixAccount(User $user): array
    {
        // TODO: Check if user already has a Matrix account stored
        // For now, we'll attempt to provision
        return $this->provisionMatrixUser($user);
    }
}
