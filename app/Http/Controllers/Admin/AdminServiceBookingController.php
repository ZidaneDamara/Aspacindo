<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\ServiceBooking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminServiceBookingController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $branchId = $request->query('branch_id');

        $query = ServiceBooking::with('branch')->latest();

        if (!empty($status)) {
            $query->where('status', $status);
        }

        if (!empty($branchId)) {
            $query->where('branch_id', $branchId);
        }

        $bookings = $query->paginate(20)->withQueryString();
        $branches = Branch::active()->select(['id', 'name'])->get();

        return Inertia::render('Admin/ServiceBookings/Index', [
            'bookings' => $bookings,
            'branches' => $branches,
            'filters' => [
                'status' => $status ?? '',
                'branch_id' => $branchId ?? '',
            ],
        ]);
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,completed,cancelled',
        ]);

        $booking = ServiceBooking::findOrFail($id);
        $booking->update(['status' => $request->status]);

        return back()->with('success', 'Booking Service status updated to ' . $request->status);
    }
}
