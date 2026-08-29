<?php

namespace App\Http\Controllers;

use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreditSimulationController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $selectedSlug = $request->query('motorcycle');

        $motorcycles = Motorcycle::active()
            ->select(['id', 'name', 'slug', 'category', 'price_otr'])
            ->with('primaryImage')
            ->orderBy('name', 'asc')
            ->get();

        $leasingPartners = [
            ['id' => 'baf', 'name' => 'BAF (Bussan Auto Finance)', 'rate_modifier' => 1.0],
            ['id' => 'adira', 'name' => 'Adira Finance', 'rate_modifier' => 1.02],
            ['id' => 'oto', 'name' => 'OTO Kredit Motor', 'rate_modifier' => 1.03],
            ['id' => 'wom', 'name' => 'WOM Finance', 'rate_modifier' => 1.01],
        ];

        return Inertia::render('CreditSimulation', [
            'motorcycles' => $motorcycles,
            'selectedSlug' => $selectedSlug,
            'leasingPartners' => $leasingPartners,
        ]);
    }
}
