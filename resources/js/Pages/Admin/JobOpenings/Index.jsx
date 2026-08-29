import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ jobs }) {
    const handleDelete = (id) => {
        if (confirm('Hapus lowongan kerja ini?')) {
            router.delete(`/admin/job-openings/${id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Lowongan Kerja HR">
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-black text-slate-900">Daftar Lowongan ({jobs.total})</h2>
                    <Link href="/admin/job-openings/create" className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow">
                        + Tambah Lowongan Baru
                    </Link>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Posisi</th>
                                <th className="p-4">Cabang Penempatan</th>
                                <th className="p-4">Tipe Kerja</th>
                                <th className="p-4">Tgl Tutup</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {jobs.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-bold text-slate-900">{item.title}</td>
                                    <td className="p-4 font-semibold text-blue-600">{item.branch ? item.branch.name : 'Semua Cabang'}</td>
                                    <td className="p-4 font-mono">{item.employment_type}</td>
                                    <td className="p-4 font-mono">{item.closes_at || 'Terbuka'}</td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                            item.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {item.is_active ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link href={`/admin/job-openings/${item.id}/edit`} className="text-blue-600 font-bold hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold hover:underline">Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={jobs.links} />
            </div>
        </AdminLayout>
    );
}
