<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyMember;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;

class SocialiteController extends Controller
{
    public function redirect(): RedirectResponse
    {
        // If Google credentials are not set in .env during dev, fallback to login page
        if (!config('services.google.client_id')) {
            return redirect()->route('login')->with('info', 'Google OAuth client ID belum diset. Gunakan Login / Register manual.');
        }

        return Socialite::driver('google')->redirect();
    }

    public function callback(): RedirectResponse
    {
        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('loyalty.landing')->with('error', 'Gagal terhubung dengan Google. Silakan coba lagi.');
        }

        $user = User::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if (!$user) {
            $user = User::create([
                'name' => $googleUser->getName(),
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'password' => Hash::make(Str::random(24)),
                'role' => 'customer',
            ]);
        } else {
            if (!$user->google_id) {
                $user->update(['google_id' => $googleUser->getId()]);
            }
        }

        // Initialize Loyalty Member profile if absent
        if (!$user->loyaltyMember) {
            LoyaltyMember::create([
                'user_id' => $user->id,
                'member_code' => 'ALC-' . strtoupper(Str::random(8)),
                'tier' => 'Silver',
                'points_balance' => 0,
                'total_points_earned' => 0,
                'phone_number' => $user->phone_number ?? '',
                'joined_at' => now(),
            ]);
        }

        Auth::login($user);

        if (empty($user->phone_number)) {
            return redirect()->route('loyalty.complete-profile');
        }

        return redirect()->route('loyalty.dashboard');
    }

    // Fast Dev Mock Login for Loyalty Testing
    public function mockLogin(Request $request): RedirectResponse
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        if (!$user) {
            $user = User::create([
                'name' => 'Loyalty Member Test',
                'email' => $request->email,
                'password' => Hash::make('password'),
                'role' => 'customer',
            ]);
        }

        if (!$user->loyaltyMember) {
            LoyaltyMember::create([
                'user_id' => $user->id,
                'member_code' => 'ALC-' . strtoupper(Str::random(8)),
                'tier' => 'Silver',
                'points_balance' => 250,
                'total_points_earned' => 250,
                'phone_number' => $user->phone_number ?? '081234567890',
                'joined_at' => now(),
            ]);
        }

        Auth::login($user);

        if (empty($user->phone_number)) {
            return redirect()->route('loyalty.complete-profile');
        }

        return redirect()->route('loyalty.dashboard');
    }
}
