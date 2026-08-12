import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initTestimonialsCarousel } from './testimonialsCarousel';

function setMatchMedia(reduceMotion: boolean) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(prefers-reduced-motion: reduce)' ? reduceMotion : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as unknown as typeof window.matchMedia;
}

function buildDom() {
  document.body.innerHTML = `
    <div data-tst-root>
      <div class="flex items-center gap-3 ml-auto">
        <button type="button" data-tst-prev aria-label="Попередній відгук"></button>
        <button type="button" data-tst-next aria-label="Наступний відгук"></button>
      </div>
      <div data-tst-viewport tabindex="0">
        <div data-tst-track>
          <div class="tst-card"></div>
          <div class="tst-card"></div>
        </div>
      </div>
    </div>
  `;

  const viewport = document.querySelector<HTMLElement>('[data-tst-viewport]')!;
  const track = document.querySelector<HTMLElement>('[data-tst-track]')!;
  const card = track.querySelector<HTMLElement>('.tst-card')!;

  Object.defineProperty(viewport, 'scrollWidth', { value: 1200, configurable: true });
  Object.defineProperty(viewport, 'clientWidth', { value: 600, configurable: true });
  Object.defineProperty(card, 'offsetWidth', { value: 300, configurable: true });
  viewport.scrollBy = vi.fn();

  return { viewport, track, card };
}

/** Captures the pending rAF callback so tests can advance frames manually, honoring cancellation. */
function mockRaf() {
  const callbacks = new Map<number, FrameRequestCallback>();
  let nextId = 1;
  let lastId: number | null = null;
  const raf = vi.fn((cb: FrameRequestCallback) => {
    const id = nextId++;
    callbacks.set(id, cb);
    lastId = id;
    return id;
  });
  const caf = vi.fn((id: number) => {
    callbacks.delete(id);
  });
  window.requestAnimationFrame = raf as unknown as typeof window.requestAnimationFrame;
  window.cancelAnimationFrame = caf as unknown as typeof window.cancelAnimationFrame;
  return {
    raf,
    caf,
    fire(ts: number) {
      if (lastId === null) return;
      const cb = callbacks.get(lastId);
      callbacks.delete(lastId);
      lastId = null;
      cb?.(ts);
    },
  };
}

