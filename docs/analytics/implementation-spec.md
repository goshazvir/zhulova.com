# Analytics Implementation Spec — zhulova.com
*BA deliverable for GEO-37 (Phase 1: Research + Decision). Companion implementation task: GEO-38.*

## 1. Decision Summary

| Area | Decision | Why |
|---|---|---|
| Web analytics | **GA4**, loaded via the unified Google tag (`gtag.js`) | No GTM needed for a site this size; one script also carries Google Ads conversion tracking |
| Ad conversion pixel | **Google Ads conversion tag** via the same Google tag load as GA4 | Google consolidated Ads conversion tracking + GA4 into one "Google tag" in 2026 — one script include covers both |
| Retargeting pixel | **Meta (Facebook) Pixel**, standard `fbq.js` snippet | Required for FB/Instagram retargeting per requirements |
| Heatmap / session recording | **Microsoft Clarity** (recommended) | Genuinely free with no session cap, no traffic limit, click/scroll/area heatmaps, unlimited recordings, built-in consent API, single lightweight script tag — best fit for a solo-founder budget. Trade-off: ~30-day recording retention and Microsoft retains rights to use aggregated data. If that trade-off is unacceptable, **Hotjar** is the fallback (privacy-first, 365-day retention, but capped free tier and a second script/vendor to maintain). **Founder confirmation requested — see §12.** |
| Consent | Lightweight cookie-consent banner gating ad/pixel storage via **Google Consent Mode v2** + Meta Pixel deferred-init + Clarity consent API | Google Ads Consent Mode v2 is a hard requirement for any EU/EEA/UK-targeted ad spend; Meta Pixel requires prior consent under GDPR |

## 2. Architecture (Astro static site on Vercel)

- All vendor scripts load from a single point: `src/components/Analytics.astro`, included once in the base `Layout.astro`.
- Wrap **Partytown** around GA4/Ads/FB scripts to move them off the main thread (`forward: ['dataLayer.push', 'gtag', 'fbq']`) — protects Core Web Vitals, which Vercel Analytics is already tracking.
- One first-party module `src/lib/analytics.ts` exports `trackEvent(name, params)` as the **only** call site components use. It fans out to `gtag('event', ...)` and `fbq('trackCustom'/'track', ...)` together, so components never talk to a vendor SDK directly. This is what unit tests target (pure function, mockable `window.gtag`/`window.fbq`).
- Every tracker in `analytics.ts` is **no-op-safe**: if its env var is unset, calls silently skip that vendor instead of throwing. This lets Frontend Dev build and unit-test the full feature now, before every credential exists, and lets preview/dev builds run without live IDs.
- Env vars (Vercel, must be `PUBLIC_`-prefixed for Astro client-side access):
  - `PUBLIC_GA4_MEASUREMENT_ID` (format `G-XXXXXXXXXX`)
  - `PUBLIC_GOOGLE_ADS_ID` (format `AW-XXXXXXXXX`)
  - `PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` (per-conversion-action string from Google Ads)
  - `PUBLIC_FB_PIXEL_ID` (numeric)
  - `PUBLIC_CLARITY_PROJECT_ID` (short alphanumeric)

## 3. Event Taxonomy (GA4, snake_case names, ≤40 chars, ≤25 params/event per GA4 limits)

| Event name | Trigger | Params | Notes |
|---|---|---|---|
| `cta_click` | click on a primary CTA button | `cta_id`, `cta_text`, `cta_location` (`hero`/`nav`/`footer`/`course_card`) | Covers "Записатись на консультацію", "Забрати уроки", course CTAs |
| `page_view` | every route change | `page_path`, `page_referrer`, `utm_source`, `utm_medium`, `utm_campaign` | Astro View Transitions cause duplicate page_views with default config — set `send_page_view: false` in gtag config and fire manually on the `astro:page-load` event |
| `form_submit` | consultation or quiz form succeeds | `form_id` (`consultation`\|`quiz`), `form_location` | No field values captured |
| `form_submit_error` | form submit fails validation/server error | `form_id`, `error_type` | |
| `promo_modal_shown` | modal auto-triggers (12s or 6s+scroll) or manually re-triggered | `trigger_type` (`auto`\|`manual`), `delay_ms` | Ties into GEO-31's persistent re-access CTA |
| `promo_modal_click` | user clicks the CTA inside the modal | `modal_variant` | |
| `promo_modal_dismiss` | user closes modal without clicking | `dismiss_method` (`close_button`\|`overlay`\|`esc`) | |
| `external_link_click` | click on any outbound link | `link_domain` (`youtube.com`\|`instagram.com`\|`t.me`\|checkout host), `link_url` | |
| `course_checkout_click` | click "buy course"/checkout CTA | `course_id`, `price` | No PII |
| `consultation_lead` | consultation form succeeds — marked as a GA4 **key event**/conversion | `value` (optional), `currency` | Also fires the Google Ads conversion tag + Meta `Lead` event |
| `purchase` | course purchase completes, if a confirmation page with order data is reachable client-side | `transaction_id`, `value`, `currency`, `items` | If checkout is fully on a third-party domain we don't control, this must move to server-side tracking — flagged as **out of scope**, see §13 |

