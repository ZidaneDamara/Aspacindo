<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminArticleController extends Controller
{
    public function index(): Response
    {
        $articles = Article::latest()->paginate(15);
        return Inertia::render('Admin/Articles/Index', ['articles' => $articles]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Articles/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'thumbnail' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'author' => 'nullable|string',
            'published_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author'] = $validated['author'] ?? 'Admin';
        $validated['published_at'] = $validated['published_at'] ?? now();

        Article::create($validated);
        return redirect()->route('admin.articles.index')->with('success', 'Article created successfully!');
    }

    public function edit(int $id): Response
    {
        $article = Article::findOrFail($id);
        return Inertia::render('Admin/Articles/Form', ['article' => $article]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $article = Article::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string',
            'thumbnail' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'author' => 'nullable|string',
            'published_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $article->update($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Article updated successfully!');
    }

    public function destroy(int $id): RedirectResponse
    {
        Article::findOrFail($id)->delete();
        return back()->with('success', 'Article deleted successfully!');
    }
}
