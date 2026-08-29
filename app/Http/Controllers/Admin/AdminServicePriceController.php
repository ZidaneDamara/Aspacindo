<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServicePrice;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminServicePriceController extends Controller
{
    public function index(): Response
    {
        $prices = ServicePrice::orderBy('category')->orderBy('sort_order')->get();
        return Inertia::render('Admin/ServicePrices/Index', [
            'prices' => $prices,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category' => 'required|in:Reguler,Perbaikan Ringan,Perbaikan Berat',
            'repair_type' => 'required|string|max:255',
            'price_moped' => 'nullable|integer',
            'price_sport' => 'nullable|integer',
            'price_matic' => 'nullable|integer',
            'price_matic_premium' => 'nullable|integer',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        ServicePrice::create($validated);
        return back()->with('success', 'Biaya service berhasil ditambahkan!');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $price = ServicePrice::findOrFail($id);

        $validated = $request->validate([
            'category' => 'required|in:Reguler,Perbaikan Ringan,Perbaikan Berat',
            'repair_type' => 'required|string|max:255',
            'price_moped' => 'nullable|integer',
            'price_sport' => 'nullable|integer',
            'price_matic' => 'nullable|integer',
            'price_matic_premium' => 'nullable|integer',
            'sort_order' => 'nullable|integer',
            'is_active' => 'boolean',
        ]);

        $price->update($validated);
        return back()->with('success', 'Biaya service berhasil diperbarui!');
    }

    public function destroy(int $id): RedirectResponse
    {
        ServicePrice::findOrFail($id)->delete();
        return back()->with('success', 'Biaya service berhasil dihapus!');
    }
}
