import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ motorcycle = null }) {
    const isEditing = !!motorcycle;

    const { data, setData, post, put, processing, errors } = useForm({
        name: motorcycle?.name || '',
        category: motorcycle?.category || 'MAXi',
        price_otr: motorcycle?.price_otr || '',
        short_description: motorcycle?.short_description || '',
        image_path: motorcycle?.primary_image?.image_path || '',
        is_featured: motorcycle ? motorcycle.is_featured : false,
        is_active: motorcycle ? motorcycle.is_active : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/motorcycles/${motorcycle.id}`);
        } else {
            post('/admin/motorcycles');
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit ${motorcycle.name}` : 'Tambah Motor Baru'}>
            <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                        {isEditing ? 'Edit Data Motor' : 'Form Tambah Motor Baru'}
                    </h2>
                    <Link href="/admin/motorcycles" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        &larr; Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Nama Model Motor</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Yamaha NMAX Turbo"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Kategori</label>
                            <select
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            >
                                <option value="MAXi">MAXi</option>
                                <option value="Classy">Classy</option>
                                <option value="Matic">Matic</option>
                                <option value="Sport">Sport</option>
                                <option value="Off-Road">Off-Road</option>
                                <option value="Moped">Moped</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Harga OTR (Rp)</label>
                            <input
                                type="number"
                                required
                                placeholder="Contoh: 37750000"
                                value={data.price_otr}
                                onChange={(e) => setData('price_otr', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                            {errors.price_otr && <p className="text-xs text-red-500">{errors.price_otr}</p>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">URL Gambar / Asset Path</label>
                        <input
                            type="text"
                            placeholder="/assets/images/motorcycles/yamaha-nmax-turbo.webp"
                            value={data.image_path}
                            onChange={(e) => setData('image_path', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi Singkat</label>
                        <textarea
                            rows="3"
                            value={data.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="flex gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_featured}
                                onChange={(e) => setData('is_featured', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Tampilkan di Unggulan Homepage
                        </label>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Status Aktif (Tampil di Katalog)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition"
                    >
                        {isEditing ? 'Simpan Perubahan' : 'Tambah Motor Baru'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
