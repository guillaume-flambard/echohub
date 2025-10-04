<?php

namespace App\Http\Controllers;

use App\Models\App;
use App\Models\Contact;
use App\Services\MatrixService;
use App\Services\MinervaAI\InstanceManager;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function __construct(
        private InstanceManager $instanceManager,
        private MatrixService $matrixService
    ) {}

    /**
     * Send a message to a contact (app or human)
     */
    public function send(Request $request, Contact $contact)
    {
        $this->authorize('view', $contact);

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $user = Auth::user();

        // If contact is an app, route through Minerva
        if ($contact->isApp()) {
            $app = $contact->app;

            if (!$app) {
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

            if (!$response['success']) {
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
        // TODO: Implement direct Matrix messaging for human contacts
        return response()->json([
            'error' => 'Direct messaging to humans not yet implemented',
        ], 501);
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

            if (!$app) {
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
        // TODO: Implement Matrix message history fetching
        return response()->json([
            'error' => 'History for human contacts not yet implemented',
        ], 501);
    }

    /**
     * Clear conversation history with an app contact
     */
    public function clearHistory(Contact $contact)
    {
        $this->authorize('view', $contact);

        $user = Auth::user();

        if (!$contact->isApp()) {
            return response()->json([
                'error' => 'Can only clear history for app contacts',
            ], 400);
        }

        $app = $contact->app;

        if (!$app) {
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
