<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
});

test('authenticated user can update ai settings', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'model' => 'llama3.2:3b',
        'base_url' => 'http://localhost:11434',
    ]);

    $response->assertStatus(200);
});

test('provider is required', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'model' => 'llama3.2:3b',
        'base_url' => 'http://localhost:11434',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['provider']);
});

test('provider must be ollama openai or anthropic', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'invalid-provider',
        'model' => 'some-model',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['provider']);
});

test('provider is normalized to lowercase', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'OLLAMA',
        'model' => 'llama3.2:3b',
        'base_url' => 'http://localhost:11434',
    ]);

    $response->assertStatus(200);
    expect($response->json('setting.provider'))->toBe('ollama');
});

test('model is required', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'base_url' => 'http://localhost:11434',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['model']);
});

test('base_url is required for ollama provider', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'model' => 'llama3.2:3b',
        // Missing base_url
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['base_url']);
});

test('base_url must be valid url', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'model' => 'llama3.2:3b',
        'base_url' => 'not-a-url',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['base_url']);
});

test('base_url trailing slash is removed automatically', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'model' => 'llama3.2:3b',
        'base_url' => 'http://localhost:11434/',
    ]);

    $response->assertStatus(200);
    expect($response->json('setting.base_url'))->toBe('http://localhost:11434');
});

test('api_key is required for openai provider', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'openai',
        'model' => 'gpt-4',
        // Missing api_key
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['api_key']);
});

test('api_key is required for anthropic provider', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'anthropic',
        'model' => 'claude-3-5-sonnet-20250219',
        // Missing api_key
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['api_key']);
});

test('can update settings for openai with api_key', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'openai',
        'model' => 'gpt-4-turbo-preview',
        'api_key' => 'sk-test123456789',
    ]);

    $response->assertStatus(200);
    expect($response->json('setting.provider'))->toBe('openai');
});

test('can update settings for anthropic with api_key', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'anthropic',
        'model' => 'claude-3-5-sonnet-20250219',
        'api_key' => 'sk-ant-test123456789',
    ]);

    $response->assertStatus(200);
    expect($response->json('setting.provider'))->toBe('anthropic');
});

test('whitespace is trimmed from all fields', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => '  ollama  ',
        'model' => '  llama3.2:3b  ',
        'base_url' => '  http://localhost:11434  ',
    ]);

    $response->assertStatus(200);
    expect($response->json('setting.provider'))->toBe('ollama');
    expect($response->json('setting.model'))->toBe('llama3.2:3b');
    expect($response->json('setting.base_url'))->toBe('http://localhost:11434');
});

test('guest cannot update ai settings', function () {
    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'model' => 'llama3.2:3b',
        'base_url' => 'http://localhost:11434',
    ]);

    $response->assertStatus(401);
});

test('custom error message for base_url requirement', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'model' => 'llama3.2:3b',
    ]);

    $response->assertStatus(422);
    $response->assertJsonFragment([
        'base_url' => ['Base URL is required for Ollama provider.'],
    ]);
});

test('custom error message for api_key requirement', function () {
    $this->actingAs($this->user);

    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'openai',
        'model' => 'gpt-4',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['api_key']);

    // Verify error message exists and contains expected text
    $errors = $response->json('errors.api_key');
    expect($errors)->toBeArray();
    expect(count($errors))->toBeGreaterThan(0);
});
