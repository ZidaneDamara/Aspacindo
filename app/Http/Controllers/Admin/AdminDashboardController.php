<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyMember;
use App\Models\LoyaltyRedemption;
use App\Models\Prospect;
use App\Models\ServiceBooking;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(): Response
    {
        $totalMembers = LoyaltyMember::count();
        $pointsRedeemedThisMonth = LoyaltyRedemption::where('created_at', '>=', now()->startOfMonth())->sum('points_spent');
        $pendingServiceBookings = ServiceBooking::where('status', 'pending')->count();
        $pendingRedemptions = LoyaltyRedemption::where('status', 'pending')->count();
        $pendingTestimonials = Testimonial::where('is_approved', false)->count();

        $totalProspects = Prospect::count();
        $newProspectsCount = Prospect::where('status', 'new')->count();

        $recentBookings = ServiceBooking::with('branch')->latest()->take(5)->get();
        $recentRedemptions = LoyaltyRedemption::with(['loyaltyMember.user', 'reward'])->latest()->take(5)->get();
        $recentProspects = Prospect::latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalMembers' => $totalMembers,
                'pointsRedeemedThisMonth' => $pointsRedeemedThisMonth,
                'pendingServiceBookings' => $pendingServiceBookings,
                'pendingRedemptions' => $pendingRedemptions,
                'pendingTestimonials' => $pendingTestimonials,
                'totalProspects' => $totalProspects,
                'newProspectsCount' => $newProspectsCount,
            ],
            'recentBookings' => $recentBookings,
            'recentRedemptions' => $recentRedemptions,
            'recentProspects' => $recentProspects,
        ]);
    }
}
