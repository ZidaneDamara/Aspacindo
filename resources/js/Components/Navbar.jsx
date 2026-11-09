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
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex justify-between items-center">
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2 text-white">
                            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
                            DEALER RESMI YAMAHA RIAU &amp; SUMUT
                        </span>
                        <span className="text-slate-400">HOTLINE: <strong className="text-white font-semibold">0812-6224-1100</strong></span>
                    </div>

                    <div className="flex items-center gap-5">
                        <Link href="/karir" className="hover:text-amber-400 transition">KARIR</Link>
                        <span className="text-slate-700">|</span>
                        <Link href="/galeri-aktifitas" className="hover:text-amber-400 transition">AKTIVITAS</Link>
                        {authUser && (
                            <>
                                <span className="text-slate-700">|</span>
                                <Link href={['admin', 'branch_admin', 'staff'].includes(authUser.role) ? '/admin' : '/loyalty/dashboard'} className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5">
                                    <svg className="w-3 h-3 inline-block fill-current" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                    <span>{authUser.name} ({authUser.role === 'branch_admin' ? 'ADMIN CABANG' : authUser.role.toUpperCase()})</span>
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
                            <button type="submit" aria-label="Search" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white flex items-center justify-center">
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* MAIN NAVBAR - Wide Layout with Logo & CTA at Edges and Balanced Gap */}
            <nav className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-slate-100">
                <div className="flex justify-between items-center h-20 w-full gap-4 lg:gap-8 xl:gap-12">
                    {/* Brand Logos (Aspacindo Kedaton Motor & Yamaha Official) - Flush Left */}
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

                    {/* Desktop Navigation Links - Centered with Seamless Connecting Tabs */}
                    <div className="hidden lg:flex items-center justify-center h-20 gap-0 -space-x-px flex-1">
                        {/* BERANDA */}
                        <div className="h-full flex items-center">
                            <Link
                                href="/"
                                className={`nav-link-item h-full px-4 xl:px-5 flex items-center justify-center font-play font-bold text-[14px] leading-[27px] uppercase transition-all duration-200 whitespace-nowrap group ${isActive('/')
                                        ? 'active bg-yamaha-blue text-white transform -skew-x-12'
                                        : 'text-[#182A61] hover:bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12'
                                    }`}
                            >
                                <span className={`nav-link-text inline-block font-play font-bold transition-transform duration-200 ${isActive('/')
                                        ? 'text-white transform skew-x-12'
                                        : 'text-[#182A61] group-hover:text-white group-hover:transform group-hover:skew-x-12'
                                    }`}>
                                    BERANDA
                                </span>
                            </Link>
                        </div>

                        {/* TENTANG KAMI Dropdown */}
                        <div className="h-full flex items-center relative group">
                            <button
                                className={`nav-link-item h-full px-4 xl:px-5 flex items-center justify-center gap-1.5 font-play font-bold text-[14px] leading-[27px] uppercase transition-all duration-200 whitespace-nowrap ${isActive('/tentang-kami') || isActive('/lokasi-dealer') || isActive('/galeri-aktifitas')
                                        ? 'active bg-yamaha-blue text-white transform -skew-x-12'
                                        : 'text-[#182A61] group-hover:bg-yamaha-blue group-hover:text-white group-hover:transform group-hover:-skew-x-12'
                                    }`}
                            >
                                <span className={`nav-link-text inline-flex items-center gap-1.5 font-play font-bold transition-transform duration-200 ${isActive('/tentang-kami') || isActive('/lokasi-dealer') || isActive('/galeri-aktifitas')
                                        ? 'text-white transform skew-x-12'
                                        : 'text-[#182A61] group-hover:text-white group-hover:transform group-hover:skew-x-12'
                                    }`}>
                                    TENTANG KAMI
                                    <svg
                                        className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${isActive('/tentang-kami') || isActive('/lokasi-dealer') || isActive('/galeri-aktifitas')
                                                ? 'text-white stroke-white'
                                                : 'text-[#182A61] stroke-[#182A61] group-hover:text-white group-hover:stroke-white'
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div className="absolute left-0 top-full hidden group-hover:block w-56 pt-1 z-50">
                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 space-y-1">
                                    <Link
                                        href="/tentang-kami"
                                        className="block px-4 py-2.5 font-sans text-sm text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition border-b border-slate-100/60"
                                    >
                                        PT. Aspacindo Kedaton Motor
                                    </Link>
                                    <Link
                                        href="/lokasi-dealer"
                                        className="block px-4 py-2.5 font-sans text-sm text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition border-b border-slate-100/60"
                                    >
                                        Jaringan Dealer
                                    </Link>
                                    <Link
                                        href="/galeri-aktifitas"
                                        className="block px-4 py-2.5 font-sans text-sm text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition"
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
                                className={`nav-link-item h-full px-4 xl:px-5 flex items-center justify-center font-play font-bold text-[14px] leading-[27px] uppercase transition-all duration-200 whitespace-nowrap group ${isActive('/produk')
                                        ? 'active bg-yamaha-blue text-white transform -skew-x-12'
                                        : 'text-[#182A61] hover:bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12'
                                    }`}
                            >
                                <span className={`nav-link-text inline-block font-play font-bold transition-transform duration-200 ${isActive('/produk')
                                        ? 'text-white transform skew-x-12'
                                        : 'text-[#182A61] group-hover:text-white group-hover:transform group-hover:skew-x-12'
                                    }`}>
                                    PRODUK
                                </span>
                            </Link>
                        </div>

                        {/* SIMULASI CICILAN */}
                        <div className="h-full flex items-center">
                            <Link
                                href="/simulasi-cicilan"
                                className={`nav-link-item h-full px-4 xl:px-5 flex items-center justify-center font-play font-bold text-[14px] leading-[27px] uppercase transition-all duration-200 whitespace-nowrap group ${isActive('/simulasi-cicilan')
                                        ? 'active bg-yamaha-blue text-white transform -skew-x-12'
                                        : 'text-[#182A61] hover:bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12'
                                    }`}
                            >
                                <span className={`nav-link-text inline-block font-play font-bold transition-transform duration-200 ${isActive('/simulasi-cicilan')
                                        ? 'text-white transform skew-x-12'
                                        : 'text-[#182A61] group-hover:text-white group-hover:transform group-hover:skew-x-12'
                                    }`}>
                                    SIMULASI CICILAN
                                </span>
                            </Link>
                        </div>

                        {/* LAYANAN Dropdown */}
                        <div className="h-full flex items-center relative group">
                            <button
                                className={`nav-link-item h-full px-4 xl:px-5 flex items-center justify-center gap-1.5 font-play font-bold text-[14px] leading-[27px] uppercase transition-all duration-200 whitespace-nowrap ${isActive('/layanan')
                                        ? 'active bg-yamaha-blue text-white transform -skew-x-12'
                                        : 'text-[#182A61] group-hover:bg-yamaha-blue group-hover:text-white group-hover:transform group-hover:-skew-x-12'
                                    }`}
                            >
                                <span className={`nav-link-text inline-flex items-center gap-1.5 font-play font-bold transition-transform duration-200 ${isActive('/layanan')
                                        ? 'text-white transform skew-x-12'
                                        : 'text-[#182A61] group-hover:text-white group-hover:transform group-hover:skew-x-12'
                                    }`}>
                                    LAYANAN
                                    <svg
                                        className={`w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180 ${isActive('/layanan')
                                                ? 'text-white stroke-white'
                                                : 'text-[#182A61] stroke-[#182A61] group-hover:text-white group-hover:stroke-white'
                                            }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </span>
                            </button>
                            <div className="absolute left-0 top-full hidden group-hover:block w-48 pt-1 z-50">
                                <div className="bg-white rounded-xl shadow-xl border border-slate-100 py-2 space-y-1">
                                    <Link
                                        href="/layanan#booking"
                                        className="block px-4 py-2.5 font-sans text-sm text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition border-b border-slate-100/60"
                                    >
                                        Service
                                    </Link>
                                    <Link
                                        href="/sparepart"
                                        className="block px-4 py-2.5 font-sans text-sm text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition"
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
                                className={`nav-link-item h-full px-4 xl:px-5 flex items-center justify-center font-play font-bold text-[14px] leading-[27px] uppercase transition-all duration-200 whitespace-nowrap group ${isActive('/artikel')
                                        ? 'active bg-yamaha-blue text-white transform -skew-x-12'
                                        : 'text-[#182A61] hover:bg-yamaha-blue hover:text-white hover:transform hover:-skew-x-12'
                                    }`}
                            >
                                <span className={`nav-link-text inline-block font-play font-bold transition-transform duration-200 ${isActive('/artikel')
                                        ? 'text-white transform skew-x-12'
                                        : 'text-[#182A61] group-hover:text-white group-hover:transform group-hover:skew-x-12'
                                    }`}>
                                    ARTIKEL
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Desktop CTA Button - Flush Right */}
                    <div className="hidden lg:flex items-center flex-shrink-0">
                        <Link
                            href="/layanan#booking"
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="text-white font-play text-[17px] leading-[26px] font-normal uppercase px-6 py-2.5 rounded-full shadow-md hover:brightness-110 transition duration-200 whitespace-nowrap"
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
                    <div className="lg:hidden border-t border-slate-200 py-3 space-y-1 bg-white text-slate-800">
                        <Link href="/" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 font-play font-bold text-[16px] leading-[27px] uppercase text-black hover:text-blue-700">BERANDA</Link>

                        <div className="px-4 py-2 space-y-1 bg-slate-50 rounded-xl my-1 border border-slate-100">
                            <span className="font-play text-[14px] text-blue-700 font-bold uppercase tracking-wider block">TENTANG KAMI</span>
                            <Link href="/tentang-kami" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm font-sans text-slate-700">PT. Aspacindo Kedaton Motor</Link>
                            <Link href="/lokasi-dealer" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm font-sans text-slate-700">Jaringan Dealer</Link>
                            <Link href="/galeri-aktifitas" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm font-sans text-slate-700">Galeri &amp; Aktifitas</Link>
                        </div>

                        <Link href="/produk" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 font-play font-bold text-[16px] leading-[27px] uppercase text-black hover:text-blue-700">PRODUK</Link>
                        <Link href="/simulasi-cicilan" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 font-play font-bold text-[16px] leading-[27px] uppercase text-black hover:text-blue-700">SIMULASI CICILAN</Link>

                        <div className="px-4 py-2 space-y-1 bg-slate-50 rounded-xl my-1 border border-slate-100">
                            <span className="font-play text-[14px] text-blue-700 font-bold uppercase tracking-wider block">LAYANAN</span>
                            <Link href="/layanan#booking" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm font-sans text-slate-700">Service</Link>
                            <Link href="/sparepart" onClick={() => setMobileMenuOpen(false)} className="block py-1 text-sm font-sans text-slate-700">Sparepart</Link>
                        </div>

                        <Link href="/artikel" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 font-play font-bold text-[16px] leading-[27px] uppercase text-black hover:text-blue-700">ARTIKEL</Link>

                        <div className="pt-3 border-t border-slate-200 px-4 space-y-2">
                            <Link
                                href="/layanan#booking"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                className="block w-full text-center text-white font-play text-[17px] leading-[26px] font-normal py-2.5 rounded-full uppercase tracking-wider shadow-md hover:brightness-110 transition"
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
