import React, { useState } from 'react';
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
    const [carouselIndex, setCarouselIndex] = useState(0);

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

    // Carousel navigation logic
    const totalItems = featuredMotorcycles.length;
    const maxIndex = Math.max(0, totalItems - 3);

    const prevSlide = () => {
        setCarouselIndex((prev) => Math.max(0, prev - 1));
    };

    const nextSlide = () => {
        setCarouselIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    return (
        <PublicLayout title="Dealer Resmi Yamaha Terpercaya di Riau & Sumatera Utara">
            {/* HERO BANNER SECTION - Full Image Carousel (Yamaha Official Style) */}
            <section className="relative bg-slate-950 text-white overflow-hidden">
                <div className="w-full relative group">
                    <div className="w-full relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] overflow-hidden bg-slate-900">
                        <LazyImage
                            src="/assets/images/promos/hero_banner_yamaha.webp"
                            alt="Yamaha Motor Indonesia - Semakin Di Depan"
                            className="w-full h-full object-cover object-center"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>
                    </div>

                    {/* Subtle Overlay Quick Badges Bar */}
                    <div className="bg-slate-900/90 border-t border-slate-800 text-slate-300 py-3 px-4 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link href="/produk" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase">KATALOG</span>
                                    <span className="text-xs font-bold text-white group-hover:text-blue-400">Unit Terbaru</span>
                                </div>
                                <span className="text-blue-400 text-xs font-bold">&rarr;</span>
                            </Link>
                            <Link href="/simulasi-cicilan" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase">KREDIT</span>
                                    <span className="text-xs font-bold text-white group-hover:text-blue-400">Simulasi DP</span>
                                </div>
                                <span className="text-blue-400 text-xs font-bold">&rarr;</span>
                            </Link>
                            <Link href="/layanan#booking" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase">SERVIS</span>
                                    <span className="text-xs font-bold text-red-400 group-hover:underline">Booking Service</span>
                                </div>
                                <span className="text-red-400 text-xs font-bold">&rarr;</span>
                            </Link>
                            <Link href="/lokasi-dealer" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase">JARINGAN</span>
                                    <span className="text-xs font-bold text-amber-400 group-hover:underline">20+ Cabang</span>
                                </div>
                                <span className="text-amber-400 text-xs font-bold">&rarr;</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY EXPLORER */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kategori Pilihan</span>
                            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Kategori Motor Yamaha</h2>
                        </div>
                        <Link
                            href="/produk"
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="text-white font-bold text-xs px-5 py-2.5 rounded-full uppercase tracking-wider shadow-md hover:brightness-110 transition whitespace-nowrap"
                        >
                            Semua Produk &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categoryList.map((cat, idx) => (
                            <Link
                                key={idx}
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
            <section
                style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                className="py-12 text-white border-y border-blue-900 font-['Inter',sans-serif]"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{stats.years_operating || '15+'}</p>
                            <p className="text-xs sm:text-sm font-normal uppercase tracking-wider text-white">Tahun Pengalaman</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{stats.branches_count || '20+'}</p>
                            <p className="text-xs sm:text-sm font-normal uppercase tracking-wider text-white">Jaringan Cabang</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{stats.employees_count || '150+'}</p>
                            <p className="text-xs sm:text-sm font-normal uppercase tracking-wider text-white">Karyawan &amp; Mekanik</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{stats.satisfied_customers || '50,000+'}</p>
                            <p className="text-xs sm:text-sm font-normal uppercase tracking-wider text-white">Pelanggan Setia</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURED PRODUCTS - CAROUSEL SLIDER */}
            <section className="py-16 bg-slate-50 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Produk Unggulan</span>
                            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Motor Yamaha Paling Populer Hari Ini</h2>
                        </div>

                        {/* Carousel Navigation Buttons */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={prevSlide}
                                disabled={carouselIndex === 0}
                                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                className={`w-11 h-11 rounded-full text-white flex items-center justify-center shadow-md transition hover:brightness-110 ${
                                    carouselIndex === 0 ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                                aria-label="Previous slide"
                            >
                                &#10094;
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={carouselIndex >= maxIndex}
                                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                className={`w-11 h-11 rounded-full text-white flex items-center justify-center shadow-md transition hover:brightness-110 ${
                                    carouselIndex >= maxIndex ? 'opacity-40 cursor-not-allowed' : ''
                                }`}
                                aria-label="Next slide"
                            >
                                &#10095;
                            </button>
                        </div>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative overflow-hidden py-2">
                        <div
                            className="flex transition-transform duration-500 ease-out gap-6"
                            style={{
                                transform: `translateX(-${carouselIndex * (100 / (totalItems > 3 ? 3 : totalItems))}%)`,
                            }}
                        >
                            {featuredMotorcycles.map((motorcycle) => (
                                <div
                                    key={motorcycle.id}
                                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
                                >
                                    <MotorcycleCard motorcycle={motorcycle} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pagination Dots */}
                    {maxIndex > 0 && (
                        <div className="flex justify-center items-center gap-2 pt-2">
                            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCarouselIndex(idx)}
                                    className={`h-2.5 rounded-full transition-all duration-300 ${
                                        carouselIndex === idx
                                            ? 'w-8 bg-blue-700'
                                            : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}

                    <div className="text-center pt-4">
                        <Link
                            href="/produk"
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="inline-flex items-center justify-center gap-2 text-white font-bold px-8 py-3.5 rounded-full shadow-md transition hover:brightness-110 text-sm uppercase tracking-wider"
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
                        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Mengapa Memilih Aspacindo Kedaton Motor?</h2>
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
        </PublicLayout>
    );
}