## 4. UTM Parameter Handling

- GA4 auto-captures UTM params on `page_view` already — no extra work needed there.
- For custom conversion events fired later in a session (e.g. `consultation_lead`), capture `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/`utm_content` from the first-touch landing URL into `sessionStorage` (not a cookie — avoids adding this to the consent surface) and attach them to those events at fire time.

## 5. Google Ads Conversion Tracking

- Single Google tag load (shared with GA4): `gtag('config', 'AW-XXXXXXXXX')` alongside the GA4 config call.
- Fire `gtag('event', 'conversion', { send_to: 'AW-ID/LABEL', value, currency })` on the primary conversion goal — **needs founder decision, see §12**.
- Implement **Consent Mode v2** defaults: `ad_storage`, `ad_user_data`, `ad_personalization`, `analytics_storage` all default to `'denied'` until the consent banner is accepted, then `gtag('consent', 'update', {...granted...})`. Required if any EU/EEA/UK traffic is expected from paid campaigns.

## 6. Meta (Facebook) Pixel

- Standard `fbq('init', PIXEL_ID)` + automatic `PageView`.
- Map our events to Meta standard events: `Lead` (on `consultation_lead`), `CompleteRegistration` or `Purchase` (on `purchase`), `ViewContent` (on course page view).
- Pixel init is deferred until consent-banner acceptance (GDPR requirement for EU visitors).
- Server-side **Conversions API** is **out of scope** for this task (ad-blocker/ITP resilience improvement) — flag as fast-follow.

## 7. Heatmap: Microsoft Clarity vs Hotjar vs Smartlook

| | Microsoft Clarity | Hotjar | Smartlook |
|---|---|---|---|
| Free tier | Unlimited sessions, unlimited recordings, no traffic cap | Free plan capped (session-limited) | ~3,000 sessions/mo free |
| Heatmaps | Click, scroll, area + AI-generated insights (rage clicks, dead clicks) | Yes, bundled with surveys/funnels | Yes, plus native mobile app heatmaps |
| Session recording retention | ~30 days | Up to 365 days on paid | Varies by plan |
| Extras | Copilot AI summaries | Surveys, feedback widgets, funnels | Native iOS/Android session recording |
| Data use | Microsoft reserves rights to use aggregated data | Privacy-first positioning | Standard SaaS terms |
| Integration | One script tag, works with any static site incl. Astro/Vercel | One script tag | One script tag |

**Recommendation: Microsoft Clarity.** Zero cost regardless of traffic, fastest to integrate, sufficient for the stated goal (visual engagement understanding). Hotjar is the fallback if the founder is uncomfortable with Microsoft's data-use terms or wants bundled surveys later.

## 8. Consent Banner (UI — Designer review required before implementation)

- Minimal banner: "Accept" / "Necessary only", choice stored in `localStorage`.
- Gates: GA4 `ad_storage`/`ad_user_data`/`analytics_storage` consent-mode grants, Meta Pixel init, Clarity `clarity('consent')` call.
- GA4 anonymous pageview/analytics can run under a "necessary" bucket via Consent Mode defaults (ads denied, analytics granted) unless the founder wants stricter default-denied-for-everything — **flagged as an open question, §12**.
- **This is user-facing UI** — per BA policy, Designer must review placement/style before Frontend Dev builds it. Flagged in GEO-38.

## 9. Privacy / No-PII Rules

- Never pass email, phone, name, or free-text form field values as event params — only IDs/booleans/categories.
- GA4 IP anonymization is on by default — verified as part of config, not a code change.
- Clarity auto-masks input/password fields by default; any custom text areas that could contain PII must be tagged `data-clarity-mask="true"`.

## 10. Env Vars / Credentials Needed From Founder

| Var | Format | Where to get it |
|---|---|---|
| `PUBLIC_GA4_MEASUREMENT_ID` | `G-XXXXXXXXXX` | Google Analytics Admin → Data Streams → Web stream |
| `PUBLIC_GOOGLE_ADS_ID` | `AW-XXXXXXXXX` | Google Ads → Tools → Conversions → Conversion actions |
| `PUBLIC_GOOGLE_ADS_CONVERSION_LABEL` | opaque string | Same screen, per conversion action |
| `PUBLIC_FB_PIXEL_ID` | numeric | Meta Events Manager → Data Sources → Pixel |
| `PUBLIC_CLARITY_PROJECT_ID` | short alphanumeric | Clarity dashboard → Settings → Setup |

## 11. Acceptance Criteria (Given/When/Then) — basis for GEO-38 tests

1. **Given** `PUBLIC_GA4_MEASUREMENT_ID` is unset, **when** the site builds, **then** the build succeeds and no GA4 script is injected (no-op verified by unit test on `analytics.ts`).
2. **Given** a user clicks the "Записатись на консультацію" CTA, **when** the click handler runs, **then** `trackEvent('cta_click', {cta_id: 'consultation_hero', ...})` is called exactly once (unit test with mocked `window.gtag`).
3. **Given** the consultation form submits successfully, **when** the server returns 200, **then** `consultation_lead` fires with no PII params, **and** the Google Ads conversion event fires, **and** the Meta `Lead` event fires (Playwright test asserting outgoing network requests to `google-analytics.com`/`googleads.g.doubleclick.net`/`facebook.com/tr`).
4. **Given** the promo modal auto-shows after 12s, **when** it renders, **then** `promo_modal_shown` fires with `trigger_type: 'auto'`.
5. **Given** a user clicks an Instagram link in the footer, **when** the click fires, **then** `external_link_click` fires with `link_domain: 'instagram.com'` before navigation.
6. **Given** a URL with `?utm_source=facebook&utm_medium=cpc&utm_campaign=launch`, **when** the user later submits the consultation form in the same session, **then** the `consultation_lead` event params include the captured UTM values.
7. **Given** the consent banner has not been accepted, **when** the page loads, **then** Meta Pixel does not initialize and GA4 Consent Mode reports `ad_storage: denied`.
8. **Given** the consent banner is accepted, **when** the acceptance handler runs, **then** `gtag('consent', 'update', ...)` is called with granted values and Clarity/Meta Pixel initialize.
9. **Given** a course purchase confirmation page loads with order data, **when** the page mounts, **then** `purchase` fires once (not on refresh — dedupe via `transaction_id` in `sessionStorage`).
10. **Given** Clarity is loaded, **when** a page contains a `data-clarity-mask="true"` element, **then** Clarity does not capture its text content (manual QA check — Clarity dashboard playback).

## 12. Open Questions For Founder (blocking full GEO-38 completion, not blocking start)

1. **Primary Google Ads conversion goal** — consultation form submission, course purchase, or both?
2. **Heatmap tool** — confirm Microsoft Clarity (free, unlimited, MS data-use terms) or prefer Hotjar (paid tiers, stricter privacy stance, 365-day retention)?
3. **Course purchase trackability** — does checkout redirect to a confirmation page on zhulova.com with order data, or is it fully on a third-party checkout domain we don't control? Determines whether `purchase`/conversion tracking is client-side (in scope) or needs server-side webhooks (out of scope, fast-follow).
4. **Expected EU/EEA/UK ad traffic** — any planned paid campaigns targeting EU audiences (e.g. Ukrainian diaspora)? Determines whether Consent Mode v2 + cookie banner are a hard legal requirement or a best-practice-only addition.

## 13. Out of Scope (this task)

- Meta Conversions API / Google Enhanced Conversions (server-side tracking) — fast-follow once client-side pixels are live and proven.
- A/B testing framework.
- Backend event warehouse / data pipeline beyond GA4/Ads/Meta's own dashboards.

## 14. Handoff

- **GEO-38** (child of this issue): Frontend Dev implements §2–§9 using TDD, per the acceptance criteria in §11. Flags the consent banner (§8) to Designer before building it. Code Critic review + QA verification happen inside GEO-38 per company process (no separate QA task is created).
- Credentials in §10 and decisions in §12 are requested from the founder via the confirmation interaction on this issue; Frontend Dev can start immediately using the no-op-safe env-var pattern in §2 and wire in real IDs once supplied.
