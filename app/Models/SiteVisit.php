<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteVisit extends Model
{
    use HasFactory;

    protected $fillable = [
        'visit_date',
        'page_views',
        'unique_visitors',
        'mobile_views',
        'desktop_views',
    ];

    protected function casts(): array
    {
        return [
            'visit_date' => 'date',
            'page_views' => 'integer',
            'unique_visitors' => 'integer',
            'mobile_views' => 'integer',
            'desktop_views' => 'integer',
        ];
    }
}

