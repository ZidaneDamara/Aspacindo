<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\ServiceBooking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    public function index(): Response
    {
        $branches = Branch::active()
            ->select(['id', 'name', 'region', 'full_address', 'whatsapp_number'])
            ->get();

        return Inertia::render('Services', [
            'branches' => $branches,
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
