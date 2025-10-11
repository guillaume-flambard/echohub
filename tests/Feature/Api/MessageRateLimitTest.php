<?php

use App\Models\Contact;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->contact = Contact::factory()->create([
        'user_id' => $this->user->id,
        'type' => 'human',
    ]);
});

test('message sending is rate limited to 20 requests per minute', function () {
    $this->actingAs($this->user);

    // Send 20 messages (should all succeed)
    for ($i = 0; $i < 20; $i++) {
        $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
            'content' => "Test message {$i}",
        ]);

        // Accept 200 (success), 422 (validation), or 500 (service fails)
        // We're only testing rate limiting, not the full message flow
        expect($response->status())->toBeIn([200, 422, 500]);
    }

    // 21st message should be rate limited
    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'content' => 'Test message 21',
    ]);

    $response->assertStatus(429); // Too Many Requests
    expect($response->json())->toHaveKey('message');
});

test('message rate limit is per user', function () {
    $user1 = User::factory()->create();
    $user2 = User::factory()->create();

    $contact1 = Contact::factory()->create(['user_id' => $user1->id, 'type' => 'human']);
    $contact2 = Contact::factory()->create(['user_id' => $user2->id, 'type' => 'human']);

    // User 1 sends 20 messages
    $this->actingAs($user1);
    for ($i = 0; $i < 20; $i++) {
        $this->postJson("/api/contacts/{$contact1->id}/messages", [
            'content' => "User1 message {$i}",
        ]);
    }

    // User 2 should still be able to send messages (separate rate limit)
    $this->actingAs($user2);
    $response = $this->postJson("/api/contacts/{$contact2->id}/messages", [
        'content' => 'User2 message',
    ]);

    // Should not be rate limited (different user)
    expect($response->status())->not->toBe(429);
});

test('message rate limit resets after one minute', function () {
    $this->actingAs($this->user);

    // Send 20 messages
    for ($i = 0; $i < 20; $i++) {
        $this->postJson("/api/contacts/{$this->contact->id}/messages", [
            'content' => "Test message {$i}",
        ]);
    }

    // 21st message fails
    $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'content' => 'Test message 21',
    ])->assertStatus(429);

    // Travel 61 seconds into the future
    $this->travel(61)->seconds();

    // Should now be able to send again (not rate limited)
    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'content' => 'Test message after reset',
    ]);

    expect($response->status())->not->toBe(429);
});

test('getting message history is not rate limited', function () {
    $this->actingAs($this->user);

    // Should be able to fetch history many times without rate limiting
    for ($i = 0; $i < 30; $i++) {
        $response = $this->getJson("/api/contacts/{$this->contact->id}/messages");
        $response->assertStatus(200);
    }
});

test('ai settings update is rate limited to 10 requests per minute', function () {
    $this->actingAs($this->user);

    // Send 10 updates (should all succeed)
    for ($i = 0; $i < 10; $i++) {
        $response = $this->putJson('/api/ai-settings', [
            'provider' => 'ollama',
            'model' => 'llama3.2:3b',
            'base_url' => 'http://localhost:11434', // Required for Ollama
        ]);

        $response->assertStatus(200);
    }

    // 11th update should be rate limited
    $response = $this->putJson('/api/ai-settings', [
        'provider' => 'ollama',
        'model' => 'llama3.2:3b',
        'base_url' => 'http://localhost:11434',
    ]);

    $response->assertStatus(429);
});
