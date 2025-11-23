# Implementation Tasks: Align Base Infrastructure Documentation

**Feature**: 008-align-base-infra-docs | **Date**: 2025-11-23 | **Status**: Ready for Implementation

## Overview

This feature aligns 001-base-infrastructure specification with actual implementation completed 2025-11-16. Documentation-only feature - zero code changes to src/ files. All tasks involve editing markdown files in specs/001-base-infrastructure/ directory.

**Total Tasks**: 62 tasks across 7 phases

## Task Format

`- [ ] T### [P#] [US#] Description with file path`

- **T###**: Task ID (T001-T062)
- **P#**: Priority (P1=Critical, P2=Important, P3=Nice-to-have)
- **US#**: User Story (US1-US5)

---

## Phase 1: Setup & Validation (5 tasks)

**Objective**: Prepare environment and verify prerequisites

- [x] T001 [P1] [--] Checkout feature branch: `git checkout 008-align-base-infra-docs`
- [x] T002 [P1] [--] Verify target files exist: `ls -la specs/001-base-infrastructure/spec.md specs/001-base-infrastructure/plan.md`
- [x] T003 [P1] [--] Verify reference docs exist: `ls -la specs/008-align-base-infra-docs/{research.md,data-model.md,quickstart.md}`
- [x] T004 [P1] [--] Verify implementation files accessible: `ls -la src/layouts/BaseLayout.astro src/components/layout/Header.astro src/components/layout/Footer.astro`
- [x] T005 [P1] [--] Verify configuration files accessible: `ls -la tailwind.config.mjs astro.config.mjs src/styles/global.css`

---

## Phase 2: Foundational Research Review (7 tasks)

**Objective**: Load research findings into context before implementation

- [x] T006 [P1] [--] Read research.md to understand all 11 identified inconsistencies: `specs/008-align-base-infra-docs/research.md`
- [x] T007 [P1] [--] Read data-model.md to understand entities and validation rules: `specs/008-align-base-infra-docs/data-model.md`
- [x] T008 [P1] [--] Read quickstart.md for step-by-step implementation guide: `specs/008-align-base-infra-docs/quickstart.md`
- [x] T009 [P1] [US1] Read current 001 spec.md to understand baseline: `specs/001-base-infrastructure/spec.md`
- [x] T010 [P1] [US1] Read current 001 plan.md to understand constitution check: `specs/001-base-infrastructure/plan.md`
- [x] T011 [P1] [US1] Verify git completion date: `git log --grep="001-base-infrastructure" --oneline --date=short | head -5` → 2025-11-16
- [x] T012 [P1] [US4] Verify astro.config.mjs output mode: `grep "output:" astro.config.mjs` → output: 'server'

---

## Phase 3: US1 Implementation - Developer Understanding (22 tasks)

**Objective**: Fix critical issues blocking developer onboarding (FR-001 to FR-004, FR-006, FR-007)

### Critical Issue: Status Field (FR-001)

- [x] T013 [P1] [US1] Update spec.md status from "Draft" to "Completed (2025-11-16)" at line 5: `specs/001-base-infrastructure/spec.md:5`
- [x] T014 [P1] [US1] Verify status change matches git log merge date

### Critical Issue: Edge Cases (FR-003)

