import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function MemberDetail({ member }) {
    const { data, setData, post, processing, reset } = useForm({
        points: '',
        type: 'adjustment',
        description: '',
    });

    const handleAdjustSubmit = (e) => {
        e.preventDefault();
        post(`/admin/loyalty/members/${member.id}/adjust-points`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <AdminLayout title={`Audit Member ${member.user?.name}`}>
            <div className="space-y-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <span className="text-[10px] font-black text-amber-700 bg-amber-100 px-3 py-1 rounded-full uppercase">
                            TIER {member.tier}
                        </span>
                        <h2 className="text-2xl font-black text-slate-900 mt-2">{member.user?.name}</h2>
                        <p className="text-xs text-slate-500 font-mono">Kode Member: {member.member_code} | HP: {member.phone_number}</p>
                    </div>

                    <div className="text-right">
                        <span className="text-xs text-slate-500 font-bold uppercase block">Saldo Poin Utama</span>
                        <span className="text-3xl font-black text-blue-700">{member.points_balance} POIN</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Manual Point Adjustment Form */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-black text-slate-900 text-base uppercase">Penyesuaian Poin Manual</h3>
                        <form onSubmit={handleAdjustSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Jumlah Poin (+ / -)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="Contoh: 100 atau -50"
                                    value={data.points}
                                    onChange={(e) => setData('points', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Tipe Penyesuaian</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                >
                                    <option value="adjustment">Adjustment (Koreksi System)</option>
                                    <option value="earn">Earn (Bonus Poin Manual)</option>
                                    <option value="redeem">Redeem (Pengurangan Poin)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Alasan Audit Note</label>
                                <textarea
                                    rows="3"
                                    required
                                    placeholder="Alasan penyesuaian saldo poin..."
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
                                Simpan Penyesuaian &rarr;
                            </button>
                        </form>
                    </div>

                    {/* Full Transaction Audit History */}
                    <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                        <h3 className="font-black text-slate-900 text-base uppercase">Riwayat Audit Transaksi Poin</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-slate-700">
                                <thead className="bg-slate-100 uppercase font-black">
                                    <tr>
                                        <th className="p-3">Tanggal</th>
                                        <th className="p-3">Tipe</th>
                                        <th className="p-3">Sumber</th>
                                        <th className="p-3">Deskripsi</th>
                                        <th className="p-3">Staff</th>
                                        <th className="p-3 text-right">Poin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {member.point_transactions?.map((tx) => (
                                        <tr key={tx.id}>
                                            <td className="p-3">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                            <td className="p-3 font-bold uppercase">{tx.type}</td>
                                            <td className="p-3">{tx.source}</td>
                                            <td className="p-3 text-slate-600">{tx.description}</td>
                                            <td className="p-3">{tx.creator?.name || 'System'}</td>
                                            <td className={`p-3 font-bold text-right ${tx.points > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                {tx.points > 0 ? `+${tx.points}` : tx.points}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
