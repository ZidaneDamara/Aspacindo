<?php

namespace App\Http\Controllers;

use App\Models\Sparepart;
use App\Models\SparepartPromo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SparepartController extends Controller
{
    public function index(Request $request): Response
    {
        $promos = SparepartPromo::active()->get();

        $selectedCategories = $request->input('categories', []);
        if (is_string($selectedCategories)) {
            $selectedCategories = explode(',', $selectedCategories);
        }

        $sort = $request->query('sort', 'latest');
        $search = $request->query('search', '');

        $query = Sparepart::active();

        if (!empty($selectedCategories)) {
            $query->whereIn('category', $selectedCategories);
        }

        if (!empty($search)) {
            $query->where('name', 'like', '%' . $search . '%');
        }

        switch ($sort) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'name_asc':
                $query->orderBy('name', 'asc');
                break;
            case 'latest':
            default:
                $query->orderBy('is_new', 'desc')->orderBy('created_at', 'desc');
                break;
        }

        $spareparts = $query->paginate(8)->withQueryString();

        $allCategories = ['Sparepart', 'Pelumas', 'Ban', 'Busi', 'Pengereman', 'Kelistrikan'];

        return Inertia::render('Spareparts/Index', [
            'promos' => $promos,
            'spareparts' => $spareparts,
            'categories' => $allCategories,
            'filters' => [
                'categories' => $selectedCategories,
                'sort' => $sort,
                'search' => $search,
            ],
        ]);
    }

    public function show(string $slug): Response
    {
        $sparepart = Sparepart::active()->where('slug', $slug)->firstOrFail();

        // Related products in the same category or fallback to other active spareparts
        $relatedSpareparts = Sparepart::active()
            ->where('id', '!=', $sparepart->id)
            ->where('category', $sparepart->category)
            ->limit(6)
            ->get();

        if ($relatedSpareparts->count() < 4) {
            $extra = Sparepart::active()
                ->where('id', '!=', $sparepart->id)
                ->whereNotIn('id', $relatedSpareparts->pluck('id'))
                ->limit(6 - $relatedSpareparts->count())
                ->get();
            $relatedSpareparts = $relatedSpareparts->merge($extra);
        }

        return Inertia::render('Spareparts/Show', [
            'sparepart' => $sparepart,
            'relatedSpareparts' => $relatedSpareparts,
        ]);
    }
}
