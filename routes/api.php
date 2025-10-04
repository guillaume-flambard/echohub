<?php

use App\Http\Controllers\AppController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    // Dashboard
    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);
    Route::get('/dashboard/activity', [DashboardController::class, 'recentActivity']);

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
});
