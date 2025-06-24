<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Utilisateur admin
        $admin = User::create([
            'username' => 'admin',
            'email' => 'admin@fou2foot.com',
            'password' => Hash::make('password123'),
            'first_name' => 'Admin',
            'last_name' => 'Fou2Foot',
            'phone' => '+33123456789',
            'is_active' => true,
        ]);

        // Utilisateur test
        $testUser = User::create([
            'username' => 'testuser',
            'email' => 'test@fou2foot.com',
            'password' => Hash::make('password123'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'phone' => '+33987654321',
            'is_active' => true,
        ]);

        // Adresses pour l'admin
        UserAddress::create([
            'user_id' => $admin->id,
            'type' => 'billing',
            'first_name' => 'Admin',
            'last_name' => 'Fou2Foot',
            'street' => '123 Rue du Football',
            'city' => 'Paris',
            'postal_code' => '75001',
            'country' => 'FR',
            'phone' => '+33123456789',
            'is_default' => true,
        ]);

        UserAddress::create([
            'user_id' => $admin->id,
            'type' => 'shipping',
            'first_name' => 'Admin',
            'last_name' => 'Fou2Foot',
            'street' => '456 Avenue des Sports',
            'city' => 'Lyon',
            'postal_code' => '69001',
            'country' => 'FR',
            'phone' => '+33123456789',
            'is_default' => false,
        ]);
    }
}
