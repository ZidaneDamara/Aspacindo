<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\ServiceBooking;
use App\Models\ServicePrice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(Request $request): Response
    {
        $selectedRegion = $request->query('region', 'Semua');

        // Dynamic Bengkel Branches (where has_service_center = 1)
        $branchesQuery = Branch::active()->serviceCenter();

        if ($selectedRegion && $selectedRegion !== 'Semua') {
            $branchesQuery->where('region', $selectedRegion);
        }

        $bengkelBranches = $branchesQuery->orderBy('name')->get();

        // All active branches for dropdown booking selection
        $allBranches = Branch::active()->select(['id', 'name', 'region', 'full_address', 'whatsapp_number'])->get();

        // Dynamic Service Prices grouped by category
        $servicePrices = ServicePrice::active()
            ->orderBy('sort_order')
            ->orderBy('id')
            ->get()
            ->groupBy('category');

        $regions = ['Semua', 'Pekanbaru', 'Pelalawan', 'Siak', 'Kampar', 'Medan', 'Indragiri Hulu'];

        return Inertia::render('Services', [
            'servicePrices' => $servicePrices,
            'bengkelBranches' => $bengkelBranches,
            'branches' => $allBranches,
            'regions' => $regions,
            'filters' => [
                'region' => $selectedRegion,
            ],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'motorcycle_model' => 'required|string|max:255',
            'branch_id' => 'required|exists:branches,id',
            'preferred_date' => 'required|date|after_or_equal:today',
            'preferred_time' => 'required|string|max:50',
            'service_type' => 'required|in:Booking Service,Layanan SKY',
            'notes' => 'nullable|string|max:500',
        ]);

        $validated['booking_code'] = 'SRV-' . strtoupper(Str::random(6));
        $validated['status'] = 'pending';

        $booking = ServiceBooking::create($validated);

        return back()->with('success', [
            'message' => 'Permohonan Booking Service berhasil dikirim!',
            'booking_code' => $booking->booking_code,
        ]);
    }
}
