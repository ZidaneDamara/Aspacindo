import React, { useState, useEffect, useRef } from 'react';
import { Link, Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MotorcycleCard from '@/Components/MotorcycleCard';

export default function Show({
    motorcycle,
    familyName,
    familyVariants = [],
    relatedProducts = [],
    regions = [],
    selectedRegion = 'Pekanbaru',
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

    // State for region
    const [currentRegion, setCurrentRegion] = useState(selectedRegion || 'Pekanbaru');

    // Variants list
    const variants = familyVariants && familyVariants.length > 0 ? familyVariants : [motorcycle];
    const currentFamilyTitle = familyName || (motorcycle.name ? motorcycle.name.split(' ')[0] + ' ' + (motorcycle.name.split(' ')[1] || '') : 'Yamaha');

    // State for active variant
    const [activeVariant, setActiveVariant] = useState(motorcycle);

    // Synchronize activeVariant when prop motorcycle changes
    useEffect(() => {
        if (motorcycle?.id && motorcycle.id !== activeVariant.id) {
            setActiveVariant(motorcycle);
            setActiveColorIndex(0);
        }
    }, [motorcycle]);

    // Active colors for current variant
    const currentColors = (activeVariant.colors && activeVariant.colors.length > 0)
        ? activeVariant.colors
        : [
            {
                id: 'primary',
                color_name: 'Standar',
                hex_code: '#1e3a8a',
                image_path: activeVariant.primary_image?.image_path || '/assets/images/placeholder_bike.webp',
            },
        ];

    // State for active color index
    const [activeColorIndex, setActiveColorIndex] = useState(0);

    // Active color object
    const selectedColor = currentColors[activeColorIndex] || currentColors[0];

    // Responsive viewport detection
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const checkMobile = () => setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Specs tab
    const [activeSpecTab, setActiveSpecTab] = useState('Engine');

    // Ref for variant scroll bar
    const variantTabsRef = useRef(null);

    // Preferred region from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && !selectedRegion) {
            const saved = localStorage.getItem('aspacindo_preferred_region');
            if (saved && allRegions.includes(saved)) {
                setCurrentRegion(saved);
            }
        }
    }, []);

    // Format currency
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    // Calculate current price for region
    const currentPrice = (activeVariant.regional_prices && activeVariant.regional_prices[currentRegion])
        ? activeVariant.regional_prices[currentRegion]
        : activeVariant.price_otr;

    // Handle variant change
    const handleSelectVariant = (variant) => {
        setActiveVariant(variant);
        setActiveColorIndex(0);

        // Update URL smoothly without full reload
        if (typeof window !== 'undefined') {
            const newUrl = `/produk/${variant.slug}?region=${encodeURIComponent(currentRegion)}`;
            window.history.replaceState({ ...window.history.state }, '', newUrl);
        }
    };

    // Scroll variant tabs
    const handleScrollTabs = (direction) => {
        if (variantTabsRef.current) {
            const scrollAmount = direction === 'left' ? -220 : 220;
            variantTabsRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Handle region dropdown change
    const handleRegionChange = (e) => {
        const reg = e.target.value;
        setCurrentRegion(reg);
        if (typeof window !== 'undefined') {
            localStorage.setItem('aspacindo_preferred_region', reg);
            const newUrl = `/produk/${activeVariant.slug}?region=${encodeURIComponent(reg)}`;
            window.history.replaceState({ ...window.history.state }, '', newUrl);
        }
    };

    // Touch swipe support on stage
    const [touchStartX, setTouchStartX] = useState(null);
    const handleTouchStart = (e) => {
        setTouchStartX(e.touches[0].clientX);
    };
    const handleTouchEnd = (e) => {
        if (touchStartX === null) return;
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (diff > 50 && activeColorIndex < currentColors.length - 1) {
            setActiveColorIndex((prev) => prev + 1);
        } else if (diff < -50 && activeColorIndex > 0) {
            setActiveColorIndex((prev) => prev - 1);
        }
        setTouchStartX(null);
    };

    // Keyboard navigation (ArrowLeft / ArrowRight)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            if (e.key === 'ArrowLeft') {
                setActiveColorIndex((prev) => Math.max(0, prev - 1));
            } else if (e.key === 'ArrowRight') {
                setActiveColorIndex((prev) => Math.min(currentColors.length - 1, prev + 1));
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentColors.length]);

    const specs = activeVariant.full_specifications || motorcycle.full_specifications || {};
    const specTabs = Object.keys(specs).length > 0 ? Object.keys(specs) : ['Engine', 'Dimensions'];

    // WhatsApp assistance URL
    const whatsappHelpUrl = `https://wa.me/6281262241100?text=${encodeURIComponent(
        `Halo Yamaha Aspacindo, saya tertarik dengan unit ${activeVariant.name} warna ${selectedColor?.color_name || ''} untuk Area ${currentRegion} (OTR ${formatRupiah(currentPrice)}). Mohon informasi ketersediaan unit dan promo terbarunya. Terima kasih!`
    )}`;

    return (
        <PublicLayout title={`${activeVariant.name} - Spesifikasi & OTR Area ${currentRegion}`}>
            <Head>
                <title>{`${activeVariant.name} - Yamaha Aspacindo`}</title>
            </Head>

            {/* Breadcrumb Header */}
            <div className="bg-slate-900 text-white py-6 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Link href="/" className="hover:text-white transition">Beranda</Link>
                        <span>/</span>
                        <Link href={`/produk?region=${encodeURIComponent(currentRegion)}`} className="hover:text-white transition">Katalog</Link>
                        <span>/</span>
                        <span className="text-white font-semibold">{activeVariant.name}</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">
                                {activeVariant.category} Series
                            </span>
                            <h1 className="font-play font-bold text-xl sm:text-2xl uppercase text-white tracking-wide">
                                {activeVariant.name}
                            </h1>
                        </div>

                        {/* Quick Region Selector */}
                        <div className="flex items-center gap-2 bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl shadow-xs">
                            <svg className="w-4 h-4 text-blue-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-xs text-slate-300 font-medium">Area:</span>
                            <select
                                value={currentRegion}
                                onChange={handleRegionChange}
                                className="bg-transparent text-xs font-bold text-white border-none p-0 pr-5 focus:ring-0 cursor-pointer"
                            >
                                {allRegions.map((reg) => (
                                    <option key={reg} value={reg} className="bg-slate-900 text-white">
                                        {reg}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN YAMAHA SHOWCASE SECTION (Seamless Full-Width Studio, Exactly Like Yamaha Indonesia) */}
            <div className="w-full bg-white border-b border-slate-200">
                {/* TOP HEADER: FAMILY NAME & VARIANT & PRICE */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-3 space-y-1 text-center">
                    <h2 className="text-[#1a2d5a] font-bold text-lg sm:text-xl tracking-wider uppercase">
                        {currentFamilyTitle}
                    </h2>
                    <h3 className="text-slate-900 font-extrabold text-xs sm:text-sm tracking-[0.2em] uppercase">
                        VARIANT &amp; PRICE
                    </h3>
                </div>

                {/* VARIANT SLANTED TABS BAR */}
                <div className="relative max-w-5xl mx-auto flex items-center justify-center gap-2 px-2 sm:px-6 pb-6">
                    {/* Scroll Left Button */}
                    {variants.length > 3 && (
                        <button
                            onClick={() => handleScrollTabs('left')}
                            aria-label="Scroll Variant Kiri"
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center transition hover:scale-105"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Tabs Scroll Container */}
                    <div
                        ref={variantTabsRef}
                        className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth py-2 px-4 max-w-full"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {variants.map((v) => {
                            const isActive = v.id === activeVariant.id;
                            return (
                                <button
                                    key={v.id}
                                    onClick={() => handleSelectVariant(v)}
                                    className={`group relative flex-shrink-0 px-5 sm:px-6 py-2 transition-all duration-200 transform -skew-x-[20deg] ${
                                        isActive
                                            ? 'bg-[#153278] text-white shadow-md z-10 ring-1 ring-[#153278]'
                                            : 'bg-[#eaedf0] text-slate-700 hover:bg-[#dfe3e8]'
                                    }`}
                                >
                                    <span className="block transform skew-x-[20deg] font-extrabold text-[11px] sm:text-xs uppercase tracking-wider whitespace-nowrap">
                                        {v.variant_label || v.name}
                                    </span>
                                    {isActive && (
                                        <span className="absolute -bottom-1 left-0 right-0 h-1 bg-[#0f2459]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Scroll Right Button */}
                    {variants.length > 3 && (
                        <button
                            onClick={() => handleScrollTabs('right')}
                            aria-label="Scroll Variant Kanan"
                            className="flex-shrink-0 w-8 h-8 rounded-full bg-white hover:bg-slate-100 text-slate-700 shadow-sm border border-slate-200 flex items-center justify-center transition hover:scale-105"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* MOTORCYCLE SHOWROOM STAGE (Full-bleed edge-to-edge studio, NO card border) */}
                <div
                    className="relative w-full h-[300px] sm:h-[380px] md:h-[440px] lg:h-[480px] overflow-hidden select-none"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                >
                    {/* Two-tone Studio Stage Background spanning edge-to-edge across entire screen */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col">
                        {/* Upper studio wall */}
                        <div className="h-[52%] bg-gradient-to-b from-white via-white to-[#f5f6f8]" />
                        {/* Crisp horizon line and studio floor */}
                        <div className="h-[48%] bg-[#eaedf0] border-t border-slate-300" />
                    </div>

                    {/* Carousel Items Track */}
                    <div className="relative w-full h-full flex items-center justify-center">
                        {currentColors.map((color, idx) => {
                            const offset = idx - activeColorIndex;
                            let containerStyle = {};
                            let isClickable = false;

                            const sideLeft = isMobile ? '8%' : '23%';
                            const sideRight = isMobile ? '92%' : '77%';
                            const sideScale = isMobile ? 0.65 : 0.82;
                            const sideOpacity = isMobile ? 0.25 : 0.48;

                            if (offset === 0) {
                                // Active bike in center
                                containerStyle = {
                                    transform: 'translate(-50%, -50%) scale(1)',
                                    left: '50%',
                                    top: '52%',
                                    opacity: 1,
                                    zIndex: 20,
                                    pointerEvents: 'auto',
                                    filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.16))',
                                };
                            } else if (offset === -1) {
                                // Previous bike on left side - tightly tucked right beside center bike (Yamaha style)
                                containerStyle = {
                                    transform: `translate(-50%, -50%) scale(${sideScale})`,
                                    left: sideLeft,
                                    top: '52%',
                                    opacity: sideOpacity,
                                    zIndex: 10,
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    filter: 'grayscale(15%)',
                                };
                                isClickable = true;
                            } else if (offset === 1) {
                                // Next bike on right side - tightly tucked right beside center bike (Yamaha style)
                                containerStyle = {
                                    transform: `translate(-50%, -50%) scale(${sideScale})`,
                                    left: sideRight,
                                    top: '52%',
                                    opacity: sideOpacity,
                                    zIndex: 10,
                                    cursor: 'pointer',
                                    pointerEvents: 'auto',
                                    filter: 'grayscale(15%)',
                                };
                                isClickable = true;
                            } else if (offset < -1) {
                                // Offscreen left
                                containerStyle = {
                                    transform: 'translate(-50%, -50%) scale(0.5)',
                                    left: '-20%',
                                    top: '52%',
                                    opacity: 0,
                                    zIndex: 0,
                                    pointerEvents: 'none',
                                };
                            } else if (offset > 1) {
                                // Offscreen right
                                containerStyle = {
                                    transform: 'translate(-50%, -50%) scale(0.5)',
                                    left: '120%',
                                    top: '52%',
                                    opacity: 0,
                                    zIndex: 0,
                                    pointerEvents: 'none',
                                };
                            }

                            const bikeImage = color.image_path || activeVariant.primary_image?.image_path || '/assets/images/placeholder_bike.webp';

                            return (
                                <div
                                    key={color.id || idx}
                                    onClick={() => isClickable && setActiveColorIndex(idx)}
                                    style={containerStyle}
                                    className="absolute w-[92%] max-w-[760px] sm:max-w-[860px] md:max-w-[960px] transition-all duration-500 ease-out flex items-center justify-center"
                                >
                                    <img
                                        src={bikeImage}
                                        alt={`${activeVariant.name} - ${color.color_name}`}
                                        width={800}
                                        height={500}
                                        loading={activeColorIndex === idx ? "eager" : "lazy"}
                                        fetchpriority={activeColorIndex === idx ? "high" : "low"}
                                        decoding="async"
                                        className="w-full h-auto max-h-[250px] sm:max-h-[330px] md:max-h-[390px] lg:max-h-[430px] object-contain transition-transform duration-300"
                                        draggable={false}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Stage Arrow Controls */}
                    {activeColorIndex > 0 && (
                        <button
                            onClick={() => setActiveColorIndex((prev) => prev - 1)}
                            aria-label="Warna Sebelumnya"
                            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-9 sm:w-12 h-9 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all hover:scale-110"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    {activeColorIndex < currentColors.length - 1 && (
                        <button
                            onClick={() => setActiveColorIndex((prev) => prev + 1)}
                            aria-label="Warna Selanjutnya"
                            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-9 sm:w-12 h-9 sm:h-12 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-lg flex items-center justify-center transition-all hover:scale-110"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}


                </div>

                {/* COLOR SELECTOR: "PILIH WARNA" + TOUCHING PARALLELOGRAM SWATCHES */}
                <div className="w-full bg-[#eaedf0] pt-2 pb-6 px-4 text-center">
                    <span className="text-xs sm:text-sm font-bold text-slate-700 tracking-wide block mb-2">
                        Pilih Warna
                    </span>

                    {/* Yamaha sec2-color-select Connected Slanted Swatches */}
                    <div className="flex items-center justify-center -space-x-1 sm:-space-x-1.5 py-1.5 overflow-x-auto no-scrollbar">
                        {currentColors.map((color, idx) => {
                            const isActive = idx === activeColorIndex;
                            return (
                                <button
                                    key={color.id || idx}
                                    type="button"
                                    onClick={() => setActiveColorIndex(idx)}
                                    title={color.color_name}
                                    aria-label={`Pilih warna ${color.color_name}`}
                                    style={{ backgroundColor: color.hex_code || '#333333' }}
                                    className={`relative w-14 sm:w-20 md:w-24 lg:w-28 h-7 sm:h-8 md:h-9 transform -skew-x-[30deg] transition-all duration-200 cursor-pointer focus:outline-none flex-shrink-0 ${
                                        isActive
                                            ? 'border-[4px] sm:border-[5px] border-black z-30 scale-105 shadow-xl'
                                            : 'border-2 sm:border-[3px] border-white z-10 hover:z-20 hover:scale-102 shadow-md'
                                    }`}
                                />
                            );
                        })}
                    </div>

                    {/* Active Color Name */}
                    <p className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wide mt-2">
                        {selectedColor?.color_name}
                    </p>
                </div>

                {/* VARIANT TITLE & OTR PRICING & CTAS */}
                <div className="w-full bg-white py-8 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
                    <div className="max-w-4xl mx-auto text-center space-y-4">
                        <div className="space-y-1">
                            <h2 className="font-play font-black text-2xl sm:text-3xl text-slate-900 uppercase tracking-tight">
                                {activeVariant.name}
                            </h2>
                            <p className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
                                {formatRupiah(currentPrice)}
                            </p>
                        </div>

                        {/* Regional OTR Price Selector */}
                        <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 font-medium">
                            <span>*Harga resmi OTR untuk wilayah</span>
                            <div className="inline-flex items-center gap-1 bg-white hover:bg-slate-50 border border-slate-300 px-2.5 py-1 rounded-lg shadow-2xs">
                                <svg className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <select
                                    value={currentRegion}
                                    onChange={handleRegionChange}
                                    className="bg-transparent text-xs font-bold text-blue-900 border-none p-0 pr-4 focus:ring-0 cursor-pointer"
                                >
                                    {allRegions.map((reg) => (
                                        <option key={reg} value={reg}>Area {reg}</option>
                                    ))}
                                </select>
                            </div>
                            <span>(Oktober 2026)</span>
                        </div>

                        {/* ACTION BUTTONS: SIMULASI CICILAN & DAPATKAN BANTUAN */}
                        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full">
                            {/* Credit Simulation Button */}
                            <Link
                                href={`/simulasi-cicilan?motorcycle=${activeVariant.slug}&region=${encodeURIComponent(currentRegion)}`}
                                className="inline-flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 w-full sm:w-auto"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                <span>Simulasi Cicilan OTR</span>
                            </Link>

                            {/* WhatsApp Assistance Button */}
                            <a
                                href={whatsappHelpUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2.5 bg-[#25d366] hover:bg-[#20ba59] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 w-full sm:w-auto"
                            >
                                <svg className="w-5 h-5 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                </svg>
                                <span>Dapatkan Bantuan</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* LOWER CONTENT: SPECIFICATIONS & RELATED MOTORCYCLES */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">

                {/* SPECIFICATIONS TABBED TABLE */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Spesifikasi Lengkap {activeVariant.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                            Yamaha Genuine Specifications
                        </span>
                    </div>

                    {/* Spec Tab Header */}
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-4 overflow-x-auto no-scrollbar flex-nowrap">
                        {specTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveSpecTab(tab)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition flex-shrink-0 whitespace-nowrap ${
                                    activeSpecTab === tab
                                        ? 'bg-[#153278] text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Spec Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        {specs[activeSpecTab] ? (
                            Object.entries(specs[activeSpecTab]).map(([label, value]) => (
                                <div key={label} className="flex justify-between py-2.5 border-b border-slate-100 text-sm">
                                    <span className="text-slate-500 font-medium">{label}</span>
                                    <span className="text-slate-900 font-bold text-right">{value}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500 py-4">
                                Spesifikasi detail kategori ini tersedia pada brosur resmi kami.
                            </p>
                        )}
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-8">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block">
                                    Rekomendasi Lainnya
                                </span>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                                    Motor Terkait Kategori {activeVariant.category}
                                </h3>
                            </div>
                            <Link
                                href={`/produk?category=${encodeURIComponent(activeVariant.category)}&region=${encodeURIComponent(currentRegion)}`}
                                className="text-xs font-bold text-blue-700 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                            >
                                <span>Lihat Semua Kategori {activeVariant.category}</span>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map((bike) => (
                                <MotorcycleCard key={bike.id} motorcycle={bike} selectedRegion={currentRegion} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
