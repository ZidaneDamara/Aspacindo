import React, { useState } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ motorcycle = null }) {
    const isEditing = !!motorcycle;

    const [imagePreview, setImagePreview] = useState(motorcycle?.primary_image?.image_path || '');
    const [colors, setColors] = useState(
        motorcycle?.colors?.length > 0
            ? motorcycle.colors.map(c => ({
                id: c.id,
                color_name: c.color_name,
                hex_code: c.hex_code,
                image_path: c.image_path,
                color_image_file: null,
                preview: c.image_path,
            }))
            : [{ color_name: 'Standard Color', hex_code: '#1A1A1A', image_path: '', color_image_file: null, preview: '' }]
    );

    const { data, setData, processing, errors } = useForm({
        name: motorcycle?.name || '',
        category: motorcycle?.category || 'MAXi',
        price_otr: motorcycle?.price_otr || '',
        short_description: motorcycle?.short_description || '',
        image_file: null,
        image_path: motorcycle?.primary_image?.image_path || '',
        is_featured: motorcycle ? (motorcycle.is_featured ?? false) : false,
        is_active: motorcycle ? (motorcycle.is_active ?? true) : true,
    });

    const handlePrimaryFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddColor = () => {
        setColors([
            ...colors,
            { color_name: '', hex_code: '#000000', image_path: '', color_image_file: null, preview: '' }
        ]);
    };

    const handleRemoveColor = (index) => {
        setColors(colors.filter((_, i) => i !== index));
    };

    const handleColorChange = (index, field, value) => {
        const updated = [...colors];
        updated[index][field] = value;
        setColors(updated);
    };

    const handleColorFileChange = (index, file) => {
        if (file) {
            const updated = [...colors];
            updated[index].color_image_file = file;
            updated[index].preview = URL.createObjectURL(file);
            setColors(updated);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('category', data.category);
        formData.append('price_otr', data.price_otr);
        formData.append('short_description', data.short_description || '');
        formData.append('is_featured', data.is_featured ? '1' : '0');
        formData.append('is_active', data.is_active ? '1' : '0');
        formData.append('image_path', data.image_path || '');

        if (data.image_file) {
            formData.append('image_file', data.image_file);
        }

        colors.forEach((c, idx) => {
            formData.append(`colors[${idx}][color_name]`, c.color_name);
            formData.append(`colors[${idx}][hex_code]`, c.hex_code);
            formData.append(`colors[${idx}][image_path]`, c.image_path || '');
            if (c.color_image_file) {
                formData.append(`colors[${idx}][color_image_file]`, c.color_image_file);
            }
        });

        if (isEditing) {
            formData.append('_method', 'PUT');
            router.post(`/admin/motorcycles/${motorcycle.id}`, formData, {
                forceFormData: true,
            });
        } else {
            router.post('/admin/motorcycles', formData, {
                forceFormData: true,
            });
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit ${motorcycle.name}` : 'Tambah Motor Baru'}>
            <div className="max-w-4xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 font-sans">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            {isEditing ? `Edit Data ${motorcycle.name}` : 'Form Tambah Motor Baru'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">Upload gambar utama, tentukan varian warna, harga OTR, dan kategori motor.</p>
                    </div>
                    <Link href="/admin/motorcycles" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        &larr; Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Model & Price */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Nama Model Motor</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Yamaha NMAX Turbo 155"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Kategori Motor</label>
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
                            <label className="text-xs font-bold text-slate-700 uppercase">Harga OTR Pekanbaru (Rp)</label>
                            <input
                                type="number"
                                required
                                placeholder="Contoh: 37750000"
                                value={data.price_otr}
                                onChange={(e) => setData('price_otr', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 font-bold text-blue-900"
                            />
                            {errors.price_otr && <p className="text-xs text-red-500">{errors.price_otr}</p>}
                        </div>
                    </div>

                    {/* Primary Image Upload Field */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-3">
                        <label className="text-xs font-extrabold text-slate-900 uppercase tracking-wider block">
                            📸 Upload Gambar Utama Motor (Dari Perangkat / File Laptop)
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handlePrimaryFileChange}
                            className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                        />
                        <p className="text-[11px] text-slate-500">Format yang didukung: JPG, PNG, WEBP, GIF. Maksimal 5MB.</p>

                        {imagePreview && (
                            <div className="pt-2 flex items-center gap-4">
                                <div className="w-24 h-24 bg-white p-2 rounded-2xl border border-slate-300 shadow-sm flex items-center justify-center overflow-hidden">
                                    <img src={imagePreview} alt="Preview Motor" className="max-h-full object-contain" />
                                </div>
                                <div className="text-xs space-y-1">
                                    <p className="font-bold text-slate-800">Preview Gambar Utama</p>
                                    <p className="text-slate-500 truncate max-w-xs">{data.image_path || 'File Baru Diupload'}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Colors Variant Management */}
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                                    🎨 Varian Warna &amp; Upload Foto Warna Motor
                                </h3>
                                <p className="text-[11px] text-slate-500">Tambahkan nama warna, warna hex, dan foto motor untuk tiap varian.</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddColor}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition"
                            >
                                + Tambah Warna
                            </button>
                        </div>

                        <div className="space-y-3">
                            {colors.map((c, idx) => (
                                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 shadow-sm">
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                        <div className="sm:col-span-4 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-600 uppercase">Nama Warna</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Contoh: Magma Black"
                                                value={c.color_name}
                                                onChange={(e) => handleColorChange(idx, 'color_name', e.target.value)}
                                                className="w-full text-xs border-slate-200 rounded-xl p-2"
                                            />
                                        </div>

                                        <div className="sm:col-span-3 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-600 uppercase">Kode Warna (Hex)</label>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="color"
                                                    value={c.hex_code}
                                                    onChange={(e) => handleColorChange(idx, 'hex_code', e.target.value)}
                                                    className="w-8 h-8 rounded-lg border-0 p-0 cursor-pointer"
                                                />
                                                <input
                                                    type="text"
                                                    value={c.hex_code}
                                                    onChange={(e) => handleColorChange(idx, 'hex_code', e.target.value)}
                                                    className="w-full text-xs border-slate-200 rounded-xl p-2 font-mono uppercase"
                                                />
                                            </div>
                                        </div>

                                        <div className="sm:col-span-4 space-y-1">
                                            <label className="text-[10px] font-bold text-slate-600 uppercase">Upload Foto Warna (Opsional)</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleColorFileChange(idx, e.target.files[0])}
                                                className="w-full text-[10px] text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded-lg file:border-0 file:bg-slate-200"
                                            />
                                        </div>

                                        <div className="sm:col-span-1 flex justify-end pt-3 sm:pt-0">
                                            {colors.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveColor(idx)}
                                                    className="text-red-500 hover:text-red-700 font-extrabold text-sm p-1"
                                                    title="Hapus Warna"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {c.preview && (
                                        <div className="flex items-center gap-2 pt-1">
                                            <img src={c.preview} alt={c.color_name} className="w-10 h-10 object-contain rounded border p-0.5 bg-slate-50" />
                                            <span className="text-[10px] text-slate-500 font-medium">Preview Gambar Varian {c.color_name}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Short Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi Singkat Motor</label>
                        <textarea
                            rows="3"
                            placeholder="Tuliskan deskripsi keunggulan motor..."
                            value={data.short_description}
                            onChange={(e) => setData('short_description', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    {/* Options Toggles */}
                    <div className="flex flex-wrap gap-6 pt-2">
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan Data Motor' : 'Tambah Motor Baru')}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
