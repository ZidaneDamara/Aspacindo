import React from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function About({ stats = {}, totalBranches = 20 }) {
    return (
        <PublicLayout title="Tentang Kami - Profil PT Aspacindo Kedaton Motor">
            <div className="bg-slate-900 text-white py-16 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Profil Perusahaan</span>
                    <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">PT Aspacindo Kedaton Motor</h1>
                    <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
                        Main Dealer &amp; Jaringan Dealer Resmi Yamaha Terpercaya yang telah melayani masyarakat Riau dan Sumatera Utara selama lebih dari 15 tahun.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
                {/* Vision & Mission */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Visi Utama</span>
                        <h3 className="text-2xl font-black text-slate-900">Menjadi Dealer Resmi Nomor 1 di Riau &amp; Sumut</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Menyediakan solusi transportasi roda dua terbaik dengan mengutamakan kepuasan pelanggan, integritas layanan, dan kualitas purna jual berstandar internasional Yamaha.
                        </p>
                    </div>

                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Misi Komitmen</span>
                        <h3 className="text-2xl font-black text-slate-900">Layanan Sepenuh Hati (Semakin Di Depan)</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">
                            Menghadirkan produk motor Yamaha terbaru, memperluas jaringan servis hingga pelosok daerah, dan memberikan pengalaman berbelanja serta servis yang cepat dan transparan.
                        </p>
                    </div>
                </div>

                {/* Company Stats */}
                <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-950 text-white p-12 rounded-3xl shadow-xl space-y-8">
                    <div className="text-center max-w-xl mx-auto">
                        <h3 className="text-2xl font-black uppercase">Pencapaian &amp; Kepercayaan Pelanggan</h3>
                        <p className="text-xs text-blue-200 mt-1">Dedicated to Automotive Excellence in Sumatra</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-4xl font-black text-amber-400">{stats.years_operating || '15+'}</p>
                            <p className="text-xs text-slate-300 font-semibold uppercase mt-1">Tahun Beroperasi</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-amber-400">{stats.branches_count || totalBranches}</p>
                            <p className="text-xs text-slate-300 font-semibold uppercase mt-1">Jaringan Cabang</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-amber-400">{stats.employees_count || '150+'}</p>
                            <p className="text-xs text-slate-300 font-semibold uppercase mt-1">Karyawan &amp; Mekanik</p>
                        </div>
                        <div>
                            <p className="text-4xl font-black text-amber-400">{stats.awards_won || '25+'}</p>
                            <p className="text-xs text-slate-300 font-semibold uppercase mt-1">Penghargaan Dealer</p>
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
