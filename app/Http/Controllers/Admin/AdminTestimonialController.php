<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;

use Inertia\Inertia;
use Inertia\Response;

class AdminTestimonialController extends Controller
{
    public function index(): Response
    {
        $testimonials = Testimonial::with('branch')->latest()->paginate(20);
        return Inertia::render('Admin/Testimonials/Index', ['testimonials' => $testimonials]);
    }

    public function toggleApprove(int $id): RedirectResponse
    {
        $item = Testimonial::findOrFail($id);
        $item->update(['is_approved' => !$item->is_approved]);

        return back()->with('success', 'Testimonial approval status updated!');
    }

    public function toggleFeature(int $id): RedirectResponse
    {
        $item = Testimonial::findOrFail($id);
        $item->update(['is_featured' => !$item->is_featured]);

        return back()->with('success', 'Testimonial featured status updated!');
    }

    public function destroy(int $id): RedirectResponse
    {
        Testimonial::findOrFail($id)->delete();
        return back()->with('success', 'Testimonial deleted successfully!');
    }
}
