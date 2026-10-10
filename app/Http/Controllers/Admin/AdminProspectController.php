<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Prospect;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminProspectController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $status = $request->query('status');

        $query = Prospect::with('motorcycle')->latest();

        if (!empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('ticket_number', 'like', "%{$search}%")
                  ->orWhere('motorcycle_name', 'like', "%{$search}%")
                  ->orWhere('city', 'like', "%{$search}%");
            });
        }

        if (!empty($status)) {
            $query->where('status', $status);
        }

        $prospects = $query->paginate(15)->withQueryString();

        $stats = [
            'total' => Prospect::count(),
            'new' => Prospect::where('status', 'new')->count(),
            'contacted' => Prospect::where('status', 'contacted')->count(),
            'prospect' => Prospect::where('status', 'prospect')->count(),
            'deal' => Prospect::where('status', 'deal')->count(),
            'rejected' => Prospect::where('status', 'rejected')->count(),
        ];

        return Inertia::render('Admin/Prospects/Index', [
            'prospects' => $prospects,
            'stats' => $stats,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status ?? '',
            ],
        ]);
    }

    public function updateStatus(Request $request, int $id): RedirectResponse
    {
        $request->validate([
            'status' => 'required|in:new,contacted,prospect,deal,rejected',
            'follow_up_notes' => 'nullable|string|max:2000',
        ]);

        $prospect = Prospect::findOrFail($id);
        $prospect->update([
            'status' => $request->status,
            'follow_up_notes' => $request->follow_up_notes,
        ]);

        return back()->with('success', "Status prospect {$prospect->ticket_number} ({$prospect->name}) berhasil diperbarui.");
    }

    public function destroy(int $id): RedirectResponse
    {
        $prospect = Prospect::findOrFail($id);
        $name = $prospect->name;
        $prospect->delete();

        return back()->with('success', "Data prospect customer {$name} berhasil dihapus.");
    }
}
