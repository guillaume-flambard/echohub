<?php

use App\Models\App;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('authenticated user can create a contact', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@testuser:echohub.local',
        'type' => 'human',
        'name' => 'Test User',
    ]);

    $response->assertStatus(201);
    expect($response->json('data.name'))->toBe('Test User');
});

test('matrix_id is required', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'type' => 'human',
        'name' => 'Test User',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['matrix_id']);
});

test('matrix_id must be valid format', function () {
    $this->actingAs($this->user);

    $invalidIds = [
        'notamatrixid',
        '@invalid',
        '@user:',
        'user:domain.com',
        '@user@domain.com',
    ];

    foreach ($invalidIds as $invalidId) {
        $response = $this->postJson('/api/contacts', [
            'matrix_id' => $invalidId,
            'type' => 'human',
            'name' => 'Test User',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['matrix_id']);
    }
});

test('matrix_id accepts valid formats', function () {
    $this->actingAs($this->user);

    $validIds = [
        '@user:echohub.local',
        '@test_user:example.com',
        '@user.name:matrix.org',
        '@User123:Domain.COM', // Should be normalized to lowercase
    ];

    foreach ($validIds as $validId) {
        $response = $this->postJson('/api/contacts', [
            'matrix_id' => $validId,
            'type' => 'human',
            'name' => 'Test User '.$validId,
        ]);

        $response->assertStatus(201);
    }
});

test('matrix_id is normalized to lowercase', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@TestUser:EchoHub.Local',
        'type' => 'human',
        'name' => 'Test User',
    ]);

    $response->assertStatus(201);
    expect($response->json('data.matrix_id'))->toBe('@testuser:echohub.local');
});

test('type is required', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@user:echohub.local',
        'name' => 'Test User',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['type']);
});

test('type must be app or human', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@user:echohub.local',
        'type' => 'invalid',
        'name' => 'Test User',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['type']);
});

test('app_id is required when type is app', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@app:echohub.local',
        'type' => 'app',
        'name' => 'Test App',
        // Missing app_id
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['app_id']);
});

test('app_id must exist in apps table', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@app:echohub.local',
        'type' => 'app',
        'app_id' => 99999, // Non-existent app
        'name' => 'Test App',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['app_id']);
});

test('can create app contact with valid app_id', function () {
    $this->actingAs($this->user);

    $app = App::factory()->create();

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => $app->matrix_user_id,
        'type' => 'app',
        'app_id' => $app->id,
        'name' => $app->name,
    ]);

    $response->assertStatus(201);
    expect($response->json('data.type'))->toBe('app');
    expect($response->json('data.app.id'))->toBe($app->id);
});

test('name is required', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@user:echohub.local',
        'type' => 'human',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['name']);
});

test('name is trimmed automatically', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@user:echohub.local',
        'type' => 'human',
        'name' => '  Test User  ',
    ]);

    $response->assertStatus(201);
    expect($response->json('data.name'))->toBe('Test User');
});

test('metadata must be an array', function () {
    $this->actingAs($this->user);

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@user:echohub.local',
        'type' => 'human',
        'name' => 'Test User',
        'metadata' => 'not an array',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['metadata']);
});

test('can create contact with metadata', function () {
    $this->actingAs($this->user);

    $metadata = ['foo' => 'bar', 'nested' => ['key' => 'value']];

    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@user:echohub.local',
        'type' => 'human',
        'name' => 'Test User',
        'metadata' => $metadata,
    ]);

    $response->assertStatus(201);
    expect($response->json('data.metadata'))->toBe($metadata);
});

test('guest cannot create contacts', function () {
    $response = $this->postJson('/api/contacts', [
        'matrix_id' => '@user:echohub.local',
        'type' => 'human',
        'name' => 'Test User',
    ]);

    $response->assertStatus(401);
});
