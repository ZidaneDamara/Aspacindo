import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ articles }) {
    const handleDelete = (id) => {
        if (confirm('Hapus artikel ini?')) {
            router.delete(`/admin/articles/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Artikel & Berita">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">Daftar Artikel ({articles.total})</h2>
                    <Link href="/admin/articles/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow">
                        + Tambah Artikel Baru
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Judul Artikel</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">Penulis</th>
                                <th className="p-4">Tgl Terbit</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {articles.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{item.title}</td>
                                    <td className="p-4 font-semibold text-blue-600">{item.category}</td>
                                    <td className="p-4">{item.author || 'Admin'}</td>
                                    <td className="p-4 font-mono">{item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID') : '-'}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link href={`/admin/articles/${item.id}/edit`} className="text-blue-600 font-bold hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={articles.links} />
            </div>
        </AdminLayout>
    );
}
