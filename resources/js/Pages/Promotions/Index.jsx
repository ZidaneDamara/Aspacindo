import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import LazyImage from '@/Components/LazyImage';

export default function Index({ promotions }) {
    return (
        <PublicLayout title="Promo Spesial Yamaha Aspacindo">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Penawaran Spesial</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Promo Sepeda Motor Yamaha Terbaru</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Dapatkan potongan DP murah, angsuran ringan, potongan tenor 2x, dan hadiah langsung helm exclusive di cabang Aspacindo Kedaton Motor.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {promotions.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {promotions.data.map((promo) => (
                            <div key={promo.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <LazyImage
                                        src={promo.banner_image || '/assets/images/placeholder_promo.webp'}
                                        alt={promo.title}
                                        aspectRatio="aspect-[16/9]"
                                    />
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-black text-slate-900 line-clamp-2">{promo.title}</h3>
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{promo.description}</p>
                                    </div>
                                </div>
                                <div className="p-6 pt-0 flex justify-between items-center">
                                    <span className="text-[11px] text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-full">
                                        Berlaku s/d {promo.end_date || 'Akhir Bulan'}
                                    </span>
                                    <Link
                                        href={`/promo/${promo.slug}`}
                                        style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                        className="text-white font-bold text-xs px-4 py-2.5 rounded-xl uppercase tracking-wider transition hover:brightness-110 shadow-sm"
                                    >
                                        Klaim Promo &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500">
                        Belum ada banner promo aktif saat ini.
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
