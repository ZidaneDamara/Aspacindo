<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_prices', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['Reguler', 'Perbaikan Ringan', 'Perbaikan Berat']);
            $table->string('repair_type');
            $table->integer('price_moped')->nullable();
            $table->integer('price_sport')->nullable();
            $table->integer('price_matic')->nullable();
            $table->integer('price_matic_premium')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial data exactly as shown in user screenshots
        $items = [
            // Reguler
            [
                'category' => 'Reguler',
                'repair_type' => 'Servis Berkala (tiap 3000Km)',
                'price_moped' => 60000,
                'price_sport' => 80000,
                'price_matic' => 65000,
                'price_matic_premium' => 80000,
                'sort_order' => 1,
            ],

            // Perbaikan Ringan
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Minyak Rem',
                'price_moped' => 25000,
                'price_sport' => 25000,
                'price_matic' => 15000,
                'price_matic_premium' => 20000,
                'sort_order' => 1,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Ban/Buah (Tire Changer)',
                'price_moped' => 15000,
                'price_sport' => 15000,
                'price_matic' => 15000,
                'price_matic_premium' => 15000,
                'sort_order' => 2,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Sistem Kelistrikan Ringan (Batttery)',
                'price_moped' => 30000,
                'price_sport' => 25000,
                'price_matic' => 25000,
                'price_matic_premium' => 25000,
                'sort_order' => 3,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Kampas Rem Cakram',
                'price_moped' => 15000,
                'price_sport' => 15000,
                'price_matic' => 15000,
                'price_matic_premium' => 25000,
                'sort_order' => 4,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Kampas Rem Tromol',
                'price_moped' => 20000,
                'price_sport' => null,
                'price_matic' => 20000,
                'price_matic_premium' => 25000,
                'sort_order' => 5,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Air Radiator',
                'price_moped' => 10000,
                'price_sport' => 10000,
                'price_matic' => 10000,
                'price_matic_premium' => 10000,
                'sort_order' => 6,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Kabel Speedometer, Gas, Rem',
                'price_moped' => 15000,
                'price_sport' => 15000,
                'price_matic' => 15000,
                'price_matic_premium' => 15000,
                'sort_order' => 7,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Bearing Roda Depan',
                'price_moped' => 20000,
                'price_sport' => 25000,
                'price_matic' => 20000,
                'price_matic_premium' => 35000,
                'sort_order' => 8,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Bearing Roda Belakang',
                'price_moped' => 35000,
                'price_sport' => 35000,
                'price_matic' => null,
                'price_matic_premium' => null,
                'sort_order' => 9,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti Rantai Gear Set',
                'price_moped' => 45000,
                'price_sport' => 45000,
                'price_matic' => null,
                'price_matic_premium' => null,
                'sort_order' => 10,
            ],
            [
                'category' => 'Perbaikan Ringan',
                'repair_type' => 'Ganti V-Belt Kit',
                'price_moped' => null,
                'price_sport' => null,
                'price_matic' => 35000,
                'price_matic_premium' => 40000,
                'sort_order' => 11,
            ],

            // Perbaikan Berat
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Service Besar',
                'price_moped' => 180000,
                'price_sport' => 180000,
                'price_matic' => 130000,
                'price_matic_premium' => 200000,
                'sort_order' => 1,
            ],
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Overhaul Gear Box CVT',
                'price_moped' => null,
                'price_sport' => null,
                'price_matic' => 60000,
                'price_matic_premium' => 90000,
                'sort_order' => 2,
            ],
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Overhaul CVT/Service CVT',
                'price_moped' => null,
                'price_sport' => null,
                'price_matic' => 60000,
                'price_matic_premium' => 80000,
                'sort_order' => 3,
            ],
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Sistem Kelistrikan Berat',
                'price_moped' => 80000,
                'price_sport' => 75000,
                'price_matic' => 60000,
                'price_matic_premium' => 80000,
                'sort_order' => 4,
            ],
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Ganti Kampas Kopling',
                'price_moped' => 50000,
                'price_sport' => 60000,
                'price_matic' => 65000,
                'price_matic_premium' => 85000,
                'sort_order' => 5,
            ],
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Ganti Raceball Steering',
                'price_moped' => 65000,
                'price_sport' => 75000,
                'price_matic' => 50000,
                'price_matic_premium' => 60000,
                'sort_order' => 6,
            ],
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Ganti Rantai Keteng (Camchain)',
                'price_moped' => 85000,
                'price_sport' => 85000,
                'price_matic' => 65000,
                'price_matic_premium' => 85000,
                'sort_order' => 7,
            ],
            [
                'category' => 'Perbaikan Berat',
                'repair_type' => 'Overhaul Mesin',
                'price_moped' => 320000,
                'price_sport' => 320000,
                'price_matic' => 300000,
                'price_matic_premium' => 350000,
                'sort_order' => 8,
            ],
        ];

        foreach ($items as $item) {
            DB::table('service_prices')->insert(array_merge($item, [
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_prices');
    }
};
