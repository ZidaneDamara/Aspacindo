import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Index({ servicePrices = {}, branches = [], regions = [], filters = {} }) {
    const [activeTab, setActiveTab] = useState('Reguler');
    const [selectedRegion, setSelectedRegion] = useState(filters.region || 'Semua');

    const formatPrice = (val) => {
        if (val === null || val === undefined || val === '' || val === 0) {
            return 'Rp ,-';
        }
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const handleRegionChange = (e) => {
        const reg = e.target.value;
        setSelectedRegion(reg);
        router.get('/bengkel', { region: reg !== 'Semua' ? reg : undefined }, { preserveState: true, replace: true });
    };

    // Current active category repair items
    const currentItems = servicePrices[activeTab] || [];

    return (
        <PublicLayout title="Bengkel Resmi Yamaha Aspacindo - Biaya Service & Lokasi">
            <div className="bg-white py-12 sm:py-16 font-sans text-slate-800 min-h-screen">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    {/* SECTION 1: BIAYA SERVICE BENGKEL ASPACINDO */}
                    <div className="space-y-8 text-center">
                        <div className="space-y-1">
                            <h2 className="text-3xl sm:text-4xl font-extrabold italic text-[#0A58CA] tracking-tight uppercase">
                                BIAYA SERVICE
                            </h2>
                            <h1 className="text-3xl sm:text-4xl font-black italic text-slate-950 tracking-tight uppercase">
                                BENGKEL ASPACINDO
                            </h1>
                        </div>

                        {/* Category Tabs: Reguler, Perbaikan Ringan, Perbaikan Berat */}
                        <div className="flex justify-center items-center gap-3 flex-wrap">
                            {['Reguler', 'Perbaikan Ringan', 'Perbaikan Berat'].map((tab) => {
                                const isActive = activeTab === tab;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-8 py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 shadow-sm ${
                                            isActive
                                                ? 'bg-[#0B1D4F] text-white shadow-md'
                                                : 'bg-[#0A73BA] text-white hover:bg-[#0A58CA]'
                                        }`}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>

                        {/* SERVICE PRICE TABLE */}
                        <div className="overflow-x-auto border border-slate-300 rounded-lg shadow-sm bg-white">
                            <table className="w-full text-left border-collapse min-w-[700px]">
                                <thead>
                                    <tr>
                                        <th className="bg-black text-white font-extrabold text-xs uppercase px-5 py-3.5 border-r border-slate-700 w-[30%]">
                                            TIPE PERBAIKAN
                                        </th>
                                        <th className="bg-[#0B1D4F] text-white font-extrabold text-xs uppercase px-4 py-3.5 text-center border-r border-blue-900 w-[17.5%]">
                                            MOPED
                                        </th>
                                        <th className="bg-[#0B1D4F] text-white font-extrabold text-xs uppercase px-4 py-3.5 text-center border-r border-blue-900 w-[17.5%]">
                                            SPORT
                                        </th>
                                        <th className="bg-[#0B1D4F] text-white font-extrabold text-xs uppercase px-4 py-3.5 text-center border-r border-blue-900 w-[17.5%]">
                                            MATIC
                                        </th>
                                        <th className="bg-[#0B1D4F] text-white font-extrabold text-xs uppercase px-4 py-3.5 text-center w-[17.5%]">
                                            MATIC PREMIUM
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 text-xs sm:text-sm font-normal">
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, idx) => (
                                            <tr key={item.id || idx} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-5 py-3.5 font-semibold text-slate-900 border-r border-slate-200">
                                                    {item.repair_type}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-slate-800 font-medium border-r border-slate-200">
                                                    {formatPrice(item.price_moped)}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-slate-800 font-medium border-r border-slate-200">
                                                    {formatPrice(item.price_sport)}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-slate-800 font-medium border-r border-slate-200">
                                                    {formatPrice(item.price_matic)}
                                                </td>
                                                <td className="px-4 py-3.5 text-center text-slate-800 font-medium">
                                                    {formatPrice(item.price_matic_premium)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="px-5 py-8 text-center text-slate-400">
                                                Belum ada data biaya service untuk kategori ini.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* SECTION 2: LOKASI BENGKEL ASPACINDO */}
                    <div className="pt-10 space-y-6">
                        <div className="text-center space-y-2">
                            <h2 className="text-3xl sm:text-4xl font-black italic text-[#0B1D4F] tracking-tight uppercase">
                                LOKASI BENGKEL ASPACINDO
                            </h2>
                            <p className="text-slate-600 text-xs sm:text-sm">
                                Cek lokasi bengkel resmi Yamaha Aspacindo Kedaton Motor terdekat di lokasi anda:
                            </p>
                        </div>

                        {/* Region Filter Dropdown */}
                        <div className="max-w-md mx-auto">
                            <select
                                value={selectedRegion}
                                onChange={handleRegionChange}
                                className="w-full text-sm font-medium border-slate-300 rounded-lg p-3 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Semua">Pilih Lokasi Cabang (Semua Wilayah)</option>
                                {regions.filter(r => r !== 'Semua').map((reg) => (
                                    <option key={reg} value={reg}>
                                        Wilayah {reg}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Dynamic Bengkel Cards Grid */}
                        {branches.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                {branches.map((bengkel) => (
                                    <div
                                        key={bengkel.id}
                                        className="bg-white border border-slate-300 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                                    >
                                        <div className="p-6 space-y-3">
                                            <h3 className="text-lg font-black text-slate-900 border-b border-slate-100 pb-2">
                                                {bengkel.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed min-h-[40px]">
                                                {bengkel.full_address}
                                            </p>
                                            <div className="pt-1 text-xs text-slate-500 space-y-0.5">
                                                <p className="font-semibold text-slate-700">Jam Kerja:</p>
                                                <p>08:00 AM – 17:00 PM Senin – Minggu</p>
                                            </div>
                                        </div>

                                        {/* Action Bar (Hubungi, Email, Lihat Lokasi) */}
                                        <div className="bg-black text-white py-2.5 px-4 flex items-center justify-around text-xs font-bold uppercase tracking-wider">
                                            <a
                                                href={`https://wa.me/${bengkel.whatsapp_number}?text=${encodeURIComponent(`Halo Bengkel Yamaha ${bengkel.name}, saya mau tanya service.`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-400 transition flex items-center gap-1.5"
                                            >
                                                <span>📞</span> Hubungi
                                            </a>
                                            <span className="text-slate-700">|</span>
                                            <a
                                                href="mailto:contact.aspacindo@gmail.com"
                                                className="hover:text-blue-400 transition flex items-center gap-1.5"
                                            >
                                                <span>✉️</span> Email
                                            </a>
                                            <span className="text-slate-700">|</span>
                                            <a
                                                href={bengkel.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(bengkel.full_address)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-blue-400 transition flex items-center gap-1.5"
                                            >
                                                <span>📍</span> Lihat Lokasi
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center text-slate-500 text-sm">
                                Tidak ada bengkel resmi Yamaha di wilayah <span className="font-bold text-slate-800">{selectedRegion}</span>.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
