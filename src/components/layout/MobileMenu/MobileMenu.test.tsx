import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MobileMenu from './index';

// Mock scrollToSection
vi.mock('@/utils/scrollAnimations', () => ({
  scrollToSection: vi.fn(),
}));

// Mock window.location
const mockLocation = {
  pathname: '/',
};

Object.defineProperty(window, 'location', {
  value: mockLocation,
  writable: true,
});

// Create mock store state
const createMockStore = (overrides = {}) => ({
  isMobileMenuOpen: false,
  activeSection: 'home',
  closeMobileMenu: vi.fn(),
  ...overrides,
});

let mockStoreState = createMockStore();

// Mock useUIStore
vi.mock('@/stores/uiStore', () => ({
  useUIStore: (selector: (state: typeof mockStoreState) => unknown) => selector(mockStoreState),
}));

describe('MobileMenu Component', () => {
  beforeEach(() => {
    mockStoreState = createMockStore();
    mockLocation.pathname = '/';
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders null when menu is closed', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: false });
      const { container } = render(<MobileMenu />);
      expect(container.firstChild).toBeNull();
    });

    it('renders menu panel when open', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Меню')).toBeInTheDocument();
    });

    it('renders backdrop when menu is open', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      // Backdrop has aria-hidden="true"
      const backdrop = document.querySelector('[aria-hidden="true"]');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveClass('fixed', 'inset-0', 'bg-navy-900');
    });
  });

  describe('Close Actions', () => {
    it('closes menu on close button click', async () => {
      const closeMobileMenu = vi.fn();
      mockStoreState = createMockStore({ isMobileMenuOpen: true, closeMobileMenu });
      render(<MobileMenu />);

      const closeButton = screen.getByRole('button', { name: /закрити меню/i });
      await userEvent.click(closeButton);

      expect(closeMobileMenu).toHaveBeenCalledTimes(1);
    });

    it('closes menu on backdrop click', async () => {
      const closeMobileMenu = vi.fn();
      mockStoreState = createMockStore({ isMobileMenuOpen: true, closeMobileMenu });
      render(<MobileMenu />);

      const backdrop = document.querySelector('[aria-hidden="true"]');
      fireEvent.click(backdrop!);

      expect(closeMobileMenu).toHaveBeenCalledTimes(1);
    });

    it('closes menu on Escape key press', () => {
      const closeMobileMenu = vi.fn();
      mockStoreState = createMockStore({ isMobileMenuOpen: true, closeMobileMenu });
      render(<MobileMenu />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(closeMobileMenu).toHaveBeenCalledTimes(1);
    });

    it('does not respond to Escape when menu is closed', () => {
      const closeMobileMenu = vi.fn();
      mockStoreState = createMockStore({ isMobileMenuOpen: false, closeMobileMenu });
      render(<MobileMenu />);

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(closeMobileMenu).not.toHaveBeenCalled();
    });
  });

  describe('Main Navigation Variant', () => {
    it('renders 6 navigation links for main variant', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu variant="main" />);

      expect(screen.getByText('Про мене')).toBeInTheDocument();
      expect(screen.getByText('Кейси')).toBeInTheDocument();
      expect(screen.getByText('Питання')).toBeInTheDocument();
      expect(screen.getByText('Відгуки')).toBeInTheDocument();
      expect(screen.getByText('Курси')).toBeInTheDocument();
      expect(screen.getByText('Контакти')).toBeInTheDocument();
    });

    it('renders default variant as main', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      expect(screen.getByText('Про мене')).toBeInTheDocument();
      expect(screen.getByText('Курси')).toBeInTheDocument();
    });
  });

  describe('Legal Navigation Variant', () => {
    it('renders 3 navigation links for legal variant', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu variant="legal" />);

      expect(screen.getByText('Головна')).toBeInTheDocument();
      expect(screen.getByText('Конфіденційність')).toBeInTheDocument();
      expect(screen.getByText('Умови')).toBeInTheDocument();
    });

    it('does not render main navigation links for legal variant', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu variant="legal" />);

      expect(screen.queryByText('Про мене')).not.toBeInTheDocument();
      expect(screen.queryByText('Курси')).not.toBeInTheDocument();
    });
  });

  describe('Active Section Styling', () => {
    it('applies active styles to current section', () => {
      mockStoreState = createMockStore({
        isMobileMenuOpen: true,
        activeSection: 'stories'
      });
      render(<MobileMenu variant="main" />);

      const storiesLink = screen.getByText('Кейси');
      expect(storiesLink).toHaveClass('bg-gold-50', 'text-gold-600', 'font-semibold');
    });

    it('applies inactive styles to non-active sections', () => {
      mockStoreState = createMockStore({
        isMobileMenuOpen: true,
        activeSection: 'home'
      });
      render(<MobileMenu variant="main" />);

      const storiesLink = screen.getByText('Кейси');
      expect(storiesLink).toHaveClass('text-navy-700');
      expect(storiesLink).not.toHaveClass('bg-gold-50');
    });
  });

  describe('Page Active States', () => {
    it('highlights courses link when on courses page', () => {
      mockLocation.pathname = '/courses';
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu variant="main" />);

      const coursesLink = screen.getByText('Курси');
      expect(coursesLink).toHaveClass('bg-gold-50', 'text-gold-600', 'font-semibold');
    });

    it('highlights contacts link when on contacts page', () => {
      mockLocation.pathname = '/contacts';
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu variant="main" />);

      const contactsLink = screen.getByText('Контакти');
      expect(contactsLink).toHaveClass('bg-gold-50', 'text-gold-600', 'font-semibold');
    });
  });

  describe('Social Media Links', () => {
    it('renders social media links', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      expect(screen.getByText('Соціальні мережі')).toBeInTheDocument();
      expect(screen.getByLabelText('YouTube')).toBeInTheDocument();
      expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
      expect(screen.getByLabelText('Telegram')).toBeInTheDocument();
    });

    it('social links open in new tab', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      const youtubeLink = screen.getByLabelText('YouTube');
      expect(youtubeLink).toHaveAttribute('target', '_blank');
      expect(youtubeLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Navigation Click Handling', () => {
    it('scrolls to section and prevents default on home page', async () => {
      const { scrollToSection } = await import('@/utils/scrollAnimations');
      const closeMobileMenu = vi.fn();
      mockLocation.pathname = '/';
      mockStoreState = createMockStore({ isMobileMenuOpen: true, closeMobileMenu });
      render(<MobileMenu variant="main" />);

      const storiesLink = screen.getByText('Кейси');
      fireEvent.click(storiesLink);

      expect(scrollToSection).toHaveBeenCalledWith('stories');
      expect(closeMobileMenu).toHaveBeenCalled();
    });

    it('only closes menu on non-home page navigation', async () => {
      const { scrollToSection } = await import('@/utils/scrollAnimations');
      const closeMobileMenu = vi.fn();
      mockLocation.pathname = '/courses';
      mockStoreState = createMockStore({ isMobileMenuOpen: true, closeMobileMenu });
      render(<MobileMenu variant="main" />);

      const homeLink = screen.getByText('Про мене');
      fireEvent.click(homeLink);

      expect(scrollToSection).not.toHaveBeenCalled();
      expect(closeMobileMenu).toHaveBeenCalled();
    });

    it('closes menu when clicking page links', async () => {
      const closeMobileMenu = vi.fn();
      mockStoreState = createMockStore({ isMobileMenuOpen: true, closeMobileMenu });
      render(<MobileMenu variant="main" />);

      const coursesLink = screen.getByText('Курси');
      fireEvent.click(coursesLink);

      expect(closeMobileMenu).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA attributes on dialog', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(dialog).toHaveAttribute('aria-labelledby', 'mobile-menu-title');
    });

    it('has proper navigation aria-label', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Mobile navigation');
    });

    it('close button has aria-label', () => {
      mockStoreState = createMockStore({ isMobileMenuOpen: true });
      render(<MobileMenu />);

      const closeButton = screen.getByRole('button', { name: /закрити меню/i });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
