# Tasks: PageSpeed Accessibility & Performance Optimization

**Input**: Design documents from `/specs/017-pagespeed-a11y/`
**Prerequisites**: plan.md, spec.md, research.md, quickstart.md

**Tests**: Not explicitly requested - verification via PageSpeed Insights.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1-US5)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Verification)

**Purpose**: Verify branch and environment ready

- [x] T001 Verify branch `017-pagespeed-a11y` is checked out
- [x] T002 Run `npm run dev` to confirm development server works
- [x] T003 Run PageSpeed Insights on https://zhulova.com to baseline current scores (Accessibility ~90, Performance ~75-85)

**Checkpoint**: Environment ready, baseline metrics captured

---

## Phase 2: User Story 1 - Screen Reader Navigation (Priority: P1) 🎯

**Goal**: Fix ARIA tablist structure so screen readers correctly announce tabs and their states

**Independent Test**: Run PageSpeed Insights → verify zero ARIA warnings for QuestionsSection

### Implementation for User Story 1

- [x] T004 [US1] Add `role="tablist"` and `aria-label` to tab container in `src/components/sections/QuestionsSection.astro`
- [x] T005 [US1] Add `aria-controls` attribute to personal-tab button linking to personal-panel in `src/components/sections/QuestionsSection.astro`
- [x] T006 [US1] Add `aria-controls` attribute to business-tab button linking to business-panel in `src/components/sections/QuestionsSection.astro`
- [x] T007 [US1] Add `tabindex="0"` to active tab and `tabindex="-1"` to inactive tab in `src/components/sections/QuestionsSection.astro`
- [x] T008 [US1] Update `switchTab()` function to manage `tabindex` attributes in `src/components/sections/QuestionsSection.astro`
- [x] T009 [US1] Add keyboard navigation (arrow keys) event handler in `src/components/sections/QuestionsSection.astro`
- [x] T010 [US1] Test with VoiceOver/NVDA to verify tab announcements work correctly

**Checkpoint**: US1 complete - ARIA structure validated, keyboard navigation works

---

## Phase 3: User Story 2 - Low Vision User Reading Content (Priority: P1)

**Goal**: Fix color contrast for gold text to meet WCAG AA 4.5:1 requirement

**Independent Test**: Run PageSpeed Insights → verify zero contrast warnings

### Implementation for User Story 2

- [x] T011 [P] [US2] Change `text-gold-600` to `text-gold-800` for statistics numbers in `src/components/sections/StatsSection.astro`
- [x] T012 [P] [US2] Change `text-gold-600` to `text-gold-700` for profession labels in `src/components/sections/CaseStudiesSection.astro`
- [x] T013 [P] [US2] Verify key result badge contrast (gold-700 on gold-50) is sufficient in `src/components/sections/CaseStudiesSection.astro`
- [x] T014 [P] [US2] Verify quote icon is decorative (`aria-hidden="true"`) and doesn't need contrast fix in `src/components/sections/TestimonialsSection.astro`
- [x] T015 [US2] Run WebAIM Contrast Checker to verify all gold text meets 4.5:1 ratio

**Checkpoint**: US2 complete - all text passes WCAG AA contrast requirements

---

## Phase 4: User Story 3 - Mobile Touch Navigation (Priority: P2)

**Goal**: Increase carousel indicator touch targets to 44x44px minimum

**Independent Test**: Run PageSpeed Insights on mobile → verify zero touch target warnings

### Implementation for User Story 3

- [x] T016 [US3] Restructure carousel indicator buttons to use inner span for visual dot in `src/components/sections/CaseStudiesSection.astro`
- [x] T017 [US3] Add `min-w-[44px] min-h-[44px]` classes to indicator buttons in `src/components/sections/CaseStudiesSection.astro`
- [x] T018 [US3] Update indicator container gap from `gap-2` to `gap-1` to maintain spacing in `src/components/sections/CaseStudiesSection.astro`
- [x] T019 [US3] Update JavaScript to style inner `.indicator-dot` span instead of button in `src/components/sections/CaseStudiesSection.astro`
- [x] T020 [US3] Test on mobile device to verify tap accuracy is improved

**Checkpoint**: US3 complete - touch targets meet 44x44px requirement

---

## Phase 5: User Story 4 - Fast Page Load on Mobile (Priority: P1)

**Goal**: Reduce LCP from 3.1s to <2.5s by fixing render-blocking resources and forced reflows

**Independent Test**: Run PageSpeed Insights on mobile → verify LCP < 2.5s, no forced reflow warnings

### Implementation for User Story 4

- [x] T021 [P] [US4] Add `<link rel="preconnect">` for Google Fonts in `src/layouts/BaseLayout.astro`
- [x] T022 [P] [US4] Add `font-display: swap` to font-face declarations in `src/styles/global.css`
- [x] T023 [US4] Cache `carousel.offsetWidth` at initialization to avoid forced reflows in `src/components/sections/CaseStudiesSection.astro`
- [x] T024 [US4] Add ResizeObserver to update cached width on viewport changes in `src/components/sections/CaseStudiesSection.astro`
- [x] T025 [US4] Verify hero image has `fetchpriority="high"` and `loading="eager"` in `src/components/sections/HeroSection.astro`
- [x] T026 [US4] Run PageSpeed Insights to verify LCP improvement