describe('initTestimonialsCarousel', () => {
  let cleanup: (() => void) | void;

  beforeEach(() => {
    document.body.innerHTML = '';
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    setMatchMedia(false);
  });

  afterEach(() => {
    cleanup?.();
    cleanup = undefined;
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('does nothing when the root/viewport/track are missing', () => {
    document.body.innerHTML = '<div data-tst-root></div>';
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();
    expect(cleanup).toBeUndefined();
    expect(raf.raf).not.toHaveBeenCalled();
  });

  it('starts the auto-scroll animation loop when motion is not reduced', () => {
    const { viewport } = buildDom();
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    expect(raf.raf).toHaveBeenCalledTimes(1);
    viewport.scrollLeft = 0;
    raf.fire(0);
    raf.fire(1000); // 1s elapsed → 32px/s

    expect(viewport.scrollLeft).toBeCloseTo(32, 0);
  });

  it('does not start the animation loop when prefers-reduced-motion is set', () => {
    setMatchMedia(true);
    buildDom();
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    expect(raf.raf).not.toHaveBeenCalled();
  });

  it('pauses on hover and resumes on mouseleave', () => {
    const { viewport } = buildDom();
    const root = document.querySelector<HTMLElement>('[data-tst-root]')!;
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    viewport.scrollLeft = 0;
    raf.fire(0);

    root.dispatchEvent(new MouseEvent('mouseenter'));
    raf.fire(1000); // paused — no movement
    expect(viewport.scrollLeft).toBe(0);

    root.dispatchEvent(new MouseEvent('mouseleave'));
    raf.fire(2000); // resumes — 1s worth of movement
    expect(viewport.scrollLeft).toBeCloseTo(32, 0);
  });

  it('pauses while focus is inside the root and resumes once focus leaves', () => {
    const { viewport } = buildDom();
    const root = document.querySelector<HTMLElement>('[data-tst-root]')!;
    const nextBtn = root.querySelector<HTMLElement>('[data-tst-next]')!;
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    viewport.scrollLeft = 0;
    raf.fire(0);

    root.dispatchEvent(new FocusEvent('focusin'));
    raf.fire(1000);
    expect(viewport.scrollLeft).toBe(0);

    nextBtn.focus();
    root.dispatchEvent(new FocusEvent('focusout'));
    raf.fire(2000);
    expect(viewport.scrollLeft).toBe(0); // still focused inside root

    nextBtn.blur();
    root.dispatchEvent(new FocusEvent('focusout'));
    raf.fire(3000);
    expect(viewport.scrollLeft).toBeCloseTo(32, 0);
  });

  it('pauses briefly on pointerdown, then resumes after the interaction timeout', () => {
    vi.useFakeTimers();
    const { viewport } = buildDom();
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    viewport.scrollLeft = 0;
    raf.fire(0);

    viewport.dispatchEvent(new Event('pointerdown'));
    raf.fire(1000);
    expect(viewport.scrollLeft).toBe(0);

    vi.advanceTimersByTime(1200);
    raf.fire(2000); // 1s of movement after resuming (dt since last fire at ts=1000)
    expect(viewport.scrollLeft).toBeCloseTo(32, 0);
  });

  it('pauses while the document is hidden', () => {
    const { viewport } = buildDom();
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    viewport.scrollLeft = 0;
    raf.fire(0);
    raf.fire(1000);
    expect(viewport.scrollLeft).toBe(0);
  });

  it('wraps scrollLeft back into the first pass once it crosses the halfway point', () => {
    const { viewport } = buildDom();
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    viewport.scrollLeft = 599; // half width is 600 (scrollWidth 1200 / 2)
    raf.fire(0);
    raf.fire(1000); // +32px → 631, past the 600 halfway mark

    expect(viewport.scrollLeft).toBeCloseTo(31, 0);
  });

  it('scrolls forward by one card width + gap on next click', () => {
    const { viewport } = buildDom();
    mockRaf();
    cleanup = initTestimonialsCarousel();

    document.querySelector<HTMLElement>('[data-tst-next]')!.click();

    expect(viewport.scrollBy).toHaveBeenCalledWith({ left: 324, behavior: 'smooth' });
  });

  it('scrolls backward by one card width + gap on prev click', () => {
    const { viewport } = buildDom();
    mockRaf();
    cleanup = initTestimonialsCarousel();

    document.querySelector<HTMLElement>('[data-tst-prev]')!.click();

    expect(viewport.scrollBy).toHaveBeenCalledWith({ left: -324, behavior: 'smooth' });
  });

  it('does not query for or wire up a pause/play toggle', () => {
    const { viewport } = buildDom();
    // A stray toggle button should be completely ignored by the module —
    // there is no more manual pause control.
    const stray = document.createElement('button');
    stray.setAttribute('data-tst-toggle', '');
    document.querySelector('[data-tst-root]')!.prepend(stray);
    const clickSpy = vi.fn();
    stray.addEventListener('click', clickSpy);

    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();
    viewport.scrollLeft = 0;
    raf.fire(0);
    raf.fire(1000);

    stray.click();
    expect(clickSpy).toHaveBeenCalledTimes(1); // only the test's own listener fired
    expect(viewport.scrollLeft).toBeCloseTo(32, 0); // still auto-scrolling normally
  });

  it('returns a cleanup function that cancels the frame and detaches listeners', () => {
    const { viewport } = buildDom();
    const root = document.querySelector<HTMLElement>('[data-tst-root]')!;
    const removeSpy = vi.spyOn(root, 'removeEventListener');
    const raf = mockRaf();
    cleanup = initTestimonialsCarousel();

    raf.fire(0);
    cleanup?.();
    cleanup = undefined;

    expect(raf.caf).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalledWith('mouseenter', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('focusin', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('focusout', expect.any(Function));

    // Firing whatever frame was scheduled right before cleanup should no longer move anything.
    viewport.scrollLeft = 0;
    raf.fire(5000);
    expect(viewport.scrollLeft).toBe(0);
  });
});
