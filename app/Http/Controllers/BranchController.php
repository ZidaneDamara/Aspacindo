<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BranchController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $selectedRegion = $request->query('region', 'Semua');

        $regions = ['Semua', 'Pekanbaru', 'Pelalawan', 'Siak', 'Kampar', 'Medan', 'Indragiri Hulu'];

        $branches = Branch::active()
            ->byRegion($selectedRegion)
            ->get();

        return Inertia::render('Branches/Index', [
            'branches' => $branches,
            'regions' => $regions,
            'selectedRegion' => $selectedRegion,
        ]);
    }
}
