import React, { useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';

export default function AdminLayout({ title = 'Admin Dashboard', children }) {
    const { url, props } = usePage();
    const user = props.auth?.user;
    const flash = props.flash;

    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: '📊' },
        { name: 'Prospect / Leads', href: '/admin/prospects', icon: '🎯' },
        { name: 'Katalog Motor', href: '/admin/motorcycles', icon: '🏍️' },
        { name: 'Cabang Dealer', href: '/admin/branches', icon: '🏢' },
        { name: 'Booking Service', href: '/admin/service-bookings', icon: '🛠️' },
        { name: 'Input Poin Kasir', href: '/admin/loyalty/point-input', icon: '📱' },
        { name: 'Member Loyalty', href: '/admin/loyalty/members', icon: '👥' },
        { name: 'Klaim Hadiah', href: '/admin/loyalty/redemptions', icon: '🎁' },
        { name: 'Katalog Hadiah', href: '/admin/loyalty/rewards', icon: '🏷️' },
        { name: 'Aturan Loyalty', href: '/admin/loyalty/settings', icon: '⚙️' },
        { name: 'Moderasi Ulasan', href: '/admin/testimonials', icon: '⭐' },
        { name: 'Artikel & Blog', href: '/admin/articles', icon: '📝' },
        { name: 'Promo Banner', href: '/admin/promotions', icon: '📢' },
        { name: 'Lowongan Kerja', href: '/admin/job-openings', icon: '💼' },
    ];

    const isActive = (path) => {
        if (path === '/admin') return url === '/admin';
        return url.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans text-slate-800">
            <Head>
                <title>{`${title} | Aspacindo Admin`}</title>
            </Head>

            {/* Sidebar Desktop */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden lg:flex flex-col justify-between border-r border-slate-800 sticky top-0 h-screen overflow-y-auto">
                <div>
                    <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                        <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center font-extrabold text-white">
                            A
                        </div>
                        <div>
                            <h2 className="font-black text-sm uppercase tracking-wider text-white">ASPACINDO</h2>
                            <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest block">ADMIN PANEL</span>
                        </div>
                    </div>

                    <nav className="p-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition ${isActive(item.href)
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>

                {/* Bottom User Badge */}
                <div className="p-4 border-t border-slate-800 space-y-3">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-8 h-8 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center text-xs">
                            {user?.name?.charAt(0)}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                            <span className="text-[10px] uppercase font-bold text-amber-400">ROLE: {user?.role}</span>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="block text-center text-xs font-bold text-slate-400 hover:text-white py-2 bg-slate-800 rounded-xl transition"
                    >
                        &larr; Ke Website Utama
                    </Link>
                </div>
            </aside>

            {/* Main Admin Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Header Bar */}
                <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                            ☰
                        </button>
                        <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">{title}</h1>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold">
                        <span className="hidden sm:inline-block px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            Akun: {user?.email} ({user?.role})
                        </span>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="bg-red-50 text-red-600 hover:bg-red-100 px-3.5 py-2 rounded-xl transition"
                        >
                            Logout
                        </Link>
                    </div>
                </header>

                {/* Mobile Drawer */}
                {mobileSidebarOpen && (
                    <div className="lg:hidden bg-slate-900 text-white p-4 space-y-1 border-b border-slate-800">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition ${isActive(item.href) ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                <span>{item.icon}</span>
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="m-6 mb-0 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs font-bold">
                        ✓ {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="m-6 mb-0 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-xs font-bold">
                        ⚠️ {flash.error}
                    </div>
                )}

                {/* Body Content */}
                <main className="p-6 flex-grow">{children}</main>
            </div>
        </div>
    );
}
