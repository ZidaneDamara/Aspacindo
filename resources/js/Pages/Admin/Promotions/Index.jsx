import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Plus, Edit2, Trash2, Megaphone, Calendar } from 'lucide-react';

export default function Index({ promotions }) {
    const handleDelete = (id, title) => {
        if (confirm(`Apakah Anda yakin ingin menghapus promo "${title || 'ini'}"?`)) {
            router.delete(`/admin/promotions/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Banner Promo Spesial">
            <Head title="Kelola Banner Promo | Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Banner Promo ({promotions.total})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Kelola program promosi bulanan, promo DP ringan, diskon angsuran, dan voucher servis Yamaha.
                        </p>
                    </div>
                    <Link
                        href="/admin/promotions/create"
                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Promo Baru
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Judul Promo</th>
                                    <th className="px-4 py-3">Tgl Mulai</th>
                                    <th className="px-4 py-3">Tgl Berakhir</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {promotions.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <Megaphone className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada promo aktif</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Tambahkan penawaran spesial, cashback, diskon servis, atau promo DP murah motor Yamaha.
                                                </p>
                                                <div className="mt-4">
                                                    <Link
                                                        href="/admin/promotions/create"
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Tambah Promo Baru
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    promotions.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-zinc-900 max-w-sm truncate">
                                                {item.title}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-zinc-600">
                                                {item.start_date || 'Hari ini'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-zinc-600">
                                                {item.end_date || 'Akhir Bulan'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                        item.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                            : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                    }`}
                                                >
                                                    {item.is_active ? 'Aktif' : 'Nonaktif'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/promotions/${item.id}/edit`}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-2xs"
                                                        title="Edit Promo"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.title)}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-2xs"
                                                        title="Hapus Promo"
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

                {promotions.links && <Pagination links={promotions.links} />}
            </div>
        </AdminLayout>
    );
}
