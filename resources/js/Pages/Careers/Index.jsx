import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Index({ jobs = [] }) {
    return (
        <PublicLayout title="Karir & Lowongan Kerja - PT Aspacindo Kedaton Motor">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Kesempatan Berkarir</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Lowongan Kerja Aspacindo</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Bergabunglah dengan tim profesional otomotif terdepan di Riau &amp; Sumatera Utara. Kembangkan potensi terbaik Anda bersama kami.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
                {jobs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {jobs.map((job) => (
                            <div key={job.id} className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-lg transition space-y-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase">
                                            {job.employment_type}
                                        </span>
                                        <span className="text-xs text-slate-400 font-medium">
                                            {job.branch ? job.branch.name : 'Semua Cabang'}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">{job.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                        {job.description}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-[11px] text-slate-400">
                                        {job.closes_at ? `Tutup: ${job.closes_at}` : 'Terbuka'}
                                    </span>
                                    <Link
                                        href={`/karir/${job.id}`}
                                        className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl uppercase tracking-wider transition"
                                    >
                                        Detail &amp; Lamar &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center space-y-3">
                        <p className="text-slate-500 font-medium">Saat ini belum ada posisi lowongan kerja yang dibuka.</p>
                        <p className="text-xs text-slate-400">Silakan cek kembali halaman ini di kemudian hari atau kirimkan CV Anda ke hr@aspacindo.com</p>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
