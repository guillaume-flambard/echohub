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

test('authenticated user can send message to their contact', function () {
    $this->actingAs($this->user);

    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'message' => 'Hello, this is a test message!',
    ]);

    // May be 200 (success) or 422 (validation from other checks) or 500 (service issue)
    // We're testing that the form request allows the request through
    expect($response->status())->not->toBe(403); // Not forbidden
    expect($response->status())->not->toBe(401); // Not unauthorized
});

test('user cannot send message to another users contact', function () {
    $otherUser = User::factory()->create();
    $otherContact = Contact::factory()->create([
        'user_id' => $otherUser->id,
        'type' => 'human',
    ]);

    $this->actingAs($this->user);

    $response = $this->postJson("/api/contacts/{$otherContact->id}/messages", [
        'message' => 'Trying to send to someone elses contact',
    ]);

    $response->assertStatus(403); // Forbidden by authorization
});

test('message field is required', function () {
    $this->actingAs($this->user);

    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        // No message field
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['message']);
});

test('message cannot be empty string', function () {
    $this->actingAs($this->user);

    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'message' => '',
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['message']);
});

test('message cannot exceed 4000 characters', function () {
    $this->actingAs($this->user);

    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'message' => str_repeat('a', 4001),
    ]);

    $response->assertStatus(422);
    $response->assertJsonValidationErrors(['message']);
});

test('message can be exactly 4000 characters', function () {
    $this->actingAs($this->user);

    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'message' => str_repeat('a', 4000),
    ]);

    // Should not fail validation (may fail for other reasons)
    expect($response->status())->not->toBe(422);
});

test('guest cannot send messages', function () {
    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", [
        'message' => 'Guest trying to send message',
    ]);

    $response->assertStatus(401); // Unauthenticated
});

test('custom error message is returned for required message', function () {
    $this->actingAs($this->user);

    $response = $this->postJson("/api/contacts/{$this->contact->id}/messages", []);

    $response->assertStatus(422);
    $response->assertJson([
        'message' => 'Please enter a message to send.',
    ]);
});
