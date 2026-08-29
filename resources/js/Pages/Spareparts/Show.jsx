import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Show({ sparepart = {}, relatedSpareparts = [] }) {
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    const formatPrice = (val) => {
        if (!val || val === 0) return 'RP -';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    // Images gallery array for thumbnails (main image + badge thumbnail matching screenshot)
    const images = [
        sparepart.image_url || 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=600&q=80',
    ];

    return (
        <PublicLayout title={`${sparepart.name} - Sparepart Original Yamaha`}>
            <div className="bg-white min-h-screen py-10 sm:py-16 font-sans text-slate-800">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
                    {/* BREADCRUMB & BACK LINK */}
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        <Link href="/sparepart" className="hover:text-blue-600">
                            &larr; Kembali ke Katalog Sparepart
                        </Link>
                    </div>

                    {/* TOP SECTION: PRODUCT DETAIL MAIN GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                        {/* LEFT COLUMN: PRODUCT IMAGES & THUMBNAILS */}
                        <div className="md:col-span-5 space-y-4">
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex justify-center items-center shadow-sm min-h-[320px]">
                                <img
                                    src={images[activeImageIndex]}
                                    alt={sparepart.name}
                                    className="max-h-72 object-contain transition-all duration-300"
                                />
                            </div>

                            {/* Thumbnails list matching screenshot layout */}
                            <div className="flex items-center gap-3">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setActiveImageIndex(idx)}
                                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden p-1 bg-white transition ${
                                            activeImageIndex === idx ? 'border-blue-600 shadow-md scale-105' : 'border-slate-200 hover:border-slate-400'
                                        }`}
                                    >
                                        <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                                    </button>
                                ))}
                                <div className="w-16 h-16 rounded-xl border border-slate-200 bg-white p-1 flex items-center justify-center text-[10px] font-black text-red-600 text-center uppercase leading-tight shadow-sm">
                                    ASPACINDO KEDATON
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: PRODUCT INFORMATION */}
                        <div className="md:col-span-7 space-y-6">
                            <div className="space-y-1">
                                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                                    {sparepart.name}
                                </h1>
                                <p className="text-xs sm:text-sm font-semibold text-slate-500">
                                    Kategori: <span className="text-slate-800 font-bold">{sparepart.category || 'Pelumas'}</span>
                                </p>
                            </div>

                            {/* PRICE DISPLAY */}
                            <div className="border-t border-b border-slate-200 py-3">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">
                                    {formatPrice(sparepart.price)}
                                </span>
                            </div>

                            {/* DESCRIPTION & SPECIFICATIONS */}
                            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
                                <div>
                                    <h3 className="text-base font-extrabold text-slate-900 mb-2">Deskripsi</h3>
                                    {sparepart.description ? (
                                        <p className="whitespace-pre-line text-slate-600">{sparepart.description}</p>
                                    ) : (
                                        <div className="space-y-2 text-slate-600">
                                            <p className="font-semibold text-slate-800">
                                                Yamalube {sparepart.name} mempunyai beberapa keunggulan yaitu:
                                            </p>
                                            <ol className="list-decimal list-inside space-y-1 pl-1">
                                                <li>Titik didih lebih tinggi dibandingkan dengan produk lain.</li>
                                                <li>Tidak menyebabkan timbulnya KARAT yang dapat menyumbat aliran cairan rem.</li>
                                                <li>Tidak merusak KARET yang menyebabkan sistem rem akan bocor sehingga berakibat rem blong.</li>
                                                <li>Tidak menimbulkan ENDAPAN sehingga menghindari sistem rem macet.</li>
                                            </ol>
                                        </div>
                                    )}
                                </div>

                                {/* SPECIFICATIONS LIST */}
                                <div className="space-y-1 pt-2">
                                    <h4 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                                        Spesifikasi Yamalube {sparepart.name}:
                                    </h4>
                                    <ol className="list-decimal list-inside text-xs text-slate-600 space-y-0.5">
                                        <li>DOT 4 Volume 350 ml, Titik didih 271C.</li>
                                        <li>DOT 3 Volume 50 ml, Titik didih 255C.</li>
                                    </ol>
                                </div>
                            </div>

                            {/* PESAN SEKARANG (WHATSAPP ORDER BUTTON) */}
                            <div className="pt-4">
                                <a
                                    href={`https://wa.me/6281270001111?text=${encodeURIComponent(`Halo Bengkel Yamaha Aspacindo, saya mau beli Sparepart Original: ${sparepart.name}`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#28a745] hover:bg-[#218838] text-white font-extrabold px-8 py-3.5 rounded-xl shadow-md transition-all duration-200 text-sm uppercase tracking-wider hover:shadow-lg transform hover:-translate-y-0.5"
                                >
                                    <span>💬</span> Pesan Sekarang
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* BOTTOM SECTION: PRODUK LAINNYA (RECOMMENDED / SIMILAR PRODUCTS CAROUSEL) */}
                    <div className="pt-12 border-t border-slate-200 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl sm:text-3xl font-black italic text-slate-950 uppercase tracking-tight">
                                PRODUK <span className="text-[#0A54AA]">LAINNYA</span>
                            </h2>
                        </div>

                        {/* Similar Products Grid */}
                        {relatedSpareparts.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {relatedSpareparts.map((item) => (
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
                                                <Link
                                                    href={`/sparepart/${item.slug}`}
                                                    style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                                    className="hover:brightness-110 text-white font-extrabold text-[11px] uppercase px-4 py-1.5 rounded-lg transition-all shadow-sm"
                                                >
                                                    Detail
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
