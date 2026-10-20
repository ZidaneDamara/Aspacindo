import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function BranchAdminsIndex({ admins = [], branches = [] }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
        branch_id: branches[0]?.id || '',
        phone_number: '',
        role: 'branch_admin',
    });

    const openCreateModal = () => {
        setEditingAdmin(null);
        reset();
        clearErrors();
        setData({
            name: '',
            email: '',
            password: '',
            branch_id: branches[0]?.id || '',
            phone_number: '',
            role: 'branch_admin',
        });
        setModalOpen(true);
    };

    const openEditModal = (admin) => {
        setEditingAdmin(admin);
        clearErrors();
        setData({
            name: admin.name,
            email: admin.email,
            password: '',
            branch_id: admin.branch_id || branches[0]?.id || '',
            phone_number: admin.phone_number || '',
            role: admin.role,
        });
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingAdmin(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingAdmin) {
            put(`/admin/branch-admins/${editingAdmin.id}`, {
                onSuccess: () => closeModal(),
            });
        } else {
            post('/admin/branch-admins', {
                onSuccess: () => closeModal(),
            });
        }
    };

    const handleDelete = (admin) => {
        if (confirm(`Apakah Anda yakin ingin menghapus akun admin "${admin.name}" (${admin.email})?`)) {
            router.delete(`/admin/branch-admins/${admin.id}`);
        }
    };

    return (
        <AdminLayout title="Kelola Admin Cabang">
            <Head title="Kelola Admin Cabang" />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Header Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-blue-100 text-blue-800 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full">
                                Super Admin Control
                            </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                            Manajemen Admin Cabang Dealer
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Setiap cabang memiliki admin khusus yang berwenang memperbarui harga OTR motor untuk cabang masing-masing.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2"
                    >
                        <span>+</span>
                        <span>Tambah Admin Cabang</span>
                    </button>
                </div>

                {/* Admins Table */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 uppercase font-black text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Nama Admin</th>
                                    <th className="p-4">Email Login</th>
                                    <th className="p-4">Cabang Penugasan</th>
                                    <th className="p-4">Wilayah / Region</th>
                                    <th className="p-4">Nomor WhatsApp</th>
                                    <th className="p-4">Role</th>
                                    <th className="p-4 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {admins.map((admin) => (
                                    <tr key={admin.id} className="hover:bg-slate-50/80 transition">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-black flex items-center justify-center text-xs">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <span className="font-extrabold text-slate-900">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-slate-600 font-semibold">{admin.email}</td>
                                        <td className="p-4">
                                            {admin.branch ? (
                                                <div className="space-y-0.5">
                                                    <span className="font-bold text-blue-900 block">{admin.branch.name}</span>
                                                    <Link
                                                        href={`/admin/branch-prices?branch_id=${admin.branch.id}`}
                                                        className="text-[11px] text-blue-600 hover:underline font-semibold"
                                                    >
                                                        Lihat OTR Cabang &rarr;
                                                    </Link>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic">Semua Cabang (Pusat)</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {admin.branch ? (
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">
                                                    {admin.branch.region}
                                                </span>
                                            ) : (
                                                <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-[10px] font-bold">
                                                    Pusat
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 font-mono text-slate-500">{admin.phone_number || '-'}</td>
                                        <td className="p-4">
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                    admin.role === 'admin'
                                                        ? 'bg-amber-100 text-amber-800'
                                                        : 'bg-emerald-100 text-emerald-800'
                                                }`}
                                            >
                                                {admin.role === 'admin' ? 'Super Admin' : 'Admin Cabang'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => openEditModal(admin)}
                                                className="text-blue-600 hover:text-blue-800 font-bold hover:underline"
                                            >
                                                Edit
                                            </button>
                                            {admin.role !== 'admin' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(admin)}
                                                    className="text-red-500 hover:text-red-700 font-bold hover:underline"
                                                >
                                                    Hapus
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Branches Coverage Summary */}
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">
                    <h3 className="text-xs font-black uppercase text-slate-700 tracking-wider mb-4">
                        Status Kelengkapan Admin Tiap Cabang ({branches.length} Cabang)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {branches.map((b) => {
                            const branchAdmins = admins.filter((a) => a.branch_id === b.id);
                            const hasAdmin = branchAdmins.length > 0;

                            return (
                                <div
                                    key={b.id}
                                    className={`p-4 rounded-2xl border transition ${
                                        hasAdmin ? 'bg-white border-slate-200 shadow-sm' : 'bg-red-50/50 border-red-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-xs">{b.name}</h4>
                                            <span className="text-[10px] text-slate-500">{b.region}</span>
                                        </div>
                                        <span
                                            className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                                hasAdmin ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {hasAdmin ? '✓ Ada Admin' : '! Belum Ada'}
                                        </span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                                        <span className="text-slate-500 truncate max-w-[150px]">
                                            {hasAdmin ? branchAdmins[0].email : 'Perlu ditugaskan'}
                                        </span>
                                        <Link
                                            href={`/admin/branch-prices?branch_id=${b.id}`}
                                            className="text-blue-600 font-bold hover:underline"
                                        >
                                            Atur OTR &rarr;
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal Form */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                        <div className="bg-white w-full max-w-lg rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h3 className="text-base font-black text-slate-900">
                                    {editingAdmin ? `Edit Admin: ${editingAdmin.name}` : 'Tambah Admin Cabang Baru'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-slate-400 hover:text-slate-600 text-lg font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Admin Dealer Siak"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-3 focus:ring-blue-500"
                                    />
                                    {errors.name && <p className="text-[11px] text-red-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Email Login</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="admin.siak@aspacindo.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-3 focus:ring-blue-500"
                                    />
                                    {errors.email && <p className="text-[11px] text-red-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">
                                        Password {editingAdmin && '(Kosongkan jika tidak ingin mengubah)'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingAdmin}
                                        placeholder={editingAdmin ? '••••••••' : 'Minimal 6 karakter'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-3 focus:ring-blue-500"
                                    />
                                    {errors.password && <p className="text-[11px] text-red-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Cabang Penugasan</label>
                                    <select
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-3 focus:ring-blue-500"
                                    >
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name} ({b.region})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.branch_id && <p className="text-[11px] text-red-500">{errors.branch_id}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Nomor Telepon / WhatsApp</label>
                                    <input
                                        type="text"
                                        placeholder="081270001111"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-3 focus:ring-blue-500"
                                    />
                                    {errors.phone_number && <p className="text-[11px] text-red-500">{errors.phone_number}</p>}
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition disabled:opacity-50"
                                    >
                                        {processing ? 'Menyimpan...' : (editingAdmin ? 'Simpan Perubahan' : 'Tambah Admin')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
