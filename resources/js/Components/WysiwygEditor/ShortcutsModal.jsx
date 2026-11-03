import React from 'react';
import { X, Keyboard } from 'lucide-react';

const SHORTCUTS = [
    { key: 'Ctrl + B', label: 'Teks Tebal (Bold)' },
    { key: 'Ctrl + I', label: 'Teks Miring (Italic)' },
    { key: 'Ctrl + U', label: 'Garis Bawah (Underline)' },
    { key: 'Ctrl + K', label: 'Sisipkan / Edit Link' },
    { key: 'Ctrl + Z', label: 'Urungkan (Undo)' },
    { key: 'Ctrl + Y', label: 'Ulangi (Redo)' },
    { key: 'Shift + Alt + 1', label: 'Judul Heading 1' },
    { key: 'Shift + Alt + 2', label: 'Sub-Judul Heading 2' },
    { key: 'Shift + Alt + 3', label: 'Sub-Judul Heading 3' },
    { key: 'Shift + Alt + U', label: 'Daftar Poin (Bulleted List)' },
    { key: 'Shift + Alt + O', label: 'Daftar Angka (Numbered List)' },
    { key: 'Shift + Alt + Q', label: 'Kutipan (Blockquote)' },
    { key: 'Shift + Alt + L', label: 'Rata Kiri (Align Left)' },
    { key: 'Shift + Alt + C', label: 'Rata Tengah (Align Center)' },
    { key: 'Shift + Alt + R', label: 'Rata Kanan (Align Right)' },
    { key: 'Shift + Alt + J', label: 'Rata Kiri-Kanan (Justify)' },
];

export default function ShortcutsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div className="flex items-center gap-2">
                        <Keyboard size={18} className="text-blue-600" />
                        <h3 className="text-sm font-extrabold text-slate-900">Pintasan Keyboard (Shortcuts)</h3>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-5 max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {SHORTCUTS.map((item, index) => (
                        <div key={index} className="py-2.5 flex items-center justify-between">
                            <span className="text-slate-700 font-medium">{item.label}</span>
                            <kbd className="px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-md text-[11px] font-mono font-bold text-slate-800 shadow-2xs">
                                {item.key}
                            </kbd>
                        </div>
                    ))}
                </div>
                <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200 transition"
                    >
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
}
