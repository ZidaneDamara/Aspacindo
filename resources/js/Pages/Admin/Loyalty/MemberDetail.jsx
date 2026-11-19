import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ChevronLeft, Sliders, History, User } from 'lucide-react';

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
        <AdminLayout title={`Audit Member: ${member.user?.name}`}>
            <Head title={`Audit Member ${member.user?.name} | Admin`} />

            <div className="space-y-6">
                <div>
                    <Link
                        href="/admin/loyalty/members"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition mb-3"
                    >
                        <ChevronLeft className="w-3.5 h-3.5" />
                        Kembali ke Daftar Member
                    </Link>
                </div>

                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <span className="text-[10px] font-semibold text-zinc-800 bg-zinc-100 border border-zinc-200 px-2.5 py-0.5 rounded-full uppercase">
                            TIER {member.tier}
                        </span>
                        <h2 className="text-xl font-bold text-zinc-900 mt-2">{member.user?.name}</h2>
                        <p className="text-xs text-zinc-500 font-mono mt-0.5">Kode Member: {member.member_code} &bull; HP: {member.phone_number}</p>
                    </div>

                    <div className="text-left md:text-right">
                        <span className="text-xs text-zinc-500 font-semibold uppercase block">Saldo Poin Utama</span>
                        <span className="text-2xl font-bold font-mono text-zinc-900">
                            {new Intl.NumberFormat('id-ID').format(member.points_balance)} POIN
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Manual Point Adjustment Form */}
                    <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                        <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-200 pb-3">
                            <Sliders className="w-4 h-4 text-zinc-500" />
                            Penyesuaian Poin Manual
                        </h3>
                        <form onSubmit={handleAdjustSubmit} className="space-y-3.5">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Jumlah Poin (+ / -)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="Contoh: 100 atau -50"
                                    value={data.points}
                                    onChange={(e) => setData('points', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Tipe Penyesuaian</label>
                                <select
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                >
                                    <option value="adjustment">Adjustment (Koreksi Sistem)</option>
                                    <option value="earn">Earn (Bonus Poin Manual)</option>
                                    <option value="redeem">Redeem (Pengurangan Poin)</option>
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-zinc-700 uppercase">Alasan / Catatan Audit</label>
                                <textarea
                                    rows="3"
                                    required
                                    placeholder="Alasan penyesuaian saldo poin..."
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs py-2.5 rounded-lg transition shadow-xs disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan...' : 'Simpan Penyesuaian'}
                            </button>
                        </form>
                    </div>

                    {/* Full Transaction Audit History */}
                    <div className="lg:col-span-8 bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                        <div className="p-4 border-b border-zinc-200">
                            <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider flex items-center gap-1.5">
                                <History className="w-4 h-4 text-zinc-500" />
                                Riwayat Mutasi Poin Konsumen
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs text-zinc-600">
                                <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                    <tr>
                                        <th className="px-4 py-3">Tanggal</th>
                                        <th className="px-4 py-3">Tipe</th>
                                        <th className="px-4 py-3">Sumber</th>
                                        <th className="px-4 py-3">Deskripsi</th>
                                        <th className="px-4 py-3">Staff</th>
                                        <th className="px-4 py-3 text-right">Poin</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200">
                                    {(!member.point_transactions || member.point_transactions.length === 0) ? (
                                        <tr>
                                            <td colSpan="6" className="text-center py-12 text-zinc-400">
                                                Belum ada riwayat transaksi poin untuk member ini.
                                            </td>
                                        </tr>
                                    ) : (
                                        member.point_transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-zinc-50/60 transition-colors">
                                                <td className="px-4 py-3 font-mono text-zinc-500">
                                                    {new Date(tx.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 uppercase">
                                                        {tx.type}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-zinc-700">{tx.source}</td>
                                                <td className="px-4 py-3 text-zinc-600 max-w-xs">{tx.description}</td>
                                                <td className="px-4 py-3 text-zinc-500">{tx.creator?.name || 'System'}</td>
                                                <td className={`px-4 py-3 font-mono font-bold text-right ${tx.points > 0 ? 'text-zinc-900' : 'text-zinc-500'}`}>
                                                    {tx.points > 0 ? `+${tx.points}` : tx.points}
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
