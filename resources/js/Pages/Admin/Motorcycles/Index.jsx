import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

export default function Index({
    motorcycles,
    regions = [],
    selectedRegion = 'Semua',
    userBranch = null,
    isSuperAdmin = false,
    isBranchAdmin = false,
    filters = {},
}) {
    // Current active region (locked for Branch Admin, selectable for Super Admin)
    const activeRegion = isBranchAdmin && userBranch ? userBranch.region : selectedRegion;

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'Semua');
    const [currentRegionFilter, setCurrentRegionFilter] = useState(activeRegion);

    // Local prices state for editing regional prices
    const [prices, setPrices] = useState(() => {
        const initial = {};
        motorcycles.data.forEach((bike) => {
            if (activeRegion && activeRegion !== 'Semua') {
                initial[bike.id] = bike.regional_prices_map?.[activeRegion] ?? bike.price_otr;
            } else {
                initial[bike.id] = bike.price_otr;
            }
        });
        return initial;
    });

    const [savingRowId, setSavingRowId] = useState(null);
    const [savingAll, setSavingAll] = useState(false);
    const [deleteModalItem, setDeleteModalItem] = useState(null);
    const [detailOtrModalItem, setDetailOtrModalItem] = useState(null);

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number || 0);
    };

    const handlePriceChange = (bikeId, val) => {
        setPrices((prev) => ({
            ...prev,
            [bikeId]: val === '' ? '' : parseInt(val, 10) || 0,
        }));
    };

    const handleResetToBase = (bikeId, basePrice) => {
        setPrices((prev) => ({
            ...prev,
            [bikeId]: basePrice,
        }));
    };

    const handleRegionTabChange = (regionName) => {
        setCurrentRegionFilter(regionName);
        router.get(
            '/admin/motorcycles',
            {
                region: regionName,
                search: searchTerm,
                category: selectedCategory,
            },
            { preserveState: false }
        );
    };

    const handleFilterSubmit = (e) => {
        e?.preventDefault();
        router.get(
            '/admin/motorcycles',
            {
                region: currentRegionFilter,
                search: searchTerm,
                category: selectedCategory,
            },
            { preserveState: true }
        );
    };

    const handleSaveSingleRegional = (bikeId) => {
        const targetRegion = activeRegion;
        if (!targetRegion || targetRegion === 'Semua') {
            alert('Silakan pilih salah satu wilayah untuk menyimpan harga OTR regional.');
            return;
        }

        const val = prices[bikeId];
        if (val === '' || val < 0) {
            alert('Silakan masukkan nominal harga OTR yang valid.');
            return;
        }

        setSavingRowId(bikeId);
        router.put(
            `/admin/motorcycles/${bikeId}/regional-price`,
            {
                region: targetRegion,
                price_otr: val,
            },
            {
                preserveScroll: true,
                onFinish: () => setSavingRowId(null),
            }
        );
    };

    const handleSaveAllRegional = () => {
        const targetRegion = activeRegion;
        if (!targetRegion || targetRegion === 'Semua') {
            alert('Pilih wilayah spesifik untuk melakukan penyimpanan serentak.');
            return;
        }

        setSavingAll(true);
        router.put(
            `/admin/motorcycles-bulk-regional-price`,
            {
                region: targetRegion,
                prices,
            },
            {
                preserveScroll: true,
                onFinish: () => setSavingAll(false),
            }
        );
    };

    const confirmDelete = () => {
        if (!deleteModalItem) return;
        router.delete(`/admin/motorcycles/${deleteModalItem.id}`, {
            onSuccess: () => setDeleteModalItem(null),
        });
    };

    const categories = ['Semua', 'MAXi', 'Classy', 'Matic', 'Sport', 'Off-Road', 'Moped'];

    return (
        <AdminLayout title="Katalog Produk & Harga OTR Motor Yamaha">
            <Head title="Katalog Motor & OTR | Admin Panel" />

            <div className="space-y-6 font-sans max-w-7xl mx-auto">
                {/* BRANCH ADMIN NOTIFICATION BANNER */}
                {isBranchAdmin && userBranch && (
                    <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden border border-slate-800">
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="bg-blue-500 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                                        🏢 Wilayah: {userBranch.region}
                                    </span>
                                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                        🔒 Hak Akses Admin Cabang
                                    </span>
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{userBranch.name}</h2>
                                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
                                    Anda mengelola katalog dan harga OTR motor khusus untuk wilayah <strong>{userBranch.region}</strong>.
                                    Setiap pembaruan harga OTR yang Anda simpan di sini otomatis menjadi acuan bagi seluruh cabang di wilayah ini serta simulasi cicilan di website utama.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleSaveAllRegional}
                                disabled={savingAll}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2 flex-shrink-0"
                            >
                                {savingAll ? (
                                    <span>Menyimpan Semua...</span>
                                ) : (
                                    <>
                                        <span>💾</span>
                                        <span>Simpan Semua OTR {userBranch.region}</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* SUPER ADMIN HEADER BANNER */}
                {isSuperAdmin && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-amber-500/10 text-amber-700 border border-amber-300 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full">
                                    👑 Super Administrator
                                </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                                Master Katalog &amp; OTR Produk Motor Yamaha ({motorcycles.total})
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Kelola data motor lengkap (CRUD), upload foto &amp; varian warna, harga OTR semua 7 wilayah, serta hapus produk motor.
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/motorcycles/create"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase px-5 py-3 rounded-2xl shadow-md transition flex items-center gap-2"
                            >
                                <span className="text-sm">➕</span>
                                <span>Tambah Motor Baru</span>
                            </Link>
                        </div>
                    </div>
                )}

                {/* SUPER ADMIN REGION SELECTOR TABS */}
                {isSuperAdmin && (
                    <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
                        <div className="flex items-center gap-2 min-w-max">
                            <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider px-2">
                                Wilayah OTR:
                            </span>
                            <button
                                type="button"
                                onClick={() => handleRegionTabChange('Semua')}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition ${
                                    currentRegionFilter === 'Semua'
                                        ? 'bg-slate-900 text-white shadow-sm'
                                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                🌐 Semua Wilayah (Ringkasan)
                            </button>
                            {regions.map((reg) => (
                                <button
                                    key={reg}
                                    type="button"
                                    onClick={() => handleRegionTabChange(reg)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                                        currentRegionFilter === reg
                                            ? 'bg-blue-600 text-white shadow-sm'
                                            : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    <span>🏢</span>
                                    <span>{reg}</span>
                                    {reg === 'Pekanbaru' && (
                                        <span className="text-[9px] bg-white/20 px-1.5 py-0.2 rounded font-mono">Pusat</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* SEARCH & FILTERS BAR */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row justify-between items-center gap-4">
                    <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative w-full sm:w-72">
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
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                router.get(
                                    '/admin/motorcycles',
                                    {
                                        region: currentRegionFilter,
                                        search: searchTerm,
                                        category: e.target.value,
                                    },
                                    { preserveState: true }
                                );
                            }}
                            className="text-xs border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-700 bg-white"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    Kategori: {c}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition"
                        >
                            Filter
                        </button>
                    </form>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <span className="text-xs text-slate-500 font-medium">
                            Menampilkan {motorcycles.data.length} dari {motorcycles.total} motor
                        </span>

                        {activeRegion && activeRegion !== 'Semua' && (
                            <button
                                type="button"
                                onClick={handleSaveAllRegional}
                                disabled={savingAll}
                                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
                            >
                                <span>💾</span>
                                <span>Simpan Semua OTR {activeRegion}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* MOTORCYCLES TABLE */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700">
                            <thead className="bg-slate-50 uppercase font-black text-slate-900 border-b border-slate-200 text-[11px] tracking-wider">
                                <tr>
                                    <th className="p-4">Produk Motor</th>
                                    <th className="p-4">Kategori</th>
                                    <th className="p-4">OTR Pusat (Pekanbaru)</th>

                                    {/* Column for Regional Price if specific region active */}
                                    {activeRegion && activeRegion !== 'Semua' ? (
                                        <>
                                            <th className="p-4 text-blue-900 bg-blue-50/60">
                                                Harga OTR ({activeRegion})
                                            </th>
                                            <th className="p-4">Selisih vs Pusat</th>
                                        </>
                                    ) : (
                                        <th className="p-4">OTR Wilayah (7 Region)</th>
                                    )}

                                    <th className="p-4">Status</th>
                                    <th className="p-4">Unggulan</th>
                                    <th className="p-4 text-right">Aksi Manajemen</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {motorcycles.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-10 text-center text-slate-400 font-medium italic">
                                            Tidak ada produk motor yang sesuai dengan pencarian atau filter.
                                        </td>
                                    </tr>
                                ) : (
                                    motorcycles.data.map((bike) => {
                                        const currentInputVal =
                                            prices[bike.id] !== undefined
                                                ? prices[bike.id]
                                                : bike.selected_region_price || bike.price_otr;

                                        const basePusat = bike.price_otr;
                                        const diff = (parseInt(currentInputVal, 10) || 0) - basePusat;
                                        const isRowSaving = savingRowId === bike.id;

                                        return (
                                            <tr key={bike.id} className="hover:bg-slate-50/80 transition">
                                                {/* Motor Info */}
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 p-1 flex items-center justify-center flex-shrink-0 shadow-2xs">
                                                            <img
                                                                src={bike.primary_image?.image_path || '/assets/images/placeholder_bike.webp'}
                                                                alt={bike.name}
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-extrabold text-slate-900 text-sm">{bike.name}</h4>
                                                            <span className="text-[10px] text-slate-400 font-mono">
                                                                ID: {bike.id} &bull; /{bike.slug}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="p-4">
                                                    <span className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold uppercase">
                                                        {bike.category}
                                                    </span>
                                                </td>

                                                {/* Base OTR Pusat */}
                                                <td className="p-4 font-mono font-bold text-slate-800 text-sm">
                                                    {formatRupiah(basePusat)}
                                                </td>

                                                {/* Regional Price Column */}
                                                {activeRegion && activeRegion !== 'Semua' ? (
                                                    <>
                                                        <td className="p-4 bg-blue-50/20">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-slate-400 font-bold text-xs">Rp</span>
                                                                <input
                                                                    type="number"
                                                                    value={currentInputVal}
                                                                    onChange={(e) => handlePriceChange(bike.id, e.target.value)}
                                                                    className="w-36 text-xs font-bold text-blue-900 border-slate-300 rounded-xl p-2 focus:ring-blue-500 focus:border-blue-500 font-mono bg-white"
                                                                />
                                                                {diff !== 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleResetToBase(bike.id, basePusat)}
                                                                        title="Samakan dengan OTR Pusat"
                                                                        className="text-[10px] text-slate-400 hover:text-blue-600 underline font-semibold"
                                                                    >
                                                                        Reset
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {diff === 0 ? (
                                                                <span className="text-slate-400 font-medium text-[11px]">
                                                                    Sama dgn Pusat
                                                                </span>
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
                                                    </>
                                                ) : (
                                                    <td className="p-4">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDetailOtrModalItem(bike)}
                                                            className="px-3 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-xl text-[11px] font-bold transition flex items-center gap-1.5 border border-slate-200"
                                                        >
                                                            <span>📍</span>
                                                            <span>Lihat 7 Wilayah OTR</span>
                                                        </button>
                                                    </td>
                                                )}

                                                {/* Status */}
                                                <td className="p-4">
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                                            bike.is_active
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {bike.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                {/* Featured */}
                                                <td className="p-4">
                                                    {bike.is_featured ? (
                                                        <span className="text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md text-[10px]">
                                                            ★ Unggulan
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400">-</span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Quick Single Save for regional price */}
                                                        {activeRegion && activeRegion !== 'Semua' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveSingleRegional(bike.id)}
                                                                disabled={isRowSaving || savingAll}
                                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition shadow-2xs disabled:opacity-50"
                                                            >
                                                                {isRowSaving ? 'Menyimpan...' : 'Simpan OTR'}
                                                            </button>
                                                        )}

                                                        {/* Super Admin Actions: Edit Full & Delete */}
                                                        {isSuperAdmin && (
                                                            <>
                                                                <Link
                                                                    href={`/admin/motorcycles/${bike.id}/edit`}
                                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-900 text-slate-700 hover:text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1"
                                                                >
                                                                    ✏️ Edit
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDeleteModalItem(bike)}
                                                                    className="px-3 py-1.5 bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-xl text-xs font-bold transition shadow-2xs flex items-center gap-1"
                                                                >
                                                                    🗑️ Hapus
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <Pagination links={motorcycles.links} />

                {/* MODAL LIHAT RINCIAN OTR 7 WILAYAH (UNTUK SUPER ADMIN) */}
                {detailOtrModalItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 space-y-4 border border-slate-200">
                            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                                <div>
                                    <h3 className="text-base font-black text-slate-900">
                                        Rincian Harga OTR per Wilayah
                                    </h3>
                                    <p className="text-xs text-slate-500 font-bold">{detailOtrModalItem.name}</p>
                                </div>
                                <button
                                    onClick={() => setDetailOtrModalItem(null)}
                                    className="text-slate-400 hover:text-slate-700 font-bold text-lg"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="p-3 bg-blue-50 rounded-2xl flex justify-between items-center text-xs font-bold text-blue-900">
                                    <span>OTR Pusat (Acuan Dasar):</span>
                                    <span className="font-mono text-sm">{formatRupiah(detailOtrModalItem.price_otr)}</span>
                                </div>

                                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden">
                                    {regions.map((reg) => {
                                        const regPrice = detailOtrModalItem.regional_prices_map?.[reg] || detailOtrModalItem.price_otr;
                                        const diff = regPrice - detailOtrModalItem.price_otr;

                                        return (
                                            <div key={reg} className="p-3 flex justify-between items-center text-xs hover:bg-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-800">🏢 {reg}</span>
                                                    {reg === 'Pekanbaru' && (
                                                        <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded font-mono">Pusat</span>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <span className="font-bold font-mono text-slate-900 block">
                                                        {formatRupiah(regPrice)}
                                                    </span>
                                                    {diff !== 0 && (
                                                        <span className={`text-[10px] font-mono ${diff > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                            {diff > 0 ? `+${formatRupiah(diff)}` : formatRupiah(diff)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Link
                                    href={`/admin/motorcycles/${detailOtrModalItem.id}/edit`}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition"
                                >
                                    ✏️ Edit Data &amp; Harga Lengkap
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* MODAL KONFIRMASI HAPUS PRODUK (SUPER ADMIN ONLY) */}
                {deleteModalItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
                            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center text-2xl mx-auto">
                                🗑️
                            </div>
                            <div className="text-center space-y-2">
                                <h3 className="text-lg font-black text-slate-900">
                                    Hapus Produk Motor dari Katalog?
                                </h3>
                                <p className="text-xs text-slate-500 leading-relaxed">
                                    Apakah Anda yakin ingin menghapus <strong>"{deleteModalItem.name}"</strong>?
                                    Seluruh file foto, varian warna, dan data harga OTR terkait akan dihapus secara permanen dari database dan website.
                                </p>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setDeleteModalItem(null)}
                                    className="flex-1 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-2xl transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    className="flex-1 py-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-2xl shadow-md transition"
                                >
                                    Ya, Hapus Produk
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
