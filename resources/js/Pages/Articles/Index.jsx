import React from 'react';
import { Link, router } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import LazyImage from '@/Components/LazyImage';
import Pagination from '@/Components/Pagination';

export default function Index({ articles, categories = [], selectedCategory = 'Semua' }) {
    const handleCategoryClick = (cat) => {
        router.get('/artikel', { category: cat !== 'Semua' ? cat : undefined }, { preserveState: true, preserveScroll: true, replace: true });
    };

    return (
        <PublicLayout title="Blog, Berita & Tips Sepeda Motor Yamaha">
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">Artikel &amp; Edukasi</span>
                    <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">Berita, Tips &amp; Event Yamaha</h1>
                    <p className="text-slate-400 text-sm mt-2 max-w-xl">
                        Dapatkan ulasan mendalam mengenai fitur sepeda motor Yamaha, panduan perawatan rutin, serta promo terbaru di Aspacindo Kedaton Motor.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategoryClick(cat)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition ${
                                selectedCategory === cat
                                    ? 'bg-blue-600 text-white shadow-md'
                                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Article Grid */}
                {articles.data.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.data.map((article) => (
                            <div key={article.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="relative">
                                        <LazyImage
                                            src={article.thumbnail || '/assets/images/placeholder_article.webp'}
                                            alt={article.title}
                                            aspectRatio="aspect-[16/9]"
                                        />
                                        <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase">
                                            {article.category}
                                        </span>
                                    </div>
                                    <div className="p-6 space-y-3">
                                        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition">
                                            <Link href={`/artikel/${article.slug}`}>{article.title}</Link>
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                </div>
                                <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                                    <span>{article.author || 'Admin'}</span>
                                    <Link href={`/artikel/${article.slug}`} className="font-bold text-blue-600 hover:underline">
                                        Baca Selengkapnya &rarr;
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-3xl border border-slate-100 text-center text-slate-500">
                        Belum ada artikel dalam kategori ini.
                    </div>
                )}

                <Pagination links={articles.links} />
            </div>
        </PublicLayout>
    );
}
