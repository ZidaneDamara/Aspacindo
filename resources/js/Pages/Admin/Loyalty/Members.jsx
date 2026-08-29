import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Members({ members, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get('/admin/loyalty/members', { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Kelola Member Aspacindo Loyalty">
            <div className="space-y-6">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:w-96">
                        <input
                            type="text"
                            placeholder="Cari Nama, HP, atau Kode ALC..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-xs border-slate-200 rounded-xl focus:ring-blue-500"
                        />
                        <button type="submit" className="bg-blue-600 text-white font-bold text-xs px-4 py-2 rounded-xl">
                            Cari
                        </button>
                    </form>

                    <Link
                        href="/admin/loyalty/point-input"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs uppercase px-4 py-2.5 rounded-xl shadow"
                    >
                        + Input Poin Off-Line Kasir
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Kode Member</th>
                                <th className="p-4">Nama Konsumen</th>
                                <th className="p-4">WhatsApp</th>
                                <th className="p-4">Tier</th>
                                <th className="p-4">Saldo Poin</th>
                                <th className="p-4 text-right">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {members.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-mono font-bold text-slate-900">{item.member_code}</td>
                                    <td className="p-4 font-bold text-slate-900">{item.user?.name}</td>
                                    <td className="p-4 font-mono text-slate-600">{item.phone_number}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                                            item.tier === 'Platinum' ? 'bg-slate-900 text-white' : item.tier === 'Gold' ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {item.tier}
                                        </span>
                                    </td>
                                    <td className="p-4 font-black text-blue-700">
                                        {new Intl.NumberFormat('id-ID').format(item.points_balance)} Poin
                                    </td>
                                    <td className="p-4 text-right">
                                        <Link href={`/admin/loyalty/members/${item.id}`} className="text-blue-600 font-bold hover:underline">
                                            Audit Poin &rarr;
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={members.links} />
            </div>
        </AdminLayout>
    );
}
