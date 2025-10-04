<?php

namespace Database\Seeders;

use App\Models\App;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class ContactSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::first();

        if (! $user) {
            $this->command->error('No users found. Please seed users first.');

            return;
        }

        // Create app contacts (from seeded apps)
        $apps = App::all();

        foreach ($apps as $app) {
            Contact::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'matrix_id' => $app->matrix_user_id,
                ],
                [
                    'type' => 'app',
                    'app_id' => $app->id,
                    'name' => $app->name,
                    'avatar' => null,
                    'metadata' => [
                        'domain' => $app->domain,
                        'status' => $app->status,
                        'capabilities' => $app->capabilities,
                    ],
                ]
            );
        }

        $this->command->info("Created {$apps->count()} app contacts");

        // Create human contacts (test Matrix users)
        $humanContacts = [
            [
                'matrix_id' => '@yourname:echohub.local',
                'name' => 'Your Name',
                'metadata' => [
                    'email' => 'yourname@example.com',
                    'location' => 'Koh Phangan, Thailand',
                ],
            ],
            [
                'matrix_id' => '@alice:echohub.local',
                'name' => 'Alice Johnson',
                'metadata' => [
                    'email' => 'alice@example.com',
                    'location' => 'Koh Samui, Thailand',
                ],
            ],
            [
                'matrix_id' => '@bob:echohub.local',
                'name' => 'Bob Smith',
                'metadata' => [
                    'email' => 'bob@example.com',
                    'location' => 'Bangkok, Thailand',
                ],
            ],
            [
                'matrix_id' => '@charlie:echohub.local',
                'name' => 'Charlie Brown',
                'metadata' => [
                    'email' => 'charlie@example.com',
                    'location' => 'Phuket, Thailand',
                ],
            ],
        ];

        foreach ($humanContacts as $contactData) {
            Contact::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'matrix_id' => $contactData['matrix_id'],
                ],
                [
                    'type' => 'human',
                    'app_id' => null,
                    'name' => $contactData['name'],
                    'avatar' => null,
                    'metadata' => $contactData['metadata'],
                ]
            );
        }

        $this->command->info('Created '.count($humanContacts).' human contacts');
        $this->command->newLine();
        $this->command->info('✓ All contacts seeded successfully!');
        $this->command->info('  - '.$apps->count().' app contacts');
        $this->command->info('  - '.count($humanContacts).' human contacts');
    }
}
