<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sparepart;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminSparepartController extends Controller
{
    public function index(): Response
    {
        $spareparts = Sparepart::orderBy('category')->orderBy('name')->paginate(15);
        return Inertia::render('Admin/Spareparts/Index', [
            'spareparts' => $spareparts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Spareparts/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Sparepart,Pelumas,Ban,Busi,Pengereman,Kelistrikan',
            'price' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'image_url' => 'nullable|string',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($validated['name']) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/spareparts'), $filename);
            $validated['image_url'] = '/storage/spareparts/' . $filename;
        }

        Sparepart::create($validated);
        return redirect()->route('admin.spareparts.index')->with('success', 'Produk Sparepart berhasil ditambahkan!');
    }

    public function edit(int $id): Response
    {
        $sparepart = Sparepart::findOrFail($id);
        return Inertia::render('Admin/Spareparts/Form', [
            'sparepart' => $sparepart,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $sparepart = Sparepart::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:Sparepart,Pelumas,Ban,Busi,Pengereman,Kelistrikan',
            'price' => 'required|integer|min:0',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'image_url' => 'nullable|string',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($validated['name']) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/spareparts'), $filename);
            $validated['image_url'] = '/storage/spareparts/' . $filename;
        }

        $sparepart->update($validated);
        return redirect()->route('admin.spareparts.index')->with('success', 'Produk Sparepart berhasil diperbarui!');
    }

    public function destroy(int $id): RedirectResponse
    {
        Sparepart::findOrFail($id)->delete();
        return back()->with('success', 'Produk Sparepart berhasil dihapus!');
    }
}
