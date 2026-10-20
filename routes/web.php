<?php

use App\Http\Controllers\Admin\AdminArticleController;
use App\Http\Controllers\Admin\AdminBranchController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminJobOpeningController;
use App\Http\Controllers\Admin\AdminLoyaltyController;
use App\Http\Controllers\Admin\AdminMotorcycleController;
use App\Http\Controllers\Admin\AdminPromotionController;
use App\Http\Controllers\Admin\AdminServiceBookingController;
use App\Http\Controllers\Admin\AdminTestimonialController;
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
use App\Http\Controllers\Admin\AdminServicePriceController;
use App\Http\Controllers\Admin\AdminSparepartController;
use App\Http\Controllers\SparepartController;
use App\Http\Controllers\WorkshopController;
use App\Http\Middleware\EnsureAdminOrStaff;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\Admin\AdminProspectController;
use App\Http\Controllers\Admin\AdminBranchPriceController;
use App\Http\Controllers\Admin\AdminBranchUserController;

// Dynamic XML Sitemap
Route::get('/sitemap.xml', SitemapController::class)->name('sitemap');

// Public Pages
Route::get('/', HomeController::class)->name('home');

Route::get('/produk', [ProductController::class, 'index'])->name('products.index');
Route::get('/produk/{slug}', [ProductController::class, 'show'])->name('products.show');

Route::get('/simulasi-cicilan', [CreditSimulationController::class, 'index'])->name('credit-simulation');
Route::post('/simulasi-cicilan', [CreditSimulationController::class, 'store'])->name('credit-simulation.store');

Route::get('/layanan', [ServiceController::class, 'index'])->name('services.index');
Route::post('/layanan/booking', [ServiceController::class, 'store'])->name('services.booking');

Route::get('/sparepart', [SparepartController::class, 'index'])->name('spareparts.index');
Route::get('/layanan/sparepart', [SparepartController::class, 'index']);
Route::get('/sparepart/{slug}', [SparepartController::class, 'show'])->name('spareparts.show');

Route::get('/bengkel', [ServiceController::class, 'index'])->name('bengkel.index');
Route::get('/bengkel-resmi', [ServiceController::class, 'index']);
Route::get('/bengkel-resmi-yamaha-aspacindo', [ServiceController::class, 'index']);

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

// ADMIN PANEL ROUTES (Role: Admin or Staff)
Route::middleware(['auth', EnsureAdminOrStaff::class])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', AdminDashboardController::class)->name('dashboard');

    // Motorcycles
    Route::resource('motorcycles', AdminMotorcycleController::class);

    // Branch OTR Prices
    Route::get('branch-prices', [AdminBranchPriceController::class, 'index'])->name('branch-prices.index');
    Route::put('branch-prices/{branchId}', [AdminBranchPriceController::class, 'update'])->name('branch-prices.update');
    Route::put('branch-prices/{branchId}/motorcycles/{motorcycleId}', [AdminBranchPriceController::class, 'updateSingle'])->name('branch-prices.update-single');

    // Branch Admins Management
    Route::resource('branch-admins', AdminBranchUserController::class)->except(['create', 'edit', 'show']);

    // Spareparts
    Route::resource('spareparts', AdminSparepartController::class);

    // Branches
    Route::resource('branches', AdminBranchController::class);

    // Articles
    Route::resource('articles', AdminArticleController::class);
    Route::post('articles/upload-image', [AdminArticleController::class, 'uploadInlineImage'])->name('articles.upload-image');

    // Promotions
    Route::resource('promotions', AdminPromotionController::class);

    // Job Openings
    Route::resource('job-openings', AdminJobOpeningController::class);

    // Testimonials Moderation
    Route::get('/testimonials', [AdminTestimonialController::class, 'index'])->name('testimonials.index');
    Route::post('/testimonials/{id}/approve', [AdminTestimonialController::class, 'toggleApprove'])->name('testimonials.approve');
    Route::post('/testimonials/{id}/feature', [AdminTestimonialController::class, 'toggleFeature'])->name('testimonials.feature');
    Route::delete('/testimonials/{id}', [AdminTestimonialController::class, 'destroy'])->name('testimonials.destroy');

    // Service Bookings Management
    Route::get('/service-bookings', [AdminServiceBookingController::class, 'index'])->name('service-bookings.index');
    Route::post('/service-bookings/{id}/status', [AdminServiceBookingController::class, 'updateStatus'])->name('service-bookings.status');

    // Prospect Leads Management
    Route::get('/prospects', [AdminProspectController::class, 'index'])->name('prospects.index');
    Route::post('/prospects/{id}/status', [AdminProspectController::class, 'updateStatus'])->name('prospects.status');
    Route::delete('/prospects/{id}', [AdminProspectController::class, 'destroy'])->name('prospects.destroy');

    // Service Prices Management
    Route::resource('service-prices', AdminServicePriceController::class);

    // Loyalty Management & Offline Point Input Tool
    Route::prefix('loyalty')->name('loyalty.')->group(function () {
        Route::get('/members', [AdminLoyaltyController::class, 'members'])->name('members.index');
        Route::get('/members/{id}', [AdminLoyaltyController::class, 'memberDetail'])->name('members.show');
        Route::post('/members/{id}/adjust-points', [AdminLoyaltyController::class, 'adjustPoints'])->name('members.adjust-points');

        Route::get('/point-input', [AdminLoyaltyController::class, 'pointInputView'])->name('point-input');
        Route::post('/point-input', [AdminLoyaltyController::class, 'processPointInput'])->name('point-input.process');

        Route::get('/rewards', [AdminLoyaltyController::class, 'rewardsIndex'])->name('rewards.index');
        Route::post('/rewards', [AdminLoyaltyController::class, 'storeReward'])->name('rewards.store');
        Route::put('/rewards/{id}', [AdminLoyaltyController::class, 'updateReward'])->name('rewards.update');
        Route::delete('/rewards/{id}', [AdminLoyaltyController::class, 'destroyReward'])->name('rewards.destroy');

        Route::get('/redemptions', [AdminLoyaltyController::class, 'redemptionsIndex'])->name('redemptions.index');
        Route::post('/redemptions/{id}/status', [AdminLoyaltyController::class, 'updateRedemptionStatus'])->name('redemptions.status');

        Route::get('/settings', [AdminLoyaltyController::class, 'settingsView'])->name('settings.index');
        Route::post('/settings', [AdminLoyaltyController::class, 'updateSettings'])->name('settings.update');
    });
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
