import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  /**
   * 'dark' is the default and matches the rest of the application.
   * pass "light" or provide custom `panelClassName`/`backdropClassName` to override.
   */
  theme = 'dark',
  panelClassName = '',
  backdropClassName = '',
}) {
  if (!isOpen) return null;

  // choose colours based on theme
  const isLight = theme === 'light';
  const panelBg = isLight ? 'bg-white text-black' : 'bg-zinc-950 text-white';
  const backdropBg = isLight ? 'bg-black/30' : 'bg-black/80';
  const headerText = isLight ? 'text-black' : 'text-black';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 ${backdropBg} backdrop-blur-sm ${backdropClassName}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative rounded-xl shadow-[0_0_30px_rgba(34,197,94,0.3)] w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto border border-green-500 ${panelBg} ${panelClassName}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-green-500">
          <h3 className={`text-lg font-bold ${headerText} uppercase tracking-wide`}>{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-black/60 hover:text-black hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4">
          {children}
        </div>
      </div>
    </div>
  );
}
