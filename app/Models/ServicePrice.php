<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ServicePrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'category',
        'repair_type',
        'price_moped',
        'price_sport',
        'price_matic',
        'price_matic_premium',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'price_moped' => 'integer',
            'price_sport' => 'integer',
            'price_matic' => 'integer',
            'price_matic_premium' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }
}
