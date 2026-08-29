import React, { useState, useEffect } from 'react';
import { router, Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Index({ promos = [], spareparts = { data: [], links: [] }, categories = [], filters = {} }) {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [selectedCategories, setSelectedCategories] = useState(filters.categories || []);
    const [sortOption, setSortOption] = useState(filters.sort || 'latest');
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Auto-advance hero carousel every 5 seconds
    useEffect(() => {
        if (promos.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % promos.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [promos.length]);

    const handleCategoryToggle = (cat) => {
        let updated;
        if (selectedCategories.includes(cat)) {
            updated = selectedCategories.filter((c) => c !== cat);
        } else {
            updated = [...selectedCategories, cat];
        }
        setSelectedCategories(updated);
        applyFilters(updated, sortOption);
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortOption(newSort);
        applyFilters(selectedCategories, newSort);
    };

    const applyFilters = (cats, sort) => {
        router.get(
            '/sparepart',
            {
                categories: cats.length > 0 ? cats.join(',') : undefined,
                sort: sort !== 'latest' ? sort : undefined,
            },
            { preserveState: true, replace: true }
        );
    };

    const formatPrice = (val) => {
        if (!val || val === 0) return 'Rp -';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <PublicLayout title="Suku Cadang & Sparepart Original Yamaha - Aspacindo">
            <div className="bg-slate-50 min-h-screen pb-16 font-sans text-slate-800">
                {/* 1. HERO CAROUSEL BANNER SECTION */}
                <div className="bg-white border-b border-slate-200 shadow-sm relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
                        {promos.length > 0 ? (
                            <div className="relative rounded-3xl overflow-hidden shadow-xl bg-gradient-to-r from-[#071C52] via-[#0A2872] to-[#0A54AA] text-white min-h-[320px] sm:min-h-[380px] flex items-center">
                                {/* Slide Content */}
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-8 sm:p-12 w-full z-10">
                                    <div className="lg:col-span-7 space-y-4">
                                        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-red-600 text-white rounded-full text-xs font-black tracking-widest uppercase shadow-md">
                                            <span>★</span> {promos[currentSlide]?.badge_text || 'YAMAHA GENUINE PARTS'}
                                        </div>
                                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black italic tracking-tight uppercase leading-tight text-white drop-shadow-md">
                                            {promos[currentSlide]?.title || 'ASLI LEBIH BAIK Suku Cadang YAMAHA'}
                                        </h1>
                                        <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                                            {promos[currentSlide]?.subtitle || 'Kualitas Terjamin • Aman & Nyaman Berkendara • Awet & Tahan Lama • Nilai Jual Motor Terjaga'}
                                        </p>
                                        <div className="pt-2">
                                            <a
                                                href="#catalog"
                                                className="inline-block bg-white text-[#0A2872] hover:bg-slate-100 font-extrabold px-7 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                                            >
                                                {promos[currentSlide]?.button_text || 'Lihat Katalog Sparepart'} &rarr;
                                            </a>
                                        </div>
                                    </div>

                                    {/* Image graphic side */}
                                    <div className="lg:col-span-5 flex justify-center items-center">
                                        <div className="relative w-full max-w-sm rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-black/20 backdrop-blur-sm p-3">
                                            <img
                                                src={promos[currentSlide]?.image_url || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'}
                                                alt={promos[currentSlide]?.title}
                                                className="w-full h-48 sm:h-56 object-cover rounded-xl transform hover:scale-105 transition duration-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Slide Navigation Dots */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-2 z-20">
                                    {promos.map((_, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setCurrentSlide(idx)}
                                            className={`h-2.5 rounded-full transition-all duration-300 ${
                                                currentSlide === idx ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>

                {/* 2. MAIN CATALOG SECTION */}
                <div id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* LEFT SIDEBAR: FILTER */}
                        <div className="lg:col-span-3">
                            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 sticky top-28">
                                <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-3">
                                    Filter
                                </h3>

                                <div className="space-y-3">
                                    <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                                        Kategori
                                    </h4>
                                    <div className="space-y-2.5">
                                        {categories.map((cat) => {
                                            const isChecked = selectedCategories.includes(cat);
                                            return (
                                                <label
                                                    key={cat}
                                                    className="flex items-center gap-3 text-xs sm:text-sm text-slate-700 hover:text-slate-900 cursor-pointer font-medium select-none"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => handleCategoryToggle(cat)}
                                                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 transition"
                                                    />
                                                    <span>{cat}</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: CATALOG GRID */}
                        <div className="lg:col-span-9 space-y-6">
                            {/* TOP CONTROLS: SORT DROPDOWN */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-end gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex items-center gap-3">
                                    <span className="text-xs font-bold text-slate-700 uppercase whitespace-nowrap">Urutkan</span>
                                    <select
                                        value={sortOption}
                                        onChange={handleSortChange}
                                        className="text-xs sm:text-sm border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-blue-500 focus:border-blue-500 font-medium min-w-[200px]"
                                    >
                                        <option value="latest">Urut berdasarkan... (Terbaru)</option>
                                        <option value="price_asc">Harga Terendah &rarr; Tertinggi</option>
                                        <option value="price_desc">Harga Tertinggi &rarr; Terendah</option>
                                        <option value="name_asc">Nama Produk (A - Z)</option>
                                    </select>
                                </div>
                            </div>

                            {/* PRODUCT GRID (4 COLUMNS) */}
                            {spareparts.data.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                    {spareparts.data.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group relative"
                                        >
                                            {/* NEW BADGE */}
                                            {item.is_new && (
                                                <div className="absolute top-2 left-2 z-10 bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded shadow-md transform -skew-x-6">
                                                    NEW
                                                </div>
                                            )}

                                            {/* PRODUCT IMAGE */}
                                            <div className="p-4 bg-slate-50 flex items-center justify-center min-h-[160px] overflow-hidden">
                                                <img
                                                    src={item.image_url || 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=300&q=80'}
                                                    alt={item.name}
                                                    className="max-h-36 object-contain group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>

                                            {/* PRODUCT DETAILS */}
                                            <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                                                        {item.name}
                                                    </h4>
                                                    <p className="text-[11px] text-slate-500">
                                                        Rekomendasi Harga (Eceran)
                                                    </p>
                                                </div>

                                                <div className="pt-2 flex items-center justify-between border-t border-slate-100 mt-2">
                                                    <span className="text-xs sm:text-sm font-black text-slate-900">
                                                        {formatPrice(item.price)}
                                                    </span>
                                                    <button
                                                        onClick={() => setSelectedProduct(item)}
                                                        style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                                        className="hover:brightness-110 text-white font-extrabold text-[11px] uppercase px-4 py-1.5 rounded-lg transition-all shadow-sm"
                                                    >
                                                        Detail
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
                                    <div className="text-4xl">🔧</div>
                                    <h3 className="text-base font-bold text-slate-800">Tidak ada sparepart yang sesuai filter</h3>
                                    <p className="text-xs text-slate-500">Coba atur ulang pilihan filter kategori di sebelah kiri.</p>
                                </div>
                            )}

                            {/* PAGINATION */}
                            {spareparts.links && spareparts.links.length > 3 && (
                                <div className="flex justify-center items-center gap-1.5 pt-6">
                                    {spareparts.links.map((link, idx) => (
                                        <Link
                                            key={idx}
                                            href={link.url || '#'}
                                            preserveState
                                            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : link.url
                                                    ? 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* PRODUCT DETAIL MODAL */}
            {selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <button
                            onClick={() => setSelectedProduct(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 font-bold text-lg"
                        >
                            ✕
                        </button>
                        <div className="text-center space-y-2">
                            <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                                {selectedProduct.category}
                            </span>
                            <h3 className="text-lg font-black text-slate-900">{selectedProduct.name}</h3>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl flex justify-center">
                            <img
                                src={selectedProduct.image_url || 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80'}
                                alt={selectedProduct.name}
                                className="max-h-48 object-contain"
                            />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {selectedProduct.description || 'Suku cadang asli Yamaha Genuine Parts menjamin keandalan dan kualitas terbaik untuk motor Anda.'}
                            </p>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                                <div>
                                    <p className="text-[10px] text-slate-400 uppercase font-bold">Harga Eceran Tertinggi</p>
                                    <p className="text-lg font-black text-blue-700">{formatPrice(selectedProduct.price)}</p>
                                </div>
                                <a
                                    href={`https://wa.me/6281270001111?text=${encodeURIComponent(`Halo Bengkel Yamaha Aspacindo, saya berminat membeli Sparepart: ${selectedProduct.name}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition shadow-sm flex items-center gap-1.5"
                                >
                                    <span>💬</span> Pesan via WA
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
