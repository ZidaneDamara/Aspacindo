import React, { useState } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { UploadCloud } from 'lucide-react';

export default function Form({ sparepart = null }) {
    const isEditing = !!sparepart;
    const [imagePreview, setImagePreview] = useState(sparepart?.image_url || '');

    const { data, setData, processing, errors } = useForm({
        name: sparepart?.name || '',
        category: sparepart?.category || 'Pelumas',
        price: sparepart?.price || '',
        description: sparepart?.description || '',
        image_file: null,
        image_url: sparepart?.image_url || '',
        is_new: sparepart ? (sparepart.is_new ?? false) : false,
        is_active: sparepart ? (sparepart.is_active ?? true) : true,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category', data.category);
        formData.append('price', data.price);
        formData.append('description', data.description || '');
        formData.append('image_url', data.image_url || '');
        formData.append('is_new', data.is_new ? '1' : '0');
        formData.append('is_active', data.is_active ? '1' : '0');

        if (data.image_file) {
            formData.append('image_file', data.image_file);
        }

        if (isEditing) {
            formData.append('_method', 'PUT');
            router.post(`/admin/spareparts/${sparepart.id}`, formData, {
                forceFormData: true,
            });
        } else {
            router.post('/admin/spareparts', formData, {
                forceFormData: true,
            });
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit ${sparepart.name}` : 'Tambah Sparepart Baru'}>
            <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-sans">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                        {isEditing ? 'Edit Data Sparepart' : 'Form Tambah Sparepart Baru'}
                    </h2>
                    <Link href="/admin/spareparts" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        &larr; Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Nama Sparepart</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: Yamalube Super Matic Oil"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Kategori</label>
                            <select
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            >
                                <option value="Sparepart">Sparepart</option>
                                <option value="Pelumas">Pelumas</option>
                                <option value="Ban">Ban</option>
                                <option value="Busi">Busi</option>
                                <option value="Pengereman">Pengereman</option>
                                <option value="Kelistrikan">Kelistrikan</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Harga Eceran (Rp)</label>
                        <input
                            type="number"
                            required
                            placeholder="Contoh: 74000"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3 font-bold text-blue-900"
                        />
                        {errors.price && <p className="text-xs text-red-500">{errors.price}</p>}
                    </div>

                    {/* Direct File Upload Component */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                        <label className="text-xs font-semibold text-zinc-800 uppercase tracking-wider block flex items-center gap-1.5">
                            <UploadCloud className="w-4 h-4 text-zinc-500" />
                            Upload Foto Produk Sparepart (Dari Perangkat / Laptop)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full text-xs text-zinc-600 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white hover:file:bg-zinc-800 cursor-pointer"
                        />
                        <p className="text-[11px] text-zinc-400">Format gambar: PNG, JPG, WEBP. Maksimal 5MB.</p>

                        {imagePreview && (
                            <div className="pt-2 flex items-center gap-4">
                                <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-zinc-200 shadow-2xs flex items-center justify-center overflow-hidden">
                                    <img src={imagePreview} alt="Preview Sparepart" className="max-h-full object-contain" />
                                </div>
                                <div className="text-xs space-y-0.5">
                                    <p className="font-semibold text-zinc-800">Preview Foto Sparepart</p>
                                    <p className="text-zinc-400 text-[11px] truncate max-w-xs">{data.image_url || 'File Baru Diupload'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-zinc-700 uppercase">Deskripsi / Keunggulan / Spesifikasi</label>
                        <textarea
                            rows="4"
                            placeholder="Tuliskan deskripsi keunggulan dan spesifikasi sparepart..."
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        />
                    </div>

                    <div className="flex items-center gap-6 pt-2">
                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_new}
                                onChange={(e) => setData('is_new', e.target.checked)}
                                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                            />
                            Beri Badge "NEW"
                        </label>

                        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-zinc-300 text-zinc-900 focus:ring-zinc-900"
                            />
                            Status Produk Aktif
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-lg text-xs tracking-wider transition shadow-xs disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan Sparepart' : 'Tambah Sparepart Baru')}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
