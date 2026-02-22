import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-zinc-950 rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-green-500">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-green-500">
          <h3 className="text-lg font-bold text-black uppercase tracking-wide">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-black/60 hover:text-black hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 text-white">
          {children}
        </div>
      </div>
    </div>
  );
}
