import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MotorcycleCard from '@/Components/MotorcycleCard';
import LazyImage from '@/Components/LazyImage';

export default function Home({
    featuredMotorcycles = [],
    categories = {},
    latestArticles = [],
    activePromotions = [],
    featuredTestimonials = [],
    stats = {},
}) {
    const categoryList = [
        { name: 'MAXi', desc: 'Skuter Premium VVA', color: 'from-blue-900 to-slate-900', count: categories.MAXi || 0 },
        { name: 'Classy', desc: 'Skuter Stylish Hybrid', color: 'from-amber-600 to-amber-800', count: categories.Classy || 0 },
        { name: 'Matic', desc: 'Praktis & Irit Harian', color: 'from-cyan-700 to-blue-900', count: categories.Matic || 0 },
        { name: 'Sport', desc: 'Performa Balap Sejati', color: 'from-red-700 to-slate-950', count: categories.Sport || 0 },
        { name: 'Off-Road', desc: 'Tangguh Jelajah Medan', color: 'from-emerald-700 to-slate-900', count: categories.OffRoad || 0 },
        { name: 'Moped', desc: 'Bebek Handal & Robust', color: 'from-slate-700 to-slate-900', count: categories.Moped || 0 },
    ];

    const whyChooseUs = [
        {
            title: 'Dealer Resmi Jaringan Terluas',
            desc: 'Lebih dari 20+ cabang resmi melayani penjualan, servis, dan suku cadang di seluruh Riau & Sumatera Utara.',
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            ),
        },
        {
            title: 'Suku Cadang 100% Original',
            desc: 'Jaminan ketersediaan suku cadang original Yamalube & Genuine Parts garansi pabrikan.',
            icon: (
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
        },
        {
            title: 'Teknisi Berpengalaman & Sertifikasi',
            desc: 'Mekanik terlatih standar Yamaha Jepang siap merawat performa terbaik sepeda motor Anda.',
            icon: (
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
            ),
        },
        {
            title: 'Layanan SKY (Service Kunjung)',
            desc: 'Servis motor langsung di rumah atau lokasi Anda tanpa perlu mengantre di bengkel.',
            icon: (
                <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
        },
    ];

    return (
        <PublicLayout title="Dealer Resmi Yamaha Terpercaya di Riau & Sumatera Utara">
            {/* HERO BANNER SECTION */}
            <section className="relative bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 text-white overflow-hidden py-16 md:py-24">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        <div className="lg:col-span-7 space-y-6">
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-300 text-xs font-semibold uppercase tracking-wider">
                                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                                Dealer Resmi Yamaha Riau &amp; Sumut
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-tight">
                                Wujudkan Impian <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-red-500">Yamaha Imut &amp; Tangguh</span>
                            </h1>
                            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                                Nikmati promo DP murah, angsuran ringan, proses mudah cepat, dan promo cashback khusus pembelian motor Yamaha NMAX Turbo, Aerox, Grand Filano di Aspacindo Kedaton Motor.
                            </p>

                            <div className="flex flex-wrap gap-4 pt-4">
                                <Link
                                    href="/produk"
                                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg hover:shadow-red-600/30 transition-all text-sm uppercase tracking-wider"
                                >
                                    Lihat Katalog Motor
                                </Link>
                                <Link
                                    href="/simulasi-cicilan"
                                    className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold px-8 py-4 rounded-xl transition-all text-sm uppercase tracking-wider backdrop-blur-sm"
                                >
                                    Simulasi Cicilan OTR
                                </Link>
                            </div>

                            {/* Quick Action Badges */}
                            <div className="pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4">
                                <Link href="/layanan#booking" className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-blue-500 transition group">
                                    <span className="text-xs text-slate-400 block font-medium">Layanan</span>
                                    <span className="text-sm font-bold text-white group-hover:text-blue-400">Booking Service &rarr;</span>
                                </Link>
                                <Link href="/lokasi-dealer" className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-blue-500 transition group">
                                    <span className="text-xs text-slate-400 block font-medium">Jaringan</span>
                                    <span className="text-sm font-bold text-white group-hover:text-blue-400">20+ Dealer &rarr;</span>
                                </Link>
                                <Link href="/promo" className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-blue-500 transition group">
                                    <span className="text-xs text-slate-400 block font-medium">Promo Hari Ini</span>
                                    <span className="text-sm font-bold text-amber-400 group-hover:underline">Cashback OTR &rarr;</span>
                                </Link>
                                <Link href="/loyalty" className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 hover:border-blue-500 transition group">
                                    <span className="text-xs text-slate-400 block font-medium">Loyalty Member</span>
                                    <span className="text-sm font-bold text-emerald-400 group-hover:underline">Dapat Poin &rarr;</span>
                                </Link>
                            </div>
                        </div>

                        <div className="lg:col-span-5 relative">
                            <div className="relative mx-auto max-w-md">
                                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-red-600 rounded-3xl blur opacity-30 animate-pulse"></div>
                                <div className="relative bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center space-y-4">
                                    <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30 uppercase tracking-widest">
                                        Flagship Feature
                                    </span>
                                    <h3 className="text-2xl font-black text-white">YAMAHA NMAX TURBO</h3>
                                    <LazyImage
                                        src="/assets/images/motorcycles/yamaha-nmax-turbo.webp"
                                        alt="Yamaha NMAX Turbo"
                                        aspectRatio="aspect-[4/3]"
                                        className="w-full object-contain"
                                    />
                                    <div className="pt-2 flex justify-between items-center bg-slate-950 p-4 rounded-2xl border border-slate-800">
                                        <div className="text-left">
                                            <span className="text-[10px] text-slate-400 uppercase font-semibold">Harga OTR Riau Mulai</span>
                                            <p className="text-lg font-extrabold text-blue-400">Rp 37.750.000</p>
                                        </div>
                                        <Link href="/produk/yamaha-nmax-turbo" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition">
                                            Detail &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORIES GRID */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-widest block">Kategori Produk</span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Pilih Motor Sesuai Gaya Hidup Anda</h2>
                        </div>
                        <Link href="/produk" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            Lihat Semua Produk &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categoryList.map((cat) => (
                            <Link
                                key={cat.name}
                                href={`/produk?category=${cat.name}`}
                                className="group p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-500 hover:bg-blue-50/50 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="flex justify-between items-center">
                                        <span className="font-black text-lg text-slate-900 group-hover:text-blue-700 transition">
                                            {cat.name}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400 bg-white px-2 py-0.5 rounded-full border border-slate-200">
                                            {cat.count} Unit
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-2">{cat.desc}</p>
                                </div>
                                <div className="mt-6 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                                    Jelajahi &rarr;
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* STATS COUNTER */}
            <section className="py-12 bg-blue-900 text-white border-y border-blue-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-black text-amber-400">{stats.years_operating || '15+'}</p>
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">Tahun Pengalaman</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-black text-amber-400">{stats.branches_count || '20+'}</p>
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">Jaringan Cabang</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-black text-amber-400">{stats.employees_count || '150+'}</p>
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">Karyawan &amp; Mekanik</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-black text-amber-400">{stats.satisfied_customers || '50,000+'}</p>
                            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-blue-200">Pelanggan Setia</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Produk Unggulan</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Motor Yamaha Paling Populer Hari Ini</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {featuredMotorcycles.map((motorcycle) => (
                            <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
                        ))}
                    </div>

                    <div className="text-center pt-4">
                        <Link
                            href="/produk"
                            className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition text-sm uppercase tracking-wider"
                        >
                            Lihat Seluruh Katalog Motor &rarr;
                        </Link>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Keunggulan Aspacindo</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mengapa Memilih Aspacindo Kedaton Motor?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChooseUs.map((item, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 space-y-4 hover:shadow-md transition">
                                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center border border-slate-100">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LOYALTY PROMO BANNER */}
            <section className="py-16 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        <div className="lg:col-span-8 space-y-4">
                            <span className="inline-block px-3.5 py-1 bg-amber-500/20 text-amber-300 font-bold text-xs rounded-full border border-amber-500/30 uppercase tracking-wider">
                                Program Loyalty Eksklusif
                            </span>
                            <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
                                Bergabung dengan <span className="text-amber-400">Aspacindo Loyalty Customer</span>
                            </h2>
                            <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
                                Kumpulkan poin dari setiap pembelian sepeda motor, servis berkala, dan pembelian suku cadang. Tukarkan poin dengan voucher diskon, oli gratis, hingga merchandise exclusive Yamaha!
                            </p>
                        </div>
                        <div className="lg:col-span-4 flex justify-start lg:justify-end">
                            <Link
                                href="/loyalty"
                                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-8 py-4 rounded-xl shadow-lg hover:shadow-amber-500/30 transition text-sm uppercase tracking-wider"
                            >
                                Daftar Loyalty Sekarang &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* LATEST ARTICLES & PROMOS */}
            <section className="py-16 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">Berita &amp; Promo</span>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kabar Terbaru Yamaha Aspacindo</h2>
                        </div>
                        <Link href="/artikel" className="text-sm font-bold text-blue-600 hover:text-blue-700">
                            Lihat Semua Artikel &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {latestArticles.map((article) => (
                            <div key={article.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col justify-between">
                                <div>
                                    <div className="relative">
                                        <LazyImage
                                            src={article.thumbnail || '/assets/images/placeholder_article.webp'}
                                            alt={article.title}
                                            aspectRatio="aspect-[16/9]"
                                        />
                                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                                            {article.category}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition">
                                            <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-2">
                                    <Link href={`/artikel/${article.slug}`} className="text-xs font-bold text-blue-600 hover:underline">
                                        Baca Selengkapnya &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
