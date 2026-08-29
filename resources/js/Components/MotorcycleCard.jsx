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
        <div className="bg-slate-50/70 rounded-[24px] sm:rounded-[28px] border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-row sm:flex-col items-center sm:items-stretch justify-between p-4 sm:p-6 pb-12 sm:pb-14 min-h-[160px] sm:min-h-[340px]">
            {/* Bike Photo Cutout (Left side on mobile, Top on desktop) */}
            <Link href={`/produk/${motorcycle.slug}`} className="w-5/12 sm:w-full my-1 sm:my-2 flex-shrink-0">
                <LazyImage
                    src={primaryImage}
                    alt={motorcycle.name}
                    aspectRatio="aspect-[4/3]"
                    className="w-full h-28 sm:h-48 object-contain group-hover:scale-105 transition-transform duration-500"
                />
            </Link>

            {/* Title & OTR Price (Right side on mobile, Bottom on desktop) */}
            <div className="w-7/12 sm:w-full space-y-1 pl-3 sm:pl-0 my-auto sm:my-0">
                <Link href={`/produk/${motorcycle.slug}`}>
                    <h3 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition">
                        {motorcycle.name}
                    </h3>
                </Link>
                <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-normal tracking-tight block">
                        *OTR Pekanbaru
                    </span>
                    <span className="text-xs sm:text-base font-bold text-slate-900">
                        {formatRupiah(motorcycle.price_otr)}
                    </span>
                </div>
            </div>

            {/* Bottom Right "Details" Pill Button */}
            <Link
                href={`/produk/${motorcycle.slug}`}
                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                className="absolute bottom-0 right-0 text-white font-normal text-[11px] sm:text-xs uppercase px-5 sm:px-6 py-2 sm:py-2.5 rounded-tl-xl sm:rounded-tl-2xl rounded-br-[22px] sm:rounded-br-[26px] shadow-md hover:brightness-110 transition duration-200 tracking-wider"
            >
                Details
            </Link>
        </div>
    );
}
