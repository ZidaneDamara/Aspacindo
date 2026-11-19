<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AdminActivityController extends Controller
{
    public const CATEGORIES = [
        'Acara & Event',
        'Komunitas',
        'Edukasi & Servis',
        'Serah Terima Unit',
        'Sosial & CSR',
        'Lainnya',
    ];

    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $category = $request->query('category');
        $status = $request->query('status');

        $query = Activity::query();

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category && $category !== 'Semua') {
            $query->where('category', $category);
        }

        if ($status !== null && $status !== '') {
            $query->where('is_active', $status === '1' || $status === 'true');
        }

        $activities = $query->orderBy('sort_order', 'asc')
            ->orderBy('event_date', 'desc')
            ->latest('id')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Admin/Activities/Index', [
            'activities' => $activities,
            'categories' => self::CATEGORIES,
            'filters' => [
                'search' => $search ?? '',
                'category' => $category ?? 'Semua',
                'status' => $status ?? '',
            ],
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Activities/Form', [
            'activity' => null,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'event_date' => 'nullable|date',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'image_path' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $imagePath = $validated['image_path'] ?? null;

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $dir = public_path('storage/activities');
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }
            $filename = time() . '_' . Str::slug($validated['title']) . '.' . $file->getClientOriginalExtension();
            $file->move($dir, $filename);
            $imagePath = '/storage/activities/' . $filename;
        }

        if (empty($imagePath)) {
            $imagePath = '/assets/images/gallery/opening_sudirman.webp';
        }

        Activity::create([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . Str::random(5),
            'category' => $validated['category'],
            'event_date' => $validated['event_date'] ?? now()->toDateString(),
            'description' => $validated['description'] ?? null,
            'image_path' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return redirect()->route('admin.activities.index')->with('success', 'Dokumentasi aktifitas baru berhasil ditambahkan!');
    }

    public function edit(int $id): Response
    {
        $activity = Activity::findOrFail($id);

        return Inertia::render('Admin/Activities/Form', [
            'activity' => $activity,
            'categories' => self::CATEGORIES,
        ]);
    }

    public function update(Request $request, int $id): RedirectResponse
    {
        $activity = Activity::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'category' => 'required|string|max:100',
            'event_date' => 'nullable|date',
            'description' => 'nullable|string',
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,webp,gif|max:5120',
            'image_path' => 'nullable|string|max:500',
            'is_active' => 'boolean',
            'sort_order' => 'integer|min:0',
        ]);

        $imagePath = $activity->image_path;

        if ($request->hasFile('image_file')) {
            $file = $request->file('image_file');
            $dir = public_path('storage/activities');
            if (!file_exists($dir)) {
                mkdir($dir, 0755, true);
            }
            $filename = time() . '_' . Str::slug($validated['title']) . '.' . $file->getClientOriginalExtension();
            $file->move($dir, $filename);
            $imagePath = '/storage/activities/' . $filename;
        } elseif (!empty($validated['image_path'])) {
            $imagePath = $validated['image_path'];
        }

        $activity->update([
            'title' => $validated['title'],
            'slug' => Str::slug($validated['title']) . '-' . $activity->id,
            'category' => $validated['category'],
            'event_date' => $validated['event_date'] ?? $activity->event_date,
            'description' => $validated['description'] ?? null,
            'image_path' => $imagePath,
            'is_active' => $request->boolean('is_active', true),
            'sort_order' => $validated['sort_order'] ?? 0,
        ]);

        return redirect()->route('admin.activities.index')->with('success', 'Data kegiatan berhasil diperbarui!');
    }

    public function destroy(int $id): RedirectResponse
    {
        $activity = Activity::findOrFail($id);
        $activity->delete();

        return redirect()->route('admin.activities.index')->with('success', 'Dokumentasi kegiatan berhasil dihapus.');
    }

    public function toggle(int $id): RedirectResponse
    {
        $activity = Activity::findOrFail($id);
        $activity->is_active = !$activity->is_active;
        $activity->save();

        return back()->with('success', 'Status visibilitas kegiatan berhasil diubah.');
    }
}

