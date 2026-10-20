import React from 'react';
import { Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({ motorcycles, userBranch = null }) {
    const isBranchAdmin = !!userBranch;

    const handleDelete = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus motor ini?')) {
            router.delete(`/admin/motorcycles/${id}`);
        }
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number || 0);
    };

    return (
        <AdminLayout title="Kelola Katalog Motor Yamaha">
            <div className="space-y-6">
                {/* Branch Info Banner if logged in as branch admin */}
                {userBranch && (
                    <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-5 rounded-2xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full inline-block">
                                🏢 Area Cabang: {userBranch.region}
                            </span>
                            <h3 className="text-base font-extrabold">{userBranch.name}</h3>
                            <p className="text-xs text-blue-200">
                                Anda login sebagai Admin Cabang. Anda dapat mengatur dan memperbarui harga OTR khusus untuk cabang Anda.
                            </p>
                        </div>
                        <Link
                            href="/admin/branch-prices"
                            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow transition flex-shrink-0"
                        >
                            💰 Atur Harga OTR Cabang Ini &rarr;
                        </Link>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">Daftar Sepeda Motor ({motorcycles.total})</h2>
                        <p className="text-xs text-slate-500 mt-0.5">Katalog sepeda motor Yamaha resmi Aspacindo</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/branch-prices"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow transition flex items-center gap-1.5"
                        >
                            <span>💰</span>
                            <span>{userBranch ? 'Update Harga OTR Cabang' : 'Kelola Harga OTR Per-Cabang'}</span>
                        </Link>

                        {!isBranchAdmin && (
                            <Link
                                href="/admin/motorcycles/create"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow transition"
                            >
                                + Tambah Motor Baru
                            </Link>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Nama Motor</th>
                                <th className="p-4">Kategori</th>
                                <th className="p-4">OTR Pusat (Pekanbaru)</th>
                                {userBranch && (
                                    <th className="p-4 text-blue-900 bg-blue-50/50">
                                        OTR Cabang ({userBranch.region})
                                    </th>
                                )}
                                <th className="p-4">Status</th>
                                <th className="p-4">Unggulan</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {motorcycles.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            {item.primary_image && (
                                                <img
                                                    src={item.primary_image.image_path}
                                                    alt={item.name}
                                                    className="w-10 h-10 object-contain rounded-lg border border-slate-200 bg-white p-0.5"
                                                />
                                            )}
                                            <span className="font-bold text-slate-900">{item.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold text-blue-600">{item.category}</td>
                                    <td className="p-4 font-medium text-slate-600 font-mono">
                                        {formatRupiah(item.price_otr)}
                                    </td>
                                    {userBranch && (
                                        <td className="p-4 font-extrabold text-blue-900 font-mono bg-blue-50/20">
                                            {formatRupiah(item.branch_price || item.price_otr)}
                                        </td>
                                    )}
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
                                        {isBranchAdmin ? (
                                            <Link
                                                href={`/admin/branch-prices`}
                                                className="bg-blue-50 text-blue-700 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                                            >
                                                Edit OTR Cabang
                                            </Link>
                                        ) : (
                                            <>
                                                <Link href={`/admin/motorcycles/${item.id}/edit`} className="text-blue-600 font-bold hover:underline">
                                                    Edit
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="text-red-600 font-bold hover:underline">
                                                    Hapus
                                                </button>
                                            </>
                                        )}
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
