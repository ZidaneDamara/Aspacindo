import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import MotorcycleCard from '@/Components/MotorcycleCard';
import Pagination from '@/Components/Pagination';

export default function Index({ motorcycles, categories = [], filters = {} }) {
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

    const applyFilters = (newCategory, newSort, newMin, newMax) => {
        router.get('/produk', {
            category: newCategory !== 'Semua' ? newCategory : undefined,
            sort: newSort,
            min_price: newMin || undefined,
            max_price: newMax || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleCategoryChange = (catName) => {
        setSelectedCategory(catName);
        applyFilters(catName, sort, minPrice, maxPrice);
    };

    const handleSortChange = (e) => {
        const val = e.target.value;
        setSort(val);
        applyFilters(selectedCategory, val, minPrice, maxPrice);
    };

    const handlePriceSubmit = (e) => {
        e.preventDefault();
        applyFilters(selectedCategory, sort, minPrice, maxPrice);
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
                                    ? 'bg-[#0A73BA] text-white font-normal shadow-sm'
                                    : 'text-slate-200 hover:text-white hover:bg-[#0a58ca]'
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
        <PublicLayout title="Produk Motor Yamaha - OTR Riau & Sumut" categoryBar={categoryBarNav}>
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

                    {/* PRODUCT GRID */}
                    {motorcycles.data.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                            {motorcycles.data.map((motorcycle) => (
                                <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
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
                                    applyFilters('Semua', 'newest', '', '');
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
