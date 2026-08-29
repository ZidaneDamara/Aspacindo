import React from 'react';
import { Link } from '@inertiajs/react';
import PublicLayout from '@/Layouts/PublicLayout';
import LazyImage from '@/Components/LazyImage';

export default function Show({ article, relatedArticles = [] }) {
    return (
        <PublicLayout title={article.title}>
            <div className="bg-slate-900 text-white py-12 border-b border-slate-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
                    <span className="text-xs font-bold text-red-500 uppercase tracking-widest block">{article.category}</span>
                    <h1 className="text-3xl sm:text-4xl font-black">{article.title}</h1>
                    <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span>Oleh: <strong className="text-white">{article.author || 'Admin'}</strong></span>
                        <span>•</span>
                        <span>{article.published_at ? new Date(article.published_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {article.thumbnail && (
                    <div className="rounded-3xl overflow-hidden border border-slate-100 shadow-md">
                        <LazyImage
                            src={article.thumbnail}
                            alt={article.title}
                            aspectRatio="aspect-[16/9]"
                        />
                    </div>
                )}

                {/* Article Content */}
                <div
                    className="prose prose-lg max-w-none text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.content }}
                />

                {/* Related Articles */}
                {relatedArticles.length > 0 && (
                    <div className="pt-12 border-t border-slate-200 space-y-6">
                        <h3 className="text-2xl font-black text-slate-900">Artikel Terkait</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3 shadow-sm">
                                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                                        {item.category}
                                    </span>
                                    <h4 className="text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-600 transition">
                                        <Link href={`/artikel/${item.slug}`}>{item.title}</Link>
                                    </h4>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
