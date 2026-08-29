<?php

namespace App\Http\Controllers\Loyalty;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyMember;
use App\Models\LoyaltyPointTransaction;
use App\Models\LoyaltyRedemption;
use App\Models\LoyaltyReward;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class LoyaltyDashboardController extends Controller
{
    public function dashboard(): Response|RedirectResponse
    {
        $user = Auth::user();

        if (empty($user->phone_number)) {
            return redirect()->route('loyalty.complete-profile');
        }

        $member = $user->loyaltyMember;

        if (!$member) {
            $member = LoyaltyMember::create([
                'user_id' => $user->id,
                'member_code' => 'ALC-' . strtoupper(Str::random(8)),
                'tier' => 'Silver',
                'points_balance' => 0,
                'total_points_earned' => 0,
                'phone_number' => $user->phone_number,
                'joined_at' => now(),
            ]);
        }

        // Tier thresholds calculation
        $thresholds = Setting::get('loyalty_tier_thresholds', ['Silver' => 0, 'Gold' => 1000, 'Platinum' => 5000]);
        $currentEarned = $member->total_points_earned;

        $nextTier = 'Gold';
        $nextThreshold = $thresholds['Gold'] ?? 1000;
        $prevThreshold = 0;

        if ($member->tier === 'Gold') {
            $nextTier = 'Platinum';
            $nextThreshold = $thresholds['Platinum'] ?? 5000;
            $prevThreshold = $thresholds['Gold'] ?? 1000;
        } elseif ($member->tier === 'Platinum') {
            $nextTier = 'Max Tier';
            $nextThreshold = $currentEarned > 0 ? $currentEarned : 1;
            $prevThreshold = $thresholds['Platinum'] ?? 5000;
        }

        $progressPercent = $nextTier === 'Max Tier'
            ? 100
            : min(100, max(0, (($currentEarned - $prevThreshold) / max(1, $nextThreshold - $prevThreshold)) * 100));

        $pointsNeeded = max(0, $nextThreshold - $currentEarned);

        // Transactions & Redemptions
        $transactions = $member->pointTransactions()->paginate(10);
        $rewards = LoyaltyReward::active()->orderBy('points_cost', 'asc')->get();
        $redemptions = $member->redemptions()->with('reward')->take(10)->get();

        return Inertia::render('Loyalty/Dashboard', [
            'member' => $member,
            'tierProgress' => [
                'nextTier' => $nextTier,
                'nextThreshold' => $nextThreshold,
                'pointsNeeded' => $pointsNeeded,
                'progressPercent' => round($progressPercent, 1),
            ],
            'transactions' => $transactions,
            'rewards' => $rewards,
            'redemptions' => $redemptions,
        ]);
    }

    public function showCompleteProfile(): Response|RedirectResponse
    {
        $user = Auth::user();
        if (!empty($user->phone_number)) {
            return redirect()->route('loyalty.dashboard');
        }

        return Inertia::render('Loyalty/CompleteProfile', [
            'user' => $user,
        ]);
    }

    public function saveCompleteProfile(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'phone_number' => 'required|string|min:10|max:20|unique:users,phone_number,' . Auth::id(),
        ]);

        $user = Auth::user();
        $user->update(['phone_number' => $validated['phone_number']]);

        $member = $user->loyaltyMember;
        if ($member) {
            $member->update(['phone_number' => $validated['phone_number']]);
        } else {
            LoyaltyMember::create([
                'user_id' => $user->id,
                'member_code' => 'ALC-' . strtoupper(Str::random(8)),
                'tier' => 'Silver',
                'points_balance' => 0,
                'total_points_earned' => 0,
                'phone_number' => $validated['phone_number'],
                'joined_at' => now(),
            ]);
        }

        return redirect()->route('loyalty.dashboard')->with('success', 'Nomor telepon berhasil disimpan! Selamat datang di Aspacindo Loyalty Club.');
    }

    public function redeem(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'reward_id' => 'required|exists:loyalty_rewards,id',
        ]);

        $user = Auth::user();
        $memberId = $user->loyaltyMember->id;

        try {
            DB::transaction(function () use ($memberId, $validated, $user) {
                // Lock row for update to avoid race condition
                $member = LoyaltyMember::where('id', $memberId)->lockForUpdate()->first();
                $reward = LoyaltyReward::where('id', $validated['reward_id'])->where('is_active', true)->lockForUpdate()->firstOrFail();

                if ($member->points_balance < $reward->points_cost) {
                    throw new \Exception('Saldo poin Anda tidak mencukupi untuk penukaran ini.');
                }

                if ($reward->stock_quantity !== null && $reward->stock_quantity <= 0) {
                    throw new \Exception('Stok hadiah ini telah habis.');
                }

                // Deduct points
                $member->decrement('points_balance', $reward->points_cost);

                // Decrement stock if applicable
                if ($reward->stock_quantity !== null) {
                    $reward->decrement('stock_quantity');
                }

                // Create redemption record
                LoyaltyRedemption::create([
                    'loyalty_member_id' => $member->id,
                    'loyalty_reward_id' => $reward->id,
                    'points_spent' => $reward->points_cost,
                    'status' => 'pending',
                    'redeemed_at' => now(),
                ]);

                // Create transaction audit log
                LoyaltyPointTransaction::create([
                    'loyalty_member_id' => $member->id,
                    'type' => 'redeem',
                    'source' => 'sparepart_purchase',
                    'points' => -$reward->points_cost,
                    'description' => 'Penukaran Hadiah: ' . $reward->name,
                    'created_by' => $user->id,
                ]);
            });
        } catch (\Exception $e) {
            return back()->with('error', $e->getMessage());
        }

        return back()->with('success', 'Penukaran hadiah berhasil! Tunjukkan bukti klaim di kasir/bengkel resmi Aspacindo.');
    }

    public function updateProfile(Request $request): RedirectResponse
    {
        $user = Auth::user();

        $validated = $request->validate([
            'phone_number' => 'required|string|min:10|max:20|unique:users,phone_number,' . $user->id,
        ]);

        $user->update(['phone_number' => $validated['phone_number']]);

        if ($user->loyaltyMember) {
            $user->loyaltyMember->update(['phone_number' => $validated['phone_number']]);
        }

        return back()->with('success', 'Nomor telepon profil berhasil diperbarui.');
    }
}
