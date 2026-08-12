import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './uiStore';

describe('uiStore — promo modal state', () => {
  beforeEach(() => {
    useUIStore.setState({
      isPromoModalOpen: false,
      isConsultationModalOpen: false,
      isMobileMenuOpen: false,
    });
  });

  it('is closed initially', () => {
    expect(useUIStore.getState().isPromoModalOpen).toBe(false);
  });

  it('openPromoModal opens it', () => {
    useUIStore.getState().openPromoModal();
    expect(useUIStore.getState().isPromoModalOpen).toBe(true);
  });

  it('closePromoModal closes it', () => {
    useUIStore.getState().openPromoModal();
    useUIStore.getState().closePromoModal();
    expect(useUIStore.getState().isPromoModalOpen).toBe(false);
  });

  it('does not touch the consultation modal or mobile menu state', () => {
    useUIStore.getState().openPromoModal();
    expect(useUIStore.getState().isConsultationModalOpen).toBe(false);
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });
});
