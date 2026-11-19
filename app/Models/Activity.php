<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'category',
        'image_path',
        'event_date',
        'description',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    protected $appends = ['formatted_date', 'image_url'];

    public function getFormattedDateAttribute(): string
    {
        if (!$this->event_date) {
            return '';
        }
        return $this->event_date->translatedFormat('d F Y');
    }

    public function getImageUrlAttribute(): string
    {
        if (empty($this->image_path)) {
            return '/assets/images/placeholder-activity.webp';
        }
        if (str_starts_with($this->image_path, 'http://') || str_starts_with($this->image_path, 'https://') || str_starts_with($this->image_path, '/')) {
            return $this->image_path;
        }
        return asset('storage/' . $this->image_path);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeByCategory(Builder $query, ?string $category): Builder
    {
        if (!$category || $category === 'Semua') {
            return $query;
        }
        return $query->where('category', $category);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($activity) {
            if (empty($activity->slug)) {
                $activity->slug = Str::slug($activity->title) . '-' . Str::random(5);
            }
        });
    }
}

