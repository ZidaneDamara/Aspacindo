import React from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Dashboard({ stats = {}, recentBookings = [], recentRedemptions = [] }) {
    return (
        <AdminLayout title="Ringkasan Dashboard Admin">
            <div className="space-y-8">
                {/* STATS WIDGETS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Member ALC</span>
                        <p className="text-3xl font-black text-slate-900">{stats.totalMembers || 0}</p>
                        <Link href="/admin/loyalty/members" className="text-[11px] font-bold text-blue-600 hover:underline block pt-1">
                            Kelola Member &rarr;
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Poin Ditukar Bulan Ini</span>
                        <p className="text-3xl font-black text-amber-600">{new Intl.NumberFormat('id-ID').format(stats.pointsRedeemedThisMonth || 0)}</p>
                        <span className="text-[11px] font-medium text-slate-400 block pt-1">Total Saldo Ditukar</span>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Booking Service</span>
                        <p className="text-3xl font-black text-blue-600">{stats.pendingServiceBookings || 0}</p>
                        <Link href="/admin/service-bookings" className="text-[11px] font-bold text-blue-600 hover:underline block pt-1">
                            Proses Booking &rarr;
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Klaim Hadiah</span>
                        <p className="text-3xl font-black text-red-600">{stats.pendingRedemptions || 0}</p>
                        <Link href="/admin/loyalty/redemptions" className="text-[11px] font-bold text-red-600 hover:underline block pt-1">
                            Proses Klaim &rarr;
                        </Link>
                    </div>

                    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Moderasi Ulasan</span>
                        <p className="text-3xl font-black text-slate-700">{stats.pendingTestimonials || 0}</p>
                        <Link href="/admin/testimonials" className="text-[11px] font-bold text-blue-600 hover:underline block pt-1">
                            Setujui Ulasan &rarr;
                        </Link>
                    </div>
                </div>

                {/* QUICK ACTION BUTTONS */}
                <div className="bg-slate-900 text-white p-6 rounded-2xl space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400">Aksi Cepat Kasir &amp; Administrator</h3>
                    <div className="flex flex-wrap gap-3">
                        <Link
                            href="/admin/loyalty/point-input"
                            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider shadow"
                        >
                            📱 Input Poin Kasir Off-Line
                        </Link>
                        <Link
                            href="/admin/service-bookings"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider shadow"
                        >
                            🛠️ Antrean Booking Service
                        </Link>
                        <Link
                            href="/admin/motorcycles/create"
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider border border-slate-700"
                        >
                            + Tambah Motor Baru
                        </Link>
                    </div>
                </div>

                {/* RECENT DATA TABLES */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Recent Bookings */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-base">Booking Service Terbaru</h3>
                            <Link href="/admin/service-bookings" className="text-xs text-blue-600 font-bold hover:underline">Semua &rarr;</Link>
                        </div>
                        <div className="divide-y divide-slate-100 text-xs">
                            {recentBookings.map((b) => (
                                <div key={b.id} className="py-3 flex justify-between items-center">
                                    <div>
                                        <p className="font-bold text-slate-900">{b.customer_name} ({b.phone_number})</p>
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
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-slate-900 text-base">Klaim Hadiah Terbaru</h3>
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
        </AdminLayout>
    );
}