- [x] T015 [P1] [US1] Replace edge case Q1 with answer about BaseLayout props TypeScript validation: `specs/001-base-infrastructure/spec.md:~103`
- [x] T016 [P1] [US1] Add code reference to Q1 answer: `BaseLayout.astro:7-12`
- [x] T017 [P1] [US1] Replace edge case Q2 with answer about Header tablet navigation (768px breakpoint): `specs/001-base-infrastructure/spec.md:~104`
- [x] T018 [P1] [US1] Add code reference to Q2 answer: `Header.astro:17-147, MobileMenu.tsx`
- [x] T019 [P1] [US1] Replace edge case Q3 with answer about font fallback strategy: `specs/001-base-infrastructure/spec.md:~105`
- [x] T020 [P1] [US1] Add code reference to Q3 answer: `tailwind.config.mjs:6-8, global.css:1`
- [x] T021 [P1] [US1] Replace edge case Q4 with answer about mobile menu long labels: `specs/001-base-infrastructure/spec.md:~106`
- [x] T022 [P1] [US1] Add code reference to Q4 answer: `MobileMenu.tsx:30-41`
- [x] T023 [P1] [US1] Replace edge case Q5 with answer about Footer without social links: `specs/001-base-infrastructure/spec.md:~107`
- [x] T024 [P1] [US1] Add code reference to Q5 answer: `Footer.astro:96-162`
- [x] T025 [P1] [US1] Replace edge case Q6 with answer about browser CSS support: `specs/001-base-infrastructure/spec.md:~108`
- [x] T026 [P1] [US1] Add code reference to Q6 answer: `astro.config.mjs:14-17, tailwind.config.mjs`

### High Priority: Code References (FR-006)

- [x] T027 [P1] [US1] Add code references to FR-001 to FR-005 (BaseLayout props, HTML5, SEO, canonical, viewport): `specs/001-base-infrastructure/spec.md:~114-118`
- [x] T028 [P1] [US1] Add code references to FR-006 to FR-008 (Tailwind colors, fonts, spacing): `specs/001-base-infrastructure/spec.md:~119-121`
- [x] T029 [P1] [US1] Add code references to FR-009 (Google Fonts import): `specs/001-base-infrastructure/spec.md:~122`
- [x] T030 [P1] [US1] Add code references to FR-010 to FR-012 (Header logo, responsive, active states): `specs/001-base-infrastructure/spec.md:~123-125`
- [x] T031 [P1] [US1] Add code references to FR-013 to FR-015 (Footer copyright, social, navigation): `specs/001-base-infrastructure/spec.md:~126-128`
- [x] T032 [P1] [US1] Add code references to FR-016 to FR-020 (Accessibility, semantic HTML, keyboard nav): `specs/001-base-infrastructure/spec.md:~129-134`

### High Priority: Breakpoint Verification (FR-007)

- [x] T033 [P1] [US1] Verify actual breakpoint in Header.astro: `grep "md:" src/components/layout/Header.astro` → md: breakpoint (768px)
- [x] T034 [P1] [US1] Update FR-011 with verified breakpoint (768px or actual value): `specs/001-base-infrastructure/spec.md:~124` → Already correct

---

## Phase 4: US2 Implementation - QA Test Plan Creation (10 tasks)

**Objective**: Add measurement methods for success criteria (FR-005, FR-008)

### Success Criteria Monitoring Section (FR-005)

- [x] T035 [P1] [US2] Create "Monitoring & Verification" section after Success Criteria: `specs/001-base-infrastructure/spec.md:~159`
- [x] T036 [P1] [US2] Add SC-001 measurement method (Lighthouse SEO ≥95): "Chrome DevTools → Lighthouse → SEO audit"
- [x] T037 [P1] [US2] Add SC-002 measurement method (Lighthouse Accessibility ≥95): "Chrome DevTools → Lighthouse → Accessibility audit"
- [x] T038 [P1] [US2] Add SC-003 measurement method (Focus indicators contrast ≥3:1): "axe DevTools + Manual contrast check"
- [x] T039 [P1] [US2] Add SC-004 measurement method (Keyboard navigation): "Manual Tab testing through all interactive elements"
- [x] T040 [P1] [US2] Add SC-005 measurement method (Font loading CLS <0.1): "Vercel Speed Insights dashboard → CLS metric"
- [x] T041 [P1] [US2] Add SC-006 measurement method (Responsive Header/Footer): "Chrome DevTools Responsive mode → Test 320px, 768px, 1440px"
- [x] T042 [P1] [US2] Add SC-007 measurement method (Color contrast ≥4.5:1): "WAVE or axe DevTools → Color contrast validation"
- [x] T043 [P1] [US2] Add SC-008 measurement method (prefers-reduced-motion): "Chrome DevTools → Media queries → Emulate prefers-reduced-motion"
- [x] T044 [P1] [US2] Add SC-009 measurement method (HTML validation): "W3C HTML Validator → Zero errors"

