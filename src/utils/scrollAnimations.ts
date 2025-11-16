/**
 * Initialize scroll animations using Intersection Observer API
 * Respects user's motion preferences
 */
export function initScrollAnimations() {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Skip animations for users who prefer reduced motion
    return;
  }

  // Create intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Add animation class when element enters viewport
          entry.target.classList.add('fade-in-up');

          // Optional: Unobserve after animation to improve performance
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1, // Trigger when 10% of element is visible
      rootMargin: '0px 0px -50px 0px', // Start animation slightly before element is fully visible
    }
  );

  // Observe all elements with data-animate attribute
  const animatedElements = document.querySelectorAll('[data-animate]');
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Update active navigation section based on scroll position
 */
export function initSectionTracking(callback: (sectionId: string) => void) {
  const sections = document.querySelectorAll('section[id]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
          callback(entry.target.id);
        }
      });
    },
    {
      threshold: [0.5],
      rootMargin: '-20% 0px -20% 0px',
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
}

/**
 * Smooth scroll to section
 */
export function scrollToSection(sectionId: string) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerOffset = 80; // Account for fixed header
    const elementPosition = section.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}
