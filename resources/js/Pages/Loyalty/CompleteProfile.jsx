import React from 'react';
import { useForm } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function CompleteProfile({ user }) {
    const { data, setData, post, processing, errors } = useForm({
        phone_number: user?.phone_number || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/loyalty/complete-profile');
    };

    return (
        <PublicLayout title="Lengkapi Profil Member Loyalty">
            <div className="max-w-xl mx-auto px-4 py-16">
                <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-xl space-y-6">
                    <div className="text-center space-y-2">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl mx-auto flex items-center justify-center font-black text-xl">
                            ALC
                        </div>
                        <h2 className="text-2xl font-black text-slate-900">Satu Langkah Lagi!</h2>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                            Masukkan nomor WhatsApp / telepon aktif Anda. Nomor ini digunakan oleh staff kasir dealer untuk mencari akun loyalty saat transaksi.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Nomor WhatsApp Aktif</label>
                            <input
                                type="text"
                                required
                                placeholder="Contoh: 081234567890"
                                value={data.phone_number}
                                onChange={(e) => setData('phone_number', e.target.value)}
                                className="w-full text-base border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500 focus:border-blue-500 font-semibold"
                            />
                            {errors.phone_number && <p className="text-xs text-red-500">{errors.phone_number}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-4 rounded-2xl shadow-lg transition text-sm uppercase tracking-wider disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Aktifkan Akun Loyalty Saya &rarr;'}
                        </button>
                    </form>
                </div>
            </div>
        </PublicLayout>
    );
}
