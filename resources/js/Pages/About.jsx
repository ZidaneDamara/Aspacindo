import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function About({ stats = {}, totalBranches = 20 }) {
    const partnerLogos = [
        { name: 'Busan Auto Finance', label: 'BAF', color: 'border-blue-600 text-blue-700 bg-blue-50' },
        { name: 'Adira Finance', label: 'ADIRA', color: 'border-amber-500 text-amber-600 bg-amber-50' },
        { name: 'Indomobil Finance', label: 'IMFI', color: 'border-blue-700 text-blue-800 bg-blue-50' },
        { name: 'Summit Oto Finance', label: 'SOF / OTO', color: 'border-red-600 text-red-700 bg-red-50' },
        { name: 'Alfa Scorpii', label: 'ALFA SCORPII', color: 'border-slate-800 text-slate-900 bg-slate-100' },
    ];

    return (
        <PublicLayout
            title="PT. Aspacindo Kedaton Motor - Tentang Kami"
            description="Profil resmi PT. Aspacindo Kedaton Motor, dealer resmi sepeda motor Yamaha sejak 1996 di Riau & Sumatera Utara. Melayani penjualan motor baru, bengkel servis berkala, dan suku cadang asli Yamalube."
        >
            {/* PAGE HERO HEADER */}
            <div className="relative bg-slate-950 text-white py-20 border-b border-slate-800 overflow-hidden">
                <div className="absolute inset-0 opacity-25">
                    <img
                        src="/assets/images/promos/hero_banner_yamaha.webp"
                        alt="Background Showroom Aspacindo"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
                    <h1 className="font-play font-bold text-[18px] leading-[27px] uppercase tracking-tight text-white">
                        PT. ASPACINDO KEDATON MOTOR
                    </h1>
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-300">
                        <Link href="/" className="hover:text-amber-400 transition">Beranda</Link>
                        <span>&rsaquo;</span>
                        <span className="text-blue-400">Tentang Kami</span>
                    </div>
                </div>
            </div>

            {/* SEJARAH SECTION */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text */}
                        <div className="space-y-6">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight uppercase">
                                <span className="text-blue-700 italic">SEJARAH</span> PT. ASPACINDO KEDATON MOTOR
                            </h2>
                            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
                                <p>
                                    PT. Aspacindo Kedaton Motor merupakan perusahaan yang bergerak di bidang penjualan sepeda motor merek YAMAHA, Sales, Sparepart dan Bengkel. Perusahaan berdiri pada 19 Desember 1996, berawal dari toko ruko dengan Dealer Yamaha Biasa. Seiring perkembangan dan peningkatan jualan, PT. Aspacindo Kedaton Motor berkembang dan membuka Yamaha 3S di beberapa cabang (Pekanbaru, Air Molek, Kerinci, Perawang dan Sorek).
                                </p>
                                <p>
                                    Pada Tahun 2010 PT Aspacindo Kedaton Motor yang di Pimpin oleh Ibu Desi Yustra Sari Dewi selaku Direktur dan Bapak Suparman S.E., S.H., M.M selaku Area Manager. Perkembangan yang sangat pesat ini berhasil membuka beberapa cabang yaitu di Daerah Sorek, Kerinci, Sip. Beringin, Medan Johar Sungai Pagar, Bangkinang, Garuda Sakti dan Kubang. Tepat pada bulan Januari 2013 PT Aspacindo Kedaton Motor pindah dan membuka cabang di Jl. Riau Ujung No. 88 A-E sebagai kantor Pusat.
                                </p>
                            </div>
                        </div>

                        {/* Image Stack */}
                        <div className="relative flex justify-center items-center">
                            <div className="relative w-full max-w-md space-y-4">
                                <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-slate-100 transform -rotate-2 hover:rotate-0 transition duration-300">
                                    <img
                                        src="/assets/images/promos/hero_banner_yamaha.webp"
                                        alt="Gedung Showroom Utama Aspacindo"
                                        className="w-full h-56 object-cover"
                                    />
                                </div>
                                <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 transform rotate-3 hover:rotate-0 transition duration-300 -mt-12 ml-8">
                                    <img
                                        src="/assets/images/placeholder_bike.webp"
                                        alt="Showroom Motor Yamaha Aspacindo"
                                        className="w-full h-48 object-contain bg-white p-4"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VISI & MISI SECTION */}
            <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="/assets/images/promos/hero_banner_yamaha.webp"
                        alt="Showroom Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/80"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight uppercase">
                            <span className="text-amber-400 italic">VISI &amp; MISI</span> PT. ASPACINDO KEDATON MOTOR
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                        {/* Visi & Misi Box */}
                        <div className="lg:col-span-7 bg-slate-900/90 p-8 sm:p-10 rounded-3xl border border-slate-800 backdrop-blur-md space-y-8 shadow-2xl">
                            {/* VISI */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold uppercase text-amber-400">VISI</h3>
                                </div>
                                <p className="text-slate-200 text-sm font-semibold pl-13 leading-relaxed">
                                    Menjadi Dealer Terbaik &amp; Terpercaya di Sepeda Motor Yamaha.
                                </p>
                            </div>

                            {/* MISI */}
                            <div className="space-y-3 pt-4 border-t border-slate-800">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-red-600 flex items-center justify-center text-white shadow-md">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold uppercase text-amber-400">MISI</h3>
                                </div>
                                <ul className="space-y-2 text-xs text-slate-300 pl-4 list-disc marker:text-blue-400 leading-relaxed">
                                    <li>Melayani pembeli Sepeda Motor Yamaha</li>
                                    <li>Operasional yang efektif dan unggul</li>
                                    <li>Memaksimalkan Potensi Karyawan PT. Aspacindo Kedaton Motor</li>
                                    <li>Sinergi Antara Cabang Dan Merek Yamaha (Teknologi dan Sistem)</li>
                                    <li>Mengembangkan dan meningkatkan Market Share Yamaha</li>
                                    <li>Mendapat Kepuasan Dari Pembeli</li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Side Stats Counter Grid */}
                        <div
                            style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                            className="lg:col-span-5 p-8 sm:p-10 rounded-3xl border border-blue-500/30 shadow-2xl backdrop-blur-md"
                        >
                            <div className="grid grid-cols-2 gap-8 text-center">
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-4xl sm:text-5xl font-bold text-white">28Th</p>
                                    <p className="text-xs font-normal uppercase tracking-wider text-white mt-2">Pengalaman</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-4xl sm:text-5xl font-bold text-white">20+</p>
                                    <p className="text-xs font-normal uppercase tracking-wider text-white mt-2">Penghargaan</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-4xl sm:text-5xl font-bold text-white">100+</p>
                                    <p className="text-xs font-normal uppercase tracking-wider text-white mt-2">Karyawan Aktif</p>
                                </div>
                                <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                    <p className="text-4xl sm:text-5xl font-bold text-white">19</p>
                                    <p className="text-xs font-normal uppercase tracking-wider text-white mt-2">Cabang</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CULTURE ASPACINDO */}
            <section className="py-16 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Title Card */}
                        <div className="lg:col-span-4 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-center">
                            <h2 className="text-2xl font-semibold text-slate-900 tracking-tight uppercase">
                                <span className="text-blue-700 italic block text-xl">CULTURE</span> ASPACINDO
                            </h2>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Kami berkomitmen untuk menciptakan budaya kerja profesional, berintegritas, dan senantiasa berorientasi pada kepuasan pelanggan dalam setiap layanan yang kami berikan.
                            </p>
                        </div>

                        {/* 3 Values Cards */}
                        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                            {/* Antusias */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center shadow-sm border border-blue-100">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 uppercase">Antusias</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Kami bertekad untuk selalu menunjukkan antusiasme dan semangat penuh dalam melayani konsumen.
                                </p>
                            </div>

                            {/* Kreatif */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-sm border border-amber-100">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 uppercase">Kreatif</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Kami selalu berinovasi dengan produk yang ditawarkan serta memberikan solusi terbaik bagi konsumen.
                                </p>
                            </div>

                            {/* Melayani */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-center flex flex-col items-center">
                                <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-sm border border-red-100">
                                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-base font-bold text-slate-900 uppercase">Melayani</h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Keutamaan kami adalah kepuasan konsumen. Kami selalu memberikan pelayanan terbaik terhadap konsumen.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PARTNER SECTION - MARQUEE CAROUSEL */}
            <section className="relative py-20 bg-slate-950 text-white overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="/assets/images/promos/hero_banner_yamaha.webp"
                        alt="Showroom Partner Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-blue-950/80"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight uppercase">
                            <span className="text-blue-400 italic">PARTNER</span> PT. ASPACINDO KEDATON MOTOR
                        </h2>
                        <p className="text-xs text-slate-300 leading-relaxed">
                            Kami bangga bekerja sama dengan berbagai mitra strategis yang berbagi visi dan komitmen kami untuk menghadirkan produk dan layanan yang unggul.
                        </p>
                    </div>

                    {/* Infinite Marquee Track Container */}
                    <div className="relative w-full overflow-hidden py-4">
                        {/* Gradient Fade Masks on sides */}
                        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-slate-950 to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-slate-950 to-transparent z-10 pointer-events-none"></div>

                        <div className="animate-marquee gap-6 flex items-center">
                            {/* Duplicate array twice for seamless 100% smooth loop */}
                            {[...partnerLogos, ...partnerLogos, ...partnerLogos].map((partner, idx) => (
                                <div
                                    key={idx}
                                    className="w-56 sm:w-64 h-28 bg-white rounded-2xl p-6 flex flex-col items-center justify-center shadow-lg border border-slate-100 flex-shrink-0 transition-transform duration-300 hover:scale-105 group"
                                >
                                    <span className={`font-black text-lg tracking-wider ${partner.color.includes('red') ? 'text-red-600' : partner.color.includes('amber') ? 'text-amber-600' : partner.color.includes('blue') ? 'text-blue-700' : 'text-slate-900'}`}>
                                        {partner.label}
                                    </span>
                                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                                        OFFICIAL PARTNER
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* STRUKTUR ORGANISASI SECTION */}
            <section className="py-16 bg-white border-t border-slate-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                    <div className="text-center max-w-2xl mx-auto space-y-2">
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Manajemen &amp; Kepemimpinan</span>
                        <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight uppercase">
                            <span className="text-blue-700 italic">STRUKTUR</span> PT. ASPACINDO KEDATON MOTOR
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Struktur organisasi profesional yang menghubungkan kepemimpinan pusat, pengembangan operasional (Head Office), dan seluruh jajaran manajer cabang resmi.
                        </p>
                    </div>

                    {/* Hierarchy Chart Tree */}
                    <div className="flex flex-col items-center">
                        {/* Level 1: Direktur Utama */}
                        <div
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="w-64 py-4 px-6 rounded-2xl text-white text-center shadow-lg space-y-1 border border-blue-400/20"
                        >
                            <h4 className="text-base font-bold uppercase tracking-wide">Husin</h4>
                            <p className="text-xs text-blue-200 font-medium">Direktur Utama</p>
                        </div>

                        {/* Vertical Connector Line */}
                        <div className="w-0.5 h-8 bg-blue-700"></div>

                        {/* Level 2: Direktur */}
                        <div
                            style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                            className="w-72 py-4 px-6 rounded-2xl text-white text-center shadow-lg space-y-1 border border-blue-400/20"
                        >
                            <h4 className="text-base font-bold uppercase tracking-wide">Desi Yustra Sari Dewi</h4>
                            <p className="text-xs text-blue-200 font-medium">Direktur</p>
                        </div>

                        {/* Vertical Connector Line */}
                        <div className="w-0.5 h-8 bg-blue-700"></div>

                        {/* Level 3: Area Manager & Auditor */}
                        <div className="relative flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 w-full max-w-2xl">
                            {/* Area Manager */}
                            <div
                                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                className="w-80 py-4 px-6 rounded-2xl text-white text-center shadow-lg space-y-1 border border-blue-400/20 z-10"
                            >
                                <h4 className="text-base font-bold uppercase tracking-wide">Suparman, S.E., S.H., M.M.</h4>
                                <p className="text-xs text-blue-200 font-medium">Area Manager</p>
                            </div>

                            {/* Horizontal staff connector line */}
                            <div className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 w-28 h-0.5 bg-blue-700 -z-0"></div>

                            {/* Auditor (Staff Box) */}
                            <div
                                style={{ background: 'linear-gradient(298deg, #0A2872 0%, #0A73BA 97%)' }}
                                className="w-64 py-4 px-5 rounded-2xl text-white text-center shadow-lg space-y-1 border border-blue-400/20 z-10"
                            >
                                <h4 className="text-base font-bold uppercase tracking-wide">Alboin Efendy Sitompul</h4>
                                <p className="text-xs text-blue-200 font-medium">Auditor</p>
                            </div>
                        </div>

                        {/* Vertical Connector Line from Area Manager */}
                        <div className="w-0.5 h-10 bg-blue-700"></div>

                        {/* Horizontal Split Line for BM & Head Office */}
                        <div className="hidden md:block w-full max-w-4xl h-0.5 bg-blue-700"></div>

                        {/* Vertical Drops to Both Wings */}
                        <div className="hidden md:flex justify-between w-full max-w-4xl px-24">
                            <div className="w-0.5 h-6 bg-blue-700"></div>
                            <div className="w-0.5 h-6 bg-blue-700"></div>
                        </div>

                        {/* PARALLEL WINGS: BM ALL CABANG & HEAD OFFICE */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full mt-4">
                            {/* WING 1: BRANCH MANAGER*/}
                            <div className="space-y-3.5 flex flex-col items-center">
                                {/* Wing Header */}
                                <div
                                    style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 100%)' }}
                                    className="w-full py-4 px-6 rounded-2xl text-white text-center shadow-sm border border-blue-900"
                                >
                                    <h3 className="text-base font-bold uppercase text-white tracking-wider">
                                        Branch Manager (BM)
                                    </h3>
                                </div>

                                {/* List of Branch Managers */}
                                <div className="w-full space-y-2.5">
                                    {[
                                        { branch: 'Pekanbaru', name: 'Muss Ajief', role: 'Branch Manager' },
                                        { branch: 'Sorek', name: 'Hendra Irawan', role: 'Branch Manager' },
                                        { branch: 'Kandis', name: 'Fikri', role: 'Branch Manager' },
                                        { branch: 'Air Molek', name: 'Adhi Yan Saputra', role: 'Branch Manager' },
                                        { branch: 'Kandis', name: 'Ade Kurniawan', role: 'Branch Manager' },
                                        { branch: 'Medan', name: 'Tata Suprata', role: 'Branch Manager' },
                                        { branch: 'Tembilahan', name: 'Haidul Hendra', role: 'Branch Manager' },
                                    ].map((bm, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-blue-700 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition flex items-center justify-between gap-4"
                                        >
                                            <div>
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
                                                    {bm.branch}
                                                </span>
                                                <h4 className="text-sm font-bold text-slate-900 tracking-tight mt-0.5">
                                                    {bm.name}
                                                </h4>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200 whitespace-nowrap">
                                                {bm.role}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* WING 2: HEAD OFFICE (AREA DEVELOPMENT) - SEJAJAR DENGAN BM */}
                            <div className="space-y-3.5 flex flex-col items-center">
                                {/* Wing Header */}
                                <div
                                    style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 100%)' }}
                                    className="w-full py-4 px-6 rounded-2xl text-white text-center shadow-sm border border-blue-900"
                                >
                                    <h3 className="text-base font-bold uppercase text-white tracking-wider">
                                        Head Office
                                    </h3>
                                </div>

                                {/* List of Head Office Developments */}
                                <div className="w-full space-y-2.5">
                                    {[
                                        { role: 'Area Part Development', name: 'Muhammad Rizqi Jovy' },
                                        { role: 'Area Service Development', name: 'Angga Harsi Hanggara' },
                                        { role: 'Area Marketing Development', name: '-' },
                                        { role: 'Area Digital Marketing', name: 'Muhammad Zidane Damara' },
                                        { role: 'Area Sosial Media', name: 'Amalia Poetri' },
                                        { role: 'Area Corporate Development', name: 'Adinda Salsabila' },
                                    ].map((ho, idx) => (
                                        <div
                                            key={idx}
                                            className="bg-white rounded-xl border border-slate-200/90 border-l-4 border-l-slate-700 p-4 shadow-2xs hover:shadow-sm hover:border-slate-300 transition flex items-center justify-between gap-4"
                                        >
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-900 tracking-tight mt-0.5">
                                                    {ho.role}
                                                </h4>
                                            </div>
                                            <span className={`text-xs font-semibold px-3 py-1 rounded-lg border whitespace-nowrap ${ho.name === '-'
                                                ? 'bg-slate-50 text-slate-400 border-slate-200'
                                                : 'bg-slate-50 text-slate-800 border-slate-200'
                                                }`}>
                                                {ho.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}
