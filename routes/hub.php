<?php

use App\Http\Controllers\Hub\AggregatorController;
use App\Http\Controllers\Hub\AppManagementController;
use App\Http\Controllers\Hub\PermissionController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Hub Management Routes
|--------------------------------------------------------------------------
|
| Multi-app management hub routes for app registration, permissions,
| and data aggregation across connected applications.
|
*/

Route::middleware(['auth', 'verified'])->prefix('hub')->name('hub.')->group(function () {
    // App Management Routes
    Route::prefix('apps')->name('apps.')->group(function () {
        Route::get('/', [AppManagementController::class, 'index'])->name('index');
        Route::get('/create', [AppManagementController::class, 'create'])->name('create');
        Route::post('/', [AppManagementController::class, 'store'])->name('store');
        Route::get('/{app}', [AppManagementController::class, 'show'])->name('show');
        Route::get('/{app}/edit', [AppManagementController::class, 'edit'])->name('edit');
        Route::put('/{app}', [AppManagementController::class, 'update'])->name('update');
        Route::delete('/{app}', [AppManagementController::class, 'destroy'])->name('destroy');

        // App Actions
        Route::post('/{app}/test-connection', [AppManagementController::class, 'testConnection'])->name('test-connection');
        Route::post('/{app}/sync-metadata', [AppManagementController::class, 'syncMetadata'])->name('sync-metadata');
        Route::get('/{app}/stats', [AppManagementController::class, 'stats'])->name('stats');
        Route::get('/{app}/activity', [AppManagementController::class, 'activity'])->name('activity');
    });

    // Permission Management Routes
    Route::prefix('permissions')->name('permissions.')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('index');
        Route::get('/{app}', [PermissionController::class, 'show'])->name('show');

        // Grant/Revoke Permissions
        Route::post('/grant', [PermissionController::class, 'grant'])->name('grant');
        Route::post('/revoke', [PermissionController::class, 'revoke'])->name('revoke');

        // Scope Management
        Route::post('/add-scopes', [PermissionController::class, 'addScopes'])->name('add-scopes');
        Route::post('/remove-scopes', [PermissionController::class, 'removeScopes'])->name('remove-scopes');

        // Expiration Management
        Route::post('/extend', [PermissionController::class, 'extend'])->name('extend');
        Route::post('/make-permanent', [PermissionController::class, 'makePermanent'])->name('make-permanent');

        // Bulk Operations
        Route::post('/bulk-grant', [PermissionController::class, 'bulkGrant'])->name('bulk-grant');
        Route::post('/bulk-revoke', [PermissionController::class, 'bulkRevoke'])->name('bulk-revoke');

        // Queries
        Route::get('/app/{app}/users', [PermissionController::class, 'appUsers'])->name('app-users');
        Route::get('/user/{user}/apps', [PermissionController::class, 'userApps'])->name('user-apps');
        Route::get('/expired', [PermissionController::class, 'expired'])->name('expired');

        // Cleanup
        Route::post('/cleanup', [PermissionController::class, 'cleanup'])->name('cleanup');
    });

    // Aggregator/Dashboard Routes
    Route::prefix('aggregator')->name('aggregator.')->group(function () {
        Route::get('/', [AggregatorController::class, 'index'])->name('index');
        Route::get('/stats', [AggregatorController::class, 'stats'])->name('stats');
        Route::get('/activity', [AggregatorController::class, 'activity'])->name('activity');
        Route::get('/search', [AggregatorController::class, 'search'])->name('search');
        Route::get('/logs', [AggregatorController::class, 'logs'])->name('logs');
        Route::get('/analytics', [AggregatorController::class, 'analytics'])->name('analytics');
    });
});
