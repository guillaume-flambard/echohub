<?php

namespace Database\Seeders;

use App\Models\App;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class AppSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create sample apps
        $apps = [
            [
                'name' => 'EchoTravels',
                'domain' => 'echotravels.app',
                'matrix_user_id' => '@echotravel:echohub.local',
                'app_url' => 'https://echotravels.app',
                'service_api_key' => 'echotravel_'.bin2hex(random_bytes(32)),
                'status' => 'online',
                'capabilities' => ['bookings', 'revenue', 'analytics', 'status', 'properties'],
                'available_scopes' => ['read:bookings', 'read:revenue', 'read:analytics', 'read:properties'],
                'api_config' => [
                    'version' => 'v1',
                    'base_path' => '/api/v1/hub',
                    'auth_method' => 'bearer',
                    'matrix_bot_username' => 'echotravel',
                    'matrix_bot_password' => env('ECHOTRAVEL_MATRIX_PASSWORD'),
                ],
                'description' => 'EchoTravel property management and booking system',
            ],
            [
                'name' => 'Phangan.AI',
                'domain' => 'phangan.ai',
                'matrix_user_id' => '@phangan_ai:echohub.local',
                'app_url' => 'https://phangan.ai',
                'service_api_key' => 'phangan_'.bin2hex(random_bytes(32)),
                'status' => 'online',
                'capabilities' => ['queries', 'usage', 'costs', 'status'],
                'available_scopes' => ['read:queries', 'read:usage', 'read:costs'],
                'api_config' => [
                    'version' => 'v1',
                    'base_path' => '/api/v1/hub',
                    'auth_method' => 'bearer',
                    'matrix_bot_username' => 'phangan_ai',
                    'matrix_bot_password' => env('PHANGAN_AI_MATRIX_PASSWORD'),
                ],
                'description' => 'Phangan AI assistant and knowledge base',
            ],
        ];

        foreach ($apps as $appData) {
            $app = App::updateOrCreate(
                ['matrix_user_id' => $appData['matrix_user_id']],
                $appData
            );

            // Output API key for first-time setup
            if ($app->wasRecentlyCreated) {
                $this->command->warn("🔑 {$app->name} API Key (save this for app configuration):");
                $this->command->line("   {$appData['service_api_key']}");
                $this->command->line('');
            }

            // Create contacts for all users
            $users = User::all();
            foreach ($users as $user) {
                Contact::updateOrCreate(
                    [
                        'user_id' => $user->id,
                        'matrix_id' => $app->matrix_user_id,
                    ],
                    [
                        'type' => 'app',
                        'app_id' => $app->id,
                        'name' => $app->name,
                    ]
                );
            }
        }

        $this->command->info('Seeded '.count($apps).' sample apps and their contacts');
    }
}
