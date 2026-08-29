import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import LazyImage from '@/Components/LazyImage';

export default function Show({ promotion }) {
    return (
        <PublicLayout title={promotion.title}>
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Promo Spesial</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase">{promotion.title}</h1>
                    <p className="text-slate-400 text-sm">Periode: {promotion.start_date || 'Hari ini'} - {promotion.end_date || 'Akhir Bulan'}</p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-md">
                    <LazyImage
                        src={promotion.banner_image || '/assets/images/placeholder_promo.webp'}
                        alt={promotion.title}
                        aspectRatio="aspect-[16/9]"
                    />
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-slate-900">Syarat &amp; Ketentuan Promo</h3>
                    <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                        {promotion.description || 'Dapatkan kemudahan fasilitas kredit motor Yamaha dengan bunga ringan dan bonus voucher servis.'}
                    </p>

                    <a
                        href={`https://wa.me/6281270001111?text=${encodeURIComponent(`Halo Yamaha Aspacindo, saya ingin klaim promo "${promotion.title}". Mohon bantuan informasinya.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 rounded-2xl shadow-lg transition text-sm uppercase tracking-wider"
                    >
                        Klaim Promo via WhatsApp CS &rarr;
                    </a>
                </div>
            </div>
        </PublicLayout>
    );
}
