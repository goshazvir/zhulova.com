import { useEffect, useRef } from 'react';
import { track } from '@vercel/analytics';
import Modal from '../../../design-system/Modal';
import Button from '../../../design-system/Button';
import { Text } from '../../../design-system/Typography';
import { useUIStore } from '../../../stores/uiStore';
import { prefersReducedMotion } from '../../quiz/motion';
import {
  createPromoStorage,
  isEligible,
  isPathExcluded,
  markConverted,
  markDismissed,
  markShown,
  shouldFire,
  type PromoStorage,
} from '../promoTrigger';

/**
 * Gift promo modal island — spec: docs/architecture/promo-modal.md.
 * Renders null until the trigger fires (zero CLS); until then its only
 * activity is one interval and a passive scroll listener.
 */

// One poller serves both the trigger timer and the ~2s deferral retry (§1).
const POLL_INTERVAL_MS = 1_000;

interface PromoModalProps {
  botUrl: string;
}

function isTypingTarget(element: Element | null): boolean {
  if (!element) return false;
  const tag = element.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    (element as HTMLElement).isContentEditable === true
  );
}

/** Fraction of the scrollable height already scrolled; 0 when the page does not scroll. */
function getScrollDepth(): number {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (scrollable <= 0) return 0;
  return Math.min(1, Math.max(0, window.scrollY / scrollable));
}

export default function PromoModal({ botUrl }: PromoModalProps) {
  const isOpen = useUIStore((state) => state.isPromoModalOpen);
  const openPromoModal = useUIStore((state) => state.openPromoModal);
  const closePromoModal = useUIStore((state) => state.closePromoModal);
  // Lazy init: keep a single storage instance without re-running the factory on every render
  const storageRef = useRef<PromoStorage | null>(null);
  if (storageRef.current === null) storageRef.current = createPromoStorage();
  const storage = storageRef.current;

  useEffect(() => {
    if (!isEligible(storage.read(), Date.now())) return;

    const startedAt = Date.now();
    let maxScrollDepth = getScrollDepth();
    const onScroll = () => {
      maxScrollDepth = Math.max(maxScrollDepth, getScrollDepth());
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const stop = () => {
      clearInterval(interval);
      window.removeEventListener('scroll', onScroll);
    };

    const interval = setInterval(() => {
      if (!shouldFire(Date.now() - startedAt, maxScrollDepth)) return;

      // Fire-time guards. Deferrable conditions retry on the next tick (§1);
      // the pathname re-check covers View Transitions navigation (§3).
      if (isPathExcluded(window.location.pathname)) return;
      const { isConsultationModalOpen, isMobileMenuOpen } = useUIStore.getState();
      if (isConsultationModalOpen || isMobileMenuOpen || isTypingTarget(document.activeElement)) {
        return;
      }
      if (!isEligible(storage.read(), Date.now())) {
        stop();
        return;
      }

      storage.write(markShown(storage.read(), Date.now()));
      track('promo_gift_shown');
      openPromoModal();
      stop();
    }, POLL_INTERVAL_MS);

    return stop;
  }, [openPromoModal, storage]);

  const handleDismiss = () => {
    storage.write(markDismissed(storage.read(), Date.now()));
    track('promo_gift_dismissed');
    closePromoModal();
  };

  const handleCtaClick = () => {
    storage.write(markConverted(storage.read(), Date.now()));
    track('promo_gift_cta_click');
    closePromoModal();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleDismiss}
      title="Перші 2 уроки — у подарунок"
      animateEntry={!prefersReducedMotion()}
    >
      <Text size="md">
        Спробуй курс «Опора на себе» ще до покупки: перші два уроки — безкоштовно, у Telegram.
      </Text>
      <Text size="sm" tone="muted" className="mt-2">
        Без оплати й зобов&apos;язань — просто забери і подивись, чи відгукується.
      </Text>
      <Button
        href={botUrl}
        target="_blank"
        rel="noopener noreferrer"
        variant="primary"
        size="lg"
        className="w-full mt-6"
        onClick={handleCtaClick}
      >
        Забрати уроки в Telegram
      </Button>
      <button
        type="button"
        onClick={handleDismiss}
        className="block mx-auto mt-3 px-4 py-3 text-sm text-navy-500 hover:text-navy-700 underline underline-offset-4 focus:outline-none focus:ring-2 focus:ring-gold-400/50 rounded"
      >
        Дякую, не зараз
      </button>
    </Modal>
  );
}
