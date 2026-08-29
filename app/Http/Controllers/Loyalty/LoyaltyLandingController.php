<?php

namespace App\Http\Controllers\Loyalty;

use App\Http\Controllers\Controller;
use App\Models\LoyaltyReward;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class LoyaltyLandingController extends Controller
{
    public function __invoke(): Response
    {
        $rewards = LoyaltyReward::active()
            ->orderBy('points_cost', 'asc')
            ->get();

        $tierThresholds = Setting::get('loyalty_tier_thresholds', [
            'Silver' => 0,
            'Gold' => 1000,
            'Platinum' => 5000,
        ]);

        $earningRules = [
            [
                'activity' => 'Pembelian Sepeda Motor Baru',
                'points' => '1 Poin kelipatan Rp 50.000',
                'desc' => 'Dapatkan ratusan poin langsung setiap transaksi unit sepeda motor Yamaha baru.',
            ],
            [
                'activity' => 'Servis Berkala di Bengkel Resmi',
                'points' => '1 Poin kelipatan Rp 1.000',
                'desc' => 'Setiap perawatan rutin & pergantian oli menambah saldo poin loyalty Anda.',
            ],
            [
                'activity' => 'Pembelian Spare Part Original',
                'points' => '1 Poin kelipatan Rp 2.000',
                'desc' => 'Beli suku cadang & aksesoris resmi Yamalube untuk kumpulkan poin.',
            ],
            [
                'activity' => 'Referral Teman / Kerabat',
                'points' => '+50 Poin Bonus',
                'desc' => 'Ajak teman membeli motor di Aspacindo dan dapatkan bonus poin instan.',
            ],
        ];

        $faqs = [
            [
                'question' => 'Bagaimana cara bergabung dengan Aspacindo Loyalty Customer?',
                'answer' => 'Sangat mudah! Cukup klik tombol "Daftar dengan Google", lalu lengkapi nomor telepon Anda. Akun member digital ALC Anda langsung aktif seketika.',
            ],
            [
                'question' => 'Bagaimana cara mengumpulkan poin saat bertransaksi di dealer?',
                'answer' => 'Tunjukkan QR Code member digital Anda di aplikasi/dashboard ini kepada kasir/staff dealer saat melakukan pembelian motor atau servis.',
            ],
            [
                'question' => 'Apakah poin loyalty memiliki masa kadaluarsa?',
                'answer' => 'Ya, poin berlaku selama 12 bulan sejak tanggal didapatkan. Pastikan Anda menukarkan poin sebelum masa berlaku berakhir.',
            ],
            [
                'question' => 'Bagaimana cara menukarkan poin dengan hadiah?',
                'answer' => 'Buka menu "Katalog Hadiah" di Dashboard Member Anda, pilih voucher atau merchandise yang diinginkan, dan tekan "Tukar Sekarang".',
            ],
        ];

        return Inertia::render('Loyalty/Landing', [
            'rewards' => $rewards,
            'tierThresholds' => $tierThresholds,
            'earningRules' => $earningRules,
            'faqs' => $faqs,
        ]);
    }
}
