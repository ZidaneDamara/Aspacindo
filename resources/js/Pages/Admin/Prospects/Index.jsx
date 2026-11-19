import React, { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import {
    Search,
    MessageSquare,
    Trash2,
    CheckCircle2,
    XCircle,
    PhoneCall,
    Sparkles,
    Flame,
    User,
    Bike,
    Calendar,
    CreditCard,
    ExternalLink,
    X,
    Filter,
} from 'lucide-react';

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
        }).format(number || 0);
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
                return (
                    <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-900 border border-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        <Sparkles className="w-3 h-3 text-zinc-700" />
                        Baru
                    </span>
                );
            case 'contacted':
                return (
                    <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        <PhoneCall className="w-3 h-3 text-zinc-600" />
                        Dihubungi
                    </span>
                );
            case 'prospect':
                return (
                    <span className="inline-flex items-center gap-1 bg-zinc-100 text-zinc-900 border border-zinc-300 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        <Flame className="w-3 h-3 text-zinc-700" />
                        Prospek Hot
                    </span>
                );
            case 'deal':
                return (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Deal / SPK
                    </span>
                );
            case 'rejected':
                return (
                    <span className="inline-flex items-center gap-1 bg-rose-50 text-rose-800 border border-rose-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        <XCircle className="w-3 h-3 text-rose-600" />
                        Batal
                    </span>
                );
            default:
                return (
                    <span className="bg-zinc-100 text-zinc-800 border border-zinc-200 text-[10px] px-2 py-0.5 rounded-full font-semibold">
                        {status}
                    </span>
                );
        }
    };

    const buildWhatsAppUrl = (p) => {
        if (!p) return '#';
        let cleanPhone = p.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('0')) {
            cleanPhone = '62' + cleanPhone.slice(1);
        }
        const text = `Halo Kak ${p.name}, saya dari Sales Yamaha Aspacindo. Menindaklanjuti pengajuan simulasi kredit motor ${p.motorcycle_name} dengan DP ${p.dp_percent}% (Kode Tiket: ${p.ticket_number}). Apakah ada yang bisa kami bantu untuk pengurusan berkas & survey-nya?`;
        return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    };

    return (
        <AdminLayout title="Manajemen Prospek & Leads Simulasi Kredit">
            <Head title="Data Prospect Leads | Admin" />

            <div className="space-y-6">
                {/* Header & Metrics in Shadcn Monochrome Style */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
                        <span className="text-zinc-400 text-[11px] font-semibold uppercase tracking-wider block">Total Leads</span>
                        <p className="text-2xl font-bold text-zinc-900 mt-1">{stats.total}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('new')}
                        className={`p-4 rounded-xl border transition cursor-pointer shadow-2xs ${
                            statusFilter === 'new' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                    >
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${statusFilter === 'new' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            Prospek Baru
                        </span>
                        <p className="text-2xl font-bold mt-1">{stats.new}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('contacted')}
                        className={`p-4 rounded-xl border transition cursor-pointer shadow-2xs ${
                            statusFilter === 'contacted' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                    >
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${statusFilter === 'contacted' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            Dihubungi
                        </span>
                        <p className="text-2xl font-bold mt-1">{stats.contacted}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('prospect')}
                        className={`p-4 rounded-xl border transition cursor-pointer shadow-2xs ${
                            statusFilter === 'prospect' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                    >
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${statusFilter === 'prospect' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            Prospek Hot
                        </span>
                        <p className="text-2xl font-bold mt-1">{stats.prospect}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('deal')}
                        className={`p-4 rounded-xl border transition cursor-pointer shadow-2xs ${
                            statusFilter === 'deal' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                    >
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${statusFilter === 'deal' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            Deal / SPK
                        </span>
                        <p className="text-2xl font-bold mt-1">{stats.deal}</p>
                    </div>
                    <div
                        onClick={() => handleFilterStatus('rejected')}
                        className={`p-4 rounded-xl border transition cursor-pointer shadow-2xs ${
                            statusFilter === 'rejected' ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white hover:bg-zinc-50 border-zinc-200 text-zinc-900'
                        }`}
                    >
                        <span className={`text-[11px] font-semibold uppercase tracking-wider block ${statusFilter === 'rejected' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                            Batal
                        </span>
                        <p className="text-2xl font-bold mt-1">{stats.rejected}</p>
                    </div>
                </div>

                {/* Filter & Search Bar */}
                <div className="bg-white p-3.5 rounded-xl border border-zinc-200 shadow-2xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
                    <form onSubmit={handleSearch} className="flex gap-2 flex-1 max-w-md">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Cari nama, no. HP, tiket, atau motor..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full text-xs pl-9 pr-3 py-2 border border-zinc-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-zinc-900 hover:bg-zinc-800 text-white font-semibold px-4 py-2 rounded-lg text-xs transition shadow-xs"
                        >
                            Cari
                        </button>
                    </form>

                    <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg border border-zinc-200 overflow-x-auto">
                        <span className="text-[11px] font-semibold text-zinc-500 uppercase px-2 whitespace-nowrap">Status:</span>
                        {[
                            { label: 'Semua', val: '' },
                            { label: 'Baru', val: 'new' },
                            { label: 'Dihubungi', val: 'contacted' },
                            { label: 'Hot', val: 'prospect' },
                            { label: 'Deal', val: 'deal' },
                            { label: 'Batal', val: 'rejected' },
                        ].map((btn) => (
                            <button
                                key={btn.val}
                                type="button"
                                onClick={() => handleFilterStatus(btn.val)}
                                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition ${
                                    statusFilter === btn.val
                                        ? 'bg-zinc-900 text-white shadow-xs'
                                        : 'text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200/70'
                                }`}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Prospects Data Table */}
                <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-zinc-600">
                            <thead className="bg-zinc-50/75 border-b border-zinc-200 text-zinc-700 uppercase tracking-wider font-semibold text-[11px]">
                                <tr>
                                    <th className="px-4 py-3">Kode Tiket / Tgl</th>
                                    <th className="px-4 py-3">Data Calon Pembeli</th>
                                    <th className="px-4 py-3">Motor Impian</th>
                                    <th className="px-4 py-3">Rincian Kredit</th>
                                    <th className="px-4 py-3">Leasing</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-200">
                                {prospects.data.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-16 px-4">
                                            <div className="flex flex-col items-center justify-center text-center">
                                                <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                    <Filter className="w-6 h-6 text-zinc-400" />
                                                </div>
                                                <h3 className="text-sm font-semibold text-zinc-900">Tidak ada data prospect leads</h3>
                                                <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                    Belum ada pengajuan simulasi kredit yang sesuai dengan kriteria pencarian atau filter yang dipilih.
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    prospects.data.map((p) => (
                                        <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                                            <td className="px-4 py-3 font-mono">
                                                <span className="font-semibold text-zinc-900 block">{p.ticket_number}</span>
                                                <span className="text-[11px] text-zinc-400 block">{formatDate(p.created_at)}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-zinc-900 text-sm">{p.name}</div>
                                                <div className="text-zinc-600 font-medium">{p.phone}</div>
                                                <div className="text-[11px] text-zinc-400">{p.city || p.email || 'Riau'}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-zinc-900">{p.motorcycle_name}</div>
                                                <div className="text-[11px] text-zinc-400">OTR: {formatRupiah(p.price_otr)}</div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="font-semibold text-zinc-900">
                                                    {formatRupiah(p.monthly_installment)} /bln
                                                </div>
                                                <div className="text-[11px] text-zinc-400">
                                                    DP: {p.dp_percent}% ({formatRupiah(p.dp_amount)}) &bull; {p.tenor_months} Bln
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 font-medium text-zinc-700">{p.leasing_partner}</td>
                                            <td className="px-4 py-3">{getStatusBadge(p.status)}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    <a
                                                        href={buildWhatsAppUrl(p)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="Hubungi via WhatsApp"
                                                        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900 text-xs font-medium transition shadow-2xs"
                                                    >
                                                        <MessageSquare className="w-3.5 h-3.5 text-zinc-500" />
                                                        <span>WA</span>
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={() => openFollowUpModal(p)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-medium transition shadow-xs"
                                                    >
                                                        <span>Follow Up</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(p.id, p.name)}
                                                        className="inline-flex items-center justify-center w-7 h-7 rounded-md border border-transparent text-zinc-400 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition"
                                                        title="Hapus"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
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
                        <div className="p-3.5 border-t border-zinc-200 flex justify-between items-center text-xs text-zinc-500 bg-zinc-50/50">
                            <span>
                                Menampilkan {prospects.from} - {prospects.to} dari {prospects.total} prospect
                            </span>
                            <div className="flex gap-1">
                                {prospects.links.map((link, idx) => (
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

            {/* Follow Up & Detail Modal (Monochrome Shadcn) */}
            {showModal && selectedProspect && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-xl border border-zinc-200 relative my-8">
                        <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
                            <div>
                                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest block font-mono">
                                    TIKET: {selectedProspect.ticket_number}
                                </span>
                                <h3 className="text-lg font-bold text-zinc-900 mt-0.5">Detail Prospect Customer</h3>
                            </div>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Customer & Credit Info Summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                                <h4 className="font-semibold text-zinc-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-zinc-500" />
                                    Data Diri Customer
                                </h4>
                                <div>
                                    <span className="text-zinc-400 block">Nama Lengkap:</span>
                                    <span className="font-semibold text-zinc-900 text-sm">{selectedProspect.name}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 block">No. HP / WhatsApp:</span>
                                    <span className="font-semibold text-zinc-900">{selectedProspect.phone}</span>
                                </div>
                                {selectedProspect.email && (
                                    <div>
                                        <span className="text-zinc-400 block">Email:</span>
                                        <span className="font-medium text-zinc-700">{selectedProspect.email}</span>
                                    </div>
                                )}
                                <div>
                                    <span className="text-zinc-400 block">Kota / Alamat:</span>
                                    <span className="font-medium text-zinc-700">
                                        {selectedProspect.city || '-'} — {selectedProspect.address || ''}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
                                <h4 className="font-semibold text-zinc-900 uppercase text-[11px] tracking-wider flex items-center gap-1.5">
                                    <Bike className="w-3.5 h-3.5 text-zinc-500" />
                                    Rincian Simulasi Kredit
                                </h4>
                                <div>
                                    <span className="text-zinc-400 block">Motor Impian:</span>
                                    <span className="font-semibold text-zinc-900 text-sm">{selectedProspect.motorcycle_name}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 block">Harga OTR:</span>
                                    <span className="font-semibold text-zinc-900">{formatRupiah(selectedProspect.price_otr)}</span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 block">Uang Muka (DP):</span>
                                    <span className="font-semibold text-zinc-900">
                                        {selectedProspect.dp_percent}% ({formatRupiah(selectedProspect.dp_amount)})
                                    </span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 block">Tenor &amp; Cicilan:</span>
                                    <span className="font-bold text-zinc-900 block">
                                        {formatRupiah(selectedProspect.monthly_installment)} /bln ({selectedProspect.tenor_months} Bulan)
                                    </span>
                                </div>
                                <div>
                                    <span className="text-zinc-400 block">Mitra Leasing:</span>
                                    <span className="font-medium text-zinc-800">{selectedProspect.leasing_partner}</span>
                                </div>
                            </div>
                        </div>

                        {selectedProspect.notes && (
                            <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg text-xs text-zinc-700">
                                <span className="font-semibold block text-zinc-900">Catatan Customer:</span>
                                <p className="mt-0.5">{selectedProspect.notes}</p>
                            </div>
                        )}

                        {/* Direct WA Action */}
                        <div className="flex justify-between items-center bg-zinc-900 text-white p-4 rounded-xl">
                            <div>
                                <span className="text-xs text-zinc-400 block">Hubungi Langsung:</span>
                                <span className="text-sm font-bold">{selectedProspect.name} ({selectedProspect.phone})</span>
                            </div>
                            <a
                                href={buildWhatsAppUrl(selectedProspect)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white hover:bg-zinc-100 text-zinc-950 font-semibold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition"
                            >
                                <MessageSquare className="w-3.5 h-3.5" />
                                Chat WhatsApp
                            </a>
                        </div>

                        {/* Status Update Form */}
                        <form onSubmit={handleSubmitFollowUp} className="space-y-4 pt-2 border-t border-zinc-200">
                            <h4 className="font-semibold text-zinc-900 text-xs uppercase tracking-wider">Update Status Follow-Up CRM</h4>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-zinc-700 block mb-1">Status Prospek</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full text-xs border border-zinc-300 rounded-lg p-2.5 font-medium focus:ring-1 focus:ring-zinc-900 bg-white"
                                    >
                                        <option value="new">Baru (Belum dihubungi)</option>
                                        <option value="contacted">Dihubungi (Follow up berjalan)</option>
                                        <option value="prospect">Prospek Hot (Menunggu Berkas/Survey)</option>
                                        <option value="deal">Deal / SPK (ACC Leasing / Beli)</option>
                                        <option value="rejected">Batal / Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-zinc-700 block mb-1">Catatan Follow Up Internal Sales</label>
                                <textarea
                                    rows="3"
                                    placeholder="Tuliskan catatan hasil telepon, janji survey, kelengkapan berkas, dll..."
                                    value={data.follow_up_notes}
                                    onChange={(e) => setData('follow_up_notes', e.target.value)}
                                    className="w-full text-xs border border-zinc-300 rounded-lg p-3 focus:ring-1 focus:ring-zinc-900"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-2.5 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg border border-zinc-200 text-zinc-600 font-semibold text-xs hover:bg-zinc-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg font-semibold text-xs transition disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : 'Simpan Status'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
