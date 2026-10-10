<?php

namespace Database\Seeders;

use App\Models\Motorcycle;
use App\Models\Prospect;
use Illuminate\Database\Seeder;

class ProspectSeeder extends Seeder
{
    public function run(): void
    {
        $motorcycles = Motorcycle::all();
        if ($motorcycles->isEmpty()) {
            return;
        }

        $nmax = $motorcycles->firstWhere('name', 'NMAX Turbo') ?? $motorcycles->first();
        $aerox = $motorcycles->firstWhere('name', 'Aerox 155 CyberCity') ?? $motorcycles->skip(1)->first() ?? $nmax;
        $fazzio = $motorcycles->firstWhere('name', 'Fazzio Hybrid Lux') ?? $motorcycles->last() ?? $nmax;

        $prospects = [
            [
                'ticket_number' => 'PRP-20261001-A1B2',
                'name' => 'Ahmad Rizky Pratama',
                'phone' => '081268493012',
                'email' => 'ahmad.rizky@gmail.com',
                'address' => 'Jl. Sudirman No. 145, Pekanbaru',
                'city' => 'Kota Pekanbaru',
                'current_motorcycle' => 'Mio M3 (2018)',
                'motorcycle_id' => $nmax->id,
                'motorcycle_name' => $nmax->name,
                'price_otr' => $nmax->price_otr,
                'dp_amount' => $nmax->price_otr * 0.20,
                'dp_percent' => 20,
                'tenor_months' => 36,
                'leasing_partner' => 'BAF (Bussan Auto Finance)',
                'monthly_installment' => round(($nmax->price_otr * 0.80 * 1.27) / 36),
                'notes' => 'Tertarik opsi kredit DP ringan, butuh unit cepat warna Hitam Glossy.',
                'status' => 'new',
                'follow_up_notes' => null,
                'created_at' => now()->subHours(2),
            ],
            [
                'ticket_number' => 'PRP-20261001-C3D4',
                'name' => 'Siti Nurhaliza',
                'phone' => '085271829304',
                'email' => 'siti.nurhaliza@yahoo.com',
                'address' => 'Jl. Tuanku Tambusai Gg. Melati No. 8',
                'city' => 'Kota Pekanbaru',
                'current_motorcycle' => 'Belum Punya Motor',
                'motorcycle_id' => $fazzio->id,
                'motorcycle_name' => $fazzio->name,
                'price_otr' => $fazzio->price_otr,
                'dp_amount' => $fazzio->price_otr * 0.15,
                'dp_percent' => 15,
                'tenor_months' => 24,
                'leasing_partner' => 'Adira Finance',
                'monthly_installment' => round(($fazzio->price_otr * 0.85 * 1.18) / 24),
                'notes' => 'Tanya syarat berkas untuk pekerja swasta.',
                'status' => 'contacted',
                'follow_up_notes' => 'Sudah dikirimkan brosur simulasi via WA. Janji kirim foto KTP sore ini.',
                'created_at' => now()->subDay(),
            ],
            [
                'ticket_number' => 'PRP-20260930-E5F6',
                'name' => 'Dedi Kurniawan',
                'phone' => '081390123847',
                'email' => 'dedi.kurniawan@hotmail.com',
                'address' => 'Jl. HR Subrantas Km 12, Panam',
                'city' => 'Kota Pekanbaru',
                'current_motorcycle' => 'Vixion Lightning (2015)',
                'motorcycle_id' => $aerox->id,
                'motorcycle_name' => $aerox->name,
                'price_otr' => $aerox->price_otr,
                'dp_amount' => $aerox->price_otr * 0.25,
                'dp_percent' => 25,
                'tenor_months' => 36,
                'leasing_partner' => 'WOM Finance',
                'monthly_installment' => round(($aerox->price_otr * 0.75 * 1.28) / 36),
                'notes' => 'Mau trade-in Vixion lama dengan Aerox Cybercity.',
                'status' => 'prospect',
                'follow_up_notes' => 'Survey rumah dijadwalkan besok jam 10.00 WIB oleh tim WOM.',
                'created_at' => now()->subDays(2),
            ]
        ];

        foreach ($prospects as $item) {
            Prospect::create($item);
        }
    }
}
