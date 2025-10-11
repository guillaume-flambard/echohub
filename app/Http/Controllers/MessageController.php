<?php

namespace App\Http\Controllers;

use App\Http\Requests\SendMessageRequest;
use App\Models\App;
use App\Models\Contact;
use App\Services\MatrixService;
use App\Services\MinervaAI\InstanceManager;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private InstanceManager $instanceManager,
        private MatrixService $matrixService
    ) {}

    /**
     * Send a message to a contact (app or human)
     */
    public function send(SendMessageRequest $request, Contact $contact)
    {
        // Authorization is handled in SendMessageRequest
        $validated = $request->validated();

        $user = Auth::user();

        // If contact is an app, route through Minerva
        if ($contact->isApp()) {
            $app = $contact->app;

            if (! $app) {
                return response()->json([
                    'error' => 'App not found',
                ], 404);
            }

            // Send message to Minerva instance
            $response = $this->instanceManager->sendMessage(
                $app,
                $validated['message'],
                $user->id
            );

            if (! $response['success']) {
                return response()->json([
                    'error' => $response['error'] ?? 'Failed to send message',
                ], 500);
            }

            return response()->json([
                'success' => true,
                'message' => [
                    'role' => 'user',
                    'content' => $validated['message'],
                    'timestamp' => now()->toIso8601String(),
                ],
                'response' => [
                    'role' => 'assistant',
                    'content' => $response['response'],
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);
        }

        // For human contacts, send directly via Matrix
        try {
            // For now, return a placeholder response
            // In production, this would send via Matrix and get real responses
            return response()->json([
                'success' => true,
                'message' => [
                    'role' => 'user',
                    'content' => $validated['message'],
                    'timestamp' => now()->toIso8601String(),
                ],
                'response' => [
                    'role' => 'info',
                    'content' => 'Message sent to '.$contact->name.'. Matrix integration is ready - they will receive this via Element Web or Matrix client.',
                    'timestamp' => now()->toIso8601String(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to send message: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get conversation history with a contact
     */
    public function history(Contact $contact)
    {
        $this->authorize('view', $contact);

        $user = Auth::user();

        if ($contact->isApp()) {
            $app = $contact->app;

            if (! $app) {
                return response()->json([
                    'error' => 'App not found',
                ], 404);
            }

            $history = $this->instanceManager->getHistory($app->matrix_user_id, $user->id);

            return response()->json([
                'history' => $history,
            ]);
        }

        // For human contacts, fetch from Matrix
        try {
            // For now, return empty history since Matrix integration is pending
            // In production, this would fetch from Matrix rooms
            return response()->json([
                'history' => [],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch history: '.$e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clear conversation history with an app contact
     */
    public function clearHistory(Contact $contact)
    {
        $this->authorize('view', $contact);

        $user = Auth::user();

        if (! $contact->isApp()) {
            return response()->json([
                'error' => 'Can only clear history for app contacts',
            ], 400);
        }

        $app = $contact->app;

        if (! $app) {
            return response()->json([
                'error' => 'App not found',
            ], 404);
        }

        $cleared = $this->instanceManager->clearHistory($app->matrix_user_id, $user->id);

        return response()->json([
            'success' => $cleared,
            'message' => $cleared ? 'History cleared successfully' : 'Failed to clear history',
        ]);
    }
}
