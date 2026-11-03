<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Motorcycle;
use App\Models\MotorcycleColor;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminMotorcycleController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isSuperAdmin = $user->isSuperAdmin();
        $isBranchAdmin = $user->isBranchAdmin();
        $branch = $user?->branch;

        // Fetch distinct regions from branches table
        $regions = Branch::whereNotNull('region')
            ->where('region', '!=', '')
            ->orderBy('region')
            ->pluck('region')
            ->unique()
            ->values();

        // If Branch Admin, force selected region to their own branch region
        // If Super Admin, default to 'Semua' or chosen query param
        if ($isBranchAdmin && $branch) {
            $selectedRegion = $branch->region;
        } else {
            $selectedRegion = $request->query('region', 'Semua');
        }

        $search = $request->query('search', '');
        $category = $request->query('category', 'Semua');

        $query = Motorcycle::with(['primaryImage', 'colors'])->orderBy('name');

        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        if (!empty($category) && $category !== 'Semua') {
            $query->byCategory($category);
        }

        $motorcycles = $query->paginate(25)->withQueryString();

        $motorcycles->getCollection()->transform(function ($bike) use ($branch, $selectedRegion) {
            $regionalPrices = $bike->regional_prices ?? [];
            $bike->regional_prices_map = $regionalPrices;

            if ($branch) {
                $bike->branch_price = $bike->getPriceForRegion($branch->region);
            } elseif ($selectedRegion && $selectedRegion !== 'Semua') {
                $bike->selected_region_price = $bike->getPriceForRegion($selectedRegion);
            } else {
                $bike->selected_region_price = (int) $bike->price_otr;
            }

            return $bike;
        });

        return Inertia::render('Admin/Motorcycles/Index', [
            'motorcycles' => $motorcycles,
            'userBranch' => $branch,
            'isSuperAdmin' => $isSuperAdmin,
            'isBranchAdmin' => $isBranchAdmin,
            'regions' => $regions,
            'selectedRegion' => $selectedRegion,
            'filters' => [
                'search' => $search,
                'category' => $category,
                'region' => $selectedRegion,
            ],
        ]);
    }

    public function create(Request $request): Response
    {
        if ($request->user()->isBranchAdmin()) {
            abort(403, 'Akses ditolak. Hanya Super Admin yang dapat menambahkan motor baru.');
        }

        $regions = Branch::whereNotNull('region')
            ->where('region', '!=', '')
            ->orderBy('region')
            ->pluck('region')
            ->unique()
            ->values();

        return Inertia::render('Admin/Motorcycles/Form', [
            'regions' => $regions,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        if ($user->isBranchAdmin()) {
            abort(403, 'Akses ditolak. Hanya Super Admin yang dapat menambahkan motor baru.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:MAXi,Classy,Matic,Moped,Sport,Off-Road',
            'price_otr' => 'required|numeric|min:0',
            'regional_prices' => 'nullable|array',
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

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        if (Motorcycle::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . time();
        }
        $validated['slug'] = $slug;

        // Build default regional prices if not explicitly filled
        $regions = Branch::whereNotNull('region')
            ->where('region', '!=', '')
            ->pluck('region')
            ->unique()
            ->values();

        $regMap = [];
        foreach ($regions as $r) {
            $regMap[$r] = isset($validated['regional_prices'][$r]) && is_numeric($validated['regional_prices'][$r])
                ? (int) $validated['regional_prices'][$r]
                : (int) $validated['price_otr'];
        }
        $validated['regional_prices'] = $regMap;

        $motorcycle = Motorcycle::create($validated);

        // Sync branch prices for all regions
        foreach ($regMap as $rName => $rPrice) {
            $bIds = Branch::where('region', $rName)->pluck('id');
            foreach ($bIds as $bId) {
                $motorcycle->setPriceForBranch($bId, (int) $rPrice);
            }
        }
        $motorcycle->save();

        // Ensure storage directory exists
        $storageDir = public_path('storage/motorcycles');
        if (!file_exists($storageDir)) {
            mkdir($storageDir, 0755, true);
        }

        // Handle Primary Image Upload
        $primaryImagePath = $request->image_path;
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($motorcycle->name) . '.' . $file->getClientOriginalExtension();
            $file->move($storageDir, $filename);
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

                if ($request->hasFile("colors.{$index}.color_image_file")) {
                    $colorFile = $request->file("colors.{$index}.color_image_file");
                    $cFilename = time() . '_color_' . $index . '_' . Str::slug($colorData['color_name']) . '.' . $colorFile->getClientOriginalExtension();
                    $colorFile->move($storageDir, $cFilename);
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

        return redirect()->route('admin.motorcycles.index')->with('success', "Produk motor {$motorcycle->name} berhasil ditambahkan!");
    }

    public function edit(Request $request, int $id): Response
    {
        $user = $request->user();
        $motorcycle = Motorcycle::with(['images', 'colors', 'primaryImage'])->findOrFail($id);

        $regions = Branch::whereNotNull('region')
            ->where('region', '!=', '')
            ->orderBy('region')
            ->pluck('region')
            ->unique()
            ->values();

        return Inertia::render('Admin/Motorcycles/Form', [
            'motorcycle' => $motorcycle,
            'regions' => $regions,
            'userBranch' => $user->branch,
            'isSuperAdmin' => $user->isSuperAdmin(),
            'isBranchAdmin' => $user->isBranchAdmin(),
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = $request->user();
        $motorcycle = Motorcycle::findOrFail($id);

        // Branch Admin: Can ONLY update price for their own region
        if ($user->isBranchAdmin()) {
            if (!$user->branch) {
                abort(403, 'Akun Anda belum terhubung ke cabang.');
            }

            $validated = $request->validate([
                'price_regional' => 'required|numeric|min:0',
            ]);

            $region = $user->branch->region;
            $newPrice = (int) $validated['price_regional'];

            $regional = $motorcycle->regional_prices ?? [];
            $regional[$region] = $newPrice;
            $motorcycle->regional_prices = $regional;

            $branchIds = Branch::where('region', $region)->pluck('id');
            foreach ($branchIds as $bId) {
                $motorcycle->setPriceForBranch($bId, $newPrice);
            }
            $motorcycle->save();

            return redirect()->route('admin.motorcycles.index')->with('success', "Harga OTR {$motorcycle->name} wilayah {$region} berhasil diperbarui!");
        }

        // Super Admin: Full edit access
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|in:MAXi,Classy,Matic,Moped,Sport,Off-Road',
            'price_otr' => 'required|numeric|min:0',
            'regional_prices' => 'nullable|array',
            'short_description' => 'nullable|string',
            'full_specifications' => 'nullable|array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'image_path' => 'nullable|string',
            'colors' => 'nullable|array',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        if (Motorcycle::where('slug', $slug)->where('id', '!=', $id)->exists()) {
            $slug = $baseSlug . '-' . $id;
        }
        $validated['slug'] = $slug;

        // If regional_prices supplied, update and sync
        if ($request->has('regional_prices') && is_array($request->regional_prices)) {
            $regMap = $motorcycle->regional_prices ?? [];
            foreach ($request->regional_prices as $rName => $rPrice) {
                if (is_numeric($rPrice)) {
                    $regMap[$rName] = (int) $rPrice;
                    $bIds = Branch::where('region', $rName)->pluck('id');
                    foreach ($bIds as $bId) {
                        $motorcycle->setPriceForBranch($bId, (int) $rPrice);
                    }
                }
            }
            $validated['regional_prices'] = $regMap;
        }

        $motorcycle->update($validated);

        // Ensure storage directory exists
        $storageDir = public_path('storage/motorcycles');
        if (!file_exists($storageDir)) {
            mkdir($storageDir, 0755, true);
        }

        // Handle Primary Image Upload
        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $filename = time() . '_' . Str::slug($motorcycle->name) . '.' . $file->getClientOriginalExtension();
            $file->move($storageDir, $filename);
            $newImagePath = '/storage/motorcycles/' . $filename;

            $motorcycle->images()->where('is_primary', true)->delete();
            $motorcycle->images()->create([
                'image_path' => $newImagePath,
                'is_primary' => true,
                'sort_order' => 1,
            ]);
        } elseif ($request->filled('image_path')) {
            $primary = $motorcycle->primaryImage;
            if (!$primary || $primary->image_path !== $request->image_path) {
                $motorcycle->images()->where('is_primary', true)->delete();
                $motorcycle->images()->create([
                    'image_path' => $request->image_path,
                    'is_primary' => true,
                    'sort_order' => 1,
                ]);
            }
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
                        $colorFile->move($storageDir, $cFilename);
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

        return redirect()->route('admin.motorcycles.index')->with('success', "Data Produk Motor {$motorcycle->name} berhasil diperbarui!");
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        if ($request->user()->isBranchAdmin()) {
            abort(403, 'Akses ditolak. Admin Cabang tidak diperkenankan menghapus data master motor.');
        }

        $motorcycle = Motorcycle::findOrFail($id);
        $name = $motorcycle->name;

        // Clean up files if they exist locally
        foreach ($motorcycle->images as $img) {
            if ($img->image_path && str_starts_with($img->image_path, '/storage/motorcycles/')) {
                $filePath = public_path(ltrim($img->image_path, '/'));
                if (file_exists($filePath)) {
                    @unlink($filePath);
                }
            }
        }

        $motorcycle->images()->delete();
        $motorcycle->colors()->delete();
        $motorcycle->delete();

        return redirect()->route('admin.motorcycles.index')->with('success', "Data Produk Motor {$name} berhasil dihapus!");
    }

    public function updateRegionalPrice(Request $request, int $id): RedirectResponse
    {
        $user = $request->user();
        $motorcycle = Motorcycle::findOrFail($id);
        $region = $request->input('region');

        if ($user->isBranchAdmin()) {
            if (!$user->branch || $user->branch->region !== $region) {
                abort(403, 'Akses ditolak. Anda hanya berwenang mengubah harga untuk wilayah ' . ($user->branch?->region ?? '-'));
            }
        }

        $validated = $request->validate([
            'region' => 'required|string',
            'price_otr' => 'required|numeric|min:0',
        ]);

        $price = (int) $validated['price_otr'];
        $regional = $motorcycle->regional_prices ?? [];
        $regional[$region] = $price;
        $motorcycle->regional_prices = $regional;

        $branchIds = Branch::where('region', $region)->pluck('id');
        foreach ($branchIds as $bId) {
            $motorcycle->setPriceForBranch($bId, $price);
        }

        $motorcycle->save();

        return back()->with('success', "Harga OTR {$motorcycle->name} wilayah {$region} berhasil disimpan!");
    }

    public function updateBulkRegionalPrice(Request $request): RedirectResponse
    {
        $user = $request->user();
        $region = $request->input('region');

        if ($user->isBranchAdmin()) {
            if (!$user->branch || $user->branch->region !== $region) {
                abort(403, 'Akses ditolak. Anda hanya berwenang mengubah harga untuk wilayah ' . ($user->branch?->region ?? '-'));
            }
        }

        $validated = $request->validate([
            'region' => 'required|string',
            'prices' => 'required|array',
            'prices.*' => 'required|numeric|min:0',
        ]);

        $branchIds = Branch::where('region', $region)->pluck('id');

        foreach ($validated['prices'] as $motorcycleId => $price) {
            $motorcycle = Motorcycle::find($motorcycleId);
            if ($motorcycle) {
                $regional = $motorcycle->regional_prices ?? [];
                $regional[$region] = (int) $price;
                $motorcycle->regional_prices = $regional;

                foreach ($branchIds as $bId) {
                    $motorcycle->setPriceForBranch($bId, (int) $price);
                }
                $motorcycle->save();
            }
        }

        return back()->with('success', "Semua harga OTR untuk wilayah {$region} berhasil diperbarui!");
    }
}
