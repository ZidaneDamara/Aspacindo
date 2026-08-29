<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminBranchController extends Controller
{
    public function index(): Response
    {
        $branches = Branch::latest()->paginate(15);
        return Inertia::render('Admin/Branches/Index', ['branches' => $branches]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Branches/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'region' => 'required|in:Pekanbaru,Pelalawan,Siak,Kampar,Medan,Indragiri Hulu',
            'full_address' => 'required|string',
            'whatsapp_number' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'google_maps_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        Branch::create($validated);
        return redirect()->route('admin.branches.index')->with('success', 'Branch created successfully!');
    }

    public function edit(int $id): Response
    {
        $branch = Branch::findOrFail($id);
        return Inertia::render('Admin/Branches/Form', ['branch' => $branch]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $branch = Branch::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'region' => 'required|in:Pekanbaru,Pelalawan,Siak,Kampar,Medan,Indragiri Hulu',
            'full_address' => 'required|string',
            'whatsapp_number' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'google_maps_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $branch->update($validated);

        return redirect()->route('admin.branches.index')->with('success', 'Branch updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {
        Branch::findOrFail($id)->delete();
        return back()->with('success', 'Branch deleted successfully!');
    }
}
