<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

test('contacts table has user_id and type composite index', function () {
    $indexes = collect(DB::select("PRAGMA index_list('contacts')"))
        ->pluck('name')
        ->toArray();

    expect($indexes)->toContain('contacts_user_id_type_index');

    // Verify the index includes both columns
    $indexInfo = DB::select("PRAGMA index_info('contacts_user_id_type_index')");
    $columns = collect($indexInfo)->pluck('name')->toArray();

    expect($columns)->toContain('user_id');
    expect($columns)->toContain('type');
});

test('contacts table has app_id index if column exists', function () {
    // Only test if app_id column exists
    if (Schema::hasColumn('contacts', 'app_id')) {
        $indexes = collect(DB::select("PRAGMA index_list('contacts')"))
            ->pluck('name')
            ->toArray();

        expect($indexes)->toContain('contacts_app_id_index');
    } else {
        // If column doesn't exist, test should pass (migration handles this correctly)
        expect(true)->toBeTrue();
    }
});

test('minerva_contexts table has user_id and updated_at composite index', function () {
    $indexes = collect(DB::select("PRAGMA index_list('minerva_contexts')"))
        ->pluck('name')
        ->toArray();

    expect($indexes)->toContain('minerva_contexts_user_id_updated_at_index');

    // Verify the index includes both columns
    $indexInfo = DB::select("PRAGMA index_info('minerva_contexts_user_id_updated_at_index')");
    $columns = collect($indexInfo)->pluck('name')->toArray();

    expect($columns)->toContain('user_id');
    expect($columns)->toContain('updated_at');
});

test('minerva_contexts table has instance_id index', function () {
    $indexes = collect(DB::select("PRAGMA index_list('minerva_contexts')"))
        ->pluck('name')
        ->toArray();

    expect($indexes)->toContain('minerva_contexts_instance_id_index');
});

test('apps table has status index', function () {
    $indexes = collect(DB::select("PRAGMA index_list('apps')"))
        ->pluck('name')
        ->toArray();

    expect($indexes)->toContain('apps_status_index');
});

test('apps table has matrix_user_id index', function () {
    $indexes = collect(DB::select("PRAGMA index_list('apps')"))
        ->pluck('name')
        ->toArray();

    expect($indexes)->toContain('apps_matrix_user_id_index');
});

test('user_id and type index improves contact filtering performance', function () {
    // This test verifies that the index is being used by checking query plans
    $explain = DB::select("EXPLAIN QUERY PLAN SELECT * FROM contacts WHERE user_id = 1 AND type = 'app'");

    $plan = collect($explain)->pluck('detail')->implode(' ');

    // SQLite should use the index (will contain "USING INDEX" in the plan)
    expect($plan)->toContain('INDEX');
});

test('matrix_user_id index improves app lookups', function () {
    $explain = DB::select("EXPLAIN QUERY PLAN SELECT * FROM apps WHERE matrix_user_id = '@test:echohub.local'");

    $plan = collect($explain)->pluck('detail')->implode(' ');

    expect($plan)->toContain('INDEX');
});

test('migration can be rolled back successfully', function () {
    // Get current migration status
    $migrationFile = '2025_10_11_093208_add_missing_database_indexes';

    // Rollback the migration
    $this->artisan('migrate:rollback', ['--step' => 1])
        ->assertExitCode(0);

    // Verify indexes are removed
    $contactsIndexes = collect(DB::select("PRAGMA index_list('contacts')"))
        ->pluck('name')
        ->toArray();

    expect($contactsIndexes)->not->toContain('contacts_user_id_type_index');
    expect($contactsIndexes)->not->toContain('contacts_app_id_index');

    // Re-run the migration for other tests
    $this->artisan('migrate')
        ->assertExitCode(0);
});
