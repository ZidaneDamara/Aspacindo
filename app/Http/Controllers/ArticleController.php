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

        // Increment views count silently
        $article->increment('views_count');

        // Recent articles for right sidebar widget
        $recentArticles = Article::published()
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->take(4)
            ->get();

        // Related articles for bottom section (4 items)
        $relatedArticles = Article::published()
            ->where('id', '!=', $article->id)
            ->latest('published_at')
            ->take(4)
            ->get();

        return Inertia::render('Articles/Show', [
            'article' => $article,
            'recentArticles' => $recentArticles,
            'relatedArticles' => $relatedArticles,
        ]);
    }
}
