<?php

namespace App\Http\Controllers;

use App\Models\Motorcycle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public const VALID_REGIONS = [
        'Pekanbaru',
        'Siak',
        'Kampar',
        'Pelalawan',
        'Indragiri Hulu',
        'Indragiri Hilir',
        'Medan',
    ];

    public function index(Request $request): Response
    {
        $region = $request->query('region', 'Pekanbaru');
        if (!in_array($region, self::VALID_REGIONS)) {
            $region = 'Pekanbaru';
        }

        $category = $request->query('category');
        $minPrice = $request->query('min_price');
        $maxPrice = $request->query('max_price');
        $sort = $request->query('sort', 'newest');

        $query = Motorcycle::active()
            ->with(['primaryImage', 'colors'])
            ->byCategory($category);

        $driver = DB::connection()->getDriverName();
        $escapedRegionPath = '$."' . str_replace(['\\', '"'], ['\\\\', '\\"'], $region) . '"';
        $priceExpression = $driver === 'sqlite'
            ? "CAST(COALESCE(json_extract(regional_prices, '{$escapedRegionPath}'), price_otr) AS INTEGER)"
            : "CAST(COALESCE(JSON_UNQUOTE(JSON_EXTRACT(regional_prices, '{$escapedRegionPath}')), price_otr) AS UNSIGNED)";

        if ($minPrice) {
            $query->whereRaw("{$priceExpression} >= ?", [(int)$minPrice]);
        }
        if ($maxPrice) {
            $query->whereRaw("{$priceExpression} <= ?", [(int)$maxPrice]);
        }

        if ($sort === 'price_asc') {
            $query->orderByRaw("{$priceExpression} ASC");
        } elseif ($sort === 'price_desc') {
            $query->orderByRaw("{$priceExpression} DESC");
        } else {
            $query->latest();
        }

        $motorcycles = $query->paginate(12)->withQueryString();

        // Attach regional price to price_otr for seamless presentation
        $motorcycles->getCollection()->transform(function ($motorcycle) use ($region) {
            $motorcycle->price_otr = $motorcycle->getPriceForRegion($region);
            $motorcycle->selected_region = $region;
            return $motorcycle;
        });

        $categories = ['Semua', 'MAXi', 'Classy', 'Matic', 'Sport', 'Off-Road', 'Moped'];

        return Inertia::render('Products/Index', [
            'motorcycles' => $motorcycles,
            'categories' => $categories,
            'regions' => self::VALID_REGIONS,
            'selectedRegion' => $region,
            'filters' => [
                'region' => $region,
                'category' => $category ?? 'Semua',
                'min_price' => $minPrice ?? '',
                'max_price' => $maxPrice ?? '',
                'sort' => $sort,
            ],
        ]);
    }

    public function show(string $slug, Request $request): Response
    {
        $region = $request->query('region', 'Pekanbaru');
        if (!in_array($region, self::VALID_REGIONS)) {
            $region = 'Pekanbaru';
        }

        $motorcycle = Motorcycle::active()
            ->where('slug', $slug)
            ->with(['images', 'colors'])
            ->firstOrFail();

        $motorcycle->price_otr = $motorcycle->getPriceForRegion($region);
        $motorcycle->selected_region = $region;

        $relatedProducts = Motorcycle::active()
            ->where('category', $motorcycle->category)
            ->where('id', '!=', $motorcycle->id)
            ->with('primaryImage')
            ->take(4)
            ->get();

        $relatedProducts->transform(function ($item) use ($region) {
            $item->price_otr = $item->getPriceForRegion($region);
            $item->selected_region = $region;
            return $item;
        });

        return Inertia::render('Products/Show', [
            'motorcycle' => $motorcycle,
            'relatedProducts' => $relatedProducts,
            'regions' => self::VALID_REGIONS,
            'selectedRegion' => $region,
        ]);
    }
}
