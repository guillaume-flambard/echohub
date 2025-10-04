<?php

namespace App\Http\Controllers;

use App\Models\App;
use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppController extends Controller
{
    /**
     * Get all apps
     */
    public function index()
    {
        $apps = App::orderBy('name')->get();

        return response()->json([
            'apps' => $apps,
        ]);
    }

    /**
     * Get a specific app
     */
    public function show(App $app)
    {
        return response()->json([
            'app' => $app,
        ]);
    }

    /**
     * Create a new app
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'domain' => 'required|string|unique:apps,domain',
            'matrix_user_id' => 'required|string|unique:apps,matrix_user_id',
            'capabilities' => 'nullable|array',
            'api_config' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);

        $app = App::create($validated);

        // Automatically create a contact for this app for the authenticated user
        Contact::create([
            'user_id' => Auth::id(),
            'matrix_id' => $app->matrix_user_id,
            'type' => 'app',
            'app_id' => $app->id,
            'name' => $app->name,
        ]);

        return response()->json([
            'app' => $app,
        ], 201);
    }

    /**
     * Update an app
     */
    public function update(Request $request, App $app)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'domain' => 'sometimes|string|unique:apps,domain,'.$app->id,
            'status' => 'sometimes|in:online,offline,degraded',
            'capabilities' => 'nullable|array',
            'api_config' => 'nullable|array',
            'metadata' => 'nullable|array',
        ]);

        $app->update($validated);

        // Update the contact name if app name changed
        if (isset($validated['name'])) {
            Contact::where('app_id', $app->id)->update(['name' => $validated['name']]);
        }

        return response()->json([
            'app' => $app,
        ]);
    }

    /**
     * Delete an app
     */
    public function destroy(App $app)
    {
        $app->delete();

        return response()->json([
            'message' => 'App deleted successfully',
        ]);
    }

    /**
     * Update app status
     */
    public function updateStatus(Request $request, App $app)
    {
        $validated = $request->validate([
            'status' => 'required|in:online,offline,degraded',
        ]);

        $app->update(['status' => $validated['status']]);

        return response()->json([
            'app' => $app,
        ]);
    }
}
