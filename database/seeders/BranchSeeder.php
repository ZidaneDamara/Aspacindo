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
                'name' => 'Aspacindo Kedaton Motor Riau 1 (Pekanbaru)',
                'slug' => 'aspacindo-kedaton-motor-riau-1-pekanbaru',
                'region' => 'Pekanbaru',
                'dealer_type' => '3S',
                'full_address' => 'Jl. Riau No. 1, Pekanbaru, Riau',
                'latitude' => 0.53120000,
                'longitude' => 101.43980000,
                'google_maps_url' => 'https://maps.app.goo.gl/KEg7AKyv4n3y7Adh7',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 14:00 WIB',
                ],
                'social_media' => [
                    'instagram' => 'https://www.instagram.com/aspacindopekanbaru?utm_source=ig_web_button_share_sheet&obrf=ZDNlZDc0MzIxNw==',
                    'facebook' => 'https://www.facebook.com/share/1CaH6NVEMd/',
                    'tiktok' => 'https://www.tiktok.com/@aspacindopekanbaru?_r=1&_t=ZS-9AhpzW7gbAq',
                ],
                'whatsapp_number' => 'https://wa.me/message/EPGP67RFURADH1',
                'has_service_center' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Aspacindo Kedaton Motor Sorek (Pelalawan)',
                'slug' => 'aspacindo-kedaton-motor-sorek-pelalawan',
                'region' => 'Pelalawan',
                'dealer_type' => '3S',
                'full_address' => 'Jl. Lintas Timur Sorek, Pelalawan, Riau',
                'latitude' => 0.17420000,
                'longitude' => 102.04890000,
                'google_maps_url' => 'https://maps.app.goo.gl/pyGnMYDyniRJR45o9',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 14:00 WIB',
                ],
                'social_media' => [
                    'instagram' => 'https://www.instagram.com/aspacindosorek?exln=MXZiMTJobm9teXVuOQ%3D%3D&utm_source=qr',
                    'facebook' => 'https://www.facebook.com/share/1BYVa5CbEp/?mibextid=wwXIfr',
                    'tiktok' => 'https://www.tiktok.com/@aspacindosorek',
                ],
                'whatsapp_number' => 'https://wa.me/message/FLBM3H5RVWOWF1',
                'has_service_center' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Aspacindo Kedaton Motor Sungai Pagar (Kampar)',
                'slug' => 'aspacindo-kedaton-motor-sungai-pagar-kampar',
                'region' => 'Kampar',
                'dealer_type' => '3S',
                'full_address' => 'Jl. Raya Sungai Pagar, Kampar Kiri Hilir, Kampar, Riau',
                'latitude' => 0.22810000,
                'longitude' => 101.37120000,
                'google_maps_url' => 'https://maps.google.com/?q=Aspacindo+Kedaton+Motor+Sungai+Pagar+Kampar',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 14:00 WIB',
                ],
                'whatsapp_number' => '6281270003333',
                'has_service_center' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Aspacindo Kedaton Motor Tembilahan (Indragiri Hilir)',
                'slug' => 'aspacindo-kedaton-motor-tembilahan-indragiri-hilir',
                'region' => 'Indragiri Hilir',
                'dealer_type' => '3S',
                'full_address' => 'Jl. M. Boya No. 12, Tembilahan, Indragiri Hilir, Riau',
                'latitude' => -0.32280000,
                'longitude' => 103.15540000,
                'google_maps_url' => 'https://maps.google.com/?q=Aspacindo+Kedaton+Motor+Tembilahan',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 14:00 WIB',
                ],
                'whatsapp_number' => '6281270004444',
                'has_service_center' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Aspacindo Kedaton Motor Air Molek (Indragiri Hulu)',
                'slug' => 'aspacindo-kedaton-motor-air-molek-indragiri-hulu',
                'region' => 'Indragiri Hulu',
                'dealer_type' => '3S',
                'full_address' => 'Jl. Jend. Sudirman, Air Molek, Pasir Penyu, Indragiri Hulu, Riau',
                'latitude' => -0.36420000,
                'longitude' => 102.29810000,
                'google_maps_url' => 'https://share.google/BM9HJtM77m1Yvk9Z6',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 14:00 WIB',
                ],
                'social_media' => [
                    'instagram' => 'https://www.instagram.com/aspacindoairmolek?dlrf=MTBueWhrdDZuNGlxaw%3D%3D&utm_source=qr',
                    'facebook' => 'https://www.facebook.com/share/1DzRj8DBhX/?mibextid=wwXIfr',
                    'tiktok' => 'https://www.tiktok.com/@aspacindoairmolek?_r=1&_t=ZS-9AhnKxLEdUq',
                ],
                'whatsapp_number' => '6285199547759',
                'has_service_center' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Aspacindo Kedaton Motor Kandis (Siak)',
                'slug' => 'aspacindo-kedaton-motor-kandis-siak',
                'region' => 'Siak',
                'dealer_type' => '3S',
                'full_address' => 'Jl. Raya Pekanbaru - Duri Km. 72, Kandis, Siak, Riau',
                'latitude' => 0.96320000,
                'longitude' => 101.24120000,
                'google_maps_url' => 'https://maps.app.goo.gl/km6wEvBVEFXyWinX9',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 14:00 WIB',
                ],
                'social_media' => [
                    'instagram' => 'https://www.instagram.com/aspacindokandis?psln=bmRqMGY1OXN1OWp4y',
                    'facebook' => 'https://www.facebook.com/yamaha.aspacindo.kandis',
                    'tiktok' => 'https://tiktok.com/@aspacindokandis',
                ],
                'whatsapp_number' => 'https://wa.me/message/RQ2KOOYUDDUAH1',
                'has_service_center' => true,
                'is_active' => true,
            ],
            [
                'name' => 'Aspacindo Kedaton Motor Medan (Medan)',
                'slug' => 'aspacindo-kedaton-motor-medan',
                'region' => 'Medan',
                'dealer_type' => '3S',
                'full_address' => 'Jl. S. Parman No. 102, Medan, Sumatera Utara',
                'latitude' => 3.58520000,
                'longitude' => 98.66450000,
                'google_maps_url' => 'https://maps.google.com/?q=Aspacindo+Kedaton+Motor+Medan',
                'operating_hours' => [
                    'Senin - Sabtu' => '08:00 - 17:00 WIB',
                    'Minggu' => '09:00 - 14:00 WIB',
                ],
                'whatsapp_number' => '6281270007777',
                'has_service_center' => true,
                'is_active' => true,
            ],
        ];

        // Clean out old seeders if needed and insert fresh
        Branch::query()->delete();

        foreach ($branches as $branchData) {
            Branch::create($branchData);
        }
    }
}
