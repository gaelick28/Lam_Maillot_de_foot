<?php
namespace Database\Factories;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'username'           => fake()->unique()->userName(),
            'email'              => fake()->unique()->safeEmail(),
            'password'           => static::$password ??= Hash::make('password'),
            'first_name'         => fake()->firstName(),
            'last_name'          => fake()->lastName(),
            'email_verified_at'  => now(),
            'is_active'          => true,
            'remember_token'     => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}