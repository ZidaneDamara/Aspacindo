<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Motorcycle;
use App\Models\SearchLog;
use App\Models\SiteVisit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ActivityAndAnalyticsSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Seed Activities
        $activities = [
            [
                'title' => 'Grand Opening Cabang Sudirman Pekanbaru',
                'category' => 'Acara & Event',
                'image_path' => '/assets/images/gallery/opening_sudirman.webp',
                'event_date' => '2025-05-15',
                'description' => 'Peresmian outlet 3S modern Yamaha Aspacindo Kedaton Sudirman di pusat kota Pekanbaru dengan fasilitas showroom premium dan bengkel berstandar SKY.',
                'is_active' => true,
                'sort_order' => 1,
            ],
            [
                'title' => 'Yamaha MAXi Day Riau Touring & Gathering',
                'category' => 'Komunitas',
                'image_path' => '/assets/images/gallery/maxi_day.webp',
                'event_date' => '2025-02-20',
                'description' => 'Ajang kumpul dan touring akbar lebih dari 300 riders MAXi Series (NMAX, XMAX, AEROX) se-Riau menyusuri rute Pekanbaru - Kampar.',
                'is_active' => true,
                'sort_order' => 2,
            ],
            [
                'title' => 'Pelatihan & Sertifikasi Teknisi Yamaha SKY',
                'category' => 'Edukasi & Servis',
                'image_path' => '/assets/images/gallery/sky_training.webp',
                'event_date' => '2025-01-10',
                'description' => 'Program peningkatan kapasitas dan sertifikasi teknisi berkala untuk memastikan standar servis terbaik bagi pelanggan setia Yamaha Aspacindo.',
                'is_active' => true,
                'sort_order' => 3,
            ],
            [
                'title' => 'Penyerahan Unit Pertama Yamaha NMAX Turbo',
                'category' => 'Serah Terima Unit',
                'image_path' => '/assets/images/gallery/handover_nmax.webp',
                'event_date' => '2024-07-05',
                'description' => 'Momen serah terima unit perdana NMAX Turbo kepada konsumen prioritas di Showroom Aspacindo Kedaton Pekanbaru.',
                'is_active' => true,
                'sort_order' => 4,
            ],
            [
                'title' => 'Jelajah Alam Kampar Bersama Komunitas WR 155 R',
                'category' => 'Komunitas',
                'image_path' => '/assets/images/gallery/touring_kampar.webp',
                'event_date' => '2024-11-18',
                'description' => 'Petualangan trabas akhir pekan bersama komunitas trail Yamaha menaklukkan jalur perbukitan dan hutan tropis Kampar.',
                'is_active' => true,
                'sort_order' => 5,
            ],
            [
                'title' => 'CSR Peduli Pendidikan: Donasi & Edukasi Mesin SMK Binaan',
                'category' => 'Sosial & CSR',
                'image_path' => '/assets/images/gallery/csr_siak.webp',
                'event_date' => '2024-09-12',
                'description' => 'Penyaluran unit mesin praktek dan pelatihan teknologi Fuel Injection Yamaha kepada sekolah menengah kejuruan mitra binaan.',
                'is_active' => true,
                'sort_order' => 6,
            ],
        ];

        foreach ($activities as $act) {
            Activity::updateOrCreate(
                ['slug' => Str::slug($act['title'])],
                $act
            );
        }

        // 2. Seed 30 Days of Site Visits
        for ($i = 30; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i)->toDateString();
            $baseViews = rand(380, 820);
            $unique = (int) round($baseViews * (rand(50, 65) / 100));
            $mobile = (int) round($baseViews * (rand(74, 82) / 100));
            $desktop = $baseViews - $mobile;

            SiteVisit::updateOrCreate(
                ['visit_date' => $date],
                [
                    'page_views' => $baseViews,
                    'unique_visitors' => $unique,
                    'mobile_views' => $mobile,
                    'desktop_views' => $desktop,
                ]
            );
        }

        // 3. Seed Search Logs
        $keywords = [
            ['keyword' => 'nmax turbo', 'search_count' => 542],
            ['keyword' => 'aerox 155 cybercity', 'search_count' => 418],
            ['keyword' => 'simulasi kredit dp minim', 'search_count' => 389],
            ['keyword' => 'grand filano hybrid', 'search_count' => 312],
            ['keyword' => 'fazzio hybrid connected', 'search_count' => 285],
            ['keyword' => 'wr 155 r pekanbaru', 'search_count' => 220],
            ['keyword' => 'cicilan nmax 35 bulan', 'search_count' => 195],
            ['keyword' => 'bengkel resmi yamaha siak', 'search_count' => 164],
            ['keyword' => 'promo yamaha akhir tahun', 'search_count' => 152],
            ['keyword' => 'r15 connected medan', 'search_count' => 138],
            ['keyword' => 'booking service garuda sakti', 'search_count' => 110],
            ['keyword' => 'jupiter z1', 'search_count' => 96],
        ];

        foreach ($keywords as $kw) {
            SearchLog::updateOrCreate(
                ['keyword' => $kw['keyword']],
                [
                    'search_count' => $kw['search_count'],
                    'last_searched_at' => Carbon::now()->subHours(rand(1, 48)),
                ]
            );
        }

        // 4. Update Motorcycle Views Count
        $bikes = Motorcycle::all();
        foreach ($bikes as $bike) {
            $name = strtolower($bike->name);
            $views = 150;
            if (str_contains($name, 'nmax')) {
                $views = rand(1400, 2200);
            } elseif (str_contains($name, 'aerox')) {
                $views = rand(1100, 1800);
            } elseif (str_contains($name, 'filano')) {
                $views = rand(800, 1300);
            } elseif (str_contains($name, 'fazzio')) {
                $views = rand(700, 1200);
            } elseif (str_contains($name, 'wr')) {
                $views = rand(500, 950);
            } elseif (str_contains($name, 'r15') || str_contains($name, 'r25')) {
                $views = rand(450, 850);
            } elseif (str_contains($name, 'gear') || str_contains($name, 'mio')) {
                $views = rand(300, 600);
            } else {
                $views = rand(150, 400);
            }
            $bike->views_count = $views;
            $bike->save();
        }
    }
}

