import React, { useState, useMemo, useRef } from 'react';
import { useForm, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Form({ article = null }) {
    const isEditing = !!article;
    const [imagePreview, setImagePreview] = useState(article?.thumbnail || '');
    const [viewMode, setViewMode] = useState('editor'); // 'editor' | 'preview'
    const [isUploadingInline, setIsUploadingInline] = useState(false);

    const textareaRef = useRef(null);
    const inlineFileRef = useRef(null);

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

    // TOOLBAR HELPER FUNCTIONS: Insert HTML snippet at cursor position
    const insertSnippet = (before, after = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = data.content;
        const selectedText = currentText.substring(start, end) || 'Teks di sini';

        const replacement = `${before}${selectedText}${after}`;
        const newContent = currentText.substring(0, start) + replacement + currentText.substring(end);

        setData('content', newContent);

        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
        }, 50);
    };

    // INLINE IMAGE UPLOAD HANDLER
    const handleInlineImageSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploadingInline(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const response = await fetch('/admin/articles/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: formData,
            });

            if (!response.ok) throw new Error('Gagal mengunggah gambar');

            const result = await response.json();
            const imgHtml = `\n<img src="${result.url}" alt="${file.name}" class="w-full my-6 rounded-2xl shadow-md border border-slate-200" />\n`;

            insertSnippet(imgHtml, '');
        } catch (err) {
            alert('Gagal mengunggah foto ke tengah teks: ' + err.message);
        } finally {
            setIsUploadingInline(false);
            if (inlineFileRef.current) inlineFileRef.current.value = '';
        }
    };

    // INSERT TABLE TEMPLATE HANDLER
    const insertTableTemplate = () => {
        const tableHtml = `\n<div className="overflow-x-auto my-6 border border-slate-200 rounded-2xl shadow-sm bg-white">
  <table className="w-full text-left border-collapse text-sm">
    <thead>
      <tr className="bg-black text-white font-bold uppercase text-xs">
        <th className="p-3 border-r border-slate-700">TIPE PERBAIKAN</th>
        <th className="p-3 border-r border-slate-700 text-center">SPESIFIKASI</th>
        <th className="p-3 text-center">BIAYA (RP)</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-slate-200 font-medium text-slate-800">
      <tr>
        <td className="p-3 border-r font-semibold">Pembersihan Injector</td>
        <td className="p-3 border-r text-center">Garansi YDT Digital</td>
        <td className="p-3 text-center font-bold">Rp 35.000</td>
      </tr>
      <tr>
        <td className="p-3 border-r font-semibold">Servis Berkala Lengkap</td>
        <td className="p-3 border-r text-center">Cek 10 Titik Mesin</td>
        <td className="p-3 text-center font-bold">Rp 75.000</td>
      </tr>
    </tbody>
  </table>
</div>\n`;
        insertSnippet(tableHtml, '');
    };

    // INSERT LINK HANDLER
    const insertLink = () => {
        const url = prompt('Masukkan URL Link (contoh: https://aspacindo.com/produk):', 'https://');
        if (url) {
            const text = prompt('Masukkan Teks Link:', 'Lihat di sini');
            if (text) {
                insertSnippet(`<a href="${url}" target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold underline">`, `${text}</a>`);
            }
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
                results.push({ type: 'bad', text: 'Keyword Fokus belum ada di Meta Description.' });
            }

            const first100Words = plainContent.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
            if (first100Words.includes(keyword)) {
                results.push({ type: 'good', text: 'Keyword Fokus ada di Paragraf Pertama artikel!' });
                score += 15;
            } else {
                results.push({ type: 'warning', text: 'Keyword Fokus sebaiknya muncul di 100 kata pertama.' });
                score += 5;
            }

            if (wordCount > 0) {
                const occurrences = (plainContent.toLowerCase().match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
                const density = ((occurrences * keyword.split(' ').length) / wordCount) * 100;
                if (density >= 0.8 && density <= 2.5) {
                    results.push({ type: 'good', text: `Kepadatan Keyword sangat ideal (${density.toFixed(1)}%, ${occurrences} kali muncul).` });
                    score += 15;
                } else if (density > 2.5) {
                    results.push({ type: 'warning', text: `Kepadatan Keyword terlalu tinggi (${density.toFixed(1)}%). Hindari keyword stuffing.` });
                    score += 5;
                } else {
                    results.push({ type: 'warning', text: `Kepadatan Keyword masih rendah (${density.toFixed(1)}%). Sisipkan keyword beberapa kali lagi.` });
                    score += 5;
                }
            }
        }

        if (title.length >= 40 && title.length <= 70) {
            results.push({ type: 'good', text: `Panjang Judul sangat pas untuk Google SERP (${title.length} karakter).` });
            score += 10;
        } else if (title.length > 0 && title.length < 40) {
            results.push({ type: 'warning', text: `Judul terlalu pendek (${title.length} karakter). Disarankan 40-70 karakter.` });
            score += 5;
        } else if (title.length > 70) {
            results.push({ type: 'warning', text: `Judul terlalu panjang (${title.length} karakter). Mungkin terpotong di Google.` });
            score += 5;
        }

        if (metaDesc.length >= 120 && metaDesc.length <= 160) {
            results.push({ type: 'good', text: `Panjang Meta Description sempurna (${metaDesc.length} karakter).` });
            score += 10;
        } else if (metaDesc.length > 0 && metaDesc.length < 120) {
            results.push({ type: 'warning', text: `Meta Description masih pendek (${metaDesc.length} karakter). Idealnya 120-160 karakter.` });
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

        if (/<h2>|<h3>|<h4>|#|<strong>/.test(content)) {
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
            <div className="max-w-5xl mx-auto space-y-8 font-sans">
                {/* Hidden File Input for Inline Images */}
                <input
                    type="file"
                    ref={inlineFileRef}
                    accept="image/*"
                    onChange={handleInlineImageSelect}
                    className="hidden"
                />

                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            {isEditing ? 'Edit &amp; Optimasi Artikel' : 'Editor Artikel Baru (Optimasi Yoast SEO)'}
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                            Gunakan toolbar H2, H3, bold, tabel, serta tombol upload foto di tengah teks untuk membuat artikel menarik.
                        </p>
                    </div>
                    <Link href="/admin/articles" className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        &larr; Kembali
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* MAIN CONTENT FORM (7 Columns) */}
                        <div className="lg:col-span-7 space-y-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Judul Utama Artikel</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: Berapa Biaya Service Injeksi Di Dealer Resmi, Mahal Gak Sih?"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="w-full text-sm font-bold border-slate-200 rounded-2xl p-3"
                                    />
                                    {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-slate-700 uppercase">Kategori Artikel</label>
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
                                        <label className="text-xs font-bold text-slate-700 uppercase">Penulis / Author</label>
                                        <input
                                            type="text"
                                            value={data.author}
                                            onChange={(e) => setData('author', e.target.value)}
                                            className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                        />
                                    </div>
                                </div>

                                {/* Upload Header Thumbnail */}
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                                    <label className="text-xs font-extrabold text-slate-800 uppercase block">
                                        📸 Upload Foto Header Utama Artikel
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
                                    />
                                    {imagePreview && (
                                        <div className="pt-2 flex items-center gap-3">
                                            <img src={imagePreview} alt="Preview Header" className="w-20 h-16 object-cover rounded-xl border shadow-sm" />
                                            <span className="text-[11px] text-slate-500">Preview foto header artikel</span>
                                        </div>
                                    )}
                                </div>

                                {/* Excerpt */}
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-700 uppercase">Ringkasan Singkat (Excerpt)</label>
                                    <textarea
                                        rows="2"
                                        placeholder="Ringkasan singkat yang tampil di kartu artikel..."
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        className="w-full text-sm border-slate-200 rounded-2xl p-3"
                                    />
                                </div>

                                {/* FULL ARTICLE CONTENT EDITOR WITH RICH TOOLBAR */}
                                <div className="space-y-2 pt-2 border-t border-slate-100">
                                    <div className="flex justify-between items-center">
                                        <label className="text-xs font-extrabold text-slate-900 uppercase">
                                            📝 Editor Konten Artikel (Lengkap Tools H2, H3 &amp; Insert Foto)
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-blue-600 mr-2">{seoAnalysis.wordCount} Kata</span>
                                            <button
                                                type="button"
                                                onClick={() => setViewMode('editor')}
                                                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                                                    viewMode === 'editor' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                Mode Editor
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setViewMode('preview')}
                                                className={`px-3 py-1 text-[11px] font-bold rounded-lg transition ${
                                                    viewMode === 'preview' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                👁️ Visual Preview
                                            </button>
                                        </div>
                                    </div>

                                    {/* TOOLBAR BUTTONS BAR */}
                                    <div className="bg-slate-900 text-white p-2.5 rounded-2xl flex items-center gap-1.5 flex-wrap shadow-md">
                                        {/* H2 */}
                                        <button
                                            type="button"
                                            onClick={() => insertSnippet('<h2>', '</h2>')}
                                            title="Sub-Heading Utama H2"
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-black transition border border-slate-700"
                                        >
                                            H2 Sub-Judul
                                        </button>

                                        {/* H3 */}
                                        <button
                                            type="button"
                                            onClick={() => insertSnippet('<h3>', '</h3>')}
                                            title="Sub-Heading Kecil H3"
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-black transition border border-slate-700"
                                        >
                                            H3 Sub-Judul
                                        </button>

                                        <span className="text-slate-700 font-bold">|</span>

                                        {/* Bold */}
                                        <button
                                            type="button"
                                            onClick={() => insertSnippet('<strong>', '</strong>')}
                                            title="Teks Tebal (Bold)"
                                            className="w-7 h-7 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-extrabold flex items-center justify-center transition border border-slate-700"
                                        >
                                            B
                                        </button>

                                        {/* Italic */}
                                        <button
                                            type="button"
                                            onClick={() => insertSnippet('<em>', '</em>')}
                                            title="Teks Miring (Italic)"
                                            className="w-7 h-7 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-extrabold italic flex items-center justify-center transition border border-slate-700"
                                        >
                                            I
                                        </button>

                                        {/* Underline */}
                                        <button
                                            type="button"
                                            onClick={() => insertSnippet('<u>', '</u>')}
                                            title="Garis Bawah (Underline)"
                                            className="w-7 h-7 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-extrabold underline flex items-center justify-center transition border border-slate-700"
                                        >
                                            U
                                        </button>

                                        <span className="text-slate-700 font-bold">|</span>

                                        {/* Bullet List */}
                                        <button
                                            type="button"
                                            onClick={() => insertSnippet('\n<ul>\n  <li>Poin 1</li>\n  <li>Poin 2</li>\n</ul>\n')}
                                            title="Daftar Poin (Bullet List)"
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-bold transition border border-slate-700 flex items-center gap-1"
                                        >
                                            • List Poin
                                        </button>

                                        {/* Numbered List */}
                                        <button
                                            type="button"
                                            onClick={() => insertSnippet('\n<ol>\n  <li>Langkah 1</li>\n  <li>Langkah 2</li>\n</ol>\n')}
                                            title="Daftar Angka (Numbered List)"
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-bold transition border border-slate-700 flex items-center gap-1"
                                        >
                                            1. List Angka
                                        </button>

                                        <span className="text-slate-700 font-bold">|</span>

                                        {/* Link */}
                                        <button
                                            type="button"
                                            onClick={insertLink}
                                            title="Sisipkan Link URL"
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-bold transition border border-slate-700 flex items-center gap-1"
                                        >
                                            🔗 Link
                                        </button>

                                        {/* Table */}
                                        <button
                                            type="button"
                                            onClick={insertTableTemplate}
                                            title="Sisipkan Tabel Tarif/Spesifikasi"
                                            className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 rounded-lg text-xs font-bold transition border border-slate-700 flex items-center gap-1"
                                        >
                                            📊 Tabel Tarif
                                        </button>

                                        <span className="text-slate-700 font-bold">|</span>

                                        {/* INLINE IMAGE UPLOAD BUTTON */}
                                        <button
                                            type="button"
                                            onClick={() => inlineFileRef.current?.click()}
                                            disabled={isUploadingInline}
                                            title="Upload Foto & Sisipkan Di Tengah Teks"
                                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-extrabold transition shadow-sm flex items-center gap-1 disabled:opacity-50"
                                        >
                                            {isUploadingInline ? 'Mengunggah...' : '📸 Upload Foto Di Tengah Teks'}
                                        </button>
                                    </div>

                                    {/* EDITOR TEXTAREA OR VISUAL PREVIEW TAB */}
                                    {viewMode === 'editor' ? (
                                        <textarea
                                            ref={textareaRef}
                                            rows="16"
                                            required
                                            placeholder="Tuliskan isi artikel Anda di sini... Gunakan tombol toolbar di atas untuk menyisipkan H2, H3, tabel, link, atau foto di tengah teks."
                                            value={data.content}
                                            onChange={(e) => setData('content', e.target.value)}
                                            className="w-full text-sm border-slate-200 rounded-2xl p-4 font-mono leading-relaxed focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    ) : (
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[360px]">
                                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 pb-2 border-b border-slate-200">
                                                Pratinjau Tampilan Visual Konten Publik:
                                            </div>
                                            {data.content ? (
                                                <div
                                                    className="prose max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-h2:text-2xl prose-h3:text-xl prose-p:mb-3 prose-ul:list-disc prose-ul:ml-6 prose-ol:list-decimal prose-ol:ml-6 prose-a:text-blue-600 prose-a:underline"
                                                    dangerouslySetInnerHTML={{ __html: data.content }}
                                                />
                                            ) : (
                                                <p className="text-xs text-slate-400 italic">Belum ada isi konten artikel untuk dipratinjau.</p>
                                            )}
                                        </div>
                                    )}

                                    {errors.content && <p className="text-xs text-red-500">{errors.content}</p>}
                                </div>
                            </div>
                        </div>

                        {/* YOAST SEO ANALYZER SIDEBAR (5 Columns) */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* SEO SCORE METER WIDGET */}
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                                        <span>🔍</span> Yoast SEO Analysis Engine
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
                                        className="w-full text-xs border-slate-200 rounded-xl p-2.5"
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
                                    {processing ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan Artikel' : 'Publikasikan Artikel Dengan Yoast SEO')}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
