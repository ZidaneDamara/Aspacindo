<?php

namespace Database\Seeders;

use App\Models\Motorcycle;

use Illuminate\Database\Seeder;

class MotorcycleSeeder extends Seeder
{
    public function run(): void
    {
        $bikes = [
            [
                'name' => 'Yamaha NMAX Turbo',
                'slug' => 'yamaha-nmax-turbo',
                'category' => 'MAXi',
                'price_otr' => 37750000,
                'short_description' => 'Motor matic bongsor premium dengan teknologi Y-CVT Turbo yang menghadirkan sensasi berkendara bertenaga dan responsif.',
                'full_specifications' => [
                    'Engine' => [
                        'Tipe Mesin' => 'Liquid Cooled 4-Stroke, SOHC, VVA',
                        'Kapasitas Mesin' => '155 cc',
                        'Daya Maksimum' => '11.3 kW / 8,000 rpm',
                        'Torsi Maksimum' => '14.2 Nm / 6,500 rpm',
                        'Sistem Bahan Bakar' => 'Fuel Injection',
                    ],
                    'Dimensions' => [
                        'P x L x T' => '1.935 mm x 740 mm x 1.160 mm',
                        'Jarak Sumbu Roda' => '1.340 mm',
                        'Tinggi Tempat Duduk' => '770 mm',
                        'Kapasitas Tangki' => '7.1 Liter',
                    ],
                    'Electrical' => [
                        'Sistem Pengapian' => 'TCI',
                        'Aki / Baterai' => 'YTZ6V',
                        'Tipe Busi' => 'NGK / CPR8EA-9',
                    ],
                ],
                'is_featured' => true,
                'is_active' => true,
                'colors' => [
                    ['color_name' => 'Elixir Dark Silver', 'hex_code' => '#3D4148'],
                    ['color_name' => 'Magma Black', 'hex_code' => '#1A1A1A'],
                ],
            ],
            [
                'name' => 'Yamaha XMAX 250 Tech MAX',
                'slug' => 'yamaha-xmax-250-tech-max',
                'category' => 'MAXi',
                'price_otr' => 71300000,
                'short_description' => 'Flagship MAXi Yamaha 250cc dengan navigasi Garmin, jok eksklusif Tech MAX, dan kenyamanan jelajah jarak jauh terbaik.',
                'full_specifications' => [
                    'Engine' => [
                        'Tipe Mesin' => 'Liquid Cooled 4-Stroke, SOHC 4-Valves',
                        'Kapasitas Mesin' => '249.8 cc',
                        'Daya Maksimum' => '16.8 kW / 7,000 rpm',
                        'Torsi Maksimum' => '24.3 Nm / 5,500 rpm',
                    ],
                    'Dimensions' => [
                        'P x L x T' => '2.180 mm x 795 mm x 1.460 mm',
                        'Kapasitas Tangki' => '13 Liter',
                    ],
                ],
                'is_featured' => true,
                'is_active' => true,
                'colors' => [
                    ['color_name' => 'Magma Black', 'hex_code' => '#212121'],
                ],
            ],
            [
                'name' => 'Yamaha Aerox 155 CyberCity',
                'slug' => 'yamaha-aerox-155-cybercity',
                'category' => 'MAXi',
                'price_otr' => 28350000,
                'short_description' => 'Super Sport Scooter dengan desain sporty tajam, bodi aerodinamis, serta performa mesin Blue Core 155cc VVA.',
                'full_specifications' => [
                    'Engine' => [
                        'Tipe Mesin' => 'Liquid Cooled 4-Stroke, SOHC, VVA',
                        'Kapasitas Mesin' => '155 cc',
                        'Daya Maksimum' => '11.3 kW / 8,000 rpm',
                    ],
                ],
                'is_featured' => true,
                'is_active' => true,
                'colors' => [
                    ['color_name' => 'Cyber City Livery', 'hex_code' => '#0A3B74'],
                    ['color_name' => 'Racing White', 'hex_code' => '#FFFFFF'],
                ],
            ],
            [
                'name' => 'Yamaha Grand Filano Hybrid',
                'slug' => 'yamaha-grand-filano-hybrid',
                'category' => 'Classy',
                'price_otr' => 27500000,
                'short_description' => 'Skuter berdesain classy elegan dilengkapi mesin Blue Core Hybrid 125cc, digital meter TFT, dan kepraktisan bagasi besar.',
                'full_specifications' => [
                    'Engine' => [
                        'Tipe Mesin' => 'Air Cooled 4-Stroke, SOHC Blue Core Hybrid',
                        'Kapasitas Mesin' => '124.86 cc',
                    ],
                ],
                'is_featured' => true,
                'is_active' => true,
                'colors' => [
                    ['color_name' => 'Lux White Pearl', 'hex_code' => '#F4F5F7'],
                    ['color_name' => 'Neo Dull Blue', 'hex_code' => '#2A52BE'],
                ],
            ],
            [
                'name' => 'Yamaha Fazzio Hybrid',
                'slug' => 'yamaha-fazzio-hybrid',
                'category' => 'Classy',
                'price_otr' => 22700000,
                'short_description' => 'Motor bergaya stylish dan unik khusus anak muda kreatif, hemat bahan bakar dengan akselerasi awal bertenaga Hybrid.',
                'full_specifications' => [
                    'Engine' => [
                        'Tipe Mesin' => 'Air Cooled 4-Stroke, SOHC Blue Core Hybrid',
                        'Kapasitas Mesin' => '124.86 cc',
                    ],
                ],
                'is_featured' => false,
                'is_active' => true,
                'colors' => [
                    ['color_name' => 'Neo Cyan', 'hex_code' => '#00FFFF'],
                    ['color_name' => 'Neo Red', 'hex_code' => '#D32F2F'],
                ],
            ],
            [
                'name' => 'Yamaha YZF-R15 Connected',
                'slug' => 'yamaha-yzf-r15-connected',
                'category' => 'Sport',
                'price_otr' => 40300000,
                'short_description' => 'Motor sport fairing berteknologi balap dengan Traction Control System, Assist & Slipper Clutch, dan konektivitas Y-Connect.',
                'full_specifications' => [
                    'Engine' => [
                        'Tipe Mesin' => 'Liquid Cooled 4-Stroke, SOHC 4-Valve, VVA',
                        'Kapasitas Mesin' => '155.09 cc',
                    ],
                ],
                'is_featured' => true,
                'is_active' => true,
                'colors' => [
                    ['color_name' => 'Icon Blue', 'hex_code' => '#0D47A1'],
                    ['color_name' => 'Tech Black', 'hex_code' => '#121212'],
                ],
            ],
            [
                'name' => 'Yamaha WR 155 R',
                'slug' => 'yamaha-wr-155-r',
                'category' => 'Off-Road',
                'price_otr' => 38900000,
                'short_description' => 'Motor trail adventure terkuat di kelasnya dengan mesin 155cc VVA berpendingin cairan dan suspensi teleskopik panjang.',
                'full_specifications' => [
                    'Engine' => [
                        'Tipe Mesin' => 'Liquid Cooled 4-Stroke, SOHC, 4-Valves, VVA',
                        'Kapasitas Mesin' => '155 cc',
                    ],
                ],
                'is_featured' => false,
                'is_active' => true,
                'colors' => [
                    ['color_name' => 'Yamaha Blue', 'hex_code' => '#1565C0'],
                    ['color_name' => 'Yamaha Black', 'hex_code' => '#000000'],
                ],
            ],
        ];

        foreach ($bikes as $bikeData) {
            $colors = $bikeData['colors'] ?? [];
            unset($bikeData['colors']);

            $motorcycle = Motorcycle::updateOrCreate(['slug' => $bikeData['slug']], $bikeData);

            // Seed sample image
            $motorcycle->images()->updateOrCreate(
                ['is_primary' => true],
                ['image_path' => '/assets/images/motorcycles/' . $bikeData['slug'] . '.webp', 'sort_order' => 1]
            );

            // Seed color variants
            foreach ($colors as $color) {
                $motorcycle->colors()->updateOrCreate(
                    ['color_name' => $color['color_name']],
                    ['hex_code' => $color['hex_code'], 'image_path' => '/assets/images/motorcycles/' . $bikeData['slug'] . '.webp']
                );
            }
        }
    }
}
