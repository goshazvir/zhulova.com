/**
 * Meta (Facebook) Pixel loader — spec §6. Deliberately NOT auto-loaded by
 * `Analytics.astro`: init is deferred until the consent banner is accepted
 * (GDPR requirement for EU visitors, spec §8). Call `initMetaPixel()` from
 * `consent.ts`'s `applyConsent('accepted')`.
 */
import { getAnalyticsConfig } from './analyticsConfig';

interface FbqStub {
  (...args: unknown[]): void;
  queue: unknown[][];
}

const PIXEL_SCRIPT_SRC = 'https://connect.facebook.net/en_US/fbevents.js';

/** Idempotent: safe to call multiple times, only initializes once. */
export function initMetaPixel(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (typeof window.fbq === 'function') return;

  const { fbPixelId } = getAnalyticsConfig();
  if (!fbPixelId) return;

  const stub = ((...args: unknown[]) => {
    stub.queue.push(args);
  }) as FbqStub;
  stub.queue = [];
  window.fbq = stub;

  const script = document.createElement('script');
  script.async = true;
  script.src = PIXEL_SCRIPT_SRC;
  script.setAttribute('data-meta-pixel', 'true');
  document.head.appendChild(script);

  window.fbq('init', fbPixelId);
  window.fbq('track', 'PageView');
}
