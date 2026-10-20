<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Branch;
use App\Models\Motorcycle;
use App\Models\Promotion;
use App\Models\Setting;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public const VALID_REGIONS = [
        'Pekanbaru',
        'Siak',
        'Kampar',
        'Pelalawan',
        'Indragiri Hulu',
        'Indragiri Hilir',
        'Medan',
    ];

    public function __invoke(Request $request): Response
    {
        $region = $request->query('region', 'Pekanbaru');
        if (!in_array($region, self::VALID_REGIONS)) {
            $region = 'Pekanbaru';
        }

        $featuredMotorcycles = Motorcycle::active()
            ->featured()
            ->with(['primaryImage', 'colors'])
            ->take(8)
            ->get();

        $featuredMotorcycles->transform(function ($motorcycle) use ($region) {
            $motorcycle->price_otr = $motorcycle->getPriceForRegion($region);
            $motorcycle->selected_region = $region;
            return $motorcycle;
        });

        $offRoadCount = Motorcycle::active()->byCategory('Off-Road')->count();

        $categories = [
            'MAXi' => Motorcycle::active()->byCategory('MAXi')->count(),
            'Classy' => Motorcycle::active()->byCategory('Classy')->count(),
            'Matic' => Motorcycle::active()->byCategory('Matic')->count(),
            'Sport' => Motorcycle::active()->byCategory('Sport')->count(),
            'Off-Road' => $offRoadCount,
            'OffRoad' => $offRoadCount,
            'Moped' => Motorcycle::active()->byCategory('Moped')->count(),
        ];

        $latestArticles = Article::published()
            ->latest('published_at')
            ->take(3)
            ->get();

        $activePromotions = Promotion::active()
            ->latest()
            ->take(3)
            ->get();

        $featuredTestimonials = Testimonial::featured()
            ->with('branch')
            ->take(6)
            ->get();

        $stats = [
            'years_operating' => Setting::get('stat_years_operating', '15+'),
            'branches_count' => Setting::get('stat_branches_count', '20+'),
            'employees_count' => Setting::get('stat_employees_count', '150+'),
            'satisfied_customers' => Setting::get('stat_satisfied_customers', '50,000+'),
            'awards_won' => Setting::get('stat_awards_won', '25+'),
        ];

        return Inertia::render('Home', [
            'featuredMotorcycles' => $featuredMotorcycles,
            'categories' => $categories,
            'regions' => self::VALID_REGIONS,
            'selectedRegion' => $region,
            'latestArticles' => $latestArticles,
            'activePromotions' => $activePromotions,
            'featuredTestimonials' => $featuredTestimonials,
            'stats' => $stats,
        ]);
    }
}
