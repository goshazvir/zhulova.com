# Persistent Access to the Gift Promo Modal — BA Research (GEO-31)

**Status:** Research complete — awaiting founder decision on recommended option.
**Owner of this doc:** BA (this doc), Designer (placement/style, once scoped), Frontend Dev (implementation section, appended after GEO-31 ships).
**Depends on:** GEO-27 (promo modal implementation — `feat/geo-27-promo-modal`, PR #57, not yet merged to `master`). This doc is written against that branch since the modal doesn't exist on `master` yet.
**Related:** `docs/architecture/promo-modal.md` (the modal's own UX research/spec — trigger timing, frequency capping, exclusions, mobile behavior). This doc does not change any of that; it only adds a second, explicit entry point into the same modal.

---

## 1. Problem

The modal (`docs/architecture/promo-modal.md`) auto-fires once per eligible pageview (12s timer / 6s+50%-scroll), and re-shows are frequency-capped (7 days after dismissal, 3 days after an unclicked view, never after conversion, 3 lifetime shows). This capping is correct for the *unsolicited* interruption — but it also silently blocks the visitor who dismissed it, then *changes their mind* and wants the free lessons. Today there is no way for that visitor to get back to the offer short of waiting out the cap or manually clearing `localStorage`.

## 2. What already exists (relevant to the fix)

- `useUIStore.getState().openPromoModal()` (`src/stores/uiStore.ts`) is a bare state setter — `set({ isPromoModalOpen: true })`. It carries **no** frequency-cap check; `isEligible()` is only consulted inside `PromoModal`'s own auto-trigger timer effect. **Calling `openPromoModal()` from anywhere else already bypasses the cap for free** — no new bypass logic needs to be built, only a new call site.
- There is a direct precedent for this exact wiring: the footer's "Готовий змінити своє життя?" block calls `useUIStore.getState().openConsultationModal()` from a plain `<script>` on button click (`src/components/layout/Footer.astro`, `#footer-cta-button`). A new gift CTA is the same pattern, targeting `openPromoModal()` instead.
- The modal island itself is only mounted when `PUBLIC_GIFT_BOT_URL` is set and the current path isn't excluded (`BaseLayout.astro`). Any new persistent CTA must respect the same two gates, or clicking it would either do nothing (island not mounted) or open a modal that then can't render itself.
- Page exclusions (`/quiz`, `/courses/opora`, legal pages, `/404`) exist because the offer actively conflicts with what the visitor is doing there (mid-quiz, mid-purchase, legal/error page) — see `promo-modal.md` §3. A persistent CTA placed in a *global* surface (header/footer) would, without extra logic, also appear on those pages. Recommendation: reuse `isPathExcluded()` to hide the CTA there too, for the same reasons the modal itself is excluded.
- `Button` (`src/design-system/Button`) already renders as `<a>` or `<button>` with `primary` / `secondary` / `outline` variants — no new visual component is needed for any of the options below.

## 3. Constraints that shaped the options

- **Global reach.** "Persistent" implies reachable from any page, not just the homepage. `Header.astro` and `Footer.astro` are mounted in `BaseLayout` (every page); `HeroSection.astro` is homepage-only.
- **Bypass the cap.** Confirmed — an explicit click is an unambiguous user request, unlike the passive auto-trigger. (Already free, per §2.)
- **Fail-safe parity.** Must not render when `PUBLIC_GIFT_BOT_URL` is unset (matches the modal's own fail-safe) and should hide on excluded paths (matches §3 of the modal spec).
- **Analytics distinction.** The auto-trigger's `promo_gift_shown` event feeds the timing research in `promo-modal.md` §1. A manually-opened modal is a different signal (intentional recall, not passive interruption) and would skew that funnel if tagged the same. Recommend a distinct event, e.g. `promo_gift_manual_open`, fired on CTA click before `openPromoModal()`.
- **Design consistency.** Reuse `Button`/existing link styles and copy voice (informal «ти», no fake urgency — per `promo-modal.md` §5). No new visual language.

## 4. Options

### Option 1 — Header nav CTA
A small gift-labeled link in the fixed header (desktop nav, plus an entry in `MobileMenu` for mobile), calling `openPromoModal()` on click.

**Pros**
- Maximum persistence: the header is `fixed`/sticky and present on every page, at every scroll position — zero extra scrolling to find it.
- Matches the "persistent" framing in the issue title most literally.

**Cons**
- The desktop nav is already fairly full: 4 section anchors + Курси + Контакти + 3 social icons + logo. A 7th item needs a visual treatment that doesn't read as "just another nav link" (e.g. small gift icon + gold accent) — needs Designer input, not a plain text link.
- Mobile requires a second implementation surface (`MobileMenu`) to actually deliver on "persistent," which is slightly more work than a single insertion point.

### Option 2 — Footer CTA reinforcement
A secondary link/small button next to the existing footer CTA block ("Готовий змінити своє життя?"), using the same `#id` + `<script>` wiring as `footer-cta-button`.

**Pros**
- Reuses an established, proven pattern exactly (same file, same wiring shape, near-zero new visual design).
- Doesn't compete for space in the already-busy header nav.
- Low implementation risk/cost.

**Cons**
- Lowest discoverability of the three: the visitor must scroll to the very bottom of the page. Someone who dismissed the modal at the 12s mark early in a session may never reach the footer that visit.
- Two CTA blocks stacked in the footer (consultation + gift) risks visually competing for attention unless kept clearly secondary (small text link, not a second full block).

### Option 3 — Dedicated `/free-lessons` landing page
A new route presenting the offer as a real page (own URL, own SEO metadata), either embedding/opening the same modal or standing alone with a direct CTA to the bot.

**Pros**
- Gives a stable, shareable URL — useful if the founder ever wants to link the offer from Telegram bio, ads, or social posts, independent of site navigation.
- Could pick up incidental organic search traffic for "free lesson" style queries.

**Cons**
- Biggest lift of the three: new route, new content, new SEO metadata, a docs update, and a decision about whether it *reuses* the modal (redundant UI/logic to keep in sync) or *replaces* it for that path (two offer surfaces to maintain).
- Doesn't directly solve the stated problem ("I dismissed the modal, let me reopen *it*") so much as create an adjacent, separate flow — it's a bigger, more speculative investment than the ask requires.
- No current evidence of an external-linking use case (bio link, ads) — would be building ahead of a confirmed need.

### Option 4 — Combination (Header + Footer)
Ship Option 1 and Option 2 together: header CTA as the primary, always-visible entry point; footer link as a low-cost second chance for visitors who scroll past without noticing the header (or who dismissed the modal, kept scrolling, and reconsider at the bottom).

**Pros**
- Combines Option 1's discoverability with Option 2's "catches people who missed it" reinforcement, at a small incremental cost over building Option 1 alone (same wiring pattern, no new component).
- Both are global (every page), so the combination doesn't depend on the visitor being on the homepage.

**Cons**
- Two places to keep in sync (copy, exclusion logic, analytics event) instead of one — marginally more surface area to test.

## 5. Recommendation

**Option 4 (Header + Footer combination)**, with **Option 3 (`/free-lessons` page) explicitly deferred**, not rejected — revisit only if the founder identifies an external-linking need (ads, bio link, social post) that the header/footer CTAs can't serve, since neither lives outside the site itself.

Rationale: the problem is specifically "the visitor already dismissed the modal and wants it back" — that's best solved by making the *existing* modal easy to re-open from anywhere on the site, not by building a second offer surface. Header covers "reachable from anywhere, no scrolling"; footer is a cheap add-on (same wiring as the existing consultation CTA) that catches the rest. Both reuse `openPromoModal()` as-is, `Button`/link styling as-is, and `isPathExcluded()` as-is — no new logic, only new call sites.

## 6. Proposed subtask slicing (for after founder sign-off)

All items below are children of GEO-31, per company task-creation policy (no new top-level tasks). Designer review is a **prerequisite** for the Frontend subtask, per the issue's own acceptance criteria ("Designer feedback on placement/style").

### Subtask A — Designer: placement & style for the persistent gift CTA
- Review header treatment (icon vs. text, position relative to the 6 existing nav links + 3 social icons, and the mobile-menu entry).
- Review footer treatment (copy + visual weight relative to the existing consultation CTA block — must read as clearly secondary).
- Confirm final Ukrainian copy for both (informal «ти» voice, no fake urgency, consistent with `promo-modal.md` §5).
- Deliverable: short style note (or annotated screenshot) attached to this subtask; Frontend Dev subtask is blocked on this one.

### Subtask B — Frontend Dev: implement header + footer persistent CTA (TDD)
Acceptance criteria (Given/When/Then):
- Given any non-excluded page, when rendered on desktop, then a gift-labeled link is visible in the header nav; clicking it calls `openPromoModal()` and the modal opens immediately, regardless of frequency-cap state.
- Given the same context on mobile, when the hamburger menu is open, then the same CTA is present and behaves identically.
- Given the footer, when the page renders on any non-excluded page, then a secondary gift link/mini-button is visible near (not replacing) the existing consultation CTA block; clicking it opens the promo modal the same way.
- Given `PUBLIC_GIFT_BOT_URL` is unset, when any page renders, then neither the header nor the footer CTA is rendered (matches the modal island's own fail-safe — never a dead/broken CTA).
- Given the current pathname is excluded per `isPathExcluded()` (`/quiz`, `/courses/opora`, legal pages, `/404`), when the header/footer render, then neither CTA appears on those pages.
- Given either CTA is clicked, when the modal opens, then a distinct analytics event (`promo_gift_manual_open`) fires before/alongside `openPromoModal()`, separate from the auto-trigger's `promo_gift_shown`.
- Given the modal is already open (e.g. auto-triggered) and the visitor then clicks a persistent CTA, when the click is handled, then it is idempotent — no duplicate open, no error.
- Given keyboard-only navigation, when the visitor tabs to either CTA, then it's focusable and activates on Enter/Space; the existing `Modal` focus-trap/focus-return behavior (GEO-27) applies unchanged since it's the same modal instance.
- Given the visitor is typing in a form field or the consultation modal / mobile menu is open, when they click the persistent CTA, then it still opens the promo modal (this is an explicit click, not the passive auto-trigger — the overlap guards in `PromoModal`'s timer effect do not apply here). *Open question for Designer/Frontend: should clicking the gift CTA while the consultation modal is open close the consultation modal first, or should the gift CTA be visually disabled/hidden in that state? Recommend closing consultation modal first, for simplicity and because both are single-focus overlays — confirm during implementation.*
- Unit tests first (Vitest) for the new click handlers/wiring; one Playwright check (or an extension of the existing `tests/e2e/promo-modal.spec.ts`) covering: header CTA opens modal even when a cap-eligible=false state is seeded in `localStorage`.
- Docs: append an "Implementation" note to this doc (§7, mirroring `promo-modal.md`'s own pattern) once shipped.
- Definition of Done otherwise unchanged from company policy: Code Critic + QA verification happen inside this same subtask's thread, not as separate tasks.

### QA verification (inside Subtask B's thread, not a separate task)
- CTA visible/functional on header (desktop + mobile menu) and footer, on allowed pages; absent on excluded pages and when the env var is unset.
- Clicking either CTA opens the modal even immediately after a dismiss (cap bypass confirmed) and does not break the existing auto-trigger frequency-capping (seed various `zh_promo_gift_v1` states and confirm the *auto-trigger* still respects them — only the manual CTA bypasses).
- Axe scan on modal-open state (already covered by GEO-27's spec; confirm it still passes with the new open path).

## 7. Implementation (appended after GEO-31 ships)

**Status:** Shipped and styled per GEO-32's Designer note (see §7.1 below for the two deliberate token deviations from that note).

### What shipped

- `src/components/promo/giftCta.ts` (new) — the single source of truth for both gating and the manual-open handler, unit-tested in `giftCta.test.ts`:
  - `shouldShowGiftCta(pathname, giftBotUrl)` — same two gates as `BaseLayout`'s own `showPromoModal`: env-var fail-safe + `isPathExcluded()`. Computed server-side in `Header.astro` and `Footer.astro` (per page load), not re-checked client-side — consistent with the rest of the header/footer nav (no View Transitions on this site).
  - `openGiftPromoModal()` — closes the consultation modal first if open (both are single-focus overlays, resolves the open question from §4), tracks `promo_gift_manual_open` (distinct from the auto-trigger's `promo_gift_shown`), then calls `useUIStore.getState().openPromoModal()`. Deliberately does not read or write the `zh_promo_gift_v1` cap record — the manual path is a full, unconditional bypass, and leaving the auto-trigger's own stored state untouched keeps the two paths independent (confirmed by the new Playwright case below).
- **Header** (`Header.astro`): a `#header-gift-cta` pill button as the rightmost element of the desktop header row, after the social-icon block (`hidden md:inline-flex`), wired via the existing inline `<script>` (same pattern as `#mobile-menu-button`). `showGiftCta` is also passed down to `MobileMenu` as a prop.
- **Mobile menu** (`MobileMenu/index.tsx`, React): a `showGiftCta` prop renders a full-width CTA button above the social links; click calls `openGiftPromoModal()` then `closeMobileMenu()`. Decoupled from the `variant` prop — legal pages are already in `promoConfig.excludedPaths`, so `showGiftCta` is `false` there regardless.
- **Footer** (`Footer.astro`): a `#footer-gift-cta` text link directly under the existing `#footer-cta-button`, wired the same way, styled as an underlined text link so it reads as clearly secondary to the consultation CTA block.
- Idempotency (AC: clicking while already open) is free — `openPromoModal()` is `set({ isPromoModalOpen: true })`, so a repeat call is a no-op state update, not a duplicate mount or error.
- Keyboard access is free — both CTAs are native `<button type="button">` elements (no `href="#"` link hack), so Enter/Space activation and focus are handled by the browser; the existing `Modal` focus-trap/return (GEO-27) applies unchanged since it's the same modal instance.

### Tests

- `src/components/promo/giftCta.test.ts` (19 cases) — `shouldShowGiftCta` env-var + exclusion gating, `openGiftPromoModal` tracking/consultation-modal-close/idempotency.
- `MobileMenu.test.tsx` — 6 new cases for the gift CTA (render gating, click behavior, keyboard semantics).
- `tests/e2e/promo-modal.spec.ts` — new `persistent gift CTA (GEO-31)` describe block: seeds a `dismissed` (cap-ineligible) record in `zh_promo_gift_v1`, clicks the header CTA, confirms the modal opens immediately — proving the manual bypass independent of the auto-trigger's own frequency cap.
- `Header.astro` / `Footer.astro` themselves are not unit-tested directly (matches the existing convention — no `.astro` container testing is set up in this repo); their thin `<script>` wiring is covered by the e2e case above, same as the pre-existing `#footer-cta-button` wiring.

### 7.1 GEO-32 style note applied — two deliberate deviations

GEO-32's style note (posted in the GEO-32 issue thread) was applied as specified: gold pill + gift icon for the header (rightmost element after the social icons, `hidden md:inline-flex`), a divider + gold-highlighted full-width row for the mobile menu (kept as a `showGiftCta`-gated block decoupled from `variant`, same structural choice as before — the note's "append inside the `variant === 'main'` `<ul>`" is a where-in-practice note, not a hard requirement, and legal pages are already excluded via `isPathExcluded()` so the two are behaviorally identical), and a quiet underlined secondary link under the footer's consultation button, wrapped in a `space-y-3` group. Copy, icon (Heroicons v2 outline "gift"), and positioning match the note exactly.

Two color tokens were swapped for WCAG AA contrast reasons (measured with the WCAG 2 relative-luminance formula, not eyeballed):

- **Header pill:** note specifies `bg-gold-100 text-gold-700` (3.70:1 — fails AA's 4.5:1 for this 14px/font-medium text). Shipped with `text-gold-800` instead (5.41:1, passes). The decorative `aria-hidden` icon keeps the note's `text-gold-600`, since icon contrast isn't held to the text ratio here.
- **Footer link:** note specifies `text-navy-400` on the `bg-sage-50` CTA block (2.71:1 — fails badly). Shipped with `text-navy-600` instead, the same token this component already used pre-GEO-32 and that QA independently verified at 5.65:1 on this exact background during the GEO-33 QA pass.
- Not changed: the mobile-menu gift row uses `text-gold-800` on `bg-gold-50` (5.70:1) rather than the note's ambiguous "same gold 'active' tokens" (which, if read as the literal existing `text-gold-600` active-nav token, measures 2.76:1 and fails — a pre-existing contrast issue in that unrelated nav-active pattern, out of scope for GEO-33; not touched here).

An automated axe scan (`@axe-core/playwright`) against the live dev server confirmed zero `color-contrast` violations on any of the three new gift-CTA elements after this substitution; the scan does still flag one pre-existing, unrelated `color-contrast` violation on the "active section" nav-link style (both desktop `a[data-section="home"]` and the mobile menu's active-item equivalent) — present before this change, not introduced by it.

All three CTAs remained native `<button type="button">` elements rather than the note's `<a href="#">` markup sketch, per the existing GEO-33 implementation note above (Enter **and** Space activation per the issue's own AC, and no fake `#` href for a JS-only action) — a decision already in place before the style note landed, still correct after applying it.
