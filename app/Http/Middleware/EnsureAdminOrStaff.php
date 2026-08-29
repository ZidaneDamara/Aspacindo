<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdminOrStaff
{
    public function handle(Request $request, Closure $next, ?string $role = null): Response
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        if (!in_array($user->role, ['admin', 'staff'])) {
            return redirect()->route('loyalty.dashboard')->with('error', 'Akses ditolak. Halaman ini hanya untuk Staff / Admin.');
        }

        if ($role === 'admin' && $user->role !== 'admin') {
            return back()->with('error', 'Akses terbatas. Fitur ini hanya dapat diakses oleh Administrator.');
        }

        return $next($request);
    }
}
