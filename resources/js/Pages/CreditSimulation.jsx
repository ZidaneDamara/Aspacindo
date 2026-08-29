import React, { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function CreditSimulation({ motorcycles = [], selectedSlug = '', leasingPartners = [] }) {
    const defaultBike = motorcycles.find((m) => m.slug === selectedSlug) || motorcycles[0] || null;

    const [selectedMotorcycle, setSelectedMotorcycle] = useState(defaultBike);
    const [dpPercent, setDpPercent] = useState(20);
    const [tenorMonths, setTenorMonths] = useState(36);
    const [selectedPartner, setSelectedPartner] = useState(leasingPartners[0] || { id: 'baf', name: 'BAF', rate_modifier: 1.0 });

    const [dpAmount, setDpAmount] = useState(0);
    const [loanAmount, setLoanAmount] = useState(0);
    const [monthlyInstallment, setMonthlyInstallment] = useState(0);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    useEffect(() => {
        if (!selectedMotorcycle) return;

        const price = selectedMotorcycle.price_otr;
        const calculatedDp = (price * dpPercent) / 100;
        const principalLoan = price - calculatedDp;

        // Base annual interest rate approx 8%-10% depending on tenor & partner rate modifier
        const baseInterestRate = 0.09 * (selectedPartner.rate_modifier || 1.0);
        const totalInterest = principalLoan * (baseInterestRate * (tenorMonths / 12));
        const totalLoanWithInterest = principalLoan + totalInterest;

        const monthlyPayment = Math.round(totalLoanWithInterest / tenorMonths);

        setDpAmount(calculatedDp);
        setLoanAmount(principalLoan);
        setMonthlyInstallment(monthlyPayment);
    }, [selectedMotorcycle, dpPercent, tenorMonths, selectedPartner]);

    const handleMotorcycleChange = (e) => {
        const found = motorcycles.find((m) => m.id === parseInt(e.target.value));
        if (found) setSelectedMotorcycle(found);
    };

    const whatsappMessage = selectedMotorcycle
        ? `Halo Yamaha Aspacindo, saya ingin mengajukan permohonan kredit motor:
- Motor: ${selectedMotorcycle.name}
- Harga OTR: ${formatRupiah(selectedMotorcycle.price_otr)}
- Uang Muka (DP ${dpPercent}%): ${formatRupiah(dpAmount)}
- Tenor: ${tenorMonths} Bulan
- Estimasi Cicilan: ${formatRupiah(monthlyInstallment)} / bulan
- Leasing: ${selectedPartner.name}
Mohon diproses untuk pengajuan kreditnya. Terima kasih.`
        : '';

    return (
        <PublicLayout title="Simulasi Cicilan Kredit Motor Yamaha OTR Riau">
            {/* Top Banner Header */}
            <div
                style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                className="text-white py-12 border-b border-blue-900 font-['Inter',sans-serif]"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block opacity-90">Kalkulator Interaktif</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white">Simulasi Cicilan Motor Yamaha</h1>
                    <p className="text-blue-100 text-sm mt-2 max-w-xl">
                        Hitung estimasi Uang Muka (DP) dan angsuran bulanan sepeda motor Yamaha impian Anda secara instan dan fleksibel.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-['Inter',sans-serif]">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    {/* Left: Input Form Controls */}
                    <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
                            Parameter Kredit
                        </h3>

                        {/* Motor Dropdown */}
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Pilih Model Sepeda Motor</label>
                            <select
                                value={selectedMotorcycle?.id || ''}
                                onChange={handleMotorcycleChange}
                                className="w-full text-base border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                            >
                                {motorcycles.map((bike) => (
                                    <option key={bike.id} value={bike.id}>
                                        {bike.name} — {formatRupiah(bike.price_otr)} ({bike.category})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* DP Percent Slider */}
                        <div className="space-y-3 pt-2">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Uang Muka (DP %)</label>
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    {dpPercent}% ({formatRupiah(dpAmount)})
                                </span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="50"
                                step="5"
                                value={dpPercent}
                                onChange={(e) => setDpPercent(parseInt(e.target.value))}
                                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                            <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                                <span>10% (Min)</span>
                                <span>25%</span>
                                <span>50% (Maks)</span>
                            </div>
                        </div>

                        {/* Tenor Select */}
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Jangka Waktu Tenor</label>
                            <div className="grid grid-cols-3 gap-3">
                                {[12, 24, 36].map((months) => (
                                    <button
                                        key={months}
                                        type="button"
                                        onClick={() => setTenorMonths(months)}
                                        className={`py-3 rounded-2xl font-bold text-sm border transition ${
                                            tenorMonths === months
                                                ? 'bg-yamaha-blue text-white border-transparent shadow-md'
                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                        }`}
                                    >
                                        {months} Bulan
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Leasing Partner Select */}
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Mitra Finance Leasing</label>
                            <select
                                value={selectedPartner.id}
                                onChange={(e) => {
                                    const p = leasingPartners.find((item) => item.id === e.target.value);
                                    if (p) setSelectedPartner(p);
                                }}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 focus:border-blue-500"
                            >
                                {leasingPartners.map((partner) => (
                                    <option key={partner.id} value={partner.id}>
                                        {partner.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Right: Real-time Calculation Result Card */}
                    <div
                        style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                        className="lg:col-span-5 text-white p-8 rounded-3xl border border-blue-500/30 shadow-xl space-y-6"
                    >
                        <span className="text-xs font-bold text-white uppercase tracking-widest block opacity-90">Hasil Estimasi Cicilan</span>

                        {selectedMotorcycle && (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-2xl font-bold text-white">{selectedMotorcycle.name}</h4>
                                    <p className="text-blue-100 text-xs mt-1">Harga OTR: {formatRupiah(selectedMotorcycle.price_otr)}</p>
                                </div>

                                <div className="p-6 bg-white/10 rounded-2xl border border-white/10 space-y-1 backdrop-blur-sm">
                                    <span className="text-xs text-blue-100 font-semibold uppercase">Estimasi Angsuran Bulanan</span>
                                    <p className="text-3xl sm:text-4xl font-extrabold text-white">
                                        {formatRupiah(monthlyInstallment)}
                                    </p>
                                    <span className="text-[11px] text-blue-100 block pt-1">
                                        Selama {tenorMonths} Bulan (DP {dpPercent}%)
                                    </span>
                                </div>

                                <div className="space-y-2.5 text-xs text-white border-t border-white/15 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-blue-100">Uang Muka (DP):</span>
                                        <span className="font-bold">{formatRupiah(dpAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-100">Pokok Pinjaman:</span>
                                        <span className="font-bold">{formatRupiah(loanAmount)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-blue-100">Mitra Leasing:</span>
                                        <span className="font-bold text-white">{selectedPartner.name}</span>
                                    </div>
                                </div>

                                <a
                                    href={`https://wa.me/6281270001111?text=${encodeURIComponent(whatsappMessage)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition text-sm uppercase tracking-wider"
                                >
                                    Ajukan Pengajuan via WhatsApp &rarr;
                                </a>

                                <p className="text-[10px] text-blue-100 text-center leading-relaxed opacity-90">
                                    *Perhitungan di atas merupakan estimasi sementara. Angsuran final disesuaikan dengan persetujuan survei mitra leasing resmi.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
