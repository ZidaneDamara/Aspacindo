import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MotorcycleCard from '@/Components/MotorcycleCard';
import LazyImage from '@/Components/LazyImage';

export default function Show({
    motorcycle,
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

    const [currentRegion, setCurrentRegion] = useState(selectedRegion || 'Pekanbaru');
    const [selectedImage, setSelectedImage] = useState(
        motorcycle.primary_image?.image_path || motorcycle.images?.[0]?.image_path || '/assets/images/placeholder_bike.webp'
    );
    const [selectedColor, setSelectedColor] = useState(motorcycle.colors?.[0] || null);
    const [activeSpecTab, setActiveSpecTab] = useState('Engine');

    useEffect(() => {
        if (typeof window !== 'undefined' && !selectedRegion) {
            const saved = localStorage.getItem('aspacindo_preferred_region');
            if (saved && allRegions.includes(saved)) {
                setCurrentRegion(saved);
            }
        }
    }, []);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const handleColorClick = (color) => {
        setSelectedColor(color);
        if (color.image_path) {
            setSelectedImage(color.image_path);
        }
    };

    const handleRegionChange = (e) => {
        const reg = e.target.value;
        setCurrentRegion(reg);
        if (typeof window !== 'undefined') {
            localStorage.setItem('aspacindo_preferred_region', reg);
        }
    };

    const currentPrice = (motorcycle.regional_prices && motorcycle.regional_prices[currentRegion])
        ? motorcycle.regional_prices[currentRegion]
        : motorcycle.price_otr;

    const specs = motorcycle.full_specifications || {};
    const specTabs = Object.keys(specs).length > 0 ? Object.keys(specs) : ['Engine', 'Dimensions'];

    return (
        <PublicLayout title={`${motorcycle.name} - Spesifikasi & OTR Area ${currentRegion}`}>
            {/* Breadcrumb Header */}
            <div className="bg-slate-900 text-white py-8 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                        <Link href="/" className="hover:text-white">Beranda</Link>
                        <span>/</span>
                        <Link href={`/produk?region=${encodeURIComponent(currentRegion)}`} className="hover:text-white">Katalog</Link>
                        <span>/</span>
                        <span className="text-white font-semibold">{motorcycle.name}</span>
                    </div>
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">{motorcycle.category} Series</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase">{motorcycle.name}</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                {/* Product Hero Details */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left: Gallery & Swatches */}
                    <div className="lg:col-span-7 space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                            <LazyImage
                                src={selectedImage}
                                alt={motorcycle.name}
                                aspectRatio="aspect-[4/3]"
                                className="w-full object-contain"
                            />
                        </div>

                        {/* Color Variant Selectors */}
                        {motorcycle.colors?.length > 0 && (
                            <div className="bg-white p-6 rounded-2xl border border-slate-100 space-y-3">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Pilihan Warna Variant: <strong className="text-slate-900">{selectedColor?.color_name}</strong>
                                </h4>
                                <div className="flex flex-wrap gap-3">
                                    {motorcycle.colors.map((color) => (
                                       <button
                                            key={color.id}
                                            onClick={() => handleColorClick(color)}
                                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition ${
                                                selectedColor?.id === color.id
                                                    ? 'border-blue-600 bg-blue-50/50 shadow-sm ring-2 ring-blue-600/20'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <span
                                                className="w-4 h-4 rounded-full border border-slate-300 shadow-inner"
                                                style={{ backgroundColor: color.hex_code }}
                                            />
                                            <span className="text-xs font-bold text-slate-800">{color.color_name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Price & Specs Overview */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                            <div>
                                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                                        Harga On The Road (OTR)
                                    </span>
                                    {/* Region Selector */}
                                    <div className="flex items-center gap-1.5 bg-blue-50/90 border border-blue-200/90 px-3 py-1.5 rounded-xl shadow-xs">
                                        <svg className="w-3.5 h-3.5 text-blue-700 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <select
                                            value={currentRegion}
                                            onChange={handleRegionChange}
                                            className="bg-transparent text-xs font-bold text-blue-900 border-none p-0 pr-5 focus:ring-0 cursor-pointer"
                                        >
                                            {allRegions.map((reg) => (
                                                <option key={reg} value={reg}>Area {reg}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <p className="text-3xl font-black text-blue-700 mt-1">
                                    {formatRupiah(currentPrice)}
                                </p>
                                <span className="text-[11px] text-slate-500 font-medium block mt-1">
                                    *Harga resmi berlaku untuk wilayah <strong>Area {currentRegion}</strong> (Oktober 2026)
                                </span>
                            </div>

                            <p className="text-sm text-slate-600 leading-relaxed border-t border-b border-slate-100 py-4">
                                {motorcycle.short_description || 'Nikmati kemudahan pembelian sepeda motor Yamaha resmi dengan cicilan terjangkau, garansi mesin 5 tahun, dan bonus helm gratis.'}
                            </p>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href={`/simulasi-cicilan?motorcycle=${motorcycle.slug}&region=${encodeURIComponent(currentRegion)}`}
                                    className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-blue-600/30 transition text-sm uppercase tracking-wider"
                                >
                                    Hitung Simulasi Cicilan OTR {currentRegion}
                                </Link>

                                <a
                                    href={`https://wa.me/6281270001111?text=${encodeURIComponent(`Halo Yamaha Aspacindo, saya berminat dengan unit ${motorcycle.name} (${selectedColor?.color_name || ''}) untuk area ${currentRegion} dengan harga OTR ${formatRupiah(currentPrice)}. Mohon info penawaran promo terbarunya.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl shadow-md transition text-sm uppercase tracking-wider"
                                >
                                    Pesan via WhatsApp Customer Service
                                </a>
                            </div>

                            {/* Quick Highlights */}
                            <div className="grid grid-cols-2 gap-4 pt-4 text-xs text-slate-600">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Garansi Mesin 5 Tahun
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Gratis Servis Berkala
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    Unit Ready Stock
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                    100% Suku Cadang Original
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SPECIFICATIONS TABBED TABLE */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Spesifikasi Lengkap {motorcycle.name}</h3>

                    {/* Spec Tab Header */}
                    <div className="flex flex-wrap gap-2 border-b border-slate-100 pb-4">
                        {specTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveSpecTab(tab)}
                                className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                                    activeSpecTab === tab
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Spec Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {specs[activeSpecTab] ? (
                            Object.entries(specs[activeSpecTab]).map(([label, value]) => (
                                <div key={label} className="flex justify-between py-3 border-b border-slate-100 text-sm">
                                    <span className="text-slate-500 font-medium">{label}</span>
                                    <span className="text-slate-900 font-bold text-right">{value}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-500">Spesifikasi detail kategori ini tersedia pada brosur resmi kami.</p>
                        )}
                    </div>
                </div>

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="space-y-8">
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Motor Terkait Kategori {motorcycle.category}</h3>
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
