<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\ServicePrice;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WorkshopController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedRegion = $request->query('region', 'Semua');

        // Dynamic Bengkel Branches (where has_service_center = 1)
        $branchesQuery = Branch::active()->serviceCenter();

        if ($selectedRegion && $selectedRegion !== 'Semua') {
            $branchesQuery->where('region', $selectedRegion);
        }

        $branches = $branchesQuery->orderBy('name')->get();

        // Dynamic Service Prices grouped by category
        $servicePrices = ServicePrice::active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->groupBy('category');

        $regions = ['Semua', 'Pekanbaru', 'Pelalawan', 'Siak', 'Kampar', 'Medan', 'Indragiri Hulu'];

        return Inertia::render('Bengkel/Index', [
            'servicePrices' => $servicePrices,
            'branches' => $branches,
            'regions' => $regions,
            'filters' => [
                'region' => $selectedRegion,
            ],
        ]);
    }
}
