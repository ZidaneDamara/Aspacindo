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
        <div className="bg-slate-50/70 rounded-[28px] border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-col justify-between p-6 pb-14 min-h-[360px]">
            {/* Category & Featured Badge */}
            <div className="flex justify-between items-center z-10">
                <span className="bg-slate-900 text-white text-[10px] font-extrabold uppercase px-3 py-1 rounded-full shadow-sm">
                    {motorcycle.category}
                </span>
                {motorcycle.is_featured && (
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-sm">
                        Unggulan
                    </span>
                )}
            </div>

            {/* Bike Photo Cutout */}
            <Link href={`/produk/${motorcycle.slug}`} className="my-3 block">
                <LazyImage
                    src={primaryImage}
                    alt={motorcycle.name}
                    aspectRatio="aspect-[4/3]"
                    className="w-full h-44 sm:h-48 object-contain group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Title & OTR Price */}
            <div className="space-y-1">
                <Link href={`/produk/${motorcycle.slug}`}>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition">
                        {motorcycle.name}
                    </h3>
                </Link>
                <div>
                    <span className="text-[11px] text-slate-400 font-medium tracking-tight block">
                        OTR Riau, Mulai Dari
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900">
                        {formatRupiah(motorcycle.price_otr)}
                    </span>
                </div>
            </div>

            {/* Bottom Right "Details" Pill Button */}
            <Link
                href={`/produk/${motorcycle.slug}`}
                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                className="absolute bottom-0 right-0 text-white font-bold text-xs uppercase px-6 py-2.5 rounded-tl-2xl rounded-br-[26px] shadow-md hover:brightness-110 transition duration-200 tracking-wider"
            >
                Details
            </Link>
        </div>
    );
}
