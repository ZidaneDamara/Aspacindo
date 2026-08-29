import React from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import Footer from '@/Components/Footer';
import FloatingWhatsApp from '@/Components/FloatingWhatsApp';

export default function PublicLayout({
    title = 'Dealer Resmi Yamaha Riau & Sumatera Utara',
    description = 'PT Aspacindo Kedaton Motor - Dealer Resmi Yamaha dengan 20+ cabang di Riau & Sumatera Utara. Jual motor baru, sparepart original, dan servis bergaransi.',
    categoryBar = null,
    children
}) {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
            <Head>
                <title>{`${title} | Aspacindo Kedaton Motor`}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`${title} | Aspacindo Kedaton Motor`} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
            </Head>

            <Navbar categoryBar={categoryBar} />

            <main className="flex-grow">
                {children}
            </main>

            <FloatingWhatsApp />

            <Footer />
        </div>
    );
}
