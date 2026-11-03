import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ isBranchAdmin = false, userBranch = null, stats = {}, recentBookings = [], recentRedemptions = [], recentProspects = [] }) {
    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    return (
        <AdminLayout title={isBranchAdmin ? `Dashboard Admin Cabang: ${userBranch?.name}` : 'Ringkasan Dashboard Super Admin'}>
            <div className="space-y-8 font-sans">
                {/* 1. BRANCH ADMIN SPECIALIZED VIEW */}
                {isBranchAdmin && userBranch ? (
                    <div className="space-y-6">
                        {/* Welcome Banner */}
                        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-7 rounded-3xl shadow-md border border-blue-800 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <span className="text-xs font-black uppercase tracking-widest bg-amber-400 text-slate-950 px-3 py-1 rounded-full shadow-xs">
                                    🏢 Admin Cabang: {userBranch.region}
                                </span>
                                <span className="text-xs font-bold text-blue-200">
                                    Tipe Dealer: <strong className="text-white">{userBranch.dealer_type}</strong>
                                </span>
                            </div>
                            <h2 className="text-2xl font-black text-white">{userBranch.name}</h2>
                            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                                Selamat datang di panel admin cabang. Anda memiliki akses penuh untuk mengatur dan memperbarui <strong>Harga OTR</strong> untuk seluruh katalog motor di wilayah <strong>{userBranch.region}</strong> serta mengelola data profil dan alamat cabang Anda.
                            </p>
                        </div>

                        {/* Branch Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Wilayah Cabang</span>
                                <p className="text-2xl font-black text-blue-700">{userBranch.region}</p>
                                <span className="text-[11px] font-medium text-slate-400 block pt-1">{userBranch.name}</span>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Motor Aktif</span>
                                <p className="text-2xl font-black text-slate-900">{stats.totalBikes || 0} Model</p>
                                <Link href="/admin/motorcycles" className="text-[11px] font-bold text-blue-600 hover:underline block pt-1">
                                    Atur Harga OTR &rarr;
                                </Link>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">OTR Khusus Wilayah</span>
                                <p className="text-2xl font-black text-emerald-600">{stats.customOtrCount || 0} Model</p>
                                <span className="text-[11px] font-medium text-slate-400 block pt-1">Disesuaikan untuk {userBranch.region}</span>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Booking Service Cabang</span>
                                <p className="text-2xl font-black text-amber-600">{stats.pendingBranchBookings || 0} Antrean</p>
                                <span className="text-[11px] font-medium text-slate-400 block pt-1">Total {stats.branchBookingsCount || 0} booking</span>
                            </div>
                        </div>

                        {/* Primary Quick Actions for Branch Admin */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Link
                                href="/admin/motorcycles"
                                className="group bg-white hover:bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                                        🏍️
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition">
                                        Katalog Motor &amp; Harga OTR Wilayah {userBranch.region}
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Sesuaikan harga On The Road (OTR) untuk tipe motor MAXi, Classy, Matic, Moped, dan Sport khusus untuk jaringan dealer di wilayah Anda.
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center text-xs font-extrabold text-blue-600 group-hover:translate-x-1 transition">
                                    Buka Katalog &amp; OTR &rarr;
                                </div>
                            </Link>

                            <Link
                                href="/admin/branches"
                                className="group bg-white hover:bg-slate-50 p-6 rounded-3xl border-2 border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition space-y-3 flex flex-col justify-between"
                            >
                                <div className="space-y-2">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                                        🏢
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition">
                                        Kelola Data Cabang Dealer ({userBranch.name})
                                    </h3>
                                    <p className="text-xs text-slate-500 leading-relaxed">
                                        Perbarui alamat lengkap, nomor WhatsApp sales/servis, pin koordinat Google Maps, dan jam operasional cabang Anda.
                                    </p>
                                </div>
                                <div className="pt-4 flex items-center text-xs font-extrabold text-blue-600 group-hover:translate-x-1 transition">
                                    Lihat &amp; Edit Cabang &rarr;
                                </div>
                            </Link>
                        </div>

                        {/* Recent Bookings at This Branch */}
                        {recentBookings.length > 0 && (
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">
                                        Booking Service Terbaru di Cabang Anda
                                    </h3>
                                    <span className="text-xs text-slate-400 font-bold">{recentBookings.length} Terakhir</span>
                                </div>
                                <div className="divide-y divide-slate-100 text-xs">
                                    {recentBookings.map((b) => (
                                        <div key={b.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{b.customer_name}</p>
                                                <p className="text-slate-500">{b.motorcycle_model} &bull; Tgl: {b.preferred_date} jam {b.preferred_time}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-amber-50 text-amber-800 font-extrabold rounded-full text-[10px] uppercase">
                                                {b.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* 2. SUPER ADMIN GLOBAL OVERVIEW */
                    <div className="space-y-8">
                        {/* STATS WIDGETS GRID */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-5 rounded-3xl shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider block">Lead Prospek Kredit</span>
                                <p className="text-3xl font-black text-white">{stats.totalProspects || 0}</p>
                                <Link href="/admin/prospects" className="text-[11px] font-bold text-white hover:underline block pt-1">
                                    Follow Up Sales ({stats.newProspectsCount || 0} Baru) &rarr;
                                </Link>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Member ALC</span>
                                <p className="text-3xl font-black text-slate-900">{stats.totalMembers || 0}</p>
                                <Link href="/admin/loyalty/members" className="text-[11px] font-bold text-blue-600 hover:underline block pt-1">
                                    Kelola Member &rarr;
                                </Link>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Poin Ditukar</span>
                                <p className="text-3xl font-black text-amber-600">{new Intl.NumberFormat('id-ID').format(stats.pointsRedeemedThisMonth || 0)}</p>
                                <span className="text-[11px] font-medium text-slate-400 block pt-1">Bulan Ini</span>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Service</span>
                                <p className="text-3xl font-black text-blue-600">{stats.pendingServiceBookings || 0}</p>
                                <Link href="/admin/service-bookings" className="text-[11px] font-bold text-blue-600 hover:underline block pt-1">
                                    Proses Booking &rarr;
                                </Link>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Hadiah</span>
                                <p className="text-3xl font-black text-red-600">{stats.pendingRedemptions || 0}</p>
                                <Link href="/admin/loyalty/redemptions" className="text-[11px] font-bold text-red-600 hover:underline block pt-1">
                                    Proses Klaim &rarr;
                                </Link>
                            </div>

                            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
                                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Cabang &amp; Motor</span>
                                <p className="text-3xl font-black text-slate-700">{stats.totalBranches || 0} / {stats.totalBikes || 0}</p>
                                <Link href="/admin/branches" className="text-[11px] font-bold text-blue-600 hover:underline block pt-1">
                                    Kelola Master &rarr;
                                </Link>
                            </div>
                        </div>

                        {/* QUICK ACTION BUTTONS FOR SUPER ADMIN */}
                        <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-sm">
                            <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                                Pintasan Utama Super Administrator (Pusat)
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                <Link
                                    href="/admin/motorcycles"
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition flex items-center gap-2"
                                >
                                    🏍️ Katalog Motor &amp; OTR 7 Wilayah (CRUD)
                                </Link>
                                <Link
                                    href="/admin/branch-admins"
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow transition"
                                >
                                    👤 Kelola Admin Cabang (7 Area)
                                </Link>
                                <Link
                                    href="/admin/articles"
                                    className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider border border-slate-700 transition"
                                >
                                    📝 Editor Artikel &amp; Blog
                                </Link>
                            </div>
                        </div>

                        {/* RECENT DATA TABLES */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Recent Prospects */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Prospect Leads Terbaru</h3>
                                    <Link href="/admin/prospects" className="text-xs text-blue-600 font-bold hover:underline">Semua &rarr;</Link>
                                </div>
                                <div className="divide-y divide-slate-100 text-xs">
                                    {recentProspects.length === 0 ? (
                                        <p className="text-slate-400 py-4 font-semibold text-center">Belum ada prospect.</p>
                                    ) : (
                                        recentProspects.map((p) => (
                                            <div key={p.id} className="py-3 space-y-1">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold text-slate-900">{p.name}</p>
                                                        <p className="text-[11px] text-slate-500">{p.phone} — {p.motorcycle_name}</p>
                                                    </div>
                                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-800 font-extrabold rounded-md text-[10px]">
                                                        {p.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-[11px] font-semibold text-emerald-700">
                                                    <span>Est. Cicilan:</span>
                                                    <span>{formatRupiah(p.monthly_installment)} /bln</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* Recent Bookings */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Booking Service Terbaru</h3>
                                    <Link href="/admin/service-bookings" className="text-xs text-blue-600 font-bold hover:underline">Semua &rarr;</Link>
                                </div>
                                <div className="divide-y divide-slate-100 text-xs">
                                    {recentBookings.map((b) => (
                                        <div key={b.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-900">{b.customer_name}</p>
                                                <p className="text-slate-500">{b.motorcycle_model} — {b.branch?.name}</p>
                                            </div>
                                            <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-extrabold rounded-full text-[10px] uppercase">
                                                {b.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Redemptions */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Klaim Hadiah Terbaru</h3>
                                    <Link href="/admin/loyalty/redemptions" className="text-xs text-blue-600 font-bold hover:underline">Semua &rarr;</Link>
                                </div>
                                <div className="divide-y divide-slate-100 text-xs">
                                    {recentRedemptions.map((r) => (
                                        <div key={r.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-slate-900">{r.loyalty_member?.user?.name}</p>
                                                <p className="text-slate-500">{r.reward?.name} (-{r.points_spent} Poin)</p>
                                            </div>
                                            <span className="px-2.5 py-1 bg-blue-50 text-blue-800 font-extrabold rounded-full text-[10px] uppercase">
                                                {r.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
