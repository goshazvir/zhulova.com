/**
 * Central analytics call site (spec §2 / §3). Components call `trackEvent()`
 * only — it fans out to GA4/Google Ads (`window.gtag`) and Meta Pixel
 * (`window.fbq`) so components never talk to a vendor SDK directly.
 *
 * No-op-safe: if a vendor's script never loaded (missing env var, see
 * `analyticsConfig.ts`), its global is undefined and that vendor is skipped
 * silently instead of throwing (AC1).
 */
import { getAnalyticsConfig } from './analyticsConfig';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

export interface CtaClickParams {
  cta_id: string;
  cta_text?: string;
  cta_location: string;
}

export interface PageViewParams {
  page_path: string;
  page_referrer?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

export interface FormSubmitParams {
  form_id: 'consultation' | 'quiz';
  form_location: string;
}

export interface FormSubmitErrorParams {
  form_id: 'consultation' | 'quiz';
  error_type?: string;
}

export interface PromoModalShownParams {
  trigger_type: 'auto' | 'manual';
  delay_ms?: number;
}

export interface PromoModalClickParams {
  modal_variant: string;
}

export interface PromoModalDismissParams {
  dismiss_method: string;
}

export interface ExternalLinkClickParams {
  link_domain: string;
  link_url: string;
}

export interface CourseCheckoutClickParams {
  course_id: string;
  price?: string;
}

export interface ConsultationLeadParams {
  value?: number;
  currency?: string;
}

export interface PurchaseParams {
  transaction_id: string;
  value: number;
  currency: string;
  items?: string;
}

export interface AnalyticsEventMap {
  cta_click: CtaClickParams;
  page_view: PageViewParams;
  form_submit: FormSubmitParams;
  form_submit_error: FormSubmitErrorParams;
  promo_modal_shown: PromoModalShownParams;
  promo_modal_click: PromoModalClickParams;
  promo_modal_dismiss: PromoModalDismissParams;
  external_link_click: ExternalLinkClickParams;
  course_checkout_click: CourseCheckoutClickParams;
  consultation_lead: ConsultationLeadParams;
  purchase: PurchaseParams;
}

export type AnalyticsEventName = keyof AnalyticsEventMap;

/** Events that also fire a Google Ads conversion (spec §5, §12 Q1 open — both fire until the founder picks one). */
const CONVERSION_EVENTS: ReadonlySet<AnalyticsEventName> = new Set(['consultation_lead', 'purchase']);

/** Our event name → Meta standard event (spec §6). Unmapped events use `trackCustom`. */
const META_STANDARD_EVENT: Partial<Record<AnalyticsEventName, string>> = {
  consultation_lead: 'Lead',
  purchase: 'Purchase',
};

function stripUndefined<T extends Record<string, unknown>>(params: T): Partial<T> {
  const result: Partial<T> = {};
  for (const key of Object.keys(params) as (keyof T)[]) {
    if (params[key] !== undefined) {
      result[key] = params[key];
    }
  }
  return result;
}

function fireGtagEvent(name: AnalyticsEventName, params: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}

function fireGoogleAdsConversion(name: AnalyticsEventName, params: Record<string, unknown>): void {
  if (!CONVERSION_EVENTS.has(name)) return;
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

  const { googleAdsId, googleAdsConversionLabel } = getAnalyticsConfig();
  if (!googleAdsId || !googleAdsConversionLabel) return;

  window.gtag('event', 'conversion', {
    send_to: `${googleAdsId}/${googleAdsConversionLabel}`,
    ...('value' in params ? { value: params.value } : {}),
    ...('currency' in params ? { currency: params.currency } : {}),
  });
}

function fireMetaPixelEvent(name: AnalyticsEventName, params: Record<string, unknown>): void {
  if (typeof window === 'undefined' || typeof window.fbq !== 'function') return;

  // Meta's PageView is already tracked automatically by `fbq('init', ...)` —
  // page_view only maps to the ViewContent standard event on course pages,
  // it never double-fires a generic pageview (spec §6).
  if (name === 'page_view') {
    if (typeof params.page_path === 'string' && params.page_path.startsWith('/courses')) {
      window.fbq('track', 'ViewContent', { content_name: params.page_path });
    }
    return;
  }

  const standardEvent = META_STANDARD_EVENT[name];
  if (standardEvent) {
    window.fbq('track', standardEvent, params);
  } else {
    window.fbq('trackCustom', name, params);
  }
}

/** The single call site every component uses to report an analytics event. */
export function trackEvent<K extends AnalyticsEventName>(name: K, params: AnalyticsEventMap[K]): void {
  const cleanParams = stripUndefined(params as unknown as Record<string, unknown>);
  fireGtagEvent(name, cleanParams);
  fireGoogleAdsConversion(name, cleanParams);
  fireMetaPixelEvent(name, cleanParams);
}
