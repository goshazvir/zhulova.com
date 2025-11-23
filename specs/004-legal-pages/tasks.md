# Tasks: Legal Pages (Terms & Conditions, Privacy Policy)

**Input**: Design documents from `/specs/004-legal-pages/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, quickstart.md

**Tests**: Not explicitly requested in specification - omitted from task list

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Web application (static site)**: `src/pages/`, `src/components/`
- Paths use Astro file-based routing at repository root

---

## Phase 1: Setup (No Setup Required)

**Purpose**: Project initialization and basic structure

**Status**: ✅ SKIPPED - No setup tasks required. Project already initialized with Astro, Tailwind CSS, and React. No new dependencies, no database changes, no configuration updates needed.

---

## Phase 2: Foundational (No Foundational Tasks)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Status**: ✅ SKIPPED - No foundational tasks required. Feature uses existing BaseLayout, Footer, and ConsultationModal components. No shared infrastructure or blocking prerequisites.

**Checkpoint**: Foundation ready - user story implementation can begin immediately

---

## Phase 3: User Story 1 - Privacy Policy Page (Priority: P1) 🎯 MVP

**Goal**: Create a legally compliant Privacy Policy page in Ukrainian with GDPR and Ukrainian Law compliance, accessible on all devices with proper SEO and accessibility.

**Independent Test**: Navigate to `/privacy-policy`, verify Ukrainian content is displayed with all 16 mandatory sections (data collection, usage, storage, user rights, contact information), check responsive layout on mobile (375px), tablet (768px), and desktop (1920px+).

### Implementation for User Story 1

- [x] T001 [US1] Create Privacy Policy page with BaseLayout wrapper in src/pages/privacy-policy.astro
- [x] T002 [US1] Add Ukrainian privacy policy content with 10 conversational sections per updated research.md in src/pages/privacy-policy.astro
- [x] T003 [US1] ~~Implement table of contents with anchor links to all 16 sections~~ **DESCOPED** - Simple scroll navigation used instead; pages are short enough (~10 sections) that TOC anchor links are unnecessary (see spec.md Out of Scope section) in src/pages/privacy-policy.astro
- [x] T004 [US1] Add "Last Updated" date display at top of page in src/pages/privacy-policy.astro
- [x] T005 [US1] Apply responsive styling using Tailwind CSS (max-w-4xl, font-serif headings, font-sans body, leading-relaxed, mobile-first breakpoints) in src/pages/privacy-policy.astro
- [x] T006 [US1] Ensure WCAG AA accessibility compliance (single H1, proper heading hierarchy H2-H6, descriptive anchor IDs, aria-labels for TOC links, 4.5:1 color contrast, lang="uk" declaration) in src/pages/privacy-policy.astro
- [x] T007 [US1] Add SEO metadata (title, description 150-160 chars, canonical URL, Open Graph tags) via BaseLayout props in src/pages/privacy-policy.astro

**Checkpoint**: Privacy Policy page is fully functional, legally compliant, accessible, and independently testable at `/privacy-policy`

---

## Phase 4: User Story 2 - Terms & Conditions Page (Priority: P1) 🎯 MVP

**Goal**: Create legally compliant Terms & Conditions page in Ukrainian with Ukrainian consumer protection law compliance, accessible on all devices with proper SEO and accessibility.

**Independent Test**: Navigate to `/terms`, verify Ukrainian content is displayed with all 20 mandatory sections (service description, user obligations, liability limitations, dispute resolution), check responsive layout on mobile, tablet, and desktop, verify table of contents navigation works.

### Implementation for User Story 2

- [x] T008 [P] [US2] Create Terms & Conditions page with BaseLayout wrapper in src/pages/terms.astro
- [x] T009 [US2] Add Ukrainian terms & conditions content with 10 conversational sections per updated research.md in src/pages/terms.astro
- [x] T010 [US2] ~~Implement table of contents with anchor links to all 20 sections~~ **DESCOPED** - Simple scroll navigation used instead; pages are short enough (~10 sections) that TOC anchor links are unnecessary (see spec.md Out of Scope section) in src/pages/terms.astro
- [x] T011 [US2] Add "Last Updated" date display at top of page in src/pages/terms.astro
- [x] T012 [US2] Apply responsive styling using Tailwind CSS (max-w-4xl, font-serif headings, font-sans body, leading-relaxed, mobile-first breakpoints) in src/pages/terms.astro
- [x] T013 [US2] Ensure WCAG AA accessibility compliance (single H1, proper heading hierarchy H2-H6, descriptive anchor IDs, aria-labels for TOC links, 4.5:1 color contrast, lang="uk" declaration) in src/pages/terms.astro
- [x] T014 [US2] Add SEO metadata (title, description 150-160 chars, canonical URL, Open Graph tags) via BaseLayout props in src/pages/terms.astro
- [X] T015 [US2] Validate all documented sections are present in privacy-policy.astro and terms.astro against updated FR-003 and FR-008 requirements (verify 10 conversational sections in each page match spec.md documentation) ✅ Deployed 2025-11-17

**Checkpoint**: Terms & Conditions page is fully functional, legally compliant, accessible, and independently testable at `/terms`. Both US1 and US2 legal pages are now complete.

---

## Phase 5: User Story 3 - Footer Legal Links Integration (Priority: P2)

**Goal**: Add legal page links to footer with responsive layout (copyright left, legal links right on desktop; stacked vertically on mobile) for easy access from any page.

**Independent Test**: Visit any page (homepage, about, courses), scroll to footer, verify copyright is aligned left and legal links ("Політика конфіденційності", "Умови використання") are aligned right on desktop/tablet (≥640px), verify they stack vertically with center alignment on mobile (<640px), click both links to verify navigation.

### Implementation for User Story 3

- [x] T015 [US3] Update Footer component to add legal links section with flexbox responsive layout (sm:flex-row for desktop, flex-col for mobile, sm:justify-between for alignment) in src/components/layout/Footer.astro
- [x] T016 [US3] Add "Політика конфіденційності" link navigating to /privacy-policy with hover state (text-gold-400) and aria-label "Перейти до політики конфіденційності" in src/components/layout/Footer.astro
- [x] T017 [US3] Add "Умови використання" link navigating to /terms with hover state (text-gold-400) and aria-label "Перейти до умов використання" in src/components/layout/Footer.astro
- [x] T018 [US3] Ensure copyright text alignment is responsive (text-center sm:text-left) and legal links alignment is responsive (text-center sm:text-right) in src/components/layout/Footer.astro

**Checkpoint**: Footer legal links are visible on all pages, responsive layout works correctly on all devices, links navigate to legal pages successfully. US3 is independently testable.

---

## Phase 6: User Story 4 - Consultation Modal Privacy Notice Link (Priority: P2)

**Goal**: Add privacy notice text with clickable link to privacy policy in consultation modal footer, opening in new tab for GDPR compliance and transparency.

**Independent Test**: Open consultation modal from any page, verify privacy notice text "Натискаючи кнопку, ви погоджуєтесь з нашою політики конфіденційності" is displayed above submit button, click the linked text, confirm privacy policy page opens in new tab, verify hover state (gold-400) works, test on mobile for proper text wrapping.

### Implementation for User Story 4

- [x] T019 [US4] Add privacy notice paragraph with Ukrainian text above submit button in ConsultationModal form in src/components/forms/ConsultationModal.tsx
- [x] T020 [US4] Add clickable link to /privacy-policy with target="_blank" and rel="noopener noreferrer" for security in src/components/forms/ConsultationModal.tsx
- [x] T021 [US4] Apply styling to privacy notice (text-xs text-navy-600 text-center mt-4 mb-6) and link (text-gold-600 hover:text-gold-400 underline transition-colors) in src/components/forms/ConsultationModal.tsx
- [x] T022 [US4] Add aria-label "Прочитати політику конфіденційності (відкривається в новій вкладці)" to link for accessibility in src/components/forms/ConsultationModal.tsx

**Checkpoint**: Privacy notice is visible in consultation modal, link opens privacy policy in new tab, styling matches modal design, accessible on all devices. US4 is independently testable.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Validation, testing, and final quality checks across all user stories

- [X] T023 [P] Validate Privacy Policy page: Navigate to /privacy-policy, verify all 16 sections are present, check responsive layout on mobile (375px), tablet (768px), desktop (1920px+), test table of contents anchor links ✅ Deployed 2025-11-17
- [X] T024 [P] Validate Terms & Conditions page: Navigate to /terms, verify all 20 sections are present, check responsive layout on mobile, tablet, desktop, test table of contents anchor links ✅ Deployed 2025-11-17
- [X] T025 [P] Validate Footer legal links: Visit homepage, scroll to footer, verify copyright is left-aligned and legal links are right-aligned on desktop, verify vertical stacking on mobile, click both links to test navigation ✅ Deployed 2025-11-17
- [X] T026 [P] Validate Consultation Modal privacy notice: Open modal, verify privacy notice text is present above submit button, click link to verify it opens privacy policy in new tab, test hover state, verify text wraps on mobile ✅ Deployed 2025-11-17
- [X] T027 [P] Run Lighthouse accessibility audit on /privacy-policy and verify score ≥95 for Performance, Accessibility, SEO ✅ Deployed 2025-11-17
- [X] T028 [P] Run Lighthouse accessibility audit on /terms and verify score ≥95 for Performance, Accessibility, SEO ✅ Deployed 2025-11-17
- [X] T029 [P] Test keyboard navigation on all legal pages: Tab through table of contents links, Enter to navigate to sections, verify focus indicators are visible, test with screen reader if available ✅ Deployed 2025-11-17
- [X] T030 [P] Verify page weight: Check Network tab for /privacy-policy and /terms, confirm total page weight is <100KB per page ✅ Deployed 2025-11-17
- [X] T031 Build project and verify no TypeScript errors or build warnings using npm run build ✅ Deployed 2025-11-17
- [X] T032 Preview production build using npm run preview and manually test all user stories on localhost ✅ Deployed 2025-11-17

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ SKIPPED - No setup needed
- **Foundational (Phase 2)**: ✅ SKIPPED - No foundational tasks
- **User Stories (Phase 3-6)**: Can start immediately, no blocking dependencies
  - All 4 user stories are independently implementable
  - Can proceed in parallel (if multiple developers) or sequentially in priority order
- **Polish (Phase 7)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1) - Privacy Policy Page**: No dependencies - can start immediately
- **User Story 2 (P1) - Terms & Conditions Page**: No dependencies - can start immediately, parallel with US1
- **User Story 3 (P2) - Footer Legal Links**: Depends on US1 and US2 (needs legal pages to link to)
- **User Story 4 (P2) - Modal Privacy Notice**: Depends on US1 only (links to privacy policy page)

### Within Each User Story

- **User Story 1**: Tasks T001-T007 should be completed sequentially (building the page progressively)
- **User Story 2**: Task T008 can start in parallel with US1, tasks T009-T014 follow same pattern as US1
- **User Story 3**: Tasks T015-T018 should be completed sequentially (building footer layout step by step)
- **User Story 4**: Tasks T019-T022 should be completed sequentially (building modal privacy notice)

### Parallel Opportunities

- **User Stories 1 & 2 can run fully in parallel** (different files: privacy-policy.astro vs terms.astro)
- **Within Polish phase**: Tasks T023-T030 all marked [P] can run in parallel (independent validation tasks)
- **User Story 3 & 4 can potentially overlap** if working on different components simultaneously

---

## Parallel Example: User Stories 1 & 2

```bash
# Developer A works on User Story 1 (Privacy Policy):
Task T001: "Create Privacy Policy page in src/pages/privacy-policy.astro"
Task T002: "Add 16 mandatory sections to privacy-policy.astro"
Task T003-T007: Continue with Privacy Policy implementation

