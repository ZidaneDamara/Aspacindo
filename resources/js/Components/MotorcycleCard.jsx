import React from 'react';
import { Link } from '@inertiajs/react';
import LazyImage from './LazyImage';

export default function MotorcycleCard({ motorcycle }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const primaryImage = motorcycle.primary_image?.image_path || motorcycle.images?.[0]?.image_path || '/assets/images/placeholder_bike.webp';

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group">
            <div>
                {/* Image Container */}
                <div className="relative bg-slate-50 p-6 overflow-hidden">
                    <span className="absolute top-4 left-4 z-10 bg-blue-900 text-blue-100 text-[11px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                        {motorcycle.category}
                    </span>
                    {motorcycle.is_featured && (
                        <span className="absolute top-4 right-4 z-10 bg-amber-500 text-slate-950 text-[11px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                            Unggulan
                        </span>
                    )}
                    <Link href={`/produk/${motorcycle.slug}`}>
                        <LazyImage
                            src={primaryImage}
                            alt={motorcycle.name}
                            aspectRatio="aspect-[4/3]"
                            className="w-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                    </Link>
                </div>

                {/* Content Container */}
                <div className="p-5 space-y-3">
                    <Link href={`/produk/${motorcycle.slug}`} className="block">
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition">
                            {motorcycle.name}
                        </h3>
                    </Link>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {motorcycle.short_description || 'Motor matic Yamaha berperforma tinggi dengan efisiensi bahan bakar maksimal.'}
                    </p>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-5 pb-5 pt-2 border-t border-slate-50 flex items-center justify-between gap-3">
                <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Harga OTR Riau</span>
                    <span className="text-base font-extrabold text-blue-700">
                        {formatRupiah(motorcycle.price_otr)}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link
                        href={`/simulasi-cicilan?motorcycle=${motorcycle.slug}`}
                        title="Simulasi Cicilan"
                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </Link>
                    <Link
                        href={`/produk/${motorcycle.slug}`}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-sm"
                    >
                        Detail
                    </Link>
                </div>
            </div>
        </div>
    );
}
