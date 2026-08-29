import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import LazyImage from '@/Components/LazyImage';

export default function Gallery({ galleries = [] }) {
    return (
        <PublicLayout title="Galeri & Kegiatan PT Aspacindo Kedaton Motor">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Dokumentasi Acara</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Galeri &amp; Aktifitas Dealership</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Momen kebersamaan, event touring komunitas Yamaha MAXi, serah terima unit kendaraan, dan kegiatan sosial Aspacindo Kedaton Motor.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleries.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition">
                            <LazyImage
                                src={item.image}
                                alt={item.title}
                                aspectRatio="aspect-[16/10]"
                            />
                            <div className="p-6 space-y-2">
                                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                                    {item.category}
                                </span>
                                <h3 className="text-base font-bold text-slate-900 leading-snug">{item.title}</h3>
                                <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
