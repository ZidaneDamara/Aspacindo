<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LoyaltyMember extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'member_code',
        'tier',
        'points_balance',
        'total_points_earned',
        'phone_number',
        'joined_at',
    ];

    protected function casts(): array
    {
        return [
            'points_balance' => 'integer',
            'total_points_earned' => 'integer',
            'joined_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pointTransactions(): HasMany
    {
        return $this->hasMany(LoyaltyPointTransaction::class)->orderBy('created_at', 'desc');
    }

    public function redemptions(): HasMany
    {
        return $this->hasMany(LoyaltyRedemption::class)->orderBy('created_at', 'desc');
    }
}
