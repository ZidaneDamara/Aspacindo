import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { TableKit } from '@tiptap/extension-table';

import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    List,
    ListOrdered,
    Quote,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
    Link as LinkIcon,
    Unlink,
    Minus,
    Palette,
    RemoveFormatting,
    Undo,
    Redo,
    HelpCircle,
    Maximize,
    Minimize,
    Table as TableIcon,
    Code,
    SlidersHorizontal,
    PlusCircle,
    ImagePlus,
} from 'lucide-react';

import MediaUploadModal from './MediaUploadModal';
import SpecialCharModal from './SpecialCharModal';
import ShortcutsModal from './ShortcutsModal';

const COLOR_PALETTE = [
    { label: 'Hitam', value: '#000000' },
    { label: 'Abu-Abu Gelap', value: '#334155' },
    { label: 'Abu-Abu', value: '#64748b' },
    { label: 'Biru Yamaha', value: '#0A2872' },
    { label: 'Biru Cerah', value: '#2563eb' },
    { label: 'Merah Yamaha', value: '#dc2626' },
    { label: 'Hijau Emerald', value: '#059669' },
    { label: 'Oranye', value: '#ea580c' },
    { label: 'Kuning Amber', value: '#d97706' },
    { label: 'Ungu', value: '#7c3aed' },
];

