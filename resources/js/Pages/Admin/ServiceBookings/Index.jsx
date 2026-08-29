import React from 'react';
import { router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import Pagination from '@/Components/Pagination';

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
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Filter Status:</label>
                        <select
                            value={filters.status || ''}
                            onChange={(e) => handleFilterChange(e.target.value, filters.branch_id)}
                            className="text-xs border-slate-200 rounded-xl focus:ring-blue-500"
                        >
                            <option value="">Semua Status</option>
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <label className="text-xs font-bold text-slate-500 uppercase whitespace-nowrap">Filter Cabang:</label>
                        <select
                            value={filters.branch_id || ''}
                            onChange={(e) => handleFilterChange(filters.status, e.target.value)}
                            className="text-xs border-slate-200 rounded-xl focus:ring-blue-500"
                        >
                            <option value="">Semua Cabang</option>
                            {branches.map((b) => (
                                <option key={b.id} value={b.id}>{b.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs text-slate-700">
                        <thead className="bg-slate-100 uppercase font-black text-slate-900 border-b border-slate-200">
                            <tr>
                                <th className="p-4">Kode Booking</th>
                                <th className="p-4">Pemilik &amp; WhatsApp</th>
                                <th className="p-4">Motor</th>
                                <th className="p-4">Cabang</th>
                                <th className="p-4">Jadwal Servis</th>
                                <th className="p-4">Update Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {bookings.data.map((item) => (
                                <tr key={item.id} className="hover:bg-slate-50">
                                    <td className="p-4 font-mono font-bold text-blue-600">{item.booking_code}</td>
                                    <td className="p-4">
                                        <p className="font-bold text-slate-900">{item.customer_name}</p>
                                        <a
                                            href={`https://wa.me/${item.phone_number}?text=${encodeURIComponent(`Halo ${item.customer_name}, kami dari Yamaha Aspacindo mengenai Booking Service ${item.booking_code}...`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-emerald-600 font-bold hover:underline"
                                        >
                                            📲 {item.phone_number}
                                        </a>
                                    </td>
                                    <td className="p-4 font-semibold text-slate-800">{item.motorcycle_model}</td>
                                    <td className="p-4 text-slate-500">{item.branch?.name}</td>
                                    <td className="p-4 font-medium text-slate-700">
                                        {item.preferred_date} ({item.preferred_time})
                                    </td>
                                    <td className="p-4">
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(item.id, e.target.value)}
                                            className="text-xs border-slate-200 rounded-xl p-2 font-bold focus:ring-blue-500"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="completed">Completed</option>
                                            <option value="cancelled">Cancelled</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={bookings.links} />
            </div>
        </AdminLayout>
    );
}
