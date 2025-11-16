/**
 * Premium Micro-Interactions for Hero Section
 * Subtle animations for luxury feel
 */

// 1. MAGNETIC BUTTON EFFECT
// ===========================
function initMagneticButton() {
  const button = document.querySelector('.magnetic-button');
  if (!button) return;

  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Subtle magnetic pull (15% of mouse distance)
    button.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'translate(0, 0)';
  });
}

// 2. VARIABLE FONT ON SCROLL
// ===========================
function initVariableFont() {
  const title = document.querySelector('.variable-title-scroll');
  if (!title) return;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const maxScroll = 500; // Adjust based on your layout
    const minWeight = 300;
    const maxWeight = 700;

    // Calculate weight based on scroll
    const progress = Math.min(scroll / maxScroll, 1);
    const weight = minWeight + (maxWeight - minWeight) * progress;

    title.style.setProperty('--font-weight', weight);
  });
}

// 3. PARALLAX MOUSE EFFECT
// ===========================
function initParallaxMouse() {
  const hero = document.querySelector('.hero-section');
  const elements = hero?.querySelectorAll('[data-parallax]');
  if (!elements?.length) return;

  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate position from center (-1 to 1)
    const x = (clientX / innerWidth - 0.5) * 2;
    const y = (clientY / innerHeight - 0.5) * 2;

    elements.forEach(element => {
      const speed = element.dataset.parallax || '1';
      const speedValue = parseFloat(speed);

      const translateX = x * speedValue * 20; // 20px max movement
      const translateY = y * speedValue * 20;

      element.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });
  });

  hero.addEventListener('mouseleave', () => {
    elements.forEach(element => {
      element.style.transform = 'translate(0, 0)';
    });
  });
}

// 4. TEXT REVEAL ON INTERSECTION
// ================================
function initTextReveal() {
  const reveals = document.querySelectorAll('.text-reveal');
  if (!reveals.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Split text into lines and animate
        const text = entry.target.innerHTML;
        const lines = text.split('<br>').filter(line => line.trim());

        entry.target.innerHTML = lines
          .map(line => `<span class="text-reveal-line">${line}</span>`)
          .join('');

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  reveals.forEach(reveal => observer.observe(reveal));
}

// 5. SMOOTH NUMBER COUNTER
// =========================
function initNumberCounter() {
  const numbers = document.querySelectorAll('[data-counter]');
  if (!numbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const target = parseInt(element.dataset.counter);
        const duration = 2000; // 2 seconds
        const start = 0;
        const increment = target / (duration / 16); // 60fps

        let current = start;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
          } else {
            element.textContent = Math.floor(current).toLocaleString();
          }
        }, 16);

        observer.unobserve(element);
      }
    });
  }, {
    threshold: 0.5
  });

  numbers.forEach(number => observer.observe(number));
}

// 6. AURORA BACKGROUND MOUSE INTERACTION
// =======================================
function initAuroraInteraction() {
  const aurora = document.querySelector('.aurora-interactive');
  if (!aurora) return;

  aurora.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { offsetWidth, offsetHeight } = aurora;

    const x = (clientX / offsetWidth) * 100;
    const y = (clientY / offsetHeight) * 100;

    // Update CSS variables for gradient position
    aurora.style.setProperty('--aurora-x', `${x}%`);
    aurora.style.setProperty('--aurora-y', `${y}%`);
  });
}

// 7. SMOOTH SCROLL TO SECTIONS
// =============================
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);

      if (target) {
        const offset = 80; // Header height
        const targetPosition = target.offsetTop - offset;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// 8. LAZY LOAD DECORATIVE ELEMENTS
// =================================
function initLazyDecorations() {
  const decorations = document.querySelectorAll('.lazy-decoration');
  if (!decorations.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('loaded');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });

  decorations.forEach(decoration => observer.observe(decoration));
}

// 9. PERFORMANCE MONITOR
// =======================
function monitorPerformance() {
  // Only in development
  if (process.env.NODE_ENV !== 'development') return;

  // Check animation performance
  let fps = 0;
  let lastTime = performance.now();

  function checkFPS() {
    const currentTime = performance.now();
    fps = 1000 / (currentTime - lastTime);
    lastTime = currentTime;

    if (fps < 30) {
      console.warn('Low FPS detected:', Math.round(fps));
      // Disable heavy animations
      document.body.classList.add('reduce-animations');
    }

    requestAnimationFrame(checkFPS);
  }

  requestAnimationFrame(checkFPS);
}

// 10. RESPECT REDUCED MOTION
// ===========================
function respectReducedMotion() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function handleReducedMotion() {
    if (prefersReducedMotion.matches) {
      document.body.classList.add('reduced-motion');
      // Disable all micro-interactions
      return false;
    } else {
      document.body.classList.remove('reduced-motion');
      return true;
    }
  }

  // Initial check
  const canAnimate = handleReducedMotion();

  // Listen for changes
  prefersReducedMotion.addEventListener('change', handleReducedMotion);

  return canAnimate;
}

// INITIALIZE ALL INTERACTIONS
// ============================
document.addEventListener('DOMContentLoaded', () => {
  // Check if animations should be enabled
  const canAnimate = respectReducedMotion();

  if (canAnimate) {
    initMagneticButton();
    initVariableFont();
    initParallaxMouse();
    initTextReveal();
    initNumberCounter();
    initAuroraInteraction();
    initLazyDecorations();
  }

  // Always init smooth scroll
  initSmoothScroll();

  // Monitor performance in dev
  if (window.location.hostname === 'localhost') {
    monitorPerformance();
  }
});

// EXPORT FOR USE IN ASTRO
// ========================
export {
  initMagneticButton,
  initVariableFont,
  initParallaxMouse,
  initTextReveal,
  initNumberCounter,
  initAuroraInteraction,
  initSmoothScroll,
  initLazyDecorations,
  respectReducedMotion
};