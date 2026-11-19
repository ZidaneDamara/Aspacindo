<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SearchLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'keyword',
        'search_count',
        'last_searched_at',
    ];

    protected function casts(): array
    {
        return [
            'search_count' => 'integer',
            'last_searched_at' => 'datetime',
        ];
    }

    public static function recordSearch(string $keyword): void
    {
        $clean = trim(mb_strtolower($keyword));
        if (empty($clean) || strlen($clean) < 2) {
            return;
        }

        $log = self::firstOrNew(['keyword' => $clean]);
        $log->search_count = ($log->search_count ?? 0) + 1;
        $log->last_searched_at = now();
        $log->save();
    }
}

