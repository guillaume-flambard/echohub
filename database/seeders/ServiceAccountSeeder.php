<?php

namespace Database\Seeders;

use App\Models\ServiceAccount;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class ServiceAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $serviceAccounts = [
            [
                'name' => 'EchoTravel API Access',
                'scopes' => [
                    'users:read',
                    'contacts:read',
                    'contacts:write',
                    'stats:read',
                ],
                'expires_at' => null, // No expiration
                'is_active' => true,
            ],
            [
                'name' => 'Phangan.AI Integration',
                'scopes' => [
                    'users:read',
                    'contacts:read',
                    'search:read',
                    'stats:read',
                ],
                'expires_at' => Carbon::now()->addYear(),
                'is_active' => true,
            ],
            [
                'name' => '12Go Automation Service',
                'scopes' => [
                    'users:read',
                    'users:write',
                    'contacts:read',
                    'contacts:write',
                ],
                'expires_at' => Carbon::now()->addMonths(6),
                'is_active' => true,
            ],
            [
                'name' => 'External Analytics Service',
                'scopes' => [
                    'stats:read',
                    'activity:read',
                ],
                'expires_at' => Carbon::now()->addMonths(3),
                'is_active' => true,
            ],
            [
                'name' => 'Legacy System (Inactive)',
                'scopes' => [
                    'users:read',
                ],
                'expires_at' => Carbon::now()->subMonths(1), // Expired
                'is_active' => false,
            ],
        ];

        foreach ($serviceAccounts as $accountData) {
            $apiKey = ServiceAccount::generateApiKey();

            ServiceAccount::create([
                'name' => $accountData['name'],
                'api_key' => $apiKey,
                'scopes' => $accountData['scopes'],
                'expires_at' => $accountData['expires_at'],
                'is_active' => $accountData['is_active'],
            ]);

            // Display the API key for testing purposes
            $this->command->info("Service Account: {$accountData['name']}");
            $this->command->info("API Key: {$apiKey}");
            $this->command->newLine();
        }

        $this->command->info('Service accounts seeded successfully!');
        $this->command->warn('⚠️  Save the API keys above - they will be hashed in the database!');
    }
}
