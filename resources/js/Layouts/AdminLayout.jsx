import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Bike,
    Building2,
    UserCheck,
    Target,
    Wrench,
    QrCode,
    Users,
    Gift,
    Tag,
    SlidersHorizontal,
    Star,
    FileText,
    Megaphone,
    Briefcase,
    Image as ImageIcon,
    ExternalLink,
    LogOut,
    Menu,
    X,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Building,
    Shield,
} from 'lucide-react';

export default function AdminLayout({ title = 'Admin Dashboard', children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const flash = props.flash;

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const isSuperAdmin = props.auth?.isSuperAdmin ?? (user?.role === 'admin' && !user?.branch_id);
    const isBranchAdmin = props.auth?.isBranchAdmin ?? (user?.role === 'branch_admin' || !!user?.branch_id);

    // Grouped Navigation for Super Admin
    const superAdminNavGroups = [
        {
            group: 'Utama',
            items: [
                { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
            ],
        },
        {
            group: 'Katalog & Jaringan',
            items: [
                { name: 'Katalog Motor & OTR', href: '/admin/motorcycles', icon: Bike },
                { name: 'Cabang Dealer', href: '/admin/branches', icon: Building2 },
                { name: 'Admin Cabang', href: '/admin/branch-admins', icon: UserCheck },
            ],
        },
        {
            group: 'Leads & Layanan',
            items: [
                { name: 'Prospect & Kredit', href: '/admin/prospects', icon: Target },
                { name: 'Booking Service', href: '/admin/service-bookings', icon: Wrench },
                { name: 'Moderasi Ulasan', href: '/admin/testimonials', icon: Star },
            ],
        },
        {
            group: 'Konten Website',
            items: [
                { name: 'Galeri & Aktifitas', href: '/admin/activities', icon: ImageIcon },
                { name: 'Artikel & Blog', href: '/admin/articles', icon: FileText },
                { name: 'Promo Banner', href: '/admin/promotions', icon: Megaphone },
                { name: 'Lowongan Kerja', href: '/admin/job-openings', icon: Briefcase },
            ],
        },
        {
            group: 'Program Loyalitas (ALC)',
            items: [
                { name: 'Member Loyalty', href: '/admin/loyalty/members', icon: Users },
                { name: 'Input Poin Kasir', href: '/admin/loyalty/point-input', icon: QrCode },
                { name: 'Klaim Hadiah', href: '/admin/loyalty/redemptions', icon: Gift },
                { name: 'Katalog Hadiah', href: '/admin/loyalty/rewards', icon: Tag },
                { name: 'Aturan & Poin', href: '/admin/loyalty/settings', icon: SlidersHorizontal },
            ],
        },
    ];

    // Branch Admin Specific Navigation
    const branchAdminNavGroups = [
        {
            group: 'Utama',
            items: [
                { name: 'Dashboard Cabang', href: '/admin', icon: LayoutDashboard },
            ],
        },
        {
            group: 'Katalog & OTR',
            items: [
                { name: 'Katalog Motor & OTR', href: '/admin/motorcycles', icon: Bike },
                { name: 'Profil Cabang Dealer', href: '/admin/branches', icon: Building2 },
            ],
        },
        {
            group: 'Operasional Cabang',
            items: [
                { name: 'Booking Service Cabang', href: '/admin/service-bookings', icon: Wrench },
                { name: 'Input Poin Kasir', href: '/admin/loyalty/point-input', icon: QrCode },
            ],
        },
    ];

    const navGroups = (isBranchAdmin && !isSuperAdmin) ? branchAdminNavGroups : superAdminNavGroups;

    const isActive = (path) => {
        if (path === '/admin') return url === '/admin';
        return url.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-zinc-50/70 flex font-sans text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white">
            <Head>
                <title>{`${title} | Aspacindo Management`}</title>
            </Head>

            {/* Sidebar Desktop (Modern Monochrome Shadcn Style) */}
            <aside className="w-64 bg-zinc-950 text-zinc-300 flex-shrink-0 hidden lg:flex flex-col justify-between border-r border-zinc-800/80 sticky top-0 h-screen">
                <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
                    {/* Brand Header */}
                    <div className="px-3 pb-4 border-b border-zinc-800/80 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-950 font-black flex items-center justify-center text-xs tracking-wider shadow-xs">
                            AK
                        </div>
                        <div className="overflow-hidden leading-tight">
                            <span className="font-bold text-sm tracking-tight text-zinc-100 block truncate">
                                ASPACINDO
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium tracking-wide uppercase block">
                                Management Panel
                            </span>
                        </div>
                    </div>

                    {/* Nav Groups */}
                    <nav className="space-y-5">
                        {navGroups.map((group, gIdx) => (
                            <div key={gIdx} className="space-y-1">
                                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest px-3 block">
                                    {group.group}
                                </span>
                                <div className="space-y-0.5 pt-1">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                className={`group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                                    active
                                                        ? 'bg-zinc-100 text-zinc-950 font-semibold shadow-xs'
                                                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                                                }`}
                                            >
                                                <Icon
                                                    className={`w-4 h-4 transition-colors flex-shrink-0 ${
                                                        active ? 'text-zinc-950' : 'text-zinc-400 group-hover:text-zinc-200'
                                                    }`}
                                                />
                                                <span className="truncate">{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </nav>
                </div>

                {/* Bottom User Profile Section */}
                <div className="p-3 border-t border-zinc-800/80 space-y-2.5 bg-zinc-950/60">
                    <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-zinc-900/60 border border-zinc-800/60">
                        <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-200 font-semibold flex items-center justify-center text-xs flex-shrink-0">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                        <div className="overflow-hidden min-w-0 flex-1">
                            <p className="text-xs font-semibold text-zinc-200 truncate">{user?.name || 'Administrator'}</p>
                            <span className="text-[10px] text-zinc-400 font-medium block truncate">
                                {user?.branch ? user.branch.name : (isSuperAdmin ? 'Super Administrator' : 'Staff Admin')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                        <Link
                            href="/"
                            target="_blank"
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-900 hover:bg-zinc-800/80 rounded-md border border-zinc-800 transition"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Lihat Web</span>
                        </Link>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="p-1.5 text-zinc-400 hover:text-red-400 bg-zinc-900 hover:bg-red-950/30 rounded-md border border-zinc-800 hover:border-red-900/50 transition"
                            title="Keluar / Logout"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content Viewport */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Clean Monochrome Top Bar */}
                <header className="bg-white/95 backdrop-blur-md border-b border-zinc-200/90 px-6 py-3.5 flex justify-between items-center sticky top-0 z-30 shadow-2xs">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                            className="lg:hidden p-1.5 rounded-lg text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition"
                            aria-label="Toggle Menu"
                        >
                            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                        
                        <div className="flex items-center gap-2">
                            <h1 className="text-base font-semibold text-zinc-900 tracking-tight">{title}</h1>
                            {user?.branch && (
                                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-zinc-700 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                                    <Building className="w-3 h-3 text-zinc-500" />
                                    {user.branch.name} ({user.branch.region})
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden md:inline-flex items-center gap-2 text-xs text-zinc-500 bg-zinc-100/80 px-2.5 py-1 rounded-full border border-zinc-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span>{user?.email}</span>
                            <span className="text-[10px] font-semibold text-zinc-700 uppercase bg-zinc-200 px-1.5 py-0.5 rounded">
                                {user?.branch ? 'Cabang' : (isSuperAdmin ? 'Pusat' : 'Staff')}
                            </span>
                        </span>

                        <Link
                            href="/"
                            target="_blank"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 px-3 py-1.5 rounded-lg border border-zinc-200 hover:border-zinc-300 bg-white transition"
                        >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Web Publik</span>
                        </Link>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-600 hover:text-red-700 hover:bg-red-50/70 border border-transparent hover:border-red-200 px-2.5 py-1.5 rounded-lg transition"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Logout</span>
                        </Link>
                    </div>
                </header>

                {/* Mobile Drawer */}
                {mobileSidebarOpen && (
                    <div className="lg:hidden bg-zinc-950 text-zinc-300 p-4 space-y-4 border-b border-zinc-800">
                        {navGroups.map((group, idx) => (
                            <div key={idx} className="space-y-1">
                                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest px-2 block">
                                    {group.group}
                                </span>
                                <div className="space-y-1">
                                    {group.items.map((item) => {
                                        const Icon = item.icon;
                                        const active = isActive(item.href);
                                        return (
                                            <Link
                                                key={item.href}
                                                href={item.href}
                                                onClick={() => setMobileSidebarOpen(false)}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                                                    active
                                                        ? 'bg-zinc-100 text-zinc-950 font-bold'
                                                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900'
                                                }`}
                                            >
                                                <Icon className="w-4 h-4" />
                                                <span>{item.name}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Main Content Area */}
                <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
                    {/* Flash Notifications (Clean Monochrome Shadcn Style) */}
                    {flash?.success && (
                        <div className="mb-6 p-4 rounded-xl bg-zinc-900 text-zinc-50 border border-zinc-800 shadow-xs flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 font-medium">
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                                <span>{flash.success}</span>
                            </div>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 p-4 rounded-xl bg-rose-50 text-rose-900 border border-rose-200 shadow-xs flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2.5 font-medium">
                                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                                <span>{flash.error}</span>
                            </div>
                        </div>
                    )}

                    {children}
                </main>
            </div>
        </div>
    );
}
