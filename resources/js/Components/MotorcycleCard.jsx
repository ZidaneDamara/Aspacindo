import React from 'react';
import { Link } from '@inertiajs/react';
import LazyImage from './LazyImage';

export default function MotorcycleCard({ motorcycle, selectedRegion }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const primaryImage = motorcycle.primary_image?.image_path || motorcycle.images?.[0]?.image_path || '/assets/images/placeholder_bike.webp';
    const regionName = selectedRegion || motorcycle.selected_region || 'Pekanbaru';
    const displayPrice = (motorcycle.regional_prices && motorcycle.regional_prices[regionName])
        ? motorcycle.regional_prices[regionName]
        : motorcycle.price_otr;

    const targetUrl = `/produk/${motorcycle.slug}?region=${encodeURIComponent(regionName)}`;

    return (
        <div className="bg-white rounded-[24px] sm:rounded-[28px] border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group flex flex-row sm:flex-col items-center sm:items-stretch justify-between p-4 sm:p-6 pb-14 sm:pb-16 min-h-[160px] sm:min-h-[360px]">
            {/* Bike Photo Cutout (Left side on mobile, Top on desktop) */}
            <Link href={targetUrl} className="w-5/12 sm:w-full flex-shrink-0 block pt-1 sm:pt-2">
                <div className="w-full h-28 sm:h-52 flex items-center justify-center p-2 sm:p-3 overflow-hidden">
                    <LazyImage
                        src={primaryImage}
                        alt={motorcycle.name}
                        aspectRatio=""
                        bgClassName="bg-transparent"
                        className="w-full h-full"
                        imgClassName="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            </Link>

            {/* Title & OTR Price (Right side on mobile, Bottom on desktop) */}
            <div className="w-7/12 sm:w-full space-y-1.5 pl-3 sm:pl-0 my-auto sm:my-0 sm:pt-2">
                <Link href={targetUrl} className="block">
                    <h3 className="text-sm sm:text-lg font-play font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition line-clamp-2 min-h-[2.5rem] flex items-center">
                        {motorcycle.name}
                    </h3>
                </Link>
                <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium tracking-tight block">
                        *OTR {regionName}
                    </span>
                    <span className="text-xs sm:text-base font-bold font-play text-slate-900">
                        {formatRupiah(displayPrice)}
                    </span>
                </div>
            </div>

            {/* Bottom Right "Details" Pill Button */}
            <Link
                href={targetUrl}
                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                className="absolute bottom-0 right-0 text-white font-play text-[15px] sm:text-[17px] leading-[26px] font-normal uppercase px-5 sm:px-6 py-1.5 sm:py-2 rounded-tl-xl sm:rounded-tl-2xl rounded-br-[24px] sm:rounded-br-[28px] shadow-md hover:brightness-110 transition duration-200 tracking-wider"
            >
                Details
            </Link>
        </div>
    );
}
