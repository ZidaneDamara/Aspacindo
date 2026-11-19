<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Branch;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class CompanyController extends Controller
{
    public function about(): Response
    {
        $stats = [
            'years_operating' => Setting::get('stat_years_operating', '15+'),
            'branches_count' => Setting::get('stat_branches_count', '20+'),
            'employees_count' => Setting::get('stat_employees_count', '150+'),
            'satisfied_customers' => Setting::get('stat_satisfied_customers', '50,000+'),
            'awards_won' => Setting::get('stat_awards_won', '25+'),
        ];

        $totalBranches = Branch::active()->count();

        return Inertia::render('About', [
            'stats' => $stats,
            'totalBranches' => $totalBranches,
        ]);
    }

    public function gallery(): Response
    {
        $galleries = Activity::active()
            ->orderBy('sort_order', 'asc')
            ->orderBy('event_date', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'title' => $item->title,
                    'category' => $item->category,
                    'image' => $item->image_url,
                    'date' => $item->formatted_date,
                    'description' => $item->description,
                ];
            });

        $categories = ['Semua', 'Acara & Event', 'Komunitas', 'Edukasi & Servis', 'Serah Terima Unit', 'Sosial & CSR'];

        return Inertia::render('Gallery', [
            'galleries' => $galleries,
            'categories' => $categories,
        ]);
    }
}
