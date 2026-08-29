import React from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

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
        <AdminLayout title="Pengaturan Aturan Loyalty & Ratio Poin">
            <div className="max-w-3xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">Konfigurasi Aturan Loyalty</h2>
                    <p className="text-xs text-slate-500 mt-1">Ubah rasio kelipatan poin per transaksi dan batasan tier tanpa mengubah kode program.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Points Conversion Ratios */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">1. Rasio Kelipatan Poin Per Transaksi (Rp)</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Servis Bengkel (Rp / Poin)</label>
                                <input
                                    type="number"
                                    required
                                    value={data.service_ratio}
                                    onChange={(e) => setData('service_ratio', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 font-semibold"
                                />
                                <span className="text-[10px] text-slate-400">1 Poin tiap kelipatan Rp</span>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Motor Baru (Rp / Poin)</label>
                                <input
                                    type="number"
                                    required
                                    value={data.motor_ratio}
                                    onChange={(e) => setData('motor_ratio', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 font-semibold"
                                />
                                <span className="text-[10px] text-slate-400">1 Poin tiap kelipatan Rp</span>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Spare Part (Rp / Poin)</label>
                                <input
                                    type="number"
                                    required
                                    value={data.sparepart_ratio}
                                    onChange={(e) => setData('sparepart_ratio', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 font-semibold"
                                />
                                <span className="text-[10px] text-slate-400">1 Poin tiap kelipatan Rp</span>
                            </div>
                        </div>
                    </div>

                    {/* Tier Thresholds & Expiry */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest">2. Batas Minimum Tier &amp; Kadaluarsa Poin</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Batas Tier Gold (Poin)</label>
                                <input
                                    type="number"
                                    required
                                    value={data.gold_threshold}
                                    onChange={(e) => setData('gold_threshold', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Batas Tier Platinum (Poin)</label>
                                <input
                                    type="number"
                                    required
                                    value={data.platinum_threshold}
                                    onChange={(e) => setData('platinum_threshold', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 font-semibold"
                                />
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-700 uppercase">Masa Berlaku Poin (Bulan)</label>
                                <input
                                    type="number"
                                    required
                                    value={data.expiry_months}
                                    onChange={(e) => setData('expiry_months', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-lg"
                    >
                        {processing ? 'Menyimpan Settings...' : 'Simpan Pengaturan Aturan Loyalty &rarr;'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