**Checkpoint**: US4 complete - LCP < 2.5s, no forced reflows

---

## Phase 6: User Story 5 - Optimized Resource Loading (Priority: P2)

**Goal**: Serve optimally sized hero image for different viewports (save 19-52KB)

**Independent Test**: Run PageSpeed Insights → verify zero "improve image delivery" warnings

### Implementation for User Story 5

- [x] T027 [US5] Convert hero image to use Astro `<Image>` component with `widths` prop in `src/components/sections/HeroSection.astro`
- [x] T028 [US5] Add `sizes` attribute for responsive image selection: `(max-width: 640px) 320px, (max-width: 768px) 480px, 600px`
- [x] T029 [US5] Verify generated srcset includes 320px, 480px, 600px variants after build
- [ ] T030 [US5] Test on mobile to verify smaller image is served (check Network tab in DevTools)
- [ ] T031 [US5] Run PageSpeed Insights to verify image delivery warnings resolved

**Checkpoint**: US5 complete - responsive images serving appropriate sizes

---

## Phase 7: Polish & Verification

**Purpose**: Final validation and cross-cutting concerns

- [x] T032 Run `npm run build` to verify no TypeScript errors
- [ ] T033 Run PageSpeed Insights on production and verify Accessibility score = 100
- [ ] T034 Run PageSpeed Insights on production and verify Performance score ≥ 90
- [ ] T035 Verify LCP < 2.5s on mobile
- [x] T036 Test keyboard navigation across entire homepage (Tab, Arrow keys, Enter)
- [x] T037 [P] Update spec.md status from "Draft" to "Implementation Complete"
- [x] T038 [P] Document any design decisions in quickstart.md if implementation differed from plan

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
┌─────────────────────────────────────────────────────────┐
│  Phase 2 (US1: ARIA)           ─┐                       │
│  Phase 3 (US2: Contrast)       ─┼─ Accessibility        │
│  Phase 4 (US3: Touch)          ─┘  (can run parallel)   │
│                                                         │
│  Phase 5 (US4: LCP/Reflow)     ─┐                       │
│  Phase 6 (US5: Images)         ─┘  Performance          │
└─────────────────────────────────────────────────────────┘
    ↓
Phase 7 (Polish)
```

### User Story Dependencies

| Story | Priority | Files | Dependencies |
|-------|----------|-------|--------------|
| US1 | P1 | QuestionsSection.astro | None |
| US2 | P1 | StatsSection, CaseStudiesSection, TestimonialsSection | None |
| US3 | P2 | CaseStudiesSection.astro | None (different part than US2) |
| US4 | P1 | BaseLayout, global.css, CaseStudiesSection, HeroSection | None |
| US5 | P2 | HeroSection.astro | US4 (verify fetchpriority first) |

### Parallel Opportunities

**Within Phase 3 (US2)**:
```
T011 StatsSection.astro        ─┐
T012 CaseStudiesSection.astro  ─┼─ All parallel (different sections)
T014 TestimonialsSection.astro ─┘
```

**Within Phase 5 (US4)**:
```
T021 BaseLayout.astro (preconnect)  ─┐
T022 global.css (font-display)      ─┘  Parallel
```

**Across User Stories**:
```
US1: T004-T010 (QuestionsSection)     ─┐
US2: T011-T015 (Multiple sections)    ─┼─ All accessibility
US3: T016-T020 (CaseStudiesSection)   ─┘  can run parallel

US4: T021-T026 (LCP optimization)     ─┐
US5: T027-T031 (Image optimization)   ─┘  Performance parallel
```

---

## Implementation Strategy

### Recommended Execution Order

**Step 1: Accessibility First (US1 + US2 + US3)**
- These are simpler changes with predictable outcomes
- Achieves A11y 100 goal quickly

**Step 2: Performance (US4 + US5)**
- More complex, may require iteration
- Measure after each change to track improvement

### MVP First

1. Complete Phases 1-4 (Setup + US1 + US2 + US3)
2. **VALIDATE**: PageSpeed A11y = 100
3. Complete Phases 5-6 (US4 + US5)
4. **VALIDATE**: PageSpeed Performance ≥ 90, LCP < 2.5s
5. Complete Phase 7 (Polish)

**Estimated Total**: 2-3 hours

---

## Summary

| Phase | Tasks | User Story | Focus |
|-------|-------|------------|-------|
| 1: Setup | T001-T003 | — | Baseline |
| 2: ARIA | T004-T010 | US1 (P1) | Accessibility |
| 3: Contrast | T011-T015 | US2 (P1) | Accessibility |
| 4: Touch | T016-T020 | US3 (P2) | Accessibility |
| 5: LCP | T021-T026 | US4 (P1) | Performance |
| 6: Images | T027-T031 | US5 (P2) | Performance |
| 7: Polish | T032-T038 | — | Verification |

**Total Tasks**: 38
**Accessibility Tasks**: 20 (US1-US3)
**Performance Tasks**: 11 (US4-US5)
**Verification Tasks**: 7
**Estimated Time**: 2-3 hours

---

## Notes

- [P] tasks = different files, no dependencies
- No tests requested - verification via PageSpeed Insights
- Commit after each user story phase for clean history
- Performance changes may need iteration based on PageSpeed results
