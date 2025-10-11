<?php

namespace Database\Factories;

use App\Models\App;
use App\Models\Contact;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Contact>
 */
class ContactFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'matrix_id' => '@'.fake()->userName().':echohub.local',
            'type' => fake()->randomElement(['app', 'human']),
        ];
    }

    /**
     * Indicate that the contact is an app.
     */
    public function app(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'app',
            'app_id' => App::factory(),
        ]);
    }

    /**
     * Indicate that the contact is a human.
     */
    public function human(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'human',
            'app_id' => null,
        ]);
    }
}
