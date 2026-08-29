<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $category = $request->query('category');

        $articles = Article::published()
            ->byCategory($category)
            ->latest('published_at')
            ->paginate(9)
            ->withQueryString();

        $categories = ['Semua', 'Berita Yamaha', 'Tips & Trik', 'Event', 'Promo'];

        return Inertia::render('Articles/Index', [
            'articles' => $articles,
            'categories' => $categories,
            'selectedCategory' => $category ?? 'Semua',
        ]);
    }

    public function show(string $slug): Response
    {
        $article = Article::published()
            ->where('slug', $slug)
            ->firstOrFail();

        $relatedArticles = Article::published()
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->take(3)
            ->get();

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
