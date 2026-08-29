import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';

export default function Navbar({ categoryBar = null }) {
    const { url, props } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const authUser = props.auth?.user;

    const isActive = (path) => {
        if (path === '/') return url === '/';
        return url.startsWith(path);
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/produk', { search: searchQuery });
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white shadow-sm font-sans">
            {/* TOP BAR - Yamaha Official Dark Utility Bar */}
            <div className="bg-slate-950 text-slate-300 text-[11px] font-medium uppercase tracking-wider py-1.5 px-4 hidden md:block border-b border-slate-800">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-white">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            DEALER RESMI YAMAHA RIAU &amp; SUMUT
                        </span>
                        <span className="text-slate-400">HOTLINE: <strong className="text-white font-semibold">0812-7000-1111</strong></span>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/karir" className="hover:text-amber-400 transition">KARIR</Link>
                        <span className="text-slate-700">|</span>
                        <Link href="/galeri-aktifitas" className="hover:text-amber-400 transition">AKTIVITAS</Link>
                        {authUser && (
                            <>
                                <span className="text-slate-700">|</span>
                                <Link href={authUser.role === 'admin' || authUser.role === 'staff' ? '/admin' : '/loyalty/dashboard'} className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1">
                                    👤 {authUser.name} ({authUser.role.toUpperCase()})
                                </Link>
                            </>
                        )}

                        {/* Search Bar Input */}
                        <form onSubmit={handleSearchSubmit} className="relative ml-2">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-slate-900 border border-slate-700 text-white placeholder-slate-400 text-[10px] rounded-full px-3 py-1 pr-7 w-40 focus:outline-none focus:border-blue-500 font-normal"
                            />
                            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                                🔍
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* MAIN NAVBAR - Matching Previous Slim Corporate Font Weight */}
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-slate-100">
                <div className="flex justify-between items-center h-20">
                    {/* Brand Logos (Aspacindo Kedaton Motor & Yamaha Official) */}
                    <Link href="/" className="flex items-center gap-3 md:gap-4 flex-shrink-0 py-1.5 group">
                        <img
                            src="/images/logo-aspacindo.png"
                            alt="PT. Aspacindo Kedaton Motor"
                            className="h-12 md:h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="h-9 w-px bg-slate-200"></div>
                        <img
                            src="/images/logo-yamaha.png"
                            alt="Yamaha Motor Indonesia - Semakin Di Depan"
                            className="h-10 md:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation Links - Full Height (h-20) Slanted Hover Tabs (Slim Corporate Font) */}
                    <div className="hidden lg:flex items-center h-20 gap-0 flex-shrink-0">
                        {/* BERANDA */}
                        <div className="h-full flex items-center">
                            <Link
                                href="/"
                                className={`h-full px-3.5 flex items-center justify-center text-[12px] md:text-[13px] font-semibold tracking-normal uppercase transition-all duration-200 whitespace-nowrap group ${
                                    isActive('/')
                                        ? 'bg-yamaha-blue text-white transform -skew-x-12 px-5 shadow-sm'
                                        : 'text-slate-800 hover-bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12 hover:px-5'
                                }`}
                            >
                                <span className={`inline-block transition-transform duration-200 ${
                                    isActive('/') ? 'transform skew-x-12' : 'group-hover:transform group-hover:skew-x-12'
                                }`}>
                                    BERANDA
                                </span>
                            </Link>
                        </div>

                        {/* TENTANG KAMI Dropdown */}
                        <div className="h-full flex items-center relative group">
                            <button
                                className={`h-full px-3.5 flex items-center justify-center gap-1 text-[12px] md:text-[13px] font-semibold tracking-normal uppercase transition-all duration-200 whitespace-nowrap ${
                                    isActive('/tentang-kami') || isActive('/lokasi-dealer') || isActive('/galeri-aktifitas')
                                        ? 'bg-yamaha-blue text-white transform -skew-x-12 px-5 shadow-sm'
                                        : 'text-slate-800 group-hover:bg-yamaha-blue group-hover:text-white group-hover:transform group-hover:-skew-x-12 group-hover:px-5'
                                }`}
                            >
                                <span className={`inline-flex items-center gap-1 transition-transform duration-200 ${
                                    isActive('/tentang-kami') || isActive('/lokasi-dealer') || isActive('/galeri-aktifitas')
                                        ? 'transform skew-x-12'
                                        : 'group-hover:transform group-hover:skew-x-12'
                                }`}>
                                    TENTANG KAMI <span className="text-[10px] transition-transform duration-200 group-hover:rotate-180">▾</span>
                                </span>
                            </button>
                            <div className="absolute left-0 top-full hidden group-hover:block w-56 pt-1 z-50">
                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 space-y-1">
                                    <Link
                                        href="/tentang-kami"
                                        className="block px-4 py-2.5 text-xs font-semibold text-slate-800 hover:text-blue-700 hover:bg-slate-50 transition border-b border-slate-100/60"
                                    >
                                        PT. Aspacindo Kedaton Motor
                                    </Link>
                                    <Link
                                        href="/lokasi-dealer"
                                        className="block px-4 py-2.5 text-xs font-semibold text-slate-800 hover:text-blue-700 hover:bg-slate-50 transition border-b border-slate-100/60"
                                    >
                                        Jaringan Dealer
                                    </Link>
                                    <Link
                                        href="/galeri-aktifitas"
                                        className="block px-4 py-2.5 text-xs font-semibold text-slate-800 hover:text-blue-700 hover:bg-slate-50 transition"
                                    >
                                        Galeri &amp; Aktifitas
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* PRODUK */}
                        <div className="h-full flex items-center">
                            <Link
                                href="/produk"
                                className={`h-full px-3.5 flex items-center justify-center text-[12px] md:text-[13px] font-semibold tracking-normal uppercase transition-all duration-200 whitespace-nowrap group ${
                                    isActive('/produk')
                                        ? 'bg-yamaha-blue text-white transform -skew-x-12 px-5 shadow-sm'
                                        : 'text-slate-800 hover-bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12 hover:px-5'
                                }`}
                            >
                                <span className={`inline-block transition-transform duration-200 ${
                                    isActive('/produk') ? 'transform skew-x-12' : 'group-hover:transform group-hover:skew-x-12'
                                }`}>
                                    PRODUK
                                </span>
                            </Link>
                        </div>

                        {/* SIMULASI CICILAN */}
                        <div className="h-full flex items-center">
                            <Link
                                href="/simulasi-cicilan"
                                className={`h-full px-3.5 flex items-center justify-center text-[12px] md:text-[13px] font-semibold tracking-normal uppercase transition-all duration-200 whitespace-nowrap group ${
                                    isActive('/simulasi-cicilan')
                                        ? 'bg-yamaha-blue text-white transform -skew-x-12 px-5 shadow-sm'
                                        : 'text-slate-800 hover-bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12 hover:px-5'
                                }`}
                            >
                                <span className={`inline-block transition-transform duration-200 ${
                                    isActive('/simulasi-cicilan') ? 'transform skew-x-12' : 'group-hover:transform group-hover:skew-x-12'
                                }`}>
                                    SIMULASI CICILAN
                                </span>
                            </Link>
                        </div>

                        {/* LAYANAN Dropdown */}
                        <div className="h-full flex items-center relative group">
                            <button
                                className={`h-full px-3.5 flex items-center justify-center gap-1 text-[12px] md:text-[13px] font-semibold tracking-normal uppercase transition-all duration-200 whitespace-nowrap ${
                                    isActive('/layanan')
                                        ? 'bg-yamaha-blue text-white transform -skew-x-12 px-5 shadow-sm'
                                        : 'text-slate-800 group-hover:bg-yamaha-blue group-hover:text-white group-hover:transform group-hover:-skew-x-12 group-hover:px-5'
                                }`}
                            >
                                <span className={`inline-flex items-center gap-1 transition-transform duration-200 ${
                                    isActive('/layanan') ? 'transform skew-x-12' : 'group-hover:transform group-hover:skew-x-12'
                                }`}>
                                    LAYANAN <span className="text-[10px] transition-transform duration-200 group-hover:rotate-180">▾</span>
                                </span>
                            </button>
                            <div className="absolute left-0 top-full hidden group-hover:block w-48 pt-1 z-50">
                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 space-y-1">
                                    <Link
                                        href="/layanan#booking"
                                        className="block px-4 py-2.5 text-xs font-semibold text-slate-800 hover:text-blue-700 hover:bg-slate-50 transition border-b border-slate-100/60"
                                    >
                                        Service
                                    </Link>
                                    <Link
                                        href="/sparepart"
                                        className="block px-4 py-2.5 text-xs font-semibold text-slate-800 hover:text-blue-700 hover:bg-slate-50 transition"
                                    >
                                        Sparepart
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ARTIKEL */}
                        <div className="h-full flex items-center">
                            <Link
                                href="/artikel"
                                className={`h-full px-3.5 flex items-center justify-center text-[12px] md:text-[13px] font-semibold tracking-normal uppercase transition-all duration-200 whitespace-nowrap group ${
                                    isActive('/artikel')
                                        ? 'bg-yamaha-blue text-white transform -skew-x-12 px-5 shadow-sm'
                                        : 'text-slate-800 hover-bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12 hover:px-5'
                                }`}
                            >
                                <span className={`inline-block transition-transform duration-200 ${
                                    isActive('/artikel') ? 'transform skew-x-12' : 'group-hover:transform group-hover:skew-x-12'
                                }`}>
                                    ARTIKEL
                                </span>
                            </Link>
                        </div>

                        {/* LOYALTY */}
                        <div className="h-full flex items-center">
                            <Link
                                href="/loyalty"
                                className={`h-full px-3.5 flex items-center justify-center text-[12px] md:text-[13px] font-semibold tracking-normal uppercase transition-all duration-200 whitespace-nowrap group ${
                                    isActive('/loyalty')
                                        ? 'bg-yamaha-blue text-white transform -skew-x-12 px-5 shadow-sm'
                                        : 'text-slate-800 hover-bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12 hover:px-5'
                                }`}
                            >
                                <span className={`inline-block transition-transform duration-200 ${
                                    isActive('/loyalty') ? 'transform skew-x-12' : 'group-hover:transform group-hover:skew-x-12'
                                }`}>
                                    LOYALTY
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop CTA Button */}
                    <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
                        <Link
                            href="/layanan#booking"
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-full shadow-md hover:brightness-110 transition duration-200 whitespace-nowrap"
                        >
                            BOOKING SERVICE
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle Button */}
                    <div className="lg:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-slate-900 hover:bg-slate-100 focus:outline-none"
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
                    <div className="lg:hidden border-t border-slate-200 py-3 space-y-1 bg-white text-slate-800 font-semibold">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-xs uppercase">BERANDA</Link>

                        <div className="px-4 py-2 space-y-1 bg-slate-50 rounded-xl my-1 border border-slate-100">
                            <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">TENTANG KAMI</span>
                            <Link href="/tentang-kami" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs">PT. Aspacindo Kedaton Motor</Link>
                            <Link href="/lokasi-dealer" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs">Jaringan Dealer</Link>
                            <Link href="/galeri-aktifitas" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs">Galeri &amp; Aktifitas</Link>
                        </div>

                        <Link href="/produk" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-xs uppercase">PRODUK</Link>
                        <Link href="/simulasi-cicilan" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-xs uppercase">SIMULASI CICILAN</Link>

                        <div className="px-4 py-2 space-y-1 bg-slate-50 rounded-xl my-1 border border-slate-100">
                            <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider block">LAYANAN</span>
                            <Link href="/layanan#booking" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs">Service</Link>
                            <Link href="/layanan#sparepart" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-xs">Sparepart</Link>
                        </div>

                        <Link href="/artikel" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-xs uppercase">ARTIKEL</Link>
                        <Link href="/loyalty" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-xs uppercase">LOYALTY</Link>

                        <div className="pt-3 border-t border-slate-200 px-4 space-y-2">
                            <Link
                                href="/layanan#booking"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                className="block w-full text-center text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider shadow-md hover:brightness-110 transition"
                            >
                                BOOKING SERVICE
                            </Link>
                        </div>
                    </div>
                )}
            </nav>
            {categoryBar}
        </header>
    );
}
