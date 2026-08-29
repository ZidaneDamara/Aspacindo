import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer
            style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
            className="text-white pt-16 pb-12 border-t border-blue-900 font-['Inter',sans-serif]"
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
                        <p className="text-sm text-blue-100 leading-relaxed">
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
                        <ul className="space-y-2 text-sm text-blue-100">
                            <li><Link href="/produk" className="hover:text-white transition">Katalog Motor Yamaha</Link></li>
                            <li><Link href="/simulasi-cicilan" className="hover:text-white transition">Simulasi Cicilan OTR</Link></li>
                            <li><Link href="/layanan" className="hover:text-white transition">Booking Service &amp; SKY</Link></li>
                            <li><Link href="/lokasi-dealer" className="hover:text-white transition">Lokasi Dealer &amp; Bengkel</Link></li>
                            <li><Link href="/promo" className="hover:text-white transition">Promo Spesial Yamaha</Link></li>
                            <li><Link href="/loyalty" className="hover:text-white font-bold text-amber-300 transition">Aspacindo Loyalty Club</Link></li>
                        </ul>
                    </div>

                    {/* Operational Regions */}
                    <div className="space-y-3">
                        <h4 className="text-white font-bold text-base uppercase tracking-wider">Jaringan Wilayah</h4>
                        <ul className="space-y-2 text-sm text-blue-100">
                            <li>• Pekanbaru (Nangka, Sudirman, Panam)</li>
                            <li>• Pelalawan (Pangkalan Kerinci)</li>
                            <li>• Siak Sri Indrapura</li>
                            <li>• Kampar (Bangkinang)</li>
                            <li>• Indragiri Hulu (Rengat)</li>
                            <li>• Medan (Kota &amp; Amplas)</li>
                        </ul>
                    </div>

                    {/* Operational Info & Contact */}
                    <div className="space-y-3">
                        <h4 className="text-white font-bold text-base uppercase tracking-wider">Jam Operasional</h4>
                        <div className="text-sm text-blue-100 space-y-1">
                            <p><strong className="text-white">Senin - Sabtu:</strong> 08:00 - 17:00 WIB</p>
                            <p><strong className="text-white">Minggu:</strong> 09:00 - 15:00 WIB (Cabang Tertentu)</p>
                        </div>
                        <div className="pt-3">
                            <h5 className="text-xs uppercase text-blue-200 font-bold tracking-wider opacity-90">Customer Service</h5>
                            <p className="text-xl font-extrabold text-emerald-300 tracking-wide">0812-7000-1111</p>
                            <p className="text-xs text-blue-100">cs@aspacindo.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-blue-200 gap-4">
                    <p>&copy; {new Date().getFullYear()} PT Aspacindo Kedaton Motor. Hak Cipta Dilindungi.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/tentang-kami" className="hover:text-white transition">Tentang Kami</Link>
                        <Link href="/karir" className="hover:text-white transition">Karir</Link>
                        <Link href="/artikel" className="hover:text-white transition">Blog &amp; Berita</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
