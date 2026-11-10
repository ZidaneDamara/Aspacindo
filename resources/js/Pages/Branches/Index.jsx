import React from 'react';
import { router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Index({ branches = [], regions = [], selectedRegion = 'Semua' }) {
    const handleRegionChange = (region) => {
        router.get('/lokasi-dealer', { region }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <PublicLayout
            title="Lokasi Dealer & Bengkel Resmi Yamaha Riau & Sumut"
            description="Daftar 20+ alamat cabang dealer dan bengkel resmi Yamaha PT. Aspacindo Kedaton Motor di Pekanbaru, Pelalawan, Siak, Kampar, Inhu, Inhil, dan Medan."
        >
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Jaringan Dealer</span>
                    <h1 className="font-play font-bold text-[18px] leading-[27px] uppercase tracking-tight text-white">Lokasi Dealer &amp; Bengkel Resmi Yamaha</h1>
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
                                    <div className="flex items-center gap-2">
                                        <span className="bg-blue-50 text-blue-700 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase">
                                            {branch.region}
                                        </span>
                                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                                            branch.dealer_type === '1S' ? 'bg-purple-100 text-purple-800' :
                                            branch.dealer_type === '2S' ? 'bg-cyan-100 text-cyan-800' :
                                            'bg-emerald-100 text-emerald-800'
                                        }`}>
                                            {branch.dealer_type || '3S'} {branch.dealer_type === '1S' ? '• Sales' : branch.dealer_type === '2S' ? '• 2S' : '• 3S Dealer Utama'}
                                        </span>
                                    </div>
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

                                {/* Social Media Links */}
                                {branch.social_media && (branch.social_media.instagram || branch.social_media.facebook || branch.social_media.tiktok) && (
                                    <div className="pt-2">
                                        <span className="font-extrabold text-slate-400 text-[10px] uppercase block tracking-wider mb-2">
                                            Media Sosial Resmi
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {branch.social_media.instagram && (
                                                <a
                                                    href={branch.social_media.instagram.startsWith('http') ? branch.social_media.instagram : `https://${branch.social_media.instagram}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-pink-50/40 border border-slate-200 hover:border-pink-300 text-slate-700 hover:text-pink-600 shadow-2xs hover:shadow-xs transition-all duration-200 group"
                                                    title={`Instagram ${branch.name}`}
                                                >
                                                    <svg className="w-4 h-4 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                                                        <defs>
                                                            <radialGradient id={`ig-grad-${branch.id}`} cx="30%" cy="107%" r="150%">
                                                                <stop offset="0%" stopColor="#fdf497" />
                                                                <stop offset="5%" stopColor="#fdf497" />
                                                                <stop offset="45%" stopColor="#fd5949" />
                                                                <stop offset="60%" stopColor="#d6249f" />
                                                                <stop offset="90%" stopColor="#285AEB" />
                                                            </radialGradient>
                                                        </defs>
                                                        <rect x="2" y="2" width="20" height="20" rx="5.5" stroke={`url(#ig-grad-${branch.id})`} strokeWidth="2" />
                                                        <circle cx="12" cy="12" r="4.2" stroke={`url(#ig-grad-${branch.id})`} strokeWidth="2" />
                                                        <circle cx="17.5" cy="6.5" r="1.2" fill={`url(#ig-grad-${branch.id})`} />
                                                    </svg>
                                                    <span>Instagram</span>
                                                </a>
                                            )}
                                            {branch.social_media.facebook && (
                                                <a
                                                    href={branch.social_media.facebook.startsWith('http') ? branch.social_media.facebook : `https://${branch.social_media.facebook}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-[#1877F2] shadow-2xs hover:shadow-xs transition-all duration-200 group"
                                                    title={`Facebook ${branch.name}`}
                                                >
                                                    <svg className="w-4 h-4 flex-shrink-0 text-[#1877F2] fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                                    </svg>
                                                    <span>Facebook</span>
                                                </a>
                                            )}
                                            {branch.social_media.tiktok && (
                                                <a
                                                    href={branch.social_media.tiktok.startsWith('http') ? branch.social_media.tiktok : `https://${branch.social_media.tiktok}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-800 text-slate-700 hover:text-slate-950 shadow-2xs hover:shadow-xs transition-all duration-200 group"
                                                    title={`TikTok ${branch.name}`}
                                                >
                                                    <svg className="w-4 h-4 flex-shrink-0 text-slate-900 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                                                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-3.04-1.52z"/>
                                                    </svg>
                                                    <span>TikTok</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Contact & Map Links */}
                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                {branch.whatsapp_number && (
                                    <a
                                        href={
                                            branch.whatsapp_number.startsWith('http')
                                                ? branch.whatsapp_number
                                                : `https://wa.me/${branch.whatsapp_number.replace(/\D/g, '')}?text=${encodeURIComponent(`Halo ${branch.name}, saya ingin menanyakan ketersediaan unit / promo motor Yamaha.`)}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full text-center bg-[#25D366] hover:bg-[#20ba59] text-white font-extrabold py-3 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider shadow-sm hover:shadow-md"
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0 fill-current" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                        </svg>
                                        <span>Hubungi WhatsApp Dealer</span>
                                    </a>
                                )}
                                {branch.google_maps_url && (
                                    <a
                                        href={branch.google_maps_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 rounded-xl transition-all duration-200 text-xs uppercase tracking-wider"
                                    >
                                        <svg className="w-4 h-4 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0C7.31 0 3.5 3.81 3.5 8.5c0 5.25 7.05 14.13 7.84 15.11.34.42.98.42 1.32 0 .79-.98 7.84-9.86 7.84-15.11C20.5 3.81 16.69 0 12 0zm0 11.5c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                                        </svg>
                                        <span>Buka Petunjuk Arah (Google Maps)</span>
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
