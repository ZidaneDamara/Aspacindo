<?php

namespace App\Http\Controllers;

use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->query('category');
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');
        $sort = $request->query('sort', 'newest');

        $query = Motorcycle::active()
            ->with(['primaryImage', 'colors'])
            ->byCategory($category)
            ->priceRange($minPrice ? (int)$minPrice : null, $maxPrice ? (int)$maxPrice : null);

        if ($sort === 'price_asc') {
            $query->orderBy('price_otr', 'asc');
        } elseif ($sort === 'price_desc') {
            $query->orderBy('price_otr', 'desc');
        } else {
            $query->latest();
        }

        $motorcycles = $query->paginate(12)->withQueryString();

        $categories = ['Semua', 'MAXi', 'Classy', 'Matic', 'Sport', 'Off-Road', 'Moped'];

        return Inertia::render('Products/Index', [
            'motorcycles' => $motorcycles,
            'categories' => $categories,
            'filters' => [
                'category' => $category ?? 'Semua',
                'min_price' => $minPrice ?? '',
                'max_price' => $maxPrice ?? '',
                'sort' => $sort,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $motorcycle = Motorcycle::active()
            ->where('slug', $slug)
            ->with(['images', 'colors'])
            ->firstOrFail();

        $relatedProducts = Motorcycle::active()
            ->where('category', $motorcycle->category)
            ->where('id', '!=', $motorcycle->id)
            ->with('primaryImage')
            ->take(4)
            ->get();

        return Inertia::render('Products/Show', [
            'motorcycle' => $motorcycle,
            'relatedProducts' => $relatedProducts,
        ]);
    }
}
