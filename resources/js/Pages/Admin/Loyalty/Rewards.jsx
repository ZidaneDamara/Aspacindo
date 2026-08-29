import React, { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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

    const handleDelete = (id) => {
        if (confirm('Hapus item hadiah ini?')) {
            router.delete(`/admin/loyalty/rewards/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Katalog Hadiah Loyalty">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Add / Edit */}
                <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-900 text-lg uppercase">
                        {editingReward ? 'Edit Item Hadiah' : 'Tambah Hadiah Baru'}
                    </h3>

                    <form onSubmit={handleFormSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Nama Hadiah</label>
                            <input
                                type="text"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Biaya Poin (Cost)</label>
                            <input
                                type="number"
                                required
                                value={data.points_cost}
                                onChange={(e) => setData('points_cost', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Tipe Hadiah</label>
                            <select
                                value={data.reward_type}
                                onChange={(e) => setData('reward_type', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            >
                                <option value="service_discount">Diskon Jasa Servis</option>
                                <option value="free_oil_change">Gratis Oli Mesin</option>
                                <option value="sparepart_voucher">Voucher Spare Part</option>
                                <option value="merchandise">Merchandise &amp; Helm</option>
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Stok Tersedia</label>
                            <input
                                type="number"
                                placeholder="Kosongkan jika unlimited"
                                value={data.stock_quantity}
                                onChange={(e) => setData('stock_quantity', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi Hadiah</label>
                            <textarea
                                rows="3"
                                required
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl transition"
                        >
                            {editingReward ? 'Simpan Perubahan' : 'Tambah Hadiah'}
                        </button>
                    </form>
                </div>

                {/* Listing Table */}
                <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-900 text-lg uppercase">Katalog Hadiah Aktif</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-100 uppercase font-black">
                                <tr>
                                    <th className="p-3">Nama Hadiah</th>
                                    <th className="p-3">Biaya Poin</th>
                                    <th className="p-3">Tipe</th>
                                    <th className="p-3">Stok</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {rewards.map((reward) => (
                                    <tr key={reward.id}>
                                        <td className="p-3 font-bold text-slate-900">{reward.name}</td>
                                        <td className="p-3 font-black text-amber-600">{reward.points_cost} Poin</td>
                                        <td className="p-3 uppercase text-[10px] font-bold">{reward.reward_type}</td>
                                        <td className="p-3">{reward.stock_quantity ?? 'Unlimited'}</td>
                                        <td className="p-3 text-right space-x-2">
                                            <button onClick={() => handleEdit(reward)} className="text-blue-600 font-bold hover:underline">Edit</button>
                                            <button onClick={() => handleDelete(reward.id)} className="text-red-600 font-bold hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
