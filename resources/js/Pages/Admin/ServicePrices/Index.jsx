import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Wrench, X } from 'lucide-react';

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
            <Head title="Kelola Biaya Service | Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Daftar Biaya Service Bengkel ({prices.length})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Kelola data tipe perbaikan dan tarif jasa servis resmi Yamaha (Moped, Sport, Matic, Matic Premium).
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleCreate}
                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Biaya Service
                    </button>
                </div>

                {/* Form Inline / Box when Creating or Editing */}
                {(isCreating || editingItem) && (
                    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                            <h3 className="text-sm font-bold text-zinc-900">
                                {editingItem ? `Edit Biaya Service: ${editingItem.repair_type}` : 'Tambah Biaya Service Baru'}
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsCreating(false);
                                    setEditingItem(null);
                                }}
                                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-700 uppercase block mb-1">Kategori Service</label>
                                    <select
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                    >
                                        <option value="Reguler">Reguler</option>
                                        <option value="Perbaikan Ringan">Perbaikan Ringan</option>
                                        <option value="Perbaikan Berat">Perbaikan Berat</option>
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase block mb-1">Nama Tipe Perbaikan</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Ganti Kampas Rem Cakram"
                                        value={data.repair_type}
                                        onChange={(e) => setData('repair_type', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-700 uppercase block mb-1">MOPED (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_moped}
                                        onChange={(e) => setData('price_moped', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-700 uppercase block mb-1">SPORT (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_sport}
                                        onChange={(e) => setData('price_sport', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-700 uppercase block mb-1">MATIC (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_matic}
                                        onChange={(e) => setData('price_matic', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-zinc-700 uppercase block mb-1">MATIC PREMIUM (Rp)</label>
                                    <input
                                        type="number"
                                        placeholder="Kosongkan jika N/A"
                                        value={data.price_matic_premium}
                                        onChange={(e) => setData('price_matic_premium', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreating(false);
                                        setEditingItem(null);
                                    }}
                                    className="px-4 py-2 border border-zinc-200 text-zinc-700 hover:bg-zinc-50 rounded-lg text-xs font-semibold transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-semibold transition shadow-xs disabled:opacity-50"
                                >
                                    {editingItem ? 'Simpan Perubahan' : 'Tambah Biaya'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Table of Service Prices */}
                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Tipe Perbaikan</th>
                                    <th className="px-4 py-3 text-right">Moped</th>
                                    <th className="px-4 py-3 text-right">Sport</th>
                                    <th className="px-4 py-3 text-right">Matic</th>
                                    <th className="px-4 py-3 text-right">Matic Premium</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {prices.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <Wrench className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada data tarif service</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Tambahkan tarif jasa servis berkala, ganti oli, servis injeksi, dan perbaikan berat.
                                                </p>
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={handleCreate}
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Tambah Tarif Service
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    prices.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-zinc-900">{item.repair_type}</td>
                                            <td className="px-4 py-3 font-mono text-right text-zinc-700">
                                                {item.price_moped ? `Rp ${item.price_moped.toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-right text-zinc-700">
                                                {item.price_sport ? `Rp ${item.price_sport.toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-right text-zinc-700">
                                                {item.price_matic ? `Rp ${item.price_matic.toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-right text-zinc-700">
                                                {item.price_matic_premium ? `Rp ${item.price_matic_premium.toLocaleString('id-ID')}` : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(item)}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-2xs"
                                                        title="Edit Tarif"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id)}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-2xs"
                                                        title="Hapus Tarif"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
