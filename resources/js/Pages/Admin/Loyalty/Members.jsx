import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Search, Plus, Award, ChevronRight, Users } from 'lucide-react';

export default function Members({ members, filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get('/admin/loyalty/members', { search }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Kelola Member Aspacindo Loyalty">
            <Head title="Member Loyalty Club | Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Member Aspacindo Loyalty Club ({members.total})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Kelola data konsumen terdaftar, saldo poin reward, histori transaksi servis, dan tier membership.
                        </p>
                    </div>

                    <Link
                        href="/admin/loyalty/point-input"
                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Input Poin Kasir
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-3">
                    <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full sm:max-w-md">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari Nama, No. HP, atau Kode ALC..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full text-xs pl-9 pr-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                        >
                            Cari
                        </button>
                    </form>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Kode Member</th>
                                    <th className="px-4 py-3">Nama Konsumen</th>
                                    <th className="px-4 py-3">WhatsApp</th>
                                    <th className="px-4 py-3">Tier</th>
                                    <th className="px-4 py-3">Saldo Poin</th>
                                    <th className="px-4 py-3 text-right">Detail</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {members.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <Users className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada member loyalty</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Pelanggan yang mendaftar atau melakukan transaksi servis/pembelian motor akan tercatat di sini.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    members.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3 font-mono font-semibold text-zinc-900">{item.member_code}</td>
                                            <td className="px-4 py-3 font-semibold text-zinc-900">{item.user?.name}</td>
                                            <td className="px-4 py-3 font-mono text-zinc-600">{item.phone_number}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                    item.tier === 'Platinum'
                                                        ? 'bg-zinc-900 text-white border-zinc-900'
                                                        : item.tier === 'Gold'
                                                        ? 'bg-zinc-800 text-zinc-100 border-zinc-800'
                                                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                                                }`}>
                                                    {item.tier}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono font-bold text-zinc-900">
                                                {new Intl.NumberFormat('id-ID').format(item.points_balance)} Poin
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Link
                                                    href={`/admin/loyalty/members/${item.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-950 transition"
                                                >
                                                    Audit Poin
                                                    <ChevronRight className="w-3.5 h-3.5" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {members.links && <Pagination links={members.links} />}
            </div>
        </AdminLayout>
    );
}
