<?php

namespace Database\Seeders;

use App\Models\App;
use App\Models\Contact;
use App\Models\MinervaContext;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class DefaultOrganizationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * This seeder creates a default organization and migrates all existing data to it.
     * This is essential for existing installations upgrading to the enterprise multi-tenant version.
     */
    public function run(): void
    {
        $this->command->info('🚀 Starting data migration to default organization...');

        // Create default organization
        $organization = $this->createDefaultOrganization();

        // Get organization admin role
        $adminRole = Role::where('name', 'organization_admin')->whereNull('organization_id')->first();

        if (! $adminRole) {
            $this->command->error('❌ Organization Admin role not found. Please run RolesAndPermissionsSeeder first.');

            return;
        }

        // Migrate users
        $this->migrateUsers($organization, $adminRole);

        // Migrate apps
        $this->migrateApps($organization);

        // Migrate contacts
        $this->migrateContacts($organization);

        // Migrate Minerva contexts
        $this->migrateContexts($organization);

        $this->command->info('✅ Data migration completed successfully!');
    }

    /**
     * Create the default organization
     */
    private function createDefaultOrganization(): Organization
    {
        $org = Organization::firstOrCreate(
            ['slug' => 'default'],
            [
                'name' => 'Default Organization',
                'subscription_tier' => 'professional', // Start with professional tier
                'status' => 'active', // Active by default (not trial)
                'trial_ends_at' => null,
                'max_users' => 100,
                'max_apps' => 50,
                'max_messages_per_month' => 100000,
                'settings' => [
                    'created_by_migration' => true,
                    'migrated_at' => now()->toIso8601String(),
                ],
            ]
        );

        $this->command->info("✓ Created default organization: {$org->name} (ID: {$org->id})");

        return $org;
    }

    /**
     * Migrate existing users to default organization
     */
    private function migrateUsers(Organization $organization, Role $adminRole): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->warn('⚠ No users found to migrate');

            return;
        }

        $migratedCount = 0;

        foreach ($users as $user) {
            // Check if user is already a member
            if ($user->organizations()->where('organization_id', $organization->id)->exists()) {
                continue;
            }

            // Attach user to organization with admin role
            $user->organizations()->attach($organization->id, [
                'role_id' => $adminRole->id,
                'status' => 'active',
                'invited_by' => null,
                'invited_at' => now(),
                'joined_at' => now(),
                'permissions' => null,
            ]);

            $migratedCount++;
        }

        $this->command->info("✓ Migrated {$migratedCount} users to default organization as admins");
    }

    /**
     * Migrate existing apps to default organization
     */
    private function migrateApps(Organization $organization): void
    {
        $apps = App::whereNull('organization_id')->get();

        if ($apps->isEmpty()) {
            $this->command->warn('⚠ No apps found to migrate');

            return;
        }

        $migratedCount = 0;

        foreach ($apps as $app) {
            $app->update(['organization_id' => $organization->id]);
            $migratedCount++;
        }

        $this->command->info("✓ Migrated {$migratedCount} apps to default organization");
    }

    /**
     * Migrate existing contacts to default organization
     */
    private function migrateContacts(Organization $organization): void
    {
        $contacts = Contact::whereNull('organization_id')->get();

        if ($contacts->isEmpty()) {
            $this->command->warn('⚠ No contacts found to migrate');

            return;
        }

        $migratedCount = 0;

        foreach ($contacts as $contact) {
            $contact->update(['organization_id' => $organization->id]);
            $migratedCount++;
        }

        $this->command->info("✓ Migrated {$migratedCount} contacts to default organization");
    }

    /**
     * Migrate existing Minerva contexts to default organization
     */
    private function migrateContexts(Organization $organization): void
    {
        $contexts = MinervaContext::whereNull('organization_id')->get();

        if ($contexts->isEmpty()) {
            $this->command->warn('⚠ No Minerva contexts found to migrate');

            return;
        }

        $migratedCount = 0;

        foreach ($contexts as $context) {
            $context->update(['organization_id' => $organization->id]);
            $migratedCount++;
        }

        $this->command->info("✓ Migrated {$migratedCount} Minerva contexts to default organization");
    }
}
