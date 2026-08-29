import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import QRCode from '@/Components/QRCode';
import Pagination from '@/Components/Pagination';
import LazyImage from '@/Components/LazyImage';

export default function Dashboard({
    member,
    tierProgress = {},
    transactions = {},
    rewards = [],
    redemptions = [],
}) {
    const { flash, auth } = usePage().props;
    const user = auth?.user;

    const [activeTab, setActiveTab] = useState('rewards');
    const [selectedReward, setSelectedReward] = useState(null);

    const { data: redeemData, setData: setRedeemData, post: postRedeem, processing: redeeming } = useForm({
        reward_id: '',
    });

    const { data: profileData, setData: setProfileData, post: postProfile, processing: updatingProfile, errors: profileErrors } = useForm({
        phone_number: member?.phone_number || user?.phone_number || '',
    });

    const handleRedeemClick = (reward) => {
        setSelectedReward(reward);
        setRedeemData('reward_id', reward.id);
    };

    const confirmRedemption = () => {
        postRedeem('/loyalty/redeem', {
            onSuccess: () => setSelectedReward(null),
        });
    };

    const handleProfileSubmit = (e) => {
        e.preventDefault();
        postProfile('/loyalty/profile');
    };

    const getTierColor = (tier) => {
        if (tier === 'Platinum') return 'from-slate-900 via-slate-800 to-slate-950 text-white border-slate-700';
        if (tier === 'Gold') return 'from-amber-500 via-amber-600 to-amber-700 text-slate-950 border-amber-400';
        return 'from-slate-700 via-slate-600 to-slate-800 text-white border-slate-500';
    };

    return (
        <PublicLayout title="Dashboard Member Aspacindo Loyalty">
            <div className="bg-slate-900 text-white py-10 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Loyalty Portal</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Dashboard Member ALC</h1>
                    <p className="text-slate-400 text-sm mt-1">Selamat datang kembali, <strong className="text-white">{user?.name}</strong>!</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
                {/* Flash Notifications */}
                {flash?.success && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-sm font-bold flex items-center gap-2">
                        <span>✓</span> {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-900 text-sm font-bold flex items-center gap-2">
                        <span>⚠️</span> {flash.error}
                    </div>
                )}

                {/* DIGITAL MEMBERSHIP CARD & STATS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Left: Digital Card */}
                    <div className="lg:col-span-6">
                        <div className={`p-8 rounded-3xl bg-gradient-to-r ${getTierColor(member.tier)} shadow-2xl border space-y-6 relative overflow-hidden`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80 block">PT Aspacindo Kedaton Motor</span>
                                    <h3 className="text-2xl font-black tracking-wider">MEMBER DIGITAL</h3>
                                </div>
                                <span className="px-3.5 py-1 bg-slate-950 text-amber-400 font-black text-xs rounded-full uppercase shadow">
                                    {member.tier} TIER
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs uppercase font-semibold opacity-80 block">Saldo Poin Utama</span>
                                    <p className="text-4xl sm:text-5xl font-black tracking-tight">
                                        {new Intl.NumberFormat('id-ID').format(member.points_balance)} <span className="text-sm font-bold">POIN</span>
                                    </p>
                                </div>
                                <QRCode value={member.member_code} size={110} />
                            </div>

                            <div className="pt-4 border-t border-white/20 flex justify-between items-end text-xs">
                                <div>
                                    <p className="font-medium opacity-75">Nama Pemilik</p>
                                    <p className="font-extrabold text-sm uppercase">{user?.name}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium opacity-75">Nomor Member ALC</p>
                                    <p className="font-mono font-black text-sm">{member.member_code}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Quick Stats & Progress Bar */}
                    <div className="lg:col-span-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-xs text-slate-500 font-semibold uppercase block">Total Poin Seumur Hidup</span>
                                <p className="text-2xl font-black text-slate-900 mt-1">
                                    {new Intl.NumberFormat('id-ID').format(member.total_points_earned)} Poin
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-xs text-slate-500 font-semibold uppercase block">Status Tier Hari Ini</span>
                                <p className="text-2xl font-black text-blue-700 mt-1">{member.tier}</p>
                            </div>
                        </div>

                        {/* Tier Progress Bar */}
                        <div className="space-y-2 pt-2">
                            <div className="flex justify-between text-xs font-bold">
                                <span className="text-slate-600">Progres Menuju {tierProgress.nextTier}</span>
                                <span className="text-blue-700">{tierProgress.progressPercent}%</span>
                            </div>
                            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-600 to-amber-500 rounded-full transition-all duration-500"
                                    style={{ width: `${tierProgress.progressPercent}%` }}
                                />
                            </div>
                            {tierProgress.nextTier !== 'Max Tier' ? (
                                <p className="text-xs text-slate-500">
                                    Kumpulkan <strong className="text-slate-900">{tierProgress.pointsNeeded} poin lagi</strong> untuk naik ke tingkat {tierProgress.nextTier}.
                                </p>
                            ) : (
                                <p className="text-xs text-emerald-600 font-bold">Selamat! Anda telah mencapai tingkat Tier tertinggi.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* TAB NAVIGATION */}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex border-b border-slate-100 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab('rewards')}
                            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
                                activeTab === 'rewards'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Katalog Hadiah (Voucher &amp; Merchandise)
                        </button>
                        <button
                            onClick={() => setActiveTab('transactions')}
                            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
                                activeTab === 'transactions'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Riwayat Transaksi Poin
                        </button>
                        <button
                            onClick={() => setActiveTab('redemptions')}
                            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
                                activeTab === 'redemptions'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Riwayat Penukaran Hadiah ({redemptions.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-4 text-xs font-extrabold uppercase tracking-wider transition whitespace-nowrap ${
                                activeTab === 'profile'
                                    ? 'bg-blue-600 text-white'
                                    : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            Pengaturan Profil Member
                        </button>
                    </div>

                    <div className="p-6 sm:p-8">
                        {/* TAB 1: REWARDS CATALOG */}
                        {activeTab === 'rewards' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-slate-900">Katalog Hadiah Yang Bisa Ditukar</h3>
                                    <span className="text-xs font-bold text-slate-500">Saldo Poin: {member.points_balance} Poin</span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {rewards.map((reward) => {
                                        const canAfford = member.points_balance >= reward.points_cost;

                                        return (
                                            <div key={reward.id} className="bg-slate-50 rounded-3xl border border-slate-100 p-5 space-y-4 flex flex-col justify-between shadow-sm">
                                                <div className="space-y-3">
                                                    <LazyImage
                                                        src={reward.image || '/assets/images/placeholder_reward.webp'}
                                                        alt={reward.name}
                                                        aspectRatio="aspect-[4/3]"
                                                    />
                                                    <span className="inline-block text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full uppercase">
                                                        {reward.points_cost} POIN
                                                    </span>
                                                    <h4 className="text-base font-bold text-slate-900">{reward.name}</h4>
                                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{reward.description}</p>
                                                </div>

                                                <button
                                                    onClick={() => handleRedeemClick(reward)}
                                                    disabled={!canAfford}
                                                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition ${
                                                        canAfford
                                                            ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                                                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    {canAfford ? 'Tukar Sekarang' : 'Poin Tidak Cukup'}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* TAB 2: TRANSACTIONS HISTORY */}
                        {activeTab === 'transactions' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900">Riwayat Perubahan Poin</h3>
                                {transactions.data?.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs text-slate-700 border-collapse">
                                            <thead>
                                                <tr className="bg-slate-100 text-slate-900 uppercase font-black">
                                                    <th className="p-3.5 rounded-l-xl">Tanggal</th>
                                                    <th className="p-3.5">Tipe</th>
                                                    <th className="p-3.5">Sumber</th>
                                                    <th className="p-3.5">Deskripsi</th>
                                                    <th className="p-3.5 rounded-r-xl text-right">Poin</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {transactions.data.map((tx) => (
                                                    <tr key={tx.id} className="hover:bg-slate-50">
                                                        <td className="p-3.5 font-medium">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                                                        <td className="p-3.5">
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                                tx.type === 'earn' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {tx.type}
                                                            </span>
                                                        </td>
                                                        <td className="p-3.5 font-semibold text-slate-800">{tx.source}</td>
                                                        <td className="p-3.5 text-slate-600">{tx.description}</td>
                                                        <td className={`p-3.5 font-black text-right ${tx.points > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                                            {tx.points > 0 ? `+${tx.points}` : tx.points}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <Pagination links={transactions.links} />
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">Belum ada riwayat transaksi poin.</p>
                                )}
                            </div>
                        )}

                        {/* TAB 3: REDEMPTIONS HISTORY */}
                        {activeTab === 'redemptions' && (
                            <div className="space-y-6">
                                <h3 className="text-xl font-black text-slate-900">Riwayat Penukaran Hadiah Saya</h3>
                                {redemptions.length > 0 ? (
                                    <div className="space-y-3">
                                        {redemptions.map((red) => (
                                            <div key={red.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <h4 className="font-bold text-sm text-slate-900">{red.reward?.name}</h4>
                                                    <p className="text-xs text-slate-500">Tanggal Klaim: {new Date(red.redeemed_at).toLocaleDateString('id-ID')}</p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                                                        -{red.points_spent} Poin
                                                    </span>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                        red.status === 'fulfilled' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {red.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 italic">Belum ada klaim penukaran hadiah.</p>
                                )}
                            </div>
                        )}

                        {/* TAB 4: PROFILE SETTINGS */}
                        {activeTab === 'profile' && (
                            <div className="max-w-xl space-y-6">
                                <h3 className="text-xl font-black text-slate-900">Pengaturan Profil Member</h3>
                                <form onSubmit={handleProfileSubmit} className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Nama Member (Sesuai Google)</label>
                                        <input
                                            type="text"
                                            disabled
                                            value={user?.name || ''}
                                            className="w-full text-sm bg-slate-100 border-slate-200 rounded-2xl p-3 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Email (Sesuai Google)</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={user?.email || ''}
                                            className="w-full text-sm bg-slate-100 border-slate-200 rounded-2xl p-3 text-slate-500 cursor-not-allowed"
                                        />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase">Nomor Telepon / WhatsApp Kasir</label>
                                        <input
                                            type="text"
                                            required
                                            value={profileData.phone_number}
                                            onChange={(e) => setProfileData('phone_number', e.target.value)}
                                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                        />
                                        {profileErrors.phone_number && <p className="text-xs text-red-500">{profileErrors.phone_number}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={updatingProfile}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition"
                                    >
                                        Simpan Perubahan &rarr;
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* REDEMPTION CONFIRMATION MODAL */}
            {selectedReward && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full space-y-6 shadow-2xl relative text-center">
                        <h3 className="text-2xl font-black text-slate-900">Konfirmasi Penukaran Hadiah</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Apakah Anda yakin ingin menukarkan <strong className="text-slate-900">{selectedReward.points_cost} Poin</strong> dengan hadiah:
                        </p>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-left">
                            <h4 className="font-bold text-sm text-slate-900">{selectedReward.name}</h4>
                            <p className="text-xs text-slate-500">{selectedReward.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <button
                                onClick={() => setSelectedReward(null)}
                                className="py-3 rounded-xl font-bold text-xs uppercase bg-slate-100 text-slate-700 hover:bg-slate-200"
                            >
                                Batal
                            </button>
                            <button
                                onClick={confirmRedemption}
                                disabled={redeeming}
                                className="py-3 rounded-xl font-black text-xs uppercase bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md"
                            >
                                {redeeming ? 'Memproses...' : 'Ya, Tukar Sekarang'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </PublicLayout>
    );
}
