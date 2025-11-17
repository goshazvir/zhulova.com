import { useEffect, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop - Soft Luxury Glass */}
      <div
        className="fixed inset-0 bg-navy-900/80 backdrop-blur-sm transition-opacity duration-300"
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Modal Panel - Soft Luxury Glass */}
        <div className="relative bg-white border border-gold-300 shadow-2xl shadow-gold-500/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300">
          {/* Header - Gold Top Line + Gradient */}
          <div className="relative flex items-center justify-between p-6 border-b border-gold-200/30 border-t-4 border-t-gold-400 rounded-t-2xl bg-gradient-to-r from-transparent via-gold-50/30 to-transparent">
            <h2 id="modal-title" className="text-2xl font-serif font-bold text-navy-900">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-navy-400 hover:text-gold-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 rounded-full p-2 hover:bg-gold-50/50"
              aria-label="Закрити модальне вікно"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
