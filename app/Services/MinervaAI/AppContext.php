<?php

namespace App\Services\MinervaAI;

use App\Models\App;

class AppContext
{
    /**
     * Build context for a specific app instance
     */
    public static function build(App $app, ?array $additionalData = []): array
    {
        $context = [
            'app_name' => $app->name,
            'app_domain' => $app->domain,
            'capabilities' => $app->capabilities ?? [],
            'current_data' => [],
        ];

        // Load app-specific data based on app type
        $contextData = match ($app->domain) {
            'echotravels.app' => self::buildEchoTravelsContext($app),
            'phangan.ai' => self::buildPhanganAIContext($app),
            default => [],
        };

        $context['current_data'] = array_merge($contextData, $additionalData);

        return $context;
    }

    /**
     * Build context for EchoTravels app
     */
    private static function buildEchoTravelsContext(App $app): array
    {
        // TODO: Fetch real data from EchoTravels API/database
        // For now, return mock data structure
        return [
            'status' => 'healthy',
            'stats' => [
                'bookings_today' => 0,
                'bookings_this_week' => 0,
                'revenue_this_month' => 0,
            ],
            'recent_activity' => [],
        ];
    }

    /**
     * Build context for Phangan.AI app
     */
    private static function buildPhanganAIContext(App $app): array
    {
        // TODO: Fetch real data from Phangan.AI API/database
        // For now, return mock data structure
        return [
            'status' => 'healthy',
            'stats' => [
                'queries_today' => 0,
                'total_tokens_used' => 0,
                'cost_this_month' => 0,
            ],
            'recent_queries' => [],
        ];
    }

    /**
     * Get available commands for an app
     */
    public static function getCommands(App $app): array
    {
        return match ($app->domain) {
            'echotravels.app' => [
                'bookings' => 'Show recent bookings',
                'revenue' => 'Display revenue statistics',
                'status' => 'Check application health status',
            ],
            'phangan.ai' => [
                'queries' => 'Show AI query statistics',
                'usage' => 'Display token usage and costs',
                'status' => 'Check application health status',
            ],
            default => [
                'status' => 'Check application health status',
            ],
        };
    }
}
