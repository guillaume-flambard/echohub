# Adding New Apps to EchoHub

This guide shows you how to add new applications to your EchoHub instance, enabling them to be managed through Minerva AI.

## Overview

Each app in EchoHub is represented by:
1. **App record** in the database
2. **Contact record** for each user
3. **Minerva AI context** specific to the app's domain
4. **App context provider** (optional) for custom data/capabilities

## Quick Start

### 1. Add App to Database

Use Laravel Tinker or create a seeder:

```php
use App\Models\App;

App::create([
    'name' => 'MyApp',
    'domain' => 'myapp.example.com',
    'matrix_user_id' => '@myapp:echohub.local',
    'status' => 'online',
    'capabilities' => ['analytics', 'reports', 'alerts'],
]);
```

### 2. Create Contacts for Users

Add the app to users' contact lists:

```php
use App\Models\Contact;
use App\Models\User;

$app = App::where('domain', 'myapp.example.com')->first();
$users = User::all();

foreach ($users as $user) {
    Contact::create([
        'user_id' => $user->id,
        'matrix_id' => $app->matrix_user_id,
        'type' => 'app',
        'app_id' => $app->id,
        'name' => $app->name,
    ]);
}
```

### 3. Add App Context (Optional)

Edit `app/Services/MinervaAI/AppContext.php` to provide app-specific data:

```php
private static function getMyAppData(App $app): array
{
    return [
        'users' => \App\Models\MyAppUser::count(),
        'revenue' => \App\Models\MyAppOrder::sum('total'),
        'active_subscriptions' => \App\Models\MyAppSubscription::where('status', 'active')->count(),
        // Add more app-specific data
    ];
}
```

Then update the `build()` method:

```php
public static function build(App $app, ?array $additionalData = []): array
{
    $context = [
        'app_name' => $app->name,
        'app_domain' => $app->domain,
        'capabilities' => $app->capabilities ?? [],
        'current_data' => [],
    ];

    // Add app-specific data
    switch ($app->domain) {
        case 'echotravels.app':
            $context['current_data'] = self::getEchoTravelsData($app);
            break;
        case 'phangan.ai':
            $context['current_data'] = self::getPhanganAIData($app);
            break;
        case 'myapp.example.com':
            $context['current_data'] = self::getMyAppData($app);
            break;
    }

    return array_merge($context, $additionalData);
}
```

## Using a Seeder

Create a custom seeder for easier management:

```bash
php artisan make:seeder MyAppSeeder
```

```php
<?php

namespace Database\Seeders;

use App\Models\App;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Seeder;

class MyAppSeeder extends Seeder
{
    public function run(): void
    {
        $app = App::updateOrCreate(
            ['matrix_user_id' => '@myapp:echohub.local'],
            [
                'name' => 'MyApp',
                'domain' => 'myapp.example.com',
                'status' => 'online',
                'capabilities' => [
                    'analytics',
                    'reports',
                    'alerts',
                    'user-management',
                ],
            ]
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

        $this->command->info("MyApp seeded successfully!");
    }
}
```

Run the seeder:

```bash
php artisan db:seed --class=MyAppSeeder
```

## App Capabilities

Define what your app can do by setting capabilities:

```php
'capabilities' => [
    'analytics',        // View analytics and metrics
    'reports',          // Generate and view reports
    'alerts',           // Manage alerts and notifications
    'user-management',  // Manage users
    'billing',          // Access billing information
    'api-access',       // API management
    'status',           // System status
]
```

Minerva AI will know about these capabilities and provide context-aware responses.

## App Status

Apps can have three statuses:

- **`online`**: Fully operational
- **`offline`**: Not available
- **`degraded`**: Operational with issues

Update status programmatically:

```php
$app = App::where('domain', 'myapp.example.com')->first();
$app->update(['status' => 'degraded']);
```

## Testing Your App

1. **Verify app appears in Hub**: Navigate to `/hub` and check the contact list
2. **Test conversation**: Click on your app and send a test message
3. **Check Minerva response**: Verify that Minerva AI responds with app-specific context

## Example: Complete App Setup

Here's a complete example for adding a "ProjectHub" app:

```php
// 1. Create the app
$app = App::create([
    'name' => 'ProjectHub',
    'domain' => 'projects.mycompany.com',
    'matrix_user_id' => '@projecthub:echohub.local',
    'status' => 'online',
    'capabilities' => ['projects', 'tasks', 'team', 'analytics'],
]);

// 2. Add to all users
foreach (User::all() as $user) {
    Contact::create([
        'user_id' => $user->id,
        'matrix_id' => $app->matrix_user_id,
        'type' => 'app',
        'app_id' => $app->id,
        'name' => $app->name,
    ]);
}

// 3. Add context provider in AppContext.php
private static function getProjectHubData(App $app): array
{
    return [
        'active_projects' => Project::where('status', 'active')->count(),
        'overdue_tasks' => Task::where('due_date', '<', now())->count(),
        'team_members' => User::where('active', true)->count(),
    ];
}
```

## Updating Existing Apps

Update app properties:

```php
$app = App::where('domain', 'myapp.example.com')->first();
$app->update([
    'status' => 'online',
    'capabilities' => array_merge($app->capabilities, ['new-feature']),
]);
```

## Removing Apps

To remove an app from EchoHub:

```php
$app = App::where('domain', 'myapp.example.com')->first();

// Delete all contacts first
Contact::where('app_id', $app->id)->delete();

// Delete the app
$app->delete();
```

## Troubleshooting

### App not appearing in Hub

- Check if app exists: `App::where('domain', 'myapp.example.com')->exists()`
- Check if contact exists: `Contact::where('app_id', $app_id)->where('user_id', auth()->id())->exists()`
- Clear cache: `php artisan cache:clear && php artisan config:clear`

### Minerva not responding with app context

- Verify Ollama is running: `curl http://localhost:11434/api/tags`
- Check app context provider exists in `AppContext.php`
- Review Minerva service logs

### Status not updating

- Check database: `App::find($id)->status`
- Rebuild frontend: `bun run build`
- Hard refresh browser (Ctrl+Shift+R / Cmd+Shift+R)

## Next Steps

- Configure app-specific API integrations in `api_config` field
- Add custom metadata in the `metadata` JSON field
- Implement real-time status updates
- Create app-specific commands/actions for Minerva

For more details, see:
- [HUB_SETUP.md](HUB_SETUP.md) - Full hub setup guide
- [README.md](README.md) - Project overview
- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
