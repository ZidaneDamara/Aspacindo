import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';
import { MessageSquare, Calendar, Wrench, Building2 } from 'lucide-react';

export default function Index({ bookings, branches = [], filters = {} }) {
    const handleStatusChange = (id, newStatus) => {
        router.post(`/admin/service-bookings/${id}/status`, { status: newStatus });
    };

    const handleFilterChange = (status, branchId) => {
        router.get('/admin/service-bookings', {
            status: status || undefined,
            branch_id: branchId || undefined,
        }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout title="Kelola Antrean Booking Service">
            <div className="space-y-6">
                {/* Filter Toolbar */}
                <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase whitespace-nowrap">Filter Status:</label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange(e.target.value, filters.branch_id)}
                            className="text-xs border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 py-1.5 px-3 text-zinc-800"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase whitespace-nowrap">Filter Cabang:</label>
                        <select
                            value={filters.branch_id || ''}
                            onChange={(e) => handleFilterChange(filters.status, e.target.value)}
                            className="text-xs border-zinc-300 rounded-lg focus:ring-1 focus:ring-zinc-900 bg-zinc-50/50 py-1.5 px-3 text-zinc-800"
                        >
                            <option value="">Semua Cabang</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
                    <table className="w-full text-left text-xs text-zinc-600">
                        <thead className="bg-zinc-50/75 uppercase font-semibold text-[11px] text-zinc-700 border-b border-zinc-200">
                            <tr>
                                <th className="px-4 py-3">Kode Booking</th>
                                <th className="px-4 py-3">Pelanggan &amp; Kontak</th>
                                <th className="px-4 py-3">Model Motor</th>
                                <th className="px-4 py-3">Cabang Bengkel</th>
                                <th className="px-4 py-3">Jadwal Servis</th>
                                <th className="px-4 py-3 text-right">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200">
                            {bookings.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 px-4">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-3 border border-zinc-200">
                                                <Wrench className="w-6 h-6 text-zinc-400" />
                                            </div>
                                            <h3 className="text-sm font-semibold text-zinc-900">Tidak ada antrean booking service</h3>
                                            <p className="text-xs text-zinc-500 mt-1 max-w-sm">
                                                Antrean pendaftaran servis berkala online dari pelanggan bengkel akan muncul di sini.
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                bookings.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-zinc-50/60 transition-colors">
                                        <td className="px-4 py-3 font-mono font-semibold text-zinc-900">{item.booking_code}</td>
                                        <td className="px-4 py-3">
                                            <p className="font-semibold text-zinc-900">{item.customer_name}</p>
                                            <a
                                                href={`https://wa.me/${item.phone_number}?text=${encodeURIComponent(`Halo ${item.customer_name}, kami dari Yamaha Aspacindo mengenai Booking Service ${item.booking_code}...`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-950 font-medium text-[11px] mt-0.5"
                                            >
                                                <MessageSquare className="w-3 h-3 text-zinc-500" />
                                                {item.phone_number}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-zinc-800">{item.motorcycle_model}</td>
                                        <td className="px-4 py-3 text-zinc-500">{item.branch?.name}</td>
                                        <td className="px-4 py-3 text-zinc-600">
                                            {item.preferred_date} ({item.preferred_time})
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <select
                                                value={item.status}
                                                onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                                className="text-xs border border-zinc-300 rounded-lg py-1 px-2.5 font-medium focus:ring-1 focus:ring-zinc-900 bg-white"
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="confirmed">Confirmed</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination links={bookings.links} />
            </div>
        </AdminLayout>
    );
}
