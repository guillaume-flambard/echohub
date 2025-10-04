<?php

namespace Database\Seeders;

use App\Models\App;
use App\Models\HubAppPermission;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the first user (usually the seeded user)
        $user = User::first();

        if (! $user) {
            $this->command->error('No users found. Please seed users first.');

            return;
        }

        // Get all apps
        $apps = App::all();

        if ($apps->isEmpty()) {
            $this->command->error('No apps found. Please seed apps first.');

            return;
        }

        $permissions = [];

        foreach ($apps as $app) {
            // Grant permissions based on app type
            $scopes = $this->getScopesForApp($app);

            // Determine expiration
            $expiresAt = match ($app->domain) {
                'echotravels.app' => null, // Permanent access
                'phangan.ai' => Carbon::now()->addYear(),
                '12go.echohub.local' => Carbon::now()->addMonths(6),
                default => Carbon::now()->addMonths(3),
            };

            $permission = HubAppPermission::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'app_id' => $app->id,
                ],
                [
                    'granted_scopes' => $scopes,
                    'expires_at' => $expiresAt,
                ]
            );

            $permissions[] = [
                'app' => $app->name,
                'scopes' => count($scopes),
                'expires' => $expiresAt ? $expiresAt->format('Y-m-d') : 'Never',
            ];
        }

        // Display seeded permissions
        $this->command->info('Permissions granted to: '.$user->name.' ('.$user->email.')');
        $this->command->newLine();

        foreach ($permissions as $perm) {
            $this->command->info("✓ {$perm['app']}: {$perm['scopes']} scopes (expires: {$perm['expires']})");
        }

        $this->command->newLine();
        $this->command->info('Permissions seeded successfully!');
    }

    /**
     * Get scopes for a specific app based on its capabilities
     */
    protected function getScopesForApp(App $app): array
    {
        // Return all available scopes for the app (full access for seeding)
        return $app->available_scopes ?? [];
    }
}
