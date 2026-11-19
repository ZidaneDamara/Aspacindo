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
    const [dpPercent, setDpPercent] = useState(10);
    const [tenorMonths, setTenorMonths] = useState(30);
    const [selectedPartner] = useState({ id: 'resmi', code: 'YAMAHA', name: 'Mitra Rekanan Resmi Yamaha', rate_modifier: 1.0 });

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
        dp_percent: 10,
        tenor_months: 30,
        leasing_partner: 'Mitra Rekanan Resmi Yamaha',
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

        // Multifinance calculation benchmarked strictly against Yamaha NMAX Neo:
        // At minimum DP (10%): OTR 37.570.000 -> 30 months installment = Rp 1.961.000 / month, Total = Rp 58.830.000
        // Monthly rate = (58.830.000 / 37.570.000 - 1) / 30 = 0.018862565877029543 per month
        // When DP increases, monthly payment decreases proportionally according to remaining principal ratio:
        const baseDpPercent = 10;
        const dpFactor = (1 - (dpPercent / 100)) / (1 - (baseDpPercent / 100));
        const ratePerMonth = (58830000 / 37570000 - 1) / 30;
        const markupRate = tenorMonths * ratePerMonth;
        const baseTotalCredit = price * (1 + markupRate);
        const adjustedTotalCredit = baseTotalCredit * dpFactor;

        const monthlyPayment = Math.round(adjustedTotalCredit / tenorMonths / 1000) * 1000;
        const totalCredit = monthlyPayment * tenorMonths;

        setDpAmount(calculatedDp);
        setLoanAmount(totalCredit);
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

    const buildWhatsAppMessage = () => {
        if (!selectedMotorcycle) return '';
        const currentPrice = getPriceForCurrentRegion(selectedMotorcycle, currentRegion);
        const customerName = data.name.trim() || 'Calon Konsumen';
        const customerPhone = data.phone.trim();
        const customerCity = data.city || currentRegion;

        let msg = `Halo Yamaha Aspacindo, saya ingin mengajukan simulasi cicilan kredit motor: \n\n`;
        msg += `* RINCIAN SIMULASI KREDIT:*\n`;
        msg += `• Motor: * ${ selectedMotorcycle.name }*\n`;
        msg += `• Wilayah OTR: * Area ${ currentRegion }*\n`;
        msg += `• Harga OTR: * ${ formatRupiah(currentPrice) }*\n`;
        msg += `• Uang Muka(DP ${ dpPercent } %): * ${ formatRupiah(dpAmount) }*\n`;
        msg += `• Jangka Tenor: * ${ tenorMonths } Bulan *\n`;
        msg += `• Estimasi Cicilan: * ${ formatRupiah(monthlyInstallment) } / bulan*\n`;
        msg += `_(Catatan: Harga cicilan bisa selisih 50k-100k perbulan tergantung leasing)_\n\n`;

        msg += `* DATA PEMOHON:*\n`;
        msg += `• Nama Lengkap: ${ customerName } \n`;
        if (customerPhone) {
            msg += `• No.Handphone / WA: ${ customerPhone } \n`;
        }
        msg += `• Kota / Domisili: ${ customerCity } \n`;
        if (data.current_motorcycle && data.current_motorcycle !== 'Belum Punya Motor') {
            msg += `• Motor Saat Ini: ${ data.current_motorcycle } \n`;
        }
        if (data.address.trim()) {
            msg += `• Alamat: ${ data.address.trim() } \n`;
        }
        if (data.notes.trim()) {
            msg += `• Catatan Tambahan: ${ data.notes.trim() } \n`;
        }
        msg += `\nMohon dibantu info promo diskon DP, persyaratan berkas kredit, dan proses survey - nya.Terima kasih!`;

        return msg;
    };

    const handleDirectWhatsApp = () => {
        // Silently save prospect record in background if motorcycle is selected
        if (selectedMotorcycle) {
            try {
                const formData = new FormData();
                formData.append('name', data.name.trim() || 'Customer WhatsApp');
                formData.append('phone', data.phone.trim() || '081262241100');
                formData.append('email', data.email.trim());
                formData.append('city', data.city);
                formData.append('address', data.address.trim());
                formData.append('current_motorcycle', data.current_motorcycle);
                formData.append('motorcycle_id', selectedMotorcycle.id);
                formData.append('region', currentRegion);
                formData.append('dp_percent', dpPercent);
                formData.append('tenor_months', tenorMonths);
                formData.append('leasing_partner', selectedPartner.name);
                formData.append('notes', data.notes.trim());

                const xsrfToken = document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];

                fetch('/simulasi-cicilan', {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-XSRF-TOKEN': xsrfToken ? decodeURIComponent(xsrfToken) : '',
                        'Accept': 'application/json',
                    },
                    body: formData,
                }).catch(() => {});
            } catch (e) {
                // Ignore silent background log error
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleDirectWhatsApp();
        const waUrl = `https://wa.me/6281262241100?text=${encodeURIComponent(buildWhatsAppMessage())}`;
        window.open(waUrl, '_blank');
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
                className="text-white py-12 border-b border-blue-900"
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-white uppercase tracking-widest block opacity-90">Kalkulator Kredit &amp; Form Lead Prospect</span>
                    <h1 className="font-play font-bold text-[18px] leading-[27px] uppercase tracking-tight text-white mt-1">
                        Simulasi Cicilan Motor Yamaha
                    </h1>
                    <p className="text-blue-100 text-sm mt-2 max-w-2xl leading-relaxed">
                        Isi data diri dan hitung estimasi Uang Muka (DP) serta angsuran bulanan sepeda motor Yamaha impian Anda. Data Anda akan langsung tersimpan di sistem sales resmi Yamaha Aspacindo Riau untuk di-follow up dengan penawaran terbaik!
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                                        Nama Lengkap <span className="text-blue-600 font-normal">(Disarankan)</span>
                                    </label>
                                    <input
                                        type="text"
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
                                        No. Handphone / WhatsApp <span className="text-blue-600 font-normal">(Disarankan)</span>
                                    </label>
                                    <input
                                        type="tel"
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
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
                                    {[12, 18, 24, 30, 36].map((months) => (
                                        <button
                                            key={months}
                                            type="button"
                                            onClick={() => setTenorMonths(months)}
                                            className={`py-3 rounded-2xl font-black text-sm border transition ${tenorMonths === months
                                                    ? 'bg-blue-600 text-white border-transparent shadow-lg shadow-blue-500/20 scale-[1.02]'
                                                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                                }`}
                                        >
                                            {months} Bulan
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Note Selisih Leasing */}
                            <div className="p-4 bg-amber-50 border border-amber-200/90 rounded-2xl flex items-start gap-3 text-amber-900 text-xs">
                                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="space-y-0.5 leading-relaxed">
                                    <span className="font-extrabold text-amber-950 block uppercase tracking-wider text-[11px]">
                                        Catatan Simulasi Kredit:
                                    </span>
                                    <p className="text-amber-900 font-medium text-xs">
                                        Harga cicilan bisa selisih 50k - 100k perbulan tergantung leasing (seperti BAF, Adira Finance, SOF/OTO, IMFI, dll).
                                    </p>
                                </div>
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

                                    {/* Notes Selisih Leasing Highlight */}
                                    <div className="p-3.5 bg-amber-400/20 border border-amber-300/40 rounded-2xl text-amber-100 text-xs flex items-start gap-2.5 backdrop-blur-xs">
                                        <svg className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <div className="leading-snug">
                                            <strong className="font-bold text-amber-200 block text-[11px] uppercase tracking-wider">Catatan:</strong>
                                            <p className="text-amber-100 text-xs mt-0.5 font-medium">
                                                Harga cicilan bisa selisih 50k - 100k perbulan tergantung leasing.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2.5 text-xs text-white border-t border-white/15 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-blue-100">Uang Muka (DP):</span>
                                            <span className="font-bold">{formatRupiah(dpAmount)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-blue-100">Total Kredit ({tenorMonths} Bulan):</span>
                                            <span className="font-bold">{formatRupiah(loanAmount)}</span>
                                        </div>
                                    </div>

                                    {/* Primary Form Submit Button - Direct WhatsApp 081262241100 */}
                                    <a
                                        href={`https://wa.me/6281262241100?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={handleDirectWhatsApp}
                                        className="w-full text-center bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] text-white font-black py-4 px-6 rounded-2xl shadow-xl hover:shadow-emerald-500/30 transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2.5 cursor-pointer select-none"
                                    >
                                        <svg className="w-5 h-5 fill-current flex-shrink-0" viewBox="0 0 24 24">
                                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                                        </svg>
                                        <span>Simpan &amp; Ajukan Simulasi Kredit</span>
                                        <span>&rarr;</span>
                                    </a>

                                    <p className="text-[11px] text-blue-100 text-center leading-relaxed">
                                        💬 Terhubung langsung ke WhatsApp Dealer <strong>081262241100</strong> dengan template rincian simulasi kredit yang siap dikirim.
                                    </p>

                                    <p className="text-[10px] text-blue-100 text-center leading-relaxed opacity-90">
                                        *Data pribadi Anda tersimpan aman dan hanya digunakan untuk kebutuhan konfirmasi &amp; survey pengajuan kredit motor Yamaha Aspacindo.
                                    </p>
                                </div>
                            )}
                    </div>
            </div>

        </form>
            </div >

        {/* SUCCESS SUBMISSION MODAL */ }
    {
        showSuccessModal && lastSubmittedProspect && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-lg w-full p-8 text-center space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
                    <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
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
                            href={`https://wa.me/6281262241100?text=${encodeURIComponent(buildWhatsAppMessage())}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-center bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 rounded-2xl shadow-lg hover:shadow-emerald-500/20 transition text-sm uppercase tracking-wider"
                        >
                            Lanjutkan Diskusi via WhatsApp Sales &rarr;
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
        )
    }
        </PublicLayout >
    );
}
