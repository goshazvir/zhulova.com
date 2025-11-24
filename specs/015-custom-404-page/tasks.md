# Tasks: Custom 404 Error Page

**Input**: Design documents from `/specs/015-custom-404-page/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, quickstart.md ✅

**Tests**: E2E tests included (Playwright) - accessibility and navigation verification
**Organization**: Tasks organized by user story for independent validation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Project type**: Astro static site
- **Pages**: `src/pages/`
- **Layouts**: `src/layouts/`
- **Tests**: `tests/e2e/`

---

## Phase 1: Setup (Verification) ✅

**Purpose**: Verify existing components and dependencies are available

- [x] T001 Verify BaseLayout.astro exists and supports custom title/description in `src/layouts/BaseLayout.astro`
- [x] T002 [P] Verify Tailwind CSS color tokens (navy, gold) in `tailwind.config.mjs`
- [x] T003 [P] Verify Playfair Display and Inter fonts loaded in `src/styles/global.css`

---

## Phase 2: Foundational (Core Page Structure) ✅

**Purpose**: Create the basic 404 page file - BLOCKS all user stories

**⚠️ CRITICAL**: All user story work modifies this file

- [x] T004 Create `src/pages/404.astro` with BaseLayout wrapper and basic structure
- [x] T005 Add SEO meta tags (title, description) in Ukrainian to `src/pages/404.astro`

**Checkpoint**: 404 page exists and renders with layout ✅

---

## Phase 3: User Story 1 - Lost Visitor Recovery (Priority: P1) 🎯 MVP ✅

**Goal**: Visitor can recover from 404 error and navigate back to home

**Independent Test**: Visit `/nonexistent-page`, see 404 indicator, click "На головну" → redirected to home

### Implementation for User Story 1

- [x] T006 [US1] Add "404" decorative text with `aria-hidden="true"` in `src/pages/404.astro`
- [x] T007 [US1] Add semantic `<h1>` with Ukrainian message "Сторінку не знайдено" in `src/pages/404.astro`
- [x] T008 [US1] Add empathetic Ukrainian paragraph explaining the error in `src/pages/404.astro`
- [x] T009 [US1] Add primary CTA button "На головну" linking to "/" in `src/pages/404.astro`
- [x] T010 [US1] Verify HTTP 404 status code is returned (Astro handles automatically)

**Checkpoint**: MVP complete - visitor can see error and return home ✅

---

## Phase 4: User Story 2 - Brand Experience Continuity (Priority: P2) ✅

**Goal**: 404 page matches "Soft Luxury Coach" aesthetic with animation

**Independent Test**: Compare 404 page styling to home page - navy/gold colors, Playfair font visible

### Implementation for User Story 2

- [x] T011 [US2] Apply navy-900 color to "404" text and heading in `src/pages/404.astro`
- [x] T012 [US2] Apply Playfair Display font (`font-serif`) to "404" and heading in `src/pages/404.astro`
- [x] T013 [US2] Apply navy-600 color to secondary links (accessible contrast) in `src/pages/404.astro`
- [x] T014 [US2] Add CSS fade-in animation keyframes in `src/pages/404.astro` `<style>` section
- [x] T015 [US2] Apply animation class to main content container in `src/pages/404.astro`
- [x] T016 [US2] Add `@media (prefers-reduced-motion: reduce)` to disable animation in `src/pages/404.astro`

**Checkpoint**: Page has luxury aesthetic with smooth animation ✅

---

## Phase 5: User Story 3 - Mobile Visitor Experience (Priority: P2) ✅

**Goal**: Mobile visitors have excellent experience with proper touch targets

**Independent Test**: Test at 320px, 768px, 1024px widths - no horizontal scroll, buttons tappable

### Implementation for User Story 3

- [x] T017 [US3] Add responsive padding classes (`px-4 sm:px-6 lg:px-8`) in `src/pages/404.astro`
- [x] T018 [US3] Add responsive text sizing (`text-6xl sm:text-8xl lg:text-9xl`) for "404" in `src/pages/404.astro`
- [x] T019 [US3] Add `min-h-[48px]` to primary CTA button for touch target in `src/pages/404.astro`
- [x] T020 [US3] Add `min-h-[48px]` with flex alignment to secondary links in `src/pages/404.astro`
- [x] T021 [US3] Add responsive flex layout (`flex-col sm:flex-row`) to secondary CTAs in `src/pages/404.astro`
- [x] T022 [US3] Add `max-w-md w-full` container for content centering in `src/pages/404.astro`

**Checkpoint**: Page works on all device sizes with proper touch targets ✅

---

## Phase 6: User Story 4 - Conversion Opportunity (Priority: P3) ✅

**Goal**: Secondary CTAs provide paths to courses and consultation

**Independent Test**: Click "Курси" → courses page, click "Консультація" → contacts page

### Implementation for User Story 4

- [x] T023 [US4] Add secondary link "Переглянути курси" linking to "/courses" in `src/pages/404.astro`
- [x] T024 [US4] Add secondary link "Зв'язатися зі мною" linking to "/contacts" in `src/pages/404.astro`
- [x] T025 [US4] Add separator dot between secondary links with `aria-hidden="true"` in `src/pages/404.astro`
- [x] T026 [US4] Style secondary links with hover/focus transitions in `src/pages/404.astro`

**Checkpoint**: All conversion paths functional ✅

---

## Phase 7: User Story 5 - Accessible Experience (Priority: P2) ✅

**Goal**: WCAG AA compliance with keyboard navigation and screen reader support

**Independent Test**: Navigate entire page with Tab key only, all elements focusable with visible indicators

### Implementation for User Story 5

- [x] T027 [US5] Add focus ring classes (`focus:ring-2 focus:ring-gold-500`) to primary CTA in `src/pages/404.astro`
- [x] T028 [US5] Add focus classes (`focus:ring-2 focus:ring-gold-500`) to secondary links in `src/pages/404.astro`
- [x] T029 [US5] Verify heading hierarchy (single h1, no skipped levels) in `src/pages/404.astro`
- [x] T030 [US5] Verify color contrast meets 4.5:1 ratio for all text in `src/pages/404.astro`
- [x] T031 [US5] Test keyboard Tab order is logical (h1 → primary CTA → secondary links)

**Checkpoint**: Zero accessibility violations ✅

---

## Phase 8: Polish & Validation ✅

**Purpose**: Final testing and verification across all stories

### E2E Tests

- [x] T032 [P] Create E2E test file `tests/e2e/404-page.spec.ts`
- [x] T033 [P] Add test: visiting invalid URL shows 404 page in `tests/e2e/404-page.spec.ts`
- [x] T034 [P] Add test: "На головну" button navigates to home in `tests/e2e/404-page.spec.ts`
- [x] T035 [P] Add test: secondary links navigate correctly in `tests/e2e/404-page.spec.ts`
- [x] T036 [P] Add test: axe-core accessibility check passes in `tests/e2e/404-page.spec.ts`

### Validation

- [x] T037 Run `npm run build` and verify no TypeScript errors
- [ ] T038 Run Lighthouse audit on 404 page (target: accessibility 90+, performance 85+)
- [ ] T039 Test on Vercel preview deployment - verify custom 404 serves correctly
- [x] T040 Manual test: keyboard navigation through all interactive elements (verified via E2E)
- [x] T041 Manual test: responsive design at 320px, 768px, 1024px, 1440px viewports (verified via E2E)

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ✅ ────────────────────────────────────────────┐
                                                               │
Phase 2 (Foundational) ✅ ─────────────────────────────────────┤
         │                                                     │
         ▼                                                     │
Phase 3 (US1 - MVP) ✅ ────────────────────────────────────────┤
         │                                                     │
         ├──► Phase 4 (US2 - Brand) ✅ ────────────────────────┤
         │                                                     │
         ├──► Phase 5 (US3 - Mobile) ✅ ───────────────────────┤
         │                                                     │
         ├──► Phase 6 (US4 - Conversion) ✅ ───────────────────┤
         │                                                     │
         └──► Phase 7 (US5 - Accessibility) ✅ ────────────────┤
                                                               │
Phase 8 (Polish) ✅ ◄──────────────────────────────────────────┘
```

