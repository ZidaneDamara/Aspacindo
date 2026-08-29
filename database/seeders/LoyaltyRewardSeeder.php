<?php

namespace Database\Seeders;

use App\Models\LoyaltyReward;
use Illuminate\Database\Seeder;

class LoyaltyRewardSeeder extends Seeder
{
    public function run(): void
    {
        $rewards = [
            [
                'name' => 'Voucher Gratis Oli Yamalube Super Matic',
                'description' => 'Voucher penukaran oli mesin Yamalube Super Matic 1 Liter di seluruh bengkel resmi Aspacindo Kedaton Motor.',
                'image' => '/assets/images/rewards/yamalube.webp',
                'points_cost' => 200,
                'reward_type' => 'free_oil_change',
                'stock_quantity' => 100,
                'is_active' => true,
            ],
            [
                'name' => 'Diskon Jasa Service Berkala 50%',
                'description' => 'Diskon 50% untuk biaya jasa paket service berkala motor Yamaha di bengkel resmi Aspacindo.',
                'image' => '/assets/images/rewards/service_discount.webp',
                'points_cost' => 350,
                'reward_type' => 'service_discount',
                'stock_quantity' => 200,
                'is_active' => true,
            ],
            [
                'name' => 'Voucher Spare Part Original Rp 50.000',
                'description' => 'Voucher belanja suku cadang / spare part original Yamaha senilai Rp 50.000.',
                'image' => '/assets/images/rewards/sparepart_voucher.webp',
                'points_cost' => 500,
                'reward_type' => 'sparepart_voucher',
                'stock_quantity' => 50,
                'is_active' => true,
            ],
            [
                'name' => 'Helm Exclusive Yamaha MAXi Series',
                'description' => 'Helm full-face sporty edisi khusus MAXi Yamaha dengan sertifikasi SNI & standar keamanan tinggi.',
                'image' => '/assets/images/rewards/helmet.webp',
                'points_cost' => 1500,
                'reward_type' => 'merchandise',
                'stock_quantity' => 20,
                'is_active' => true,
            ],
        ];

        foreach ($rewards as $rewardData) {
            LoyaltyReward::updateOrCreate(['name' => $rewardData['name']], $rewardData);
        }
    }
}
