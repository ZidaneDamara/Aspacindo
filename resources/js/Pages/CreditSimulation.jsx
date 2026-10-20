import React, { useState, useEffect } from 'react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function CreditSimulation({
    motorcycles = [],
    selectedSlug = '',
    leasingPartners = [],
    regions = [],
    selectedRegion = 'Pekanbaru',
}) {
    const defaultRegions = [
        'Pekanbaru',
        'Siak',
        'Kampar',
        'Pelalawan',
        'Indragiri Hulu',
        'Indragiri Hilir',
        'Medan',
    ];
    const allRegions = regions.length > 0 ? regions : defaultRegions;

    const { flash } = usePage().props;
    const defaultBike = motorcycles.find((m) => m.slug === selectedSlug) || motorcycles[0] || null;

    const [currentRegion, setCurrentRegion] = useState(selectedRegion || 'Pekanbaru');
    const [selectedMotorcycle, setSelectedMotorcycle] = useState(defaultBike);
    const [dpPercent, setDpPercent] = useState(20);
    const [tenorMonths, setTenorMonths] = useState(36);
    const [selectedPartner, setSelectedPartner] = useState(leasingPartners[0] || { id: 'baf', name: 'BAF (Bussan Auto Finance)', rate_modifier: 1.0 });

    const [dpAmount, setDpAmount] = useState(0);
    const [loanAmount, setLoanAmount] = useState(0);
    const [monthlyInstallment, setMonthlyInstallment] = useState(0);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [lastSubmittedProspect, setLastSubmittedProspect] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        phone: '',
        email: '',
        city: 'Kota Pekanbaru',
        address: '',
        current_motorcycle: 'Belum Punya Motor',
        motorcycle_id: defaultBike?.id || '',
        region: selectedRegion || 'Pekanbaru',
        dp_percent: 20,
        tenor_months: 36,
        leasing_partner: leasingPartners[0]?.name || 'BAF (Bussan Auto Finance)',
        notes: '',
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number || 0);
    };

    const getPriceForCurrentRegion = (bike, reg) => {
        if (!bike) return 0;
        const targetRegion = reg || currentRegion;
        if (bike.regional_prices && bike.regional_prices[targetRegion]) {
            return bike.regional_prices[targetRegion];
        }
        return bike.price_otr || 0;
    };

    // Calculate real-time simulation preview
    useEffect(() => {
        if (!selectedMotorcycle) return;

        const price = getPriceForCurrentRegion(selectedMotorcycle, currentRegion);
        const calculatedDp = (price * dpPercent) / 100;
        const principalLoan = price - calculatedDp;

        const baseInterestRate = 0.09 * (selectedPartner.rate_modifier || 1.0);
        const totalInterest = principalLoan * (baseInterestRate * (tenorMonths / 12));
        const totalLoanWithInterest = principalLoan + totalInterest;

        const monthlyPayment = Math.round(totalLoanWithInterest / tenorMonths);

        setDpAmount(calculatedDp);
        setLoanAmount(principalLoan);
        setMonthlyInstallment(monthlyPayment);

        // Keep useForm synced with interactive parameters
        setData((prev) => ({
            ...prev,
            motorcycle_id: selectedMotorcycle.id,
            region: currentRegion,
            dp_percent: dpPercent,
            tenor_months: tenorMonths,
            leasing_partner: selectedPartner.name,
        }));
    }, [selectedMotorcycle, currentRegion, dpPercent, tenorMonths, selectedPartner]);

    // Check if flash contains submitted prospect
    useEffect(() => {
        if (flash?.submittedProspect) {
            setLastSubmittedProspect(flash.submittedProspect);
            setShowSuccessModal(true);
        }
    }, [flash]);

    const handleMotorcycleChange = (e) => {
        const bikeId = parseInt(e.target.value);
        const found = motorcycles.find((m) => m.id === bikeId);
        if (found) {
            setSelectedMotorcycle(found);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/simulasi-cicilan', {
            preserveScroll: true,
            onSuccess: (page) => {
                if (page.props.flash?.submittedProspect) {
                    setLastSubmittedProspect(page.props.flash.submittedProspect);
                    setShowSuccessModal(true);
                }
            },
        });
    };

    const buildWhatsAppMessage = () => {
        if (!lastSubmittedProspect && !selectedMotorcycle) return '';
        const currentPrice = getPriceForCurrentRegion(selectedMotorcycle, currentRegion);
        const p = lastSubmittedProspect || {
            ticket_number: 'SIMULASI-LANGSUNG',
            name: data.name || 'Customer',
            motorcycle_name: selectedMotorcycle?.name,
            price_otr: currentPrice,
            dp_amount: dpAmount,
            dp_percent: dpPercent,
            tenor_months: tenorMonths,
            monthly_installment: monthlyInstallment,
            leasing_partner: selectedPartner.name,
        };

        return `Halo Yamaha Aspacindo, saya mengajukan simulasi cicilan kredit motor:
📌 *KODE TIKET:* ${p.ticket_number}
📍 *Wilayah OTR:* Area ${currentRegion}
👤 *Nama:* ${p.name}
🏍️ *Motor:* ${p.motorcycle_name}
💰 *Harga OTR:* ${formatRupiah(p.price_otr)}
💵 *Uang Muka (DP ${p.dp_percent}%):* ${formatRupiah(p.dp_amount)}
📅 *Tenor:* ${p.tenor_months} Bulan
📊 *Estimasi Cicilan:* ${formatRupiah(p.monthly_installment)} / bulan
🏢 *Leasing:* ${p.leasing_partner}

Mohon dapat dibantu untuk survey dan proses berkas kreditnya. Terima kasih!`;
    };

    return (
        <PublicLayout title="Simulasi Cicilan & Pengajuan Kredit Motor Yamaha OTR Riau">
            <Head>
                <title>Simulasi Cicilan Kredit Motor Yamaha | Aspacindo Riau</title>
                <meta
                    name="description"
                    content="Kalkulator simulasi kredit motor Yamaha OTR Riau. Hitung DP, angsuran bulanan, dan ajukan kredit langsung terdata ke database kami."
                />
            </Head>

            {/* Top Banner Header */}
            <div
                style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                className="text-white py-12 border-b border-blue-900 font-['Inter',sans-serif]"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block opacity-90">Kalkulator Kredit &amp; Form Lead Prospect</span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-1">
                        Simulasi Cicilan Motor Yamaha
                    </h1>
                    <p className="text-blue-100 text-sm mt-2 max-w-2xl leading-relaxed">
                        Isi data diri dan hitung estimasi Uang Muka (DP) serta angsuran bulanan sepeda motor Yamaha impian Anda. Data Anda akan langsung tersimpan di sistem sales resmi Yamaha Aspacindo Riau untuk di-follow up dengan penawaran terbaik!
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-['Inter',sans-serif]">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    
                    {/* Left & Middle Column: Form Inputs */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* SECTION 1: INFORMASI DATA DIRI CUSTOMER */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                    1
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Informasi Data Diri</h3>
                                    <p className="text-xs text-slate-500">Data customer akan tersimpan untuk pemrosesan survey &amp; pengajuan kredit</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {/* Nama Lengkap */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Nama Lengkap <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Masukkan nama lengkap sesuai KTP"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.name && <p className="text-xs text-red-600 font-semibold">{errors.name}</p>}
                                </div>

                                {/* Nomor Handphone / WA */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        No. Handphone / WhatsApp <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        placeholder="08XXXXXXXXXX"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.phone && <p className="text-xs text-red-600 font-semibold">{errors.phone}</p>}
                                </div>

                                {/* Email */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Alamat Email <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="nama@email.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    {errors.email && <p className="text-xs text-red-600 font-semibold">{errors.email}</p>}
                                </div>

                                {/* Kota / Kabupaten */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Kota / Kabupaten Domisili
                                    </label>
                                    <select
                                        value={data.city}
                                        onChange={(e) => setData('city', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Kota Pekanbaru">Kota Pekanbaru</option>
                                        <option value="Kab. Kampar">Kab. Kampar</option>
                                        <option value="Kota Dumai">Kota Dumai</option>
                                        <option value="Kab. Bengkalis">Kab. Bengkalis</option>
                                        <option value="Kab. Siak">Kab. Siak</option>
                                        <option value="Kab. Pelalawan">Kab. Pelalawan</option>
                                        <option value="Kab. Rokan Hulu">Kab. Rokan Hulu</option>
                                        <option value="Kab. Rokan Hilir">Kab. Rokan Hilir</option>
                                        <option value="Kab. Kuantan Singingi">Kab. Kuantan Singingi</option>
                                        <option value="Kab. Indragiri Hulu">Kab. Indragiri Hulu</option>
                                        <option value="Kab. Indragiri Hilir">Kab. Indragiri Hilir</option>
                                        <option value="Kab. Kepulauan Meranti">Kab. Kepulauan Meranti</option>
                                    </select>
                                </div>

                                {/* Motor Yang Dimiliki Sekarang */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Motor yang Dimiliki Saat Ini
                                    </label>
                                    <select
                                        value={data.current_motorcycle}
                                        onChange={(e) => setData('current_motorcycle', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="Belum Punya Motor">Belum Punya Motor</option>
                                        <option value="Matik Yamaha (Mio/Fazzio/NMAX/Aerox/dll)">Matik Yamaha (Mio/Fazzio/NMAX/Aerox/dll)</option>
                                        <option value="Bebek Yamaha (Jupiter/Vega/MX/dll)">Bebek Yamaha (Jupiter/Vega/MX/dll)</option>
                                        <option value="Sport Yamaha (Vixion/R15/MT/dll)">Sport Yamaha (Vixion/R15/MT/dll)</option>
                                        <option value="Motor Merk Lain">Motor Merk Lain</option>
                                    </select>
                                </div>

                                {/* Alamat Lengkap */}
                                <div className="space-y-1.5 sm:col-span-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                        Alamat Lengkap Tempat Tinggal <span className="text-slate-400 font-normal">(Opsional)</span>
                                    </label>
                                    <textarea
                                        rows="2"
                                        placeholder="Nama Jalan, RT/RW, Kecamatan, Kelurahan"
                                        value={data.address}
                                        onChange={(e) => setData('address', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500"
                                    ></textarea>
                                </div>
                            </div>
                        </div>


                        {/* SECTION 2: PARAMETER SIMULASI KREDIT */}
                        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                                    2
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Parameter Simulasi Kredit</h3>
                                    <p className="text-xs text-slate-500">Pilih tipe motor, besar DP, jangka tenor, dan leasing mitra</p>
                                </div>
                            </div>

                            {/* Region Dropdown */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Pilih Wilayah OTR Cabang <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={currentRegion}
                                    onChange={(e) => {
                                        const reg = e.target.value;
                                        setCurrentRegion(reg);
                                        if (typeof window !== 'undefined') {
                                            localStorage.setItem('aspacindo_preferred_region', reg);
                                        }
                                    }}
                                    className="w-full text-base border-blue-200 rounded-2xl p-4 focus:ring-blue-500 focus:border-blue-500 font-bold bg-blue-50/70 text-slate-900"
                                >
                                    {allRegions.map((reg) => (
                                        <option key={reg} value={reg}>
                                            Area {reg}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Motor Dropdown */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Pilih Model Sepeda Motor Yamaha <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={selectedMotorcycle?.id || ''}
                                    onChange={handleMotorcycleChange}
                                    className="w-full text-base border-slate-200 rounded-2xl p-4 focus:ring-blue-500 focus:border-blue-500 font-bold bg-slate-50"
                                >
                                    {motorcycles.map((bike) => (
                                        <option key={bike.id} value={bike.id}>
                                            {bike.name} — OTR {formatRupiah(getPriceForCurrentRegion(bike, currentRegion))} ({bike.category})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* DP Percent Slider */}
                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                                        Uang Muka (DP %)
                                    </label>
                                    <span className="text-sm font-extrabold text-blue-600 bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
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
                                    className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                                <div className="flex justify-between text-[11px] font-bold text-slate-400">
                                    <span>10% (DP Minimum)</span>
                                    <span>25%</span>
                                    <span>50% (DP Maksimum)</span>
                                </div>
                            </div>

                            {/* Tenor Select */}
                            <div className="space-y-2 pt-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Jangka Waktu Tenor Kredit
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                    {[12, 24, 36, 48].map((months) => (
                                        <button
                                            key={months}
                                            type="button"
                                            onClick={() => setTenorMonths(months)}
                                            className={`py-3 rounded-2xl font-black text-sm border transition ${
                                                tenorMonths === months
                                                    ? 'bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20 scale-[1.02]'
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
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Pilih Mitra Finance Leasing
                                </label>
                                <select
                                    value={selectedPartner.name}
                                    onChange={(e) => {
                                        const p = leasingPartners.find((item) => item.name === e.target.value);
                                        if (p) setSelectedPartner(p);
                                    }}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                                >
                                    {leasingPartners.map((partner) => (
                                        <option key={partner.id} value={partner.name}>
                                            {partner.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Catatan Tambahan */}
                            <div className="space-y-1.5 pt-2">
                                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                                    Catatan / Pertanyaan Tambahan <span className="text-slate-400 font-normal">(Opsional)</span>
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder="Contoh: Minta dikontak via WA jam 2 siang, butuh rincian warna hitam, dll..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500"
                                ></textarea>
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Real-time Calculation Result Card & Submit Action */}
                    <div className="lg:col-span-5 sticky top-6 space-y-6">
                        <div
                            style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                            className="text-white p-8 rounded-3xl border border-blue-500/30 shadow-2xl space-y-6 relative overflow-hidden"
                        >
                            <div className="flex justify-between items-center border-b border-white/15 pb-4">
                                <div>
                                    <span className="text-xs font-bold text-white uppercase tracking-widest block opacity-90">
                                        Hasil Estimasi Cicilan
                                    </span>
                                    <h4 className="text-xl font-black text-white mt-0.5">Ringkasan Kredit</h4>
                                </div>
                                <span className="px-3 py-1 bg-blue-500/30 text-white rounded-full text-[11px] font-bold border border-white/20">
                                    Real-Time
                                </span>
                            </div>

                            {selectedMotorcycle && (
                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-2xl font-black text-white">{selectedMotorcycle.name}</h4>
                                        <p className="text-blue-100 text-xs mt-1 font-medium">
                                            Harga OTR Area {currentRegion}: <span className="font-bold text-white">{formatRupiah(getPriceForCurrentRegion(selectedMotorcycle, currentRegion))}</span>
                                        </p>
                                    </div>

                                    <div className="p-6 bg-white/10 rounded-2xl border border-white/15 space-y-1 backdrop-blur-md">
                                        <span className="text-xs text-blue-100 font-bold uppercase tracking-wider block">
                                            Estimasi Angsuran Bulanan
                                        </span>
                                        <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                                            {formatRupiah(monthlyInstallment)}
                                        </p>
                                        <span className="text-[11px] text-blue-100 block pt-1 font-medium">
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

                                    {/* Primary Form Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-black py-4 rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition text-sm uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {processing ? (
                                            <span>Menyimpan data prospect...</span>
                                        ) : (
                                            <>
                                                <span>Simpan &amp; Ajukan Simulasi Kredit</span>
                                                <span>&rarr;</span>
                                            </>
                                        )}
                                    </button>

                                    <p className="text-[10px] text-blue-100 text-center leading-relaxed opacity-90">
                                        *Data pribadi Anda tersimpan aman dan hanya digunakan untuk kebutuhan konfirmasi &amp; survey pengajuan kredit motor Yamaha Aspacindo.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </form>
            </div>

            {/* SUCCESS SUBMISSION MODAL */}
            {showSuccessModal && lastSubmittedProspect && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
                            ✓
                        </div>

                        <div>
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                                Data Prospect Tersimpan!
                            </span>
                            <h3 className="text-2xl font-black text-slate-900 mt-2">Pengajuan Kredit Diterima</h3>
                            <p className="text-xs text-slate-500 mt-1 font-mono font-bold text-blue-600">
                                KODE TIKET: {lastSubmittedProspect.ticket_number}
                            </p>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left text-xs space-y-2">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Nama Customer:</span>
                                <span className="font-bold text-slate-900">{lastSubmittedProspect.name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">No. WhatsApp:</span>
                                <span className="font-bold text-slate-900">{lastSubmittedProspect.phone}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Motor Pilihan:</span>
                                <span className="font-bold text-slate-900">{lastSubmittedProspect.motorcycle_name}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Estimasi Cicilan:</span>
                                <span className="font-black text-emerald-600">
                                    {formatRupiah(lastSubmittedProspect.monthly_installment)} / bln
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">DP ({lastSubmittedProspect.dp_percent}%):</span>
                                <span className="font-bold text-slate-900">{formatRupiah(lastSubmittedProspect.dp_amount)}</span>
                            </div>
                        </div>

                        <p className="text-xs text-slate-600">
                            Tim Sales resmi Yamaha Aspacindo Riau akan segera menghubungi Anda. Anda juga dapat langsung melanjutkan chat via WhatsApp sekarang:
                        </p>

                        <div className="space-y-3 pt-2">
                            <a
                                href={`https://wa.me/6281270001111?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition text-sm uppercase tracking-wider"
                            >
                                💬 Lanjutkan Diskusi via WhatsApp Sales &rarr;
                            </a>

                            <button
                                type="button"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    reset();
                                }}
                                className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-2xl transition text-xs"
                            >
                                Hitung Simulasi Lainnya
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
