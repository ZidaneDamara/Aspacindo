<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\LoyaltyMember;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Delete old branch_admins to ensure only the specified 7 branch admins exist
        User::where('role', 'branch_admin')->delete();

        // 1. Super Administrator (Admin Pusat)
        $admin = User::updateOrCreate(
            ['email' => 'admin@aspacindo.com'],
            [
                'name' => 'Administrator Aspacindo (Pusat)',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'branch_id' => null,
                'phone_number' => '081270000001',
            ]
        );

        // 2. The 7 Branch Admins specified by user
        $branchAdminConfigs = [
            [
                'region' => 'Pekanbaru',
                'branch_slug' => 'aspacindo-kedaton-motor-riau-1-pekanbaru',
                'name' => 'Admin Aspacindo Pekanbaru',
                'email' => 'admin.pekanbaru@aspacindo.com',
                'phone' => '081270001111',
            ],
            [
                'region' => 'Pelalawan',
                'branch_slug' => 'aspacindo-kedaton-motor-sorek-pelalawan',
                'name' => 'Admin Aspacindo Pelalawan',
                'email' => 'admin.pelalawan@aspacindo.com',
                'phone' => '081270002222',
            ],
            [
                'region' => 'Kampar',
                'branch_slug' => 'aspacindo-kedaton-motor-sungai-pagar-kampar',
                'name' => 'Admin Aspacindo Kampar',
                'email' => 'admin.kampar@aspacindo.com',
                'phone' => '081270003333',
            ],
            [
                'region' => 'Indragiri Hulu',
                'branch_slug' => 'aspacindo-kedaton-motor-air-molek-indragiri-hulu',
                'name' => 'Admin Aspacindo Indragiri Hulu',
                'email' => 'admin.inhu@aspacindo.com',
                'phone' => '081270005555',
            ],
            [
                'region' => 'Siak',
                'branch_slug' => 'aspacindo-kedaton-motor-kandis-siak',
                'name' => 'Admin Aspacindo Siak',
                'email' => 'admin.siak@aspacindo.com',
                'phone' => '081270006666',
            ],
            [
                'region' => 'Indragiri Hilir',
                'branch_slug' => 'aspacindo-kedaton-motor-tembilahan-indragiri-hilir',
                'name' => 'Admin Aspacindo Indragiri Hilir',
                'email' => 'admin.inhil@aspacindo.com',
                'phone' => '081270004444',
            ],
            [
                'region' => 'Medan',
                'branch_slug' => 'aspacindo-kedaton-motor-medan',
                'name' => 'Admin Aspacindo Medan',
                'email' => 'admin.medan@aspacindo.com',
                'phone' => '081270007777',
            ],
        ];

        foreach ($branchAdminConfigs as $config) {
            $branch = Branch::where('slug', $config['branch_slug'])->first()
                ?? Branch::where('region', $config['region'])->first();

            User::updateOrCreate(
                ['email' => $config['email']],
                [
                    'name' => $config['name'],
                    'password' => Hash::make('password'),
                    'role' => 'branch_admin',
                    'branch_id' => $branch?->id,
                    'phone_number' => $config['phone'],
                ]
            );
        }

        // 3. Staff User
        $staffBranch = Branch::where('region', 'Pekanbaru')->first();
        User::updateOrCreate(
            ['email' => 'staff@aspacindo.com'],
            [
                'name' => 'Staff Dealer Pekanbaru',
                'password' => Hash::make('password'),
                'role' => 'staff',
                'branch_id' => $staffBranch?->id,
                'phone_number' => '081270000002',
            ]
        );

        // 4. Sample Customer Loyalty User
        $customer = User::updateOrCreate(
            ['email' => 'budi.santoso@gmail.com'],
            [
                'name' => 'Budi Santoso',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'phone_number' => '081234567890',
            ]
        );

        // Loyalty Member profile for Customer
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
