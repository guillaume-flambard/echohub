<?php

namespace App\Console\Commands;

use App\Models\ServiceAccount;
use Illuminate\Console\Command;

class RotateServiceAccountKey extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'service-account:rotate-key
                            {id? : The service account ID}
                            {--all : Rotate keys for all active service accounts}
                            {--expired : Rotate keys for expired service accounts}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Rotate API key for service account(s)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        if ($this->option('all')) {
            return $this->rotateAllKeys();
        }

        if ($this->option('expired')) {
            return $this->rotateExpiredKeys();
        }

        $id = $this->argument('id');

        if (!$id) {
            // Show interactive list of service accounts
            $serviceAccounts = ServiceAccount::all();

            if ($serviceAccounts->isEmpty()) {
                $this->error('No service accounts found.');
                return 1;
            }

            $choices = $serviceAccounts->map(function ($sa) {
                $status = $sa->isValid() ? '✓ Active' : '✗ Inactive';
                return "{$sa->id}. {$sa->name} ({$status})";
            })->toArray();

            $selected = $this->choice(
                'Select a service account to rotate key',
                $choices
            );

            // Extract ID from selection
            preg_match('/^(\d+)\./', $selected, $matches);
            $id = $matches[1] ?? null;
        }

        $serviceAccount = ServiceAccount::find($id);

        if (!$serviceAccount) {
            $this->error("Service account with ID {$id} not found.");
            return 1;
        }

        // Confirm rotation
        if (!$this->confirm("Rotate API key for '{$serviceAccount->name}'?")) {
            $this->info('Key rotation cancelled.');
            return 0;
        }

        return $this->rotateKey($serviceAccount);
    }

    /**
     * Rotate key for a specific service account
     */
    protected function rotateKey(ServiceAccount $serviceAccount): int
    {
        $this->info("Rotating key for: {$serviceAccount->name}");

        try {
            $newKey = $serviceAccount->rotateKey();

            $this->newLine();
            $this->info('✓ Key rotated successfully!');
            $this->newLine();
            $this->warn('New API Key:');
            $this->line($newKey);
            $this->newLine();
            $this->warn('⚠️  Save this key securely - it will not be shown again!');

            return 0;
        } catch (\Exception $e) {
            $this->error("Failed to rotate key: {$e->getMessage()}");
            return 1;
        }
    }

    /**
     * Rotate keys for all active service accounts
     */
    protected function rotateAllKeys(): int
    {
        $serviceAccounts = ServiceAccount::where('is_active', true)->get();

        if ($serviceAccounts->isEmpty()) {
            $this->error('No active service accounts found.');
            return 1;
        }

        $this->warn("This will rotate keys for {$serviceAccounts->count()} service account(s).");

        if (!$this->confirm('Continue?')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        $rotatedKeys = [];

        foreach ($serviceAccounts as $serviceAccount) {
            try {
                $newKey = $serviceAccount->rotateKey();
                $rotatedKeys[] = [
                    'name' => $serviceAccount->name,
                    'key' => $newKey,
                ];
                $this->info("✓ Rotated: {$serviceAccount->name}");
            } catch (\Exception $e) {
                $this->error("✗ Failed: {$serviceAccount->name} - {$e->getMessage()}");
            }
        }

        if (!empty($rotatedKeys)) {
            $this->newLine();
            $this->warn('New API Keys:');
            $this->newLine();

            foreach ($rotatedKeys as $item) {
                $this->line("{$item['name']}:");
                $this->line("  {$item['key']}");
                $this->newLine();
            }

            $this->warn('⚠️  Save these keys securely - they will not be shown again!');
        }

        return 0;
    }

    /**
     * Rotate keys for expired service accounts
     */
    protected function rotateExpiredKeys(): int
    {
        $serviceAccounts = ServiceAccount::whereNotNull('expires_at')
            ->where('expires_at', '<=', now())
            ->get();

        if ($serviceAccounts->isEmpty()) {
            $this->info('No expired service accounts found.');
            return 0;
        }

        $this->warn("Found {$serviceAccounts->count()} expired service account(s).");

        if (!$this->confirm('Rotate keys for expired accounts?')) {
            $this->info('Operation cancelled.');
            return 0;
        }

        $rotatedKeys = [];

        foreach ($serviceAccounts as $serviceAccount) {
            try {
                $newKey = $serviceAccount->rotateKey();
                $rotatedKeys[] = [
                    'name' => $serviceAccount->name,
                    'key' => $newKey,
                ];
                $this->info("✓ Rotated: {$serviceAccount->name}");
            } catch (\Exception $e) {
                $this->error("✗ Failed: {$serviceAccount->name} - {$e->getMessage()}");
            }
        }

        if (!empty($rotatedKeys)) {
            $this->newLine();
            $this->warn('New API Keys:');
            $this->newLine();

            foreach ($rotatedKeys as $item) {
                $this->line("{$item['name']}:");
                $this->line("  {$item['key']}");
                $this->newLine();
            }

            $this->warn('⚠️  Save these keys securely - they will not be shown again!');
        }

        return 0;
    }
}
