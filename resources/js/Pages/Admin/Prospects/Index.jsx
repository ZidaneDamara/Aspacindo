import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';

export default function ProspectIndex({ prospects, stats, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [selectedProspect, setSelectedProspect] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        status: 'new',
        follow_up_notes: '',
    });

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
        }).format(number);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/prospects', { search, status: statusFilter }, { preserveState: true });
    };

    const handleFilterStatus = (statusValue) => {
        setStatusFilter(statusValue);
        router.get('/admin/prospects', { search, status: statusValue }, { preserveState: true });
    };

    const openFollowUpModal = (item) => {
        setSelectedProspect(item);
        setData({
            status: item.status,
            follow_up_notes: item.follow_up_notes || '',
        });
        setShowModal(true);
    };

    const handleSubmitFollowUp = (e) => {
        e.preventDefault();
        if (!selectedProspect) return;

        post(`/admin/prospects/${selectedProspect.id}/status`, {
            onSuccess: () => {
                setShowModal(false);
                setSelectedProspect(null);
                reset();
            },
        });
    };

    const handleDelete = (id, name) => {
        if (confirm(`Apakah Anda yakin ingin menghapus data prospect ${name}?`)) {
            router.delete(`/admin/prospects/${id}`);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new':
                return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">🌟 Baru</span>;
            case 'contacted':
                return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">📞 Dihubungi</span>;
            case 'prospect':
                return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-bold">🔥 Prospek Hot</span>;
            case 'deal':
                return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">✅ Deal / SPK</span>;
            case 'rejected':
                return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold">❌ Batal</span>;
            default:
                return <span className="bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-full font-bold">{status}</span>;
        }
    };

    const buildWhatsAppUrl = (p) => {
        if (!p) return '#';
        let cleanPhone = p.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        }
        const text = `Halo Kak ${p.name}, saya dari Sales Yamaha Aspacindo Riau. Menindaklanjuti pengajuan simulasi kredit motor ${p.motorcycle_name} dengan DP ${p.dp_percent}% (Kode Tiket: ${p.ticket_number}). Apakah ada yang bisa kami bantu untuk pengurusan berkas & survey-nya?`;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    return (
        <AdminLayout title="Manajemen Prospect Customer & Leads Simulasi Kredit">
            <Head title="Data Prospect Leads | Admin Aspacindo" />

            <div className="space-y-6">
                {/* Header & Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                        <span className="text-slate-400 text-xs font-bold uppercase">Total Leads</span>
                        <p className="text-2xl font-black text-slate-900 mt-1">{stats.total}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('new')}
                        className="bg-blue-50 p-4 rounded-2xl border border-blue-200 shadow-sm cursor-pointer hover:bg-blue-100 transition"
                    >
                        <span className="text-blue-600 text-xs font-bold uppercase">Prospek Baru</span>
                        <p className="text-2xl font-black text-blue-900 mt-1">{stats.new}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('contacted')}
                        className="bg-amber-50 p-4 rounded-2xl border border-amber-200 shadow-sm cursor-pointer hover:bg-amber-100 transition"
                    >
                        <span className="text-amber-600 text-xs font-bold uppercase">Dihubungi</span>
                        <p className="text-2xl font-black text-amber-900 mt-1">{stats.contacted}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('prospect')}
                        className="bg-purple-50 p-4 rounded-2xl border border-purple-200 shadow-sm cursor-pointer hover:bg-purple-100 transition"
                    >
                        <span className="text-purple-600 text-xs font-bold uppercase">Prospek Hot</span>
                        <p className="text-2xl font-black text-purple-900 mt-1">{stats.prospect}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('deal')}
                        className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 shadow-sm cursor-pointer hover:bg-emerald-100 transition"
                    >
                        <span className="text-emerald-600 text-xs font-bold uppercase">Deal / Closing</span>
                        <p className="text-2xl font-black text-emerald-900 mt-1">{stats.deal}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('rejected')}
                        className="bg-red-50 p-4 rounded-2xl border border-red-200 shadow-sm cursor-pointer hover:bg-red-100 transition"
                    >
                        <span className="text-red-600 text-xs font-bold uppercase">Batal / Cancel</span>
                        <p className="text-2xl font-black text-red-900 mt-1">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2 w-full sm:w-auto flex-1">
                        <input
                            type="text"
                            placeholder="Cari nama, no. HP, tiket, atau nama motor..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:max-w-md text-sm border-slate-200 rounded-xl px-4 py-2.5 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                        <span className="text-xs font-bold text-slate-500 whitespace-nowrap">Filter Status:</span>
                        <button
                            onClick={() => handleFilterStatus('')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                                statusFilter === '' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Semua
                        </button>
                        <button
                            onClick={() => handleFilterStatus('new')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                                statusFilter === 'new' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Baru
                        </button>
                        <button
                            onClick={() => handleFilterStatus('contacted')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                                statusFilter === 'contacted' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Dihubungi
                        </button>
                        <button
                            onClick={() => handleFilterStatus('prospect')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                                statusFilter === 'prospect' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Prospek Hot
                        </button>
                        <button
                            onClick={() => handleFilterStatus('deal')}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                                statusFilter === 'deal' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            Deal
                        </button>
                    </div>
                </div>

                {/* Prospects Data Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                                <tr>
                                    <th className="p-4">Kode Tiket / Tgl</th>
                                    <th className="p-4">Data Customer</th>
                                    <th className="p-4">Motor Impian</th>
                                    <th className="p-4">Rincian Kredit</th>
                                    <th className="p-4">Leasing</th>
                                    <th className="p-4">Status</th>
                                    <th className="p-4 text-center">Aksi & Follow Up</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {prospects.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center p-8 text-slate-400 font-bold">
                                            Belum ada data prospect leads yang ditemukan.
                                        </td>
                                    </tr>
                                ) : (
                                    prospects.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 transition">
                                            <td className="p-4 font-mono">
                                                <span className="font-extrabold text-blue-600 block">{p.ticket_number}</span>
                                                <span className="text-[11px] text-slate-400 block">{formatDate(p.created_at)}</span>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                                                <div className="text-slate-600 font-medium">{p.phone}</div>
                                                <div className="text-[11px] text-slate-400">{p.city || p.email || 'Riau'}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-extrabold text-slate-800">{p.motorcycle_name}</div>
                                                <div className="text-[11px] text-slate-500">OTR: {formatRupiah(p.price_otr)}</div>
                                            </td>
                                            <td className="p-4">
                                                <div className="font-black text-emerald-600 text-xs">
                                                    Cicilan: {formatRupiah(p.monthly_installment)} /bln
                                                </div>
                                                <div className="text-[11px] text-slate-500">
                                                    DP: {p.dp_percent}% ({formatRupiah(p.dp_amount)}) — Tenor: {p.tenor_months} Bln
                                                </div>
                                            </td>
                                            <td className="p-4 font-semibold text-slate-700">{p.leasing_partner}</td>
                                            <td className="p-4">{getStatusBadge(p.status)}</td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <a
                                                        href={buildWhatsAppUrl(p)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Chat via WhatsApp"
                                                        className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-bold transition text-xs flex items-center gap-1"
                                                    >
                                                        📱 WA
                                                    </a>
                                                    <button
                                                        onClick={() => openFollowUpModal(p)}
                                                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition text-xs shadow-sm"
                                                    >
                                                        Follow Up
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(p.id, p.name)}
                                                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl transition text-xs font-bold"
                                                        title="Hapus"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Links */}
                    {prospects.links && prospects.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex justify-between items-center bg-slate-50">
                            <span className="text-xs text-slate-500">
                                Menampilkan {prospects.from} - {prospects.to} dari {prospects.total} prospect
                            </span>
                            <div className="flex gap-1">
                                {prospects.links.map((link, idx) => (
                                    <button
                                        key={idx}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                                                : 'text-slate-300 cursor-not-allowed'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Follow Up & Detail Modal */}
            {showModal && selectedProspect && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                    <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest block font-mono">
                                    TIKET: {selectedProspect.ticket_number}
                                </span>
                                <h3 className="text-xl font-black text-slate-900 mt-1">Detail Prospect Customer</h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 font-extrabold text-lg p-1"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Customer & Credit Info Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                                <h4 className="font-extrabold text-slate-900 uppercase text-[11px] text-blue-600 tracking-wider">
                                    👤 Data Diri Customer
                                </h4>
                                <div>
                                    <span className="text-slate-400 block">Nama Lengkap:</span>
                                    <span className="font-bold text-slate-900 text-sm">{selectedProspect.name}</span>
                                </div>
                                <div>
                                    <span className="text-slate-400 block">No. HP / WhatsApp:</span>
                                    <span className="font-bold text-slate-900">{selectedProspect.phone}</span>
                                </div>
                                {selectedProspect.email && (
                                    <div>
                                        <span className="text-slate-400 block">Email:</span>
                                        <span className="font-semibold text-slate-700">{selectedProspect.email}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-slate-400 block">Kota / Alamat:</span>
                                    <span className="font-semibold text-slate-700">
                                        {selectedProspect.city || '-'} — {selectedProspect.address || ''}
                                    </span>
                                </div>
                                {selectedProspect.current_motorcycle && (
                                    <div>
                                        <span className="text-slate-400 block">Motor yang Dimiliki Sekarang:</span>
                                        <span className="font-semibold text-slate-800">{selectedProspect.current_motorcycle}</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 space-y-2">
                                <h4 className="font-extrabold text-blue-900 uppercase text-[11px] tracking-wider">
                                    🏍️ Rincian Simulasi Kredit
                                </h4>
                                <div>
                                    <span className="text-blue-500 block">Motor Impian:</span>
                                    <span className="font-bold text-slate-900 text-sm">{selectedProspect.motorcycle_name}</span>
                                </div>
                                <div>
                                    <span className="text-blue-500 block">Harga OTR:</span>
                                    <span className="font-bold text-slate-900">{formatRupiah(selectedProspect.price_otr)}</span>
                                </div>
                                <div>
                                    <span className="text-blue-500 block">Uang Muka (DP):</span>
                                    <span className="font-bold text-slate-900">
                                        {selectedProspect.dp_percent}% ({formatRupiah(selectedProspect.dp_amount)})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-500 block">Tenor & Estimasi Cicilan:</span>
                                    <span className="font-extrabold text-emerald-700 text-sm block">
                                        {formatRupiah(selectedProspect.monthly_installment)} /bln ({selectedProspect.tenor_months} Bulan)
                                    </span>
                                </div>
                                <div>
                                    <span className="text-blue-500 block">Mitra Leasing:</span>
                                    <span className="font-bold text-slate-800">{selectedProspect.leasing_partner}</span>
                                </div>
                            </div>
                        </div>

                        {selectedProspect.notes && (
                            <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-2xl text-xs text-amber-900">
                                <span className="font-bold block">Catatan Customer:</span>
                                <p className="mt-0.5">{selectedProspect.notes}</p>
                            </div>
                        )}

                        {/* Direct WA Action */}
                        <div className="flex justify-between items-center bg-slate-900 text-white p-4 rounded-2xl">
                            <div>
                                <span className="text-xs font-bold text-slate-300 block">Hubungi Langsung:</span>
                                <span className="text-sm font-black">{selectedProspect.name} ({selectedProspect.phone})</span>
                            </div>
                            <a
                                href={buildWhatsAppUrl(selectedProspect)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition"
                            >
                                💬 Chat WhatsApp Sales
                            </a>
                        </div>

                        {/* Status Update Form */}
                        <form onSubmit={handleSubmitFollowUp} className="space-y-4 pt-2 border-t border-slate-100">
                            <h4 className="font-extrabold text-slate-900 text-sm">Update Status Follow-Up CRM</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-600 block mb-1">Status Prospek</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5 font-bold focus:ring-blue-500"
                                    >
                                        <option value="new">🌟 Baru (Belum dihubungi)</option>
                                        <option value="contacted">📞 Dihubungi (Follow up berjalan)</option>
                                        <option value="prospect">🔥 Prospek Hot (Menunggu Berkas/Survey)</option>
                                        <option value="deal">✅ Deal / SPK (ACC Leasing / Beli)</option>
                                        <option value="rejected">❌ Batal / Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-600 block mb-1">Catatan Follow Up Internal Sales</label>
                                <textarea
                                    rows="3"
                                    placeholder="Tuliskan catatan hasil telepon, janji survey, kelengkapan berkas, dll..."
                                    value={data.follow_up_notes}
                                    onChange={(e) => setData('follow_up_notes', e.target.value)}
                                    className="w-full text-xs border-slate-200 rounded-xl p-3 focus:ring-blue-500"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-xs shadow-md transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Pembaruan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
