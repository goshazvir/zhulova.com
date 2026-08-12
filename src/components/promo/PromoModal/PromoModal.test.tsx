import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import PromoModal from './index';
import { useUIStore } from '../../../stores/uiStore';
import { promoConfig } from '../../../config/promo';
import type { PromoRecord } from '../promoTrigger';

vi.mock('@vercel/analytics', () => ({ track: vi.fn() }));
import { track } from '@vercel/analytics';

const BOT_URL = 'https://t.me/zhulova_gift_bot';
const DAY_MS = 24 * 60 * 60 * 1000;

function storedRecord(): PromoRecord | null {
  const raw = localStorage.getItem(promoConfig.storageKey);
  return raw ? (JSON.parse(raw) as PromoRecord) : null;
}

function setStoredRecord(record: PromoRecord): void {
  localStorage.setItem(promoConfig.storageKey, JSON.stringify(record));
}

function advance(ms: number): void {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

/** Simulate the visitor scrolling to the given depth (0..1) of the scrollable height. */
function scrollToDepth(depth: number): void {
  const scrollHeight = 2000;
  const innerHeight = 800;
  Object.defineProperty(document.documentElement, 'scrollHeight', {
    value: scrollHeight,
    configurable: true,
  });
  Object.defineProperty(window, 'innerHeight', { value: innerHeight, configurable: true });
  Object.defineProperty(window, 'scrollY', {
    value: depth * (scrollHeight - innerHeight),
    configurable: true,
  });
  act(() => {
    window.dispatchEvent(new Event('scroll'));
  });
}

describe('PromoModal island', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    window.history.replaceState(null, '', '/');
    scrollToDepth(0);
    useUIStore.setState({
      isPromoModalOpen: false,
      isConsultationModalOpen: false,
      isMobileMenuOpen: false,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('renders nothing before the trigger fires (zero CLS)', () => {
    const { container } = render(<PromoModal botUrl={BOT_URL} />);
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('does not open before the 12s timer', () => {
    render(<PromoModal botUrl={BOT_URL} />);
    advance(11_000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('opens after 12s, tracks promo_gift_shown and writes a shown record', () => {
    render(<PromoModal botUrl={BOT_URL} />);
    advance(12_000);

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Перші 2 уроки — у подарунок')).toBeInTheDocument();
    expect(track).toHaveBeenCalledWith('promo_gift_shown');
    expect(storedRecord()).toMatchObject({ status: 'shown', shownCount: 1 });
  });

  it('opens at 6s when the visitor scrolled at least 50%', () => {
    render(<PromoModal botUrl={BOT_URL} />);
    scrollToDepth(0.6);
    advance(6_000);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('does not open at 6s when scroll depth is below 50%', () => {
    render(<PromoModal botUrl={BOT_URL} />);
    scrollToDepth(0.3);
    advance(6_000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('never opens when the stored record is not eligible', () => {
    setStoredRecord({ status: 'dismissed', at: Date.now() - DAY_MS, shownCount: 1 });
    render(<PromoModal botUrl={BOT_URL} />);
    advance(30_000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('never opens on an excluded pathname (runtime re-check for View Transitions)', () => {
    window.history.replaceState(null, '', '/quiz/opora');
    render(<PromoModal botUrl={BOT_URL} />);
    advance(30_000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('defers while the consultation modal is open, then fires after it closes', () => {
    useUIStore.setState({ isConsultationModalOpen: true });
    render(<PromoModal botUrl={BOT_URL} />);
    advance(15_000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      useUIStore.setState({ isConsultationModalOpen: false });
    });
    advance(3_000);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('defers while the mobile menu is open', () => {
    useUIStore.setState({ isMobileMenuOpen: true });
    render(<PromoModal botUrl={BOT_URL} />);
    advance(15_000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('defers while the visitor is typing in a text field', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    render(<PromoModal botUrl={BOT_URL} />);
    advance(15_000);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    act(() => {
      input.blur();
    });
    advance(3_000);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    input.remove();
  });

  describe('once open', () => {
    function open(): void {
      render(<PromoModal botUrl={BOT_URL} />);
      advance(12_000);
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      vi.mocked(track).mockClear();
    }

    it('renders the CTA as a link to the bot URL opening in a new tab', () => {
      open();
      const cta = screen.getByRole('link', { name: /забрати уроки в telegram/i });
      expect(cta).toHaveAttribute('href', BOT_URL);
      expect(cta).toHaveAttribute('target', '_blank');
      expect(cta).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('CTA click tracks promo_gift_cta_click, writes converted and closes', () => {
      open();
      const cta = screen.getByRole('link', { name: /забрати уроки в telegram/i });
      act(() => {
        cta.click();
      });

      expect(track).toHaveBeenCalledWith('promo_gift_cta_click');
      expect(storedRecord()).toMatchObject({ status: 'converted', shownCount: 1 });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('text dismiss tracks promo_gift_dismissed, writes dismissed and closes', () => {
      open();
      act(() => {
        screen.getByRole('button', { name: /дякую, не зараз/i }).click();
      });

      expect(track).toHaveBeenCalledWith('promo_gift_dismissed');
      expect(storedRecord()).toMatchObject({ status: 'dismissed', shownCount: 1 });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('the close X also counts as a dismissal', () => {
      open();
      act(() => {
        screen.getByLabelText(/закрити/i).click();
      });

      expect(track).toHaveBeenCalledWith('promo_gift_dismissed');
      expect(storedRecord()).toMatchObject({ status: 'dismissed' });
    });

    it('does not reappear after dismissal within the same pageview', () => {
      open();
      act(() => {
        screen.getByRole('button', { name: /дякую, не зараз/i }).click();
      });
      advance(60_000);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