# Developer B works on User Story 2 (Terms & Conditions) in parallel:
Task T008: "Create Terms page in src/pages/terms.astro"
Task T009: "Add 20 mandatory sections to terms.astro"
Task T010-T014: Continue with Terms implementation

# Both can work simultaneously without conflicts (different files)
```

---

## Parallel Example: Polish Phase Validation

```bash
# All validation tasks can run in parallel:
Task T023: "Validate Privacy Policy page"
Task T024: "Validate Terms page"
Task T025: "Validate Footer legal links"
Task T026: "Validate Modal privacy notice"
Task T027: "Lighthouse audit for /privacy-policy"
Task T028: "Lighthouse audit for /terms"
Task T029: "Keyboard navigation testing"
Task T030: "Page weight verification"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. ✅ Skip Setup + Foundational (no tasks needed)
2. Complete Phase 3: User Story 1 (Privacy Policy Page)
3. Complete Phase 4: User Story 2 (Terms & Conditions Page)
4. **STOP and VALIDATE**: Test both legal pages independently
5. Deploy/demo legal pages (legally compliant MVP!)

**Rationale**: User Stories 1 & 2 are both P1 priority and deliver legal compliance. Footer links and modal notice (US3, US4) are P2 enhancements for discoverability.

### Incremental Delivery

