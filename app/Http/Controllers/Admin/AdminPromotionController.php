<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminPromotionController extends Controller
{
    public function index(): Response
    {
        $promotions = Promotion::latest()->paginate(15);
        return Inertia::render('Admin/Promotions/Index', ['promotions' => $promotions]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Promotions/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'banner_image' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        Promotion::create($validated);

        return redirect()->route('admin.promotions.index')->with('success', 'Promotion created successfully!');
    }

    public function edit(int $id): Response
    {
        $promotion = Promotion::findOrFail($id);
        return Inertia::render('Admin/Promotions/Form', ['promotion' => $promotion]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $promotion = Promotion::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'banner_image' => 'required|string',
            'description' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $promotion->update($validated);

        return redirect()->route('admin.promotions.index')->with('success', 'Promotion updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {
        Promotion::findOrFail($id)->delete();
        return back()->with('success', 'Promotion deleted successfully!');
    }
}
