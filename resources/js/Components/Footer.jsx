import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer
            style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
            className="text-white pt-16 pb-12 border-t border-blue-900"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/15">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo-aspacindo.png"
                                alt="PT. Aspacindo Kedaton Motor"
                                className="h-12 w-auto object-contain bg-white p-1 rounded-xl shadow-sm"
                            />
                            <div className="h-8 w-px bg-white/20"></div>
                            <img
                                src="/images/logo-yamaha.png"
                                alt="Yamaha Motor Indonesia"
                                className="h-10 w-auto object-contain bg-white p-1 rounded-xl shadow-sm"
                            />
                        </div>
                        <p className="text-sm text-white leading-relaxed">
                            Dealer Resmi Yamaha terpercaya di Riau &amp; Sumatera Utara. Menyediakan unit motor terbaru, suku cadang original, dan layanan servis berkala bergaransi.
                        </p>
                        <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white border border-white/20 backdrop-blur-sm">
                                20+ Jaringan Cabang
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-600/80 text-white border border-red-500/30 shadow-sm">
                                15+ Tahun Pengalaman
                            </span>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="space-y-3">
                        <h4 className="text-white font-bold text-base uppercase tracking-wider">Navigasi Utama</h4>
                        <ul className="space-y-2 text-sm text-white">
                            <li><Link href="/produk" className="text-white hover:text-blue-200 transition">Katalog Motor Yamaha</Link></li>
                            <li><Link href="/simulasi-cicilan" className="text-white hover:text-blue-200 transition">Simulasi Cicilan OTR</Link></li>
                            <li><Link href="/layanan" className="text-white hover:text-blue-200 transition">Booking Service &amp; SKY</Link></li>
                            <li><Link href="/lokasi-dealer" className="text-white hover:text-blue-200 transition">Lokasi Dealer &amp; Bengkel</Link></li>
                            <li><Link href="/promo" className="text-white hover:text-blue-200 transition">Promo Spesial Yamaha</Link></li>
                        </ul>
                    </div>

                    {/* Operational Regions */}
                    <div className="space-y-3">
                        <h4 className="text-white font-bold text-base uppercase tracking-wider">Jaringan Wilayah</h4>
                        <ul className="space-y-2 text-sm text-white">
                            <li className="text-white">• Pekanbaru (Riau Ujung, Riau, Garuda Sakti)</li>
                            <li className="text-white">• Pelalawan (Sorek, Pangkalan Kerinci, Ukui)</li>
                            <li className="text-white">• Siak (Kandis, Siak Sri Indrapura, Perawang, Sabak auh)</li>
                            <li className="text-white">• Kampar (Sungai Pagar, Bangkinang, Petapahan, Lipat Kain)</li>
                            <li className="text-white">• Indragiri Hulu (Air Molek, Belilas, Peranap)</li>
                            <li className="text-white">• Medan (Medan, Pancur Batu)</li>
                            <li className="text-white">• Indragiri Hilir (Tembilahan)</li>
                        </ul>
                    </div>

                    {/* Operational Info & Contact */}
                    <div className="space-y-3">
                        <h4 className="text-white font-bold text-base uppercase tracking-wider">Jam Operasional</h4>
                        <div className="text-sm text-white space-y-1">
                            <p className="text-white"><strong className="text-white">Senin - Sabtu:</strong> 08:00 - 17:00 WIB</p>
                            <p className="text-white"><strong className="text-white">Minggu:</strong> 09:00 - 14:00 WIB</p>
                        </div>
                        <div className="pt-3">
                            <h5 className="text-xs uppercase text-white font-bold tracking-wider opacity-90">Customer Service</h5>
                            <p className="text-xl font-extrabold text-emerald-300 tracking-wide">0812-6224-1100</p>
                            <p className="text-xs text-white">cs@aspacindo.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-white gap-4">
                    <p className="text-white">&copy; {new Date().getFullYear()} PT Aspacindo Kedaton Motor. Hak Cipta Dilindungi.</p>
                    <div className="flex items-center gap-6 text-white">
                        <Link href="/tentang-kami" className="text-white hover:text-blue-200 transition">Tentang Kami</Link>
                        <Link href="/karir" className="text-white hover:text-blue-200 transition">Karir</Link>
                        <Link href="/artikel" className="text-white hover:text-blue-200 transition">Blog &amp; Berita</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