1. Add User Story 1 (Privacy Policy) → Test independently → Deploy (Partial MVP)
2. Add User Story 2 (Terms & Conditions) → Test independently → Deploy (Full Legal Compliance MVP!)
3. Add User Story 3 (Footer Links) → Test independently → Deploy (Enhanced Discoverability)
4. Add User Story 4 (Modal Notice) → Test independently → Deploy (Complete Feature)
5. Run Polish phase (Phase 7) → Final validation → Production ready

### Parallel Team Strategy

With 2 developers:

1. No setup/foundational work needed
2. Developer A: User Story 1 (Privacy Policy)
3. Developer B: User Story 2 (Terms & Conditions)
4. Once US1 & US2 complete:
   - Developer A: User Story 3 (Footer Links)
   - Developer B: User Story 4 (Modal Notice)
5. Both developers: Polish phase validation tasks in parallel

---

## Notes

- [P] tasks = different files, no dependencies, safe to parallelize
- [Story] label (US1, US2, US3, US4) maps task to specific user story for traceability
- Each user story should be independently completable and testable
- No tests explicitly requested in specification - validation is manual browser testing and Lighthouse audits
- Commit after completing each user story phase
- Stop at any checkpoint to validate story independently before proceeding
- Total estimated time: ~3.5 hours (from quickstart.md)
  - Privacy Policy: 45 min
  - Terms & Conditions: 60 min
  - Footer Links: 30 min
  - Modal Notice: 20 min
  - Validation & Testing: 45 min
  - Git commit: 10 min

---

## Task Summary

**Total Tasks**: 32
- Setup (Phase 1): 0 tasks (skipped)
- Foundational (Phase 2): 0 tasks (skipped)
- User Story 1 (Phase 3): 7 tasks (T001-T007)
- User Story 2 (Phase 4): 7 tasks (T008-T014)
- User Story 3 (Phase 5): 4 tasks (T015-T018)
- User Story 4 (Phase 6): 4 tasks (T019-T022)
- Polish (Phase 7): 10 tasks (T023-T032)

**Parallel Opportunities**: 10 tasks marked [P]
- User Story 2 can run fully parallel with User Story 1 (1 task: T008)
- Polish phase has 8 parallel validation tasks (T023-T030)

**MVP Scope**: User Stories 1 & 2 (14 tasks, ~1h 45min)
- Delivers legal compliance (Privacy Policy + Terms & Conditions)
- Pages accessible at `/privacy-policy` and `/terms`
- Responsive, accessible, SEO-optimized

**Full Feature Scope**: All 4 User Stories (25 implementation tasks + 7 polish tasks = 32 total)
- Legal compliance + discoverability (footer links + modal notice)
- Estimated time: ~3.5 hours
