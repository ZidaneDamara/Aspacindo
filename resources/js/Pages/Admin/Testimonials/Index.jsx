import React from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { Star, Trash2, CheckCircle2, Clock, Sparkles, MessageSquare } from 'lucide-react';

export default function Index({ testimonials }) {
    const handleToggleApprove = (id) => {
        router.post(`/admin/testimonials/${id}/approve`, {}, { preserveScroll: true });
    };

    const handleToggleFeature = (id) => {
        router.post(`/admin/testimonials/${id}/feature`, {}, { preserveScroll: true });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus testimoni dari "${name || 'konsumen ini'}"?`)) {
            router.delete(`/admin/testimonials/${id}`);
        }
    };

    return (
        <AdminLayout title="Moderasi Testimoni &amp; Ulasan Konsumen">
            <Head title="Moderasi Testimoni | Admin" />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Moderasi Ulasan Konsumen ({testimonials.total})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Verifikasi keaslian ulasan pengalaman servis, pembelian motor, dan kepuasan pelanggan Yamaha Aspacindo.
                        </p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Konsumen</th>
                                    <th className="px-4 py-3">Rating</th>
                                    <th className="px-4 py-3">Ulasan</th>
                                    <th className="px-4 py-3">Status Moderasi</th>
                                    <th className="px-4 py-3">Tampil Beranda</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {testimonials.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <MessageSquare className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada ulasan konsumen</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Ulasan yang dikirimkan oleh konsumen setelah transaksi atau servis akan muncul di sini untuk dimoderasi.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    testimonials.data.map((item) => (
                                        <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3 font-semibold text-zinc-900 whitespace-nowrap">
                                                {item.customer_name}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <div className="flex items-center gap-1 font-semibold text-zinc-900">
                                                    <Star className="w-3.5 h-3.5 fill-zinc-900 text-zinc-900" />
                                                    <span>{item.rating} / 5</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-zinc-600 max-w-md">
                                                <p className="line-clamp-2 leading-relaxed">{item.review_text}</p>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleApprove(item.id)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                                                        item.is_approved
                                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                                            : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
                                                    }`}
                                                >
                                                    {item.is_approved ? (
                                                        <>
                                                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                                            <span>Disetujui</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Clock className="w-3 h-3 text-zinc-500" />
                                                            <span>Pending Moderasi</span>
                                                        </>
                                                    )}
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleFeature(item.id)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold border transition ${
                                                        item.is_featured
                                                            ? 'bg-zinc-900 text-white border-zinc-900'
                                                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900'
                                                    }`}
                                                >
                                                    <Sparkles className="w-3 h-3" />
                                                    <span>{item.is_featured ? 'Featured' : 'Standar'}</span>
                                                </button>
                                            </td>
                                            <td className="px-4 py-3 text-right whitespace-nowrap">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(item.id, item.customer_name)}
                                                    className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-2xs"
                                                    title="Hapus Ulasan"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {testimonials.links && <Pagination links={testimonials.links} />}
            </div>
        </AdminLayout>
    );
}
