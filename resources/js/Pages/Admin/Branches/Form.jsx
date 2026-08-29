import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ branch = null }) {
    const isEditing = !!branch;

    const { data, setData, post, put, processing, errors } = useForm({
        name: branch?.name || '',
        region: branch?.region || 'Pekanbaru',
        full_address: branch?.full_address || '',
        whatsapp_number: branch?.whatsapp_number || '6281270001111',
        latitude: branch?.latitude || '',
        longitude: branch?.longitude || '',
        google_maps_url: branch?.google_maps_url || '',
        has_service_center: branch ? (branch.has_service_center ?? true) : true,
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
        <AdminLayout title={isEditing ? `Edit ${branch.name}` : 'Tambah Cabang Baru'}>
            <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                        {isEditing ? 'Edit Data Cabang' : 'Form Tambah Cabang Dealer & Bengkel'}
                    </h2>
                    <Link href="/admin/branches" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        &larr; Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Nama Cabang</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Yamaha Aspacindo Panam"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Wilayah Region</label>
                            <select
                                value={data.region}
                                onChange={(e) => setData('region', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            >
                                <option value="Pekanbaru">Pekanbaru</option>
                                <option value="Pelalawan">Pelalawan</option>
                                <option value="Siak">Siak</option>
                                <option value="Kampar">Kampar</option>
                                <option value="Medan">Medan</option>
                                <option value="Indragiri Hulu">Indragiri Hulu</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Alamat Lengkap Dealer &amp; Bengkel</label>
                        <textarea
                            rows="3"
                            required
                            value={data.full_address}
                            onChange={(e) => setData('full_address', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Nomor WhatsApp Kasir/Dealer (Format 62...)</label>
                        <input
                            type="text"
                            required
                            value={data.whatsapp_number}
                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Google Maps URL Petunjuk Arah</label>
                        <input
                            type="text"
                            placeholder="https://maps.google.com/?q=..."
                            value={data.google_maps_url}
                            onChange={(e) => setData('google_maps_url', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    {/* Radio Button (Biner) Service */}
                    <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                        <label className="text-xs font-black text-slate-800 uppercase tracking-wider block">
                            Service (Fasilitas Bengkel Resmi)
                        </label>
                        <p className="text-xs text-slate-500">
                            Jika dihidupkan (Ya), cabang ini otomatis masuk &amp; tampil di daftar lokasi Halaman Bengkel Resmi.
                        </p>
                        <div className="flex items-center gap-6 pt-1">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="radio"
                                    name="has_service_center"
                                    value={1}
                                    checked={data.has_service_center === true || data.has_service_center === 1}
                                    onChange={() => setData('has_service_center', true)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span>Ya (Aktif di Halaman Bengkel)</span>
                            </label>

                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                <input
                                    type="radio"
                                    name="has_service_center"
                                    value={0}
                                    checked={data.has_service_center === false || data.has_service_center === 0}
                                    onChange={() => setData('has_service_center', false)}
                                    className="text-blue-600 focus:ring-blue-500"
                                />
                                <span>Tidak (Hanya Sales Dealer)</span>
                            </label>
                        </div>
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Status Cabang Aktif
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition"
                    >
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Cabang Baru'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
