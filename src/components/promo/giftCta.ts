import { track } from '@vercel/analytics';
import { useUIStore } from '../../stores/uiStore';
import { isPathExcluded } from './promoTrigger';

/**
 * Persistent gift CTA (header/footer/mobile menu) — GEO-31.
 * These CTAs reuse the modal's own fail-safe/exclusion gates and its bare
 * openPromoModal() setter, which already has no frequency-cap check
 * (see promo-modal-persistent-access.md §2) — an explicit click always opens.
 */

/** Whether a persistent gift CTA should render on this page. */
export function shouldShowGiftCta(pathname: string, giftBotUrl: string | undefined): boolean {
  return Boolean(giftBotUrl) && !isPathExcluded(pathname);
}

/**
 * Manual open handler shared by the header, footer and mobile-menu CTAs.
 * Closes the consultation modal first since both are single-focus overlays.
 */
export function openGiftPromoModal(): void {
  const { isConsultationModalOpen, closeConsultationModal, openPromoModal } = useUIStore.getState();
  if (isConsultationModalOpen) {
    closeConsultationModal();
  }
  track('promo_gift_manual_open');
  openPromoModal();
}
