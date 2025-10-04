<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;

class ExternalApiController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get user information
     * Requires scope: users:read
     */
    public function getUser(Request $request, User $user)
    {
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
            ],
        ]);
    }

    /**
     * Get all users
     * Requires scope: users:read
     */
    public function getUsers(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1|max:100',
            'offset' => 'nullable|integer|min:0',
        ]);

        $query = User::query();

        if (!empty($validated['limit'])) {
            $query->limit($validated['limit']);
        }

        if (!empty($validated['offset'])) {
            $query->offset($validated['offset']);
        }

        $users = $query->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'created_at' => $user->created_at,
            ];
        });

        return response()->json([
            'success' => true,
            'users' => $users,
            'total' => User::count(),
        ]);
    }

    /**
     * Get user's contacts
     * Requires scope: contacts:read
     */
    public function getUserContacts(Request $request, User $user)
    {
        $validated = $request->validate([
            'type' => 'nullable|in:app,human',
        ]);

        $query = Contact::where('user_id', $user->id);

        if (!empty($validated['type'])) {
            $query->where('type', $validated['type']);
        }

        $contacts = $query->with('app')->get();

        return response()->json([
            'success' => true,
            'contacts' => $contacts,
        ]);
    }

    /**
     * Create a new contact for a user
     * Requires scope: contacts:write
     */
    public function createUserContact(Request $request, User $user)
    {
        $validated = $request->validate([
            'type' => 'required|in:app,human',
            'app_id' => 'required_if:type,app|exists:apps,id',
            'matrix_user_id' => 'required_if:type,human|string',
            'name' => 'required|string|max:255',
            'avatar_url' => 'nullable|url',
        ]);

        $contact = Contact::create([
            'user_id' => $user->id,
            'type' => $validated['type'],
            'app_id' => $validated['app_id'] ?? null,
            'matrix_user_id' => $validated['matrix_user_id'] ?? null,
            'name' => $validated['name'],
            'avatar_url' => $validated['avatar_url'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'contact' => $contact,
            'message' => 'Contact created successfully',
        ], 201);
    }

    /**
     * Delete a user's contact
     * Requires scope: contacts:write
     */
    public function deleteUserContact(Request $request, User $user, Contact $contact)
    {
        // Verify contact belongs to user
        if ($contact->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Contact does not belong to this user',
            ], 403);
        }

        $contact->delete();

        return response()->json([
            'success' => true,
            'message' => 'Contact deleted successfully',
        ]);
    }

    /**
     * Health check endpoint
     */
    public function health()
    {
        return response()->json([
            'success' => true,
            'status' => 'online',
            'timestamp' => now(),
        ]);
    }

    /**
     * Get API metadata
     */
    public function metadata()
    {
        return response()->json([
            'success' => true,
            'metadata' => [
                'version' => '1.0.0',
                'name' => 'EchoHub API',
                'description' => 'Multi-app management hub',
            ],
            'capabilities' => [
                'user_management',
                'contact_management',
                'permission_management',
                'app_integration',
            ],
            'scopes' => [
                'users:read' => 'Read user information',
                'users:write' => 'Create and update users',
                'contacts:read' => 'Read user contacts',
                'contacts:write' => 'Create and delete contacts',
                'permissions:read' => 'Read permissions',
                'permissions:write' => 'Grant and revoke permissions',
                'apps:read' => 'Read app information',
                'stats:read' => 'Read statistics',
                'activity:read' => 'Read activity logs',
            ],
        ]);
    }

    /**
     * Search across EchoHub data
     * Requires scope: search:read
     */
    public function search(Request $request)
    {
        $validated = $request->validate([
            'query' => 'required|string|min:2',
            'type' => 'nullable|in:users,contacts',
            'limit' => 'nullable|integer|min:1|max:50',
        ]);

        $query = $validated['query'];
        $type = $validated['type'] ?? 'all';
        $limit = $validated['limit'] ?? 20;

        $results = [];

        // Search users
        if ($type === 'users' || $type === 'all') {
            $users = User::where('name', 'like', "%{$query}%")
                ->orWhere('email', 'like', "%{$query}%")
                ->limit($limit)
                ->get()
                ->map(function ($user) {
                    return [
                        'type' => 'user',
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                    ];
                });

            $results = array_merge($results, $users->toArray());
        }

        // Search contacts
        if ($type === 'contacts' || $type === 'all') {
            $contacts = Contact::where('name', 'like', "%{$query}%")
                ->with('user', 'app')
                ->limit($limit)
                ->get()
                ->map(function ($contact) {
                    return [
                        'type' => 'contact',
                        'id' => $contact->id,
                        'name' => $contact->name,
                        'contact_type' => $contact->type,
                        'user_name' => $contact->user->name ?? null,
                        'app_name' => $contact->app->name ?? null,
                    ];
                });

            $results = array_merge($results, $contacts->toArray());
        }

        return response()->json([
            'success' => true,
            'query' => $query,
            'results' => $results,
            'count' => count($results),
        ]);
    }
}
