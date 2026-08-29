<?php

use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Auth\SocialiteController;
use App\Http\Controllers\BranchController;
use App\Http\Controllers\CareerController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\CreditSimulationController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Loyalty\LoyaltyDashboardController;
use App\Http\Controllers\Loyalty\LoyaltyLandingController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PromotionController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\TestimonialController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public Pages
Route::get('/', HomeController::class)->name('home');

Route::get('/produk', [ProductController::class, 'index'])->name('products.index');
Route::get('/produk/{slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('/simulasi-cicilan', CreditSimulationController::class)->name('credit-simulation');

Route::get('/layanan', [ServiceController::class, 'index'])->name('services.index');
Route::post('/layanan/booking', [ServiceController::class, 'store'])->name('services.booking');

Route::get('/lokasi-dealer', BranchController::class)->name('branches.index');

Route::get('/tentang-kami', [CompanyController::class, 'about'])->name('about');
Route::get('/galeri-aktifitas', [CompanyController::class, 'gallery'])->name('gallery');

Route::get('/karir', [CareerController::class, 'index'])->name('careers.index');
Route::get('/karir/{id}', [CareerController::class, 'show'])->name('careers.show');
Route::post('/karir/{id}/apply', [CareerController::class, 'apply'])->name('careers.apply');

Route::get('/artikel', [ArticleController::class, 'index'])->name('articles.index');
Route::get('/artikel/{slug}', [ArticleController::class, 'show'])->name('articles.show');

Route::get('/promo', [PromotionController::class, 'index'])->name('promotions.index');
Route::get('/promo/{slug}', [PromotionController::class, 'show'])->name('promotions.show');

Route::get('/testimoni', [TestimonialController::class, 'index'])->name('testimonials.index');
Route::post('/testimoni', [TestimonialController::class, 'store'])->name('testimonials.store');

// LOYALTY PROGRAM PUBLIC & AUTH ROUTES
Route::get('/loyalty', LoyaltyLandingController::class)->name('loyalty.landing');

// Google OAuth
Route::get('/auth/google', [SocialiteController::class, 'redirect'])->name('auth.google');
Route::get('/auth/google/callback', [SocialiteController::class, 'callback'])->name('auth.google.callback');
Route::post('/auth/mock-login', [SocialiteController::class, 'mockLogin'])->name('auth.mock-login');

// Loyalty Protected Member Routes
Route::middleware(['auth'])->prefix('loyalty')->name('loyalty.')->group(function () {
    Route::get('/complete-profile', [LoyaltyDashboardController::class, 'showCompleteProfile'])->name('complete-profile');
    Route::post('/complete-profile', [LoyaltyDashboardController::class, 'saveCompleteProfile'])->name('complete-profile.save');

    Route::get('/dashboard', [LoyaltyDashboardController::class, 'dashboard'])->name('dashboard');
    Route::post('/redeem', [LoyaltyDashboardController::class, 'redeem'])->name('redeem');
    Route::post('/profile', [LoyaltyDashboardController::class, 'updateProfile'])->name('profile.update');
});

// Standard Breeze Dashboard Placeholder
Route::get('/dashboard', function () {
    return redirect()->route('loyalty.dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
