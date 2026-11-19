import React, { useState, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, PlusCircle, CheckCircle2, UserCheck, AlertCircle } from 'lucide-react';

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
        <AdminLayout title="Input Poin Transaksi Off-Line">
            <Head title="Input Poin Kasir | Admin" />

            <div className="max-w-4xl mx-auto space-y-6">
                <div className="border-b border-zinc-200 pb-4">
                    <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                        Input Poin Transaksi Kasir / Dealer
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        Tambahkan poin reward loyalitas konsumen dari transaksi servis bengkel, pembelian motor, atau suku cadang.
                    </p>
                </div>

                {/* STEP 1: MEMBER SEARCH BAR */}
                <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-4">
                    <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider">
                        Langkah 1: Cari Member Loyalty
                    </h3>
                    <p className="text-xs text-zinc-500">Scan QR Code member (format ALC-XXXXXXXX) atau ketik nomor HP terdaftar.</p>

                    <form onSubmit={handleSearchSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Contoh: 081234567890 atau ALC-98A72B10"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full text-xs pl-9 pr-3 py-2.5 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition shadow-xs"
                        >
                            Cari Member
                        </button>
                    </form>

                    {member ? (
                        <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold text-sm">
                                    <UserCheck className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-zinc-900 text-sm">{member.user?.name}</h4>
                                        <span className="text-[10px] font-semibold text-zinc-800 bg-zinc-200/80 px-2 py-0.5 rounded-md uppercase">
                                            {member.tier}
                                        </span>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-mono mt-0.5">Kode: {member.member_code} &bull; HP: {member.phone_number}</p>
                                </div>
                            </div>
                            <div className="text-left sm:text-right">
                                <span className="text-xs text-zinc-500 block">Saldo Poin Saat Ini</span>
                                <span className="text-xl font-bold font-mono text-zinc-900">{new Intl.NumberFormat('id-ID').format(member.points_balance)} Poin</span>
                            </div>
                        </div>
                    ) : (
                        search && (
                            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
                                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                                <span>Member dengan nomor / kode "{search}" tidak ditemukan di database.</span>
                            </div>
                        )
                    )}
                </div>

                {/* STEP 2: POINT INPUT FORM */}
                {member && (
                    <div className="bg-white p-5 rounded-xl border border-zinc-200 shadow-2xs space-y-5">
                        <h3 className="font-semibold text-zinc-900 text-sm uppercase tracking-wider">
                            Langkah 2: Rincian Transaksi &amp; Perhitungan Poin
                        </h3>

                        <form onSubmit={handleFormSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Jenis Transaksi</label>
                                    <select
                                        value={data.source}
                                        onChange={(e) => setData('source', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-medium bg-white"
                                    >
                                        <option value="service">Servis Berkala Bengkel (Rp 1.000 = 1 Poin)</option>
                                        <option value="motor_purchase">Pembelian Motor Baru (Rp 50.000 = 1 Poin)</option>
                                        <option value="sparepart_purchase">Pembelian Spare Part (Rp 2.000 = 1 Poin)</option>
                                        <option value="referral">Bonus Referral Teman (Poin Langsung)</option>
                                        <option value="event">Bonus Event Dealership (Poin Langsung)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">
                                        {data.source.includes('purchase') || data.source === 'service' ? 'Nominal Transaksi (Rp)' : 'Jumlah Poin Bonus'}
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Contoh: 250000"
                                        value={data.transaction_amount}
                                        onChange={(e) => setData('transaction_amount', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-semibold"
                                    />
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-semibold text-zinc-700 uppercase">Nomor Faktur / No. Nota (Opsional)</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: INV/2026/08/001"
                                        value={data.reference_number}
                                        onChange={(e) => setData('reference_number', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                                    />
                                </div>
                            </div>

                            {/* Calculated Points Preview */}
                            <div className="bg-zinc-900 text-white p-4 rounded-xl flex items-center justify-between shadow-xs">
                                <div>
                                    <span className="text-xs text-zinc-400 font-semibold uppercase block">Kalkulasi Poin Otomatis</span>
                                    <p className="text-xs text-zinc-300 mt-0.5">Poin yang akan langsung ditambahkan ke saldo member</p>
                                </div>
                                <span className="text-2xl font-bold font-mono text-white">+{calculatedPoints} POIN</span>
                            </div>

                            <button
                                type="submit"
                                disabled={processing || calculatedPoints <= 0}
                                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-semibold py-3 rounded-lg text-xs uppercase tracking-wider shadow-xs transition disabled:opacity-50"
                            >
                                {processing ? 'Memproses Input...' : 'Tambahkan Poin Ke Member'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
