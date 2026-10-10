import React from 'react';
import { Link, Head } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';

export default function Show({ article, recentArticles = [], relatedArticles = [] }) {
    const formattedDate = article.published_at
        ? new Date(article.published_at).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
          })
        : 'Baru Saja';

    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareTitle = encodeURIComponent(article.title);

    return (
        <PublicLayout
            title={article.title}
            description={article.meta_description || article.excerpt || article.title}
        >
            <Head>
                {article.focus_keyword && <meta name="keywords" content={article.focus_keyword} />}
            </Head>

            <div className="bg-slate-50 font-['Inter',sans-serif] min-h-screen text-slate-800 pb-16">
                {/* 1. TOP HERO BANNER HEADER */}
                <div
                    style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                    className="relative text-white py-14 sm:py-20 border-b border-blue-900 overflow-hidden"
                >
                    {/* Background Engine Overlay Graphic */}
                    <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none"></div>
                    <div
                        className="absolute inset-0 opacity-10 bg-cover bg-center z-0 pointer-events-none"
                        style={{ backgroundImage: `url(${article.thumbnail || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80'})` }}
                    ></div>

                    <div className="relative z-10 max-w-5xl mx-auto px-4 text-center space-y-4">
                        <div className="flex justify-center items-center text-amber-400 text-sm font-bold">
                            <span>♦</span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase text-white drop-shadow-md">
                            {article.title}
                        </h1>
                        <nav className="flex justify-center items-center gap-2 text-xs font-semibold text-blue-200 pt-2">
                            <Link href="/" className="hover:text-white transition flex items-center gap-1">
                                <span>🏠</span> Home
                            </Link>
                            <span>&rsaquo;</span>
                            <Link href="/artikel" className="hover:text-white transition">
                                Blog &amp; Events
                            </Link>
                        </nav>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
                    {/* 2. METADATA & SOCIAL SHARE BAR */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm text-xs font-medium">
                        {/* Author & Date Metadata */}
                        <div className="flex flex-wrap items-center gap-4 text-slate-600">
                            <span className="flex items-center gap-1.5 font-bold text-slate-900">
                                <span>👤</span> {article.author || 'Admin Aspacindo'}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <span>📅</span> {formattedDate}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1.5">
                                <span>👁️</span> {article.views_count || 3510} views
                            </span>
                        </div>

                        {/* Social Share Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-800 text-[11px] uppercase mr-1">Bagikan Post Ini:</span>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#1877F2] text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase hover:brightness-110 transition flex items-center gap-1"
                            >
                                Facebook
                            </a>
                            <a
                                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${shareTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#1DA1F2] text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase hover:brightness-110 transition flex items-center gap-1"
                            >
                                Twitter
                            </a>
                            <a
                                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${shareTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#0A66C2] text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase hover:brightness-110 transition flex items-center gap-1"
                            >
                                LinkedIn
                            </a>
                            <a
                                href={`https://api.whatsapp.com/send?text=${shareTitle}%20${encodeURIComponent(shareUrl)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#25D366] text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase hover:brightness-110 transition flex items-center gap-1"
                            >
                                WhatsApp
                            </a>
                            <a
                                href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${shareTitle}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-[#BD081C] text-white px-3 py-1.5 rounded text-[11px] font-bold uppercase hover:brightness-110 transition flex items-center gap-1"
                            >
                                Pinterest
                            </a>
                        </div>
                    </div>

                    {/* 3. MAIN CONTENT GRID (8 Cols Content + 4 Cols Sidebar) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* LEFT ARTICLE CONTENT AREA (8 Cols) */}
                        <div className="lg:col-span-8 space-y-8">
                            {/* Featured Header Image */}
                            {article.thumbnail && (
                                <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                                    <img
                                        src={article.thumbnail}
                                        alt={article.title}
                                        className="w-full h-auto max-h-[480px] object-cover"
                                    />
                                </div>
                            )}

                            {/* ARTICLE RICH CONTENT HTML RENDER */}
                            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed font-normal">
                                {article.content ? (
                                    <div
                                        className="prose max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-6 prose-h2:mb-3 prose-h3:text-xl prose-p:mb-4 prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6 prose-li:mb-2 prose-a:text-blue-600 prose-a:underline prose-table:w-full prose-table:border-collapse prose-th:bg-black prose-th:text-white prose-th:p-3 prose-td:p-3 prose-td:border prose-td:border-slate-200"
                                        dangerouslySetInnerHTML={{ __html: article.content }}
                                    />
                                ) : (
                                    <p>{article.excerpt}</p>
                                )}
                            </div>
                        </div>

                        {/* RIGHT SIDEBAR WIDGETS (4 Cols) */}
                        <div className="lg:col-span-4 space-y-8">
                            {/* PROMO BANNER WIDGET */}
                            <div
                                style={{ background: 'linear-gradient(135deg, #071C52 0%, #0A2872 65%, #0A54AA 100%)' }}
                                className="p-6 rounded-3xl text-white text-center space-y-4 shadow-lg border border-blue-900 relative overflow-hidden group"
                            >
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-black/30 px-3 py-1 rounded-full inline-block">
                                        SPECIAL PROMO YAMAHA
                                    </span>
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white leading-tight">
                                        NEW NMAX TURBO &amp; NEO
                                    </h3>
                                    <p className="text-xs text-blue-100 font-medium">Cek Info Spesifikasi &amp; Promo OTR Pekanbaru Terbaru!</p>
                                </div>
                                <div className="pt-2">
                                    <Link
                                        href="/produk"
                                        className="inline-block bg-white text-[#0A2872] hover:bg-slate-100 font-extrabold px-6 py-2.5 rounded-full text-xs uppercase tracking-wider transition shadow-md"
                                    >
                                        Click Here
                                    </Link>
                                </div>
                            </div>

                            {/* RECENT ARTICLES WIDGET ("Berita Lainnya") */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <h3 className="text-base font-black text-slate-900 uppercase tracking-tight border-b border-slate-100 pb-3">
                                    Berita Lainnya
                                </h3>

                                <div className="space-y-4">
                                    {recentArticles.length > 0 ? (
                                        recentArticles.map((item) => (
                                            <div key={item.id} className="flex gap-3.5 items-center group">
                                                <Link href={`/artikel/${item.slug}`} className="flex-shrink-0 w-20 h-16 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                                                    <img
                                                        src={item.thumbnail || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=200&q=80'}
                                                        alt={item.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                    />
                                                </Link>
                                                <div className="space-y-1 overflow-hidden">
                                                    <Link
                                                        href={`/artikel/${item.slug}`}
                                                        className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <p className="text-[10px] text-slate-400 font-medium">
                                                        {item.published_at ? new Date(item.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Terbaru'}
                                                    </p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-xs text-slate-400">Belum ada berita lainnya.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 4. BOTTOM RECOMMENDED ARTICLES 4-COLUMN GRID */}
                    <div className="pt-8 space-y-6 border-t border-slate-200">
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                            Berita Lainnya
                        </h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedArticles.length > 0 ? (
                                relatedArticles.map((rel) => (
                                    <div
                                        key={rel.id}
                                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group"
                                    >
                                        <div className="space-y-3">
                                            <Link href={`/artikel/${rel.slug}`} className="block h-44 overflow-hidden bg-slate-100 relative">
                                                <img
                                                    src={rel.thumbnail || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'}
                                                    alt={rel.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                                />
                                                <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                                                    {rel.category}
                                                </span>
                                            </Link>

                                            <div className="p-4 space-y-2">
                                                <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                                                    <Link href={`/artikel/${rel.slug}`}>{rel.title}</Link>
                                                </h3>
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {rel.excerpt || 'Baca selengkapnya mengenai informasi servis dan tips sepeda motor Yamaha terbaru.'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="px-4 pb-4 pt-2 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-semibold">
                                            <span>👤 {rel.author || 'Admin'}</span>
                                            <span>{rel.published_at ? new Date(rel.published_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : ''}</span>
                                        </div>
                                    </div>
                                ))
                            ) : null}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
