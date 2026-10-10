import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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
            <div className="space-y-6 font-sans">
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Katalog Sparepart &amp; Suku Cadang</h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Kelola data oli Yamalube, ban, busi, pengereman, kelistrikan, dan suku cadang original Yamaha.
                        </p>
                    </div>
                    <Link
                        href="/admin/spareparts/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-2xl text-xs uppercase tracking-wider transition shadow-sm"
                    >
                        + Tambah Sparepart Baru
                    </Link>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white text-xs uppercase font-extrabold">
                                <th className="p-4">Foto</th>
                                <th className="p-4">Nama Produk</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Harga (Rp)</th>
                                <th className="p-4 text-center">Status NEW</th>
                                <th className="p-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {spareparts.data.length > 0 ? (
                                spareparts.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50 transition">
                                        <td className="p-4 w-16">
                                            <img
                                                src={item.image_url || 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=200&q=80'}
                                                alt={item.name}
                                                className="w-12 h-12 object-contain rounded-lg border border-slate-200 p-1"
                                            />
                                        </td>
                                        <td className="p-4 font-bold text-slate-900">{item.name}</td>
                                        <td className="p-4">
                                            <span className="inline-block px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-bold">
                                                {item.category}
                                            </span>
                                        </td>
                                        <td className="p-4 font-extrabold text-slate-900">{formatPrice(item.price)}</td>
                                        <td className="p-4 text-center">
                                            {item.is_new ? (
                                                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-[10px] font-black uppercase">
                                                    NEW
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center gap-2">
                                                <Link
                                                    href={`/admin/spareparts/${item.id}/edit`}
                                                    className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-bold"
                                                >
                                                    Edit
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id, item.name)}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold"
                                                >
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="p-8 text-center text-slate-400">
                                        Belum ada data sparepart.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
