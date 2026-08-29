import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Show({ job }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        applicant_name: '',
        email: '',
        phone_number: '',
        cover_letter: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/karir/${job.id}/apply`, {
            onSuccess: () => reset(),
        });
    };

    return (
        <PublicLayout title={`Lowongan ${job.title} - Aspacindo`}>
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Lowongan Pekerjaan</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase">{job.title}</h1>
                    <p className="text-slate-400 text-sm">{job.branch ? job.branch.name : 'Semua Cabang'} — {job.employment_type}</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="space-y-3">
                            <h3 className="text-lg font-black text-slate-900">Deskripsi Pekerjaan</h3>
                            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{job.description}</p>
                        </div>

                        <div className="space-y-3 pt-6 border-t border-slate-100">
                            <h3 className="text-lg font-black text-slate-900">Kualifikasi &amp; Persyaratan</h3>
                            <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{job.requirements}</p>
                        </div>
                    </div>

                    <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-xl font-black text-slate-900 border-b border-slate-100 pb-4">Formulir Lamaran Kerja</h3>

                        {flash?.success && (
                            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold">
                                {flash.success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Nama Lengkap</label>
                                <input
                                    type="text"
                                    required
                                    value={data.applicant_name}
                                    onChange={(e) => setData('applicant_name', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Nomor Telepon / WhatsApp</label>
                                <input
                                    type="text"
                                    required
                                    value={data.phone_number}
                                    onChange={(e) => setData('phone_number', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Pesan Singkat / Surat Lamaran</label>
                                <textarea
                                    rows="4"
                                    value={data.cover_letter}
                                    onChange={(e) => setData('cover_letter', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl transition text-xs uppercase tracking-wider disabled:opacity-50"
                            >
                                Kirim Lamaran &rarr;
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
