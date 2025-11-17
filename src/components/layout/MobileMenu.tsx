import { useUIStore } from '@/stores/uiStore';
import { scrollToSection } from '@/utils/scrollAnimations';

interface Props {
  variant?: 'main' | 'legal';
}

export default function MobileMenu({ variant = 'main' }: Props) {
  const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);
  const activeSection = useUIStore((state) => state.activeSection);
  const closeMobileMenu = useUIStore((state) => state.closeMobileMenu);

  // Check current page for active state
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isCoursesPage = currentPath.startsWith('/courses');
  const isContactsPage = currentPath.startsWith('/contacts');

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    // Only smooth scroll if we're on the home page
    if (window.location.pathname === '/' || window.location.pathname === '') {
      e.preventDefault();
      scrollToSection(sectionId);
      closeMobileMenu();
    } else {
      // Let the browser navigate normally to /#section
      closeMobileMenu();
    }
  };

  const getNavItemClasses = (sectionId: string) => {
    const baseClasses = "block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors";
    const activeClasses = activeSection === sectionId
      ? "bg-gold-50 text-gold-600 font-semibold"
      : "text-navy-700 hover:bg-navy-50 hover:text-gold-600";
    return `${baseClasses} ${activeClasses}`;
  };

  const getPageNavItemClasses = (isActive: boolean) => {
    const baseClasses = "block w-full text-left px-4 py-3 rounded-lg font-medium transition-colors";
    return `${baseClasses} ${isActive ? 'bg-gold-50 text-gold-600 font-semibold' : 'text-navy-700 hover:bg-navy-50 hover:text-gold-600'}`;
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
            {variant === 'main' ? (
              <ul className="space-y-2">
                <li>
                  <a
                    href="/#home"
                    onClick={(e) => handleNavClick(e, 'home')}
                    className={getNavItemClasses('home')}
                  >
                    Про мене
                  </a>
                </li>
                <li>
                  <a
                    href="/#stories"
                    onClick={(e) => handleNavClick(e, 'stories')}
                    className={getNavItemClasses('stories')}
                  >
                    Кейси
                  </a>
                </li>
                <li>
                  <a
                    href="/#questions"
                    onClick={(e) => handleNavClick(e, 'questions')}
                    className={getNavItemClasses('questions')}
                  >
                    Питання
                  </a>
                </li>
                <li>
                  <a
                    href="/#testimonials"
                    onClick={(e) => handleNavClick(e, 'testimonials')}
                    className={getNavItemClasses('testimonials')}
                  >
                    Відгуки
                  </a>
                </li>
                <li>
                  <a
                    href="/courses"
                    onClick={closeMobileMenu}
                    className={getPageNavItemClasses(isCoursesPage)}
                  >
                    Курси
                  </a>
                </li>
                <li>
                  <a
                    href="/contacts"
                    onClick={closeMobileMenu}
                    className={getPageNavItemClasses(isContactsPage)}
                  >
                    Контакти
                  </a>
                </li>
              </ul>
            ) : (
              <ul className="space-y-2">
                <li>
                  <a
                    href="/"
                    className="block w-full text-left px-4 py-3 rounded-lg font-medium text-navy-700 hover:bg-navy-50 hover:text-gold-600 transition-colors"
                  >
                    Головна
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    className="block w-full text-left px-4 py-3 rounded-lg font-medium text-navy-700 hover:bg-navy-50 hover:text-gold-600 transition-colors"
                  >
                    Конфіденційність
                  </a>
                </li>
                <li>
                  <a
                    href="/terms"
                    className="block w-full text-left px-4 py-3 rounded-lg font-medium text-navy-700 hover:bg-navy-50 hover:text-gold-600 transition-colors"
                  >
                    Умови
                  </a>
                </li>
              </ul>
            )}
          </nav>

          {/* Social Media Links */}
          <div className="p-4 border-t border-navy-100">
            <p className="text-sm font-medium text-navy-700 mb-3">
              Соціальні мережі
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.youtube.com/@%D0%9A%D0%BE%D1%83%D1%87%D0%92%D0%B8%D0%BA%D1%82%D0%BE%D1%80%D0%B8%D1%8F"
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
                href="https://www.instagram.com/viktoria_revolution/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-navy-700 hover:text-gold-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd" fill-rule="evenodd"/>
                </svg>
              </a>
              <a
                href="https://t.me/viktoria_life_coach"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="text-navy-700 hover:text-gold-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 496 512"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    d="M248 8C111 8 0 119 0 256S111 504 248 504 496 393 496 256 385 8 248 8zM363 176.7c-3.7 39.2-19.9 134.4-28.1 178.3-3.5 18.6-10.3 24.8-16.9 25.4-14.4 1.3-25.3-9.5-39.3-18.7-21.8-14.3-34.2-23.2-55.3-37.2-24.5-16.1-8.6-25 5.3-39.5 3.7-3.8 67.1-61.5 68.3-66.7 .2-.7 .3-3.1-1.2-4.4s-3.6-.8-5.1-.5q-3.3 .7-104.6 69.1-14.8 10.2-26.9 9.9c-8.9-.2-25.9-5-38.6-9.1-15.5-5-27.9-7.7-26.8-16.3q.8-6.7 18.5-13.7 108.4-47.2 144.6-62.3c68.9-28.6 83.2-33.6 92.5-33.8 2.1 0 6.6 .5 9.6 2.9a10.5 10.5 0 0 1 3.5 6.7A43.8 43.8 0 0 1 363 176.7z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
