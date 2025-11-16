import { useUIStore } from '@/stores/uiStore';
import { scrollToSection } from '@/utils/scrollAnimations';

export default function MobileMenu() {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    closeMobileMenu();
  };

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-900 bg-opacity-75 z-40 md:hidden"
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      {/* Mobile Menu Panel */}
      <div
        id="mobile-menu"
        className="fixed top-0 right-0 bottom-0 w-64 bg-white z-50 shadow-xl md:hidden transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-navy-100">
            <span className="text-lg font-serif font-bold text-navy-900">
              Меню
            </span>
            <button
              type="button"
              onClick={closeMobileMenu}
              className="p-2 rounded-md text-navy-700 hover:text-gold-600 hover:bg-navy-50 transition-colors"
              aria-label="Закрити меню"
            >
              <svg
                className="w-6 h-6"
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

          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto p-4" aria-label="Mobile navigation">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick('home')}
                  className="w-full text-left px-4 py-3 rounded-lg text-navy-700 hover:bg-navy-50 hover:text-gold-600 font-medium transition-colors"
                >
                  Головна
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('about')}
                  className="w-full text-left px-4 py-3 rounded-lg text-navy-700 hover:bg-navy-50 hover:text-gold-600 font-medium transition-colors"
                >
                  Про мене
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('courses')}
                  className="w-full text-left px-4 py-3 rounded-lg text-navy-700 hover:bg-navy-50 hover:text-gold-600 font-medium transition-colors"
                >
                  Курси
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('testimonials')}
                  className="w-full text-left px-4 py-3 rounded-lg text-navy-700 hover:bg-navy-50 hover:text-gold-600 font-medium transition-colors"
                >
                  Відгуки
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contacts')}
                  className="w-full text-left px-4 py-3 rounded-lg text-navy-700 hover:bg-navy-50 hover:text-gold-600 font-medium transition-colors"
                >
                  Контакти
                </button>
              </li>
            </ul>
          </nav>

          {/* Social Media Links */}
          <div className="p-4 border-t border-navy-100">
            <p className="text-sm font-medium text-navy-700 mb-3">
              Соціальні мережі
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.youtube.com/@vikazhu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-navy-700 hover:text-gold-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/vikazhu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-navy-700 hover:text-gold-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" fill-rule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
