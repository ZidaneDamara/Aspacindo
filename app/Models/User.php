<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'branch_id',
        'role',
        'phone_number',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'branch_id' => 'integer',
        ];
    }

    public function loyaltyMember(): HasOne
    {
        return $this->hasOne(LoyaltyMember::class);
    }

    public function branch(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'admin' && empty($this->branch_id);
    }

    public function isBranchAdmin(): bool
    {
        return $this->role === 'branch_admin' || ($this->role === 'admin' && !empty($this->branch_id));
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'branch_admin']);
    }

    public function isStaff(): bool
    {
        return in_array($this->role, ['admin', 'branch_admin', 'staff']);
    }
}