---

## Phase 5: US3 Implementation - PM Feature Completion (3 tasks)

**Objective**: Enable PM to measure completion (status already updated in T013)

- [x] T045 [P2] [US3] Verify all SC-001 to SC-010 have measurement methods in Monitoring section → All present
- [x] T046 [P2] [US3] Add SC-010 measurement method (Tailwind utilities functional): "Manual code inspection → Verify custom spacing/colors work" → Added in T044
- [x] T047 [P2] [US3] Verify spec.md status matches git log completion date (cross-check T013) → Verified in T014

---

## Phase 6: US4 Implementation - Architect Constitution Compliance (5 tasks)

**Objective**: Fix constitution check accuracy (FR-002, FR-014)

### Constitution Check Update (FR-002)

- [x] T048 [P2] [US4] Read current plan.md constitution check Principle I: `specs/001-base-infrastructure/plan.md:~28-32` → Done in T010
- [x] T049 [P2] [US4] Update Principle I text to: "Server mode permitted exclusively for /api/* serverless functions; all pages remain pre-rendered static at build time"
- [x] T050 [P2] [US4] Add clarification that server mode complies with Static-First when used only for API routes → Added context about feature 005
- [x] T051 [P2] [US4] Verify astro.config.mjs shows `output: 'server'` (reference T012 result) → Verified in T012
- [x] T052 [P2] [US4] Update assumptions section if domain setup timeline needs correction: `specs/001-base-infrastructure/spec.md:~136-142` → Updated navigation structure, domain timeline, browser support

---

## Phase 7: US5 Implementation - Technical Writer Documentation Debt (6 tasks)

**Objective**: Consolidate duplicates and fix dates (FR-009, FR-004)

### Accessibility Requirements Consolidation (FR-009)

- [x] T053 [P3] [US5] Locate FR-016, FR-017, FR-018 in spec.md: `specs/001-base-infrastructure/spec.md:~129-134`
- [x] T054 [P3] [US5] Consolidate into single FR-016: "Global CSS MUST implement WCAG AA accessibility: focus indicators (2px outline, contrast ≥3:1), prefers-reduced-motion support, text contrast ≥4.5:1"
- [x] T055 [P3] [US5] Add code reference to consolidated FR-016: `global.css:29-32, 43-55; Navy/Gold design system meets WCAG AA contrast`
- [x] T056 [P3] [US5] Remove duplicate FR-017 and FR-018 from spec.md → Consolidated into FR-016

### CLAUDE.md Date Fix (FR-004)

- [x] T057 [P3] [US5] Find 001-base-infrastructure entry in CLAUDE.md Recent Changes section: `grep -n "001-base-infrastructure" CLAUDE.md` → Found at line 753
- [x] T058 [P3] [US5] Update date from "2025-01-14" to "2025-11-14 to 2025-11-16" in CLAUDE.md → Updated

---

## Phase 8: Final Validation & Commit (4 tasks)

**Objective**: Verify all changes and commit documentation updates

### Validation

- [x] T059 [P1] [--] Validate all code references exist and point to correct lines: Run bash validation script from quickstart.md → Key references validated (BaseLayout, Tailwind, global.css)
- [x] T060 [P1] [--] Verify all 14 FR requirements (FR-001 to FR-014 from this spec) are addressed → All 14 completed
- [x] T061 [P1] [--] Run final checklist: Zero [NEEDS CLARIFICATION] markers, all dates match git history, all code references valid → All checks passed

### Commit

