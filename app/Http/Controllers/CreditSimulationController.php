<?php

namespace App\Http\Controllers;

use App\Models\Motorcycle;
use App\Models\Prospect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CreditSimulationController extends Controller
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

    public function index(Request $request): Response
    {
        $selectedSlug = $request->query('motorcycle');
        $region = $request->query('region', 'Pekanbaru');
        if (!in_array($region, self::VALID_REGIONS)) {
            $region = 'Pekanbaru';
        }

        $motorcycles = Motorcycle::active()
            ->select(['id', 'name', 'slug', 'category', 'price_otr', 'regional_prices'])
            ->with('primaryImage')
            ->orderBy('name', 'asc')
            ->get();

        $motorcycles->transform(function ($bike) use ($region) {
            $bike->price_otr = $bike->getPriceForRegion($region);
            $bike->selected_region = $region;
            return $bike;
        });

        $leasingPartners = [
            ['id' => 'baf', 'code' => 'BAF', 'name' => 'Busan Auto Finance (BAF)', 'rate_modifier' => 1.0],
            ['id' => 'adira', 'code' => 'Adira', 'name' => 'Adira Finance (Adira)', 'rate_modifier' => 1.02],
            ['id' => 'imfi', 'code' => 'ImFi', 'name' => 'Indomobil Finance (ImFi)', 'rate_modifier' => 1.01],
            ['id' => 'sof', 'code' => 'SOF', 'name' => 'Summit Oto Finance (SOF)', 'rate_modifier' => 1.03],
        ];

        return Inertia::render('CreditSimulation', [
            'motorcycles' => $motorcycles,
            'selectedSlug' => $selectedSlug,
            'regions' => self::VALID_REGIONS,
            'selectedRegion' => $region,
            'leasingPartners' => $leasingPartners,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:30',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:1000',
            'city' => 'nullable|string|max:255',
            'current_motorcycle' => 'nullable|string|max:255',
            'motorcycle_id' => 'required|exists:motorcycles,id',
            'region' => 'nullable|string|max:50',
            'dp_percent' => 'required|numeric|min:10|max:50',
            'tenor_months' => 'required|integer|in:12,24,36,48,60',
            'leasing_partner' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $motorcycle = Motorcycle::findOrFail($validated['motorcycle_id']);
        $region = $validated['region'] ?? 'Pekanbaru';
        $priceOtr = (float) $motorcycle->getPriceForRegion($region);
        $dpPercent = (int) $validated['dp_percent'];
        $dpAmount = ($priceOtr * $dpPercent) / 100;
        $principalLoan = $priceOtr - $dpAmount;

        // Rate modifiers map
        $modifiers = [
            'Busan Auto Finance (BAF)' => 1.0,
            'Adira Finance (Adira)' => 1.02,
            'Indomobil Finance (ImFi)' => 1.01,
            'Summit Oto Finance (SOF)' => 1.03,
            'BAF (Bussan Auto Finance)' => 1.0,
            'Adira Finance' => 1.02,
            'OTO Kredit Motor' => 1.03,
            'WOM Finance' => 1.01,
        ];
        $rateModifier = $modifiers[$validated['leasing_partner']] ?? 1.0;
        $tenorMonths = (int) $validated['tenor_months'];

        $baseInterestRate = 0.09 * $rateModifier;
        $totalInterest = $principalLoan * ($baseInterestRate * ($tenorMonths / 12));
        $monthlyPayment = round(($principalLoan + $totalInterest) / $tenorMonths);

        $ticketNumber = Prospect::generateTicketNumber();

        $prospect = Prospect::create([
            'ticket_number' => $ticketNumber,
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'] ?? null,
            'address' => $validated['address'] ?? null,
            'city' => $validated['city'] ?? $region,
            'current_motorcycle' => $validated['current_motorcycle'] ?? null,
            'motorcycle_id' => $motorcycle->id,
            'motorcycle_name' => $motorcycle->name,
            'price_otr' => $priceOtr,
            'dp_amount' => $dpAmount,
            'dp_percent' => $dpPercent,
            'tenor_months' => $tenorMonths,
            'leasing_partner' => $validated['leasing_partner'],
            'monthly_installment' => $monthlyPayment,
            'notes' => ($validated['notes'] ? $validated['notes'] . " | " : "") . "Wilayah OTR: " . $region,
            'status' => 'new',
        ]);

        return back()->with([
            'success' => "Pengajuan simulasi kredit Anda (Tiket: {$ticketNumber}) wilayah {$region} telah tersimpan ke sistem!",
            'submittedProspect' => [
                'ticket_number' => $prospect->ticket_number,
                'name' => $prospect->name,
                'phone' => $prospect->phone,
                'motorcycle_name' => $prospect->motorcycle_name,
                'price_otr' => $prospect->price_otr,
                'dp_amount' => $prospect->dp_amount,
                'dp_percent' => $prospect->dp_percent,
                'tenor_months' => $prospect->tenor_months,
                'leasing_partner' => $prospect->leasing_partner,
                'monthly_installment' => $prospect->monthly_installment,
                'region' => $region,
            ],
        ]);
    }
}
