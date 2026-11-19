import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Edit2, Trash2, Users, Building, X, ExternalLink, ShieldCheck } from 'lucide-react';

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
            <Head title="Kelola Admin Cabang | Admin" />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-200 pb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-md">
                                <ShieldCheck className="w-3 h-3 text-zinc-500" />
                                Hak Akses Wilayah
                            </span>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                            Manajemen Admin Cabang Dealer ({admins.length})
                        </h2>
                        <p className="text-xs text-zinc-500 mt-0.5">
                            Setiap cabang memiliki akun admin resmi untuk memperbarui data motor, harga OTR, dan leads cabang bersangkutan.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openCreateModal}
                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Admin Cabang
                    </button>
                </div>

                {/* Admins Table */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Nama Admin</th>
                                    <th className="px-4 py-3">Email Login</th>
                                    <th className="px-4 py-3">Cabang Penugasan</th>
                                    <th className="px-4 py-3">Wilayah / Region</th>
                                    <th className="px-4 py-3">Nomor WhatsApp</th>
                                    <th className="px-4 py-3">Role</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {admins.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <Users className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Belum ada akun admin cabang</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Klik tombol di bawah untuk menambahkan admin cabang dealer pertama Anda.
                                                </p>
                                                <div className="mt-4">
                                                    <button
                                                        type="button"
                                                        onClick={openCreateModal}
                                                        className="inline-flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow-xs"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                        Tambah Admin Cabang
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    admins.map((admin) => (
                                        <tr key={admin.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2.5">
                                                    <div className="w-7 h-7 rounded-md bg-zinc-100 text-zinc-900 font-bold border border-zinc-200 flex items-center justify-center text-xs">
                                                        {admin.name.charAt(0)}
                                                    </div>
                                                    <span className="font-semibold text-zinc-900">{admin.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-mono text-zinc-600 font-medium">{admin.email}</td>
                                            <td className="px-4 py-3">
                                                {admin.branch ? (
                                                    <div className="space-y-0.5">
                                                        <span className="font-semibold text-zinc-900 block">{admin.branch.name}</span>
                                                        <Link
                                                            href={`/admin/motorcycles?region=${encodeURIComponent(admin.branch.region)}`}
                                                            className="text-[11px] text-zinc-500 hover:text-zinc-900 font-medium inline-flex items-center gap-0.5"
                                                        >
                                                            Lihat OTR {admin.branch.region}
                                                            <ExternalLink className="w-2.5 h-2.5" />
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-400 italic">Semua Cabang (Pusat)</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                {admin.branch ? (
                                                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-md text-[10px] font-semibold">
                                                        {admin.branch.region}
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-0.5 bg-zinc-900 text-white rounded-md text-[10px] font-semibold">
                                                        Pusat
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-zinc-600">{admin.phone_number || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                        admin.role === 'admin'
                                                            ? 'bg-zinc-900 text-white border-zinc-900'
                                                            : 'bg-zinc-100 text-zinc-800 border-zinc-200'
                                                    }`}
                                                >
                                                    {admin.role === 'admin' ? 'Super Admin' : 'Admin Cabang'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center justify-end gap-1">
                                                    <button
                                                        type="button"
                                                        onClick={() => openEditModal(admin)}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 transition shadow-2xs"
                                                        title="Edit Admin"
                                                    >
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                    </button>
                                                    {admin.role !== 'admin' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDelete(admin)}
                                                            className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-zinc-200 bg-white text-zinc-400 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50 transition shadow-2xs"
                                                            title="Hapus Admin"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Branches Coverage Summary */}
                <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-2xs">
                    <h3 className="text-xs font-semibold uppercase text-zinc-700 tracking-wider mb-4 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-zinc-500" />
                        Status Penugasan Admin Tiap Cabang ({branches.length} Cabang)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {branches.map((b) => {
                            const branchAdmins = admins.filter((a) => a.branch_id === b.id);
                            const hasAdmin = branchAdmins.length > 0;

                            return (
                                <div
                                    key={b.id}
                                    className={`p-3.5 rounded-lg border transition ${
                                        hasAdmin ? 'bg-zinc-50/50 border-zinc-200' : 'bg-rose-50/30 border-rose-200'
                                    }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-zinc-900 text-xs">{b.name}</h4>
                                            <span className="text-[10px] text-zinc-500">{b.region}</span>
                                        </div>
                                        <span
                                            className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${
                                                hasAdmin
                                                    ? 'bg-zinc-100 text-zinc-800 border-zinc-200'
                                                    : 'bg-rose-50 text-rose-700 border-rose-200'
                                            }`}
                                        >
                                            {hasAdmin ? 'Terpasang' : 'Belum Ada'}
                                        </span>
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px]">
                                        <span className="text-zinc-500 truncate max-w-[150px]">
                                            {hasAdmin ? branchAdmins[0].email : 'Perlu ditugaskan'}
                                        </span>
                                        <Link
                                            href={`/admin/motorcycles?region=${encodeURIComponent(b.region)}`}
                                            className="text-zinc-700 hover:text-zinc-950 font-semibold inline-flex items-center gap-0.5"
                                        >
                                            Atur OTR
                                            <ExternalLink className="w-2.5 h-2.5" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal Form */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs">
                        <div className="bg-white w-full max-w-lg rounded-2xl p-6 shadow-xl border border-zinc-200 space-y-5">
                            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
                                <h3 className="text-sm font-bold text-zinc-900">
                                    {editingAdmin ? `Edit Akun: ${editingAdmin.name}` : 'Tambah Admin Cabang Baru'}
                                </h3>
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-zinc-400 hover:text-zinc-700 p-1 rounded-md transition"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Nama Lengkap</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Admin Dealer Siak"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                    {errors.name && <p className="text-[11px] text-rose-500">{errors.name}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Email Login</label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="admin.siak@aspacindo.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                    {errors.email && <p className="text-[11px] text-rose-500">{errors.email}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">
                                        Password {editingAdmin && '(Kosongkan jika tidak ingin mengubah)'}
                                    </label>
                                    <input
                                        type="password"
                                        required={!editingAdmin}
                                        placeholder={editingAdmin ? '••••••••' : 'Minimal 6 karakter'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                    {errors.password && <p className="text-[11px] text-rose-500">{errors.password}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Cabang Penugasan</label>
                                    <select
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-white"
                                    >
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.name} ({b.region})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.branch_id && <p className="text-[11px] text-rose-500">{errors.branch_id}</p>}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Nomor Telepon / WhatsApp</label>
                                    <input
                                        type="text"
                                        placeholder="081262241100"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                    {errors.phone_number && <p className="text-[11px] text-rose-500">{errors.phone_number}</p>}
                                </div>

                                <div className="flex justify-end gap-2.5 pt-3 border-t border-zinc-200">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-4 py-2 rounded-lg border border-zinc-200 text-xs font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-zinc-900 hover:bg-zinc-800 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-xs transition disabled:opacity-50"
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