### User Story Dependencies

| Story | Depends On | Can Parallelize With | Status |
|-------|------------|---------------------|--------|
| US1 (P1) | Phase 2 | None (must complete first) | ✅ |
| US2 (P2) | US1 | US3, US4, US5 | ✅ |
| US3 (P2) | US1 | US2, US4, US5 | ✅ |
| US4 (P3) | US1 | US2, US3, US5 | ✅ |
| US5 (P2) | US1 | US2, US3, US4 | ✅ |

---

## Implementation Summary

### Completed: 2025-11-24

| Phase | Tasks | Status |
|-------|-------|--------|
| Setup | 3 | ✅ Complete |
| Foundational | 2 | ✅ Complete |
| US1 (MVP) | 5 | ✅ Complete |
| US2 (Brand) | 6 | ✅ Complete |
| US3 (Mobile) | 6 | ✅ Complete |
| US4 (Conversion) | 4 | ✅ Complete |
| US5 (Accessibility) | 5 | ✅ Complete |
| Polish | 10 | ✅ 8/10 Complete |
| **Total** | **41** | **39/41 Complete** |

### Files Created/Modified

- `src/pages/404.astro` - Custom 404 error page
- `tests/e2e/404-page.spec.ts` - E2E tests (14 tests, all passing)

### Accessibility Fix Applied

- Changed secondary link color from `gold-600` to `navy-600` for WCAG AA contrast compliance
- Added underline decoration for visual distinction
- axe-core audit passes with zero violations

---

## Remaining Tasks

- T038: Lighthouse audit (deferred - requires local server)
- T039: Vercel preview deployment test (requires push to remote)
