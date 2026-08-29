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

    const applyFilters = (newCategory, newSort, newMin, newMax) => {
        router.get('/produk', {
            category: newCategory !== 'Semua' ? newCategory : undefined,
            sort: newSort,
            min_price: newMin || undefined,
            max_price: newMax || undefined,
        }, { preserveState: true, replace: true });
    };

    const handleCategoryChange = (cat) => {
        setSelectedCategory(cat);
        applyFilters(cat, sort, minPrice, maxPrice);
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

    return (
        <PublicLayout title="Katalog Sepeda Motor Yamaha Terbaru">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Katalog Resmi</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Katalog Motor Yamaha OTR Riau</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Temukan jajaran sepeda motor Yamaha impian Anda dari kategori MAXi, Classy, Matic, Sport, Off-Road, hingga Moped dengan harga OTR terbaik.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Filter Sidebar */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
                            <h3 className="font-bold text-slate-900 text-base uppercase tracking-wider pb-3 border-b border-slate-100">
                                Filter Produk
                            </h3>

                            {/* Category Filter */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Kategori</label>
                                <div className="space-y-1">
                                    {categories.map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => handleCategoryChange(cat)}
                                            className={`w-full text-left px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                                                selectedCategory === cat
                                                    ? 'bg-blue-600 text-white shadow-md'
                                                    : 'text-slate-700 hover:bg-slate-50'
                                            }`}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <form onSubmit={handlePriceSubmit} className="space-y-3 pt-4 border-t border-slate-100">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Kisaran Harga (Rp)</label>
                                <input
                                    type="number"
                                    placeholder="Harga Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                />
                                <input
                                    type="number"
                                    placeholder="Harga Maks"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2.5 rounded-xl uppercase tracking-wider transition"
                                >
                                    Terapkan Filter
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Main Catalog Listing */}
                    <div className="lg:col-span-9 space-y-6">
                        {/* Top Bar Controls */}
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                            <span className="text-sm font-medium text-slate-600">
                                Menampilkan <strong className="text-slate-900">{motorcycles.total}</strong> unit motor Yamaha
                            </span>
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Urutkan:</label>
                                <select
                                    value={sort}
                                    onChange={handleSortChange}
                                    className="text-sm border-slate-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
                                >
                                    <option value="newest">Paling Baru</option>
                                    <option value="price_asc">Harga Terendah</option>
                                    <option value="price_desc">Harga Tertinggi</option>
                                </select>
                            </div>
                        </div>

                        {/* Product Grid */}
                        {motorcycles.data.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {motorcycles.data.map((motorcycle) => (
                                    <MotorcycleCard key={motorcycle.id} motorcycle={motorcycle} />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-4">
                                <p className="text-slate-500 text-base">Tidak ada unit sepeda motor yang sesuai dengan filter Anda.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('Semua');
                                        setMinPrice('');
                                        setMaxPrice('');
                                        setSort('newest');
                                        applyFilters('Semua', 'newest', '', '');
                                    }}
                                    className="bg-blue-600 text-white font-bold text-xs px-6 py-3 rounded-xl uppercase tracking-wider"
                                >
                                    Reset Filter
                                </button>
                            </div>
                        )}

                        {/* Pagination */}
                        <Pagination links={motorcycles.links} />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
