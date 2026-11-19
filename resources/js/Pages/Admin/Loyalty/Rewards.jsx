import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Gift, Edit2, Trash2, Plus, Sparkles, X } from 'lucide-react';

export default function Rewards({ rewards = [] }) {
    const [editingReward, setEditingReward] = useState(null);

    const { data, setData, post, put, processing, reset } = useForm({
        name: '',
        description: '',
        image: '',
        points_cost: 100,
        reward_type: 'service_discount',
        stock_quantity: 100,
        is_active: true,
    });

    const handleEdit = (reward) => {
        setEditingReward(reward);
        setData({
            name: reward.name,
            description: reward.description,
            image: reward.image || '',
            points_cost: reward.points_cost,
            reward_type: reward.reward_type,
            stock_quantity: reward.stock_quantity ?? '',
            is_active: reward.is_active,
        });
    };

    const handleCancel = () => {
        setEditingReward(null);
        reset();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (editingReward) {
            put(`/admin/loyalty/rewards/${editingReward.id}`, {
                onSuccess: () => {
                    setEditingReward(null);
                    reset();
                },
            });
        } else {
            post('/admin/loyalty/rewards', {
                onSuccess: () => reset(),
            });
        }
    };

    const handleDelete = (id, name) => {
        if (confirm(`Hapus item hadiah "${name || 'ini'}"?`)) {
            router.delete(`/admin/loyalty/rewards/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Katalog Hadiah Loyalty">
            <Head title="Katalog Hadiah Reward | Admin" />

            <div className="space-y-6">
                <div className="border-b border-zinc-200 pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                        Katalog Hadiah Loyalty ({rewards.length})
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        Kelola katalog reward yang dapat ditukarkan konsumen dengan saldo poin loyalitas.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Form Add / Edit */}
                    <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                        <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                            <h3 className="font-bold text-zinc-900 text-sm">
                                {editingReward ? `Edit: ${editingReward.name}` : 'Tambah Hadiah Baru'}
                            </h3>
                            {editingReward && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleFormSubmit} className="space-y-3.5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Nama Hadiah</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Contoh: Voucher Diskon Servis 50K"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Biaya Poin (Cost)</label>
                                <input
                                    type="number"
                                    required
                                    value={data.points_cost}
                                    onChange={(e) => setData('points_cost', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Tipe Hadiah</label>
                                <select
                                    value={data.reward_type}
                                    onChange={(e) => setData('reward_type', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                >
                                    <option value="service_discount">Diskon Jasa Servis</option>
                                    <option value="free_oil_change">Gratis Oli Mesin Yamalube</option>
                                    <option value="sparepart_voucher">Voucher Spare Part</option>
                                    <option value="merchandise">Merchandise &amp; Helm</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Stok Tersedia</label>
                                <input
                                    type="number"
                                    placeholder="Kosongkan jika unlimited"
                                    value={data.stock_quantity}
                                    onChange={(e) => setData('stock_quantity', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Deskripsi Hadiah</label>
                                <textarea
                                    rows="3"
                                    required
                                    placeholder="Syarat & ketentuan penukaran hadiah..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>

                            <div className="flex gap-2 pt-2">
                                {editingReward && (
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="w-1/3 border border-zinc-200 text-zinc-700 hover:bg-zinc-50 font-semibold text-xs py-2.5 rounded-lg transition"
                                    >
                                        Batal
                                    </button>
                                )}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-xs disabled:opacity-50"
                                >
                                    {editingReward ? 'Simpan Perubahan' : 'Tambah Hadiah'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Listing Table */}
                    <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-zinc-600">
                                <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                    <tr>
                                        <th className="px-4 py-3">Nama Hadiah</th>
                                        <th className="px-4 py-3">Biaya Poin</th>
                                        <th className="px-4 py-3">Tipe</th>
                                        <th className="px-4 py-3">Stok</th>
                                        <th className="px-4 py-3 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200">
                                    {rewards.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="text-center py-16 px-4">
                                                <div className="flex flex-col items-center justify-center text-center">
                                                    <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                        <Gift className="w-6 h-6 text-zinc-400" />
                                                    </div>
                                                    <h3 className="text-sm font-semibold text-zinc-900">Belum ada item hadiah</h3>
                                                    <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                        Gunakan formulir di sebelah kiri untuk menambahkan reward pertama.
                                                    </p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        rewards.map((reward) => (
                                            <tr key={reward.id} className="hover:bg-zinc-50/60 transition-colors">
                                                <td className="px-4 py-3 font-semibold text-zinc-900">{reward.name}</td>
                                                <td className="px-4 py-3 font-mono font-bold text-zinc-900">
                                                    {reward.points_cost} Poin
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 uppercase">
                                                        {reward.reward_type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 font-mono text-zinc-600">
                                                    {reward.stock_quantity ?? 'Unlimited'}
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="inline-flex items-center justify-end gap-1">
                                                        <button
                                                            type="button"
                                                            onClick={() => handleEdit(reward)}
                                                            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-2xs"
                                                            title="Edit Hadiah"
                                                        >
                                                            <Edit2 className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(reward.id, reward.name)}
                                                            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-2xs"
                                                            title="Hapus Hadiah"
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
            </div>
        </AdminLayout>
    );
}
