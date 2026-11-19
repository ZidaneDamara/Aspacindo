import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Eye,
    EyeOff,
    Calendar,
    Tag,
    Image as ImageIcon,
    SlidersHorizontal,
    CheckCircle2,
    XCircle,
} from 'lucide-react';

export default function Index({ activities, categories = [], filters = {} }) {
    const [search, setSearch] = useState(filters.search || '');
    const [category, setCategory] = useState(filters.category || 'Semua');
    const [status, setStatus] = useState(filters.status || '');

    const handleFilter = (e) => {
        e?.preventDefault();
        router.get(
            '/admin/activities',
            { search, category, status },
            { preserveState: true, replace: true }
        );
    };

    const handleReset = () => {
        setSearch('');
        setCategory('Semua');
        setStatus('');
        router.get('/admin/activities', {}, { preserveState: true, replace: true });
    };

    const handleDelete = (id, title) => {
        if (confirm(`Yakin ingin menghapus dokumentasi "${title}"?`)) {
            router.delete(`/admin/activities/${id}`);
        }
    };

    const handleToggle = (id) => {
        router.post(`/admin/activities/${id}/toggle`, {}, { preserveScroll: true });
    };

    return (
        <AdminLayout title="Kelola Galeri & Aktifitas Dealership">
            <Head title="Kelola Galeri & Aktifitas | Admin" />

            <div className="space-y-6">
                {/* Header Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Galeri &amp; Aktifitas Dealership
                        </h2>
                        <p className="text-sm text-zinc-500 mt-0.5">
                            Kelola dokumentasi acara, event komunitas MAXi, serah terima unit, dan program CSR untuk halaman Tentang Kami.
                        </p>
                    </div>
                    <Link
                        href="/admin/activities/create"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-zinc-50 bg-zinc-900 hover:bg-zinc-800 rounded-lg shadow-xs transition"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Dokumentasi
                    </Link>
                </div>

                {/* Filter and Search Bar */}
                <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-2xs">
                    <form onSubmit={handleFilter} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                        <div className="sm:col-span-5 relative">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari judul kegiatan atau deskripsi..."
                                className="w-full pl-9 pr-3 py-2 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-zinc-50/50"
                            />
                        </div>

                        <div className="sm:col-span-3">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full py-2 px-3 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-zinc-50/50 text-zinc-700"
                            >
                                <option value="Semua">Semua Kategori</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="sm:col-span-2">
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full py-2 px-3 text-xs border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900 bg-zinc-50/50 text-zinc-700"
                            >
                                <option value="">Semua Status</option>
                                <option value="1">Aktif (Tampil)</option>
                                <option value="0">Draft / Sembunyi</option>
                            </select>
                        </div>

                        <div className="sm:col-span-2 flex items-center gap-2">
                            <button
                                type="submit"
                                className="w-full py-2 px-3 text-xs font-semibold text-white bg-zinc-900 hover:bg-zinc-800 rounded-lg transition"
                            >
                                Terapkan
                            </button>
                            {(search || (category && category !== 'Semua') || status) && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="py-2 px-3 text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-lg transition"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Data */}
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 border-b border-zinc-200 text-zinc-700 uppercase tracking-wider font-semibold text-[11px]">
                                <tr>
                                    <th className="px-4 py-3.5 w-16">Foto</th>
                                    <th className="px-4 py-3.5">Judul &amp; Deskripsi</th>
                                    <th className="px-4 py-3.5 w-36">Kategori</th>
                                    <th className="px-4 py-3.5 w-32">Tanggal Acara</th>
                                    <th className="px-4 py-3.5 w-24 text-center">Status</th>
                                    <th className="px-4 py-3.5 w-32 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {activities.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-zinc-400">
                                            <ImageIcon className="w-8 h-8 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
                                            <p className="font-medium text-sm text-zinc-500">Tidak ada dokumentasi kegiatan ditemukan.</p>
                                            <p className="text-xs text-zinc-400 mt-0.5">Silakan buat dokumentasi baru atau ubah kata kunci filter.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    activities.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="w-14 h-10 rounded-lg overflow-hidden border border-zinc-200 bg-zinc-100 flex-shrink-0">
                                                    <img
                                                        src={item.image_url || item.image_path}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.onerror = null;
                                                            e.target.src = '/assets/images/placeholder-activity.webp';
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-zinc-900 text-sm">{item.title}</div>
                                                {item.description && (
                                                    <p className="text-xs text-zinc-500 line-clamp-1 mt-0.5 max-w-md">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                                                    <Tag className="w-3 h-3 text-zinc-500" />
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-zinc-500 whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5 text-xs">
                                                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                                    {item.formatted_date || item.event_date || '—'}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => handleToggle(item.id)}
                                                    title={item.is_active ? 'Klik untuk sembunyikan' : 'Klik untuk tampilkan'}
                                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border transition ${
                                                        item.is_active
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                            : 'bg-zinc-100 text-zinc-500 border-zinc-300 hover:bg-zinc-200'
                                                    }`}
                                                >
                                                    {item.is_active ? (
                                                        <>
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <XCircle className="w-3 h-3" />
                                                            Nonaktif
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1">
                                                    <Link
                                                        href={`/admin/activities/${item.id}/edit`}
                                                        className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-md transition"
                                                        title="Edit Kegiatan"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(item.id, item.title)}
                                                        className="p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                                                        title="Hapus Kegiatan"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {activities.links && activities.links.length > 3 && (
                        <div className="border-t border-zinc-200 px-4 py-3 flex items-center justify-between text-xs text-zinc-500 bg-zinc-50/50">
                            <div>
                                Menampilkan <span className="font-semibold text-zinc-800">{activities.from || 0}</span> sampai{' '}
                                <span className="font-semibold text-zinc-800">{activities.to || 0}</span> dari{' '}
                                <span className="font-semibold text-zinc-800">{activities.total}</span> data
                            </div>
                            <div className="flex items-center gap-1">
                                {activities.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-zinc-900 text-white'
                                                : link.url
                                                ? 'text-zinc-600 hover:bg-zinc-200/70 hover:text-zinc-900'
                                                : 'text-zinc-300 cursor-not-allowed pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

