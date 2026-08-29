import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ motorcycles }) {
    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus motor ini?')) {
            router.delete(`/admin/motorcycles/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Katalog Motor Yamaha">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">Daftar Sepeda Motor ({motorcycles.total})</h2>
                    <Link
                        href="/admin/motorcycles/create"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow transition"
                    >
                        + Tambah Motor Baru
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Nama Motor</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Harga OTR</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Unggulan</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {motorcycles.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900">{item.name}</td>
                                    <td className="p-4 font-semibold text-blue-600">{item.category}</td>
                                    <td className="p-4 font-extrabold text-slate-900">
                                        Rp {new Intl.NumberFormat('id-ID').format(item.price_otr)}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        {item.is_featured ? <span className="text-amber-500 font-bold">★ Ya</span> : '-'}
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link href={`/admin/motorcycles/${item.id}/edit`} className="text-blue-600 font-bold hover:underline">
                                            Edit
                                        </Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold hover:underline">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={motorcycles.links} />
            </div>
        </AdminLayout>
    );
}
