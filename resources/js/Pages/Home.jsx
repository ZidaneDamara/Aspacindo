import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MotorcycleCard from '@/Components/MotorcycleCard';
import LazyImage from '@/Components/LazyImage';

export default function Home({
    featuredMotorcycles = [],
    categories = {},
    regions = [],
    selectedRegion = 'Pekanbaru',
    latestArticles = [],
    activePromotions = [],
    featuredTestimonials = [],
    branchesSummary = [],
    stats = {},
}) {
    const defaultRegions = [
        'Pekanbaru',
        'Siak',
        'Kampar',
        'Pelalawan',
        'Indragiri Hulu',
        'Indragiri Hilir',
        'Medan',
    ];
    const allRegions = regions.length > 0 ? regions : defaultRegions;

    const [currentRegion, setCurrentRegion] = useState(selectedRegion || 'Pekanbaru');
    const [carouselIndex, setCarouselIndex] = useState(0);
    const [heroIndex, setHeroIndex] = useState(0);

    const heroBanners = [
        {
            id: 'jupiter-z1',
            image: '/assets/images/promos/jupiter-z1-hero-banner.jpg',
            alt: 'Yamaha Jupiter Z1 - Motor Legendaris Indonesia, Yang Lain Semakin Ketinggalan Lagi!',
            title: 'Yamaha Jupiter Z1',
            subtitle: 'Motor Legendaris Indonesia – Yang Lain, Semakin Ketinggalan Lagi!',
            link: '/produk/yamaha-jupiter-z1',
        },
        {
            id: 'wr-155-r',
            image: '/assets/images/promos/wr-155-r-hero-banner.jpg',
            alt: 'Yamaha WR 155 R - The Real Adventure Partner',
            title: 'Yamaha WR 155 R',
            subtitle: 'The Real Adventure Partner – Tangguh di Segala Medan',
            link: '/produk/yamaha-wr-155-r',
        },
        {
            id: 'mx-king-150',
            image: '/assets/images/promos/mx-king-hero-banner.jpg',
            alt: 'Yamaha MX King 150 - King of Street',
            title: 'Yamaha MX King 150',
            subtitle: 'King of Street – Edisi Balap MotoGP Prima Pramac Racing',
            link: '/produk/yamaha-mx-king-150-prima-pramac',
        },
        {
            id: 'all-new-vixion',
            image: '/assets/images/promos/all-new-vixion-hero-banner.jpg',
            alt: 'Yamaha All New Vixion - Live The Legend',
            title: 'Yamaha All New Vixion',
            subtitle: 'Live The Legend – Naked Sport 150cc Deltabox dengan Assist & Slipper Clutch',
            link: '/produk/yamaha-all-new-vixion',
        },
        ...(activePromotions.length > 0
            ? activePromotions.map((p) => ({
                  id: `promo-${p.id}`,
                  image: p.banner_image || p.image_path || '/assets/images/promos/hero_banner_yamaha.webp',
                  alt: p.title || 'Promo Yamaha Aspacindo',
                  title: p.title,
                  subtitle: p.subtitle || p.short_description,
                  link: `/promo/${p.slug}`,
              }))
            : [
                  {
                      id: 'official-yamaha',
                      image: '/assets/images/promos/hero_banner_yamaha.webp',
                      alt: 'Yamaha Motor Indonesia - PT Aspacindo Kedaton Motor Semakin Di Depan',
                      title: 'PT. Aspacindo Kedaton Motor',
                      subtitle: 'Dealer Resmi Yamaha Terpercaya di Riau & Sumatera Utara',
                      link: '/produk',
                  },
              ]),
    ];

    useEffect(() => {
        if (heroBanners.length <= 1) return;
        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroBanners.length);
        }, 6000);
        return () => clearInterval(interval);
    }, [heroBanners.length]);

    const handleRegionChange = (e) => {
        const reg = e.target.value;
        setCurrentRegion(reg);
        if (typeof window !== 'undefined') {
            localStorage.setItem('aspacindo_preferred_region', reg);
        }
        router.get('/', { region: reg !== 'Pekanbaru' ? reg : undefined }, { preserveState: true, preserveScroll: true, replace: true });
    };

    const categoryList = [
        { name: 'MAXi', desc: 'Skuter Premium VVA', color: 'from-blue-900 to-slate-900', count: categories.MAXi || 0 },
        { name: 'Classy', desc: 'Skuter Stylish Hybrid', color: 'from-amber-600 to-amber-800', count: categories.Classy || 0 },
        { name: 'Matic', desc: 'Praktis & Irit Harian', color: 'from-cyan-700 to-blue-900', count: categories.Matic || 0 },
        { name: 'Sport', desc: 'Performa Balap Sejati', color: 'from-red-700 to-slate-950', count: categories.Sport || 0 },
        { name: 'Off-Road', desc: 'Tangguh Jelajah Medan', color: 'from-emerald-700 to-slate-900', count: categories['Off-Road'] ?? categories.OffRoad ?? 0 },
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

    // Branch coverage data
    const serviceAreas = [
        {
            city: 'Kota Pekanbaru',
            coverage: 'Pusat (Jl. Riau Ujung No 88 A-E), Cabang Riau, Garuda Sakti',
            tag: 'Kantor Pusat & Dealer 3S',
        },
        {
            city: 'Kab. Pelalawan',
            coverage: 'Pangkalan Kerinci, Sorek, Ukui',
            tag: 'Sales & Service',
        },
        {
            city: 'Kab. Siak',
            coverage: 'Kandis, Siak Sri Indrapura, Perawang, Sabak Auh',
            tag: 'Dealer 3S & Sparepart',
        },
        {
            city: 'Kab. Kampar',
            coverage: 'Bangkinang, Sungai Pagar, Petapahan, Lipat Kain',
            tag: 'Jaringan Cabang',
        },
        {
            city: 'Kab. Indragiri Hulu',
            coverage: 'Air Molek, Belilas, Peranap',
            tag: 'Dealer 3S',
        },
        {
            city: 'Kab. Indragiri Hilir',
            coverage: 'Tembilahan & Sekitarnya',
            tag: 'Layanan Penjualan',
        },
        {
            city: 'Sumatera Utara',
            coverage: 'Kota Medan & Deli Serdang (Pancur Batu)',
            tag: 'Jaringan Regional',
        },
    ];

    const fallbackBranches = [
        {
            name: 'Aspacindo Riau Ujung (Kantor Pusat)',
            region: 'Pekanbaru',
            dealer_type: '3S',
            full_address: 'Jl. Riau Ujung No 88 A-E, Tampan, Kec. Payung Sekaki, Pekanbaru, Riau 28292',
            whatsapp_number: '081262241100',
            google_maps_url: 'https://maps.google.com/?q=Aspacindo+Kedaton+Motor+Pekanbaru',
        },
        {
            name: 'Aspacindo Pangkalan Kerinci',
            region: 'Pelalawan',
            dealer_type: '3S',
            full_address: 'Jl. Lintas Timur, Pangkalan Kerinci, Kab. Pelalawan, Riau',
            whatsapp_number: '081262241100',
            google_maps_url: 'https://maps.google.com/?q=Aspacindo+Pangkalan+Kerinci',
        },
        {
            name: 'Aspacindo Kandis',
            region: 'Siak',
            dealer_type: '3S',
            full_address: 'Jl. Raya Pekanbaru - Duri KM 72, Kandis Kota, Kab. Siak, Riau',
            whatsapp_number: '081262241100',
            google_maps_url: 'https://maps.google.com/?q=Aspacindo+Kandis',
        },
        {
            name: 'Aspacindo Bangkinang',
            region: 'Kampar',
            dealer_type: '3S',
            full_address: 'Jl. Prof. M. Yamin SH, Bangkinang Kota, Kab. Kampar, Riau',
            whatsapp_number: '081262241100',
            google_maps_url: 'https://maps.google.com/?q=Aspacindo+Bangkinang',
        },
        {
            name: 'Aspacindo Air Molek',
            region: 'Indragiri Hulu',
            dealer_type: '3S',
            full_address: 'Jl. Jenderal Sudirman, Pasir Penyu, Air Molek, Kab. Indragiri Hulu, Riau',
            whatsapp_number: '081262241100',
            google_maps_url: 'https://maps.google.com/?q=Aspacindo+Air+Molek',
        },
        {
            name: 'Aspacindo Medan',
            region: 'Medan',
            dealer_type: '3S',
            full_address: 'Kota Medan & Deli Serdang, Sumatera Utara',
            whatsapp_number: '081262241100',
            google_maps_url: 'https://maps.google.com/?q=Aspacindo+Medan',
        },
    ];
    const displayBranches = (branchesSummary && branchesSummary.length > 0) ? branchesSummary : fallbackBranches;

    const fallbackArticles = [
        {
            id: 1,
            title: 'Bedah Fitur Canggih Yamaha NMAX Turbo & Navigasi Y-Connect Terbaru',
            slug: 'bedah-fitur-yamaha-nmax-turbo-y-connect',
            category: 'MAXi',
            author: 'Tim Redaksi Aspacindo',
            excerpt: 'Ketahui keunggulan teknologi Y-ECVT sensasi berkendara turbo pada All New Yamaha NMAX serta kemudahan konektivitas smartphone melalui aplikasi Y-Connect.',
            thumbnail: '/assets/images/promos/hero_banner_yamaha.webp',
            published_at: '2026-05-15',
        },
        {
            id: 2,
            title: 'Panduan Servis Berkala & Manfaat Oli Asli Yamalube Garansi Mesin Awet',
            slug: 'panduan-servis-berkala-oli-yamalube',
            category: 'Perawatan',
            author: 'Mekanik Kepala Bengkel',
            excerpt: 'Merawat mesin motor injeksi Yamaha wajib menggunakan oli Yamalube original. Simak interval penggantian oli dan filter udara yang direkomendasikan pabrikan.',
            thumbnail: '/assets/images/promos/hero_banner_yamaha.webp',
            published_at: '2026-06-10',
        },
        {
            id: 3,
            title: 'Tips Lolos Pengajuan Kredit Motor Yamaha dengan Cicilan Murah & DP Ringan',
            slug: 'tips-kredit-motor-yamaha-dp-ringan',
            category: 'Tips Pembelian',
            author: 'Konsultan Pembiayaan',
            excerpt: 'Mau beli Yamaha Fazzio atau Aerox dengan kredit mudah? Berikut tips kelengkapan berkas leasing BAF, Adira, dan Oto agar disetujui cepat.',
            thumbnail: '/assets/images/promos/hero_banner_yamaha.webp',
            published_at: '2026-07-01',
        },
    ];
    const displayArticles = (latestArticles && latestArticles.length > 0) ? latestArticles : fallbackArticles;

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
        <PublicLayout
            title="Dealer Resmi Yamaha – Aspacindo Kedaton Motor"
            description="Dealer Resmi Yamaha (PT. Aspacindo Kedaton Motor) - Penjualan sepeda motor Yamaha baru, bengkel resmi servis berkala, dan suku cadang asli di Pekanbaru, Pelalawan, Kampar, Siak, Inhu, Inhil (Riau) & Medan."
        >
            {/* HERO BANNER SECTION - Full Image Carousel (Yamaha Official Style) */}
            <section className="relative bg-slate-950 text-white overflow-hidden">
                <h1 className="sr-only font-play font-bold text-[18px] leading-[27px] uppercase text-white">
                    Dealer Resmi Yamaha – Aspacindo Kedaton Motor
                </h1>
                <div className="w-full relative group">
                    <div className="w-full relative aspect-[16/9] sm:aspect-[21/9] lg:aspect-[24/9] overflow-hidden bg-slate-900">
                        {heroBanners.map((banner, idx) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                    heroIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                            >
                                <Link href={banner.link} className="block w-full h-full relative group/slide">
                                    <LazyImage
                                        src={banner.image}
                                        alt={banner.alt}
                                        className="w-full h-full object-cover object-center"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                                </Link>
                            </div>
                        ))}

                        {/* Slider Controls (Prev / Next Buttons) */}
                        {heroBanners.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setHeroIndex((prev) => (prev === 0 ? heroBanners.length - 1 : prev - 1))}
                                    aria-label="Previous Slide"
                                    className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg border border-white/20"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setHeroIndex((prev) => (prev + 1) % heroBanners.length)}
                                    aria-label="Next Slide"
                                    className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-slate-950/60 hover:bg-slate-950/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg border border-white/20"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>

                                {/* Dots Navigation */}
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                                    {heroBanners.map((_, dotIdx) => (
                                        <button
                                            key={dotIdx}
                                            type="button"
                                            onClick={() => setHeroIndex(dotIdx)}
                                            aria-label={`Slide ${dotIdx + 1}`}
                                            className={`transition-all duration-300 rounded-full ${
                                                heroIndex === dotIdx
                                                    ? 'w-8 h-2.5 bg-blue-500 shadow-md'
                                                    : 'w-2.5 h-2.5 bg-white/60 hover:bg-white'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Subtle Overlay Quick Badges Bar */}
                    <div className="bg-slate-900/95 border-t border-slate-800 text-slate-300 py-3 px-4 backdrop-blur-md">
                        <div className="max-w-7xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <Link href="/produk" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">KATALOG PRODUK</span>
                                    <span className="text-xs font-bold text-white group-hover:text-blue-400">Motor Yamaha Terbaru</span>
                                </div>
                                <span className="text-blue-400 text-xs font-bold">&rarr;</span>
                            </Link>
                            <Link href="/simulasi-cicilan" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">SIMULASI KREDIT</span>
                                    <span className="text-xs font-bold text-white group-hover:text-blue-400">DP &amp; Cicilan OTR</span>
                                </div>
                                <span className="text-blue-400 text-xs font-bold">&rarr;</span>
                            </Link>
                            <Link href="/layanan" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">LAYANAN BENGKEL</span>
                                    <span className="text-xs font-bold text-red-400 group-hover:underline">Booking Service &amp; SKY</span>
                                </div>
                                <span className="text-red-400 text-xs font-bold">&rarr;</span>
                            </Link>
                            <Link href="/lokasi-dealer" className="p-2.5 bg-slate-950/70 rounded-xl border border-slate-800 hover:border-blue-500 transition flex items-center justify-between group">
                                <div>
                                    <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">JARINGAN CABANG</span>
                                    <span className="text-xs font-bold text-amber-400 group-hover:underline">20+ Dealer Resmi</span>
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
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Kategori Pilihan Produk</span>
                            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Katalog Sepeda Motor Yamaha</h2>
                        </div>
                        <Link
                            href="/produk"
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="text-white font-bold text-xs px-5 py-2.5 rounded-full uppercase tracking-wider shadow-md hover:brightness-110 transition whitespace-nowrap"
                        >
                            Lihat Semua Produk &rarr;
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
                className="py-12 text-white border-y border-blue-900"
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
            <section className="py-16 bg-white border-t border-slate-100 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Produk Unggulan Yamaha</span>
                            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Motor Yamaha Paling Populer Hari Ini</h2>
                        </div>

                        {/* Region Selector & Carousel Navigation Buttons */}
                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-xs">
                                <svg className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="text-xs font-bold text-slate-400">OTR:</span>
                                <select
                                    value={currentRegion}
                                    onChange={handleRegionChange}
                                    className="bg-transparent text-xs font-bold text-slate-800 border-none p-0 pr-4 focus:ring-0 cursor-pointer"
                                >
                                    {allRegions.map((reg) => (
                                        <option key={reg} value={reg}>Area {reg}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={prevSlide}
                                    disabled={carouselIndex === 0}
                                    style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                    className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md transition hover:brightness-110 ${
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
                                    className={`w-10 h-10 rounded-full text-white flex items-center justify-center shadow-md transition hover:brightness-110 ${
                                        carouselIndex >= maxIndex ? 'opacity-40 cursor-not-allowed' : ''
                                    }`}
                                    aria-label="Next slide"
                                >
                                    &#10095;
                                </button>
                            </div>
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
                                    <MotorcycleCard motorcycle={motorcycle} selectedRegion={currentRegion} />
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

            {/* COMPANY PROFILE & SERVICE AREA SECTION (SEO FOUNDATION) */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                        <div className="lg:col-span-7 space-y-5">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wide">
                                <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                DEALER RESMI YAMAHA 3S (SALES, SERVICE, SPAREPART)
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                                Dealer Resmi Yamaha Terpercaya – PT. Aspacindo Kedaton Motor
                            </h2>
                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                                <strong>PT. Aspacindo Kedaton Motor</strong> merupakan dealer resmi sepeda motor Yamaha yang telah beroperasi selama lebih dari 15 tahun melayani kebutuhan transportasi masyarakat di Provinsi Riau dan Sumatera Utara. Kami menghadirkan solusi berkendara lengkap melalui penjualan motor Yamaha bergaransi resmi pabrikan, ketersediaan suku cadang asli Yamalube 100% original, serta layanan bengkel servis berkala berstandar teknisi Yamaha Motor Indonesia.
                            </p>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Dengan didukung 20+ jaringan cabang resmi di Pekanbaru, Pelalawan, Siak, Kampar, Indragiri Hulu, Indragiri Hilir, hingga Medan, kami berkomitmen memberikan pelayanan terbaik, kemudahan proses kredit motor DP ringan, dan kepuasan purna jual untuk setiap pelanggan.
                            </p>
                            <div className="pt-2 flex flex-wrap gap-4">
                                <Link
                                    href="/tentang-kami"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm uppercase tracking-wider"
                                >
                                    Profil Perusahaan &amp; Sejarah &rarr;
                                </Link>
                                <Link
                                    href="/lokasi-dealer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition uppercase tracking-wider"
                                >
                                    Cari Cabang Terdekat &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* Operational Area Coverage Box */}
                        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-5">
                            <div className="border-b border-blue-900/60 pb-3">
                                <span className="text-xs font-bold text-red-400 uppercase tracking-widest block">Wilayah Jangkauan Layanan</span>
                                <h3 className="text-xl font-bold text-white mt-1">Cakupan Cabang Riau &amp; Sumatera Utara</h3>
                            </div>
                            <p className="text-xs text-blue-200 leading-relaxed">
                                Jaringan dealer &amp; bengkel resmi Aspacindo Kedaton Motor tersebar strategis di berbagai kabupaten dan kota:
                            </p>
                            <div className="space-y-3">
                                {serviceAreas.map((area, idx) => (
                                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition">
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-sm text-amber-300">{area.city}</span>
                                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-md bg-blue-600/60 text-white">
                                                {area.tag}
                                            </span>
                                        </div>
                                        <p className="text-xs text-slate-300 mt-1">{area.coverage}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-2">
                                <Link
                                    href="/lokasi-dealer"
                                    className="block text-center w-full py-2.5 rounded-xl text-xs font-bold text-slate-900 bg-white hover:bg-slate-100 transition"
                                >
                                    Buka Peta &amp; Kontak Cabang Lengkap &rarr;
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BRANCH NETWORK (CABANG) HIGHLIGHT SECTION */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                        <div className="space-y-2">
                            <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Jaringan Dealer &amp; Bengkel</span>
                            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Cabang Resmi Yamaha Aspacindo</h2>
                            <p className="text-sm text-slate-500 max-w-xl">
                                Kunjungi cabang resmi kami untuk konsultasi pembelian unit baru, pengajuan kredit motor, maupun perawatan berkala sepeda motor Yamaha Anda.
                            </p>
                        </div>
                        <Link
                            href="/lokasi-dealer"
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="text-white font-bold text-xs px-6 py-3 rounded-full uppercase tracking-wider shadow-md hover:brightness-110 transition whitespace-nowrap"
                        >
                            Seluruh Cabang (20+) &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayBranches.map((branch, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="bg-blue-50 text-blue-700 text-[11px] font-black px-3 py-1 rounded-full uppercase">
                                            {branch.region}
                                        </span>
                                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                                            {branch.dealer_type || '3S'} Dealer
                                        </span>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900 leading-snug">{branch.name}</h3>
                                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                                        {branch.full_address}
                                    </p>
                                </div>

                                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <a
                                        href={`https://wa.me/${(branch.whatsapp_number || '081262241100').replace(/[^0-9]/g, '')}?text=Halo%20Yamaha%20Aspacindo,%20saya%20ingin%20info%20motor%20dan%20servis`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5"
                                    >
                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                        </svg>
                                        Hubungi Cabang
                                    </a>
                                    {branch.google_maps_url ? (
                                        <a
                                            href={branch.google_maps_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-blue-600 hover:underline"
                                        >
                                            Petunjuk Arah &rarr;
                                        </a>
                                    ) : (
                                        <Link href="/lokasi-dealer" className="text-xs font-semibold text-blue-600 hover:underline">
                                            Detail Cabang &rarr;
                                        </Link>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SERVICES & WORKSHOP (LAYANAN & SPAREPART) */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-3xl mx-auto space-y-3">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Layanan Purna Jual &amp; Bengkel Resmi</span>
                        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Perawatan Motor Berkala &amp; Sparepart Asli Yamaha</h2>
                        <p className="text-sm text-slate-500">
                            Bengkel resmi Yamaha Aspacindo didukung mekanik terlatih sertifikasi Yamaha Motor Indonesia, peralatan diagnosa injeksi modern (YDT), serta garansi suku cadang original Yamalube.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-2xl bg-white border border-slate-200/70 hover:border-blue-500 hover:shadow-md transition space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Booking Service Online</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Pesan antrean servis motor Anda secara online dari rumah tanpa perlu menunggu berjam-jam di bengkel.
                            </p>
                            <Link href="/layanan#booking" className="inline-block text-xs font-bold text-blue-600 hover:underline pt-2">
                                Booking Servis &rarr;
                            </Link>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200/70 hover:border-amber-500 hover:shadow-md transition space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Service Kunjung Yamaha (SKY)</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Motor mogok atau tidak sempat ke bengkel? Teknisi berpengalaman kami siap datang ke rumah atau kantor Anda.
                            </p>
                            <Link href="/layanan" className="inline-block text-xs font-bold text-amber-600 hover:underline pt-2">
                                Info Layanan SKY &rarr;
                            </Link>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200/70 hover:border-emerald-500 hover:shadow-md transition space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Fast Pit Service</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Layanan cepat khusus penggantian oli mesin Yamalube, oli gardan, kampas rem, busi, dan ban tanpa antre.
                            </p>
                            <Link href="/layanan" className="inline-block text-xs font-bold text-emerald-600 hover:underline pt-2">
                                Pelajari Fast Pit &rarr;
                            </Link>
                        </div>

                        <div className="p-6 rounded-2xl bg-white border border-slate-200/70 hover:border-red-500 hover:shadow-md transition space-y-3">
                            <div className="w-12 h-12 rounded-xl bg-red-100 text-red-700 flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h3 className="text-base font-bold text-slate-900">Suku Cadang Asli &amp; Yamalube</h3>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Jaminan 100% Genuine Parts bergaransi resmi pabrik Yamaha untuk menjaga keawetan dan performa mesin sepeda motor.
                            </p>
                            <Link href="/sparepart" className="inline-block text-xs font-bold text-red-600 hover:underline pt-2">
                                Katalog Sparepart &rarr;
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Keunggulan Aspacindo</span>
                        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Mengapa Memilih Aspacindo Kedaton Motor?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {whyChooseUs.map((item, index) => (
                            <div key={index} className="p-6 rounded-2xl bg-white border border-slate-200/70 space-y-4 hover:shadow-md transition">
                                <div className="w-14 h-14 rounded-2xl bg-slate-50 shadow-sm flex items-center justify-center border border-slate-100">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* LATEST ARTICLES & TIPS (ARTIKEL) */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Edukasi &amp; Info Terkini</span>
                            <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Artikel &amp; Tips Sepeda Motor Yamaha</h2>
                        </div>
                        <Link
                            href="/artikel"
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 transition uppercase tracking-wider"
                        >
                            Lihat Semua Artikel &rarr;
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {displayArticles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                            >
                                <div>
                                    <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
                                        <LazyImage
                                            src={article.thumbnail || '/assets/images/promos/hero_banner_yamaha.webp'}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                                            {article.category || 'Yamaha'}
                                        </span>
                                    </div>
                                    <div className="p-5 space-y-2">
                                        <h3 className="text-base font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition">
                                            <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </div>
                                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 text-xs text-slate-400">
                                    <span>{article.author || 'Admin Aspacindo'}</span>
                                    <Link href={`/artikel/${article.slug}`} className="font-bold text-blue-600 hover:underline">
                                        Baca Selengkapnya &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* QUICK NAVIGATION DIRECTORY / GOOGLE SITELINKS ACCELERATOR SECTION */}
            <section className="py-14 bg-slate-900 text-white border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Navigasi Utama Situs Baru</span>
                        <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                            Pusat Navigasi Aspacindo Kedaton Motor
                        </h2>
                        <p className="text-xs text-slate-400">
                            Akses langsung informasi perusahaan, daftar cabang dealer resmi, katalog sepeda motor baru, dan layanan servis bengkel.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        <Link
                            href="/tentang-kami"
                            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 hover:bg-slate-800/60 transition group flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">Tentang Kami</h3>
                                <p className="text-xs text-slate-400 mt-1">Profil PT. Aspacindo Kedaton Motor, visi misi &amp; sejarah dealer resmi.</p>
                            </div>
                            <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">Kunjungi Halaman &rarr;</span>
                        </Link>

                        <Link
                            href="/lokasi-dealer"
                            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-amber-500 hover:bg-slate-800/60 transition group flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition">Cabang Dealer</h3>
                                <p className="text-xs text-slate-400 mt-1">Daftar 20+ alamat cabang &amp; nomor kontak di Riau &amp; Sumatera Utara.</p>
                            </div>
                            <span className="text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">Kunjungi Halaman &rarr;</span>
                        </Link>

                        <Link
                            href="/produk"
                            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500 hover:bg-slate-800/60 transition group flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition">Katalog Produk</h3>
                                <p className="text-xs text-slate-400 mt-1">Pilihan motor Yamaha MAXi, Classy, Matic, Sport, Moped harga OTR.</p>
                            </div>
                            <span className="text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">Kunjungi Halaman &rarr;</span>
                        </Link>

                        <Link
                            href="/layanan"
                            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-red-500 hover:bg-slate-800/60 transition group flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition">Layanan Bengkel</h3>
                                <p className="text-xs text-slate-400 mt-1">Booking servis berkala, Fast Pit, Service Kunjung (SKY) &amp; sparepart.</p>
                            </div>
                            <span className="text-xs font-semibold text-red-400 group-hover:translate-x-1 transition-transform">Kunjungi Halaman &rarr;</span>
                        </Link>

                        <Link
                            href="/artikel"
                            className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-slate-800/60 transition group flex flex-col justify-between space-y-3"
                        >
                            <div>
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">Artikel &amp; Berita</h3>
                                <p className="text-xs text-slate-400 mt-1">Tips berkendara, panduan perawatan motor, dan promo spesial Yamaha.</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">Kunjungi Halaman &rarr;</span>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
