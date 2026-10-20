import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MotorcycleCard from '@/Components/MotorcycleCard';
import Pagination from '@/Components/Pagination';

export default function Index({
    motorcycles,
    categories = [],
    regions = [],
    selectedRegion = 'Pekanbaru',
    filters = {},
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

    const [currentRegion, setCurrentRegion] = useState(filters.region || selectedRegion || 'Pekanbaru');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'Semua');
    const [sort, setSort] = useState(filters.sort || 'newest');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');

    // Official Category Icons Mapping provided by user
    const categoryIcons = [
        { name: 'Semua', icon: null, label: 'Semua' },
        { name: 'MAXi', icon: '/images/categories/maxi.png', label: 'MAXI' },
        { name: 'Classy', icon: '/images/categories/classy.png', label: 'Classy' },
        { name: 'Matic', icon: '/images/categories/matic.png', label: 'Matic' },
        { name: 'Sport', icon: '/images/categories/sport.png', label: 'Sport' },
        { name: 'Off-Road', icon: '/images/categories/off-road.png', label: 'Off-Road' },
        { name: 'Moped', icon: '/images/categories/moped.png', label: 'Moped' },
    ];

    const applyFilters = (newCategory, newSort, newMin, newMax, newRegion) => {
        const reg = newRegion || currentRegion;
        router.get(
            '/produk',
            {
                region: reg !== 'Pekanbaru' ? reg : undefined,
                category: newCategory !== 'Semua' ? newCategory : undefined,
                sort: newSort !== 'newest' ? newSort : undefined,
                min_price: newMin || undefined,
                max_price: newMax || undefined,
            },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const handleCategoryChange = (catName) => {
        setSelectedCategory(catName);
        applyFilters(catName, sort, minPrice, maxPrice, currentRegion);
    };

    const handleRegionChange = (reg) => {
        setCurrentRegion(reg);
        if (typeof window !== 'undefined') {
            localStorage.setItem('aspacindo_preferred_region', reg);
        }
        applyFilters(selectedCategory, sort, minPrice, maxPrice, reg);
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSort(val);
        applyFilters(selectedCategory, val, minPrice, maxPrice, currentRegion);
    };

    const handlePriceSubmit = (e) => {
        e.preventDefault();
        applyFilters(selectedCategory, sort, minPrice, maxPrice, currentRegion);
    };

    // Category Bar Component embedded directly into the sticky Header
    const categoryBarNav = (
        <div className="bg-[#0B1D4F] text-white border-t border-b border-blue-950 shadow-md h-16 sm:h-20 w-full overflow-x-auto overflow-y-hidden touch-pan-x no-scrollbar">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-start md:justify-center w-max min-w-full">
                {categoryIcons.map((item) => {
                    const isActive = selectedCategory === item.name || (selectedCategory === '' && item.name === 'Semua');
                    return (
                        <button
                            key={item.name}
                            onClick={() => handleCategoryChange(item.name)}
                            className={`h-full flex flex-col items-center justify-center px-6 sm:px-10 lg:px-12 flex-shrink-0 transition-all duration-200 select-none ${
                                isActive
                                    ? 'bg-yamaha-blue text-white font-normal shadow-sm'
                                    : 'text-slate-200 hover:text-white hover-bg-yamaha-blue'
                            }`}
                        >
                            {item.icon && (
                                <img
                                    src={item.icon}
                                    alt={item.label}
                                    className="w-7 h-7 sm:w-9 sm:h-9 object-contain mb-1 filter brightness-0 invert pointer-events-none"
                                />
                            )}
                            <span className="text-xs sm:text-sm font-normal tracking-wider uppercase whitespace-nowrap pointer-events-none">
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );

    return (
        <PublicLayout title={`Produk Motor Yamaha - OTR Area ${currentRegion}`} categoryBar={categoryBarNav}>
            {/* MAIN CATALOG SECTION */}
            <div className="bg-white py-10 sm:py-14 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {/* Centered Main Title */}
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight uppercase">
                            Produk Motor Yamaha
                        </h2>
                        {selectedCategory !== 'Semua' && (
                            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 text-xs font-normal px-4 py-1.5 rounded-full border border-blue-100">
                                Kategori: {selectedCategory}
                            </div>
                        )}
                    </div>

                    {/* REGION FILTER BAR */}
                    <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2.5 text-slate-800">
                                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block">
                                        Pilih Wilayah OTR Cabang:
                                    </span>
                                    <span className="text-sm sm:text-base font-black text-slate-900">
                                        Area {currentRegion}
                                    </span>
                                </div>
                            </div>

                            {/* Quick Sort Control */}
                            <div className="flex items-center gap-2 self-end sm:self-auto">
                                <span className="text-xs font-semibold text-slate-500 hidden sm:inline">Urutkan:</span>
                                <select
                                    value={sort}
                                    onChange={handleSortChange}
                                    className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                                >
                                    <option value="newest">Terbaru</option>
                                    <option value="price_asc">Harga OTR: Terendah</option>
                                    <option value="price_desc">Harga OTR: Tertinggi</option>
                                </select>
                            </div>
                        </div>

                        {/* Region Buttons */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {allRegions.map((reg) => {
                                const isActive = currentRegion === reg;
                                return (
                                    <button
                                        key={reg}
                                        type="button"
                                        onClick={() => handleRegionChange(reg)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap shadow-sm flex items-center gap-1.5 ${
                                            isActive
                                                ? 'bg-gradient-to-r from-[#0A2872] to-[#0A73BA] text-white ring-2 ring-blue-400/50 shadow-md scale-[1.02]'
                                                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                                        }`}
                                    >
                                        <span>{reg}</span>
                                        {isActive && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="text-[11px] text-slate-500 flex flex-col sm:flex-row sm:items-center justify-between border-t border-slate-200/60 pt-2.5 gap-1">
                            <span>
                                💡 Menampilkan harga OTR resmi berlaku untuk cabang <strong>Area {currentRegion}</strong> (Periode promo Oktober 2026)
                            </span>
                            <span className="text-slate-400 text-[10px]">
                                *Harga sewaktu-waktu dapat berubah
                            </span>
                        </div>
                    </div>

                    {/* PRODUCT GRID */}
                    {motorcycles.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {motorcycles.data.map((motorcycle) => (
                                <MotorcycleCard
                                    key={motorcycle.id}
                                    motorcycle={motorcycle}
                                    selectedRegion={currentRegion}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 p-12 rounded-3xl border border-slate-100 text-center space-y-4">
                            <p className="text-slate-500 text-base">Tidak ada unit sepeda motor yang sesuai dengan filter Anda.</p>
                            <button
                                onClick={() => {
                                    setSelectedCategory('Semua');
                                    setMinPrice('');
                                    setMaxPrice('');
                                    setSort('newest');
                                    applyFilters('Semua', 'newest', '', '', 'Pekanbaru');
                                }}
                                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                className="text-white font-bold text-xs px-6 py-3 rounded-full uppercase tracking-wider shadow-md hover:brightness-110"
                            >
                                Reset Filter
                            </button>
                        </div>
                    )}

                    {/* Pagination */}
                    <Pagination links={motorcycles.links} />
                </div>
            </div>
        </PublicLayout>
    );
}
