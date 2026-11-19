import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Plus, Edit2, Trash2, Wrench, Sparkles } from 'lucide-react';

export default function Index({ spareparts = { data: [], links: [] } }) {
    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus sparepart "${name}"?`)) {
            router.delete(`/admin/spareparts/${id}`);
        }
    };

    const formatPrice = (val) => {
        if (!val || val === 0) return 'Rp 0';
        return `Rp ${val.toLocaleString('id-ID')}`;
    };

    return (
        <AdminLayout title="Kelola Produk Sparepart">
            <Head title="Katalog Sparepart | Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Katalog Sparepart &amp; Suku Cadang ({spareparts.data?.length || 0})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Kelola data oli Yamalube, ban, busi, pengereman, kelistrikan, dan suku cadang original Yamaha Genuine Parts (YGP).
                        </p>
                    </div>
                    <Link
                        href="/admin/spareparts/create"
                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Sparepart Baru
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3 w-16">Foto</th>
                                    <th className="px-4 py-3">Nama Produk</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Harga (Rp)</th>
                                    <th className="px-4 py-3 text-center">Status NEW</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {spareparts.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <Wrench className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada data sparepart</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Tambahkan katalog oli Yamalube, aki, ban, filter udara, dan komponen suku cadang resmi Yamaha.
                                                </p>
                                                <div className="mt-4">
                                                    <Link
                                                        href="/admin/spareparts/create"
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Tambah Sparepart
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    spareparts.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3">
                                                <img
                                                    src={item.image_url || 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=200&q=80'}
                                                    alt={item.name}
                                                    className="w-10 h-10 object-contain rounded-md border border-zinc-200 bg-zinc-50 p-1"
                                                />
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-zinc-900">{item.name}</td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-mono font-semibold text-zinc-900">
                                                {formatPrice(item.price)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {item.is_new ? (
                                                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-zinc-900 text-white">
                                                        <Sparkles className="w-2.5 h-2.5" />
                                                        NEW
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-400">-</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/spareparts/${item.id}/edit`}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-2xs"
                                                        title="Edit Sparepart"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-2xs"
                                                        title="Hapus Sparepart"
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

                {spareparts.links && spareparts.links.length > 0 && <Pagination links={spareparts.links} />}
            </div>
        </AdminLayout>
    );
}
