<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\JobOpening;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CareerController extends Controller
{
    public function index(): Response
    {
        $jobs = JobOpening::active()
            ->with('branch')
            ->latest()
            ->get();

        return Inertia::render('Careers/Index', [
            'jobs' => $jobs,
        ]);
    }

    public function show(int $id): Response
    {
        $job = JobOpening::active()
            ->with('branch')
            ->findOrFail($id);

        return Inertia::render('Careers/Show', [
            'job' => $job,
        ]);
    }

    public function apply(Request $request, int $id): RedirectResponse
    {
        $job = JobOpening::active()->findOrFail($id);

        $validated = $request->validate([
            'applicant_name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone_number' => 'required|string|max:20',
            'cover_letter' => 'nullable|string|max:1000',
        ]);

        return back()->with('success', 'Lamaran Anda untuk posisi ' . $job->title . ' berhasil terkirim. Tim HR kami akan menghubungi Anda.');
    }
}
