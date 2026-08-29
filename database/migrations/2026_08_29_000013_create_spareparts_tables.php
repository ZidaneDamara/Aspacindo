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
        Schema::create('spareparts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('category')->index(); // Sparepart, Pelumas, Ban, Busi, Pengereman, Kelistrikan
            $table->integer('price')->default(0);
            $table->text('description')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_new')->default(false);
            $table->boolean('is_active')->default(true)->index();
            $table->timestamps();
        });

        Schema::create('sparepart_promos', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('subtitle')->nullable();
            $table->string('badge_text')->nullable();
            $table->string('image_url')->nullable();
            $table->string('button_text')->nullable();
            $table->string('button_url')->nullable();
            $table->integer('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Seed initial hero promo carousel banners
        DB::table('sparepart_promos')->insert([
            [
                'title' => 'ASLI LEBIH BAIK Suku Cadang YAMAHA',
                'subtitle' => 'Kualitas Terjamin • Aman & Nyaman Berkendara • Awet & Tahan Lama • Nilai Jual Motor Terjaga',
                'badge_text' => 'YAMAHA GENUINE PARTS & YAMALUBE',
                'image_url' => 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=1200&q=80',
                'button_text' => 'Lihat Katalog Sparepart',
                'button_url' => '#catalog',
                'sort_order' => 1,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'PROMO YAMALUBE ENGINE OIL 100% ORIGINAL',
                'subtitle' => 'Dapatkan Performa Maksimal Mesin Yamaha Anda Dengan Oli Resmi Teruji Lapangan',
                'badge_text' => 'DISCOUT OLI BERKALA',
                'image_url' => 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1200&q=80',
                'button_text' => 'Beli Oli Yamalube',
                'button_url' => '#catalog',
                'sort_order' => 2,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'title' => 'GARANSI DRIVE CHAIN KIT & SPARK PLUG YAMAHA',
                'subtitle' => 'Pastikan Rantai, Busi & Kampas Rem Selalu Ori Untuk Keamanan Perjalanan Anda',
                'badge_text' => 'GARANSI RESMI YAMAHA',
                'image_url' => 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=1200&q=80',
                'button_text' => 'Cek Stok Sparepart',
                'button_url' => '#catalog',
                'sort_order' => 3,
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        // Seed initial spareparts exactly as seen in the user screenshot
        $products = [
            [
                'name' => 'Brake Fluid DOT 4',
                'slug' => 'brake-fluid-dot-4',
                'category' => 'Pengereman',
                'price' => 22000,
                'description' => 'Cairan rem khusus Yamaha untuk performa pengereman optimal dan tahan panas.',
                'image_url' => 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
                'is_new' => false,
            ],
            [
                'name' => 'Carbon Cleaner Yamalube',
                'slug' => 'carbon-cleaner-yamalube',
                'category' => 'Pelumas',
                'price' => 34000,
                'description' => 'Pembersih kerak karbon dalam ruang bakar mesin injeksi Yamaha.',
                'image_url' => 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80',
                'is_new' => false,
            ],
            [
                'name' => 'Chain Lube Yamalube 150ml',
                'slug' => 'chain-lube-yamalube-150ml',
                'category' => 'Pelumas',
                'price' => 25500,
                'description' => 'Pelumas rantai tahan air dan debu untuk memperpanjang umur gear set.',
                'image_url' => 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
                'is_new' => false,
            ],
            [
                'name' => '2T Motor Oil Yamalube 0.8L',
                'slug' => '2t-motor-oil-yamalube',
                'category' => 'Pelumas',
                'price' => 45500,
                'description' => 'Oli samping 2 tak kualitas premium dengan formulasi asap minim.',
                'image_url' => 'https://images.unsplash.com/photo-1615906655593-ad0386982a0f?auto=format&fit=crop&w=400&q=80',
                'is_new' => true,
            ],
            [
                'name' => 'Matic Motor Oil 20W-40 0.8L',
                'slug' => 'matic-motor-oil-20w-40',
                'category' => 'Pelumas',
                'price' => 45000,
                'description' => 'Oli mesin khusus motor matic Yamaha Mio, Fino, dan X-Ride.',
                'image_url' => 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=400&q=80',
                'is_new' => true,
            ],
            [
                'name' => 'Power Matic Motor Oil 10W-40 0.8L',
                'slug' => 'power-matic-motor-oil',
                'category' => 'Pelumas',
                'price' => 50000,
                'description' => 'Oli mesin semi sintetik untuk perlindungan mesin matic kerja ekstra.',
                'image_url' => 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80',
                'is_new' => true,
            ],
            [
                'name' => 'Super Matic Oil Full Synthetic 1L',
                'slug' => 'super-matic-oil-full-synthetic',
                'category' => 'Pelumas',
                'price' => 74000,
                'description' => 'Oli full sintetik performa tinggi untuk Maxi Yamaha (NMAX, AEROX, XMAX).',
                'image_url' => 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=400&q=80',
                'is_new' => true,
            ],
            [
                'name' => 'Sport Motor Oil 10W-40 1L',
                'slug' => 'sport-motor-oil-10w-40',
                'category' => 'Pelumas',
                'price' => 57000,
                'description' => 'Oli mesin khusus tipe motor sport Yamaha Vixion, R15, MT15.',
                'image_url' => 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
                'is_new' => true,
            ],
            [
                'name' => 'Busi NGK CR6HSA Original',
                'slug' => 'busi-ngk-cr6hsa-original',
                'category' => 'Busi',
                'price' => 18000,
                'description' => 'Busi standar resmi Yamaha untuk pengapian stabil dan mudah di starter.',
                'image_url' => 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=400&q=80',
                'is_new' => false,
            ],
            [
                'name' => 'Kampas Rem Depan (Brake Pad) NMAX',
                'slug' => 'kampas-rem-depan-nmax',
                'category' => 'Pengereman',
                'price' => 75000,
                'description' => 'Kampas rem depan asli Yamaha menjamin kepakeman dan keamanan.',
                'image_url' => 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
                'is_new' => false,
            ],
            [
                'name' => 'Ban Luar Tubeless IRC 110/70-13 Depan NMAX',
                'slug' => 'ban-luar-tubeless-irc-nmax',
                'category' => 'Ban',
                'price' => 310000,
                'description' => 'Ban luar tubeless resmi OEM Yamaha NMAX daya cengkeram tinggi.',
                'image_url' => 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=400&q=80',
                'is_new' => false,
            ],
            [
                'name' => 'Aki Kering Yuasa YTZ6V (NMAX / Aerox)',
                'slug' => 'aki-kering-yuasa-ytz6v',
                'category' => 'Kelistrikan',
                'price' => 285000,
                'description' => 'Aki bebas perawatan (Maintenance Free) kualitas terpercaya.',
                'image_url' => 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=400&q=80',
                'is_new' => false,
            ],
        ];

        foreach ($products as $p) {
            DB::table('spareparts')->insert(array_merge($p, [
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
        Schema::dropIfExists('sparepart_promos');
        Schema::dropIfExists('spareparts');
    }
};
