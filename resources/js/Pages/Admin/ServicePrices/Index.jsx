import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ prices = [] }) {
    const [editingItem, setEditingItem] = useState(null);
    const [isCreating, setIsCreating] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        category: 'Reguler',
        repair_type: '',
        price_moped: '',
        price_sport: '',
        price_matic: '',
        price_matic_premium: '',
        sort_order: 0,
        is_active: true,
    });

    const handleCreate = () => {
        setEditingItem(null);
        reset();
        setIsCreating(true);
    };

    const handleEdit = (item) => {
        setIsCreating(false);
        setEditingItem(item);
        setData({
            category: item.category,
            repair_type: item.repair_type,
            price_moped: item.price_moped ?? '',
            price_sport: item.price_sport ?? '',
            price_matic: item.price_matic ?? '',
            price_matic_premium: item.price_matic_premium ?? '',
            sort_order: item.sort_order ?? 0,
            is_active: item.is_active ?? true,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingItem) {
            put(`/admin/service-prices/${editingItem.id}`, {
                onSuccess: () => {
                    setEditingItem(null);
                    reset();
                },
            });
        } else {
            post('/admin/service-prices', {
                onSuccess: () => {
                    setIsCreating(false);
                    reset();
                },
            });
        }
    };

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus data biaya service ini?')) {
            destroy(`/admin/service-prices/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Biaya Service Bengkel">
            <div className="space-y-6 font-sans">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Daftar Biaya Service Bengkel</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola data tipe perbaikan dan tarif biaya service (Moped, Sport, Matic, Matic Premium) secara dinamis.
                        </p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-sm"
                    >
                        + Tambah Biaya Service
                    </button>
                </div>

                {/* Form Modal / Inline Box when Creating or Editing */}
                {(isCreating || editingItem) && (
                    <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-md space-y-4">
                        <h3 className="text-base font-black text-blue-900 border-b border-slate-100 pb-3">
                            {editingItem ? `Edit Biaya Service: ${editingItem.repair_type}` : 'Tambah Biaya Service Baru'}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Kategori Service</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5"
                                    >
                                        <option value="Reguler">Reguler</option>
                                        <option value="Perbaikan Ringan">Perbaikan Ringan</option>
                                        <option value="Perbaikan Berat">Perbaikan Berat</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Nama Tipe Perbaikan</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Ganti Kampas Rem Cakram"
                                        value={data.repair_type}
                                        onChange={(e) => setData('repair_type', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Harga MOPED (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_moped}
                                        onChange={(e) => setData('price_moped', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Harga SPORT (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_sport}
                                        onChange={(e) => setData('price_sport', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Harga MATIC (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_matic}
                                        onChange={(e) => setData('price_matic', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-700 uppercase block mb-1">Harga MATIC PREMIUM (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_matic_premium}
                                        onChange={(e) => setData('price_matic_premium', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingItem(null);
                                    }}
                                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase"
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Tambah Data'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table of Service Prices */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white text-xs uppercase font-extrabold">
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Tipe Perbaikan</th>
                                <th className="p-4 text-center">Moped</th>
                                <th className="p-4 text-center">Sport</th>
                                <th className="p-4 text-center">Matic</th>
                                <th className="p-4 text-center">Matic Premium</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {prices.length > 0 ? (
                                prices.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">{item.repair_type}</td>
                                        <td className="p-4 text-center">{item.price_moped ? `Rp ${item.price_moped.toLocaleString('id-ID')}` : 'Rp ,-'}</td>
                                        <td className="p-4 text-center">{item.price_sport ? `Rp ${item.price_sport.toLocaleString('id-ID')}` : 'Rp ,-'}</td>
                                        <td className="p-4 text-center">{item.price_matic ? `Rp ${item.price_matic.toLocaleString('id-ID')}` : 'Rp ,-'}</td>
                                        <td className="p-4 text-center">{item.price_matic_premium ? `Rp ${item.price_matic_premium.toLocaleString('id-ID')}` : 'Rp ,-'}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="p-8 text-center text-slate-400">
                                        Belum ada data biaya service.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
