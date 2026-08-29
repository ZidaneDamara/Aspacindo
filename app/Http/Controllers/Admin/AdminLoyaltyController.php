<?php

namespace App\Http\Controllers\Admin;

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

use Inertia\Inertia;
use Inertia\Response;

class AdminLoyaltyController extends Controller
{
    public function members(Request $request): Response
    {
        $search = $request->query('search');
        $tier = $request->query('tier');

        $query = LoyaltyMember::with(['user', 'pointTransactions']);

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('member_code', 'like', "%{$search}%")
                    ->orWhere('phone_number', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if (!empty($tier) && $tier !== 'Semua') {
            $query->where('tier', $tier);
        }

        $members = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Loyalty/Members', [
            'members' => $members,
            'filters' => [
                'search' => $search ?? '',
                'tier' => $tier ?? 'Semua',
            ],
        ]);
    }

    public function memberDetail(int $id): Response
    {
        $member = LoyaltyMember::with(['user', 'pointTransactions.creator', 'redemptions.reward'])->findOrFail($id);

        return Inertia::render('Admin/Loyalty/MemberDetail', [
            'member' => $member,
        ]);
    }

    public function adjustPoints(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'points' => 'required|integer',
            'type' => 'required|in:adjustment,earn,redeem',
            'description' => 'required|string|max:255',
        ]);

        $member = LoyaltyMember::findOrFail($id);

        DB::transaction(function () use ($member, $validated) {
            $member->increment('points_balance', $validated['points']);
            if ($validated['points'] > 0) {
                $member->increment('total_points_earned', $validated['points']);
            }

            LoyaltyPointTransaction::create([
                'loyalty_member_id' => $member->id,
                'type' => $validated['type'],
                'source' => 'admin_adjustment',
                'points' => $validated['points'],
                'description' => $validated['description'],
                'created_by' => Auth::id(),
            ]);
        });

        return back()->with('success', 'Manual point adjustment applied successfully!');
    }

    public function pointInputView(Request $request): Response
    {
        $search = $request->query('search');
        $member = null;

        if (!empty($search)) {
            $member = LoyaltyMember::with('user')
                ->where('member_code', $search)
                ->orWhere('phone_number', $search)
                ->first();
        }

        $rules = [
            'service' => (int) Setting::get('loyalty_points_per_rp_service', 1000),
            'motor_purchase' => (int) Setting::get('loyalty_points_per_rp_motor', 50000),
            'sparepart_purchase' => (int) Setting::get('loyalty_points_per_rp_sparepart', 2000),
            'referral' => (int) Setting::get('loyalty_referral_points', 50),
            'event' => 10,
        ];

        return Inertia::render('Admin/Loyalty/PointInput', [
            'member' => $member,
            'search' => $search ?? '',
            'rules' => $rules,
        ]);
    }

    public function processPointInput(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'member_id' => 'required|exists:loyalty_members,id',
            'source' => 'required|in:motor_purchase,service,sparepart_purchase,referral,event',
            'transaction_amount' => 'required|numeric|min:0',
            'reference_number' => 'nullable|string|max:100',
            'notes' => 'nullable|string|max:255',
        ]);

        $member = LoyaltyMember::findOrFail($validated['member_id']);
        $amount = (float) $validated['transaction_amount'];

        // Calculate points based on rule ratios
        $pointsEarned = 0;
        if ($validated['source'] === 'service') {
            $ratio = (int) Setting::get('loyalty_points_per_rp_service', 1000);
            $pointsEarned = floor($amount / max(1, $ratio));
        } elseif ($validated['source'] === 'motor_purchase') {
            $ratio = (int) Setting::get('loyalty_points_per_rp_motor', 50000);
            $pointsEarned = floor($amount / max(1, $ratio));
        } elseif ($validated['source'] === 'sparepart_purchase') {
            $ratio = (int) Setting::get('loyalty_points_per_rp_sparepart', 2000);
            $pointsEarned = floor($amount / max(1, $ratio));
        } else {
            $pointsEarned = (int) $amount; // Direct points input for referral / event
        }

        if ($pointsEarned <= 0) {
            return back()->with('error', 'Nominal transaksi terlalu kecil untuk mendapatkan poin.');
        }

        DB::transaction(function () use ($member, $pointsEarned, $validated) {
            $member->increment('points_balance', $pointsEarned);
            $member->increment('total_points_earned', $pointsEarned);

            LoyaltyPointTransaction::create([
                'loyalty_member_id' => $member->id,
                'type' => 'earn',
                'source' => $validated['source'],
                'points' => $pointsEarned,
                'description' => 'Input Poin Transaksi (' . $validated['source'] . ') Rp ' . number_format($validated['transaction_amount']),
                'related_reference' => $validated['reference_number'] ?? null,
                'created_by' => Auth::id(),
            ]);
        });

        return redirect()->route('admin.loyalty.point-input')->with('success', "Berhasil menambahkan {$pointsEarned} poin ke member {$member->user->name}!");
    }

    public function rewardsIndex(): Response
    {
        $rewards = LoyaltyReward::latest()->get();
        return Inertia::render('Admin/Loyalty/Rewards', ['rewards' => $rewards]);
    }

    public function storeReward(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'points_cost' => 'required|integer|min:1',
            'reward_type' => 'required|in:service_discount,sparepart_voucher,merchandise,free_oil_change',
            'stock_quantity' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        LoyaltyReward::create($validated);
        return back()->with('success', 'Loyalty reward created successfully!');
    }

    public function updateReward(Request $request, int $id): RedirectResponse
    {
        $reward = LoyaltyReward::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'points_cost' => 'required|integer|min:1',
            'reward_type' => 'required|in:service_discount,sparepart_voucher,merchandise,free_oil_change',
            'stock_quantity' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $reward->update($validated);
        return back()->with('success', 'Loyalty reward updated successfully!');
    }

    public function destroyReward(int $id): RedirectResponse
    {
        LoyaltyReward::findOrFail($id)->delete();
        return back()->with('success', 'Loyalty reward deleted successfully!');
    }

    public function redemptionsIndex(): Response
    {
        $redemptions = LoyaltyRedemption::with(['loyaltyMember.user', 'reward'])
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Loyalty/Redemptions', ['redemptions' => $redemptions]);
    }

    public function updateRedemptionStatus(Request $request, int $id): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,approved,fulfilled,rejected',
        ]);

        $redemption = LoyaltyRedemption::findOrFail($id);

        if ($validated['status'] === 'fulfilled' && !$redemption->fulfilled_at) {
            $redemption->fulfilled_at = now();
        }

        $redemption->update(['status' => $validated['status']]);

        return back()->with('success', 'Redemption status updated to ' . $validated['status']);
    }

    public function settingsView(): Response
    {
        $settings = [
            'service_ratio' => Setting::get('loyalty_points_per_rp_service', '1000'),
            'motor_ratio' => Setting::get('loyalty_points_per_rp_motor', '50000'),
            'sparepart_ratio' => Setting::get('loyalty_points_per_rp_sparepart', '2000'),
            'referral_points' => Setting::get('loyalty_referral_points', '50'),
            'expiry_months' => Setting::get('loyalty_expiry_months', '12'),
            'tier_thresholds' => Setting::get('loyalty_tier_thresholds', ['Silver' => 0, 'Gold' => 1000, 'Platinum' => 5000]),
        ];

        return Inertia::render('Admin/Loyalty/Settings', ['settings' => $settings]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'service_ratio' => 'required|numeric|min:1',
            'motor_ratio' => 'required|numeric|min:1',
            'sparepart_ratio' => 'required|numeric|min:1',
            'referral_points' => 'required|numeric|min:0',
            'expiry_months' => 'required|numeric|min:1',
            'gold_threshold' => 'required|numeric|min:1',
            'platinum_threshold' => 'required|numeric|min:1',
        ]);

        Setting::set('loyalty_points_per_rp_service', $validated['service_ratio'], 'loyalty');
        Setting::set('loyalty_points_per_rp_motor', $validated['motor_ratio'], 'loyalty');
        Setting::set('loyalty_points_per_rp_sparepart', $validated['sparepart_ratio'], 'loyalty');
        Setting::set('loyalty_referral_points', $validated['referral_points'], 'loyalty');
        Setting::set('loyalty_expiry_months', $validated['expiry_months'], 'loyalty');
        Setting::set('loyalty_tier_thresholds', [
            'Silver' => 0,
            'Gold' => (int)$validated['gold_threshold'],
            'Platinum' => (int)$validated['platinum_threshold'],
        ], 'loyalty');

        return back()->with('success', 'Loyalty settings updated successfully!');
    }
}
