import React from 'react';
import { Link } from '@inertiajs/react';

export default function Footer() {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
                    {/* Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/images/logo-aspacindo.png"
                                alt="PT. Aspacindo Kedaton Motor"
                                className="h-12 w-auto object-contain bg-white p-1 rounded-xl"
                            />
                            <div className="h-8 w-px bg-slate-700"></div>
                            <img
                                src="/images/logo-yamaha.png"
                                alt="Yamaha Motor Indonesia"
                                className="h-10 w-auto object-contain bg-white p-1 rounded-xl"
                            />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Dealer Resmi Yamaha terpercaya di Riau &amp; Sumatera Utara. Menyediakan unit motor terbaru, suku cadang original, dan layanan servis berkala bergaransi.
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                                20+ Jaringan Cabang
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-950 text-red-300 border border-red-800">
                                15+ Tahun Pengalaman
                            </span>
                        </div>
                    </div>

                    {/* Quick Navigation */}
                    <div className="space-y-3">
                        <h4 className="text-white font-bold text-base uppercase tracking-wider">Navigasi Utama</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/produk" className="hover:text-blue-400 transition">Katalog Motor Yamaha</Link></li>
                            <li><Link href="/simulasi-cicilan" className="hover:text-blue-400 transition">Simulasi Cicilan OTR</Link></li>
                            <li><Link href="/layanan" className="hover:text-blue-400 transition">Booking Service &amp; SKY</Link></li>
                            <li><Link href="/lokasi-dealer" className="hover:text-blue-400 transition">Lokasi Dealer &amp; Bengkel</Link></li>
                            <li><Link href="/promo" className="hover:text-blue-400 transition">Promo Spesial Yamaha</Link></li>
                            <li><Link href="/loyalty" className="hover:text-amber-400 transition">Aspacindo Loyalty Club</Link></li>
                        </ul>
                    </div>

                    {/* Operational Regions */}
                    <div className="space-y-3">
                        <h4 className="text-white font-bold text-base uppercase tracking-wider">Jaringan Wilayah</h4>
                        <ul className="space-y-2 text-sm text-slate-400">
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
                        <div className="text-sm text-slate-400 space-y-1">
                            <p><strong className="text-white">Senin - Sabtu:</strong> 08:00 - 17:00 WIB</p>
                            <p><strong className="text-white">Minggu:</strong> 09:00 - 15:00 WIB (Cabang Tertentu)</p>
                        </div>
                        <div className="pt-3">
                            <h5 className="text-xs uppercase text-slate-500 font-bold tracking-wider">Customer Service</h5>
                            <p className="text-lg font-extrabold text-emerald-400">0812-7000-1111</p>
                            <p className="text-xs text-slate-400">cs@aspacindo.com</p>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
                    <p>&copy; {new Date().getFullYear()} PT Aspacindo Kedaton Motor. Hak Cipta Dilindungi.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/tentang-kami" className="hover:text-slate-400 transition">Tentang Kami</Link>
                        <Link href="/karir" className="hover:text-slate-400 transition">Karir</Link>
                        <Link href="/artikel" className="hover:text-slate-400 transition">Blog &amp; Berita</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
