<?php

namespace Database\Seeders;

use App\Models\LoyaltyMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Admin User
        $admin = User::updateOrCreate(
            ['email' => 'admin@aspacindo.com'],
            [
                'name' => 'Administrator Aspacindo',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'phone_number' => '081270000001',
            ]
        );

        // Staff User
        $staff = User::updateOrCreate(
            ['email' => 'staff@aspacindo.com'],
            [
                'name' => 'Staff Dealer Pekanbaru',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'phone_number' => '081270000002',
            ]
        );

        // Sample Customer Loyalty User
        $customer = User::updateOrCreate(
            ['email' => 'budi.santoso@gmail.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone_number' => '081234567890',
            ]
        );

        // Create Loyalty Member profile for Customer
        LoyaltyMember::updateOrCreate(
            ['user_id' => $customer->id],
            [
                'member_code' => 'ALC-' . strtoupper(Str::random(8)),
                'tier' => 'Gold',
                'points_balance' => 1250,
                'total_points_earned' => 1750,
                'phone_number' => '081234567890',
                'joined_at' => now()->subMonths(6),
            ]
        );
    }
}