- [x] T062 [P1] [--] Commit documentation changes: `git add specs/001-base-infrastructure/spec.md specs/001-base-infrastructure/plan.md CLAUDE.md && git commit -m "docs: align 001-base-infrastructure spec with implementation"` → Committed (5c8c89f)

---

## Task Dependencies

**Sequential dependencies**:
- T001-T005 (Setup) → T006-T012 (Research) → All implementation phases
- T013 (Status update) blocks T047 (Status verification)
- T035-T044 (Monitoring section) blocks T045 (Verification)
- T048-T051 (Constitution update) blocks T052 (Assumptions verification)
- T053-T056 (Consolidation) completes before T059 (Validation)

**Parallel execution possible**:
- Phase 3 (US1) can run in parallel with Phase 4 (US2)
- Phase 5 (US3) can run in parallel with Phase 6 (US4) and Phase 7 (US5)
- All validation steps (T059-T061) must complete before commit (T062)

---

## Success Criteria Mapping

- **SC-001**: 100% Critical issues resolved → T013-T034 complete
- **SC-002**: 100% High priority issues resolved → T035-T046 complete
- **SC-003**: Accessibility requirements consolidated → T053-T056 complete
- **SC-004**: All 20 FRs have code references → T027-T032 complete
- **SC-005**: All 10 SCs have measurement methods → T036-T046 complete
- **SC-006**: Constitution accurately documented → T048-T051 complete
- **SC-007**: Spec status reflects reality → T013-T014 complete
- **SC-008**: Edge case answers verifiable → T015-T026 complete
- **SC-009**: Zero ambiguous requirements → T027-T034 complete
- **SC-010**: Date accuracy achieved → T011, T013, T057-T058 complete

---

## Estimated Effort

- **Phase 1**: 5 tasks × 2 min = 10 minutes (setup)
- **Phase 2**: 7 tasks × 3 min = 21 minutes (research review)
- **Phase 3**: 22 tasks × 5 min = 110 minutes (developer understanding - critical path)
- **Phase 4**: 10 tasks × 4 min = 40 minutes (QA test plan)
- **Phase 5**: 3 tasks × 3 min = 9 minutes (PM measurement)
- **Phase 6**: 5 tasks × 5 min = 25 minutes (architect constitution)
- **Phase 7**: 6 tasks × 4 min = 24 minutes (tech writer cleanup)
- **Phase 8**: 4 tasks × 5 min = 20 minutes (validation & commit)

**Total estimated time**: ~4.5 hours (259 minutes)

**Critical path**: Phase 1 → Phase 2 → Phase 3 (110 min) → Phase 8

---

## Notes

- **All tasks are documentation edits** - no code changes to src/ directory
- **Code references format**: `filename.ext:startLine-endLine` (e.g., "BaseLayout.astro:7-12")
- **Validation is manual** - compare spec claims against implementation files by reading code
- **Research already complete** - research.md contains all findings from Phase 0 (R1-R7)
- **Data model already defined** - data-model.md and quickstart.md exist as reference guides

---

## Risk Mitigation

- **Risk**: Code references point to wrong line numbers
  - **Mitigation**: T059 validates all references using bash script from quickstart.md
- **Risk**: Missing an edge case question
  - **Mitigation**: T015-T026 systematically address all 6 questions from research.md
- **Risk**: Constitution check still inaccurate
  - **Mitigation**: T012 verifies astro.config.mjs before T048-T050 update text

---

## Completion Criteria

✅ **Feature 008 is complete when**:
1. All 62 tasks marked complete
2. specs/001-base-infrastructure/spec.md and plan.md updated
3. CLAUDE.md date corrected
4. All validation checks pass (T059-T061)
5. Documentation changes committed to git (T062)
6. Developer can read 001 spec without finding contradictions
7. QA can create test plan with concrete measurement methods
8. PM can verify feature completion using documented criteria
9. Architect can confirm constitution compliance from plan.md
10. Technical writer finds no duplicate requirements or inconsistent dates
