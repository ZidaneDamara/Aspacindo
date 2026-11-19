<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\LoyaltyMember;
use App\Models\LoyaltyRedemption;
use App\Models\Motorcycle;
use App\Models\Prospect;
use App\Models\SearchLog;
use App\Models\ServiceBooking;
use App\Models\SiteVisit;
use App\Models\Testimonial;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $isBranchAdmin = $user->isBranchAdmin();
        $userBranch = $user->branch;

        // 1. BRANCH ADMIN SPECIALIZED DASHBOARD
        if ($isBranchAdmin && $userBranch) {
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

            // Branch specific prospects
            $branchProspectsCount = Prospect::where('city', 'like', "%{$userBranch->region}%")
                ->orWhere('address', 'like', "%{$userBranch->region}%")
                ->count();

            return Inertia::render('Admin/Dashboard', [
                'isBranchAdmin' => true,
                'userBranch' => $userBranch,
                'stats' => [
                    'totalBikes' => $totalBikes,
                    'customOtrCount' => $customOtrCount,
                    'branchBookingsCount' => $branchBookingsCount,
                    'pendingBranchBookings' => $pendingBranchBookings,
                    'branchProspectsCount' => $branchProspectsCount,
                ],
                'recentBookings' => $recentBranchBookings,
                'recentRedemptions' => [],
                'recentProspects' => [],
                'analytics' => null,
            ]);
        }

        // 2. SUPER ADMINISTRATOR (PUSAT) BUSINESS DECISION DASHBOARD

        // A. Website Traffic & Visitor Analytics
        $totalPageViews = (int) SiteVisit::sum('page_views');
        $totalUniqueVisitors = (int) SiteVisit::sum('unique_visitors');
        $totalMobileViews = (int) SiteVisit::sum('mobile_views');
        $totalDesktopViews = (int) SiteVisit::sum('desktop_views');

        // Traffic last 30 days
        $thirtyDaysAgo = Carbon::today()->subDays(30);
        $monthPageViews = (int) SiteVisit::where('visit_date', '>=', $thirtyDaysAgo)->sum('page_views');
        $monthUniqueVisitors = (int) SiteVisit::where('visit_date', '>=', $thirtyDaysAgo)->sum('unique_visitors');

        // Today's traffic
        $todayVisit = SiteVisit::where('visit_date', Carbon::today()->toDateString())->first();
        $todayViews = $todayVisit ? $todayVisit->page_views : 0;
        $todayUnique = $todayVisit ? $todayVisit->unique_visitors : 0;

        // Mobile traffic ratio
        $mobilePercentage = ($totalPageViews > 0)
            ? (int) round(($totalMobileViews / $totalPageViews) * 100)
            : 78;

        // Daily trend data for the last 14 days
        $trendRecords = SiteVisit::where('visit_date', '>=', Carbon::today()->subDays(13))
            ->orderBy('visit_date', 'asc')
            ->get();

        $trafficTrend = [];
        for ($i = 13; $i >= 0; $i--) {
            $dateStr = Carbon::today()->subDays($i)->toDateString();
            $label = Carbon::today()->subDays($i)->isoFormat('D MMM');
            $found = $trendRecords->firstWhere('visit_date', $dateStr);
            $trafficTrend[] = [
                'date' => $dateStr,
                'label' => $label,
                'views' => $found ? $found->page_views : 0,
                'visitors' => $found ? $found->unique_visitors : 0,
            ];
        }

        // B. Top Viewed Products (Most Popular Motorcycles)
        $totalProductViews = (int) Motorcycle::sum('views_count');
        $topViewedMotorcycles = Motorcycle::where('is_active', true)
            ->with('primaryImage')
            ->orderBy('views_count', 'desc')
            ->take(6)
            ->get(['id', 'name', 'slug', 'category', 'price_otr', 'views_count'])
            ->map(function ($bike) use ($totalProductViews) {
                $share = $totalProductViews > 0 ? round(($bike->views_count / $totalProductViews) * 100, 1) : 0;
                return [
                    'id' => $bike->id,
                    'name' => $bike->name,
                    'slug' => $bike->slug,
                    'category' => $bike->category,
                    'price_otr' => $bike->price_otr,
                    'views_count' => $bike->views_count,
                    'share_percentage' => $share,
                    'image' => $bike->primaryImage?->image_path ?? null,
                ];
            });

        // C. Most Searched Keywords
        $topSearches = SearchLog::orderBy('search_count', 'desc')
            ->take(8)
            ->get(['id', 'keyword', 'search_count', 'last_searched_at'])
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'keyword' => $item->keyword,
                    'search_count' => $item->search_count,
                    'last_searched' => $item->last_searched_at ? $item->last_searched_at->diffForHumans() : 'Baru saja',
                ];
            });

        // D. Sales & Credit Funnel
        $totalProspects = Prospect::count();
        $newProspectsCount = Prospect::where('status', 'new')->count();
        $contactedProspectsCount = Prospect::where('status', 'contacted')->count();
        $inProgressProspectsCount = Prospect::where('status', 'prospect')->count();
        $closedWonProspectsCount = Prospect::where('status', 'deal')->count();
        $closedLostProspectsCount = Prospect::where('status', 'rejected')->count();

        $conversionRate = $totalProspects > 0
            ? round(($closedWonProspectsCount / $totalProspects) * 100, 1)
            : 0;

        // Average DP & Tenor calculation
        $avgDp = (int) (Prospect::avg('dp_amount') ?? 3500000);
        $popularTenor = Prospect::select('tenor_months', DB::raw('count(*) as count'))
            ->groupBy('tenor_months')
            ->orderBy('count', 'desc')
            ->first();

        // E. Regional Demand Distribution
        $regions = ['Pekanbaru', 'Siak', 'Kampar', 'Pelalawan', 'Indragiri Hulu', 'Indragiri Hilir', 'Medan'];
        $regionalDemand = [];
        foreach ($regions as $r) {
            $count = Prospect::where('city', 'like', "%{$r}%")
                ->orWhere('address', 'like', "%{$r}%")
                ->count();
            $bookingsCount = ServiceBooking::whereHas('branch', function ($q) use ($r) {
                $q->where('region', $r);
            })->count();

            $regionalDemand[] = [
                'region' => $r,
                'prospects' => $count,
                'bookings' => $bookingsCount,
                'total_demand' => $count + $bookingsCount,
            ];
        }
        usort($regionalDemand, fn($a, $b) => $b['total_demand'] <=> $a['total_demand']);

        // F. Other Dealership Master Numbers
        $totalMembers = LoyaltyMember::count();
        $pointsRedeemedThisMonth = LoyaltyRedemption::where('created_at', '>=', now()->startOfMonth())->sum('points_spent');
        $pendingServiceBookings = ServiceBooking::where('status', 'pending')->count();
        $pendingRedemptions = LoyaltyRedemption::where('status', 'pending')->count();
        $pendingTestimonials = Testimonial::where('is_approved', false)->count();
        $totalBranches = Branch::count();
        $totalBikes = Motorcycle::count();

        // Recent tables
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
                'contactedProspectsCount' => $contactedProspectsCount,
                'inProgressProspectsCount' => $inProgressProspectsCount,
                'closedWonProspectsCount' => $closedWonProspectsCount,
                'closedLostProspectsCount' => $closedLostProspectsCount,
                'conversionRate' => $conversionRate,
                'avgDp' => $avgDp,
                'popularTenor' => $popularTenor ? $popularTenor->tenor_months : 35,
                'totalBranches' => $totalBranches,
                'totalBikes' => $totalBikes,
            ],
            'analytics' => [
                'totalPageViews' => $totalPageViews,
                'totalUniqueVisitors' => $totalUniqueVisitors,
                'monthPageViews' => $monthPageViews,
                'monthUniqueVisitors' => $monthUniqueVisitors,
                'todayViews' => $todayViews,
                'todayUnique' => $todayUnique,
                'mobilePercentage' => $mobilePercentage,
                'desktopPercentage' => 100 - $mobilePercentage,
                'trafficTrend' => $trafficTrend,
                'topViewedMotorcycles' => $topViewedMotorcycles,
                'topSearches' => $topSearches,
                'regionalDemand' => $regionalDemand,
            ],
            'recentBookings' => $recentBookings,
            'recentRedemptions' => $recentRedemptions,
            'recentProspects' => $recentProspects,
        ]);
    }
}
