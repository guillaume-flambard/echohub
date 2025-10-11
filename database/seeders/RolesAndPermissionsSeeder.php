<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create permissions
        $permissions = $this->createPermissions();

        // Create global (system) roles
        $this->createSystemRoles($permissions);
    }

    /**
     * Create all permissions
     */
    private function createPermissions(): array
    {
        $permissionDefinitions = [
            // User Management
            ['name' => 'users.view', 'display_name' => 'View Users', 'category' => 'users', 'description' => 'View user list and details'],
            ['name' => 'users.create', 'display_name' => 'Create Users', 'category' => 'users', 'description' => 'Invite new users to organization'],
            ['name' => 'users.update', 'display_name' => 'Update Users', 'category' => 'users', 'description' => 'Edit user information'],
            ['name' => 'users.delete', 'display_name' => 'Delete Users', 'category' => 'users', 'description' => 'Remove users from organization'],
            ['name' => 'users.manage_roles', 'display_name' => 'Manage User Roles', 'category' => 'users', 'description' => 'Assign and modify user roles'],

            // Team Management
            ['name' => 'teams.view', 'display_name' => 'View Teams', 'category' => 'teams', 'description' => 'View team list and details'],
            ['name' => 'teams.create', 'display_name' => 'Create Teams', 'category' => 'teams', 'description' => 'Create new teams'],
            ['name' => 'teams.update', 'display_name' => 'Update Teams', 'category' => 'teams', 'description' => 'Edit team information'],
            ['name' => 'teams.delete', 'display_name' => 'Delete Teams', 'category' => 'teams', 'description' => 'Remove teams'],
            ['name' => 'teams.manage_members', 'display_name' => 'Manage Team Members', 'category' => 'teams', 'description' => 'Add/remove team members'],

            // Contact Management
            ['name' => 'contacts.view', 'display_name' => 'View Contacts', 'category' => 'contacts', 'description' => 'View contact list and details'],
            ['name' => 'contacts.create', 'display_name' => 'Create Contacts', 'category' => 'contacts', 'description' => 'Add new contacts'],
            ['name' => 'contacts.update', 'display_name' => 'Update Contacts', 'category' => 'contacts', 'description' => 'Edit contact information'],
            ['name' => 'contacts.delete', 'display_name' => 'Delete Contacts', 'category' => 'contacts', 'description' => 'Remove contacts'],

            // App Management
            ['name' => 'apps.view', 'display_name' => 'View Apps', 'category' => 'apps', 'description' => 'View app list and details'],
            ['name' => 'apps.create', 'display_name' => 'Create Apps', 'category' => 'apps', 'description' => 'Register new apps'],
            ['name' => 'apps.update', 'display_name' => 'Update Apps', 'category' => 'apps', 'description' => 'Edit app configuration'],
            ['name' => 'apps.delete', 'display_name' => 'Delete Apps', 'category' => 'apps', 'description' => 'Remove apps'],
            ['name' => 'apps.manage_api_keys', 'display_name' => 'Manage API Keys', 'category' => 'apps', 'description' => 'View and regenerate app API keys'],

            // Messaging
            ['name' => 'messages.send', 'display_name' => 'Send Messages', 'category' => 'messages', 'description' => 'Send messages to contacts'],
            ['name' => 'messages.view', 'display_name' => 'View Messages', 'category' => 'messages', 'description' => 'View message history'],
            ['name' => 'messages.delete', 'display_name' => 'Delete Messages', 'category' => 'messages', 'description' => 'Clear message history'],

            // Organization Settings
            ['name' => 'organization.view', 'display_name' => 'View Organization', 'category' => 'organization', 'description' => 'View organization details'],
            ['name' => 'organization.update', 'display_name' => 'Update Organization', 'category' => 'organization', 'description' => 'Edit organization settings'],
            ['name' => 'organization.delete', 'display_name' => 'Delete Organization', 'category' => 'organization', 'description' => 'Delete organization'],
            ['name' => 'organization.manage_billing', 'display_name' => 'Manage Billing', 'category' => 'organization', 'description' => 'View and manage subscription and billing'],

            // Roles & Permissions
            ['name' => 'roles.view', 'display_name' => 'View Roles', 'category' => 'roles', 'description' => 'View role list and permissions'],
            ['name' => 'roles.create', 'display_name' => 'Create Roles', 'category' => 'roles', 'description' => 'Create custom roles'],
            ['name' => 'roles.update', 'display_name' => 'Update Roles', 'category' => 'roles', 'description' => 'Edit role permissions'],
            ['name' => 'roles.delete', 'display_name' => 'Delete Roles', 'category' => 'roles', 'description' => 'Remove custom roles'],

            // Audit Logs
            ['name' => 'audit_logs.view', 'display_name' => 'View Audit Logs', 'category' => 'audit', 'description' => 'View organization audit trail'],
            ['name' => 'audit_logs.export', 'display_name' => 'Export Audit Logs', 'category' => 'audit', 'description' => 'Export audit logs for compliance'],

            // Dashboard & Analytics
            ['name' => 'analytics.view', 'display_name' => 'View Analytics', 'category' => 'analytics', 'description' => 'View organization analytics and reports'],

            // Platform Admin (Super Admin only)
            ['name' => 'platform.manage', 'display_name' => 'Manage Platform', 'category' => 'platform', 'description' => 'Platform-level administration'],
            ['name' => 'platform.view_all_orgs', 'display_name' => 'View All Organizations', 'category' => 'platform', 'description' => 'Access all organizations'],
        ];

        $permissions = [];
        foreach ($permissionDefinitions as $permDef) {
            $permissions[$permDef['name']] = Permission::firstOrCreate(
                ['name' => $permDef['name']],
                $permDef
            );
        }

        return $permissions;
    }

    /**
     * Create system roles with permissions
     */
    private function createSystemRoles(array $permissions): void
    {
        // Super Admin (Platform-level)
        $superAdmin = Role::firstOrCreate(
            ['name' => 'super_admin', 'organization_id' => null],
            [
                'display_name' => 'Super Admin',
                'description' => 'Platform administrator with full access to all organizations',
                'is_system' => true,
                'permissions' => array_keys($permissions), // All permissions
            ]
        );

        // Organization Admin
        $orgAdmin = Role::firstOrCreate(
            ['name' => 'organization_admin', 'organization_id' => null],
            [
                'display_name' => 'Organization Admin',
                'description' => 'Full access to organization settings and all resources',
                'is_system' => true,
                'permissions' => [
                    // Users
                    'users.view', 'users.create', 'users.update', 'users.delete', 'users.manage_roles',
                    // Teams
                    'teams.view', 'teams.create', 'teams.update', 'teams.delete', 'teams.manage_members',
                    // Contacts
                    'contacts.view', 'contacts.create', 'contacts.update', 'contacts.delete',
                    // Apps
                    'apps.view', 'apps.create', 'apps.update', 'apps.delete', 'apps.manage_api_keys',
                    // Messages
                    'messages.send', 'messages.view', 'messages.delete',
                    // Organization
                    'organization.view', 'organization.update', 'organization.manage_billing',
                    // Roles
                    'roles.view', 'roles.create', 'roles.update', 'roles.delete',
                    // Audit
                    'audit_logs.view', 'audit_logs.export',
                    // Analytics
                    'analytics.view',
                ],
            ]
        );

        // Team Lead
        $teamLead = Role::firstOrCreate(
            ['name' => 'team_lead', 'organization_id' => null],
            [
                'display_name' => 'Team Lead',
                'description' => 'Manage team members and resources within assigned teams',
                'is_system' => true,
                'permissions' => [
                    // Users (view only)
                    'users.view',
                    // Teams (manage own team)
                    'teams.view', 'teams.update', 'teams.manage_members',
                    // Contacts
                    'contacts.view', 'contacts.create', 'contacts.update',
                    // Apps
                    'apps.view',
                    // Messages
                    'messages.send', 'messages.view', 'messages.delete',
                    // Analytics
                    'analytics.view',
                ],
            ]
        );

        // Member
        $member = Role::firstOrCreate(
            ['name' => 'member', 'organization_id' => null],
            [
                'display_name' => 'Member',
                'description' => 'Standard user with access to contacts, apps, and messaging',
                'is_system' => true,
                'permissions' => [
                    // Contacts
                    'contacts.view', 'contacts.create', 'contacts.update',
                    // Apps
                    'apps.view',
                    // Messages
                    'messages.send', 'messages.view', 'messages.delete',
                ],
            ]
        );

        // Guest (Read-only)
        $guest = Role::firstOrCreate(
            ['name' => 'guest', 'organization_id' => null],
            [
                'display_name' => 'Guest',
                'description' => 'Read-only access to basic resources',
                'is_system' => true,
                'permissions' => [
                    // View only
                    'contacts.view',
                    'apps.view',
                    'messages.view',
                ],
            ]
        );

        $this->command->info('✓ Created system roles: Super Admin, Organization Admin, Team Lead, Member, Guest');
        $this->command->info('✓ Created '.count($permissions).' permissions');
    }
}
