import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initScrollAnimations, initSectionTracking, scrollToSection } from './scrollAnimations';

describe('Scroll Animations Utilities', () => {
  // Mock IntersectionObserver
  let intersectionObserverMock: any;
  let observeMock: ReturnType<typeof vi.fn>;
  let unobserveMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';

    // Mock window.matchMedia
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });

    // Mock IntersectionObserver
    observeMock = vi.fn();
    unobserveMock = vi.fn();

    intersectionObserverMock = vi.fn(function (this: any, callback: any, options: any) {
      this.observe = observeMock;
      this.unobserve = unobserveMock;
      this.disconnect = vi.fn();
      this.root = null;
      this.rootMargin = options?.rootMargin || '';
      this.thresholds = options?.threshold || 0;
      this.takeRecords = vi.fn();
      this.callback = callback;
      this.options = options;
    });

    global.IntersectionObserver = intersectionObserverMock as any;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initScrollAnimations', () => {
    it('should skip animations when user prefers reduced motion', () => {
      // Mock user preferring reduced motion
      window.matchMedia = vi.fn().mockImplementation((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
      })) as any;

      // Add elements to observe
      document.body.innerHTML = '<div data-animate>Content</div>';

      initScrollAnimations();

      // IntersectionObserver should NOT be created
      expect(intersectionObserverMock).not.toHaveBeenCalled();
    });

    it('should create IntersectionObserver with correct options', () => {
      document.body.innerHTML = '<div data-animate>Content</div>';

      initScrollAnimations();

      expect(intersectionObserverMock).toHaveBeenCalledOnce();
      expect(intersectionObserverMock).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        })
      );
    });

    it('should observe all elements with data-animate attribute', () => {
      document.body.innerHTML = `
        <div data-animate>Element 1</div>
        <div data-animate>Element 2</div>
        <div>Not animated</div>
        <div data-animate>Element 3</div>
      `;

      initScrollAnimations();

      // Should observe 3 elements (not the one without data-animate)
      expect(observeMock).toHaveBeenCalledTimes(3);
    });

    it('should add fade-in-up class when element enters viewport', () => {
      const element = document.createElement('div');
      element.setAttribute('data-animate', '');
      document.body.appendChild(element);

      initScrollAnimations();

      // Get the callback passed to IntersectionObserver
      const callback = intersectionObserverMock.mock.calls[0][0];

      // Simulate element entering viewport
      callback([
        {
          target: element,
          isIntersecting: true,
          intersectionRatio: 0.5,
        },
      ]);

      // Element should have animation class
      expect(element.classList.contains('fade-in-up')).toBe(true);
    });

    it('should unobserve element after animation', () => {
      const element = document.createElement('div');
      element.setAttribute('data-animate', '');
      document.body.appendChild(element);

      initScrollAnimations();

      const callback = intersectionObserverMock.mock.calls[0][0];

      callback([
        {
          target: element,
          isIntersecting: true,
        },
      ]);

      // Should unobserve after adding animation class
      expect(unobserveMock).toHaveBeenCalledWith(element);
    });

    it('should not add class when element is not intersecting', () => {
      const element = document.createElement('div');
      element.setAttribute('data-animate', '');
      document.body.appendChild(element);

      initScrollAnimations();

      const callback = intersectionObserverMock.mock.calls[0][0];

      callback([
        {
          target: element,
          isIntersecting: false,
        },
      ]);

      // Element should NOT have animation class
      expect(element.classList.contains('fade-in-up')).toBe(false);
    });
  });

  describe('initSectionTracking', () => {
    it('should create IntersectionObserver for sections and footer', () => {
      document.body.innerHTML = `
        <section id="home">Home</section>
        <section id="about">About</section>
        <footer id="footer">Footer</footer>
      `;

      const callback = vi.fn();
      initSectionTracking(callback);

      expect(intersectionObserverMock).toHaveBeenCalledOnce();
      expect(intersectionObserverMock).toHaveBeenCalledWith(
        expect.any(Function),
        expect.objectContaining({
          threshold: [0.3, 0.5, 0.7],
          rootMargin: '-15% 0px -15% 0px',
        })
      );

      // Should observe all sections and footer (3 elements)
      expect(observeMock).toHaveBeenCalledTimes(3);
    });

    it('should call callback with section ID when intersecting', () => {
      const homeSection = document.createElement('section');
      homeSection.id = 'home';
      document.body.appendChild(homeSection);

      const callbackFn = vi.fn();
      initSectionTracking(callbackFn);

      const observerCallback = intersectionObserverMock.mock.calls[0][0];

      // Simulate section entering viewport with high intersection ratio
      observerCallback([
        {
          target: homeSection,
          isIntersecting: true,
          intersectionRatio: 0.5,
        },
      ]);

      expect(callbackFn).toHaveBeenCalledWith('home');
    });

    it('should not call callback when intersection ratio is too low', () => {
      const homeSection = document.createElement('section');
      homeSection.id = 'home';
      document.body.appendChild(homeSection);

      const callbackFn = vi.fn();
      initSectionTracking(callbackFn);

      const observerCallback = intersectionObserverMock.mock.calls[0][0];

      // Simulate section with low intersection ratio (< 0.3)
      observerCallback([
        {
          target: homeSection,
          isIntersecting: true,
          intersectionRatio: 0.2,
        },
      ]);

      expect(callbackFn).not.toHaveBeenCalled();
    });

    it('should not call callback when not intersecting', () => {
      const homeSection = document.createElement('section');
      homeSection.id = 'home';
      document.body.appendChild(homeSection);

      const callbackFn = vi.fn();
      initSectionTracking(callbackFn);

      const observerCallback = intersectionObserverMock.mock.calls[0][0];

      observerCallback([
        {
          target: homeSection,
          isIntersecting: false,
          intersectionRatio: 0.5,
        },
      ]);

      expect(callbackFn).not.toHaveBeenCalled();
    });
  });

  describe('scrollToSection', () => {
    it('should scroll to section with header offset', () => {
      // Mock window methods
      const scrollToMock = vi.fn();
      window.scrollTo = scrollToMock;
      window.pageYOffset = 1000;

      // Create section
      const section = document.createElement('section');
      section.id = 'about';

      // Mock getBoundingClientRect
      section.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 500,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      });

      document.body.appendChild(section);

      scrollToSection('about');

      // Should call scrollTo with calculated position
      // offsetPosition = 500 (top) + 1000 (pageYOffset) - 80 (headerOffset) = 1420
      expect(scrollToMock).toHaveBeenCalledWith({
        top: 1420,
        behavior: 'smooth',
      });
    });

    it('should not scroll if section does not exist', () => {
      const scrollToMock = vi.fn();
      window.scrollTo = scrollToMock;

      scrollToSection('nonexistent');

      expect(scrollToMock).not.toHaveBeenCalled();
    });

    it('should handle section at the top of page', () => {
      const scrollToMock = vi.fn();
      window.scrollTo = scrollToMock;
      window.pageYOffset = 0;

      const section = document.createElement('section');
      section.id = 'top';

      section.getBoundingClientRect = vi.fn().mockReturnValue({
        top: 100,
        left: 0,
        right: 0,
        bottom: 0,
        width: 0,
        height: 0,
      });

      document.body.appendChild(section);

      scrollToSection('top');

      // offsetPosition = 100 + 0 - 80 = 20
      expect(scrollToMock).toHaveBeenCalledWith({
        top: 20,
        behavior: 'smooth',
      });
    });
  });

  describe('Integration tests', () => {
    it('should work with multiple animated elements', () => {
      document.body.innerHTML = `
        <div data-animate>Item 1</div>
        <div data-animate>Item 2</div>
        <div data-animate>Item 3</div>
      `;

      initScrollAnimations();

      const callback = intersectionObserverMock.mock.calls[0][0];
      const elements = document.querySelectorAll('[data-animate]');

      // Simulate all elements entering viewport
      callback(
        Array.from(elements).map((el) => ({
          target: el,
          isIntersecting: true,
        }))
      );

      // All elements should have animation class
      elements.forEach((el) => {
        expect(el.classList.contains('fade-in-up')).toBe(true);
      });
    });

    it('should handle mixed sections and footer', () => {
      document.body.innerHTML = `
        <section id="hero">Hero</section>
        <section id="about">About</section>
        <section id="contact">Contact</section>
        <footer id="footer">Footer</footer>
      `;

      const trackingCallback = vi.fn();
      initSectionTracking(trackingCallback);

      const observerCallback = intersectionObserverMock.mock.calls[0][0];
      const hero = document.getElementById('hero')!;
      const footer = document.getElementById('footer')!;

      // Simulate hero section becoming active
      observerCallback([
        {
          target: hero,
          isIntersecting: true,
          intersectionRatio: 0.6,
        },
      ]);

      expect(trackingCallback).toHaveBeenCalledWith('hero');

      // Simulate scrolling to footer
      observerCallback([
        {
          target: footer,
          isIntersecting: true,
          intersectionRatio: 0.5,
        },
      ]);

      expect(trackingCallback).toHaveBeenCalledWith('footer');
    });
  });
});
