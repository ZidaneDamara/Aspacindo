<?php

namespace App\Http\Controllers;

use App\Models\Branch;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(): Response
    {
        $testimonials = Testimonial::approved()
            ->with('branch')
            ->latest()
            ->paginate(12);

        $branches = Branch::active()->select(['id', 'name'])->get();

        return Inertia::render('Testimonials', [
            'testimonials' => $testimonials,
            'branches' => $branches,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'branch_id' => 'nullable|exists:branches,id',
            'rating' => 'required|integer|min:1|max:5',
            'review_text' => 'required|string|max:1000',
        ]);

        $validated['is_approved'] = false;
        $validated['is_featured'] = false;

        Testimonial::create($validated);

        return back()->with('success', 'Ulasan Anda berhasil dikirim dan akan ditampilkan setelah dimoderasi oleh tim kami.');
    }
}
