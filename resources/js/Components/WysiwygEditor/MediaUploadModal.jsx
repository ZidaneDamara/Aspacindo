import React, { useState, useEffect, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Check, X, Loader2 } from 'lucide-react';

export default function MediaUploadModal({ isOpen, onClose, onInsert }) {
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'library'
    const [mediaList, setMediaList] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [altText, setAltText] = useState('');
    const [align, setAlign] = useState('center'); // 'none' | 'left' | 'center' | 'right'
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState('');
    const [isDragging, setIsDragging] = useState(false);
    const [isLoadingLibrary, setIsLoadingLibrary] = useState(false);

    const fileInputRef = useRef(null);

    const fetchMediaLibrary = async () => {
        setIsLoadingLibrary(true);
        try {
            const res = await fetch('/admin/articles/media-library');
            if (res.ok) {
                const data = await res.json();
                setMediaList(data);
                if (data.length > 0 && !selectedImage) {
                    setSelectedImage(data[0]);
                }
            }
        } catch (err) {
            console.error('Failed to load media library:', err);
        } finally {
            setIsLoadingLibrary(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchMediaLibrary();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleUpload = async (file) => {
        if (!file) return;
        setIsUploading(true);
        setUploadError('');

        const formData = new FormData();
        formData.append('image', file);

        try {
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
            const res = await fetch('/admin/articles/upload-image', {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                },
                body: formData,
            });

            if (!res.ok) {
                throw new Error('Gagal mengunggah foto. Pastikan format JPG, PNG, atau WEBP (Maks 5MB).');
            }

            const data = await res.json();
            const newMedia = {
                url: data.url,
                name: file.name,
                size: file.size,
                mtime: Math.floor(Date.now() / 1000),
            };

            setMediaList((prev) => [newMedia, ...prev]);
            setSelectedImage(newMedia);
            setAltText(file.name.replace(/\.[^/.]+$/, ''));
            setActiveTab('library');
        } catch (err) {
            setUploadError(err.message);
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleUpload(file);
    };

    const handleInsert = () => {
        if (!selectedImage) return;
        onInsert({
            url: selectedImage.url,
            alt: altText || selectedImage.name,
            align: align,
        });
        onClose();
    };

    const formatBytes = (bytes) => {
        if (!bytes) return '';
        const kb = bytes / 1024;
        if (kb < 1024) return `${Math.round(kb)} KB`;
        return `${(kb / 1024).toFixed(1)} MB`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 sm:p-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[90vh] max-h-[700px] flex flex-col overflow-hidden border border-slate-200">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm">
                            <ImageIcon size={18} />
                        </div>
                        <div>
                            <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                                Sisipkan Media (Insert Media)
                            </h3>
                            <p className="text-xs text-slate-500">
                                Unggah foto baru atau pilih dari pustaka media untuk disisipkan ke artikel
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs Header */}
                <div className="flex border-b border-slate-200 bg-white px-6">
                    <button
                        type="button"
                        onClick={() => setActiveTab('upload')}
                        className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                            activeTab === 'upload'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <UploadCloud size={16} />
                        Unggah Berkas (Upload Files)
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('library');
                            fetchMediaLibrary();
                        }}
                        className={`py-3 px-4 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
                            activeTab === 'library'
                                ? 'border-blue-600 text-blue-600'
                                : 'border-transparent text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        <ImageIcon size={16} />
                        Pustaka Media ({mediaList.length})
                    </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-hidden bg-slate-50/50">
                    {activeTab === 'upload' ? (
                        <div className="h-full flex flex-col items-center justify-center p-8">
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`w-full max-w-xl h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 text-center transition-all ${
                                    isDragging
                                        ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                                        : 'border-slate-300 bg-white hover:border-slate-400'
                                }`}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />

                                {isUploading ? (
                                    <div className="flex flex-col items-center space-y-3">
                                        <Loader2 size={40} className="animate-spin text-blue-600" />
                                        <p className="text-sm font-bold text-slate-700">Sedang mengunggah media...</p>
                                        <span className="text-xs text-slate-400">Harap tunggu sebentar</span>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                                            <UploadCloud size={32} />
                                        </div>
                                        <h4 className="text-base font-bold text-slate-800 mb-1">
                                            Tarik file ke sini untuk mengunggah
                                        </h4>
                                        <p className="text-xs text-slate-500 mb-6">
                                            atau klik tombol di bawah untuk memilih file dari komputer Anda
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition"
                                        >
                                            Pilih Berkas (Select Files)
                                        </button>
                                        <p className="text-[11px] text-slate-400 mt-6">
                                            Ukuran maksimal unggah berkas: 5 MB (JPG, PNG, WEBP, GIF)
                                        </p>
                                    </>
                                )}

                                {uploadError && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl font-medium">
                                        {uploadError}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col md:flex-row overflow-hidden">
                            {/* Media Grid */}
                            <div className="flex-1 overflow-y-auto p-4 sm:p-6 border-r border-slate-200">
                                {isLoadingLibrary ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <Loader2 size={28} className="animate-spin text-blue-600" />
                                        <span className="text-xs font-semibold">Memuat pustaka media...</span>
                                    </div>
                                ) : mediaList.length === 0 ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                                        <ImageIcon size={36} className="text-slate-300" />
                                        <p className="text-xs font-medium">Belum ada media yang diunggah.</p>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab('upload')}
                                            className="text-xs font-bold text-blue-600 hover:underline mt-1"
                                        >
                                            Unggah foto pertama &rarr;
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                        {mediaList.map((item, idx) => {
                                            const isSelected = selectedImage?.url === item.url;
                                            return (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setSelectedImage(item);
                                                        if (!altText) {
                                                            setAltText(item.name.replace(/\.[^/.]+$/, ''));
                                                        }
                                                    }}
                                                    className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all bg-slate-100 ${
                                                        isSelected
                                                            ? 'border-blue-600 shadow-md ring-2 ring-blue-500/30'
                                                            : 'border-slate-200 hover:border-slate-400'
                                                    }`}
                                                >
                                                    <img
                                                        src={item.url}
                                                        alt={item.name}
                                                        className="w-full h-full object-cover transition group-hover:scale-105"
                                                        loading="lazy"
                                                    />
                                                    {isSelected && (
                                                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 text-white rounded-md flex items-center justify-center shadow-md">
                                                            <Check size={14} />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white text-[10px] truncate opacity-0 group-hover:opacity-100 transition">
                                                        {item.name}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>

                            {/* Details Sidebar */}
                            <div className="w-full md:w-80 bg-white p-5 overflow-y-auto space-y-4 text-xs">
                                <h4 className="font-extrabold uppercase text-slate-800 tracking-wider text-[11px] pb-2 border-b border-slate-100">
                                    Detail Lampiran
                                </h4>

                                {selectedImage ? (
                                    <div className="space-y-4">
                                        <div className="flex gap-3 items-center bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <img
                                                src={selectedImage.url}
                                                alt={selectedImage.name}
                                                className="w-16 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                                            />
                                            <div className="overflow-hidden">
                                                <p className="font-bold text-slate-800 truncate text-xs" title={selectedImage.name}>
                                                    {selectedImage.name}
                                                </p>
                                                <p className="text-[11px] text-slate-400 mt-0.5">
                                                    {formatBytes(selectedImage.size)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 block">Teks Alternatif (Alt Text)</label>
                                            <input
                                                type="text"
                                                value={altText}
                                                onChange={(e) => setAltText(e.target.value)}
                                                placeholder="Deskripsi singkat gambar untuk SEO..."
                                                className="w-full text-xs rounded-xl border-slate-200 p-2.5 focus:ring-blue-500"
                                            />
                                            <p className="text-[10px] text-slate-400">Penting untuk skor optimasi Yoast SEO.</p>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="font-bold text-slate-700 block">Perataan Gambar (Alignment)</label>
                                            <div className="grid grid-cols-4 gap-1.5">
                                                {[
                                                    { id: 'none', label: 'Biasa' },
                                                    { id: 'left', label: 'Kiri' },
                                                    { id: 'center', label: 'Tengah' },
                                                    { id: 'right', label: 'Kanan' },
                                                ].map((opt) => (
                                                    <button
                                                        key={opt.id}
                                                        type="button"
                                                        onClick={() => setAlign(opt.id)}
                                                        className={`py-1.5 text-[11px] font-bold rounded-lg border transition ${
                                                            align === opt.id
                                                                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                                                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                                                        }`}
                                                    >
                                                        {opt.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-slate-400 italic text-center py-8">
                                        Pilih salah satu gambar dari pustaka untuk melihat detail dan opsi sisipkan.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-3.5 border-t border-slate-200 bg-white flex items-center justify-between">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition"
                    >
                        Batal
                    </button>
                    <button
                        type="button"
                        disabled={!selectedImage && activeTab === 'library'}
                        onClick={handleInsert}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        <Check size={16} />
                        Sisipkan Ke Dalam Pos (Insert into post)
                    </button>
                </div>
            </div>
        </div>
    );
}
