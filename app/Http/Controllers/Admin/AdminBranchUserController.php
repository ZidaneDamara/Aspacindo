<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminBranchUserController extends Controller
{
    public function index(): Response
    {
        $admins = User::with('branch')
            ->whereIn('role', ['admin', 'branch_admin'])
            ->orderBy('branch_id')
            ->get();

        $branches = Branch::orderBy('name')->get();

        return Inertia::render('Admin/BranchAdmins/Index', [
            'admins' => $admins,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'branch_id' => 'required|exists:branches,id',
            'phone_number' => 'nullable|string|max:20',
        ]);

        User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'branch_admin',
            'branch_id' => $validated['branch_id'],
            'phone_number' => $validated['phone_number'] ?? null,
        ]);

        return redirect()->route('admin.branch-admins.index')->with('success', 'Admin Cabang berhasil ditambahkan!');
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $admin = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($admin->id)],
            'password' => 'nullable|string|min:6',
            'branch_id' => 'nullable|exists:branches,id',
            'phone_number' => 'nullable|string|max:20',
            'role' => 'required|in:admin,branch_admin',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'branch_id' => $validated['role'] === 'admin' ? null : $validated['branch_id'],
            'phone_number' => $validated['phone_number'] ?? null,
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $admin->update($updateData);

        return redirect()->route('admin.branch-admins.index')->with('success', 'Data Admin Cabang berhasil diperbarui!');
    }

    public function destroy(int $id): RedirectResponse
    {
        $admin = User::findOrFail($id);

        if ($admin->id === auth()->id()) {
            return back()->with('error', 'Anda tidak dapat menghapus akun Anda sendiri.');
        }

        $admin->delete();

        return redirect()->route('admin.branch-admins.index')->with('success', 'Admin Cabang berhasil dihapus.');
    }
}
