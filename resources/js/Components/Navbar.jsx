import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
    const { url, props } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const authUser = props.auth?.user;

    const navItems = [
        { name: 'Beranda', href: '/' },
        { name: 'Produk', href: '/produk' },
        { name: 'Simulasi Cicilan', href: '/simulasi-cicilan' },
        { name: 'Layanan', href: '/layanan' },
        { name: 'Lokasi Dealer', href: '/lokasi-dealer' },
        { name: 'Promo', href: '/promo' },
        { name: 'Artikel', href: '/artikel' },
        { name: 'Program Loyalty', href: '/loyalty' },
        { name: 'Tentang Kami', href: '/tentang-kami' },
    ];

    const isActive = (path) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    return (
        <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
            {/* Top Bar */}
            <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                            Dealer Resmi Yamaha Riau &amp; Sumatera Utara (20+ Cabang)
                        </span>
                        <span>Hotline: <strong className="text-white">0812-7000-1111</strong></span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/karir" className="hover:text-white transition">Karir</Link>
                        <span className="text-slate-700">|</span>
                        <Link href="/testimoni" className="hover:text-white transition">Testimoni</Link>
                        <span className="text-slate-700">|</span>
                        {authUser ? (
                            <Link href={authUser.role === 'admin' || authUser.role === 'staff' ? '/admin' : '/loyalty/dashboard'} className="text-amber-400 hover:text-amber-300 font-semibold">
                                Dashboard ({authUser.name})
                            </Link>
                        ) : (
                            <Link href="/loyalty" className="text-blue-400 hover:text-blue-300 font-semibold">
                                Member Login / Register
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Brand Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-gradient-to-tr from-blue-700 to-blue-900 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-md group-hover:scale-105 transition duration-300">
                            A
                        </div>
                        <div className="flex flex-col">
                            <span className="font-black text-slate-900 text-lg tracking-wider uppercase leading-tight group-hover:text-blue-700 transition">
                                ASPACINDO
                            </span>
                            <span className="text-[10px] font-bold text-red-600 tracking-widest uppercase">
                                KEDATON MOTOR — YAMAHA
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1 xl:gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                    isActive(item.href)
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                        : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden lg:flex items-center gap-3">
                        <Link
                            href="/layanan#booking"
                            className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-md hover:shadow-lg transition duration-200"
                        >
                            Booking Service
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Dropdown Menu */}
                {mobileMenuOpen && (
                    <div className="lg:hidden border-t border-slate-100 py-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-2.5 rounded-lg text-base font-semibold transition ${
                                    isActive(item.href)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-slate-700 hover:bg-slate-100'
                                }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="pt-4 border-t border-slate-100 px-4 space-y-2">
                            <Link
                                href="/layanan#booking"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center bg-red-600 text-white font-bold py-3 rounded-lg shadow-md"
                            >
                                Booking Service
                            </Link>
                            <Link
                                href="/loyalty"
                                onClick={() => setMobileMenuOpen(false)}
                                className="block w-full text-center bg-slate-900 text-amber-400 font-bold py-3 rounded-lg shadow-md"
                            >
                                Aspacindo Loyalty Portal
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
