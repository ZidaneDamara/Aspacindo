import React, { useState, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MotorcycleCard from '@/Components/MotorcycleCard';
import LazyImage from '@/Components/LazyImage';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

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
    const [featuredSwiper, setFeaturedSwiper] = useState(null);
    const [isBeginning, setIsBeginning] = useState(true);
    const [isEnd, setIsEnd] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);

    const heroBanners = [
        {
            id: 'jupiter-z1',
            image: '/assets/images/promos/jupiter-z1-hero-banner.webp',
            mobileImage: '/assets/images/promos/jupiter-z1-hero-banner-mobile.webp',
            alt: 'Yamaha Jupiter Z1 - Motor Legendaris Indonesia, Yang Lain Semakin Ketinggalan Lagi!',
            title: 'Yamaha Jupiter Z1',
            subtitle: 'Motor Legendaris Indonesia – Yang Lain, Semakin Ketinggalan Lagi!',
            link: '/produk/yamaha-jupiter-z1',
        },
        {
            id: 'wr-155-r',
            image: '/assets/images/promos/wr-155-r-hero-banner.webp',
            mobileImage: '/assets/images/promos/wr-155-r-hero-banner-mobile.webp',
            alt: 'Yamaha WR 155 R - The Real Adventure Partner',
            title: 'Yamaha WR 155 R',
            subtitle: 'The Real Adventure Partner – Tangguh di Segala Medan',
            link: '/produk/yamaha-wr-155-r',
        },
        {
            id: 'mx-king-150',
            image: '/assets/images/promos/mx-king-hero-banner.webp',
            mobileImage: '/assets/images/promos/mx-king-hero-banner-mobile.webp',
            alt: 'Yamaha MX King 150 - King of Street',
            title: 'Yamaha MX King 150',
            subtitle: 'King of Street – Edisi Balap MotoGP Prima Pramac Racing',
            link: '/produk/yamaha-mx-king-150-prima-pramac',
        },
        {
            id: 'all-new-vixion',
            image: '/assets/images/promos/all-new-vixion-hero-banner.webp',
            mobileImage: '/assets/images/promos/all-new-vixion-hero-banner-mobile.webp',
            alt: 'Yamaha All New Vixion - Live The Legend',
            title: 'Yamaha All New Vixion',
            subtitle: 'Live The Legend – Naked Sport 150cc Deltabox dengan Assist & Slipper Clutch',
            link: '/produk/yamaha-all-new-vixion',
        },
        {
            id: 'xsr-155',
            image: '/assets/images/promos/xsr-155-hero-banner.webp',
            mobileImage: '/assets/images/promos/xsr-155-hero-banner-mobile.webp',
            alt: 'Yamaha All New XSR 155 - Born To Be Free',
            title: 'Yamaha All New XSR 155',
            subtitle: 'Born To Be Free – Sport Heritage Bergaya Neo-Retro dengan Mesin 155cc VVA',
            link: '/produk/yamaha-all-new-xsr-155',
        },
        {
            id: 'r15-connected',
            image: '/assets/images/promos/r15-connected-hero-banner.webp',
            mobileImage: '/assets/images/promos/r15-connected-hero-banner-mobile.webp',
            alt: 'Yamaha All New R15 Connected - Connect With R Spirit',
            title: 'Yamaha All New R15 Connected',
            subtitle: 'Connect With R Spirit – Sensasi Balap Sejati dengan Fitur Y-Connect & Traction Control',
            link: '/produk/yamaha-all-new-r15-connected',
        },
        {
            id: 'r25-abs',
            image: '/assets/images/promos/r25-hero-banner.webp',
            mobileImage: '/assets/images/promos/r25-hero-banner-mobile.webp',
            alt: 'Yamaha R25 ABS - Rev Your Limit',
            title: 'Yamaha R25 ABS',
            subtitle: 'Rev Your Limit – Supersport 250cc 2-Silinder DOHC dengan Suspensi Upside Down & ABS',
            link: '/produk/yamaha-r-25-abs',
        },
        {
            id: 'grand-filano-hybrid',
            image: '/assets/images/promos/grand-filano-hero-banner.webp',
            mobileImage: '/assets/images/promos/grand-filano-hero-banner-mobile.webp',
            alt: "Yamaha Grand Filano Hybrid - It's Time To Ride The Kalcer",
            title: 'Yamaha Grand Filano Hybrid',
            subtitle: "It's Time To Ride The Kalcer – Skuter Fashionable Classy Yamaha dengan Mesin Blue Core Hybrid 125cc",
            link: '/produk/yamaha-grand-filano-hybrid-neo',
        },
        ...(activePromotions.length > 0
            ? activePromotions.map((p) => ({
                  id: `promo-${p.id}`,
                  image: p.banner_image || p.image_path || '/assets/images/promos/hero_banner_yamaha.webp',
                  mobileImage: p.banner_image || p.image_path || '/assets/images/promos/hero_banner_yamaha-mobile.webp',
                  alt: p.title || 'Promo Yamaha Aspacindo',
                  title: p.title,
                  subtitle: p.subtitle || p.short_description,
                  link: `/promo/${p.slug}`,
              }))
            : [
                  {
                      id: 'official-yamaha',
                      image: '/assets/images/promos/hero_banner_yamaha.webp',
                      mobileImage: '/assets/images/promos/hero_banner_yamaha-mobile.webp',
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

    const [categorySwiper, setCategorySwiper] = useState(null);

    const categoryList = [
        { name: 'MAXi', image: '/assets/images/categories/category-maxi.webp', count: categories.MAXi || 0 },
        { name: 'Classy', image: '/assets/images/categories/category-classy.webp', count: categories.Classy || 0 },
        { name: 'Matic', image: '/assets/images/categories/category-matic.webp', count: categories.Matic || 0 },
        { name: 'Sport', image: '/assets/images/categories/category-sport.webp', count: categories.Sport || 0 },
        { name: 'Off-Road', image: '/assets/images/categories/category-offroad.webp', count: categories['Off-Road'] ?? categories.OffRoad ?? 0 },
        { name: 'Moped', image: '/assets/images/categories/category-moped.webp', count: categories.Moped || 0 },
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
            name: 'ASPACINDO KEDATON MOTOR MEDAN',
            region: 'Medan',
            dealer_type: '3S',
            full_address: 'Jl. S. Parman No. 102, Medan, Sumatera Utara',
            whatsapp_number: '085290906680',
            google_maps_url: 'https://share.google/foXmdNxIQtmXQztJB',
            social_media: {
                tiktok: 'https://www.tiktok.com/@aspacindokedatonmedan?_r=1&_t=ZS-99Hc3GdbYhO',
                instagram: 'https://www.instagram.com/aspacindokedatonmedan?igsi=MTNuN2gzbjRjb3FxdA==',
                facebook: 'https://www.facebook.com/share/19FTbhKD5L/?mibextid=wwXIfr',
            },
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
                <div className="w-full relative">
                    <div className="w-full relative aspect-[16/9] overflow-hidden bg-slate-950">
                        {heroBanners.map((banner, idx) => (
                            <div
                                key={banner.id}
                                className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                                    heroIndex === idx ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                                }`}
                            >
                                <Link href={banner.link} className="block w-full h-full relative">
                                    {idx === 0 ? (
                                        <picture>
                                            <source media="(max-width: 640px)" srcSet={banner.mobileImage || banner.image} type="image/webp" />
                                            <source srcSet={banner.image} type="image/webp" />
                                            <img
                                                src={banner.image}
                                                alt={banner.alt}
                                                width={1024}
                                                height={575}
                                                loading="eager"
                                                fetchpriority="high"
                                                decoding="async"
                                                className="w-full h-full object-contain sm:object-cover object-center"
                                            />
                                        </picture>
                                    ) : (
                                        <LazyImage
                                            src={banner.image}
                                            alt={banner.alt}
                                            width={1024}
                                            height={575}
                                            className="w-full h-full object-contain sm:object-cover object-center"
                                        />
                                    )}
                                </Link>
                            </div>
                        ))}

                        {/* Dots Navigation */}
                        {heroBanners.length > 1 && (
                            <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
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
                        )}
                    </div>
                </div>
            </section>

            {/* CATEGORY EXPLORER */}
            <section className="py-10 sm:py-16 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
                    {/* Centered Title matching reference */}
                    <div className="text-center space-y-1 mb-2 sm:mb-6">
                        <p className="text-xs sm:text-sm font-extrabold text-[#0A2872] tracking-[0.2em] uppercase">
                            YAMAHA ASPACINDO KEDATON MOTOR
                        </p>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A2872] tracking-tight uppercase">
                            PRODUCT CATEGORY
                        </h2>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative flex items-center justify-center max-w-[1300px] mx-auto">
                        {/* Left Arrow Button (Visible on Desktop/Tablet) */}
                        <button
                            type="button"
                            onClick={() => categorySwiper?.slidePrev()}
                            aria-label="Previous Category"
                            className="hidden md:flex flex-shrink-0 z-20 p-1 hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer focus:outline-none mr-2 sm:mr-3 lg:mr-4"
                        >
                            <img
                                src="/assets/images/categories/chevron-left.png"
                                alt="Previous"
                                width={44}
                                height={44}
                                loading="lazy"
                                decoding="async"
                                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md select-none"
                            />
                        </button>

                        {/* Swiper Viewport */}
                        <div className="flex-1 overflow-hidden py-3 sm:py-6">
                            <Swiper
                                onSwiper={setCategorySwiper}
                                modules={[Autoplay]}
                                slidesPerView={1.25}
                                centeredSlides={true}
                                spaceBetween={-20}
                                breakpoints={{
                                    480: {
                                        slidesPerView: 1.35,
                                        centeredSlides: true,
                                        spaceBetween: -25,
                                    },
                                    640: {
                                        slidesPerView: 2.4,
                                        centeredSlides: false,
                                        spaceBetween: -30,
                                    },
                                    768: {
                                        slidesPerView: 3,
                                        centeredSlides: false,
                                        spaceBetween: -40,
                                    },
                                    1024: {
                                        slidesPerView: 4,
                                        centeredSlides: false,
                                        spaceBetween: -45,
                                    },
                                    1280: {
                                        slidesPerView: 4,
                                        centeredSlides: false,
                                        spaceBetween: -60,
                                    },
                                }}
                                loop={true}
                                autoplay={{ delay: 5000, disableOnInteraction: false }}
                                className="w-full"
                            >
                                {categoryList.map((cat, idx) => (
                                    <SwiperSlide key={idx} className="overflow-visible">
                                        <Link
                                            href={`/produk?category=${encodeURIComponent(cat.name)}${currentRegion ? `&region=${encodeURIComponent(currentRegion)}` : ''}`}
                                            className="group block relative transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.03] focus:outline-none"
                                        >
                                            <div className="relative overflow-visible filter drop-shadow-sm group-hover:drop-shadow-2xl transition-all duration-300">
                                                <img
                                                    src={cat.image}
                                                    alt={`Kategori Yamaha ${cat.name}`}
                                                    width={280}
                                                    height={160}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="w-full h-auto object-contain block select-none pointer-events-none"
                                                />
                                            </div>
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        {/* Right Arrow Button (Visible on Desktop/Tablet) */}
                        <button
                            type="button"
                            onClick={() => categorySwiper?.slideNext()}
                            aria-label="Next Category"
                            className="hidden md:flex flex-shrink-0 z-20 p-1 hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer focus:outline-none ml-2 sm:mr-0 ml-2 sm:ml-3 lg:ml-4"
                        >
                            <img
                                src="/assets/images/categories/chevron-right.png"
                                alt="Next"
                                width={44}
                                height={44}
                                loading="lazy"
                                decoding="async"
                                className="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 drop-shadow-md select-none"
                            />
                        </button>
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
                            <p className="text-4xl sm:text-5xl font-bold text-white tracking-tight">{stats.years_operating || '30+'}</p>
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
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight uppercase">Motor Yamaha Paling Populer Hari Ini</h2>
                        </div>

                        {/* Region Selector & Carousel Navigation Buttons */}
                        <div className="flex items-center justify-between sm:justify-start gap-3 w-full md:w-auto">
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
                                    type="button"
                                    onClick={() => featuredSwiper?.slidePrev()}
                                    disabled={isBeginning}
                                    style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                    className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full text-white flex items-center justify-center shadow-md transition hover:brightness-110 ${
                                        isBeginning ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                                    }`}
                                    aria-label="Previous slide"
                                >
                                    &#10094;
                                </button>
                                <button
                                    type="button"
                                    onClick={() => featuredSwiper?.slideNext()}
                                    disabled={isEnd}
                                    style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                    className={`w-9 sm:w-10 h-9 sm:h-10 rounded-full text-white flex items-center justify-center shadow-md transition hover:brightness-110 ${
                                        isEnd ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer active:scale-95'
                                    }`}
                                    aria-label="Next slide"
                                >
                                    &#10095;
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Carousel Container */}
                    <div className="relative py-2">
                        <Swiper
                            modules={[Pagination]}
                            onSwiper={(swiper) => {
                                setFeaturedSwiper(swiper);
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            onSlideChange={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            onBreakpoint={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            onReachBeginning={() => setIsBeginning(true)}
                            onReachEnd={() => setIsEnd(true)}
                            onFromEdge={(swiper) => {
                                setIsBeginning(swiper.isBeginning);
                                setIsEnd(swiper.isEnd);
                            }}
                            speed={450}
                            slidesPerView={1}
                            spaceBetween={16}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                    spaceBetween: 20,
                                },
                                1024: {
                                    slidesPerView: 3,
                                    spaceBetween: 24,
                                },
                                1280: {
                                    slidesPerView: 4,
                                    spaceBetween: 24,
                                },
                            }}
                            pagination={{
                                el: '.featured-swiper-pagination',
                                clickable: true,
                            }}
                            className="w-full !py-3 !px-1"
                        >
                            {featuredMotorcycles.map((motorcycle) => (
                                <SwiperSlide key={motorcycle.id} className="h-auto pb-1">
                                    <MotorcycleCard motorcycle={motorcycle} selectedRegion={currentRegion} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>

                    {/* Pagination Dots */}
                    <div className="featured-swiper-pagination flex justify-center items-center gap-1.5 pt-2" />

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

            {/* COMPANY PROFILE SECTION (SEO & DEALER OVERVIEW) */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold uppercase tracking-wide">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        DEALER RESMI YAMAHA 3S (SALES, SERVICE, SPAREPART)
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
                        Dealer Resmi Yamaha Terpercaya – PT. Aspacindo Kedaton Motor
                    </h2>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-4xl mx-auto">
                        <strong>PT. Aspacindo Kedaton Motor</strong> merupakan dealer resmi sepeda motor Yamaha yang telah beroperasi selama lebih dari 30 tahun melayani kebutuhan transportasi masyarakat di Provinsi Riau dan Sumatera Utara. Kami menghadirkan solusi berkendara lengkap melalui penjualan motor Yamaha bergaransi resmi pabrikan, ketersediaan suku cadang asli Yamalube 100% original, serta layanan bengkel servis berkala berstandar teknisi Yamaha Motor Indonesia.
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed max-w-3xl mx-auto">
                        Dengan didukung 20+ jaringan cabang resmi di Pekanbaru, Pelalawan, Siak, Kampar, Indragiri Hulu, Indragiri Hilir, hingga Medan, kami berkomitmen memberikan pelayanan terbaik, kemudahan proses kredit motor DP ringan, dan kepuasan purna jual untuk setiap pelanggan.
                    </p>
                    <div className="pt-2 flex flex-wrap justify-center gap-4">
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

                                    {/* Social Media Links if present */}
                                    {branch.social_media && (branch.social_media.instagram || branch.social_media.facebook || branch.social_media.tiktok) && (
                                        <div className="flex items-center gap-2 pt-1 border-t border-slate-100/70">
                                            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Medsos:</span>
                                            <div className="flex items-center gap-2.5">
                                                {branch.social_media.instagram && (
                                                    <a href={branch.social_media.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:scale-110 transition-transform" title="Instagram">
                                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                                {branch.social_media.facebook && (
                                                    <a href={branch.social_media.facebook} target="_blank" rel="noopener noreferrer" className="text-[#1877F2] hover:scale-110 transition-transform" title="Facebook">
                                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                                {branch.social_media.tiktok && (
                                                    <a href={branch.social_media.tiktok} target="_blank" rel="noopener noreferrer" className="text-slate-900 hover:scale-110 transition-transform" title="TikTok">
                                                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.52z"/>
                                                        </svg>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    )}
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
                                            width={400}
                                            height={225}
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
