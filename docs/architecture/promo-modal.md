# Promo Modal — «Перші 2 уроки в подарунок» (UX Research + UI Spec)

**Status:** Research + UX spec complete (GEO-26). Implementation pending (GEO-27) — Frontend Dev appends the "Final behavior" section after implementation.
**Owner of this doc:** Designer (research/UX sections), Frontend Dev (implementation section).
**Architecture constraints:** fixed by CTO shaping comment on GEO-25 — island in `BaseLayout.astro`, reuse of `src/design-system/Modal`, config in `src/config/promo.ts`, localStorage key `zh_promo_gift_v1`, env var `PUBLIC_GIFT_BOT_URL`, Vercel Analytics events. This doc plugs concrete values into that structure; it does not change it.

---

## 1. Research: trigger timing

### What the data says

| Trigger type | Conversion (source data) | Notes |
|---|---|---|
| Immediate (0–1 s) | 1.9% (Omnisend), 4.16% (Wisepops) | Worst-rated for intrusiveness; NN/g flags immediate modals as trust-damaging |
| Timed 6–10 s | 2.4% — best bucket in Omnisend's sample | |
| Timed 11–15 s | 6.45% — peak of Wisepops' curve; sharp drop past 16 s | |
| Timer vs scroll | Timer 4.42% vs scroll 2.64% (Sleeknote A/B, 6 s optimal) | Timer-led beats scroll-led by ~67% |
| Scroll-triggered | 5.37% (Wisepops) | Good engagement proxy, but alone it never fires for non-scrolling visitors |
| Second pageview | 28.98% — highest-converting trigger (Wisepops) | Poor fit here: zhulova.com is a long single landing page; most sessions never produce a second pageview, so reach would collapse |
| Exit-intent | 1.8% (Omnisend) – 3.94% (Wisepops) | Lowest tier; desktop-only signal (no reliable mobile equivalent), and the visitor is already leaving |

Peer-reviewed eye-tracking research (cited in the Omnisend roundup) additionally found that popups delayed ~20 s received more visual attention and were rated *less* intrusive than immediate ones — delay buys both attention and goodwill.

NN/g's qualitative findings ([Popups: 10 Problematic Trends](https://www.nngroup.com/articles/popups/), [Overlay Overload](https://www.nngroup.com/articles/overlay-overload/)): the damage from modals comes from bad *timing* (interrupting before the user has consumed any value) and *stacking* (competing overlays), not from the pattern itself. A single, delayed, easily dismissible, offer-relevant modal is the acceptable form of this pattern.

