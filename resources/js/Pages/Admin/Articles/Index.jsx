import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Plus, Edit2, Trash2, FileText, Calendar, User } from 'lucide-react';

export default function Index({ articles }) {
    const handleDelete = (id, title) => {
        if (confirm(`Apakah Anda yakin ingin menghapus artikel "${title || 'ini'}"?`)) {
            router.delete(`/admin/articles/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Artikel &amp; Berita">
            <Head title="Kelola Artikel &amp; Berita | Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Daftar Artikel &amp; Berita ({articles.total})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Kelola publikasi artikel blog otomotif, tips perawatan motor Yamaha, dan rilis berita acara dealership.
                        </p>
                    </div>
                    <Link
                        href="/admin/articles/create"
                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Artikel Baru
                    </Link>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Judul Artikel</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">Penulis</th>
                                    <th className="px-4 py-3">Tgl Terbit</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {articles.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <FileText className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada artikel atau berita</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Publikasikan artikel tips otomotif, berita event dealer, atau panduan servis Yamaha terbaru.
                                                </p>
                                                <div className="mt-4">
                                                    <Link
                                                        href="/admin/articles/create"
                                                        className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Tulis Artikel Baru
                                                    </Link>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    articles.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-zinc-900 max-w-sm truncate">
                                                {item.title}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                                                    {item.category || 'Berita'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-zinc-600 font-medium">
                                                {item.author || 'Admin'}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-zinc-500">
                                                {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <Link
                                                        href={`/admin/articles/${item.id}/edit`}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-2xs"
                                                        title="Edit Artikel"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </Link>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(item.id, item.title)}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-2xs"
                                                        title="Hapus Artikel"
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

                {articles.links && <Pagination links={articles.links} />}
            </div>
        </AdminLayout>
    );
}
