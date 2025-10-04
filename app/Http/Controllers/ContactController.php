<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    use AuthorizesRequests;

    /**
     * Get all contacts for the authenticated user
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Contact::where('user_id', $user->id)
            ->with('app');

        // Filter by type if provided
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        $contacts = $query->orderBy('name')->get();

        return response()->json([
            'contacts' => $contacts,
        ]);
    }

    /**
     * Get a specific contact
     */
    public function show(Contact $contact)
    {
        $this->authorize('view', $contact);

        $contact->load('app');

        return response()->json([
            'contact' => $contact,
        ]);
    }

    /**
     * Create a new contact
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'matrix_id' => 'required|string',
            'type' => 'required|in:app,human',
            'app_id' => 'nullable|exists:apps,id',
            'name' => 'required|string|max:255',
            'avatar' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $contact = Contact::create([
            'user_id' => Auth::id(),
            ...$validated,
        ]);

        $contact->load('app');

        return response()->json([
            'contact' => $contact,
        ], 201);
    }

    /**
     * Update a contact
     */
    public function update(Request $request, Contact $contact)
    {
        $this->authorize('update', $contact);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'avatar' => 'nullable|string',
            'metadata' => 'nullable|array',
        ]);

        $contact->update($validated);

        return response()->json([
            'contact' => $contact,
        ]);
    }

    /**
     * Delete a contact
     */
    public function destroy(Contact $contact)
    {
        $this->authorize('delete', $contact);

        $contact->delete();

        return response()->json([
            'message' => 'Contact deleted successfully',
        ]);
    }
}
