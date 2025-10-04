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
                'matrix_user_id' => '@echotravels:echohub.local',
                'status' => 'online',
                'capabilities' => ['bookings', 'revenue', 'analytics', 'status'],
            ],
            [
                'name' => 'Phangan.AI',
                'domain' => 'phangan.ai',
                'matrix_user_id' => '@phangan_ai:echohub.local',
                'status' => 'online',
                'capabilities' => ['queries', 'usage', 'costs', 'status'],
            ],
        ];

        foreach ($apps as $appData) {
            $app = App::updateOrCreate(
                ['matrix_user_id' => $appData['matrix_user_id']],
                $appData
            );

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

        $this->command->info('Seeded ' . count($apps) . ' sample apps and their contacts');
    }
}
