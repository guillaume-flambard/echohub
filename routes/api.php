<?php

use App\Http\Controllers\AISettingController;
use App\Http\Controllers\Api\ExternalApiController;
use App\Http\Controllers\Api\ServiceAccountController;
use App\Http\Controllers\AppController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activity', [DashboardController::class, 'recentActivity']);
    Route::get('/dashboard/trends', [DashboardController::class, 'bookingTrends']);

    // Contacts
    Route::get('/contacts', [ContactController::class, 'index']);
    Route::post('/contacts', [ContactController::class, 'store']);
    Route::get('/contacts/{contact}', [ContactController::class, 'show']);
    Route::put('/contacts/{contact}', [ContactController::class, 'update']);
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy']);

    // Apps
    Route::get('/apps', [AppController::class, 'index']);
    Route::post('/apps', [AppController::class, 'store']);
    Route::get('/apps/{app}', [AppController::class, 'show']);
    Route::put('/apps/{app}', [AppController::class, 'update']);
    Route::delete('/apps/{app}', [AppController::class, 'destroy']);
    Route::post('/apps/{app}/status', [AppController::class, 'updateStatus']);

    // Messages
    Route::post('/contacts/{contact}/messages', [MessageController::class, 'send']);
    Route::get('/contacts/{contact}/messages', [MessageController::class, 'history']);
    Route::delete('/contacts/{contact}/messages', [MessageController::class, 'clearHistory']);

    // AI Settings
    Route::get('/ai-settings', [AISettingController::class, 'index']);
    Route::put('/ai-settings', [AISettingController::class, 'update']);
    Route::get('/ai-settings/models', [AISettingController::class, 'availableModels']);

    // Service Account Management (Admin only)
    Route::prefix('service-accounts')->name('api.service-accounts.')->group(function () {
        Route::get('/', [ServiceAccountController::class, 'index'])->name('index');
        Route::post('/', [ServiceAccountController::class, 'store'])->name('store');
        Route::get('/{serviceAccount}', [ServiceAccountController::class, 'show'])->name('show');
        Route::put('/{serviceAccount}', [ServiceAccountController::class, 'update'])->name('update');
        Route::delete('/{serviceAccount}', [ServiceAccountController::class, 'destroy'])->name('destroy');
        Route::post('/{serviceAccount}/rotate', [ServiceAccountController::class, 'rotateKey'])->name('rotate');
        Route::post('/{serviceAccount}/activate', [ServiceAccountController::class, 'activate'])->name('activate');
        Route::post('/{serviceAccount}/deactivate', [ServiceAccountController::class, 'deactivate'])->name('deactivate');
    });
});

/*
|--------------------------------------------------------------------------
| External API Routes (Service Account Authentication)
|--------------------------------------------------------------------------
|
| Routes for external apps to call EchoHub using service account API keys.
| These routes are protected by the service.account middleware.
|
*/

Route::prefix('external')->middleware(['service.account'])->name('api.external.')->group(function () {
    // Health check (no scope required)
    Route::get('/health', [ExternalApiController::class, 'health'])->name('health');

    // Metadata (no scope required)
    Route::get('/metadata', [ExternalApiController::class, 'metadata'])->name('metadata');

    // Verify service account (no scope required)
    Route::get('/verify', [ServiceAccountController::class, 'verify'])->name('verify');

    // User endpoints (require users:read scope)
    Route::middleware(['service.account.scope:users:read'])->group(function () {
        Route::get('/users', [ExternalApiController::class, 'getUsers'])->name('users.index');
        Route::get('/users/{user}', [ExternalApiController::class, 'getUser'])->name('users.show');
    });

    // Contact endpoints
    Route::prefix('users/{user}/contacts')->name('contacts.')->group(function () {
        Route::get('/', [ExternalApiController::class, 'getUserContacts'])
            ->middleware(['service.account.scope:contacts:read'])
            ->name('index');

        Route::post('/', [ExternalApiController::class, 'createUserContact'])
            ->middleware(['service.account.scope:contacts:write'])
            ->name('store');

        Route::delete('/{contact}', [ExternalApiController::class, 'deleteUserContact'])
            ->middleware(['service.account.scope:contacts:write'])
            ->name('destroy');
    });

    // Search endpoint (require search:read scope)
    Route::get('/search', [ExternalApiController::class, 'search'])
        ->middleware(['service.account.scope:search:read'])
        ->name('search');
});
