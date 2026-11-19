import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import {
    Save,
    Trash2,
    Edit2,
    Search,
    Building2,
    Globe,
    MapPin,
    Lock,
    Shield,
    Plus,
    X,
    Bike,
    RotateCcw,
} from 'lucide-react';

export default function Index({
    motorcycles,
    regions = [],
    selectedRegion = 'Semua',
    userBranch = null,
    isSuperAdmin = false,
    isBranchAdmin = false,
    filters = {},
}) {
    const activeRegion = isBranchAdmin && userBranch ? userBranch.region : selectedRegion;

    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || 'Semua');
    const [currentRegionFilter, setCurrentRegionFilter] = useState(activeRegion);

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
            <Head title="Katalog Motor & OTR | Admin" />

            <div className="space-y-6">
                {/* Branch Admin Notification Banner */}
                {isBranchAdmin && userBranch && (
                    <div className="bg-zinc-950 text-zinc-100 p-6 rounded-xl border border-zinc-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                                <span className="bg-zinc-800 text-white text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-zinc-700">
                                    <Building2 className="w-3 h-3 text-zinc-400" /> Wilayah: {userBranch.region}
                                </span>
                                <span className="bg-zinc-900 text-zinc-300 border border-zinc-800 text-[10px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <Lock className="w-3 h-3 text-zinc-400" /> Hak Akses Cabang
                                </span>
                            </div>
                            <h2 className="text-xl font-bold tracking-tight text-white">{userBranch.name}</h2>
                            <p className="text-xs text-zinc-400 max-w-2xl leading-relaxed">
                                Anda mengelola katalog dan harga OTR motor khusus untuk wilayah <strong>{userBranch.region}</strong>.
                                Pembaruan harga otomatis tersinkronisasi ke seluruh dealer wilayah ini dan formulir simulasi kredit.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleSaveAllRegional}
                            disabled={savingAll}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 px-4 py-2 text-xs font-semibold shadow-xs transition disabled:opacity-50 flex-shrink-0"
                        >
                            <Save className="w-4 h-4" />
                            <span>{savingAll ? 'Menyimpan...' : `Simpan Semua OTR ${userBranch.region}`}</span>
                        </button>
                    </div>
                )}

                {/* Super Admin Clean Page Header */}
                {isSuperAdmin && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-200 pb-5">
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-bold tracking-tight text-zinc-900">
                                    Katalog Motor &amp; Harga OTR ({motorcycles.total})
                                </h2>
                                <span className="text-[11px] font-medium text-zinc-500 bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-md">
                                    7 Wilayah OTR
                                </span>
                            </div>
                            <p className="text-xs text-zinc-500 mt-1">
                                Kelola data motor lengkap, upload foto varian warna, serta sesuaikan harga On The Road per wilayah.
                            </p>
                        </div>

                        <Link
                            href="/admin/motorcycles/create"
                            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-zinc-800 transition"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Tambah Motor Baru</span>
                        </Link>
                    </div>
                )}

                {/* Region Selector Tabs (High-Contrast Segmented Control) */}
                {isSuperAdmin && (
                    <div className="bg-white p-3 rounded-xl border border-zinc-200 shadow-2xs">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                            <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider pl-1 pr-2 whitespace-nowrap">
                                Wilayah OTR:
                            </span>
                            <div className="inline-flex p-1 bg-zinc-100 rounded-lg border border-zinc-200 gap-1 min-w-max">
                                <button
                                    type="button"
                                    onClick={() => handleRegionTabChange('Semua')}
                                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition inline-flex items-center gap-1.5 ${
                                        currentRegionFilter === 'Semua'
                                            ? 'bg-zinc-900 !text-white shadow-xs'
                                            : '!text-zinc-700 hover:!text-zinc-950 hover:bg-zinc-200/70'
                                    }`}
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    <span>Semua Wilayah</span>
                                </button>
                                {regions.map((reg) => (
                                    <button
                                        key={reg}
                                        type="button"
                                        onClick={() => handleRegionTabChange(reg)}
                                        className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition inline-flex items-center gap-1.5 ${
                                            currentRegionFilter === reg
                                                ? 'bg-zinc-900 !text-white shadow-xs'
                                                : '!text-zinc-700 hover:!text-zinc-950 hover:bg-zinc-200/70'
                                        }`}
                                    >
                                        <Building2 className="w-3.5 h-3.5 opacity-70" />
                                        <span>{reg}</span>
                                        {reg === 'Pekanbaru' && (
                                            <span className="text-[9px] px-1 py-0.2 rounded font-mono font-semibold bg-zinc-200 !text-zinc-800">Pusat</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Search & Filters Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
                    <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama motor..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full text-xs border border-zinc-300 rounded-lg pl-9 pr-3 py-2 bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900"
                            />
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
                            className="text-xs border border-zinc-300 rounded-lg px-3 py-2 !text-zinc-700 bg-zinc-50/50 focus:outline-none focus:ring-1 focus:ring-zinc-900"
                        >
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    Kategori: {c}
                                </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 !text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition shadow-xs"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                        <span className="text-xs text-zinc-500 font-medium">
                            Menampilkan {motorcycles.data.length} dari {motorcycles.total} motor
                        </span>

                        {activeRegion && activeRegion !== 'Semua' && (
                            <button
                                type="button"
                                onClick={handleSaveAllRegional}
                                disabled={savingAll}
                                className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 !text-white font-semibold text-xs px-3.5 py-2 rounded-lg shadow-2xs transition inline-flex items-center gap-1.5"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>Simpan Semua OTR {activeRegion}</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Table Data */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                                <tr>
                                    <th className="px-4 py-3">Produk Motor</th>
                                    <th className="px-4 py-3">Kategori</th>
                                    <th className="px-4 py-3">OTR Pusat (Pekanbaru)</th>

                                    {activeRegion && activeRegion !== 'Semua' ? (
                                        <>
                                            <th className="px-4 py-3 text-zinc-900 bg-zinc-100/60">
                                                Harga OTR ({activeRegion})
                                            </th>
                                            <th className="px-4 py-3">Selisih vs Pusat</th>
                                        </>
                                    ) : (
                                        <th className="px-4 py-3">OTR Wilayah (7 Region)</th>
                                    )}

                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-center">Unggulan</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {motorcycles.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center py-12 text-zinc-400">
                                            <Bike className="w-8 h-8 mx-auto mb-2 text-zinc-300 stroke-[1.5]" />
                                            <p className="font-medium text-sm text-zinc-500">Tidak ada produk motor ditemukan.</p>
                                            <p className="text-xs text-zinc-400 mt-0.5">Ubah kata kunci filter atau tambahkan unit baru.</p>
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
                                            <tr key={bike.id} className="hover:bg-zinc-50/60 transition-colors">
                                                {/* Motor Info */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-zinc-50 rounded-lg border border-zinc-200 p-1 flex items-center justify-center flex-shrink-0">
                                                            <img
                                                                src={bike.primary_image?.image_path || '/assets/images/placeholder_bike.webp'}
                                                                alt={bike.name}
                                                                className="max-h-full max-w-full object-contain"
                                                            />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-zinc-900 text-sm">{bike.name}</h4>
                                                            <span className="text-[10px] text-zinc-400 font-mono">
                                                                ID: {bike.id} &bull; /{bike.slug}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Category */}
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-md text-[10px] font-semibold uppercase">
                                                        {bike.category}
                                                    </span>
                                                </td>

                                                {/* Base OTR Pusat */}
                                                <td className="px-4 py-3 font-mono font-semibold text-zinc-900 text-xs">
                                                    {formatRupiah(basePusat)}
                                                </td>

                                                {/* Regional Price Column */}
                                                {activeRegion && activeRegion !== 'Semua' ? (
                                                    <>
                                                        <td className="px-4 py-3 bg-zinc-50/50">
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-zinc-400 font-medium text-xs">Rp</span>
                                                                <input
                                                                    type="number"
                                                                    value={currentInputVal}
                                                                    onChange={(e) => handlePriceChange(bike.id, e.target.value)}
                                                                    className="w-32 text-xs font-semibold text-zinc-900 border border-zinc-300 rounded-lg py-1 px-2 focus:ring-1 focus:ring-zinc-900 font-mono bg-white"
                                                                />
                                                                {diff !== 0 && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => handleResetToBase(bike.id, basePusat)}
                                                                        title="Reset sama dengan Pusat"
                                                                        className="p-1 text-zinc-400 hover:text-zinc-700 rounded transition"
                                                                    >
                                                                        <RotateCcw className="w-3 h-3" />
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3">
                                                            {diff === 0 ? (
                                                                <span className="text-zinc-400 font-mono text-[11px]">—</span>
                                                            ) : diff > 0 ? (
                                                                <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                                                                    +{formatRupiah(diff)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-rose-600 font-semibold font-mono text-[11px]">
                                                                    {formatRupiah(diff)}
                                                                </span>
                                                            )}
                                                        </td>
                                                    </>
                                                ) : (
                                                    <td className="px-4 py-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => setDetailOtrModalItem(bike)}
                                                            className="px-2.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 !text-zinc-900 rounded-md text-xs font-semibold transition inline-flex items-center gap-1.5 border border-zinc-300 shadow-2xs whitespace-nowrap"
                                                        >
                                                            <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                                                            <span>Lihat 7 Wilayah OTR</span>
                                                        </button>
                                                    </td>
                                                )}

                                                {/* Status */}
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                                            bike.is_active
                                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                                : 'bg-zinc-100 text-zinc-500 border-zinc-200'
                                                        }`}
                                                    >
                                                        {bike.is_active ? 'Aktif' : 'Nonaktif'}
                                                    </span>
                                                </td>

                                                {/* Featured */}
                                                <td className="px-4 py-3 text-center">
                                                    {bike.is_featured ? (
                                                        <span className="!text-zinc-900 font-semibold bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded text-[10px]">
                                                            Unggulan
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-300">-</span>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-3 text-right">
                                                    <div className="inline-flex items-center justify-end gap-1.5">
                                                        {activeRegion && activeRegion !== 'Semua' && (
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSaveSingleRegional(bike.id)}
                                                                disabled={isRowSaving || savingAll}
                                                                className="bg-zinc-900 hover:bg-zinc-800 !text-white font-semibold text-xs px-2.5 py-1.5 rounded-md transition disabled:opacity-50 shadow-xs"
                                                            >
                                                                {isRowSaving ? 'Menyimpan...' : 'Simpan OTR'}
                                                            </button>
                                                        )}

                                                        {isSuperAdmin && (
                                                            <>
                                                                <Link
                                                                    href={`/admin/motorcycles/${bike.id}/edit`}
                                                                    className="px-2.5 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 !text-zinc-700 hover:!text-zinc-950 rounded-md transition inline-flex items-center gap-1 text-xs font-semibold shadow-2xs whitespace-nowrap"
                                                                    title="Edit Produk"
                                                                >
                                                                    <Edit2 className="w-3.5 h-3.5 text-zinc-500" />
                                                                    <span>Edit</span>
                                                                </Link>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setDeleteModalItem(bike)}
                                                                    className="px-2.5 py-1.5 border border-zinc-200 bg-white hover:bg-rose-50 !text-zinc-600 hover:!text-rose-600 hover:border-rose-200 rounded-md transition inline-flex items-center gap-1 text-xs font-semibold shadow-2xs whitespace-nowrap"
                                                                    title="Hapus Produk"
                                                                >
                                                                    <Trash2 className="w-3.5 h-3.5 text-zinc-400 hover:text-rose-600" />
                                                                    <span>Hapus</span>
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

                    {/* Pagination */}
                    {motorcycles.links && motorcycles.links.length > 3 && (
                        <div className="p-3.5 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500 bg-zinc-50/50">
                            <span>
                                Menampilkan {motorcycles.from} - {motorcycles.to} dari {motorcycles.total} motor
                            </span>
                            <div className="flex gap-1">
                                {motorcycles.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                                            link.active
                                                ? 'bg-zinc-900 text-white'
                                                : link.url
                                                ? 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                                                : 'text-zinc-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Detail OTR 7 Wilayah */}
            {detailOtrModalItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4 border border-zinc-200">
                        <div className="flex justify-between items-start border-b border-zinc-200 pb-3">
                            <div>
                                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                                    RINCIAN 7 WILAYAH OTR
                                </span>
                                <h3 className="text-base font-bold text-zinc-900">{detailOtrModalItem.name}</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setDetailOtrModalItem(null)}
                                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="p-3 bg-zinc-100 rounded-lg flex justify-between items-center text-xs font-semibold text-zinc-900">
                                <span>OTR Pusat (Pekanbaru):</span>
                                <span className="font-mono text-sm">{formatRupiah(detailOtrModalItem.price_otr)}</span>
                            </div>

                            <div className="divide-y divide-zinc-200 border border-zinc-200 rounded-lg overflow-hidden">
                                {regions.map((reg) => {
                                    const regPrice = detailOtrModalItem.regional_prices_map?.[reg] || detailOtrModalItem.price_otr;
                                    const diff = regPrice - detailOtrModalItem.price_otr;

                                    return (
                                        <div key={reg} className="p-3 flex justify-between items-center text-xs hover:bg-zinc-50">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold text-zinc-800 inline-flex items-center gap-1.5">
                                                    <Building2 className="w-3.5 h-3.5 text-zinc-400" />
                                                    {reg}
                                                </span>
                                                {reg === 'Pekanbaru' && (
                                                    <span className="text-[9px] text-zinc-700 bg-zinc-200 px-1.5 py-0.2 rounded font-mono">Pusat</span>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold font-mono text-zinc-900 block">
                                                    {formatRupiah(regPrice)}
                                                </span>
                                                {diff !== 0 && (
                                                    <span className={`text-[10px] font-mono ${diff > 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
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
                                className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition inline-flex items-center gap-1.5"
                            >
                                <Edit2 className="w-3.5 h-3.5" />
                                <span>Edit Data &amp; Harga Lengkap</span>
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Hapus Produk */}
            {deleteModalItem && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 border border-zinc-200">
                        <div className="w-12 h-12 rounded-xl bg-zinc-100 text-zinc-900 flex items-center justify-center mx-auto">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <div className="text-center space-y-1.5">
                            <h3 className="text-base font-bold text-zinc-900">
                                Hapus Produk Motor dari Katalog?
                            </h3>
                            <p className="text-xs text-zinc-500">
                                Anda akan menghapus <strong>"{deleteModalItem.name}"</strong> beserta seluruh varian warna dan riwayat OTR regionalnya. Tindakan ini tidak dapat dibatalkan.
                            </p>
                        </div>

                        <div className="flex gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setDeleteModalItem(null)}
                                className="w-1/2 py-2 px-3 border border-zinc-200 text-zinc-700 text-xs font-semibold rounded-lg hover:bg-zinc-50 transition"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={confirmDelete}
                                className="w-1/2 py-2 px-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-lg transition"
                            >
                                Ya, Hapus Produk
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
