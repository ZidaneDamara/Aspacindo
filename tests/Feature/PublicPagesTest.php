<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Motorcycle;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicPagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_homepage_renders_successfully(): void
    {
        $response = $this->get('/');
        $response->assertStatus(200);
    }

    public function test_product_catalog_renders_successfully(): void
    {
        $response = $this->get('/produk');
        $response->assertStatus(200);
    }

    public function test_product_detail_renders_successfully(): void
    {
        $motorcycle = Motorcycle::first();
        $response = $this->get('/produk/' . $motorcycle->slug);
        $response->assertStatus(200);
    }

    public function test_credit_simulation_renders_successfully(): void
    {
        $response = $this->get('/simulasi-cicilan');
        $response->assertStatus(200);
    }

    public function test_services_page_renders_successfully(): void
    {
        $response = $this->get('/layanan');
        $response->assertStatus(200);
    }

    public function test_bengkel_page_renders_successfully(): void
    {
        $response = $this->get('/bengkel');
        $response->assertStatus(200);

        $aliasResponse = $this->get('/bengkel-resmi-yamaha-aspacindo');
        $aliasResponse->assertStatus(200);
    }

    public function test_spareparts_page_renders_successfully(): void
    {
        $response = $this->get('/sparepart');
        $response->assertStatus(200);
    }

    public function test_service_booking_form_submission(): void
    {
        $branch = Branch::first();

        $response = $this->post('/layanan/booking', [
            'customer_name' => 'Ahmad Test',
            'phone_number' => '081299998888',
            'motorcycle_model' => 'Yamaha NMAX Turbo',
            'branch_id' => $branch->id,
            'preferred_date' => now()->addDays(2)->toDateString(),
            'preferred_time' => '10:00 WIB',
            'service_type' => 'Booking Service',
            'notes' => 'Ganti oli dan cek rem depan',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('service_bookings', [
            'customer_name' => 'Ahmad Test',
            'phone_number' => '081299998888',
        ]);
    }

    public function test_dealer_locations_page_renders_successfully(): void
    {
        $response = $this->get('/lokasi-dealer');
        $response->assertStatus(200);
    }

    public function test_about_us_page_renders_successfully(): void
    {
        $response = $this->get('/tentang-kami');
        $response->assertStatus(200);
    }

    public function test_activity_gallery_page_renders_successfully(): void
    {
        $response = $this->get('/galeri-aktifitas');
        $response->assertStatus(200);
    }

    public function test_careers_page_renders_successfully(): void
    {
        $response = $this->get('/karir');
        $response->assertStatus(200);
    }

    public function test_articles_page_renders_successfully(): void
    {
        $response = $this->get('/artikel');
        $response->assertStatus(200);
    }

    public function test_promotions_page_renders_successfully(): void
    {
        $response = $this->get('/promo');
        $response->assertStatus(200);
    }

    public function test_testimonials_page_renders_successfully(): void
    {
        $response = $this->get('/testimoni');
        $response->assertStatus(200);
    }
}
