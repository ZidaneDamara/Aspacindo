<?php

namespace App\Http\Controllers;

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
        $galleries = [
            [
                'id' => 1,
                'title' => 'Grand Opening Cabang Sudirman Pekanbaru',
                'category' => 'Acara & Event',
                'image' => '/assets/images/gallery/opening_sudirman.webp',
                'date' => '15 Mei 2025',
            ],
            [
                'id' => 2,
                'title' => 'Yamaha MAXi Day Riau Touring & Gathering',
                'category' => 'Komunitas',
                'image' => '/assets/images/gallery/maxi_day.webp',
                'date' => '20 Februari 2025',
            ],
            [
                'id' => 3,
                'title' => 'Pelatihan & Sertifikasi Teknisi Yamaha SKY',
                'category' => 'Edukasi & Servis',
                'image' => '/assets/images/gallery/sky_training.webp',
                'date' => '10 Januari 2025',
            ],
            [
                'id' => 4,
                'title' => 'Penyerahan Unit Pertama Yamaha NMAX Turbo',
                'category' => 'Serah Terima Unit',
                'image' => '/assets/images/gallery/handover_nmax.webp',
                'date' => '05 Juli 2024',
            ],
        ];

        return Inertia::render('Gallery', [
            'galleries' => $galleries,
        ]);
    }
}
