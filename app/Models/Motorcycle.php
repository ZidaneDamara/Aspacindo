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
        'regional_prices',
        'branch_prices',
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
            'regional_prices' => 'array',
            'branch_prices' => 'array',
        ];
    }

    public function getPriceForRegion(?string $region = null): int
    {
        if ($region && !empty($this->regional_prices) && isset($this->regional_prices[$region])) {
            return (int) $this->regional_prices[$region];
        }
        return (int) $this->price_otr;
    }

    public function getPriceForBranch(Branch|int $branch): int
    {
        $branchId = $branch instanceof Branch ? $branch->id : (int) $branch;
        
        if (!empty($this->branch_prices) && isset($this->branch_prices[$branchId])) {
            return (int) $this->branch_prices[$branchId];
        }

        $branchModel = $branch instanceof Branch ? $branch : Branch::find($branchId);
        if ($branchModel && !empty($this->regional_prices) && isset($this->regional_prices[$branchModel->region])) {
            return (int) $this->regional_prices[$branchModel->region];
        }

        return (int) $this->price_otr;
    }

    public function setPriceForBranch(int $branchId, int $price): void
    {
        $prices = $this->branch_prices ?? [];
        $prices[(string)$branchId] = $price;
        $this->branch_prices = $prices;
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

    public function scopePriceRangeForRegion(Builder $query, ?string $region = null, ?int $minPrice = null, ?int $maxPrice = null): Builder
    {
        $reg = $region ?: 'Pekanbaru';
        if ($minPrice) {
            $query->whereRaw("CAST(COALESCE(JSON_UNQUOTE(JSON_EXTRACT(regional_prices, '$.\"$reg\"')), price_otr) AS UNSIGNED) >= ?", [$minPrice]);
        }
        if ($maxPrice) {
            $query->whereRaw("CAST(COALESCE(JSON_UNQUOTE(JSON_EXTRACT(regional_prices, '$.\"$reg\"')), price_otr) AS UNSIGNED) <= ?", [$maxPrice]);
        }
        return $query;
    }
}
