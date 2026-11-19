import React, { useState } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import LazyImage from '@/Components/LazyImage';

export default function Gallery({ galleries = [], categories = ['Semua', 'Acara & Event', 'Komunitas', 'Edukasi & Servis', 'Serah Terima Unit', 'Sosial & CSR'] }) {
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    const filtered = selectedCategory === 'Semua'
        ? galleries
        : galleries.filter((item) => item.category === selectedCategory);

    return (
        <PublicLayout title="Galeri & Kegiatan PT Aspacindo Kedaton Motor">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Dokumentasi Acara</span>
                    <h1 className="font-play font-bold text-2xl sm:text-3xl uppercase tracking-tight text-white mt-1">Galeri &amp; Aktifitas Dealership</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-2xl leading-relaxed">
                        Momen kebersamaan, event touring komunitas Yamaha MAXi, serah terima unit kendaraan, dan kegiatan sosial dealer resmi Yamaha PT Aspacindo Kedaton Motor.
                    </p>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-800">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                                    selectedCategory === cat
                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filtered.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                        <p className="text-slate-500 font-medium">Belum ada dokumentasi untuk kategori ini.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filtered.map((item) => (
                            <div key={item.id} className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                                <div>
                                    <div className="overflow-hidden">
                                        <LazyImage
                                            src={item.image}
                                            alt={item.title}
                                            width={400}
                                            height={250}
                                            aspectRatio="aspect-[16/10]"
                                            className="group-hover:scale-105 transition duration-500 w-full object-cover"
                                        />
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-extrabold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">
                                                {item.category}
                                            </span>
                                            {item.date && (
                                                <span className="text-[11px] text-slate-400 font-medium">{item.date}</span>
                                            )}
                                        </div>
                                        <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition">
                                            {item.title}
                                        </h3>
                                        {item.description && (
                                            <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
