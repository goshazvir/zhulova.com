import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent } from './analytics';

beforeEach(() => {
  delete window.gtag;
  delete window.fbq;
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.gtag;
  delete window.fbq;
});

describe('trackEvent — no-op safety (AC1, spec §2)', () => {
  it('does not throw when window.gtag and window.fbq are both undefined', () => {
    expect(() => trackEvent('cta_click', { cta_id: 'x', cta_location: 'hero' })).not.toThrow();
  });
});

describe('trackEvent — GA4 fan-out (AC2)', () => {
  it('calls window.gtag("event", name, params) exactly once when gtag is present', () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('cta_click', {
      cta_id: 'consultation_hero',
      cta_text: 'Записатись на консультацію',
      cta_location: 'hero',
    });

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', {
      cta_id: 'consultation_hero',
      cta_text: 'Записатись на консультацію',
      cta_location: 'hero',
    });
  });

  it('omits undefined params from the gtag payload', () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('form_submit_error', { form_id: 'consultation', error_type: undefined });

    expect(gtag).toHaveBeenCalledWith('event', 'form_submit_error', { form_id: 'consultation' });
  });

  it('does nothing when window.gtag is not a function', () => {
    expect(() => trackEvent('cta_click', { cta_id: 'x', cta_location: 'hero' })).not.toThrow();
  });
});

describe('trackEvent — Meta Pixel fan-out (spec §6)', () => {
  it('fires fbq("track", "Lead", ...) for consultation_lead', () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    trackEvent('consultation_lead', { currency: 'UAH' });

    expect(fbq).toHaveBeenCalledWith('track', 'Lead', { currency: 'UAH' });
  });

  it('fires fbq("track", "Purchase", ...) for purchase', () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    trackEvent('purchase', { transaction_id: 'tx_1', value: 9, currency: 'EUR' });

    expect(fbq).toHaveBeenCalledWith('track', 'Purchase', {
      transaction_id: 'tx_1',
      value: 9,
      currency: 'EUR',
    });
  });

  it('fires fbq("track", "ViewContent", ...) for a page_view on a /courses path', () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    trackEvent('page_view', { page_path: '/courses/opora' });

    expect(fbq).toHaveBeenCalledWith('track', 'ViewContent', { content_name: '/courses/opora' });
  });

  it('does not fire ViewContent for a page_view outside /courses', () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    trackEvent('page_view', { page_path: '/' });

    expect(fbq).not.toHaveBeenCalled();
  });

  it('falls back to fbq("trackCustom", name, params) for events with no standard mapping', () => {
    const fbq = vi.fn();
    window.fbq = fbq;

    trackEvent('promo_modal_shown', { trigger_type: 'auto', delay_ms: 12000 });

    expect(fbq).toHaveBeenCalledWith('trackCustom', 'promo_modal_shown', {
      trigger_type: 'auto',
      delay_ms: 12000,
    });
  });

  it('does nothing when window.fbq is not a function', () => {
    expect(() => trackEvent('consultation_lead', {})).not.toThrow();
  });
});

describe('trackEvent — Google Ads conversion (spec §5, AC3)', () => {
  it('fires an additional gtag("event", "conversion", ...) for consultation_lead when Ads IDs are configured', () => {
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_CONVERSION_LABEL', 'AbCdEfGhIj');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('consultation_lead', { value: 50, currency: 'EUR' });

    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-123456789/AbCdEfGhIj',
      value: 50,
      currency: 'EUR',
    });
  });

  it('fires an additional gtag("event", "conversion", ...) for purchase when Ads IDs are configured', () => {
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_CONVERSION_LABEL', 'AbCdEfGhIj');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('purchase', { transaction_id: 'tx_1', value: 9, currency: 'EUR' });

    expect(gtag).toHaveBeenCalledWith('event', 'conversion', {
      send_to: 'AW-123456789/AbCdEfGhIj',
      value: 9,
      currency: 'EUR',
    });
  });

  it('does not fire a conversion event for events outside the conversion set (e.g. cta_click)', () => {
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', 'AW-123456789');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_CONVERSION_LABEL', 'AbCdEfGhIj');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('cta_click', { cta_id: 'x', cta_location: 'hero' });

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'cta_click', { cta_id: 'x', cta_location: 'hero' });
  });

  it('does not fire a conversion event when the Ads ID or label is missing', () => {
    vi.stubEnv('PUBLIC_GOOGLE_ADS_ID', '');
    vi.stubEnv('PUBLIC_GOOGLE_ADS_CONVERSION_LABEL', '');
    const gtag = vi.fn();
    window.gtag = gtag;

    trackEvent('consultation_lead', { currency: 'UAH' });

    expect(gtag).toHaveBeenCalledOnce();
    expect(gtag).toHaveBeenCalledWith('event', 'consultation_lead', { currency: 'UAH' });
  });
});
