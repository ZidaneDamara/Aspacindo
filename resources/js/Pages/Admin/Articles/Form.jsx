import React, { useState, useMemo } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import WysiwygEditor from '@/Components/WysiwygEditor/WysiwygEditor';

export default function Form({ article = null }) {
    const isEditing = !!article;
    const [imagePreview, setImagePreview] = useState(article?.thumbnail || '');

    const { data, setData, processing, errors } = useForm({
        title: article?.title || '',
        category: article?.category || 'Berita Yamaha',
        thumbnail_file: null,
        thumbnail: article?.thumbnail || '',
        excerpt: article?.excerpt || '',
        content: article?.content || '',
        author: article?.author || 'Admin Aspacindo',
        focus_keyword: article?.focus_keyword || '',
        meta_description: article?.meta_description || '',
        is_active: article ? (article.is_active ?? true) : true,
    });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('thumbnail_file', file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // YOAST SEO ANALYSIS ENGINE
    const seoAnalysis = useMemo(() => {
        const keyword = (data.focus_keyword || '').trim().toLowerCase();
        const title = (data.title || '').trim();
        const metaDesc = (data.meta_description || '').trim();
        const content = (data.content || '').trim();
        const plainContent = content.replace(/<[^>]+>/g, ' ');

        const wordCount = plainContent ? plainContent.split(/\s+/).filter(Boolean).length : 0;
        const results = [];
        let score = 0;

        if (!keyword) {
            results.push({ type: 'warning', text: 'Keyword Fokus belum diisi. Masukkan keyword utama untuk memulai analisis Yoast SEO.' });
        } else {
            if (title.toLowerCase().includes(keyword)) {
                results.push({ type: 'good', text: 'Keyword Fokus ditemukan pada Judul Artikel!' });
                score += 15;
            } else {
                results.push({ type: 'bad', text: 'Keyword Fokus tidak ditemukan pada Judul Artikel.' });
            }

            if (metaDesc.toLowerCase().includes(keyword)) {
                results.push({ type: 'good', text: 'Keyword Fokus ditemukan pada Meta Description!' });
                score += 15;
            } else {
                results.push({ type: 'bad', text: 'Keyword Fokus tidak ditemukan pada Meta Description.' });
            }

            if (plainContent.toLowerCase().includes(keyword)) {
                const matches = (plainContent.toLowerCase().match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
                results.push({ type: 'good', text: `Keyword Fokus muncul ${matches}x di dalam konten artikel.` });
                score += 15;
            } else {
                results.push({ type: 'bad', text: 'Keyword Fokus tidak ditemukan di dalam teks isi artikel.' });
            }

            if (/<h2>.*?<\/h2>|<h3>.*?<\/h3>/i.test(content)) {
                const headingMatches = content.match(/<h[23][^>]*>(.*?)<\/h[23]>/gi) || [];
                const keywordInHeading = headingMatches.some((h) => h.toLowerCase().includes(keyword));
                if (keywordInHeading) {
                    results.push({ type: 'good', text: 'Keyword Fokus ditemukan dalam Sub-Heading (H2/H3).' });
                    score += 10;
                } else {
                    results.push({ type: 'warning', text: 'Sebaiknya sisipkan Keyword Fokus ke dalam salah satu Sub-Heading (H2/H3).' });
                    score += 5;
                }
            }
        }

        if (title.length >= 40 && title.length <= 70) {
            results.push({ type: 'good', text: `Panjang Judul sangat ideal (${title.length} karakter).` });
            score += 10;
        } else if (title.length > 70) {
            results.push({ type: 'warning', text: `Judul terlalu panjang (${title.length} karakter). Bisa terpotong di Google.` });
            score += 5;
        } else if (title.length > 0) {
            results.push({ type: 'bad', text: `Judul terlalu pendek (${title.length} karakter). Minimal 40 karakter disarankan.` });
            score += 3;
        }

        if (metaDesc.length >= 120 && metaDesc.length <= 160) {
            results.push({ type: 'good', text: `Panjang Meta Description optimal (${metaDesc.length} karakter).` });
            score += 15;
        } else if (metaDesc.length > 0 && metaDesc.length < 120) {
            results.push({ type: 'warning', text: `Meta Description terlalu pendek (${metaDesc.length} karakter). Disarankan 120-160 karakter.` });
            score += 5;
        } else if (metaDesc.length > 160) {
            results.push({ type: 'warning', text: `Meta Description terlalu panjang (${metaDesc.length} karakter). Terpotong pada hasil pencarian.` });
            score += 5;
        }

        if (wordCount >= 600) {
            results.push({ type: 'good', text: `Panjang artikel sangat bagus (${wordCount} kata).` });
            score += 10;
        } else if (wordCount >= 300) {
            results.push({ type: 'good', text: `Panjang artikel sudah memenuhi standar (${wordCount} kata).` });
            score += 8;
        } else {
            results.push({ type: 'bad', text: `Jumlah kata terlalu sedikit (${wordCount} kata). Minimal disarankan 300 kata.` });
        }

        if (/<h2>|<h3>|<h4>|<strong>|<b>/.test(content)) {
            results.push({ type: 'good', text: 'Artikel menggunakan Sub-Heading (H2/H3/Teks Bold) untuk struktur bacaan.' });
            score += 10;
        } else {
            results.push({ type: 'warning', text: 'Tambahkan Sub-Heading (H2/H3) agar artikel mudah dibaca.' });
            score += 3;
        }

        const finalScore = Math.min(100, Math.max(0, score));

        let scoreColor = 'bg-red-500 text-white';
        let statusLabel = 'Perlu Perbaikan (Red)';
        if (finalScore >= 80) {
            scoreColor = 'bg-emerald-500 text-white';
            statusLabel = 'Sangat Bagus (Green SEO)';
        } else if (finalScore >= 50) {
            scoreColor = 'bg-amber-500 text-white';
            statusLabel = 'Cukup Baik (Orange)';
        }

        return { score: finalScore, scoreColor, statusLabel, results, wordCount };
    }, [data.focus_keyword, data.title, data.meta_description, data.content]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('category', data.category);
        formData.append('excerpt', data.excerpt || '');
        formData.append('content', data.content);
        formData.append('author', data.author || 'Admin Aspacindo');
        formData.append('focus_keyword', data.focus_keyword || '');
        formData.append('meta_description', data.meta_description || '');
        formData.append('is_active', data.is_active ? '1' : '0');

        if (data.thumbnail_file) {
            formData.append('thumbnail_file', data.thumbnail_file);
        }
        if (data.thumbnail) {
            formData.append('thumbnail', data.thumbnail);
        }

        if (isEditing) {
            formData.append('_method', 'PUT');
            router.post(`/admin/articles/${article.id}`, formData, {
                forceFormData: true,
            });
        } else {
            router.post('/admin/articles', formData, {
                forceFormData: true,
            });
        }
    };

    return (
        <AdminLayout title={isEditing ? `Edit Artikel: ${article.title}` : 'Buat Artikel Baru dengan Yoast SEO'}>
            <div className="max-w-7xl mx-auto space-y-8 font-sans">
                {/* Header Title Bar */}
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            {isEditing ? 'Edit & Optimasi Artikel' : 'Editor Artikel Baru (WordPress Classic WYSIWYG)'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Gunakan editor WYSIWYG untuk membuat tulisan langsung tebal, miring, sub-heading, tabel tarif, dan sisipkan media dengan mudah.
                        </p>
                    </div>
                    <Link href="/admin/articles" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        &larr; Kembali ke Daftar Artikel
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* MAIN CONTENT FORM (8 Columns) */}
                        <div className="lg:col-span-8 space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
                                {/* Title */}
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Judul Utama Artikel</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Berapa Biaya Service Injeksi Di Dealer Resmi Yamaha, Mahal Gak Sih?"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full text-base font-bold border-slate-200 rounded-2xl p-3.5 focus:ring-blue-500"
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                </div>

                                {/* Category & Author */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase">Kategori Artikel</label>
                                        <select
                                            value={data.category}
                                            onChange={(e) => setData('category', e.target.value)}
                                            className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500 cursor-pointer"
                                        >
                                            <option value="Berita Yamaha">Berita Yamaha</option>
                                            <option value="Tips & Trik">Tips &amp; Trik</option>
                                            <option value="Event">Event</option>
                                            <option value="Promo">Promo</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase">Penulis / Author</label>
                                        <input
                                            type="text"
                                            value={data.author}
                                            onChange={(e) => setData('author', e.target.value)}
                                            className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                {/* Header Featured Image */}
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                                    <label className="text-xs font-extrabold text-slate-800 uppercase block">
                                        📸 Foto Header Utama (Thumbnail Artikel)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                    />
                                    {imagePreview && (
                                        <div className="pt-2 flex items-center gap-3">
                                            <img src={imagePreview} alt="Preview Header" className="w-24 h-16 object-cover rounded-xl border shadow-xs" />
                                            <span className="text-[11px] text-slate-500">Preview foto cover artikel</span>
                                        </div>
                                    )}
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Ringkasan Singkat (Excerpt)</label>
                                    <textarea
                                        rows="2"
                                        placeholder="Ringkasan singkat yang tampil di beranda & kartu artikel..."
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3 focus:ring-blue-500"
                                    />
                                </div>

                                {/* WYSIWYG CONTENT EDITOR (WordPress Style) */}
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-xs font-extrabold text-slate-900 uppercase">
                                            📝 Editor Konten Artikel (WordPress Classic WYSIWYG)
                                        </label>
                                        <span className="text-xs font-bold text-blue-600">
                                            {seoAnalysis.wordCount} Kata
                                        </span>
                                    </div>

                                    <WysiwygEditor
                                        value={data.content}
                                        onChange={(html) => setData('content', html)}
                                        placeholder="Tulis artikel menarik di sini... Klik tombol tebal (B) untuk langsung membuat tulisan tebal tanpa tag HTML!"
                                    />

                                    {errors.content && <p className="text-xs text-red-500 font-semibold mt-1">{errors.content}</p>}
                                </div>
                            </div>
                        </div>

                        {/* YOAST SEO ANALYZER SIDEBAR (4 Columns) */}
                        <div className="lg:col-span-4 space-y-6">
                            {/* SEO SCORE METER WIDGET */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <span>🔍</span> Yoast SEO Analysis
                                    </h3>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${seoAnalysis.scoreColor}`}>
                                        {seoAnalysis.score} / 100%
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-700 uppercase block">Kata Kunci Utama (Focus Keyword)</label>
                                    <input
                                        type="text"
                                        placeholder="Contoh: biaya service injeksi"
                                        value={data.focus_keyword}
                                        onChange={(e) => setData('focus_keyword', e.target.value)}
                                        className="w-full text-sm font-semibold border-slate-200 rounded-xl p-2.5 focus:ring-blue-500"
                                    />
                                    <p className="text-[11px] text-slate-500">Kata kunci utama yang paling sering dicari di Google.</p>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between text-xs">
                                        <label className="font-bold text-slate-700 uppercase">Meta Description (Snippet SERP)</label>
                                        <span className={data.meta_description.length >= 120 && data.meta_description.length <= 160 ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                                            {data.meta_description.length} / 160
                                        </span>
                                    </div>
                                    <textarea
                                        rows="3"
                                        placeholder="Deskripsi singkat menarik yang tampil di pencarian Google..."
                                        value={data.meta_description}
                                        onChange={(e) => setData('meta_description', e.target.value)}
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5 focus:ring-blue-500"
                                    />
                                </div>

                                {/* GOOGLE SERP LIVE PREVIEW BOX */}
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Google SERP Live Preview</span>
                                    <h4 className="text-sm font-bold text-blue-700 hover:underline cursor-pointer truncate">
                                        {data.title || 'Judul Artikel Anda Akan Tampil Di Sini'}
                                    </h4>
                                    <p className="text-[11px] text-emerald-700 font-medium truncate">
                                        https://aspacindo.com/artikel/{data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'slug-artikel'}
                                    </p>
                                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                                        {data.meta_description || 'Tuliskan meta description di atas untuk melihat pratinjau cuplikan hasil pencarian Google.'}
                                    </p>
                                </div>

                                {/* YOAST CHECKLIST RESULTS */}
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Hasil Analisis &amp; Rekomendasi:</h4>
                                    <ul className="space-y-2 text-xs">
                                        {seoAnalysis.results.map((res, idx) => (
                                            <li key={idx} className="flex items-start gap-2 leading-tight">
                                                {res.type === 'good' && <span className="text-emerald-500 font-bold">🟢</span>}
                                                {res.type === 'warning' && <span className="text-amber-500 font-bold">🟡</span>}
                                                {res.type === 'bad' && <span className="text-red-500 font-bold">🔴</span>}
                                                <span className={res.type === 'good' ? 'text-slate-800 font-medium' : 'text-slate-600'}>
                                                    {res.text}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* PUBLISH ACTION BOX */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={(e) => setData('is_active', e.target.checked)}
                                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                    />
                                    Publikasikan Artikel Ini (Tampil Publik)
                                </label>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-wider transition shadow-md hover:shadow-lg disabled:opacity-50"
                                >
                                    {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan Artikel' : 'Publikasikan Artikel')}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
