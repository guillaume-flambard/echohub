<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequest;
use App\Http\Requests\UpdateContactRequest;
use App\Http\Resources\ContactResource;
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

        return ContactResource::collection($contacts);
    }

    /**
     * Get a specific contact
     */
    public function show(Contact $contact)
    {
        $this->authorize('view', $contact);

        $contact->load('app');

        return ContactResource::make($contact);
    }

    /**
     * Create a new contact
     */
    public function store(StoreContactRequest $request)
    {
        // Authorization and validation handled in StoreContactRequest
        $validated = $request->validated();

        $contact = Contact::create([
            'user_id' => Auth::id(),
            ...$validated,
        ]);

        $contact->load('app');

        return ContactResource::make($contact)
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Update a contact
     */
    public function update(UpdateContactRequest $request, Contact $contact)
    {
        // Authorization and validation handled in UpdateContactRequest
        $validated = $request->validated();

        $contact->update($validated);

        return ContactResource::make($contact);
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
