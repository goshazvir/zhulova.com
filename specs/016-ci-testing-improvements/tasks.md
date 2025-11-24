# Tasks: CI/CD Testing Improvements

**Input**: Design documents from `/specs/016-ci-testing-improvements/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅

**Tests**: Unit tests included for US3 (MobileMenu coverage improvement)

**Organization**: Tasks grouped by user story for independent implementation

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup

**Purpose**: Verify current state and prepare for changes

- [x] T001 Run E2E test to confirm accessibility failure: `npx playwright test tests/e2e/404-page.spec.ts --project=chromium`
- [x] T002 Run coverage to confirm MobileMenu baseline: `npm run test:coverage`
- [x] T003 Verify no existing ESLint config: `ls eslint.config.* .eslintrc* 2>/dev/null`

**Checkpoint**: Baseline metrics confirmed

---

## Phase 2: Foundational

**Purpose**: Install dependencies needed for multiple user stories

- [x] T004 Install ESLint dependencies: `npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-plugin-astro`
- [x] T005 Add lint scripts to `package.json`: `"lint": "eslint src --ext .ts,.tsx,.astro"`, `"lint:fix": "eslint src --ext .ts,.tsx,.astro --fix"`

**Checkpoint**: ESLint ready for configuration

---

## Phase 3: User Story 1 - Accessible 404 Page (Priority: P1) 🎯 MVP

**Goal**: Fix color contrast on 404 page to pass WCAG AA (4.5:1 ratio)

**Independent Test**: Run `npx playwright test tests/e2e/404-page.spec.ts --project=chromium` - axe-core audit should pass

### Implementation for User Story 1

- [x] T006 [US1] Audit 404 page for gold color usage in `src/pages/404.astro`
- [x] T007 [US1] Replace any `text-gold-600` with `text-navy-600` in `src/pages/404.astro` (keep hover:text-gold-700)
- [x] T008 [US1] Verify fix by running axe-core audit: `npx playwright test tests/e2e/404-page.spec.ts --project=chromium`

**Checkpoint**: 404 page passes accessibility audit (0 contrast violations)

---

## Phase 4: User Story 2 - ESLint in CI (Priority: P2)

**Goal**: Add ESLint to CI pipeline to catch bugs before tests run

**Independent Test**: Push code with lint error, verify CI fails at lint stage

### Implementation for User Story 2

- [x] T009 [US2] Create ESLint flat config in `eslint.config.js` with TypeScript and Astro support
- [x] T010 [US2] Run lint locally to identify any existing issues: `npm run lint`
- [x] T011 [US2] Fix critical lint errors (unused vars, explicit any) or add to ignore
- [x] T012 [US2] Add lint job to `.github/workflows/test.yml` before unit-tests job
- [x] T013 [US2] Make unit-tests job depend on lint job with `needs: lint`
- [x] T014 [US2] Test CI locally by committing and verifying lint step runs

**Checkpoint**: ESLint integrated into CI, runs before unit tests

---

## Phase 5: User Story 3 - MobileMenu Test Coverage (Priority: P3)

**Goal**: Improve MobileMenu test coverage from 44% to 80%+

**Independent Test**: Run `npm run test:coverage` and verify MobileMenu >80%

### Tests for User Story 3

- [x] T015 [P] [US3] Test: menu renders null when closed in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T016 [P] [US3] Test: menu panel visible when open in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T017 [P] [US3] Test: close button calls closeMobileMenu in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T018 [P] [US3] Test: backdrop click closes menu in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T019 [P] [US3] Test: Escape key closes menu in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T020 [P] [US3] Test: main variant renders 6 navigation links in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T021 [P] [US3] Test: legal variant renders 3 navigation links in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T022 [P] [US3] Test: active section applies correct styles in `src/components/layout/MobileMenu/MobileMenu.test.tsx`
- [x] T023 [US3] Verify coverage reaches 80%+: `npm run test:coverage`

**Checkpoint**: MobileMenu coverage ≥80%

---

## Phase 6: Polish & Verification

**Purpose**: Final verification and cleanup

- [x] T024 Run full unit test suite: `npm run test:run`
- [x] T025 Run full E2E test suite: `npx playwright test --project=chromium`
- [x] T026 Verify CI passes all stages (lint → unit → e2e)
- [x] T027 Update CLAUDE.md if needed with new lint commands

**Checkpoint**: All tests pass, CI green

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) → Phase 3-5 (User Stories) → Phase 6 (Polish)
```

### User Story Dependencies

| Story | Depends On | Can Parallel With |
|-------|------------|-------------------|
| US1 (404 Fix) | Phase 2 | US2, US3 |
| US2 (ESLint) | Phase 2 | US1, US3 |
| US3 (Tests) | Phase 2 | US1, US2 |

**Note**: All user stories are independent and can be implemented in any order or in parallel.

### Within Each User Story

- US1: Audit → Fix → Verify
- US2: Config → Lint → Fix → CI → Test
- US3: All tests [P] can run in parallel, then verify coverage

---

## Parallel Opportunities

### Parallel within Phase 5 (US3)

```bash
# All test tasks T015-T022 can be written in parallel (same file, but independent test cases)
# In practice, write all tests in one session, then run coverage
```

### Parallel across User Stories

```bash
# If multiple developers:
# Dev A: T006-T008 (US1 - 404 fix)
# Dev B: T009-T014 (US2 - ESLint)
# Dev C: T015-T023 (US3 - Tests)
```

---

## Implementation Strategy

### MVP First (US1 Only)

1. Complete Phase 1-2 (Setup + Foundational)
2. Complete US1 (T006-T008) - Fix accessibility
3. **Verify**: E2E tests pass
4. Ship if blocking production issue

### Recommended Order (Sequential)

1. **US1** (10 min) - Fix accessibility bug (blocking E2E tests)
2. **US2** (30 min) - Add ESLint to CI
3. **US3** (60 min) - Improve test coverage

### Full Implementation

1. T001-T003: Setup (5 min)
2. T004-T005: Foundational (5 min)
3. T006-T008: US1 - 404 Fix (10 min)
4. T009-T014: US2 - ESLint CI (30 min)
5. T015-T023: US3 - MobileMenu Tests (60 min)
6. T024-T027: Polish (10 min)

**Total**: ~2 hours

---

## Task Summary

| Phase | Tasks | Parallel |
|-------|-------|----------|
| Setup | T001-T003 | No |
| Foundational | T004-T005 | No |
| US1 (P1) | T006-T008 | No |
| US2 (P2) | T009-T014 | No |
| US3 (P3) | T015-T023 | T015-T022 [P] |
| Polish | T024-T027 | No |
| **Total** | **27 tasks** | **8 parallel** |

---

## Notes

- [P] tasks can run in parallel (different test cases in same file)
- US1 is MVP - fixes blocking accessibility bug
- US2 adds long-term code quality improvement
- US3 improves test reliability
- Commit after each user story completion
- All user stories independently testable
