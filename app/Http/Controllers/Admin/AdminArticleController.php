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
            'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'thumbnail' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'author' => 'nullable|string',
            'focus_keyword' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'published_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);
        $validated['author'] = $validated['author'] ?? 'Admin Aspacindo';
        $validated['published_at'] = $validated['published_at'] ?? now();

        if ($request->hasFile('thumbnail_file')) {
            $file = $request->file('thumbnail_file');
            $filename = time() . '_' . Str::slug($validated['title']) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/articles'), $filename);
            $validated['thumbnail'] = '/storage/articles/' . $filename;
        }

        Article::create($validated);
        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil dibuat dan dioptimasi SEO!');
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
            'thumbnail_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'thumbnail' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'content' => 'required|string',
            'author' => 'nullable|string',
            'focus_keyword' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string',
            'published_at' => 'nullable|date',
            'is_active' => 'boolean',
        ]);

        $validated['slug'] = Str::slug($validated['title']);

        if ($request->hasFile('thumbnail_file')) {
            $file = $request->file('thumbnail_file');
            $filename = time() . '_' . Str::slug($validated['title']) . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('storage/articles'), $filename);
            $validated['thumbnail'] = '/storage/articles/' . $filename;
        }

        $article->update($validated);

        return redirect()->route('admin.articles.index')->with('success', 'Artikel berhasil diperbarui!');
    }

    public function destroy(int $id): RedirectResponse
    {
        Article::findOrFail($id)->delete();
        return back()->with('success', 'Artikel berhasil dihapus!');
    }

    public function uploadInlineImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
        ]);

        $file = $request->file('image');
        $filename = time() . '_inline_' . Str::random(6) . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('storage/articles'), $filename);

        return response()->json([
            'url' => '/storage/articles/' . $filename,
        ]);
    }

    public function getMediaLibrary()
    {
        $dir = public_path('storage/articles');
        $files = [];
        if (file_exists($dir)) {
            $scan = scandir($dir);
            foreach ($scan as $file) {
                if ($file !== '.' && $file !== '..' && !str_starts_with($file, '.')) {
                    $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                    if (in_array($ext, ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg'])) {
                        $filePath = $dir . DIRECTORY_SEPARATOR . $file;
                        $files[] = [
                            'url' => '/storage/articles/' . $file,
                            'name' => $file,
                            'size' => filesize($filePath),
                            'mtime' => filemtime($filePath),
                        ];
                    }
                }
            }
            usort($files, fn($a, $b) => $b['mtime'] <=> $a['mtime']);
        }
        return response()->json($files);
    }
}
