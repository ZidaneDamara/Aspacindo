<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Motorcycle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminBranchPriceController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();
        $isBranchAdmin = $user->isBranchAdmin();
        $isSuperAdmin = $user->isSuperAdmin();

        $allBranches = Branch::orderBy('region')->orderBy('name')->get();

        if ($isBranchAdmin) {
            $userBranch = $user->branch;
            if (!$userBranch) {
                abort(403, 'Akun Anda belum ditautkan ke cabang mana pun. Silakan hubungi Administrator Pusat.');
            }
            // Branch admin sees branches in their region
            $availableBranches = $allBranches->where('region', $userBranch->region)->values();
            $requestedBranchId = $request->query('branch_id');
            $selectedBranch = $requestedBranchId
                ? $availableBranches->firstWhere('id', (int) $requestedBranchId)
                : $availableBranches->firstWhere('id', $userBranch->id);

            if (!$selectedBranch) {
                $selectedBranch = $userBranch;
            }
        } else {
            // Super Admin can choose any branch
            $requestedBranchId = $request->query('branch_id');
            $selectedBranch = $requestedBranchId
                ? $allBranches->firstWhere('id', (int) $requestedBranchId)
                : $allBranches->first();

            $availableBranches = $allBranches;
        }

        if (!$selectedBranch) {
            abort(404, 'Cabang tidak ditemukan.');
        }

        $motorcycles = Motorcycle::with('primaryImage')
            ->orderBy('name')
            ->get()
            ->map(function (Motorcycle $bike) use ($selectedBranch) {
                return [
                    'id' => $bike->id,
                    'name' => $bike->name,
                    'slug' => $bike->slug,
                    'category' => $bike->category,
                    'image_url' => $bike->primaryImage?->image_path ?? '/assets/images/placeholder_bike.webp',
                    'price_otr_base' => (int) $bike->price_otr,
                    'price_regional' => (int) $bike->getPriceForRegion($selectedBranch->region),
                    'price_branch_current' => (int) $bike->getPriceForBranch($selectedBranch),
                    'is_custom_branch_price' => !empty($bike->branch_prices[(string) $selectedBranch->id]),
                    'is_active' => (bool) $bike->is_active,
                ];
            });

        return Inertia::render('Admin/BranchPrices/Index', [
            'selectedBranch' => $selectedBranch,
            'availableBranches' => $availableBranches,
            'motorcycles' => $motorcycles,
            'isBranchAdmin' => $isBranchAdmin,
            'isSuperAdmin' => $isSuperAdmin,
            'userBranch' => $user->branch,
        ]);
    }

    public function update(Request $request, int $branchId): RedirectResponse
    {
        $user = $request->user();
        $branch = Branch::findOrFail($branchId);

        // Security check: Only the branch's region admin or super admin can update this branch's prices
        if ($user->isBranchAdmin() && $user->branch && $branch->region !== $user->branch->region) {
            abort(403, "Akses ditolak. Anda hanya berwenang memperbarui harga OTR untuk wilayah {$user->branch->region}.");
        }

        $validated = $request->validate([
            'prices' => 'required|array',
            'prices.*' => 'required|numeric|min:0',
        ]);

        // Find all branches in this region to sync branch-level prices
        $regionalBranchIds = Branch::where('region', $branch->region)->pluck('id');

        foreach ($validated['prices'] as $motorcycleId => $price) {
            $motorcycle = Motorcycle::find($motorcycleId);
            if ($motorcycle) {
                // Update price for target branch and all branches in this region
                foreach ($regionalBranchIds as $rbId) {
                    $motorcycle->setPriceForBranch($rbId, (int) $price);
                }

                // Update regional price mapping
                $regional = $motorcycle->regional_prices ?? [];
                if (!empty($branch->region)) {
                    $regional[$branch->region] = (int) $price;
                    $motorcycle->regional_prices = $regional;
                }

                $motorcycle->save();
            }
        }

        return back()->with('success', "Harga OTR wilayah {$branch->region} ({$branch->name}) berhasil diperbarui!");
    }

    public function updateSingle(Request $request, int $branchId, int $motorcycleId): RedirectResponse
    {
        $user = $request->user();
        $branch = Branch::findOrFail($branchId);

        // Security check: Branch Admin can only update their own region
        if ($user->isBranchAdmin() && $user->branch && $branch->region !== $user->branch->region) {
            abort(403, "Akses ditolak. Anda hanya berwenang memperbarui harga OTR untuk wilayah {$user->branch->region}.");
        }

        $validated = $request->validate([
            'price_otr' => 'required|numeric|min:0',
        ]);

        $motorcycle = Motorcycle::findOrFail($motorcycleId);
        $price = (int) $validated['price_otr'];

        $regionalBranchIds = Branch::where('region', $branch->region)->pluck('id');
        foreach ($regionalBranchIds as $rbId) {
            $motorcycle->setPriceForBranch($rbId, $price);
        }

        // Update regional price
        $regional = $motorcycle->regional_prices ?? [];
        if (!empty($branch->region)) {
            $regional[$branch->region] = $price;
            $motorcycle->regional_prices = $regional;
        }

        $motorcycle->save();

        return back()->with('success', "Harga OTR {$motorcycle->name} wilayah {$branch->region} berhasil disimpan!");
    }
}
