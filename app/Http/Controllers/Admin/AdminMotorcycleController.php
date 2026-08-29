<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Motorcycle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminMotorcycleController extends Controller
{
    public function index(): Response
    {
        $motorcycles = Motorcycle::with(['primaryImage', 'colors'])
            ->latest()
            ->paginate(15);

        return Inertia::render('Admin/Motorcycles/Index', [
            'motorcycles' => $motorcycles,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Motorcycles/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:MAXi,Classy,Matic,Moped,Sport,Off-Road',
            'price_otr' => 'required|numeric|min:0',
            'short_description' => 'nullable|string',
            'full_specifications' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'image_path' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $motorcycle = Motorcycle::create($validated);

        if ($request->filled('image_path')) {
            $motorcycle->images()->create([
                'image_path' => $request->image_path,
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        }

        return redirect()->route('admin.motorcycles.index')->with('success', 'Motorcycle created successfully!');
    }

    public function edit(int $id): Response
    {
        $motorcycle = Motorcycle::with(['images', 'colors'])->findOrFail($id);

        return Inertia::render('Admin/Motorcycles/Form', [
            'motorcycle' => $motorcycle,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $motorcycle = Motorcycle::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:MAXi,Classy,Matic,Moped,Sport,Off-Road',
            'price_otr' => 'required|numeric|min:0',
            'short_description' => 'nullable|string',
            'full_specifications' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $motorcycle->update($validated);

        return redirect()->route('admin.motorcycles.index')->with('success', 'Motorcycle updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {
        $motorcycle = Motorcycle::findOrFail($id);
        $motorcycle->delete();

        return back()->with('success', 'Motorcycle deleted successfully!');
    }
}