export default function WysiwygEditor({ value = '', onChange, placeholder = 'Tuliskan isi artikel Anda di sini...' }) {
    const [viewMode, setViewMode] = useState('visual'); // 'visual' | 'text'
    const [rawHtml, setRawHtml] = useState(value || '');
    const [showToolbarRow2, setShowToolbarRow2] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [isSpecialCharModalOpen, setIsSpecialCharModalOpen] = useState(false);
    const [isShortcutsModalOpen, setIsShortcutsModalOpen] = useState(false);
    const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
    const colorPickerRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                horizontalRule: {
                    HTMLAttributes: {
                        class: 'my-6 border-t-2 border-slate-200',
                    },
                },
            }),
            Underline,
            TextStyle,
            Color,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'rounded-2xl shadow-md my-4 max-w-full h-auto border border-slate-200',
                },
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: 'https',
                HTMLAttributes: {
                    class: 'text-blue-600 underline font-semibold hover:text-blue-800 transition',
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            TableKit.configure({
                table: {
                    resizable: true,
                    HTMLAttributes: {
                        class: 'w-full my-6 border-collapse border border-slate-200 rounded-xl overflow-hidden shadow-xs',
                    },
                },
                tableHeader: {
                    HTMLAttributes: {
                        class: 'bg-slate-900 text-white font-bold p-3 text-left border border-slate-700 text-xs uppercase tracking-wider',
                    },
                },
                tableCell: {
                    HTMLAttributes: {
                        class: 'p-3 border border-slate-200 text-sm text-slate-800',
                    },
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setRawHtml(html);
            if (onChange) {
                onChange(html);
            }
        },
    });

    // Synchronize if external value changes (e.g. edit initial load)
    useEffect(() => {
        if (editor && value !== undefined && value !== editor.getHTML() && viewMode === 'visual') {
            // Only update if difference is meaningful
            if (Math.abs(value.length - editor.getHTML().length) > 2) {
                editor.commands.setContent(value, false);
                setRawHtml(value);
            }
        }
    }, [value, editor]);

    // Close color picker dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target)) {
                setIsColorPickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Switch between Visual & Text mode
    const handleSwitchMode = (mode) => {
        if (mode === viewMode) return;
        if (mode === 'text') {
            if (editor) {
                setRawHtml(editor.getHTML());
            }
            setViewMode('text');
        } else {
            // Switching back to visual
            if (editor) {
                editor.commands.setContent(rawHtml, false);
            }
            setViewMode('visual');
        }
    };

    const handleRawHtmlChange = (e) => {
        const newHtml = e.target.value;
        setRawHtml(newHtml);
        if (onChange) {
            onChange(newHtml);
        }
    };

    // Insert media from modal
    const handleInsertMedia = ({ url, alt, align }) => {
        if (!editor) return;

        let alignClass = 'rounded-2xl shadow-md my-4 max-w-full h-auto border border-slate-200';
        if (align === 'center') {
            alignClass += ' block mx-auto';
        } else if (align === 'left') {
            alignClass += ' float-left mr-6 mb-4';
        } else if (align === 'right') {
            alignClass += ' float-right ml-6 mb-4';
        }

        editor.chain().focus().setImage({
            src: url,
            alt: alt || 'Gambar Artikel Aspacindo',
            title: alt || 'Gambar Artikel',
        }).run();
    };

    // Insert Link handler
    const handleSetLink = () => {
        if (!editor) return;
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Masukkan URL link (contoh: https://aspacindo.com):', previousUrl || 'https://');

        if (url === null) return;
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    // Insert Read More Tag (WordPress standard separator)
    const handleInsertReadMore = () => {
        if (!editor) return;
        editor.chain().focus().insertContent('<hr class="read-more-divider" data-wp-more="more" />').run();
    };

    // Insert Special Character
    const handleInsertSpecialChar = (char) => {
        if (!editor) return;
        editor.chain().focus().insertContent(char).run();
    };

    // Insert Yamaha Price & Service Table Template
    const handleInsertYamahaTable = () => {
        if (!editor) return;
        const tableHtml = `
<div class="overflow-x-auto my-6 border border-slate-200 rounded-2xl shadow-sm bg-white">
  <table class="w-full text-left border-collapse text-sm">
    <thead>
      <tr class="bg-black text-white font-bold uppercase text-xs">
        <th class="p-3 border-r border-slate-700">TIPE PERBAIKAN / SERVIS</th>
        <th class="p-3 border-r border-slate-700 text-center">SPESIFIKASI & GARANSI</th>
        <th class="p-3 text-center">BIAYA (RP)</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-200 font-medium text-slate-800">
      <tr>
        <td class="p-3 border-r font-semibold">Pembersihan Injector Digital</td>
        <td class="p-3 border-r text-center">Garansi Diagnostic YDT</td>
        <td class="p-3 text-center font-bold text-blue-600">Rp 35.000</td>
      </tr>
      <tr>
        <td class="p-3 border-r font-semibold">Servis Berkala Lengkap (Full)</td>
        <td class="p-3 border-r text-center">Cek 10 Titik Mesin & Transmisi</td>
        <td class="p-3 text-center font-bold text-blue-600">Rp 75.000</td>
      </tr>
      <tr>
        <td class="p-3 border-r font-semibold">Ganti Oli Yamalube Power Matic</td>
        <td class="p-3 border-r text-center">100% Original Yamalube 800ml</td>
        <td class="p-3 text-center font-bold text-blue-600">Rp 55.000</td>
      </tr>
    </tbody>
  </table>
</div>
`;
        editor.chain().focus().insertContent(tableHtml).run();
    };

    // Compute Word & Character count
    const wordCount = rawHtml ? rawHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length : 0;
    const charCount = rawHtml ? rawHtml.replace(/<[^>]+>/g, '').length : 0;

    // Detect current format for dropdown
    const getCurrentHeading = () => {
        if (!editor) return 'p';
        if (editor.isActive('heading', { level: 1 })) return 'h1';
        if (editor.isActive('heading', { level: 2 })) return 'h2';
        if (editor.isActive('heading', { level: 3 })) return 'h3';
        if (editor.isActive('heading', { level: 4 })) return 'h4';
        if (editor.isActive('heading', { level: 5 })) return 'h5';
        if (editor.isActive('heading', { level: 6 })) return 'h6';
        if (editor.isActive('codeBlock')) return 'pre';
        return 'p';
    };

    const handleFormatChange = (e) => {
        if (!editor) return;
        const val = e.target.value;
        if (val === 'p') {
            editor.chain().focus().setParagraph().run();
        } else if (val.startsWith('h')) {
            const level = parseInt(val.replace('h', ''), 10);
            editor.chain().focus().toggleHeading({ level }).run();
        } else if (val === 'pre') {
            editor.chain().focus().toggleCodeBlock().run();
        }
    };

    return (
        <div
            className={`border border-slate-300 rounded-2xl bg-white shadow-sm overflow-hidden flex flex-col transition-all ${
                isFullscreen
                    ? 'fixed inset-0 z-50 rounded-none h-screen w-screen border-none shadow-2xl'
                    : 'w-full'
            }`}
        >
            {/* 1. TOP HEADER BAR: ADD MEDIA BUTTON & VISUAL/TEXT TABS */}
            <div className="bg-[#f0f0f1] px-4 py-2 border-b border-slate-300 flex items-center justify-between gap-4">
                {/* Left: Add Media Button (WordPress Classic Style) */}
                <button
                    type="button"
                    onClick={() => setIsMediaModalOpen(true)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-lg border border-slate-300 hover:border-slate-400 shadow-2xs transition active:scale-98"
                >
                    <ImagePlus size={16} className="text-blue-600" />
                    <span>Tambahkan Media (Add Media)</span>
                </button>

                {/* Right: Visual / Text Tabs (WordPress Style) */}
                <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white shadow-2xs">
                    <button
                        type="button"
                        onClick={() => handleSwitchMode('visual')}
                        className={`px-3 py-1 text-xs font-bold transition flex items-center gap-1.5 ${
                            viewMode === 'visual'
                                ? 'bg-slate-800 text-white shadow-inner'
                                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <span>Visual</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSwitchMode('text')}
                        className={`px-3 py-1 text-xs font-bold transition flex items-center gap-1.5 border-l border-slate-300 ${
                            viewMode === 'text'
                                ? 'bg-slate-800 text-white shadow-inner'
                                : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        <Code size={13} />
                        <span>Teks (HTML)</span>
                    </button>
                </div>
            </div>

            {/* 2. CLASSIC WORDPRESS TOOLBAR (ACTIVE IN VISUAL MODE) */}
            {viewMode === 'visual' && (
                <div className="bg-[#f8fafc] border-b border-slate-300 divide-y divide-slate-200">
                    {/* TOOLBAR ROW 1 */}
                    <div className="p-2 flex items-center gap-1 flex-wrap text-slate-700">
                        {/* 1. Format Dropdown (Paragraph, H1-H6, Preformatted) */}
                        <div className="relative inline-block mr-1">
                            <select
                                value={getCurrentHeading()}
                                onChange={handleFormatChange}
                                className="h-8 py-0 pl-2.5 pr-8 text-xs font-bold text-slate-700 bg-white border border-slate-300 rounded-md shadow-2xs hover:border-slate-400 focus:ring-1 focus:ring-blue-500 cursor-pointer"
                            >
                                <option value="p">Paragraf (Paragraph)</option>
                                <option value="h1">Judul 1 (Heading 1)</option>
                                <option value="h2">Sub-Judul 2 (Heading 2)</option>
                                <option value="h3">Sub-Judul 3 (Heading 3)</option>
                                <option value="h4">Judul 4 (Heading 4)</option>
                                <option value="h5">Judul 5 (Heading 5)</option>
                                <option value="h6">Judul 6 (Heading 6)</option>
                                <option value="pre">Praformat (Preformatted)</option>
                            </select>
                        </div>

                        <div className="h-5 w-px bg-slate-300 mx-1" />

                        {/* 2. Bold (B) */}
                        <button
                            type="button"
                            title="Tebal (Ctrl+B)"
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive('bold')
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <Bold size={14} strokeWidth={2.8} />
                        </button>

                        {/* 3. Italic (I) */}
                        <button
                            type="button"
                            title="Miring (Ctrl+I)"
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive('italic')
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <Italic size={14} strokeWidth={2.4} />
                        </button>

                        {/* 4. Underline (U) */}
                        <button
                            type="button"
                            title="Garis Bawah (Ctrl+U)"
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive('underline')
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <UnderlineIcon size={14} strokeWidth={2.4} />
                        </button>

                        <div className="h-5 w-px bg-slate-300 mx-1" />

                        {/* 5. Bullet List */}
                        <button
                            type="button"
                            title="Daftar Berpoin (Bulleted List)"
                            onClick={() => editor?.chain().focus().toggleBulletList().run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive('bulletList')
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <List size={14} />
                        </button>

                        {/* 6. Numbered List */}
                        <button
                            type="button"
                            title="Daftar Bernomor (Numbered List)"
                            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive('orderedList')
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <ListOrdered size={14} />
                        </button>

                        {/* 7. Blockquote */}
                        <button
                            type="button"
                            title="Kutipan (Blockquote)"
                            onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive('blockquote')
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <Quote size={14} />
                        </button>

                        <div className="h-5 w-px bg-slate-300 mx-1" />

                        {/* 8. Align Left */}
                        <button
                            type="button"
                            title="Rata Kiri (Align Left)"
                            onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive({ textAlign: 'left' })
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <AlignLeft size={14} />
                        </button>

                        {/* 9. Align Center */}
                        <button
                            type="button"
                            title="Rata Tengah (Align Center)"
                            onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive({ textAlign: 'center' })
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <AlignCenter size={14} />
                        </button>

                        {/* 10. Align Right */}
                        <button
                            type="button"
                            title="Rata Kanan (Align Right)"
                            onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive({ textAlign: 'right' })
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <AlignRight size={14} />
                        </button>

                        {/* 10b. Align Justify */}
                        <button
                            type="button"
                            title="Rata Kiri-Kanan (Justify)"
                            onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive({ textAlign: 'justify' })
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <AlignJustify size={14} />
                        </button>

                        <div className="h-5 w-px bg-slate-300 mx-1" />

                        {/* 11. Insert Link */}
                        <button
                            type="button"
                            title="Sisipkan / Sunting Tautan (Ctrl+K)"
                            onClick={handleSetLink}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                editor?.isActive('link')
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <LinkIcon size={14} />
                        </button>

                        {/* 12. Remove Link */}
                        <button
                            type="button"
                            title="Hapus Tautan (Unlink)"
                            disabled={!editor?.isActive('link')}
                            onClick={() => editor?.chain().focus().unsetLink().run()}
                            className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            <Unlink size={14} />
                        </button>

                        {/* 13. Read More Tag */}
                        <button
                            type="button"
                            title="Sisipkan Tag Baca Selengkapnya (Read More Tag)"
                            onClick={handleInsertReadMore}
                            className="px-2 h-7 rounded flex items-center gap-1 border border-slate-300 bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-700 transition"
                        >
                            <Minus size={13} className="text-slate-400" />
                            <span>Read More</span>
                        </button>

                        {/* Insert Yamaha Table Button */}
                        <button
                            type="button"
                            title="Sisipkan Tabel Tarif & Spesifikasi Resmi Yamaha"
                            onClick={handleInsertYamahaTable}
                            className="px-2 h-7 rounded flex items-center gap-1 border border-blue-200 bg-blue-50/70 hover:bg-blue-100 text-blue-700 text-[11px] font-bold transition shadow-2xs"
                        >
                            <TableIcon size={13} />
                            <span>Tabel Tarif</span>
                        </button>

                        <div className="flex-1" />

                        {/* 14. Toolbar Toggle (Show / Hide Row 2) */}
                        <button
                            type="button"
                            title={showToolbarRow2 ? 'Sembunyikan Bilah Alat Tambahan' : 'Alihkan Bilah Alat (Toolbar Toggle)'}
                            onClick={() => setShowToolbarRow2((prev) => !prev)}
                            className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                showToolbarRow2
                                    ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-inner'
                                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                        >
                            <SlidersHorizontal size={14} />
                        </button>

                        {/* 17. Fullscreen Toggle */}
                        <button
                            type="button"
                            title={isFullscreen ? 'Keluar Mode Layar Penuh' : 'Mode Menulis Bebas Gangguan (Fullscreen)'}
                            onClick={() => setIsFullscreen((prev) => !prev)}
                            className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition"
                        >
                            {isFullscreen ? <Minimize size={14} /> : <Maximize size={14} />}
                        </button>
                    </div>

                    {/* TOOLBAR ROW 2 (COLLAPSIBLE LIKE WORDPRESS) */}
                    {showToolbarRow2 && (
                        <div className="p-2 flex items-center gap-1 flex-wrap text-slate-700 bg-slate-50/80 animate-fadeIn">
                            {/* 1. Strikethrough */}
                            <button
                                type="button"
                                title="Coretan (Strikethrough)"
                                onClick={() => editor?.chain().focus().toggleStrike().run()}
                                className={`w-7 h-7 rounded flex items-center justify-center border transition ${
                                    editor?.isActive('strike')
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-inner'
                                        : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300'
                                }`}
                            >
                                <Strikethrough size={14} />
                            </button>

                            {/* 2. Horizontal Line */}
                            <button
                                type="button"
                                title="Garis Horizontal (Divider)"
                                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
                                className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition"
                            >
                                <Minus size={14} />
                            </button>

                            {/* 3. Text Color Picker Dropdown */}
                            <div className="relative inline-block" ref={colorPickerRef}>
                                <button
                                    type="button"
                                    title="Warna Teks (Text Color)"
                                    onClick={() => setIsColorPickerOpen((prev) => !prev)}
                                    className="h-7 px-2 rounded flex items-center gap-1 border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs transition"
                                >
                                    <span className="font-extrabold text-sm text-blue-700 underline decoration-2">A</span>
                                    <span className="text-[10px] text-slate-400">▼</span>
                                </button>

                                {isColorPickerOpen && (
                                    <div className="absolute top-full left-0 mt-1 z-30 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 grid grid-cols-5 gap-1.5 w-48 animate-fadeIn">
                                        {COLOR_PALETTE.map((c) => (
                                            <button
                                                key={c.value}
                                                type="button"
                                                title={c.label}
                                                onClick={() => {
                                                    editor?.chain().focus().setColor(c.value).run();
                                                    setIsColorPickerOpen(false);
                                                }}
                                                className="w-7 h-7 rounded-lg border border-slate-200 hover:scale-110 transition shadow-2xs"
                                                style={{ backgroundColor: c.value }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 4. Clear Formatting */}
                            <button
                                type="button"
                                title="Hapus Pemformatan (Clear Formatting)"
                                onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
                                className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition"
                            >
                                <RemoveFormatting size={14} />
                            </button>

                            {/* 5. Special Character (Ω) */}
                            <button
                                type="button"
                                title="Karakter Khusus (Special Characters)"
                                onClick={() => setIsSpecialCharModalOpen(true)}
                                className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition"
                            >
                                Ω
                            </button>

                            <div className="h-5 w-px bg-slate-300 mx-1" />

                            {/* 6. Undo */}
                            <button
                                type="button"
                                title="Urungkan (Ctrl+Z)"
                                disabled={!editor?.can().undo()}
                                onClick={() => editor?.chain().focus().undo().run()}
                                className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <Undo size={14} />
                            </button>

                            {/* 7. Redo */}
                            <button
                                type="button"
                                title="Ulangi (Ctrl+Y)"
                                disabled={!editor?.can().redo()}
                                onClick={() => editor?.chain().focus().redo().run()}
                                className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                            >
                                <Redo size={14} />
                            </button>

                            <div className="h-5 w-px bg-slate-300 mx-1" />

                            {/* 8. Keyboard Shortcuts Help (?) */}
                            <button
                                type="button"
                                title="Bantuan Pintasan Keyboard (?)"
                                onClick={() => setIsShortcutsModalOpen(true)}
                                className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 transition"
                            >
                                <HelpCircle size={14} />
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* 3. EDITOR BODY: VISUAL WYSIWYG CANVAS OR TEXT (RAW HTML) */}
            <div className={`relative flex-1 bg-white overflow-y-auto ${isFullscreen ? 'p-8 max-w-4xl mx-auto w-full' : ''}`}>
                {viewMode === 'visual' ? (
                    <div className="min-h-[380px] p-6 text-slate-900 focus:outline-none">
                        <EditorContent editor={editor} className="tiptap-wordpress-editor prose max-w-none focus:outline-none" />
                    </div>
                ) : (
                    <textarea
                        rows={isFullscreen ? 30 : 16}
                        value={rawHtml}
                        onChange={handleRawHtmlChange}
                        placeholder="Ketik atau edit kode HTML artikel di sini..."
                        className="w-full h-full min-h-[380px] p-5 font-mono text-xs text-slate-800 bg-slate-900/5 border-none resize-none focus:outline-none leading-relaxed"
                    />
                )}
            </div>

            {/* 4. WORDPRESS STATUS BAR (FOOTER) */}
            <div className="bg-[#f0f0f1] px-4 py-2 border-t border-slate-300 flex items-center justify-between text-[11px] text-slate-600 font-medium">
                <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700 uppercase">Jalur Tag:</span>
                    <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800">
                        {viewMode === 'visual' ? (getCurrentHeading() || 'p') : 'html'}
                    </span>
                </div>
                <div className="flex items-center gap-4">
                    <span>
                        Jumlah Kata: <strong className="text-slate-900">{wordCount}</strong>
                    </span>
                    <span>
                        Karakter: <strong className="text-slate-900">{charCount}</strong>
                    </span>
                </div>
            </div>

            {/* MODALS */}
            <MediaUploadModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onInsert={handleInsertMedia}
            />

            <SpecialCharModal
                isOpen={isSpecialCharModalOpen}
                onClose={() => setIsSpecialCharModalOpen(false)}
                onSelect={handleInsertSpecialChar}
            />

            <ShortcutsModal
                isOpen={isShortcutsModalOpen}
                onClose={() => setIsShortcutsModalOpen(false)}
            />
        </div>
    );
}
