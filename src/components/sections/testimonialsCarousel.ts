export type Cleanup = () => void;

const AUTOSCROLL_SPEED_PX_PER_SEC = 32;
const INTERACT_PAUSE_MS = 1200;
const CARD_GAP_PX = 24; // gap-6

/**
 * Continuous auto-scroll for the testimonials carousel. Pauses on hover,
 * focus-within, active pointer/wheel interaction, and prefers-reduced-motion.
 * There is no manual pause control — auto-scroll is always on when none of
 * those conditions apply.
 */
export function initTestimonialsCarousel(): Cleanup | void {
  const root = document.querySelector<HTMLElement>('[data-tst-root]');
  const viewport = document.querySelector<HTMLElement>('[data-tst-viewport]');
  const track = document.querySelector<HTMLElement>('[data-tst-track]');
  if (!root || !viewport || !track) return;

  const prevBtn = root.querySelector<HTMLButtonElement>('[data-tst-prev]');
  const nextBtn = root.querySelector<HTMLButtonElement>('[data-tst-next]');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let hoverPaused = false;
  let interactPaused = false;
  let interactTimer: number | undefined;
  let rafId = 0;
  let lastTs: number | null = null;

  const isPaused = () => hoverPaused || interactPaused || document.hidden || reduceMotion;

  const halfWidth = () => viewport.scrollWidth / 2;

  // Keep scrollLeft within the first copy so looping stays seamless in both
  // directions (manual prev can push us below 0).
  const normalize = () => {
    const half = halfWidth();
    if (half <= 0) return;
    if (viewport.scrollLeft >= half) viewport.scrollLeft -= half;
    else if (viewport.scrollLeft < 0) viewport.scrollLeft += half;
  };

  const step = (ts: number) => {
    if (lastTs === null) lastTs = ts;
    const dt = (ts - lastTs) / 1000;
    lastTs = ts;
    if (!isPaused()) {
      viewport.scrollLeft += AUTOSCROLL_SPEED_PX_PER_SEC * dt;
      normalize();
    }
    rafId = window.requestAnimationFrame(step);
  };

  // Pause briefly while the user actively scrolls/swipes, then resume.
  const nudgeInteract = () => {
    interactPaused = true;
    if (interactTimer) window.clearTimeout(interactTimer);
    interactTimer = window.setTimeout(() => {
      interactPaused = false;
      normalize();
    }, INTERACT_PAUSE_MS);
  };

  const cardStep = () => {
    const card = track.querySelector<HTMLElement>('.tst-card');
    return card ? card.offsetWidth + CARD_GAP_PX : viewport.clientWidth * 0.8;
  };

  const onPrev = () => {
    viewport.scrollBy({ left: -cardStep(), behavior: 'smooth' });
    nudgeInteract();
  };
  const onNext = () => {
    viewport.scrollBy({ left: cardStep(), behavior: 'smooth' });
    nudgeInteract();
  };

  const onEnter = () => (hoverPaused = true);
  const onLeave = () => (hoverPaused = false);
  const onFocusIn = () => (hoverPaused = true);
  const onFocusOut = () => {
    if (!root.contains(document.activeElement)) hoverPaused = false;
  };

  root.addEventListener('mouseenter', onEnter);
  root.addEventListener('mouseleave', onLeave);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);
  viewport.addEventListener('pointerdown', nudgeInteract);
  viewport.addEventListener('wheel', nudgeInteract, { passive: true });
  prevBtn?.addEventListener('click', onPrev);
  nextBtn?.addEventListener('click', onNext);

  if (!reduceMotion) {
    rafId = window.requestAnimationFrame(step);
  }

  return () => {
    window.cancelAnimationFrame(rafId);
    if (interactTimer) window.clearTimeout(interactTimer);
    root.removeEventListener('mouseenter', onEnter);
    root.removeEventListener('mouseleave', onLeave);
    root.removeEventListener('focusin', onFocusIn);
    root.removeEventListener('focusout', onFocusOut);
    viewport.removeEventListener('pointerdown', nudgeInteract);
    viewport.removeEventListener('wheel', nudgeInteract);
    prevBtn?.removeEventListener('click', onPrev);
    nextBtn?.removeEventListener('click', onNext);
  };
}
