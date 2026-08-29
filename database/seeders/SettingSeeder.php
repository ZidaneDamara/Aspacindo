<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            // Company stats (used on homepage stats counter)
            ['key' => 'stat_years_operating', 'value' => '15+', 'group' => 'company'],
            ['key' => 'stat_branches_count', 'value' => '20+', 'group' => 'company'],
            ['key' => 'stat_employees_count', 'value' => '150+', 'group' => 'company'],
            ['key' => 'stat_satisfied_customers', 'value' => '50,000+', 'group' => 'company'],
            ['key' => 'stat_awards_won', 'value' => '25+', 'group' => 'company'],

            // Loyalty settings
            ['key' => 'loyalty_points_per_rp_service', 'value' => '1000', 'group' => 'loyalty'],
            ['key' => 'loyalty_points_per_rp_motor', 'value' => '50000', 'group' => 'loyalty'],
            ['key' => 'loyalty_points_per_rp_sparepart', 'value' => '2000', 'group' => 'loyalty'],
            ['key' => 'loyalty_referral_points', 'value' => '50', 'group' => 'loyalty'],
            ['key' => 'loyalty_tier_thresholds', 'value' => json_encode(['Silver' => 0, 'Gold' => 1000, 'Platinum' => 5000]), 'group' => 'loyalty'],
            ['key' => 'loyalty_expiry_months', 'value' => '12', 'group' => 'loyalty'],
        ];

        foreach ($settings as $setting) {
            Setting::set($setting['key'], $setting['value'], $setting['group']);
        }
    }
}
