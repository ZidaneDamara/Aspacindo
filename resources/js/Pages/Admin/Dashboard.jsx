import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    LayoutDashboard,
    TrendingUp,
    Users,
    Eye,
    Search,
    Smartphone,
    Laptop,
    Bike,
    Target,
    Wrench,
    Building2,
    Calendar,
    ArrowUpRight,
    CreditCard,
    CheckCircle2,
    Clock,
    Tag,
    ChevronRight,
    Flame,
    BarChart3,
    ArrowRight,
    ExternalLink,
} from 'lucide-react';

export default function Dashboard({
    isBranchAdmin = false,
    userBranch = null,
    stats = {},
    analytics = null,
    recentBookings = [],
    recentRedemptions = [],
    recentProspects = [],
}) {
    const formatNumber = (num) => new Intl.NumberFormat('id-ID').format(num || 0);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number || 0);
    };

    // Calculate maximum views for chart scaling
    const maxDailyViews = analytics?.trafficTrend?.reduce((max, item) => Math.max(max, item.views), 1) || 1;

    return (
        <AdminLayout title={isBranchAdmin ? `Dashboard Cabang: ${userBranch?.name}` : 'Executive Business Dashboard'}>
            <Head title={isBranchAdmin ? 'Dashboard Cabang' : 'Business Decision Dashboard'} />

            <div className="space-y-8">
                {/* 1. BRANCH ADMIN SPECIALIZED DASHBOARD */}
                {isBranchAdmin && userBranch ? (
                    <div className="space-y-6">
                        {/* Clean Monochrome Banner */}
                        <div className="bg-zinc-950 text-zinc-100 p-6 rounded-2xl border border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                                        Area Cabang: {userBranch.region}
                                    </span>
                                    <span className="text-[10px] text-zinc-400 font-medium">
                                        Tipe Dealer: {userBranch.dealer_type}
                                    </span>
                                </div>
                                <h2 className="text-xl font-bold tracking-tight text-white">{userBranch.name}</h2>
                                <p className="text-xs text-zinc-400 max-w-xl">
                                    Kelola harga OTR khusus wilayah {userBranch.region}, perbarui alamat &amp; jam operasional cabang, dan pantau booking service masuk.
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Link
                                    href="/admin/motorcycles"
                                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-900 bg-zinc-100 hover:bg-white rounded-lg transition"
                                >
                                    <Bike className="w-4 h-4" />
                                    Atur Harga OTR Wilayah
                                </Link>
                            </div>
                        </div>

                        {/* Branch Metrics */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-1">
                                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                    Wilayah Operasional
                                </span>
                                <p className="text-xl font-bold text-zinc-900">{userBranch.region}</p>
                                <span className="text-[11px] text-zinc-500 block truncate">{userBranch.name}</span>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-1">
                                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                    Total Motor Katalog
                                </span>
                                <p className="text-xl font-bold text-zinc-900">{stats.totalBikes || 0} Model</p>
                                <Link href="/admin/motorcycles" className="text-[11px] font-medium text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1">
                                    Lihat Katalog <ChevronRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-1">
                                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                    OTR Wilayah {userBranch.region}
                                </span>
                                <p className="text-xl font-bold text-zinc-900">{stats.customOtrCount || 0} Model</p>
                                <span className="text-[11px] text-zinc-500 block">Terkonfigurasi Khusus</span>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-1">
                                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
                                    Booking Servis Cabang
                                </span>
                                <p className="text-xl font-bold text-zinc-900">{stats.pendingBranchBookings || 0} Antrean</p>
                                <span className="text-[11px] text-zinc-500 block">Total {stats.branchBookingsCount || 0} booking</span>
                            </div>
                        </div>

                        {/* Recent Bookings for this branch */}
                        <div className="bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                <div>
                                    <h3 className="font-bold text-zinc-900 text-sm">Booking Servis Terbaru di Cabang Anda</h3>
                                    <p className="text-xs text-zinc-500">Pelanggan yang memesan antrean servis motor</p>
                                </div>
                                <Link href="/admin/service-bookings" className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 inline-flex items-center gap-1">
                                    Kelola Semua <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            {recentBookings.length === 0 ? (
                                <p className="text-xs text-zinc-400 py-6 text-center">Belum ada booking service terbaru.</p>
                            ) : (
                                <div className="divide-y divide-zinc-100 text-xs">
                                    {recentBookings.map((b) => (
                                        <div key={b.id} className="py-3 flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-zinc-900 text-sm">{b.customer_name}</p>
                                                <p className="text-zinc-500">{b.motorcycle_model} &bull; Jadwal: {b.preferred_date} jam {b.preferred_time}</p>
                                            </div>
                                            <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-800 font-semibold rounded-full text-[10px] uppercase border border-zinc-200">
                                                {b.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* 2. SUPER ADMIN EXECUTIVE BUSINESS DECISION DASHBOARD */
                    <div className="space-y-8">
                        {/* Section Header */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200/80 pb-4">
                            <div>
                                <h2 className="text-lg font-bold tracking-tight text-zinc-900">
                                    Metrik Pengambilan Keputusan Bisnis
                                </h2>
                                <p className="text-xs text-zinc-500 mt-0.5">
                                    Pantau trafik website, produk paling diminati, perilaku pencarian pelanggan, dan konversi prospek kredit secara real-time.
                                </p>
                            </div>
                            <div className="inline-flex items-center gap-2 text-xs font-medium text-zinc-500 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg">
                                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                                <span>Periode: 30 Hari Terakhir</span>
                            </div>
                        </div>

                        {/* Top KPI Metrics Cards (Shadcn Monochrome Minimalist) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Card 1: Website Visits */}
                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-zinc-500">
                                    <span className="text-xs font-semibold uppercase tracking-wider">Total Kunjungan Web</span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                                        <Eye className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold tracking-tight text-zinc-900">
                                        {formatNumber(analytics?.totalPageViews)}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                                        <span className="font-semibold text-emerald-600">+{formatNumber(analytics?.todayViews)}</span>
                                        <span>tampilan halaman hari ini</span>
                                    </p>
                                </div>
                            </div>

                            {/* Card 2: Unique Visitors */}
                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-zinc-500">
                                    <span className="text-xs font-semibold uppercase tracking-wider">Pengunjung Unik</span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                                        <Users className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold tracking-tight text-zinc-900">
                                        {formatNumber(analytics?.totalUniqueVisitors)}
                                    </p>
                                    <p className="text-[11px] text-zinc-500 mt-1 flex items-center gap-1">
                                        <span className="font-semibold text-zinc-800">{formatNumber(analytics?.monthUniqueVisitors)}</span>
                                        <span>pengunjung 30 hari terakhir</span>
                                    </p>
                                </div>
                            </div>

                            {/* Card 3: Mobile Traffic Ratio */}
                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-zinc-500">
                                    <span className="text-xs font-semibold uppercase tracking-wider">Perangkat Mobile</span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                                        <Smartphone className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-bold tracking-tight text-zinc-900">
                                            {analytics?.mobilePercentage}%
                                        </p>
                                        <span className="text-xs text-zinc-500">vs {analytics?.desktopPercentage}% Desktop</span>
                                    </div>
                                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden mt-2">
                                        <div
                                            className="bg-zinc-900 h-full rounded-full transition-all duration-500"
                                            style={{ width: `${analytics?.mobilePercentage}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Card 4: Leads & Conversion */}
                            <div className="bg-white p-5 rounded-xl border border-zinc-200/90 shadow-2xs space-y-3">
                                <div className="flex items-center justify-between text-zinc-500">
                                    <span className="text-xs font-semibold uppercase tracking-wider">Prospek &amp; Konversi</span>
                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-800">
                                        <Target className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-2xl font-bold tracking-tight text-zinc-900">
                                            {formatNumber(stats.totalProspects)}
                                        </p>
                                        <span className="text-xs font-semibold text-emerald-600">
                                            {stats.conversionRate}% Deal
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-zinc-500 mt-1">
                                        {stats.newProspectsCount || 0} prospek baru menunggu follow up
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Visual Traffic Trend Chart & Insights Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Daily Traffic Visualizer (8 cols) */}
                            <div className="lg:col-span-8 bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-zinc-100 pb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                            <BarChart3 className="w-4 h-4 text-zinc-600" />
                                            Tren Trafik Kunjungan (14 Hari Terakhir)
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            Volume halaman dilihat (Page Views) setiap hari
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                                        <div className="flex items-center gap-1.5">
                                            <span className="w-2.5 h-2.5 rounded-sm bg-zinc-900"></span>
                                            <span>Page Views</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Bar Graphic */}
                                <div className="pt-4">
                                    <div className="h-44 flex items-end gap-1.5 sm:gap-2.5 border-b border-zinc-200 pb-2">
                                        {analytics?.trafficTrend?.map((item, idx) => {
                                            const heightPct = Math.max(12, Math.round((item.views / maxDailyViews) * 100));
                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex-1 flex flex-col items-center gap-1.5 group relative"
                                                >
                                                    {/* Tooltip on hover */}
                                                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-zinc-900 text-white text-[10px] font-medium py-1 px-2 rounded shadow-md whitespace-nowrap z-10">
                                                        {item.views} Views ({item.visitors} Unik)
                                                    </div>
                                                    
                                                    {/* Bar element */}
                                                    <div
                                                        className="w-full bg-zinc-200 hover:bg-zinc-900 rounded-t transition-all duration-300"
                                                        style={{ height: `${heightPct}%` }}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Date Axis */}
                                    <div className="flex justify-between text-[10px] text-zinc-400 pt-2 px-1">
                                        {analytics?.trafficTrend?.map((item, idx) => {
                                            // Show every 2nd or 3rd label on small screens
                                            if (idx % 2 === 0 || idx === analytics.trafficTrend.length - 1) {
                                                return <span key={idx}>{item.label}</span>;
                                            }
                                            return <span key={idx} className="hidden sm:inline">{item.label}</span>;
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Device & Strategic Executive Insights (4 cols) */}
                            <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-5 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-sm font-bold text-zinc-900">
                                        Insight Keputusan Strategis
                                    </h3>
                                    <p className="text-xs text-zinc-500 mt-0.5">
                                        Pedoman alokasi anggaran &amp; stok berdasarkan data riil
                                    </p>
                                </div>

                                <div className="space-y-4 text-xs">
                                    {/* Insight 1: Mobile First */}
                                    <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
                                        <div className="flex items-center gap-2 font-semibold text-zinc-900">
                                            <Smartphone className="w-3.5 h-3.5 text-zinc-700" />
                                            <span>Dominasi Mobile ({analytics?.mobilePercentage}%)</span>
                                        </div>
                                        <p className="text-zinc-500 text-[11px] leading-relaxed">
                                            Mayoritas pembeli mengakses website via ponsel pintar. Performa mobile cepat &amp; tombol WhatsApp langsung sangat menentukan closing.
                                        </p>
                                    </div>

                                    {/* Insight 2: Credit Tenor Preference */}
                                    <div className="p-3.5 rounded-lg bg-zinc-50 border border-zinc-200/80 space-y-1">
                                        <div className="flex items-center gap-2 font-semibold text-zinc-900">
                                            <CreditCard className="w-3.5 h-3.5 text-zinc-700" />
                                            <span>Tenor Kredit Paling Diminati</span>
                                        </div>
                                        <p className="text-zinc-500 text-[11px] leading-relaxed">
                                            Konsumen rata-rata memilih skema tenor <strong>{stats.popularTenor || 35} Bulan</strong> dengan estimasi DP terfavorit <strong>{formatRupiah(stats.avgDp || 3500000)}</strong>.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
                                    <span>Tingkat Closing Sales</span>
                                    <span className="font-bold text-zinc-900">{stats.conversionRate || 0}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Top Viewed Products & Most Searched Keywords Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Table: Produk Paling Sering Dilihat (7 cols) */}
                            <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                                <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-zinc-600" />
                                            Produk Paling Sering Dilihat
                                        </h3>
                                        <p className="text-xs text-zinc-500">
                                            Motor dengan minat calon pembeli tertinggi di katalog
                                        </p>
                                    </div>
                                    <Link
                                        href="/admin/motorcycles"
                                        className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-1"
                                    >
                                        Semua Katalog <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                        <thead className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider border-b border-zinc-100">
                                            <tr>
                                                <th className="pb-2.5 w-8">#</th>
                                                <th className="pb-2.5">Model Motor</th>
                                                <th className="pb-2.5">Kategori</th>
                                                <th className="pb-2.5 text-right">Total Dilihat</th>
                                                <th className="pb-2.5 w-24 text-right">Pangsa Minat</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-zinc-100">
                                            {analytics?.topViewedMotorcycles?.map((bike, idx) => (
                                                <tr key={bike.id} className="hover:bg-zinc-50/70 transition-colors">
                                                    <td className="py-3 font-bold text-zinc-400">{idx + 1}</td>
                                                    <td className="py-3">
                                                        <div className="font-semibold text-zinc-900">{bike.name}</div>
                                                        <span className="text-[11px] text-zinc-500">
                                                            {formatRupiah(bike.price_otr)}
                                                        </span>
                                                    </td>
                                                    <td className="py-3">
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 text-zinc-700 border border-zinc-200">
                                                            {bike.category}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right font-bold text-zinc-900">
                                                        {formatNumber(bike.views_count)}x
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-[11px] font-medium text-zinc-600">
                                                                {bike.share_percentage}%
                                                            </span>
                                                            <div className="w-12 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                                                                <div
                                                                    className="bg-zinc-900 h-full rounded-full"
                                                                    style={{ width: `${Math.min(100, bike.share_percentage * 3)}%` }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* List: Kata Kunci Paling Banyak Dicari (5 cols) */}
                            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                                <div className="border-b border-zinc-100 pb-3">
                                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                        <Search className="w-4 h-4 text-zinc-600" />
                                        Kata Kunci Pencarian Terpopuler
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Apa yang paling sering dicari pengunjung di kotak pencarian website
                                    </p>
                                </div>

                                <div className="space-y-2.5">
                                    {analytics?.topSearches?.map((item, idx) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-100 hover:border-zinc-300 hover:bg-zinc-50/60 transition text-xs"
                                        >
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <span className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-700 font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                                                    {idx + 1}
                                                </span>
                                                <span className="font-semibold text-zinc-800 truncate">
                                                    {item.keyword}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-[11px] font-bold text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-md">
                                                    {formatNumber(item.search_count)} pencarian
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Regional Demand Distribution & Lead Pipeline */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                            {/* Regional Demand (6 cols) */}
                            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                                <div className="border-b border-zinc-100 pb-3">
                                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-zinc-600" />
                                        Distribusi Permintaan per Wilayah Cabang
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Volume prospek kredit dan pemesanan servis berdasarkan kota/kabupaten
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {analytics?.regionalDemand?.map((reg) => (
                                        <div key={reg.region} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className="font-semibold text-zinc-800">{reg.region}</span>
                                                <span className="text-zinc-500 font-medium">
                                                    {reg.prospects} Prospek &bull; {reg.bookings} Servis
                                                </span>
                                            </div>
                                            <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-zinc-800 h-full rounded-full transition-all"
                                                    style={{
                                                        width: `${Math.min(100, Math.max(8, (reg.total_demand / Math.max(1, analytics.regionalDemand[0]?.total_demand)) * 100))}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sales Funnel Pipeline (6 cols) */}
                            <div className="lg:col-span-6 bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                                <div className="border-b border-zinc-100 pb-3">
                                    <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                                        <Target className="w-4 h-4 text-zinc-600" />
                                        Pipeline Konversi Prospek &amp; Penjualan
                                    </h3>
                                    <p className="text-xs text-zinc-500">
                                        Perjalanan status prospek calon konsumen dari form simulasi kredit
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                    <div className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase block">Baru</span>
                                        <p className="text-xl font-bold text-zinc-900 mt-1">{stats.newProspectsCount || 0}</p>
                                    </div>
                                    <div className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase block">Dihubungi</span>
                                        <p className="text-xl font-bold text-zinc-900 mt-1">{stats.contactedProspectsCount || 0}</p>
                                    </div>
                                    <div className="p-3 rounded-lg border border-zinc-200/80 bg-zinc-50/50">
                                        <span className="text-[10px] font-semibold text-zinc-500 uppercase block">Proses Leasing</span>
                                        <p className="text-xl font-bold text-zinc-900 mt-1">{stats.inProgressProspectsCount || 0}</p>
                                    </div>
                                    <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40">
                                        <span className="text-[10px] font-semibold text-emerald-800 uppercase block">Deal (Closing)</span>
                                        <p className="text-xl font-bold text-emerald-700 mt-1">{stats.closedWonProspectsCount || 0}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-zinc-900 text-zinc-100 text-xs flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold text-white">Tingkat Keberhasilan Konversi</p>
                                        <p className="text-zinc-400 text-[11px]">Rasio prospek yang berhasil closed won</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-2xl font-bold text-emerald-400">{stats.conversionRate}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Leads & Bookings Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Recent Prospects */}
                            <div className="bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                    <h3 className="font-bold text-zinc-900 text-sm">Prospek Kredit Masuk Terbaru</h3>
                                    <Link href="/admin/prospects" className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-1">
                                        Semua Prospek <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                {recentProspects.length === 0 ? (
                                    <p className="text-xs text-zinc-400 py-6 text-center">Belum ada data prospek.</p>
                                ) : (
                                    <div className="divide-y divide-zinc-100 text-xs">
                                        {recentProspects.map((p) => (
                                            <div key={p.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-zinc-900">{p.name}</p>
                                                    <p className="text-[11px] text-zinc-500">{p.motorcycle_name} &bull; {p.phone}</p>
                                                </div>
                                                <div className="text-right">
                                                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                                                        {p.status}
                                                    </span>
                                                    <p className="text-[11px] font-medium text-zinc-700 mt-0.5">
                                                        {formatRupiah(p.monthly_installment)} /bln
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Recent Service Bookings */}
                            <div className="bg-white p-6 rounded-xl border border-zinc-200/90 shadow-2xs space-y-4">
                                <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                    <h3 className="font-bold text-zinc-900 text-sm">Booking Servis Terakhir</h3>
                                    <Link href="/admin/service-bookings" className="text-xs font-semibold text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-1">
                                        Semua Booking <ChevronRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                {recentBookings.length === 0 ? (
                                    <p className="text-xs text-zinc-400 py-6 text-center">Belum ada booking service.</p>
                                ) : (
                                    <div className="divide-y divide-zinc-100 text-xs">
                                        {recentBookings.map((b) => (
                                            <div key={b.id} className="py-3 flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-zinc-900">{b.customer_name}</p>
                                                    <p className="text-[11px] text-zinc-500">
                                                        {b.motorcycle_model} &bull; {b.branch?.name || 'Cabang'}
                                                    </p>
                                                </div>
                                                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200 uppercase">
                                                    {b.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
