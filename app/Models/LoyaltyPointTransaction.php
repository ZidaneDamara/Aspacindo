<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoyaltyPointTransaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'loyalty_member_id',
        'type',
        'source',
        'points',
        'description',
        'related_reference',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'points' => 'integer',
        ];
    }

    public function loyaltyMember(): BelongsTo
    {
        return $this->belongsTo(LoyaltyMember::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
