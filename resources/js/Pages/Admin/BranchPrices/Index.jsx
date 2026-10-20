import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function BranchPricesIndex({
    selectedBranch,
    availableBranches = [],
    motorcycles = [],
    isBranchAdmin = false,
    isSuperAdmin = false,
}) {
    // Local state for modified prices
    const [prices, setPrices] = useState(() => {
        const initial = {};
        motorcycles.forEach((bike) => {
            initial[bike.id] = bike.price_branch_current;
        });
        return initial;
    });

    const [savingAll, setSavingAll] = useState(false);
    const [savingRowId, setSavingRowId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Semua');

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number || 0);
    };

    const handlePriceChange = (bikeId, value) => {
        setPrices((prev) => ({
            ...prev,
            [bikeId]: value === '' ? '' : parseInt(value, 10) || 0,
        }));
    };

    const handleBranchSwitch = (newBranchId) => {
        router.get('/admin/branch-prices', { branch_id: newBranchId }, { preserveState: false });
    };

    const handleSaveSingle = (bikeId) => {
        const val = prices[bikeId];
        if (val === '' || val < 0) {
            alert('Silakan masukkan harga OTR yang valid.');
            return;
        }

        setSavingRowId(bikeId);
        router.put(
            `/admin/branch-prices/${selectedBranch.id}/motorcycles/${bikeId}`,
            { price_otr: val },
            {
                preserveScroll: true,
                onFinish: () => setSavingRowId(null),
            }
        );
    };

    const handleSaveAll = (e) => {
        e.preventDefault();
        setSavingAll(true);

        router.put(
            `/admin/branch-prices/${selectedBranch.id}`,
            { prices },
            {
                preserveScroll: true,
                onFinish: () => setSavingAll(false),
            }
        );
    };

    const handleResetToRegional = (bikeId, regionalPrice) => {
        setPrices((prev) => ({
            ...prev,
            [bikeId]: regionalPrice,
        }));
    };

    // Filtered motorcycles
    const categories = ['Semua', ...new Set(motorcycles.map((m) => m.category))];
    const filteredMotorcycles = motorcycles.filter((bike) => {
        const matchesCategory = selectedCategory === 'Semua' || bike.category === selectedCategory;
        const matchesSearch = bike.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <AdminLayout title={`Harga OTR - ${selectedBranch?.name}`}>
            <Head title={`Harga OTR Cabang ${selectedBranch?.name}`} />

            <div className="space-y-6 max-w-7xl mx-auto">
                {/* Branch Header Banner */}
                <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                    🏢 {selectedBranch.region}
                                </span>
                                {isBranchAdmin ? (
                                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        🔒 Khusus Admin Cabang Ini
                                    </span>
                                ) : (
                                    <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold px-3 py-1 rounded-full">
                                        👑 Akses Super Admin
                                    </span>
                                )}
                            </div>
                            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{selectedBranch.name}</h2>
                            <p className="text-xs text-slate-300 max-w-2xl">{selectedBranch.full_address}</p>
                            <p className="text-xs text-slate-400">
                                WhatsApp: <span className="font-mono text-white font-bold">{selectedBranch.whatsapp_number}</span>
                            </p>
                        </div>

                        {/* Branch Switcher (Only visible to Super Admin) */}
                        {isSuperAdmin && (
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 min-w-[280px]">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-300 block mb-1.5">
                                    Pilih Cabang Lain:
                                </label>
                                <select
                                    value={selectedBranch.id}
                                    onChange={(e) => handleBranchSwitch(e.target.value)}
                                    className="w-full bg-slate-800 text-white text-xs font-bold rounded-xl border border-slate-700 p-2.5 focus:ring-2 focus:ring-blue-500"
                                >
                                    {availableBranches.map((b) => (
                                        <option key={b.id} value={b.id}>
                                            {b.name} ({b.region})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>
                </div>

                {/* Notice Card for Branch Admin */}
                {isBranchAdmin && (
                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-start gap-3">
                        <span className="text-xl">ℹ️</span>
                        <div className="text-xs text-blue-900 leading-relaxed">
                            <p className="font-bold">Ketentuan Pengelolaan OTR Wilayah {selectedBranch.region}:</p>
                            <p className="text-blue-800 mt-0.5">
                                Setiap admin bertanggung jawab mengupdate harga OTR per wilayah. Perubahan harga yang Anda simpan di sini akan otomatis menjadi acuan OTR untuk wilayah <strong>{selectedBranch.region}</strong> dan seluruh cabang (3S, 2S, 1S) di wilayah ini.
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters & Actions Bar */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari nama motor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-xs border-slate-200 rounded-xl pl-9 pr-3 py-2.5 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="text-xs border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-700"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    Kategori: {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <span className="text-xs text-slate-500 font-medium">
                            Menampilkan {filteredMotorcycles.length} dari {motorcycles.length} motor
                        </span>
                        <button
                            type="button"
                            onClick={handleSaveAll}
                            disabled={savingAll}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                        >
                            {savingAll ? (
                                <span>Menyimpan Semua...</span>
                            ) : (
                                <>
                                    <span>💾</span>
                                    <span>Simpan Semua Perubahan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Table of Motorcycles */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 uppercase font-black text-slate-700 border-b border-slate-200">
                                <tr>
                                    <th className="p-4">Motor</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">OTR Pusat (Pekanbaru)</th>
                                    <th className="p-4">Harga OTR Cabang Ini</th>
                                    <th className="p-4">Selisih vs Pusat</th>
                                    <th className="p-4 text-right">Aksi Simpan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                                {filteredMotorcycles.map((bike) => {
                                    const currentInputVal = prices[bike.id] !== undefined ? prices[bike.id] : bike.price_branch_current;
                                    const diff = (parseInt(currentInputVal, 10) || 0) - bike.price_otr_base;
                                    const isRowSaving = savingRowId === bike.id;

                                    return (
                                        <tr key={bike.id} className="hover:bg-slate-50/80 transition">
                                            {/* Motor name & image */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-xl border border-slate-200 p-1 flex items-center justify-center flex-shrink-0">
                                                        <img
                                                            src={bike.image_url}
                                                            alt={bike.name}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{bike.name}</h4>
                                                        <span className="text-[10px] text-slate-400 font-mono">ID: {bike.id}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="p-4">
                                                <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold">
                                                    {bike.category}
                                                </span>
                                            </td>

                                            {/* Base Price OTR */}
                                            <td className="p-4 text-slate-500 font-medium font-mono">
                                                {formatRupiah(bike.price_otr_base)}
                                            </td>

                                            {/* Branch OTR Input */}
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-400 font-bold text-xs">Rp</span>
                                                    <input
                                                        type="number"
                                                        value={currentInputVal}
                                                        onChange={(e) => handlePriceChange(bike.id, e.target.value)}
                                                        className="w-36 text-xs font-bold text-blue-900 border-slate-300 rounded-xl p-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                                                    />
                                                    {bike.price_regional && bike.price_regional !== currentInputVal && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleResetToRegional(bike.id, bike.price_regional)}
                                                            title={`Samakan dengan OTR Region ${selectedBranch.region} (${formatRupiah(bike.price_regional)})`}
                                                            className="text-[10px] text-slate-400 hover:text-blue-600 underline font-semibold"
                                                        >
                                                            Reset ke Regional
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Difference */}
                                            <td className="p-4">
                                                {diff === 0 ? (
                                                    <span className="text-slate-400 font-medium text-[11px]">Sama dengan Pusat</span>
                                                ) : diff > 0 ? (
                                                    <span className="text-emerald-600 font-bold font-mono text-[11px]">
                                                        +{formatRupiah(diff)}
                                                    </span>
                                                ) : (
                                                    <span className="text-red-600 font-bold font-mono text-[11px]">
                                                        {formatRupiah(diff)}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Single Action */}
                                            <td className="p-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveSingle(bike.id)}
                                                    disabled={isRowSaving || savingAll}
                                                    className="bg-slate-900 hover:bg-blue-600 text-white font-bold text-[11px] px-3.5 py-1.5 rounded-xl transition shadow-sm disabled:opacity-50"
                                                >
                                                    {isRowSaving ? 'Menyimpan...' : 'Simpan'}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredMotorcycles.length === 0 && (
                        <div className="p-12 text-center text-slate-400 text-xs font-medium">
                            Tidak ada motor yang cocok dengan pencarian.
                        </div>
                    )}
                </div>

                {/* Bottom Action Button Bar */}
                <div className="flex justify-end p-2">
                    <button
                        type="button"
                        onClick={handleSaveAll}
                        disabled={savingAll}
                        className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-2xl shadow-lg transition flex items-center gap-2"
                    >
                        {savingAll ? (
                            <span>Menyimpan Semua Harga OTR Cabang...</span>
                        ) : (
                            <>
                                <span>💾</span>
                                <span>Simpan Semua Perubahan Harga Cabang</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
