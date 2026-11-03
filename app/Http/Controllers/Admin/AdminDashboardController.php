<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\LoyaltyMember;
use App\Models\LoyaltyRedemption;
use App\Models\Motorcycle;
use App\Models\Prospect;
use App\Models\ServiceBooking;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isBranchAdmin = $user->isBranchAdmin();
        $userBranch = $user->branch;

        if ($isBranchAdmin && $userBranch) {
            // Branch-scoped dashboard
            $totalBikes = Motorcycle::where('is_active', true)->count();
            $customOtrCount = Motorcycle::where('is_active', true)
                ->where(function ($q) use ($userBranch) {
                    $q->whereNotNull("regional_prices->{$userBranch->region}")
                      ->orWhereNotNull("branch_prices->{$userBranch->id}");
                })->count();

            $branchBookingsCount = ServiceBooking::where('branch_id', $userBranch->id)->count();
            $pendingBranchBookings = ServiceBooking::where('branch_id', $userBranch->id)->where('status', 'pending')->count();
            $recentBranchBookings = ServiceBooking::with('branch')
                ->where('branch_id', $userBranch->id)
                ->latest()
                ->take(5)
                ->get();

            return Inertia::render('Admin/Dashboard', [
                'isBranchAdmin' => true,
                'userBranch' => $userBranch,
                'stats' => [
                    'totalBikes' => $totalBikes,
                    'customOtrCount' => $customOtrCount,
                    'branchBookingsCount' => $branchBookingsCount,
                    'pendingBranchBookings' => $pendingBranchBookings,
                ],
                'recentBookings' => $recentBranchBookings,
                'recentRedemptions' => [],
                'recentProspects' => [],
            ]);
        }

        // Super Admin (Pusat) Global Overview
        $totalMembers = LoyaltyMember::count();
        $pointsRedeemedThisMonth = LoyaltyRedemption::where('created_at', '>=', now()->startOfMonth())->sum('points_spent');
        $pendingServiceBookings = ServiceBooking::where('status', 'pending')->count();
        $pendingRedemptions = LoyaltyRedemption::where('status', 'pending')->count();
        $pendingTestimonials = Testimonial::where('is_approved', false)->count();

        $totalProspects = Prospect::count();
        $newProspectsCount = Prospect::where('status', 'new')->count();
        $totalBranches = Branch::count();
        $totalBikes = Motorcycle::count();

        $recentBookings = ServiceBooking::with('branch')->latest()->take(5)->get();
        $recentRedemptions = LoyaltyRedemption::with(['loyaltyMember.user', 'reward'])->latest()->take(5)->get();
        $recentProspects = Prospect::latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'isBranchAdmin' => false,
            'userBranch' => null,
            'stats' => [
                'totalMembers' => $totalMembers,
                'pointsRedeemedThisMonth' => $pointsRedeemedThisMonth,
                'pendingServiceBookings' => $pendingServiceBookings,
                'pendingRedemptions' => $pendingRedemptions,
                'pendingTestimonials' => $pendingTestimonials,
                'totalProspects' => $totalProspects,
                'newProspectsCount' => $newProspectsCount,
                'totalBranches' => $totalBranches,
                'totalBikes' => $totalBikes,
            ],
            'recentBookings' => $recentBookings,
            'recentRedemptions' => $recentRedemptions,
            'recentProspects' => $recentProspects,
        ]);
    }
}
