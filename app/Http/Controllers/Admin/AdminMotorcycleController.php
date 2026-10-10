<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Motorcycle;
use App\Models\MotorcycleColor;
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
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'image_path' => 'nullable|string',
            'colors' => 'nullable|array',
            'colors.*.color_name' => 'required|string',
            'colors.*.hex_code' => 'required|string',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $motorcycle = Motorcycle::create($validated);

        // Handle Primary Image Upload
        $primaryImagePath = $request->image_path;
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($motorcycle->name) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/motorcycles'), $filename);
            $primaryImagePath = '/storage/motorcycles/' . $filename;
        }

        if ($primaryImagePath) {
            $motorcycle->images()->create([
                'image_path' => $primaryImagePath,
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        }

        // Handle Color Variants Upload/Save
        if ($request->filled('colors')) {
            foreach ($request->colors as $index => $colorData) {
                $colorImagePath = $primaryImagePath;
                
                // Check if file uploaded for this color index
                if ($request->hasFile("colors.{$index}.color_image_file")) {
                    $colorFile = $request->file("colors.{$index}.color_image_file");
                    $cFilename = time() . '_color_' . $index . '_' . Str::slug($colorData['color_name']) . '.' . $colorFile->getClientOriginalExtension();
                    $colorFile->move(public_path('storage/motorcycles'), $cFilename);
                    $colorImagePath = '/storage/motorcycles/' . $cFilename;
                } elseif (!empty($colorData['image_path'])) {
                    $colorImagePath = $colorData['image_path'];
                }

                $motorcycle->colors()->create([
                    'color_name' => $colorData['color_name'],
                    'hex_code' => $colorData['hex_code'],
                    'image_path' => $colorImagePath,
                ]);
            }
        }

        return redirect()->route('admin.motorcycles.index')->with('success', 'Data Motor berhasil ditambahkan!');
    }

    public function edit(int $id): Response
    {
        $motorcycle = Motorcycle::with(['images', 'colors', 'primaryImage'])->findOrFail($id);

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
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'image_path' => 'nullable|string',
            'colors' => 'nullable|array',
        ]);

        $validated['slug'] = Str::slug($validated['name']);
        $motorcycle->update($validated);

        // Handle Primary Image Upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($motorcycle->name) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/motorcycles'), $filename);
            $newImagePath = '/storage/motorcycles/' . $filename;

            $motorcycle->images()->where('is_primary', true)->delete();
            $motorcycle->images()->create([
                'image_path' => $newImagePath,
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        } elseif ($request->filled('image_path')) {
            $motorcycle->images()->where('is_primary', true)->delete();
            $motorcycle->images()->create([
                'image_path' => $request->image_path,
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        }

        // Handle Colors Update
        if ($request->has('colors')) {
            $motorcycle->colors()->delete();
            if (is_array($request->colors)) {
                $primaryImg = $motorcycle->primaryImage ? $motorcycle->primaryImage->image_path : '';
                foreach ($request->colors as $index => $colorData) {
                    $colorImagePath = !empty($colorData['image_path']) ? $colorData['image_path'] : $primaryImg;

                    if ($request->hasFile("colors.{$index}.color_image_file")) {
                        $colorFile = $request->file("colors.{$index}.color_image_file");
                        $cFilename = time() . '_color_' . $index . '_' . Str::slug($colorData['color_name']) . '.' . $colorFile->getClientOriginalExtension();
                        $colorFile->move(public_path('storage/motorcycles'), $cFilename);
                        $colorImagePath = '/storage/motorcycles/' . $cFilename;
                    }

                    if (!empty($colorData['color_name'])) {
                        $motorcycle->colors()->create([
                            'color_name' => $colorData['color_name'],
                            'hex_code' => $colorData['hex_code'] ?? '#000000',
                            'image_path' => $colorImagePath,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('admin.motorcycles.index')->with('success', 'Data Motor berhasil diperbarui!');
    }

    public function destroy(int $id): RedirectResponse
    {
        $motorcycle = Motorcycle::findOrFail($id);
        $motorcycle->images()->delete();
        $motorcycle->colors()->delete();
        $motorcycle->delete();

        return back()->with('success', 'Data Motor berhasil dihapus!');
    }
}
