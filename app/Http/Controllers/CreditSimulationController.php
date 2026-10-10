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
    public function index(Request $request): Response
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
            'dp_percent' => 'required|numeric|min:10|max:50',
            'tenor_months' => 'required|integer|in:12,24,36,48,60',
            'leasing_partner' => 'required|string|max:255',
            'notes' => 'nullable|string|max:1000',
        ]);

        $motorcycle = Motorcycle::findOrFail($validated['motorcycle_id']);
        $priceOtr = (float) $motorcycle->price_otr;
        $dpPercent = (int) $validated['dp_percent'];
        $dpAmount = ($priceOtr * $dpPercent) / 100;
        $principalLoan = $priceOtr - $dpAmount;

        // Rate modifiers map
        $modifiers = [
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
            'city' => $validated['city'] ?? null,
            'current_motorcycle' => $validated['current_motorcycle'] ?? null,
            'motorcycle_id' => $motorcycle->id,
            'motorcycle_name' => $motorcycle->name,
            'price_otr' => $priceOtr,
            'dp_amount' => $dpAmount,
            'dp_percent' => $dpPercent,
            'tenor_months' => $tenorMonths,
            'leasing_partner' => $validated['leasing_partner'],
            'monthly_installment' => $monthlyPayment,
            'notes' => $validated['notes'] ?? null,
            'status' => 'new',
        ]);

        return back()->with([
            'success' => "Pengajuan simulasi kredit Anda (Tiket: {$ticketNumber}) telah tersimpan ke sistem!",
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
            ],
        ]);
    }
}
