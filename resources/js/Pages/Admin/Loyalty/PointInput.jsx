import React, { useState, useEffect } from 'react';
import { useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function PointInput({ member = null, search = '', rules = {} }) {
    const [searchInput, setSearchInput] = useState(search);
    const [calculatedPoints, setCalculatedPoints] = useState(0);

    const { data, setData, post, processing, errors } = useForm({
        member_id: member?.id || '',
        source: 'service',
        transaction_amount: '',
        reference_number: '',
        notes: '',
    });

    useEffect(() => {
        if (member) {
            setData('member_id', member.id);
        }
    }, [member]);

    useEffect(() => {
        const amount = parseFloat(data.transaction_amount) || 0;
        if (amount <= 0) {
            setCalculatedPoints(0);
            return;
        }

        let pts = 0;
        if (data.source === 'service') {
            pts = Math.floor(amount / (rules.service || 1000));
        } else if (data.source === 'motor_purchase') {
            pts = Math.floor(amount / (rules.motor_purchase || 50000));
        } else if (data.source === 'sparepart_purchase') {
            pts = Math.floor(amount / (rules.sparepart_purchase || 2000));
        } else {
            pts = Math.floor(amount); // direct points
        }
        setCalculatedPoints(pts);
    }, [data.transaction_amount, data.source, rules]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        router.get('/admin/loyalty/point-input', { search: searchInput }, { preserveState: true });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        post('/admin/loyalty/point-input');
    };

    return (
        <AdminLayout title="Input Poin Transaksi Off-Line (Kasir / Dealer)">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* MEMBER SEARCH BAR */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                        Langkah 1: Cari Member Loyalty
                    </h3>
                    <p className="text-xs text-slate-500">Scan QR Code member (format ALC-XXXXXXXX) atau ketik nomor HP terdaftar.</p>

                    <form onSubmit={handleSearchSubmit} className="flex gap-3">
                        <input
                            type="text"
                            placeholder="Contoh: 081234567890 atau ALC-98A72B10"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            className="flex-1 text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow"
                        >
                            Cari Member &rarr;
                        </button>
                    </form>

                    {member ? (
                        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between">
                            <div>
                                <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                                    Member Ditemukan
                                </span>
                                <h4 className="font-black text-slate-900 text-base mt-1">{member.user?.name}</h4>
                                <p className="text-xs text-slate-600 font-mono">Kode: {member.member_code} | HP: {member.phone_number}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-bold text-slate-500 block">Saldo Poin</span>
                                <span className="text-2xl font-black text-emerald-700">{member.points_balance} Poin</span>
                            </div>
                        </div>
                    ) : (
                        search && <p className="text-xs text-red-500 font-bold">Member dengan nomor / kode "{search}" tidak ditemukan.</p>
                    )}
                </div>

                {/* POINT INPUT FORM */}
                {member && (
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">
                            Langkah 2: Input Transaksi &amp; Hitung Poin
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Transaction Source */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Jenis Transaksi</label>
                                    <select
                                        value={data.source}
                                        onChange={(e) => setData('source', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                                    >
                                        <option value="service">Servis Berkala Bengkel (Rp 1.000 = 1 Poin)</option>
                                        <option value="motor_purchase">Pembelian Motor Baru (Rp 50.000 = 1 Poin)</option>
                                        <option value="sparepart_purchase">Pembelian Spare Part (Rp 2.000 = 1 Poin)</option>
                                        <option value="referral">Bonus Referral Teman (Poin Langsung)</option>
                                        <option value="event">Bonus Event Dealership (Poin Langsung)</option>
                                    </select>
                                </div>

                                {/* Transaction Amount */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">
                                        {data.source.includes('purchase') || data.source === 'service' ? 'Nominal Transaksi (Rp)' : 'Jumlah Poin Bonus'}
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Contoh: 250000"
                                        value={data.transaction_amount}
                                        onChange={(e) => setData('transaction_amount', e.target.value)}
                                        className="w-full text-base border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                                    />
                                </div>

                                {/* Reference Number */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Nomor Faktur / No. Nota (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: INV/2026/08/001"
                                        value={data.reference_number}
                                        onChange={(e) => setData('reference_number', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5"
                                    />
                                </div>
                            </div>

                            {/* Calculated Points Preview */}
                            <div className="bg-slate-900 text-white p-6 rounded-2xl flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-amber-400 font-bold uppercase block">Kalkulasi Poin Otomatis</span>
                                    <p className="text-xs text-slate-400">Poin yang akan ditambahkan ke saldo member</p>
                                </div>
                                <span className="text-3xl font-black text-amber-400">+{calculatedPoints} POIN</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || calculatedPoints <= 0}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-wider shadow-lg transition disabled:opacity-50"
                            >
                                {processing ? 'Memproses Input...' : 'Tambahkan Poin Ke Member &rarr;'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
