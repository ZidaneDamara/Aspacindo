import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({
    branch = null,
    userBranch = null,
    isBranchAdmin = false,
    defaultRegion = 'Pekanbaru',
    regions = [
        'Pekanbaru',
        'Pelalawan',
        'Siak',
        'Kampar',
        'Medan',
        'Indragiri Hulu',
        'Indragiri Hilir',
    ],
}) {
    const isEditing = !!branch;

    const { data, setData, post, put, processing, errors } = useForm({
        name: branch?.name || '',
        dealer_type: branch?.dealer_type || '3S',
        region: branch?.region || (isBranchAdmin && userBranch ? userBranch.region : defaultRegion),
        full_address: branch?.full_address || '',
        whatsapp_number: branch?.whatsapp_number || '6281270001111',
        latitude: branch?.latitude || '',
        longitude: branch?.longitude || '',
        google_maps_url: branch?.google_maps_url || '',
        is_active: branch ? (branch.is_active ?? true) : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/branches/${branch.id}`);
        } else {
            post('/admin/branches');
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit ${branch.name}` : 'Tambah Cabang Dealer Baru'}>
            <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            {isEditing ? `Edit Cabang: ${branch.name}` : 'Form Tambah Cabang Dealer / Pos Cabang'}
                        </h2>
                        {isBranchAdmin && userBranch && (
                            <p className="text-xs text-blue-600 font-semibold mt-1">
                                🏢 Input Cabang untuk Wilayah: <strong>{userBranch.region}</strong>
                            </p>
                        )}
                    </div>
                    <Link href="/admin/branches" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        &larr; Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Dealer Type Radio Buttons (3S, 2S, 1S) */}
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                        <div>
                            <label className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                                Tipe Dealer / Fasilitas (Pilih salah satu)
                            </label>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                                Menentukan klasifikasi layanan dealer Yamaha:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                            {/* 3S */}
                            <label
                                className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition ${
                                    data.dealer_type === '3S'
                                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-black text-sm text-slate-900">3S</span>
                                    <input
                                        type="radio"
                                        name="dealer_type"
                                        value="3S"
                                        checked={data.dealer_type === '3S'}
                                        onChange={(e) => setData('dealer_type', e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                    />
                                </div>
                                <span className="font-bold text-xs text-blue-900">Sales, Service, Sparepart</span>
                                <span className="text-[10px] text-slate-500 mt-1">Dealer Utama Lengkap</span>
                            </label>

                            {/* 2S */}
                            <label
                                className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition ${
                                    data.dealer_type === '2S'
                                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-black text-sm text-slate-900">2S</span>
                                    <input
                                        type="radio"
                                        name="dealer_type"
                                        value="2S"
                                        checked={data.dealer_type === '2S'}
                                        onChange={(e) => setData('dealer_type', e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                    />
                                </div>
                                <span className="font-bold text-xs text-slate-800">Sales, Service</span>
                                <span className="text-[10px] text-slate-500 mt-1">Penjualan &amp; Bengkel</span>
                            </label>

                            {/* 1S */}
                            <label
                                className={`flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition ${
                                    data.dealer_type === '1S'
                                        ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="font-black text-sm text-slate-900">1S</span>
                                    <input
                                        type="radio"
                                        name="dealer_type"
                                        value="1S"
                                        checked={data.dealer_type === '1S'}
                                        onChange={(e) => setData('dealer_type', e.target.value)}
                                        className="text-blue-600 focus:ring-blue-500 w-4 h-4"
                                    />
                                </div>
                                <span className="font-bold text-xs text-slate-800">Sales</span>
                                <span className="text-[10px] text-slate-500 mt-1">Pos / Showroom Penjualan</span>
                            </label>
                        </div>
                        {errors.dealer_type && <p className="text-[11px] text-red-500">{errors.dealer_type}</p>}
                    </div>

                    {/* Nama Cabang & Region */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Nama Cabang / Pos Dealer</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Aspacindo Kedaton Pos Lipat Kain"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            />
                            {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Wilayah / Region</label>
                            {isBranchAdmin && userBranch ? (
                                <div className="p-3 bg-slate-100 rounded-2xl border border-slate-200 text-xs font-bold text-slate-800">
                                    📍 {userBranch.region} <span className="text-slate-400 font-normal">(Sesuai wilayah Anda)</span>
                                </div>
                            ) : (
                                <select
                                    value={data.region}
                                    onChange={(e) => setData('region', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500 font-bold text-slate-700"
                                >
                                    {regions.map((reg) => (
                                        <option key={reg} value={reg}>
                                            {reg}
                                        </option>
                                    ))}
                                </select>
                            )}
                            {errors.region && <p className="text-[11px] text-red-500">{errors.region}</p>}
                        </div>
                    </div>

                    {/* Alamat Lengkap */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Alamat Lengkap Cabang</label>
                        <textarea
                            rows="3"
                            required
                            placeholder="Jl. Raya Lintas..., No..., Kelurahan..., Kecamatan..."
                            value={data.full_address}
                            onChange={(e) => setData('full_address', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.full_address && <p className="text-[11px] text-red-500">{errors.full_address}</p>}
                    </div>

                    {/* WhatsApp */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                            Nomor WhatsApp Kontak Dealer (Format: 628...)
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="6281270001111"
                            value={data.whatsapp_number}
                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3 font-mono focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.whatsapp_number && <p className="text-[11px] text-red-500">{errors.whatsapp_number}</p>}
                    </div>

                    {/* Google Maps URL */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">
                            Google Maps URL (Petunjuk Arah Lokasi)
                        </label>
                        <input
                            type="text"
                            placeholder="https://maps.google.com/?q=..."
                            value={data.google_maps_url}
                            onChange={(e) => setData('google_maps_url', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.google_maps_url && <p className="text-[11px] text-red-500">{errors.google_maps_url}</p>}
                    </div>

                    {/* Active toggle */}
                    <div className="pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Status Cabang Aktif (Tampil di website)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-md disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan Cabang' : 'Tambah Cabang Dealer')}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
