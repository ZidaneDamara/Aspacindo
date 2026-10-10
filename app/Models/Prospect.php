<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prospect extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_number',
        'name',
        'phone',
        'email',
        'address',
        'city',
        'current_motorcycle',
        'motorcycle_id',
        'motorcycle_name',
        'price_otr',
        'dp_amount',
        'dp_percent',
        'tenor_months',
        'leasing_partner',
        'monthly_installment',
        'notes',
        'status',
        'follow_up_notes',
    ];

    protected $casts = [
        'price_otr' => 'float',
        'dp_amount' => 'float',
        'monthly_installment' => 'float',
        'dp_percent' => 'integer',
        'tenor_months' => 'integer',
    ];

    public function motorcycle(): BelongsTo
    {
        return $this->belongsTo(Motorcycle::class);
    }

    public static function generateTicketNumber(): string
    {
        $prefix = 'PRP-' . date('Ymd') . '-';
        $random = strtoupper(substr(uniqid(), -4));
        return $prefix . $random;
    }

    public function getFormattedPriceOtrAttribute(): string
    {
        return 'Rp ' . number_format($this->price_otr, 0, ',', '.');
    }

    public function getFormattedDpAmountAttribute(): string
    {
        return 'Rp ' . number_format($this->dp_amount, 0, ',', '.');
    }

    public function getFormattedMonthlyInstallmentAttribute(): string
    {
        return 'Rp ' . number_format($this->monthly_installment, 0, ',', '.');
    }
}
