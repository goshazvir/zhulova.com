import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useUIStore } from '../../stores/uiStore';

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }));
import { track } from '@vercel/analytics';
import { shouldShowGiftCta, openGiftPromoModal } from './giftCta';

describe('shouldShowGiftCta — env-var fail-safe + isPathExcluded gating', () => {
  it('is false when giftBotUrl is unset', () => {
    expect(shouldShowGiftCta('/', undefined)).toBe(false);
  });

  it('is false when giftBotUrl is an empty string', () => {
    expect(shouldShowGiftCta('/', '')).toBe(false);
  });

  it.each(['/', '/courses', '/contacts'])(
    'is true on %s when giftBotUrl is set',
    (path) => {
      expect(shouldShowGiftCta(path, 'https://t.me/zhulova_gift_bot')).toBe(true);
    }
  );

  it.each([
    '/quiz',
    '/quiz/opora',
    '/courses/opora',
    '/courses/opora/success',
    '/privacy-policy',
    '/terms',
    '/oferta',
    '/404',
  ])('is false on excluded path %s even when giftBotUrl is set', (path) => {
    expect(shouldShowGiftCta(path, 'https://t.me/zhulova_gift_bot')).toBe(false);
  });
});

describe('openGiftPromoModal — manual open handler for persistent CTAs', () => {
  beforeEach(() => {
    useUIStore.setState({
      isPromoModalOpen: false,
      isConsultationModalOpen: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('opens the promo modal', () => {
    openGiftPromoModal();
    expect(useUIStore.getState().isPromoModalOpen).toBe(true);
  });

  it('tracks promo_gift_manual_open, distinct from the auto-trigger event', () => {
    openGiftPromoModal();
    expect(track).toHaveBeenCalledWith('promo_gift_manual_open');
    expect(track).not.toHaveBeenCalledWith('promo_gift_shown');
  });

  it('closes the consultation modal first when it is open, then opens the promo modal', () => {
    useUIStore.setState({ isConsultationModalOpen: true });
    openGiftPromoModal();
    expect(useUIStore.getState().isConsultationModalOpen).toBe(false);
    expect(useUIStore.getState().isPromoModalOpen).toBe(true);
  });

  it('does not touch the consultation modal when it is already closed', () => {
    openGiftPromoModal();
    expect(useUIStore.getState().isConsultationModalOpen).toBe(false);
  });

  it('bypasses the frequency cap unconditionally — no cap state is read', () => {
    // No localStorage record is seeded/consulted; the handler always opens.
    openGiftPromoModal();
    expect(useUIStore.getState().isPromoModalOpen).toBe(true);
  });

  it('is idempotent: clicking again while already open does not throw and stays open', () => {
    openGiftPromoModal();
    expect(() => openGiftPromoModal()).not.toThrow();
    expect(useUIStore.getState().isPromoModalOpen).toBe(true);
  });
});
