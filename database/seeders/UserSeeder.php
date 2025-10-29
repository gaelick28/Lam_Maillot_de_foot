<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Compte administrateur de test
        User::updateOrCreate(
            ['email' => 'admin@fou2foot.com'],
            [
                'username' => 'admin',
                'password' => Hash::make('password123'),
            ]
        );

        // Compte utilisateur classique
        User::updateOrCreate(
            ['email' => 'test@fou2foot.com'],
            [
                'username' => 'testuser',
                'password' => Hash::make('password123'),
            ]
        );
    }
}
