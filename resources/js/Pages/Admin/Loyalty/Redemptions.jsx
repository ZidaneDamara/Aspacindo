import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Gift, Clock, CheckCircle2 } from 'lucide-react';

export default function Redemptions({ redemptions }) {
    const handleStatusChange = (id, newStatus) => {
        router.post(`/admin/loyalty/redemptions/${id}/status`, { status: newStatus }, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Kelola Antrean Klaim Hadiah Member">
            <Head title="Antrean Klaim Reward | Admin" />

            <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Antrean Penukaran Hadiah ({redemptions.total})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Verifikasi klaim voucher, diskon servis, dan merchandise yang ditukarkan member loyalty.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Tanggal Klaim</th>
                                    <th className="px-4 py-3">Member &amp; WhatsApp</th>
                                    <th className="px-4 py-3">Item Hadiah Ditukar</th>
                                    <th className="px-4 py-3">Poin Ditukar</th>
                                    <th className="px-4 py-3 text-right">Update Status Klaim</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {redemptions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <Gift className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada antrean penukaran hadiah</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Penukaran hadiah yang diajukan member melalui portal loyalty akan muncul di sini untuk diproses kasir.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    redemptions.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3 font-mono text-zinc-600">
                                                {new Date(item.redeemed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-zinc-900">
                                                {item.loyalty_member?.user?.name}
                                                <span className="block text-[11px] text-zinc-500 font-mono font-normal">
                                                    {item.loyalty_member?.phone_number}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-zinc-900">{item.reward?.name}</td>
                                            <td className="px-4 py-3 font-mono font-bold text-zinc-900">
                                                -{item.points_spent} Poin
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <select
                                                    value={item.status}
                                                    onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                    className="text-xs border border-zinc-300 rounded-lg py-1 px-2.5 font-medium focus:ring-1 focus:ring-zinc-900 bg-white"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved (Disetujui Kasir)</option>
                                                    <option value="fulfilled">Fulfilled (Hadiah Diserahkan)</option>
                                                    <option value="rejected">Rejected (Dibatalkan)</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {redemptions.links && <Pagination links={redemptions.links} />}
            </div>
        </AdminLayout>
    );
}
