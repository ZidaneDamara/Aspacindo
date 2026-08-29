import React from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Index({ branches = [], regions = [], selectedRegion = 'Semua' }) {
    const handleRegionChange = (region) => {
        router.get('/lokasi-dealer', { region }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <PublicLayout title="Lokasi Dealer & Bengkel Resmi Yamaha Riau & Sumut">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Jaringan Dealer</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Lokasi Dealer &amp; Bengkel Resmi Yamaha</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Temukan cabang PT Aspacindo Kedaton Motor terdekat di kota Anda untuk layanan pembelian motor, suku cadang, dan servis berkala.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
                {/* Region Filter Buttons */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {regions.map((reg) => (
                        <button
                            key={reg}
                            onClick={() => handleRegionChange(reg)}
                            className={`px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition ${
                                selectedRegion === reg
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {reg}
                        </button>
                    ))}
                </div>

                {/* Branch Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <div key={branch.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="bg-blue-50 text-blue-700 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
                                        Wilayah {branch.region}
                                    </span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="Cabang Aktif"></span>
                                </div>
                                <h3 className="text-lg font-black text-slate-900 leading-snug">{branch.name}</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">{branch.full_address}</p>

                                {/* Operational Hours */}
                                {branch.operating_hours && (
                                    <div className="bg-slate-50 p-3.5 rounded-2xl space-y-1 text-xs text-slate-600 border border-slate-100">
                                        <span className="font-bold text-slate-900 text-[10px] uppercase block tracking-wider">Jam Operasional</span>
                                        {Object.entries(branch.operating_hours).map(([day, hours]) => (
                                            <div key={day} className="flex justify-between">
                                                <span className="font-medium">{day}:</span>
                                                <span className="font-bold text-slate-800">{hours}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Contact & Map Links */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                <a
                                    href={`https://wa.me/${branch.whatsapp_number}?text=${encodeURIComponent(`Halo ${branch.name}, saya ingin menanyakan ketersediaan unit / promo motor Yamaha.`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl transition text-xs uppercase tracking-wider shadow-sm"
                                >
                                    Hubungi WhatsApp Dealer
                                </a>
                                {branch.google_maps_url && (
                                    <a
                                        href={branch.google_maps_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition text-xs uppercase tracking-wider"
                                    >
                                        Buka Petunjuk Arah (Google Maps) &rarr;
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
