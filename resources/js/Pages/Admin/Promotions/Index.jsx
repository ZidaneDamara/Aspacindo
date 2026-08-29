import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ promotions }) {
    const handleDelete = (id) => {
        if (confirm('Hapus promo ini?')) {
            router.delete(`/admin/promotions/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Banner Promo Spesial">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">Banner Promo ({promotions.total})</h2>
                    <Link href="/admin/promotions/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow">
                        + Tambah Promo Baru
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Judul Promo</th>
                                <th className="p-4">Tgl Mulai</th>
                                <th className="p-4">Tgl Berakhir</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {promotions.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900">{item.title}</td>
                                    <td className="p-4 font-mono">{item.start_date || 'Hari ini'}</td>
                                    <td className="p-4 font-mono">{item.end_date || 'Akhir Bulan'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link href={`/admin/promotions/${item.id}/edit`} className="text-blue-600 font-bold hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={promotions.links} />
            </div>
        </AdminLayout>
    );
}
