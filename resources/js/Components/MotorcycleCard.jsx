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
        <div className="relative pt-6 sm:pt-8 pb-2 h-full flex flex-col group select-none">
            {/* The Outer Card Container */}
            <div className="relative flex-1 flex flex-col justify-between">
                
                {/* 1. White Card Background: Starts ~40px-48px down so bike sticks out above it */}
                <div className="absolute inset-x-0 bottom-0 top-10 sm:top-12 bg-white rounded-[26px] sm:rounded-[30px] border border-slate-200/90 shadow-[0_8px_25px_rgba(0,0,0,0.06)] group-hover:shadow-[0_16px_35px_rgba(0,0,0,0.12)] transition-shadow duration-300 z-0" />

                {/* 2. Card Content (z-10 in normal flow on top of background) */}
                <div className="relative z-10 flex flex-col justify-between h-full p-4 sm:p-5 pb-14 sm:pb-16">
                    
                    {/* Bike Image: Sits at the top and naturally extends above the white background */}
                    <Link
                        href={targetUrl}
                        className="block w-full flex justify-center group-hover:-translate-y-1.5 transition-transform duration-300"
                    >
                        <div className="w-full h-36 sm:h-44 flex items-center justify-center">
                            <LazyImage
                                src={primaryImage}
                                alt={motorcycle.name}
                                aspectRatio=""
                                bgClassName="bg-transparent"
                                className="w-full h-full"
                                imgClassName="w-full h-full object-contain filter drop-shadow-[0_10px_16px_rgba(0,0,0,0.15)] group-hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </Link>

                    {/* Bike Information: Name, OTR, Price (Flows naturally below the image - never overlaps) */}
                    <div className="mt-3 sm:mt-4 space-y-1 text-left px-1">
                        <Link href={targetUrl} className="block">
                            <h3 className="text-base sm:text-lg font-play font-bold text-slate-900 tracking-tight group-hover:text-blue-700 transition line-clamp-1">
                                {motorcycle.name}
                            </h3>
                        </Link>
                        <p className="text-[11px] sm:text-xs text-slate-400 font-medium tracking-tight">
                            *OTR {regionName}, Mulai Dari
                        </p>
                        <p className="text-base sm:text-lg font-bold font-play text-slate-900">
                            {formatRupiah(displayPrice)}
                        </p>
                    </div>
                </div>

                {/* 3. Details Button: Snapped to bottom right */}
                <Link
                    href={targetUrl}
                    style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                    className="absolute bottom-0 right-0 text-white font-play text-sm sm:text-base font-semibold uppercase px-6 sm:px-7 py-2 sm:py-2.5 rounded-tl-2xl sm:rounded-tl-3xl rounded-br-[26px] sm:rounded-br-[30px] shadow-sm hover:brightness-110 active:scale-95 transition-all duration-200 tracking-wider z-20"
                >
                    Details
                </Link>
            </div>
        </div>
    );
}
