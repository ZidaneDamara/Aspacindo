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
    public const VALID_REGIONS = [
        'Pekanbaru',
        'Pelalawan',
        'Siak',
        'Kampar',
        'Medan',
        'Indragiri Hulu',
        'Indragiri Hilir',
    ];

    public function index(Request $request): Response
    {
        $user = $request->user();
        $isBranchAdmin = $user->isBranchAdmin();
        $userBranch = $user->branch;

        $query = Branch::latest();

        if ($isBranchAdmin && $userBranch) {
            // Branch admin sees branches in their assigned region
            $query->where('region', $userBranch->region);
        }

        $branches = $query->paginate(15)->withQueryString();

        return Inertia::render('Admin/Branches/Index', [
            'branches' => $branches,
            'userBranch' => $userBranch,
            'isBranchAdmin' => $isBranchAdmin,
        ]);
    }

    public function create(Request $request): Response
    {
        $user = $request->user();
        $isBranchAdmin = $user->isBranchAdmin();
        $userBranch = $user->branch;

        return Inertia::render('Admin/Branches/Form', [
            'userBranch' => $userBranch,
            'isBranchAdmin' => $isBranchAdmin,
            'defaultRegion' => $userBranch?->region ?? 'Pekanbaru',
            'regions' => self::VALID_REGIONS,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();
        $isBranchAdmin = $user->isBranchAdmin();
        $userBranch = $user->branch;

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dealer_type' => 'required|in:3S,2S,1S',
            'region' => 'required|in:' . implode(',', self::VALID_REGIONS),
            'full_address' => 'required|string',
            'whatsapp_number' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'google_maps_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        // Branch admin can only create branches in their own region
        if ($isBranchAdmin && $userBranch) {
            $validated['region'] = $userBranch->region;
        }

        // 3S and 2S have service center, 1S is sales only
        $validated['has_service_center'] = in_array($validated['dealer_type'], ['3S', '2S'], true);
        $validated['slug'] = Str::slug($validated['name']);

        Branch::create($validated);

        return redirect()->route('admin.branches.index')->with('success', "Cabang {$validated['name']} ({$validated['dealer_type']}) berhasil ditambahkan!");
    }

    public function edit(Request $request, int $id): Response
    {
        $user = $request->user();
        $branch = Branch::findOrFail($id);

        if ($user->isBranchAdmin() && $user->branch && $branch->region !== $user->branch->region) {
            abort(403, 'Akses ditolak. Anda hanya dapat mengelola cabang di wilayah Anda.');
        }

        return Inertia::render('Admin/Branches/Form', [
            'branch' => $branch,
            'userBranch' => $user->branch,
            'isBranchAdmin' => $user->isBranchAdmin(),
            'defaultRegion' => $branch->region,
            'regions' => self::VALID_REGIONS,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $user = $request->user();
        $branch = Branch::findOrFail($id);

        if ($user->isBranchAdmin() && $user->branch && $branch->region !== $user->branch->region) {
            abort(403, 'Akses ditolak. Anda hanya dapat mengelola cabang di wilayah Anda.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'dealer_type' => 'required|in:3S,2S,1S',
            'region' => 'required|in:' . implode(',', self::VALID_REGIONS),
            'full_address' => 'required|string',
            'whatsapp_number' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'google_maps_url' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($user->isBranchAdmin() && $user->branch) {
            $validated['region'] = $user->branch->region;
        }

        $validated['has_service_center'] = in_array($validated['dealer_type'], ['3S', '2S'], true);
        $validated['slug'] = Str::slug($validated['name']);

        $branch->update($validated);

        return redirect()->route('admin.branches.index')->with('success', "Data cabang {$branch->name} berhasil diperbarui!");
    }

    public function destroy(Request $request, int $id): RedirectResponse
    {
        $user = $request->user();
        $branch = Branch::findOrFail($id);

        if ($user->isBranchAdmin() && $user->branch && $branch->region !== $user->branch->region) {
            abort(403, 'Akses ditolak. Anda hanya dapat menghapus cabang di wilayah Anda.');
        }

        $branchName = $branch->name;
        $branch->delete();

        return back()->with('success', "Cabang {$branchName} berhasil dihapus!");
    }
}
