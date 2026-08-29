import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ job = null, branches = [] }) {
    const isEditing = !!job;

    const { data, setData, post, put, processing } = useForm({
        title: job?.title || '',
        branch_id: job?.branch_id || '',
        employment_type: job?.employment_type || 'Full-Time',
        description: job?.description || '',
        requirements: job?.requirements || '',
        closes_at: job?.closes_at || '',
        is_active: job ? job.is_active : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/job-openings/${job.id}`);
        } else {
            post('/admin/job-openings');
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit ${job.title}` : 'Tambah Lowongan Baru'}>
            <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">{isEditing ? 'Edit Lowongan Kerja' : 'Form Lowongan Baru'}</h2>
                    <Link href="/admin/job-openings" className="text-xs font-bold text-slate-500 hover:text-slate-900">&larr; Kembali</Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Posisi Pekerjaan</label>
                        <input
                            type="text"
                            required
                            placeholder="Contoh: Senior Service Mechanic / Sales Executive"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Cabang Penempatan</label>
                            <select
                                value={data.branch_id}
                                onChange={(e) => setData('branch_id', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            >
                                <option value="">Semua Cabang (Nasional)</option>
                                {branches.map((b) => (
                                    <option key={b.id} value={b.id}>{b.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Tipe Kontrak Kerja</label>
                            <select
                                value={data.employment_type}
                                onChange={(e) => setData('employment_type', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            >
                                <option value="Full-Time">Full-Time (Tetap)</option>
                                <option value="Contract">Contract (Kontrak)</option>
                                <option value="Part-Time">Part-Time</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Deskripsi Pekerjaan &amp; Tanggung Jawab</label>
                        <textarea
                            rows="4"
                            required
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Persyaratan &amp; Kualifikasi Candidate</label>
                        <textarea
                            rows="4"
                            required
                            value={data.requirements}
                            onChange={(e) => setData('requirements', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Tanggal Batas Penutupan (Closes At)</label>
                        <input
                            type="date"
                            value={data.closes_at}
                            onChange={(e) => setData('closes_at', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="pt-2">
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) => setData('is_active', e.target.checked)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            Status Lowongan Buka (Aktif)
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition"
                    >
                        {isEditing ? 'Simpan Perubahan' : 'Terbitkan Lowongan'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
