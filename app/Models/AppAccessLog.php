<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AppAccessLog extends Model
{
    protected $fillable = [
        'user_id',
        'app_id',
        'endpoint',
        'method',
        'response_code',
        'request_data',
        'response_data',
    ];

    protected $casts = [
        'request_data' => 'array',
        'response_data' => 'array',
    ];

    /**
     * Get the user who made this request
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the app that was accessed
     */
    public function app(): BelongsTo
    {
        return $this->belongsTo(App::class);
    }

    /**
     * Check if the request was successful
     */
    public function wasSuccessful(): bool
    {
        return $this->response_code >= 200 && $this->response_code < 300;
    }

    /**
     * Check if the request failed
     */
    public function failed(): bool
    {
        return ! $this->wasSuccessful();
    }
}
