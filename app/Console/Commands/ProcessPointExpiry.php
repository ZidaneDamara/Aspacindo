<?php

namespace App\Console\Commands;

use App\Models\LoyaltyMember;
use App\Models\LoyaltyPointTransaction;
use App\Models\Setting;
use Illuminate\Console\Command;

class ProcessPointExpiry extends Command
{
    protected $signature = 'loyalty:expire-points';
    protected $description = 'Process point expiration for transactions older than configurable expiry period';

    public function handle(): int
    {
        $expiryMonths = (int) Setting::get('loyalty_expiry_months', 12);
        $cutoffDate = now()->subMonths($expiryMonths);

        $expiredTransactions = LoyaltyPointTransaction::where('type', 'earn')
            ->where('created_at', '<=', $cutoffDate)
            ->whereNull('related_reference') // use related_reference tag for expired markers
            ->get();

        $expiredCount = 0;

        foreach ($expiredTransactions as $tx) {
            $member = $tx->loyaltyMember;
            if ($member && $member->points_balance > 0) {
                $pointsToExpire = min($member->points_balance, $tx->points);

                if ($pointsToExpire > 0) {
                    $member->decrement('points_balance', $pointsToExpire);

                    LoyaltyPointTransaction::create([
                        'loyalty_member_id' => $member->id,
                        'type' => 'expire',
                        'source' => 'event',
                        'points' => -$pointsToExpire,
                        'description' => "Poin kadaluarsa ({$expiryMonths} bulan berlalu)",
                    ]);

                    $tx->update(['related_reference' => 'EXPIRED_PROCESSED']);
                    $expiredCount++;
                }
            }
        }

        $this->info("Proses kadaluarsa poin selesai. {$expiredCount} transaksi kadaluarsa diproses.");
        return Command::SUCCESS;
    }
}