**Sources:**
- [Omnisend — Popup Timing](https://www.omnisend.com/blog/popup-timing/) (delay buckets, exit-intent, eye-tracking citation)
- [Popupsmart — Popup Conversion Benchmark Report (10,000+ campaigns)](https://popupsmart.com/blog/popup-conversion-benchmark-report)
- [Crazy Egg — 50+ Popup Statistics](https://www.crazyegg.com/blog/popup-statistics/) (Wisepops/Sleeknote aggregates)
- [NN/g — Popups: 10 Problematic Trends and Alternatives](https://www.nngroup.com/articles/popups/)
- [NN/g — Overlay Overload](https://www.nngroup.com/articles/overlay-overload/)
- [Smashing Magazine — Intrusive Interstitials: Avoiding Google's Penalty](https://www.smashingmagazine.com/2017/05/intrusive-interstitials-guidelines-avoid-google-penalty/)

### Recommended rule (the ONE rule)

> **Show when `elapsed ≥ 12 s`, OR when (`elapsed ≥ 6 s` AND `scrollDepth ≥ 50%`) — whichever comes first.**

Rationale:
- **12 s** sits in the 11–15 s conversion peak (Wisepops) and clears the "immediate modal" trust penalty (NN/g, eye-tracking). On this site 12 s is roughly the time to read the hero and first trust indicators — the visitor has received value before being interrupted.
- **The scroll fast-path (≥50% depth)** rewards engaged visitors: scroll depth is the best on-page engagement proxy we have, and an engaged visitor at mid-page has clearly "read enough" for the offer to be relevant sooner. The **6 s floor** prevents the modal from firing at ~2 s for visitors who flick-scroll immediately, which would reproduce the immediate-popup problem.
- Timer-led is the primary channel (it converts better than scroll-only and fires for non-scrolling visitors too); scroll is only an accelerator.
- **Rejected:** exit-intent (bottom-tier conversion, desktop-only signal), second-pageview (best conversion but near-zero reach on a one-page site).

Config values for `src/config/promo.ts`:

```ts
triggerDelayMs: 12_000,        // primary timer
engagedDelayMs: 6_000,         // floor for the scroll fast-path
engagedScrollDepth: 0.5,       // fraction of page height scrolled
```

Deferral (per CTO overlap rules): if the trigger fires while `isConsultationModalOpen` or `isMobileMenuOpen` is true, or focus is in a text field, **defer and retry** (poll/re-arm, e.g. every 2 s) — do not drop the show for that pageview.

---

## 2. Frequency capping

State schema (fixed by CTO): `localStorage["zh_promo_gift_v1"] = { status: 'shown' | 'dismissed' | 'converted', at: <epoch ms>, shownCount: number }`.

Lifecycle: on open → write `{status:'shown', at: now, shownCount: prev+1}`; on any dismiss affordance → `status:'dismissed'`, update `at`; on CTA click → `status:'converted'`, update `at`.

| Stored state | Re-show rule | Rationale |
|---|---|---|
| *(no record)* | Eligible on this pageview (subject to trigger + exclusions) | First contact |
| `converted` | **Never re-show** | CTO constraint. The visitor is in the Telegram funnel; re-showing reads as broken |
| `dismissed` | Re-show after **7 days** | Explicit "no" — industry standard suppression for promo popups is 7–14 days; 7 fits a limited-time-flavored gift offer |
| `shown` (opened, but left the page without clicking anything) | Re-show after **3 days** | Soft signal — the visitor may not have read it; shorter window than an explicit dismissal |
| any, with `shownCount ≥ 3` | **Never re-show** (lifetime cap) | Three ignores/dismissals = a "no". Caps long-term annoyance and protects brand trust |

Additional invariants:
- **Max 1 show per pageview** — guaranteed structurally: the open writes `status:'shown'` with a fresh `at`, which makes the state ineligible for the rest of the session.
- All localStorage reads/writes in try/catch with in-memory fallback (Safari private mode) — per CTO shaping; the in-memory fallback naturally degrades to "max once per pageview".
- The `_v1` key suffix is the reset lever for future campaigns (e.g. a different gift → `_v2` re-arms everyone).

Sources: [Divimode — Frequency Capping Best Practices](https://divimode.com/frequency-capping-best-practices/) (7–14 day suppression after dismissal, 3–7 for promos), [Popupsmart Benchmark Report](https://popupsmart.com/blog/popup-conversion-benchmark-report) (capped campaigns sustain 2–3× higher conversion over 30 days than uncapped).

Config values:

```ts
reshowAfterDismissedMs: 7 * 24 * 60 * 60 * 1000,  // 7 days
reshowAfterShownMs:     3 * 24 * 60 * 60 * 1000,  // 3 days
maxLifetimeShows: 3,
```

---

## 3. Page exclusions

Checked at build time in `BaseLayout.astro` (island not rendered → zero JS) AND re-checked at fire time against `location.pathname` (View Transitions can move the visitor onto an excluded page while the timer is pending) — per CTO shaping.

**Excluded (modal never appears):**

| Path / prefix | Match | Why |
|---|---|---|
| `/quiz` | prefix | Mid-quiz interruption kills quiz completion — the quiz is itself a lead-gen flow; never compete with it |
| `/courses/opora` | prefix (covers the sales page and `/success`, `/error`) | Sales page: a "free 2 lessons" offer shown next to the 9 € purchase CTA directly cannibalizes the purchase decision. `/success`: post-payment — offering a free version of what was just bought reads as insulting. `/error`: the visitor is recovering from a failed payment; any interruption increases abandonment |
| `/privacy-policy`, `/terms`, `/oferta` | exact | Legal pages — visitors are here for compliance information; promos on legal pages damage credibility (NN/g trust findings) and look bad in any dispute |
| `/404` | exact | Error state — the visitor is lost; help them navigate, don't sell |

**Allowed:** `/` (primary traffic + longest dwell time), `/courses` (catalog — browsing intent, offer is relevant, no purchase decision in progress yet), `/contacts` (social hub — Telegram CTA is native here).

Config value:

```ts
excludedPathPrefixes: ['/quiz', '/courses/opora'],
excludedPaths: ['/privacy-policy', '/terms', '/oferta', '/404'],
```

Note for Frontend: match `/courses/opora` as a path-segment prefix (`/courses/opora` + `/courses/opora/…`) while keeping plain `/courses` allowed — i.e. prefix match against `pathname` with a trailing-slash-or-end boundary, not `startsWith('/courses')`.

**Revisit trigger:** if `promo_gift_shown → promo_gift_cta_click` conversion is healthy after ~4 weeks of Vercel Analytics data, consider A/B-allowing the `/courses/opora` sales page (the free lessons could de-risk the 9 € purchase for hesitant visitors). Not in v1.

---

## 4. Mobile behavior

**Decision: reuse the existing centered `src/design-system/Modal` on all viewports. No bottom sheet in v1.**

Comparison considered:
- *Bottom sheet* is the more native-feeling mobile pattern and keeps the top of the page visible, but our `Modal` has no sheet variant. Building one means new one-off layout/animation/drag-to-dismiss code — against the reuse mandate — for a single short-content modal that doesn't need sheet ergonomics (no long scrollable content, no multi-step flow).
- *Centered modal* already handles small screens in the design system: `p-3` container padding, `max-w-lg`, `rounded-xl`, responsive header. The consultation modal ships this today, so the promo modal stays visually consistent with the only other modal on the site.

Mobile constraints (binding for implementation):
- **Compact content**: headline + 2–3 lines of body + one CTA + one text dismiss. Target panel height ≤ ~60vh on a 360×640 viewport; must never require scrolling inside the panel on common devices.
- **Zero CLS**: the island renders `null` until the trigger fires (nothing in layout flow); `Modal` already compensates scrollbar width on open. No reserved space, no layout reflow — the overlay is `position: fixed`.
- **No interaction blocking before trigger**: no listeners that preventDefault, no overlay pre-mounted. Until `isOpen`, the island's only activity is a timer + passive scroll listener (`{ passive: true }`).
- **Tap targets ≥ 44×44 px** for the close X and the text dismiss (the X in `Modal` already has `p-2` + icon — verify it meets 44 px; if not, extend `Modal`, don't fork).
- **Google intrusive-interstitial caution** ([Smashing Magazine guide](https://www.smashingmagazine.com/2017/05/intrusive-interstitials-guidelines-avoid-google-penalty/)): the penalty targets interstitials shown *immediately upon arrival from search*. Our ≥6–12 s delay, single-shot capping, and easy dismissal are the accepted mitigations. Do not shorten the delay below 6 s on mobile for any reason.

---

## 5. UI spec + copy

### Copy (Ukrainian, site voice)

The opora funnel (quiz, course page) consistently uses the informal «ти» voice («Спробуй "Опору на себе"…», «дізнайся, на що ти опираєшся»). The founder's headline «Забрати безкоштовні перші 2 уроки в подарунок» is refined per the allowed light-touch: «безкоштовні» + «в подарунок» is redundant — «в подарунок» already carries "free", and the shorter line fits one row on mobile.

| Element | Copy |
|---|---|
| Title (`Modal` `title` prop, renders as `h2#modal-title`) | **Перші 2 уроки — у подарунок** |
| Body, line 1 | Спробуй курс «Опора на себе» ще до покупки: перші два уроки — безкоштовно, у Telegram. |
| Body, line 2 (secondary, smaller) | Без оплати й зобов'язань — просто забери і подивись, чи відгукується. |
| Primary CTA | **Забрати уроки в Telegram** |
| Text dismiss | Дякую, не зараз |

Notes:
- CTA states the destination (Telegram) — leaving the site for a bot must not be a surprise; this is the single biggest drop-off risk of the flow.
- No fake urgency (no countdowns, no «тільки сьогодні») — off-brand for the calm "Soft Luxury" voice and an NN/g dark-pattern flag.
- No emoji in the title (Playfair Display serif headline; emoji breaks the typographic register). If a gift accent is wanted, use a small inline SVG gift icon in the body, `text-gold-500`, `aria-hidden="true"`.

### Layout & components (all from the design system — no one-off styles)

```
Modal (src/design-system/Modal — as-is)
  title="Перші 2 уроки — у подарунок"
  └─ content (p-4 sm:p-6 from Modal):
     ├─ Text size="md"  — body line 1        (design-system Typography/Text)
     ├─ Text size="sm" tone="muted" — line 2 (mt-2)
     ├─ Button variant="primary" size="lg" className="w-full mt-6"
     │    → renders as <a> semantics: CTA navigates to PUBLIC_GIFT_BOT_URL
     │      (new tab: target="_blank" rel="noopener noreferrer")
     └─ text dismiss — plain <button>, centered, mt-3,
          text-sm text-navy-400 hover:text-navy-600 underline underline-offset-4,
          focus:ring-2 focus:ring-gold-400/50 rounded (matches Modal's X focus style)
```

- `Modal` already provides: navy/80 blurred backdrop, white→sage-50 gradient panel, gold top border, gold-tinted header, close X (with Ukrainian `aria-label`), ESC close, click-outside close, scroll-lock with scrollbar compensation, `role="dialog"` `aria-modal` `aria-labelledby`. Reuse all of it unchanged.
- Primary CTA uses `Button variant="primary"` (navy) — same choice as the consultation modal's submit, so modals stay internally consistent; gold stays the accent (top border, focus rings), per the Soft Luxury hierarchy.
- If `Button` doesn't support rendering as a link, wrap: `<a href={botUrl} …><Button …tabIndex handling/></a>` is NOT acceptable (nested interactive); instead apply the Button classes to an `<a>` or extend `Button` with an `as`/`href` prop in the design system (preferred, reusable).
- **Dismiss affordances (all write `status:'dismissed'`):** close X, ESC, backdrop click, «Дякую, не зараз». Four affordances is deliberate: the text dismiss is the discoverable one on mobile, where backdrop area is small and ESC doesn't exist.

### States

| State | Behavior |
|---|---|
| Idle (pre-trigger) | Island renders `null`. No DOM, no CLS |
| Open | Modal as specced; initial focus goes into the dialog (see a11y) |
| CTA clicked | `track('promo_gift_cta_click')`, write `converted`, open bot URL in new tab, close modal |
| Dismissed | `track('promo_gift_dismissed')`, write `dismissed`, close, focus returns to previously focused element |
| Env var missing | Island not rendered at all (CTO fail-safe) — never an empty/broken CTA |

Analytics event names (fixed by CTO): `promo_gift_shown`, `promo_gift_dismissed`, `promo_gift_cta_click` via `track()` from `@vercel/analytics`.

### Entry animation

- **Default:** backdrop fades in (opacity 0→1, 300 ms), panel fades + scales 0.96→1 with `ease-out`, 300 ms — matches the `duration-300` transitions already in `Modal`.
- **`prefers-reduced-motion: reduce`:** no transform, no fade — modal appears instantly. Gate in JS with `prefersReducedMotion()` from `src/components/quiz/motion.ts` (the CSS media query alone can't stop JS-driven mount transitions), per CTO shaping §7.
- No attention-seeking motion after entry (no pulse/shake on the CTA — dark-pattern territory and off-brand).

### Accessibility checklist (verify in the Playwright + axe spec)

- [ ] Focus moves into the dialog on open (first focusable = close X or CTA) and **returns to the previously focused element** on close. CTO flagged: verify `Modal` actually implements focus trap + focus return — current `Modal` code does **not** appear to trap focus or restore it; extend `Modal` itself (both existing modals benefit), do not fork.
- [ ] Tab/Shift-Tab cycles within the dialog only (trap).
- [ ] `role="dialog"`, `aria-modal="true"`, `aria-labelledby` → title (already in `Modal`).
- [ ] All text ≥ 4.5:1 contrast — note: the text dismiss at `text-navy-400` on the sage-50 gradient must be contrast-checked; darken to `text-navy-500`/`600` if it fails.
- [ ] Keyboard-only pass: open → Tab to CTA → Enter navigates; ESC dismisses.
- [ ] Never steals focus while the visitor is typing (overlap guard, CTO §5).
- [ ] axe scan on the open state: 0 critical violations.

---

## 6. Summary of chosen values (for `src/config/promo.ts`)

```ts
export const promoConfig = {
  storageKey: 'zh_promo_gift_v1',
  triggerDelayMs: 12_000,
  engagedDelayMs: 6_000,
  engagedScrollDepth: 0.5,
  reshowAfterDismissedMs: 7 * 24 * 60 * 60 * 1000,
  reshowAfterShownMs: 3 * 24 * 60 * 60 * 1000,
  maxLifetimeShows: 3,
  excludedPathPrefixes: ['/quiz', '/courses/opora'],
  excludedPaths: ['/privacy-policy', '/terms', '/oferta', '/404'],
} as const;
```

---

## 7. Final behavior (implementation)

Implemented in GEO-27. File map:

| Piece | Location |
|---|---|
| Config (values from §6, unchanged) | `src/config/promo.ts` |
| Pure trigger / capping / storage logic | `src/components/promo/promoTrigger.ts` (+ unit tests) |
| React island | `src/components/promo/PromoModal/index.tsx` (+ unit tests) |
| Mount point | `src/layouts/BaseLayout.astro` — `client:idle`, after `<slot />` |
| E2E | `tests/e2e/promo-modal.spec.ts` (chromium) |

### How it behaves

- **Rendering gate (build time):** the island is emitted only when `PUBLIC_GIFT_BOT_URL` is set AND `Astro.url.pathname` is not excluded (`isPathExcluded`, shared with the runtime check). Excluded pages ship zero promo JS.
- **Trigger:** the island polls once per second. It fires when `elapsed ≥ 12s`, or `elapsed ≥ 6s` with max scroll depth ≥ 50% (§1). Scroll depth is tracked with a single passive listener; nothing is mounted before firing (zero CLS).
- **Fire-time guards (§1, §3, CTO §5):** the tick is skipped — and retried next second — while the consultation modal or mobile menu is open, or while focus is in an input/textarea/select/contenteditable. The pathname is re-checked at fire time to cover View Transitions navigation onto an excluded page.
- **Frequency capping (§2):** stored under `zh_promo_gift_v1` as `{status, at, shownCount}`. `converted` and `shownCount ≥ 3` never re-show; `dismissed` re-shows after 7 days, `shown` (no interaction) after 3 days. localStorage failures (Safari private mode, quota) fall back to an in-memory record — degrades to once per pageview.
- **Dismiss/convert:** all four dismiss affordances (X, ESC, backdrop, «Дякую, не зараз») write `dismissed` + `track('promo_gift_dismissed')`. The CTA is a real `<a>` to the bot (new tab, `noopener noreferrer`), writes `converted` + `track('promo_gift_cta_click')`, then closes. Showing writes `shown` + `track('promo_gift_shown')`.

### Design-system extensions (no forks)

- **`Modal`**: added focus management — initial focus into the dialog, Tab/Shift-Tab trap, focus return to the previously focused element on close (§ a11y checklist; both modals benefit). Added opt-in `animateEntry` prop: backdrop fade + panel fade/scale 0.96→1, 300 ms ease-out. Callers gate it — the promo island passes `animateEntry={!prefersReducedMotion()}` (reuses `src/components/quiz/motion.ts`).
- **`Modal` close X tap target (§4, binding):** verified against the 44 px rule and extended — the X button was 36×36 px on mobile (`p-2` + 20 px icon); now `min-w-11 min-h-11 inline-flex items-center justify-center` guarantees ≥44×44 px at all breakpoints with the icon centered. Negative margins (`-my-1 -mr-2`) absorb the extra 8 px so header height and the icon's visual position are unchanged. The text dismiss («Дякую, не зараз») already met 44 px via `py-3`. Both modals benefit; covered by a Modal unit test asserting the sizing classes.
- **`Button`**: added `href` support — renders an `<a>` with identical styling (discriminated union on `href`), per §5 "extend Button, don't nest interactives".

### Deviations from §5

- Text dismiss uses `text-navy-500 hover:text-navy-700` (spec suggested `navy-400/600`) — the darker shades per the contrast note in the a11y checklist.

### Coverage

- Unit (vitest): trigger rule boundaries, path exclusion (segment-boundary prefix match), capping windows, record marking, storage fallback, island fire/defer/guard behavior, Modal focus trap + return, Modal close-button 44 px tap-target classes, Button `href` rendering.
- E2E (chromium, Playwright clock API): appears after the trigger, CTA href/target/rel, axe scan of the open state (0 critical), text dismiss, no reappearance after reload, never renders on an excluded page.
