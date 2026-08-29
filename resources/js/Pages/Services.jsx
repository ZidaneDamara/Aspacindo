import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Services({ branches = [] }) {
    const { flash } = usePage().props;

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

    return (
        <PublicLayout title="Layanan Bengkel Resmi & Booking Service Yamaha">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Bengkel Resmi Yamaha</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Layanan Servis &amp; Suku Cadang Original</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Jaga performa sepeda motor Yamaha Anda selalu prima dengan perawatan rutin dari teknisi tersertifikasi Jepang di 20+ jaringan bengkel resmi Aspacindo.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
                {/* Service Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xl">
                            01
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Booking Service Berkala</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Nikmati fasilitas antrean prioritas tanpa perlu menunggu lama. Servis berkala menggunakan peralatan diagnostik digital Yamaha Injection (YDT) terbaru.
                        </p>
                        <a href="#booking" className="inline-block text-xs font-bold text-blue-600 uppercase tracking-wider hover:underline">
                            Form Booking Online &darr;
                        </a>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center font-black text-xl">
                            02
                        </div>
                        <h3 className="text-2xl font-black text-slate-900">Layanan SKY (Service Kunjung Yamaha)</h3>
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
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-4 rounded-2xl shadow-lg transition text-sm uppercase tracking-wider disabled:opacity-50"
                            >
                                {processing ? 'Memproses Booking...' : 'Kirim Reservasi Service &rarr;'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
