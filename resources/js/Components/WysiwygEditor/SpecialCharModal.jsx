import React from 'react';
import { X } from 'lucide-react';

const CHARACTERS = [
    '©', '®', '™', '€', '£', '¥', '₹', '¢',
    '§', '¶', '•', '–', '—', '‰', '°', '±',
    '×', '÷', '≤', '≥', '≠', '≈', '∞', '√',
    '∑', '∏', 'π', 'Ω', 'µ', 'α', 'β', 'γ',
    'δ', 'θ', 'λ', '←', '→', '↑', '↓', '↔',
    '«', '»', '“', '”', '‘', '’', '„', '…',
    '¼', '½', '¾', '⅓', '⅔', '⅛', '⅜', '⅝',
    '✓', '✔', '★', '☆', '✦', '♠', '♣', '♥',
];

export default function SpecialCharModal({ isOpen, onClose, onSelect }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200">
                <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
                    <div>
                        <h3 className="text-sm font-extrabold text-slate-900">Karakter Khusus (Special Characters)</h3>
                        <p className="text-[11px] text-slate-500">Klik karakter untuk menyisipkan ke dalam teks</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition"
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="p-4 grid grid-cols-8 gap-1.5 max-h-72 overflow-y-auto">
                    {CHARACTERS.map((char, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => {
                                onSelect(char);
                                onClose();
                            }}
                            className="h-10 text-base font-medium rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 transition flex items-center justify-center"
                        >
                            {char}
                        </button>
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
