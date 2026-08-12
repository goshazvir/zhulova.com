import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { initMetaPixel } from './metaPixel';

beforeEach(() => {
  delete window.fbq;
  document.head.querySelectorAll('script[data-meta-pixel]').forEach((el) => el.remove());
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.fbq;
  document.head.querySelectorAll('script[data-meta-pixel]').forEach((el) => el.remove());
});

describe('initMetaPixel — deferred init, only after consent (spec §6, §8, AC7/AC8)', () => {
  it('does nothing when PUBLIC_FB_PIXEL_ID is unset (no-op-safe)', () => {
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '');

    initMetaPixel();

    expect(window.fbq).toBeUndefined();
    expect(document.head.querySelector('script[data-meta-pixel]')).toBeNull();
  });

  it('defines window.fbq and injects the pixel script when PUBLIC_FB_PIXEL_ID is set', () => {
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '1234567890');

    initMetaPixel();

    expect(typeof window.fbq).toBe('function');
    const script = document.head.querySelector('script[data-meta-pixel]');
    expect(script).not.toBeNull();
    expect(script?.getAttribute('src')).toBe('https://connect.facebook.net/en_US/fbevents.js');
  });

  it('is idempotent — a second call does not inject a second script tag', () => {
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '1234567890');

    initMetaPixel();
    initMetaPixel();

    expect(document.head.querySelectorAll('script[data-meta-pixel]')).toHaveLength(1);
  });

  it('queues init/PageView calls immediately so they fire once the real script loads', () => {
    vi.stubEnv('PUBLIC_FB_PIXEL_ID', '1234567890');

    initMetaPixel();

    // The stub fbq queues calls in `fbq.queue` per Meta's own base code shape.
    const fbq = window.fbq as unknown as { queue: unknown[] };
    expect(fbq.queue.length).toBeGreaterThanOrEqual(2);
  });
});
