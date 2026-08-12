# Analytics — GA4 + Google Ads + Meta Pixel + Microsoft Clarity

Implementation of GEO-38, per the spec at [`docs/analytics/implementation-spec.md`](../analytics/implementation-spec.md)
(BA deliverable for GEO-37). This doc covers what actually shipped, how to use it, and
where the implementation deliberately deviates from or defers parts of the spec.

## Usage

Every component fires analytics through one call:

```ts
import { trackEvent } from '@lib/analytics';

trackEvent('cta_click', { cta_id: 'hero-cta-button', cta_text: 'Записатись', cta_location: 'hero' });
```

`trackEvent` fans out to `window.gtag` (GA4 + Google Ads conversion) and `window.fbq` (Meta
Pixel) internally — components never call a vendor SDK directly. Every vendor call is
no-op-safe: if a vendor's script never loaded (its `PUBLIC_*` env var is unset, see
`src/lib/analyticsConfig.ts`), that vendor's global is `undefined` and `trackEvent` silently
skips it. Adding a new event means adding an entry to `AnalyticsEventMap` in
`src/lib/analytics.ts` — the params type flows through to every `trackEvent()` call site.

The full event taxonomy (11 events, params, trigger) is spec §3. Wiring:

| Event | Where it fires |
|---|---|
| `cta_click` | `CtaButton.astro` (`analyticsCta` prop) + inline scripts on the 6 consultation-CTA buttons (Hero, MotivationalQuote, Questions, CaseStudies, Footer, contacts page) |
| `course_checkout_click` | `CtaButton.astro` (`analyticsCheckout` prop) — all 4 Opora checkout CTAs (hero, buy section, journey section, sticky bar) |
| `page_view` | `Analytics.astro`'s bootstrap script, once per full page load |
| `form_submit` / `form_submit_error` | `ConsultationModal/index.tsx`, `QuizApp.tsx` |
| `consultation_lead` | `ConsultationModal/index.tsx`, alongside `form_submit`, on submit success |
| `promo_modal_shown` / `_click` / `_dismiss` | `PromoModal/index.tsx` (auto-trigger) + `giftCta.ts` (manual open) |
| `external_link_click` | Footer social links (`data-external-link` + shared script) + `MobileMenu`'s social links |
| `purchase` | Built (`src/lib/purchaseDedup.ts`) but **not wired to a page** — see Deviations below |

## Consent (spec §8)

`src/lib/consent.ts` holds Consent Mode v2 state. Defaults (`DEFAULT_CONSENT_STATE`):
`ad_storage` / `ad_user_data` / `ad_personalization` denied, `analytics_storage` granted —
this is the spec's proposed default for the still-open founder question in spec §12.4
(EU/EEA/UK ad traffic). If the founder wants stricter default-denied-for-everything, flip
`analytics_storage` to `'denied'` in `consent.ts`; nothing else changes.

`applyConsent('accepted' | 'necessary')` updates `gtag('consent', 'update', ...)`, calls
`window.clarity('consent')`, and initializes Meta Pixel (`initMetaPixel()`) — but only on
`'accepted'`. `createConsentStorage()` persists the choice to `localStorage` (pattern matches
`promoTrigger.ts`'s injectable-storage/in-memory-fallback shape).

## Deviations from the spec (flagged for Code Critic / founder awareness)

1. **No Partytown.** Spec §2 asks for GA4/Ads/Meta scripts to run off the main thread via
   `@astrojs/partytown`. Skipped for this pass: it's a new build integration whose
   correctness (worker sandboxing, `forward` config for `gtag`/`fbq`) can only really be
   verified with a live browser run, which is QA's territory, not unit tests. Shipping it
   unverified risked a silent GA4/Meta breakage that unit tests (which mock
   `window.gtag`/`window.fbq` directly) would never catch. Flagged as a fast-follow once QA
   can verify pixel firing in a real browser.
2. **Consent banner UI not built yet.** Per the issue's explicit instruction, Designer
   review of banner placement/style was requested *before* building it — see the GEO-38
   comment thread. The underlying `consent.ts` state module is fully built and tested;
   only the visual banner component is pending.
3. **`purchase` not wired to any page.** The Opora checkout redirects through WayForPay,
   and the confirmation page (`success.astro`) receives no order data client-side — spec
   §13 explicitly calls this out as depending on checkout architecture. `trackPurchaseOnce()`
   in `purchaseDedup.ts` exists and is tested (AC9: fires once per `transaction_id`, dedupes
   on refresh via `sessionStorage`) so it's ready the moment a real confirmation page exists.
4. **Google Ads conversion fires on both `consultation_lead` and `purchase`.** Spec §12 Q1
   (primary conversion goal) is an open founder question. Firing both is the safe default —
   restricting to one is a one-line change to `CONVERSION_EVENTS` in `analytics.ts` once
   the founder answers.
5. **`promo_modal_dismiss`'s `dismiss_method` is always `'modal_close'`.** The shared
   `design-system/Modal` component routes its X button, overlay click, and Escape key all
   through the same `onClose` callback — it doesn't discriminate which one fired. Spec §3's
   `close_button`/`overlay`/`esc` enum would require a Modal API change with a wider blast
   radius (also used by `ConsultationModal`); not attempted here to avoid scope creep.

## Env vars

See `.env.example` — `PUBLIC_GA4_MEASUREMENT_ID`, `PUBLIC_GOOGLE_ADS_ID`,
`PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `PUBLIC_FB_PIXEL_ID`, `PUBLIC_CLARITY_PROJECT_ID`. All
optional; real values are being collected from the founder via GEO-37.
