<?php

namespace Database\Seeders;

use App\Models\Branch;
use Illuminate\Database\Seeder;

class BranchSeeder extends Seeder
{
    public function run(): void
    {
        $branches = [
            [
                'name' => 'Yamaha Aspacindo Nangka (Pekanbaru)',
                'slug' => 'yamaha-aspacindo-nangka-pekanbaru',
                'region' => 'Pekanbaru',
                'full_address' => 'Jl. Tuanku Tambusai (Nangka) No. 128-130, Pekanbaru, Riau',
                'latitude' => 0.50710000,
                'longitude' => 101.44780000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Nangka+Pekanbaru',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 15:00 WIB',
                ],
                'whatsapp_number' => '6281270001111',
                'is_active' => true,
            ],
            [
                'name' => 'Yamaha Aspacindo Sudirman (Pekanbaru)',
                'slug' => 'yamaha-aspacindo-sudirman-pekanbaru',
                'region' => 'Pekanbaru',
                'full_address' => 'Jl. Jend. Sudirman No. 450, Pekanbaru, Riau',
                'latitude' => 0.51820000,
                'longitude' => 101.45010000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Sudirman+Pekanbaru',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => 'Libur',
                ],
                'whatsapp_number' => '6281270002222',
                'is_active' => true,
            ],
            [
                'name' => 'Yamaha Aspacindo Panam (Pekanbaru)',
                'slug' => 'yamaha-aspacindo-panam-pekanbaru',
                'region' => 'Pekanbaru',
                'full_address' => 'Jl. HR. Soebrantas Km. 10.5 No. 88, Panam, Pekanbaru, Riau',
                'latitude' => 0.46550000,
                'longitude' => 101.37890000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Panam+Pekanbaru',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 15:00 WIB',
                ],
                'whatsapp_number' => '6281270003333',
                'is_active' => true,
            ],
            [
                'name' => 'Yamaha Aspacindo Pangkalan Kerinci',
                'slug' => 'yamaha-aspacindo-pangkalan-kerinci',
                'region' => 'Pelalawan',
                'full_address' => 'Jl. Lintas Timur No. 15, Pangkalan Kerinci, Pelalawan, Riau',
                'latitude' => 0.40340000,
                'longitude' => 101.85420000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Pangkalan+Kerinci',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => 'Libur',
                ],
                'whatsapp_number' => '6281270004444',
                'is_active' => true,
            ],
            [
                'name' => 'Yamaha Aspacindo Siak Sri Indrapura',
                'slug' => 'yamaha-aspacindo-siak-sri-indrapura',
                'region' => 'Siak',
                'full_address' => 'Jl. Sutomo No. 24, Siak Sri Indrapura, Riau',
                'latitude' => 0.79320000,
                'longitude' => 102.05140000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Siak',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => 'Libur',
                ],
                'whatsapp_number' => '6281270005555',
                'is_active' => true,
            ],
            [
                'name' => 'Yamaha Aspacindo Bangkinang',
                'slug' => 'yamaha-aspacindo-bangkinang',
                'region' => 'Kampar',
                'full_address' => 'Jl. Prof. M. Yamin SH No. 78, Bangkinang, Kampar, Riau',
                'latitude' => 0.33410000,
                'longitude' => 101.03150000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Bangkinang',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => 'Libur',
                ],
                'whatsapp_number' => '6281270006666',
                'is_active' => true,
            ],
            [
                'name' => 'Yamaha Aspacindo Medan Kota',
                'slug' => 'yamaha-aspacindo-medan-kota',
                'region' => 'Medan',
                'full_address' => 'Jl. S. Parman No. 102, Medan, Sumatera Utara',
                'latitude' => 3.58520000,
                'longitude' => 98.66450000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Medan+Kota',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 15:00 WIB',
                ],
                'whatsapp_number' => '6281270007777',
                'is_active' => true,
            ],
            [
                'name' => 'Yamaha Aspacindo Rengat',
                'slug' => 'yamaha-aspacindo-rengat',
                'region' => 'Indragiri Hulu',
                'full_address' => 'Jl. A. Yani No. 45, Rengat, Indragiri Hulu, Riau',
                'latitude' => -0.37210000,
                'longitude' => 102.54890000,
                'google_maps_url' => 'https://maps.google.com/?q=Yamaha+Aspacindo+Rengat',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => 'Libur',
                ],
                'whatsapp_number' => '6281270008888',
                'is_active' => true,
            ],
        ];

        foreach ($branches as $branchData) {
            Branch::updateOrCreate(['slug' => $branchData['slug']], $branchData);
        }
    }
}
