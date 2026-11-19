import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Building, Bike, Plus, Edit2, Trash2, MapPin } from 'lucide-react';

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
                    bg: 'bg-zinc-100 text-zinc-800 border-zinc-200',
                };
            case '2S':
                return {
                    label: '2S (Sales & Service)',
                    bg: 'bg-zinc-100 text-zinc-800 border-zinc-200',
                };
            default:
                return {
                    label: '3S (Dealer Utama)',
                    bg: 'bg-zinc-900 text-white border-zinc-900',
                };
        }
    };

    return (
        <AdminLayout title="Kelola Cabang Dealer &amp; Pos">
            <div className="space-y-6">
                {/* Branch Admin Context Banner */}
                {isBranchAdmin && userBranch && (
                    <div className="bg-zinc-950 text-zinc-100 p-5 rounded-xl border border-zinc-800 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider bg-zinc-800 border border-zinc-700 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Building className="w-3 h-3 text-zinc-400" />
                                Wilayah Penugasan: {userBranch.region}
                            </span>
                            <h3 className="text-base font-bold text-white">{userBranch.name}</h3>
                            <p className="text-xs text-zinc-400">
                                Anda dapat menginput cabang kecil (Pos / 1S / 2S) di wilayah Anda serta mengupdate harga OTR wilayah ini.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Link
                                href="/admin/motorcycles"
                                className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs px-3.5 py-2 rounded-lg transition"
                            >
                                <Bike className="w-4 h-4" />
                                Katalog &amp; OTR
                            </Link>
                            <Link
                                href="/admin/branches/create"
                                className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition border border-zinc-700"
                            >
                                <Plus className="w-4 h-4" />
                                Input Cabang
                            </Link>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            {isBranchAdmin && userBranch
                                ? `Daftar Cabang Wilayah ${userBranch.region} (${branches.total})`
                                : `Daftar Cabang Dealer (${branches.total})`}
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Klasifikasi dealer resmi 3S (Sales, Service, Sparepart), 2S (Sales &amp; Service), dan 1S (Sales)
                        </p>
                    </div>
                    <Link
                        href="/admin/branches/create"
                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Cabang Dealer
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs text-zinc-600">
                        <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                            <tr>
                                <th className="px-4 py-3">Nama Cabang</th>
                                <th className="px-4 py-3">Tipe Fasilitas</th>
                                <th className="px-4 py-3">Wilayah</th>
                                <th className="px-4 py-3">Alamat</th>
                                <th className="px-4 py-3">WhatsApp</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {branches.data.map((item) => {
                                const badge = getDealerBadge(item.dealer_type);
                                return (
                                    <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                        <td className="px-4 py-3 font-semibold text-zinc-900">{item.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.bg}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-zinc-800">{item.region}</td>
                                        <td className="px-4 py-3 text-zinc-500 max-w-xs truncate">{item.full_address}</td>
                                        <td className="px-4 py-3 font-mono font-medium">{item.whatsapp_number}</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                    item.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                }`}
                                            >
                                                {item.is_active ? 'Aktif' : 'Nonaktif'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="inline-flex items-center gap-1">
                                                <Link
                                                    href={`/admin/branches/${item.id}/edit`}
                                                    className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                                    title="Hapus"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
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
