<?php

namespace App\Console\Commands;

use App\Models\LoyaltyMember;
use App\Models\Setting;
use Illuminate\Console\Command;

class RecalculateLoyaltyTiers extends Command
{
    protected $signature = 'loyalty:recalculate-tiers';
    protected $description = 'Recalculate member loyalty tiers based on 12-month point accumulation';

    public function handle(): int
    {
        $thresholds = Setting::get('loyalty_tier_thresholds', ['Silver' => 0, 'Gold' => 1000, 'Platinum' => 5000]);

        $members = LoyaltyMember::all();
        $updatedCount = 0;

        foreach ($members as $member) {
            // Calculate sum of points earned in the last 12 months
            $earnedInLastYear = $member->pointTransactions()
                ->where('type', 'earn')
                ->where('created_at', '>=', now()->subMonths(12))
                ->sum('points');

            $newTier = 'Silver';
            if ($earnedInLastYear >= ($thresholds['Platinum'] ?? 5000)) {
                $newTier = 'Platinum';
            } elseif ($earnedInLastYear >= ($thresholds['Gold'] ?? 1000)) {
                $newTier = 'Gold';
            }

            if ($member->tier !== $newTier) {
                $member->update(['tier' => $newTier]);
                $updatedCount++;
            }
        }

        $this->info("Rekalkulasi tier selesai. Total {$updatedCount} member berhasil diperbarui.");
        return Command::SUCCESS;
    }
}
