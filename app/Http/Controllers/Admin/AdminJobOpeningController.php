<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\JobOpening;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminJobOpeningController extends Controller
{
    public function index(): Response
    {
        $jobs = JobOpening::with('branch')->latest()->paginate(15);
        return Inertia::render('Admin/JobOpenings/Index', ['jobs' => $jobs]);
    }

    public function create(): Response
    {
        $branches = Branch::active()->select(['id', 'name'])->get();
        return Inertia::render('Admin/JobOpenings/Form', ['branches' => $branches]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'employment_type' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'closes_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        JobOpening::create($validated);
        return redirect()->route('admin.job-openings.index')->with('success', 'Job Opening created successfully!');
    }

    public function edit(int $id): Response
    {
        $job = JobOpening::findOrFail($id);
        $branches = Branch::active()->select(['id', 'name'])->get();
        return Inertia::render('Admin/JobOpenings/Form', ['job' => $job, 'branches' => $branches]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $job = JobOpening::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'employment_type' => 'required|string',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'closes_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $job->update($validated);
        return redirect()->route('admin.job-openings.index')->with('success', 'Job Opening updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {
        JobOpening::findOrFail($id)->delete();
        return back()->with('success', 'Job Opening deleted successfully!');
    }
}
