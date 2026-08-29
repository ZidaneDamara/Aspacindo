<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Motorcycle extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'category',
        'price_otr',
        'short_description',
        'full_specifications',
        'is_featured',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'full_specifications' => 'array',
            'is_featured' => 'boolean',
            'is_active' => 'boolean',
            'price_otr' => 'integer',
        ];
    }

    public function images(): HasMany
    {
        return $this->hasMany(MotorcycleImage::class)->orderBy('sort_order', 'asc');
    }

    public function primaryImage(): HasOne
    {
        return $this->hasOne(MotorcycleImage::class)->where('is_primary', true);
    }

    public function colors(): HasMany
    {
        return $this->hasMany(MotorcycleColor::class);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeByCategory(Builder $query, ?string $category): Builder
    {
        if (empty($category) || $category === 'Semua') {
            return $query;
        }
        return $query->where('category', $category);
    }

    public function scopePriceRange(Builder $query, ?int $minPrice = null, ?int $maxPrice = null): Builder
    {
        if ($minPrice) {
            $query->where('price_otr', '>=', $minPrice);
        }
        if ($maxPrice) {
            $query->where('price_otr', '<=', $maxPrice);
        }
        return $query;
    }
}
