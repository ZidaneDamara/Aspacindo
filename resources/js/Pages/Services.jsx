import React, { useState } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Services({
    branches = [],
    bengkelBranches = [],
    servicePrices = {},
    regions = [],
    filters = {}
}) {
    const { flash } = usePage().props;
    const [activePriceTab, setActivePriceTab] = useState('Reguler');
    const [selectedRegion, setSelectedRegion] = useState(filters.region || 'Semua');

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        phone_number: '',
        motorcycle_model: '',
        branch_id: branches[0]?.id || '',
        preferred_date: '',
        preferred_time: '09:00 WIB',
        service_type: 'Booking Service',
        notes: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/layanan/booking', {
            onSuccess: () => reset(),
        });
    };

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
        router.get('/layanan', { region: reg !== 'Semua' ? reg : undefined }, { preserveState: true, replace: true });
    };

    // Current active category repair items
    const currentPriceItems = servicePrices[activePriceTab] || [];

    return (
        <PublicLayout title="Layanan Bengkel Resmi & Booking Service Yamaha">
            {/* TOP HERO BANNER */}
            <div
                style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                className="text-white py-12 border-b border-blue-900 font-['Inter',sans-serif]"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block opacity-90">Bengkel Resmi Yamaha</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">Layanan Servis &amp; Suku Cadang Original</h1>
                    <p className="text-blue-100 text-sm mt-2 max-w-xl">
                        Jaga performa sepeda motor Yamaha Anda selalu prima dengan perawatan rutin dari teknisi tersertifikasi di 20+ jaringan bengkel resmi Aspacindo.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 font-['Inter',sans-serif]">
                {/* Service Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-xl">
                            01
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Booking Service Berkala</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nikmati fasilitas antrean prioritas tanpa perlu menunggu lama. Servis berkala menggunakan peralatan diagnostik digital Yamaha Injection (YDT) terbaru.
                        </p>
                        <a href="#booking" className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline">
                            Form Booking Online &darr;
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-extrabold text-xl">
                            02
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900">Layanan SKY (Service Kunjung Yamaha)</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Mekanik resmi kami siap mendatangi lokasi rumah atau kantor Anda untuk servis rutin, pergantian oli, dan perbaikan ringan tanpa biaya transportasi tambahan.
                        </p>
                        <a href="#booking" className="inline-block text-xs font-bold text-red-600 uppercase tracking-wider hover:underline">
                            Pesan Service Kunjung &darr;
                        </a>
                    </div>
                </div>

                {/* BOOKING SERVICE FORM */}
                <div id="booking" className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-100 shadow-sm space-y-8">
                    <div className="max-w-xl space-y-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Reservasi Online</span>
                        <h2 className="text-3xl font-semibold text-slate-900 tracking-tight uppercase">Formulir Booking Service</h2>
                        <p className="text-slate-500 text-sm">Isi data jadwal kedatangan Anda untuk verifikasi reservasi teknisi.</p>
                    </div>

                    {/* Success Alert */}
                    {flash?.success && (
                        <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 space-y-2">
                            <h4 className="font-extrabold text-base flex items-center gap-2">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                {flash.success.message}
                            </h4>
                            <p className="text-xs text-emerald-800">
                                Kode Reservasi Anda: <strong className="text-sm font-black text-emerald-950 bg-emerald-100 px-2 py-0.5 rounded">{flash.success.booking_code}</strong>
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Name */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nama Lengkap Pemilik</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Budi Santoso"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.customer_name && <p className="text-xs text-red-500">{errors.customer_name}</p>}
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nomor WhatsApp Aktif</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: 081234567890"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
                        </div>

                        {/* Motorcycle Model */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Tipe Motor Yamaha</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: NMAX 155 / Aerox 2023"
                                value={data.motorcycle_model}
                                onChange={(e) => setData('motorcycle_model', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.motorcycle_model && <p className="text-xs text-red-500">{errors.motorcycle_model}</p>}
                        </div>

                        {/* Branch Select */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Pilih Cabang Bengkel</label>
                            <select
                                value={data.branch_id}
                                onChange={(e) => setData('branch_id', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name} ({b.region})
                                    </option>
                                ))}
                            </select>
                            {errors.branch_id && <p className="text-xs text-red-500">{errors.branch_id}</p>}
                        </div>

                        {/* Service Type */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Jenis Layanan</label>
                            <select
                                value={data.service_type}
                                onChange={(e) => setData('service_type', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="Booking Service">Booking Service (Bengkel)</option>
                                <option value="Layanan SKY">Layanan SKY (Service Kunjung Rumah)</option>
                            </select>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Tgl Kedatangan</label>
                                <input
                                    type="date"
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={data.preferred_date}
                                    onChange={(e) => setData('preferred_date', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Jam Kedatangan</label>
                                <select
                                    value={data.preferred_time}
                                    onChange={(e) => setData('preferred_time', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="09:00 WIB">09:00 WIB</option>
                                    <option value="11:00 WIB">11:00 WIB</option>
                                    <option value="14:00 WIB">14:00 WIB</option>
                                    <option value="16:00 WIB">16:00 WIB</option>
                                </select>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="md:col-span-2 space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Catatan Keluhan Motor (Opsional)</label>
                            <textarea
                                rows="3"
                                placeholder="Jelaskan masalah atau keluhan mesin yang perlu diperiksa..."
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="md:col-span-2 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                                className="w-full text-white font-extrabold py-4 rounded-2xl shadow-lg transition text-sm uppercase tracking-wider disabled:opacity-50 hover:brightness-110"
                            >
                                {processing ? 'Memproses Booking...' : 'Kirim Reservasi Service &rarr;'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* BIAYA SERVICE BENGKEL ASPACINDO SECTION */}
                <div id="biaya-service" className="space-y-8 text-center pt-8 border-t border-slate-200">
                    <div className="space-y-1">
                        <h2 className="text-3xl sm:text-4xl font-extrabold italic text-[#0A58CA] tracking-tight uppercase">
                            BIAYA SERVICE
                        </h2>
                        <h2 className="text-3xl sm:text-4xl font-black italic text-slate-950 tracking-tight uppercase">
                            BENGKEL ASPACINDO
                        </h2>
                    </div>

                    {/* Category Tabs: Reguler, Perbaikan Ringan, Perbaikan Berat */}
                    <div className="flex justify-center items-center gap-3 flex-wrap">
                        {['Reguler', 'Perbaikan Ringan', 'Perbaikan Berat'].map((tab) => {
                            const isActive = activePriceTab === tab;
                            return (
                                <button
                                    key={tab}
                                    type="button"
                                    onClick={() => setActivePriceTab(tab)}
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
                                {currentPriceItems.length > 0 ? (
                                    currentPriceItems.map((item, idx) => (
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

                {/* LOKASI BENGKEL ASPACINDO SECTION */}
                <div id="lokasi-bengkel" className="pt-8 space-y-6 border-t border-slate-200">
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

                    {/* Dynamic Bengkel Cards Grid (Only branches where has_service_center = 1) */}
                    {bengkelBranches.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                            {bengkelBranches.map((bengkel) => (
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
        </PublicLayout>
    );
}
