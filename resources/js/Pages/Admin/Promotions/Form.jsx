import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ promotion = null }) {
    const isEditing = !!promotion;

    const { data, setData, post, put, processing } = useForm({
        title: promotion?.title || '',
        banner_image: promotion?.banner_image || '',
        description: promotion?.description || '',
        start_date: promotion?.start_date || '',
        end_date: promotion?.end_date || '',
        is_active: promotion ? promotion.is_active : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/promotions/${promotion.id}`);
        } else {
            post('/admin/promotions');
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit ${promotion.title}` : 'Tambah Promo Baru'}>
            <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">{isEditing ? 'Edit Promo' : 'Form Promo Baru'}</h2>
                    <Link href="/admin/promotions" className="text-xs font-bold text-slate-500 hover:text-slate-900">&larr; Kembali</Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Judul Promo Banner</label>
                        <input
                            type="text"
                            required
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">URL Banner Gambar</label>
                        <input
                            type="text"
                            required
                            placeholder="/assets/images/promos/banner_nmax.webp"
                            value={data.banner_image}
                            onChange={(e) => setData('banner_image', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Tgl Berlaku Mulai</label>
                            <input
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Tgl Berakhir</label>
                            <input
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi &amp; Syarat Ketentuan</label>
                        <textarea
                            rows="4"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Status Promo Aktif
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition"
                    >
                        {isEditing ? 'Simpan Perubahan' : 'Terbitkan Promo'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
