<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Branch extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'region',
        'full_address',
        'latitude',
        'longitude',
        'google_maps_url',
        'operating_hours',
        'whatsapp_number',
        'dealer_type',
        'has_service_center',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'operating_hours' => 'array',
            'latitude' => 'float',
            'longitude' => 'float',
            'has_service_center' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    public function is3S(): bool
    {
        return ($this->dealer_type ?? '3S') === '3S';
    }

    public function is2S(): bool
    {
        return $this->dealer_type === '2S';
    }

    public function is1S(): bool
    {
        return $this->dealer_type === '1S';
    }

    public function getDealerTypeLabelAttribute(): string
    {
        return match ($this->dealer_type) {
            '1S' => 'Sales (1S)',
            '2S' => 'Sales, Service (2S)',
            default => 'Sales, Service, Sparepart (Dealer Utama 3S)',
        };
    }

    public function jobOpenings(): HasMany
    {
        return $this->hasMany(JobOpening::class);
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    public function serviceBookings(): HasMany
    {
        return $this->hasMany(ServiceBooking::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    public function admins(): HasMany
    {
        return $this->hasMany(User::class)->whereIn('role', ['admin', 'branch_admin']);
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeServiceCenter(Builder $query): Builder
    {
        return $query->where('has_service_center', true);
    }

    public function scopeByRegion(Builder $query, ?string $region): Builder
    {
        if (empty($region) || $region === 'Semua') {
            return $query;
        }
        return $query->where('region', $region);
    }
}
