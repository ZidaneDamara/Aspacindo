import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ testimonials }) {
    const handleToggleApprove = (id) => {
        router.post(`/admin/testimonials/${id}/approve`);
    };

    const handleToggleFeature = (id) => {
        router.post(`/admin/testimonials/${id}/feature`);
    };

    const handleDelete = (id) => {
        if (confirm('Hapus testimoni ini?')) {
            router.delete(`/admin/testimonials/${id}`);
        }
    };

    return (
        <AdminLayout title="Moderasi Testimoni & Ulasan Konsumen">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">Ulasan Konsumen ({testimonials.total})</h2>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Konsumen</th>
                                <th className="p-4">Rating</th>
                                <th className="p-4">Ulasan</th>
                                <th className="p-4">Status Moderasi</th>
                                <th className="p-4">Tampil Homepage</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {testimonials.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900">{item.customer_name}</td>
                                    <td className="p-4 font-bold text-amber-500">⭐ {item.rating} / 5</td>
                                    <td className="p-4 text-slate-600 max-w-sm">{item.review_text}</td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleApprove(item.id)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition ${
                                                item.is_approved ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-red-100 text-red-800 hover:bg-red-200'
                                            }`}
                                        >
                                            {item.is_approved ? 'Disetujui' : 'Pending Moderasi'}
                                        </button>
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleToggleFeature(item.id)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition ${
                                                item.is_featured ? 'bg-amber-100 text-amber-900' : 'bg-slate-100 text-slate-500'
                                            }`}
                                        >
                                            {item.is_featured ? '★ Featured' : 'Biasa'}
                                        </button>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold hover:underline">
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={testimonials.links} />
            </div>
        </AdminLayout>
    );
}
