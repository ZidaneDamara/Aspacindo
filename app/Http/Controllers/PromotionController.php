<?php

namespace App\Http\Controllers;

use App\Models\Promotion;
use Inertia\Inertia;
use Inertia\Response;

class PromotionController extends Controller
{
    public function index(): Response
    {
        $promotions = Promotion::active()
            ->latest()
            ->paginate(9);

        return Inertia::render('Promotions/Index', [
            'promotions' => $promotions,
        ]);
    }

    public function show(string $slug): Response
    {
        $promotion = Promotion::active()
            ->where('slug', $slug)
            ->firstOrFail();

        $otherPromotions = Promotion::active()
            ->where('id', '!=', $promotion->id)
            ->latest()
            ->take(3)
            ->get();

        return Inertia::render('Promotions/Show', [
            'promotion' => $promotion,
            'otherPromotions' => $otherPromotions,
        ]);
    }
}
