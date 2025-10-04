<?php

namespace Database\Seeders;

use App\Models\App;
use Illuminate\Database\Seeder;

class AppConnectionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $apps = [
            [
                'name' => 'EchoTravel',
                'domain' => 'echotravels.app',
                'app_url' => 'https://echotravels.app',
                'service_api_key' => 'test_key_' . bin2hex(random_bytes(32)),
                'status' => 'online',
                'description' => 'Travel booking and management platform for ferry services in Thailand',
                'capabilities' => [
                    'booking_management',
                    'user_management',
                    'payment_processing',
                    'schedule_management',
                ],
                'available_scopes' => [
                    'bookings:read',
                    'bookings:write',
                    'users:read',
                    'users:write',
                    'schedules:read',
                    'payments:read',
                    'stats:read',
                    'activity:read',
                ],
                'api_config' => [
                    'version' => 'v1',
                    'timeout' => 30,
                    'retry_count' => 3,
                ],
                'metadata' => [
                    'industry' => 'travel',
                    'region' => 'Thailand',
                    'established' => '2024',
                ],
            ],
            [
                'name' => 'Phangan.AI',
                'domain' => 'phangan.ai',
                'app_url' => 'https://phangan.ai',
                'service_api_key' => 'test_key_' . bin2hex(random_bytes(32)),
                'status' => 'online',
                'description' => 'AI-powered travel assistant for Koh Phangan',
                'capabilities' => [
                    'ai_chat',
                    'recommendations',
                    'event_discovery',
                    'local_insights',
                ],
                'available_scopes' => [
                    'chat:read',
                    'chat:write',
                    'recommendations:read',
                    'events:read',
                    'stats:read',
                    'activity:read',
                ],
                'api_config' => [
                    'version' => 'v1',
                    'timeout' => 60,
                    'retry_count' => 2,
                ],
                'metadata' => [
                    'industry' => 'travel',
                    'region' => 'Koh Phangan',
                    'ai_provider' => 'ollama',
                ],
            ],
            [
                'name' => '12Go Automation',
                'domain' => '12go.echohub.local',
                'app_url' => 'https://12go.echohub.local',
                'service_api_key' => 'test_key_' . bin2hex(random_bytes(32)),
                'status' => 'offline',
                'description' => '12Go booking automation and processing system',
                'capabilities' => [
                    'booking_import',
                    'pdf_processing',
                    'customer_management',
                    'schedule_sync',
                ],
                'available_scopes' => [
                    'bookings:read',
                    'bookings:write',
                    'customers:read',
                    'customers:write',
                    'documents:read',
                    'stats:read',
                    'activity:read',
                ],
                'api_config' => [
                    'version' => 'v1',
                    'timeout' => 45,
                    'retry_count' => 3,
                ],
                'metadata' => [
                    'industry' => 'travel',
                    'region' => 'Thailand',
                    'automation_type' => 'gmail_to_sheets',
                ],
            ],
        ];

        foreach ($apps as $appData) {
            App::updateOrCreate(
                ['domain' => $appData['domain']],
                $appData
            );
        }

        $this->command->info('App connections seeded successfully!');
    }
}
