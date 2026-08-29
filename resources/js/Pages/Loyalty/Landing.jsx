import React, { useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import LazyImage from '@/Components/LazyImage';

export default function Landing({ rewards = [], tierThresholds = {}, earningRules = [], faqs = [] }) {
    const { props } = usePage();
    const authUser = props.auth?.user;
    const [mockEmail, setMockEmail] = useState('');

    const { post: submitMockLogin } = useForm();

    const handleMockLogin = (e) => {
        e.preventDefault();
        submitMockLogin('/auth/mock-login', {
            data: { email: mockEmail || 'budi.santoso@gmail.com' },
        });
    };

    return (
        <PublicLayout title="Aspacindo Loyalty Customer - Program Poin Membership Yamaha">
            {/* HERO LANDING BANNER */}
            <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white py-16 md:py-24 relative overflow-hidden border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <span className="inline-block px-3.5 py-1.5 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30 uppercase tracking-wider">
                                Customer Loyalty Program
                            </span>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight">
                                Kumpulkan Poin, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">Nikmati Hadiah Exclusive</span>
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                                Bergabunglah bersama puluhan ribu pemilik motor Yamaha di Riau &amp; Sumut. Dapatkan poin dari setiap pembelian unit, servis rutin, dan spare part original.
                            </p>

                            <div className="pt-4 flex flex-wrap gap-4 items-center">
                                {authUser ? (
                                    <Link
                                        href="/loyalty/dashboard"
                                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 py-4 rounded-xl shadow-lg transition text-sm uppercase tracking-wider"
                                    >
                                        Buka Dashboard Member Saya &rarr;
                                    </Link>
                                ) : (
                                    <a
                                        href="/auth/google"
                                        className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-8 py-4 rounded-xl shadow-xl transition flex items-center gap-3 text-sm uppercase tracking-wider"
                                    >
                                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                                            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.11 0-5.74-2.1-6.68-4.93H1.26v3.15C3.24 21.3 7.31 24 12 24z" />
                                            <path fill="#FBBC05" d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.06-3.15z" />
                                            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.24 2.7 1.26 6.58l4.06 3.15c.94-2.83 3.57-4.98 6.68-4.98z" />
                                        </svg>
                                        Daftar / Masuk dengan Google
                                    </a>
                                )}
                            </div>

                            {/* Fast Dev Testing Helper */}
                            {!authUser && (
                                <form onSubmit={handleMockLogin} className="pt-6 border-t border-slate-800/80 flex flex-wrap gap-2 items-center text-xs">
                                    <span className="text-slate-400 font-semibold">Dev Login Cepat:</span>
                                    <input
                                        type="email"
                                        placeholder="email@customer.com"
                                        value={mockEmail}
                                        onChange={(e) => setMockEmail(e.target.value)}
                                        className="bg-slate-900 border-slate-700 text-white rounded-lg px-3 py-1.5 text-xs w-48"
                                    />
                                    <button type="submit" className="bg-amber-500 text-slate-950 font-bold px-3 py-1.5 rounded-lg">
                                        Masuk Akun Test &rarr;
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Digital Card Preview Graphic */}
                        <div className="lg:col-span-5">
                            <div className="bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-700 p-8 rounded-3xl text-slate-950 shadow-2xl space-y-6 transform hover:-rotate-1 transition duration-500 border border-amber-400/40">
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-xl tracking-wider">ASPACINDO LOYALTY</span>
                                    <span className="bg-slate-950 text-amber-400 font-black text-xs px-3 py-1 rounded-full uppercase">
                                        GOLD TIER
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-80">Saldo Poin Anda</p>
                                    <p className="text-4xl font-black">1.250 <span className="text-base font-semibold">POIN</span></p>
                                </div>
                                <div className="pt-4 border-t border-amber-600/50 flex justify-between items-end text-xs">
                                    <div>
                                        <p className="font-semibold opacity-75">Nama Member</p>
                                        <p className="font-bold text-sm">BUDI SANTOSO</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold opacity-75">Kode Member QR</p>
                                        <p className="font-mono font-bold">ALC-98A72B10</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">Cara Kerja</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">4 Langkah Mudah Kumpulkan Poin</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {earningRules.map((rule, idx) => (
                            <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-3">
                                <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm">
                                    0{idx + 1}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{rule.activity}</h3>
                                <span className="inline-block text-xs font-extrabold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                                    {rule.points}
                                </span>
                                <p className="text-xs text-slate-500 leading-relaxed">{rule.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* TIER COMPARISON MATRIX */}
            <section className="py-16 bg-slate-50 border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">Tingkatan Member</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Perbandingan Benefit Tier Membership</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Silver Tier */}
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                            <div className="space-y-1">
                                <span className="bg-slate-100 text-slate-700 text-xs font-black px-3 py-1 rounded-full uppercase">
                                    Silver Tier
                                </span>
                                <h3 className="text-2xl font-black text-slate-900">0 - 999 Poin</h3>
                                <p className="text-xs text-slate-500">Tier awal otomatis setelah pendaftaran akun.</p>
                            </div>
                            <ul className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
                                <li className="flex items-center gap-2">✓ Kartu Member Digital &amp; QR Code</li>
                                <li className="flex items-center gap-2">✓ Pengumpulan Poin Servis &amp; Spare Part</li>
                                <li className="flex items-center gap-2">✓ Akses Penukaran Katalog Hadiah</li>
                            </ul>
                        </div>

                        {/* Gold Tier */}
                        <div className="bg-gradient-to-b from-amber-50 to-white p-8 rounded-3xl border-2 border-amber-400 shadow-lg space-y-6 relative">
                            <span className="absolute -top-3.5 left-8 bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-3 py-1 rounded-full">
                                Paling Populer
                            </span>
                            <div className="space-y-1">
                                <span className="bg-amber-500 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                                    Gold Tier
                                </span>
                                <h3 className="text-2xl font-black text-slate-900">1.000 - 4.999 Poin</h3>
                                <p className="text-xs text-slate-500">Untuk konsumen yang rutin servis di Aspacindo.</p>
                            </div>
                            <ul className="space-y-3 text-xs text-slate-700 border-t border-amber-200 pt-4 font-medium">
                                <li className="flex items-center gap-2 text-amber-700 font-bold">✓ Semua Benefit Silver Tier</li>
                                <li className="flex items-center gap-2">✓ Bonus Poin Tambahan +10% per Transaksi</li>
                                <li className="flex items-center gap-2">✓ Antrean Prioritas Booking Service</li>
                                <li className="flex items-center gap-2">✓ Diskon Khusus Jasa Service 10%</li>
                            </ul>
                        </div>

                        {/* Platinum Tier */}
                        <div className="bg-slate-900 text-white p-8 rounded-3xl border border-slate-800 shadow-xl space-y-6">
                            <div className="space-y-1">
                                <span className="bg-gradient-to-r from-slate-400 to-slate-200 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase">
                                    Platinum Tier
                                </span>
                                <h3 className="text-2xl font-black text-white">5.000+ Poin</h3>
                                <p className="text-xs text-slate-400">Tingkat tertinggi dengan keistimewaan maksimal.</p>
                            </div>
                            <ul className="space-y-3 text-xs text-slate-300 border-t border-slate-800 pt-4">
                                <li className="flex items-center gap-2 text-amber-400 font-bold">✓ Semua Benefit Gold Tier</li>
                                <li className="flex items-center gap-2">✓ Bonus Poin Tambahan +25% per Transaksi</li>
                                <li className="flex items-center gap-2">✓ Layanan SKY (Service Kunjung) Bebas Biaya</li>
                                <li className="flex items-center gap-2">✓ Undangan Eksklusif Event Touring Yamaha</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* REWARDS CATALOG PREVIEW */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">Katalog Hadiah</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Katalog Hadiah Yang Bisa Ditukarkan</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {rewards.map((reward) => (
                            <div key={reward.id} className="bg-slate-50 rounded-3xl border border-slate-100 p-6 space-y-4 shadow-sm">
                                <LazyImage
                                    src={reward.image || '/assets/images/placeholder_reward.webp'}
                                    alt={reward.name}
                                    aspectRatio="aspect-[4/3]"
                                />
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full uppercase">
                                        {reward.points_cost} POIN
                                    </span>
                                    <h4 className="text-base font-bold text-slate-900">{reward.name}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{reward.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ ACCORDION */}
            <section className="py-16 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center space-y-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">Pertanyaan Umum</span>
                        <h2 className="text-3xl font-black text-slate-900">Pertanyaan Sering Diajukan (FAQ)</h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                                <h4 className="text-base font-bold text-slate-900">{faq.question}</h4>
                                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
