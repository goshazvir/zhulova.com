import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Fade/scale entry transition. Callers must disable it under prefers-reduced-motion. */
  animateEntry?: boolean;
}

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Modal({ isOpen, onClose, title, children, animateEntry = false }: ModalProps) {
  const scrollbarWidthRef = useRef<number>(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);

  // Entry animation: mount in the hidden state, transition in on the next frame
  useEffect(() => {
    if (!isOpen || !animateEntry) return;
    setEntered(false);
    const frame = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(frame);
  }, [isOpen, animateEntry]);

  const entryClasses = animateEntry && !entered ? 'opacity-0 scale-95' : 'opacity-100 scale-100';
  const backdropEntryClasses = animateEntry && !entered ? 'opacity-0' : 'opacity-100';

  // Focus management: move focus into the dialog on open, trap Tab inside,
  // return focus to the previously focused element on close (WCAG 2.4.3)
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const getFocusable = (): HTMLElement[] =>
      Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);

    getFocusable()[0]?.focus();

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;
      const outside = !dialogRef.current?.contains(active);

      if (e.shiftKey && (active === first || outside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (active === last || outside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleTab);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  // Handle escape key press and prevent background scroll
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Calculate scrollbar width before hiding
    scrollbarWidthRef.current = window.innerWidth - document.documentElement.clientWidth;

    // Get original overflow values
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const originalHtmlOverflow = htmlElement.style.overflow;
    const originalBodyOverflow = bodyElement.style.overflow;
    const originalBodyPaddingRight = bodyElement.style.paddingRight;

    // Prevent body scroll when modal is open
    htmlElement.style.overflow = 'hidden';
    bodyElement.style.overflow = 'hidden';

    // Compensate for scrollbar width to prevent layout shift
    if (scrollbarWidthRef.current > 0) {
      bodyElement.style.paddingRight = `${scrollbarWidthRef.current}px`;
    }

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);

      // Restore original overflow values
      htmlElement.style.overflow = originalHtmlOverflow;
      bodyElement.style.overflow = originalBodyOverflow;
      bodyElement.style.paddingRight = originalBodyPaddingRight;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Prevent scroll propagation on overlay
  const handleOverlayWheel = (e: React.WheelEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      ref={dialogRef}
      className="fixed inset-0 z-50 overflow-y-auto overscroll-contain"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onWheel={handleOverlayWheel}
    >
      {/* Backdrop - Soft Luxury Glass */}
      <div
        className={`fixed inset-0 bg-navy-900/80 backdrop-blur-sm transition-opacity duration-300 ${backdropEntryClasses}`}
        aria-hidden="true"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-3 sm:p-4 py-8 sm:py-12">
        {/* Modal Panel - Soft Luxury Glass */}
        <div className={`relative bg-gradient-to-br from-white to-sage-50 border border-gold-200 shadow-2xl shadow-gold-500/15 rounded-xl sm:rounded-2xl max-w-lg w-full transform transition-all duration-300 ease-out ${entryClasses}`}>
          {/* Header - Gold Top Line + Gradient */}
          <div className="relative flex items-center justify-between gap-3 p-4 sm:p-6 border-b border-gold-200/30 border-t-2 sm:border-t-4 border-t-gold-400 rounded-t-xl sm:rounded-t-2xl bg-gradient-to-r from-transparent via-gold-50/30 to-transparent">
            <h2 id="modal-title" className="text-lg sm:text-2xl font-serif font-bold text-navy-900 leading-tight">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="flex-shrink-0 text-navy-400 hover:text-gold-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gold-400/50 rounded-full p-2 hover:bg-gold-50/50 -mr-1"
              aria-label="Закрити модальне вікно"
            >
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6"
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
          <div className="p-4 sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
