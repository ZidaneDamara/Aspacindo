import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Redemptions({ redemptions }) {
    const handleStatusChange = (id, newStatus) => {
        router.post(`/admin/loyalty/redemptions/${id}/status`, { status: newStatus });
    };

    return (
        <AdminLayout title="Kelola Antrean Klaim Hadiah Member">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">Antrean Penukaran Hadiah ({redemptions.total})</h2>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Tanggal Klaim</th>
                                <th className="p-4">Member &amp; WhatsApp</th>
                                <th className="p-4">Item Hadiah Ditukar</th>
                                <th className="p-4">Poin Ditukar</th>
                                <th className="p-4">Update Status Klaim</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {redemptions.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-medium">{new Date(item.redeemed_at).toLocaleDateString('id-ID')}</td>
                                    <td className="p-4 font-bold text-slate-900">
                                        {item.loyalty_member?.user?.name}
                                        <span className="block text-[11px] text-slate-500 font-mono">{item.loyalty_member?.phone_number}</span>
                                    </td>
                                    <td className="p-4 font-bold text-blue-700">{item.reward?.name}</td>
                                    <td className="p-4 font-black text-amber-600">-{item.points_spent} Poin</td>
                                    <td className="p-4">
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                            className="text-xs border-slate-200 rounded-xl p-2 font-bold focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="approved">Approved (Disetujui Kasir)</option>
                                            <option value="fulfilled">Fulfilled (Hadiah Diserahkan)</option>
                                            <option value="rejected">Rejected (Dibatalkan)</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={redemptions.links} />
            </div>
        </AdminLayout>
    );
}
