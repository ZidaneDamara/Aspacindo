import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    ArrowLeft,
    UploadCloud,
    Check,
    Image as ImageIcon,
    Calendar,
    Tag,
    ListOrdered,
    Info,
} from 'lucide-react';

export default function Form({ activity = null, categories = [] }) {
    const isEdit = !!activity;

    const { data, setData, post, put, processing, errors } = useForm({
        title: activity?.title || '',
        category: activity?.category || categories[0] || 'Acara & Event',
        event_date: activity?.event_date ? activity.event_date.substring(0, 10) : new Date().toISOString().substring(0, 10),
        description: activity?.description || '',
        image_path: activity?.image_path || '',
        image_file: null,
        is_active: activity ? !!activity.is_active : true,
        sort_order: activity?.sort_order ?? 0,
    });

    const [previewUrl, setPreviewUrl] = useState(activity?.image_url || activity?.image_path || '');

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image_file', file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            // When uploading file via PUT in inertia, often need post with _method: PUT or standard inertia put if no file
            if (data.image_file) {
                router.post(`/admin/activities/${activity.id}`, {
                    _method: 'put',
                    ...data,
                });
            } else {
                put(`/admin/activities/${activity.id}`);
            }
        } else {
            post('/admin/activities');
        }
    };

    return (
        <AdminLayout title={isEdit ? 'Edit Dokumentasi Aktifitas' : 'Tambah Dokumentasi Aktifitas'}>
            <Head title={`${isEdit ? 'Edit' : 'Tambah'} Dokumentasi | Admin`} />

            <div className="max-w-4xl space-y-6">
                {/* Back button and title */}
                <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
                    <Link
                        href="/admin/activities"
                        className="p-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            {isEdit ? 'Perbarui Dokumentasi Kegiatan' : 'Tambah Kegiatan Baru'}
                        </h2>
                        <p className="text-xs text-zinc-500">
                            Informasi ini akan ditampilkan pada galeri aktifitas di halaman publik Tentang Kami.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="bg-white border border-zinc-200 rounded-xl p-6 shadow-2xs space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                                Judul Kegiatan <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Contoh: Grand Opening Cabang Sudirman Pekanbaru"
                                className={`w-full px-3.5 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 ${
                                    errors.title ? 'border-red-500 bg-red-50/30' : 'border-zinc-300 bg-zinc-50/50'
                                }`}
                                required
                            />
                            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
                        </div>

                        {/* Category & Date Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                                    Kategori Kegiatan <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-zinc-800"
                                        required
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {errors.category && <p className="text-xs text-red-600 mt-1">{errors.category}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                                    Tanggal Acara / Kegiatan
                                </label>
                                <input
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-zinc-800"
                                />
                                {errors.event_date && <p className="text-xs text-red-600 mt-1">{errors.event_date}</p>}
                            </div>
                        </div>

                        {/* Image Upload Area */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                                Foto Dokumentasi <span className="text-red-500">*</span>
                            </label>
                            
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                                {/* Upload Box */}
                                <div className="md:col-span-7">
                                    <label className="border-2 border-dashed border-zinc-300 hover:border-zinc-500 rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer bg-zinc-50/50 hover:bg-zinc-50 transition text-center group">
                                        <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-zinc-600 transition mb-2" />
                                        <p className="text-xs font-semibold text-zinc-700">
                                            Klik untuk upload foto kegiatan
                                        </p>
                                        <p className="text-[11px] text-zinc-400 mt-1">
                                            PNG, JPG, WebP hingga 5MB (Rekomendasi rasio 16:9 atau 16:10)
                                        </p>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                    </label>

                                    {/* Or Enter Image URL / Path */}
                                    <div className="mt-3">
                                        <span className="text-[11px] font-medium text-zinc-400 block mb-1">
                                            Atau masukkan path gambar statis:
                                        </span>
                                        <input
                                            type="text"
                                            value={data.image_path}
                                            onChange={(e) => {
                                                setData('image_path', e.target.value);
                                                setPreviewUrl(e.target.value);
                                            }}
                                            placeholder="/assets/images/gallery/opening_sudirman.webp"
                                            className="w-full px-3 py-2 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                        />
                                    </div>
                                    {errors.image_file && <p className="text-xs text-red-600 mt-1">{errors.image_file}</p>}
                                </div>

                                {/* Preview Card */}
                                <div className="md:col-span-5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-center">
                                    <span className="text-[11px] font-semibold text-zinc-500 block mb-2 uppercase tracking-wider">
                                        Preview Foto
                                    </span>
                                    {previewUrl ? (
                                        <div className="aspect-[16/10] rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100">
                                            <img
                                                src={previewUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = '/assets/images/placeholder-activity.webp';
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div className="aspect-[16/10] rounded-lg border border-dashed border-zinc-300 flex flex-col items-center justify-center text-zinc-400">
                                            <ImageIcon className="w-8 h-8 stroke-[1.5] text-zinc-300 mb-1" />
                                            <span className="text-[11px]">Belum ada gambar terpilih</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                                Deskripsi / Catatan Kegiatan
                            </label>
                            <textarea
                                rows={4}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Jelaskan secara ringkas kegiatan, lokasi, jumlah peserta, atau poin penting..."
                                className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-zinc-800"
                            />
                            {errors.description && <p className="text-xs text-red-600 mt-1">{errors.description}</p>}
                        </div>

                        {/* Options: Status & Sort Order */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-zinc-200">
                            <div>
                                <label className="block text-xs font-semibold text-zinc-800 uppercase tracking-wider mb-1.5">
                                    Urutan Tampil (Sort Order)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.sort_order}
                                    onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 text-zinc-800"
                                />
                                <span className="text-[11px] text-zinc-400 mt-1 block">
                                    Angka lebih kecil tampil lebih dulu (prioritas).
                                </span>
                            </div>

                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-3 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="w-4 h-4 text-zinc-900 rounded border-zinc-300 focus:ring-zinc-900"
                                    />
                                    <div>
                                        <span className="text-xs font-semibold text-zinc-800 block">
                                            Publikasikan Dokumentasi
                                        </span>
                                        <span className="text-[11px] text-zinc-400 block">
                                            Jika dicentang, kegiatan akan langsung tampil pada halaman publik.
                                        </span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Submit Actions */}
                    <div className="flex items-center justify-end gap-3">
                        <Link
                            href="/admin/activities"
                            className="px-4 py-2.5 text-xs font-semibold text-zinc-700 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition"
                        >
                            Batal
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition shadow-xs disabled:opacity-50"
                        >
                            <Check className="w-4 h-4" />
                            {isEdit ? 'Simpan Perubahan' : 'Terbitkan Kegiatan'}
                        </button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
