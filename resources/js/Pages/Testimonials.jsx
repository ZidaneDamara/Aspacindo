import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import Pagination from '@/Components/Pagination';

export default function Testimonials({ testimonials, branches = [] }) {
    const { flash } = usePage().props;
    const [modalOpen, setModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        customer_name: '',
        branch_id: '',
        rating: 5,
        review_text: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/testimoni', {
            onSuccess: () => {
                reset();
                setModalOpen(false);
            },
        });
    };

    return (
        <PublicLayout title="Testimoni & Ulasan Pelanggan Setia Aspacindo">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Kepuasan Pelanggan</span>
                        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Testimoni &amp; Ulasan Pembeli</h1>
                        <p className="text-slate-400 text-sm mt-1">Pengalaman nyata para pemilik sepeda motor Yamaha Aspacindo Kedaton Motor.</p>
                    </div>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition"
                    >
                        + Tulis Ulasan Anda
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm font-bold">
                        {flash.success}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {testimonials.data.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                            <div className="space-y-3">
                                {/* Stars */}
                                <div className="flex items-center gap-1 text-amber-400">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className={`w-4 h-4 ${i < item.rating ? 'fill-current' : 'text-slate-200 fill-current'}`}
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-600 italic leading-relaxed">"{item.review_text}"</p>
                            </div>
                            <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
                                <span className="text-sm font-black text-slate-900">{item.customer_name}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">{item.branch?.name || 'Cabang Riau'}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <Pagination links={testimonials.links} />

                {/* Submit Modal */}
                {modalOpen && (
                    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl relative">
                            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                                <h3 className="text-xl font-black text-slate-900">Tulis Ulasan Kepuasan</h3>
                                <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Nama Anda</label>
                                    <input
                                        type="text"
                                        required
                                        value={data.customer_name}
                                        onChange={(e) => setData('customer_name', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Cabang Pembelian / Servis</label>
                                    <select
                                        value={data.branch_id}
                                        onChange={(e) => setData('branch_id', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                    >
                                        <option value="">Pilih Cabang (Opsional)</option>
                                        {branches.map((b) => (
                                            <option key={b.id} value={b.id}>{b.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Rating Bintang (1-5)</label>
                                    <select
                                        value={data.rating}
                                        onChange={(e) => setData('rating', parseInt(e.target.value))}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                    >
                                        <option value="5">⭐⭐⭐⭐⭐ (Sangat Puas)</option>
                                        <option value="4">⭐⭐⭐⭐ (Puas)</option>
                                        <option value="3">⭐⭐⭐ (Cukup)</option>
                                        <option value="2">⭐⭐ (Kurang Puas)</option>
                                        <option value="1">⭐ (Kecewa)</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Ulasan Pengalaman Anda</label>
                                    <textarea
                                        rows="4"
                                        required
                                        placeholder="Ceritakan pengalaman Anda saat membeli motor atau servis di Aspacindo..."
                                        value={data.review_text}
                                        onChange={(e) => setData('review_text', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider disabled:opacity-50"
                                >
                                    Kirim Ulasan &rarr;
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
