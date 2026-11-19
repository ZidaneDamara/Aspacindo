import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Building2, Lock, Shield, Search, Save, Info } from 'lucide-react';

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

            <div className="space-y-6">
                {/* Branch Header Banner */}
                <div className="bg-zinc-900 text-white p-5 rounded-xl border border-zinc-800 shadow-xs relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="bg-zinc-800 text-white text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md inline-flex items-center gap-1 border border-zinc-700">
                                    <Building2 className="w-3 h-3 text-zinc-400" />
                                    {selectedBranch.region}
                                </span>
                                {isBranchAdmin ? (
                                    <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-zinc-400" /> Khusus Admin Cabang
                                    </span>
                                ) : (
                                    <span className="bg-zinc-100 text-zinc-900 border border-zinc-200 text-[10px] font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                                        <Shield className="w-3 h-3 text-zinc-700" /> Akses Super Admin
                                    </span>
                                )}
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{selectedBranch.name}</h2>
                            <p className="text-xs text-zinc-400 max-w-2xl">{selectedBranch.full_address}</p>
                            <p className="text-xs text-zinc-400">
                                WhatsApp: <span className="font-mono text-zinc-200 font-semibold">{selectedBranch.whatsapp_number}</span>
                            </p>
                        </div>

                        {/* Branch Switcher (Only visible to Super Admin) */}
                        {isSuperAdmin && (
                            <div className="bg-zinc-800/80 p-3.5 rounded-xl border border-zinc-700 min-w-[280px]">
                                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-300 block mb-1.5">
                                    Pilih Cabang Lain:
                                </label>
                                <select
                                    value={selectedBranch.id}
                                    onChange={(e) => handleBranchSwitch(e.target.value)}
                                    className="w-full bg-zinc-900 text-white text-xs font-medium rounded-lg border border-zinc-700 p-2 focus:ring-1 focus:ring-white"
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
                    <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex items-start gap-3">
                        <Info className="w-4 h-4 text-zinc-600 mt-0.5 shrink-0" />
                        <div className="text-xs text-zinc-700 leading-relaxed">
                            <p className="font-semibold text-zinc-900">Ketentuan Pengelolaan OTR Wilayah {selectedBranch.region}:</p>
                            <p className="text-zinc-600 mt-0.5">
                                Setiap admin bertanggung jawab memperbarui harga OTR per wilayah. Perubahan harga yang Anda simpan di sini akan otomatis menjadi acuan OTR untuk wilayah <strong>{selectedBranch.region}</strong> dan seluruh cabang di wilayah ini.
                            </p>
                        </div>
                    </div>
                )}

                {/* Filters & Actions Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row justify-between items-center gap-3">
                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <input
                                type="text"
                                placeholder="Cari nama motor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-xs border border-zinc-300 rounded-lg pl-9 pr-3 py-2 bg-zinc-50/50 focus:ring-1 focus:ring-zinc-900"
                            />
                            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>

                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="text-xs border border-zinc-300 rounded-lg px-3 py-2 font-medium text-zinc-800 bg-white"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    Kategori: {c}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <span className="text-xs text-zinc-500 font-medium">
                            Menampilkan {filteredMotorcycles.length} dari {motorcycles.length} motor
                        </span>
                        <button
                            type="button"
                            onClick={handleSaveAll}
                            disabled={savingAll}
                            className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs px-4 py-2 rounded-lg transition flex items-center gap-1.5 shadow-xs"
                        >
                            {savingAll ? (
                                <span>Menyimpan Semua...</span>
                            ) : (
                                <>
                                    <Save className="w-3.5 h-3.5" />
                                    <span>Simpan Semua Perubahan</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Table of Motorcycles */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Motor</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">OTR Pusat (Pekanbaru)</th>
                                    <th className="px-4 py-3">Harga OTR Cabang Ini</th>
                                    <th className="px-4 py-3">Selisih vs Pusat</th>
                                    <th className="px-4 py-3 text-right">Aksi Simpan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {filteredMotorcycles.map((bike) => {
                                    const currentInputVal = prices[bike.id] !== undefined ? prices[bike.id] : bike.price_branch_current;
                                    const diff = (parseInt(currentInputVal, 10) || 0) - bike.price_otr_base;
                                    const isRowSaving = savingRowId === bike.id;

                                    return (
                                        <tr key={bike.id} className="hover:bg-zinc-50/60 transition-colors">
                                            {/* Motor name & image */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-zinc-50 rounded-lg border border-zinc-200 p-1 flex items-center justify-center shrink-0">
                                                        <img
                                                            src={bike.image_url}
                                                            alt={bike.name}
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-zinc-900 text-xs">{bike.name}</h4>
                                                        <span className="text-[10px] text-zinc-400 font-mono">ID: {bike.id}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-md text-[10px] font-semibold border border-zinc-200">
                                                    {bike.category}
                                                </span>
                                            </td>

                                            {/* Base Price OTR */}
                                            <td className="px-4 py-3 text-zinc-500 font-medium font-mono">
                                                {formatRupiah(bike.price_otr_base)}
                                            </td>

                                            {/* Branch OTR Input */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-zinc-400 font-semibold text-xs">Rp</span>
                                                    <input
                                                        type="number"
                                                        value={currentInputVal}
                                                        onChange={(e) => handlePriceChange(bike.id, e.target.value)}
                                                        className="w-32 text-xs font-semibold text-zinc-900 border border-zinc-300 rounded-lg py-1 px-2 focus:outline-none focus:ring-1 focus:ring-zinc-900 font-mono bg-white"
                                                    />
                                                    {bike.price_regional && bike.price_regional !== currentInputVal && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleResetToRegional(bike.id, bike.price_regional)}
                                                            title={`Samakan dengan OTR Region ${selectedBranch.region} (${formatRupiah(bike.price_regional)})`}
                                                            className="text-[10px] text-zinc-500 hover:text-zinc-900 underline font-medium"
                                                        >
                                                            Reset
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Difference */}
                                            <td className="px-4 py-3">
                                                {diff === 0 ? (
                                                    <span className="text-zinc-400 font-medium text-[11px]">Sama dengan Pusat</span>
                                                ) : diff > 0 ? (
                                                    <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                                                        +{formatRupiah(diff)}
                                                    </span>
                                                ) : (
                                                    <span className="text-rose-700 font-semibold font-mono text-[11px]">
                                                        {formatRupiah(diff)}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Single Action */}
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleSaveSingle(bike.id)}
                                                    disabled={isRowSaving || savingAll}
                                                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs px-3 py-1.5 rounded-md transition shadow-2xs disabled:opacity-50"
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
                        <div className="p-12 text-center text-zinc-400 text-xs font-medium">
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
                        className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition flex items-center gap-2 shadow-xs"
                    >
                        {savingAll ? (
                            <span>Menyimpan Semua Harga OTR Cabang...</span>
                        ) : (
                            <>
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Semua Perubahan Harga Cabang</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </AdminLayout>
    );
}
