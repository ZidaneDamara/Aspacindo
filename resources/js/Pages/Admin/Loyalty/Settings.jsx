import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Settings as SettingsIcon, Sliders, CheckCircle2 } from 'lucide-react';

export default function Settings({ settings = {} }) {
    const { data, setData, post, processing } = useForm({
        service_ratio: settings.service_ratio || 1000,
        motor_ratio: settings.motor_ratio || 50000,
        sparepart_ratio: settings.sparepart_ratio || 2000,
        referral_points: settings.referral_points || 50,
        expiry_months: settings.expiry_months || 12,
        gold_threshold: settings.tier_thresholds?.Gold || 1000,
        platinum_threshold: settings.tier_thresholds?.Platinum || 5000,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/loyalty/settings');
    };

    return (
        <AdminLayout title="Pengaturan Aturan Loyalty &amp; Rasio Poin">
            <Head title="Pengaturan Aturan Loyalty | Admin" />

            <div className="max-w-3xl space-y-6">
                <div className="border-b border-zinc-200 pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                        Konfigurasi Aturan Loyalty Club
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        Sesuaikan rasio kelipatan poin per transaksi, batas minimum tier membership, dan masa aktif poin.
                    </p>
                </div>

                <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-2xs space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Points Conversion Ratios */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Sliders className="w-3.5 h-3.5 text-zinc-500" />
                                1. Rasio Kelipatan Poin Per Transaksi (Rp)
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Servis Bengkel</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.service_ratio}
                                        onChange={(e) => setData('service_ratio', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                    />
                                    <span className="text-[10px] text-zinc-400 block">1 Poin tiap kelipatan Rp</span>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Motor Baru</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.motor_ratio}
                                        onChange={(e) => setData('motor_ratio', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                    />
                                    <span className="text-[10px] text-zinc-400 block">1 Poin tiap kelipatan Rp</span>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Spare Part</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.sparepart_ratio}
                                        onChange={(e) => setData('sparepart_ratio', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                    />
                                    <span className="text-[10px] text-zinc-400 block">1 Poin tiap kelipatan Rp</span>
                                </div>
                            </div>
                        </div>

                        {/* Tier Thresholds & Expiry */}
                        <div className="space-y-4 pt-4 border-t border-zinc-200">
                            <h4 className="text-xs font-semibold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                                <SettingsIcon className="w-3.5 h-3.5 text-zinc-500" />
                                2. Batas Minimum Tier &amp; Masa Berlaku Poin
                            </h4>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Batas Tier Gold</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.gold_threshold}
                                        onChange={(e) => setData('gold_threshold', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                    />
                                    <span className="text-[10px] text-zinc-400 block">Akumulasi poin</span>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Batas Tier Platinum</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.platinum_threshold}
                                        onChange={(e) => setData('platinum_threshold', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                    />
                                    <span className="text-[10px] text-zinc-400 block">Akumulasi poin</span>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Masa Berlaku (Bulan)</label>
                                    <input
                                        type="number"
                                        required
                                        value={data.expiry_months}
                                        onChange={(e) => setData('expiry_months', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                    />
                                    <span className="text-[10px] text-zinc-400 block">Sebelum poin hangus</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-lg text-xs uppercase tracking-wider transition shadow-xs disabled:opacity-50"
                            >
                                {processing ? 'Menyimpan Aturan...' : 'Simpan Pengaturan Aturan Loyalty'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
