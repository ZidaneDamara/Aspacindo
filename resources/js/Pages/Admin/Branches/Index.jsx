import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ branches, userBranch = null, isBranchAdmin = false }) {
    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus cabang "${name}"?`)) {
            router.delete(`/admin/branches/${id}`);
        }
    };

    const getDealerBadge = (type) => {
        switch (type) {
            case '1S':
                return {
                    label: '1S (Sales)',
                    bg: 'bg-purple-100 text-purple-800 border-purple-200',
                };
            case '2S':
                return {
                    label: '2S (Sales & Service)',
                    bg: 'bg-cyan-100 text-cyan-800 border-cyan-200',
                };
            default:
                return {
                    label: '3S (Dealer Utama)',
                    bg: 'bg-blue-100 text-blue-900 border-blue-200',
                };
        }
    };

    return (
        <AdminLayout title="Kelola Cabang Dealer &amp; Pos">
            <div className="space-y-6">
                {/* Branch Admin Context Banner */}
                {isBranchAdmin && userBranch && (
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-3xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                                🏢 Wilayah Penugasan: {userBranch.region}
                            </span>
                            <h3 className="text-base font-extrabold">{userBranch.name}</h3>
                            <p className="text-xs text-blue-200">
                                Anda dapat menginput cabang kecil (Pos / 1S / 2S) di wilayah Anda serta mengupdate harga OTR wilayah ini.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/branch-prices"
                                className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl shadow transition"
                            >
                                💰 OTR Wilayah &rarr;
                            </Link>
                            <Link
                                href="/admin/branches/create"
                                className="bg-white hover:bg-slate-100 text-blue-900 font-extrabold text-xs uppercase px-4 py-2.5 rounded-xl shadow transition"
                            >
                                + Input Cabang Kecil
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            {isBranchAdmin && userBranch
                                ? `Daftar Cabang Wilayah ${userBranch.region} (${branches.total})`
                                : `Daftar Cabang Dealer (${branches.total})`}
                        </h2>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Klasifikasi dealer 3S (Sales, Service, Sparepart), 2S (Sales, Service), dan 1S (Sales)
                        </p>
                    </div>
                    <Link
                        href="/admin/branches/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow transition"
                    >
                        + Tambah Cabang Dealer
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Nama Cabang</th>
                                <th className="p-4">Tipe Fasilitas</th>
                                <th className="p-4">Wilayah</th>
                                <th className="p-4">Alamat</th>
                                <th className="p-4">WhatsApp</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {branches.data.map((item) => {
                                const badge = getDealerBadge(item.dealer_type);
                                return (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="p-4 font-bold text-slate-900">{item.name}</td>
                                        <td className="p-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="p-4 font-semibold text-blue-600">{item.region}</td>
                                        <td className="p-4 text-slate-500 max-w-xs truncate">{item.full_address}</td>
                                        <td className="p-4 font-mono font-medium">{item.whatsapp_number}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                    item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                                }`}
                                            >
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Link
                                                href={`/admin/branches/${item.id}/edit`}
                                                className="text-blue-600 font-bold hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id, item.name)}
                                                className="text-red-600 font-bold hover:underline"
                                            >
                                                Hapus
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {branches.links && <Pagination links={branches.links} />}
            </div>
        </AdminLayout>
    );
}
