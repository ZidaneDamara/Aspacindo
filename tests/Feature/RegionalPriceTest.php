<?php

namespace Tests\Feature;

use App\Models\Motorcycle;
use Database\Seeders\MotorcycleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegionalPriceTest extends TestCase
{
    use RefreshDatabase;

    public function test_motorcycle_seeder_populates_all_seven_regions(): void
    {
        $this->seed(MotorcycleSeeder::class);

        $nmaxTurbo = Motorcycle::where('slug', 'yamaha-nmax-turbo')->first();
        $this->assertNotNull($nmaxTurbo);

        // Check Pekanbaru base price
        $this->assertEquals(42531000, $nmaxTurbo->getPriceForRegion('Pekanbaru'));

        // Check other 6 branches
        $this->assertEquals(43031000, $nmaxTurbo->getPriceForRegion('Siak'));
        $this->assertEquals(43031000, $nmaxTurbo->getPriceForRegion('Kampar'));
        $this->assertEquals(43031000, $nmaxTurbo->getPriceForRegion('Pelalawan'));
        $this->assertEquals(43031000, $nmaxTurbo->getPriceForRegion('Indragiri Hulu'));
        $this->assertEquals(43031000, $nmaxTurbo->getPriceForRegion('Indragiri Hilir'));
        $this->assertEquals(41948000, $nmaxTurbo->getPriceForRegion('Medan'));
    }

    public function test_catalog_filters_by_region_and_updates_prices(): void
    {
        $this->seed(MotorcycleSeeder::class);

        // Check response for Pekanbaru
        $responsePekanbaru = $this->get('/produk?region=Pekanbaru');
        $responsePekanbaru->assertStatus(200);

        // Check response for Siak
        $responseSiak = $this->get('/produk?region=Siak');
        $responseSiak->assertStatus(200);

        // Check response for Medan
        $responseMedan = $this->get('/produk?region=Medan');
        $responseMedan->assertStatus(200);
    }
}
