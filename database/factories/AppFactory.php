<?php

namespace Database\Factories;

use App\Models\App;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\App>
 */
class AppFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $appName = fake()->company();

        return [
            'name' => $appName,
            'domain' => fake()->domainName(),
            'matrix_user_id' => '@'.str($appName)->slug()->lower().':echohub.local',
            'status' => fake()->randomElement(['online', 'offline', 'degraded']),
            'api_config' => [
                'matrix_access_token' => fake()->uuid(),
            ],
        ];
    }

    /**
     * Indicate that the app is online.
     */
    public function online(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'online',
        ]);
    }

    /**
     * Indicate that the app is offline.
     */
    public function offline(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'offline',
        ]);
    }

    /**
     * Indicate that the app is degraded.
     */
    public function degraded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'degraded',
        ]);
    }
}
