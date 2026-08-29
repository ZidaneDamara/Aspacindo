import React from 'react';
import { useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ article = null }) {
    const isEditing = !!article;

    const { data, setData, post, put, processing } = useForm({
        title: article?.title || '',
        category: article?.category || 'Berita Yamaha',
        thumbnail: article?.thumbnail || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        author: article?.author || 'Admin Aspacindo',
        is_active: article ? article.is_active : true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/admin/articles/${article.id}`);
        } else {
            post('/admin/articles');
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit ${article.title}` : 'Tambah Artikel Baru'}>
            <div className="max-w-4xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">{isEditing ? 'Edit Artikel' : 'Form Artikel Baru'}</h2>
                    <Link href="/admin/articles" className="text-xs font-bold text-slate-500 hover:text-slate-900">&larr; Kembali</Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Judul Artikel</label>
                        <input
                            type="text"
                            required
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Kategori</label>
                            <select
                                value={data.category}
                                onChange={(e) => setData('category', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            >
                                <option value="Berita Yamaha">Berita Yamaha</option>
                                <option value="Tips & Trik">Tips &amp; Trik</option>
                                <option value="Event">Event</option>
                                <option value="Promo">Promo</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-700 uppercase">Penulis</label>
                            <input
                                type="text"
                                value={data.author}
                                onChange={(e) => setData('author', e.target.value)}
                                className="w-full text-sm border-slate-200 rounded-2xl p-3"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">URL Thumbnail Gambar</label>
                        <input
                            type="text"
                            placeholder="/assets/images/articles/news.webp"
                            value={data.thumbnail}
                            onChange={(e) => setData('thumbnail', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Ringkasan Excerpt</label>
                        <textarea
                            rows="2"
                            value={data.excerpt}
                            onChange={(e) => setData('excerpt', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                        />
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-700 uppercase">Konten Isi Artikel (HTML / Rich Text)</label>
                        <textarea
                            rows="10"
                            required
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className="w-full text-sm border-slate-200 rounded-2xl p-3 font-mono"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-2xl text-xs uppercase tracking-wider transition"
                    >
                        {isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
                    </button>
                </form>
            </div>
        </AdminLayout>
    );
}
