# Tasks: Fix Legal Pages Documentation Alignment

**Input**: Design documents from `/specs/007-fix-legal-pages-docs/`
**Prerequisites**: plan.md, spec.md, quickstart.md

**Tests**: Not requested in specification - omitted from task list

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each documentation fix category.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

## Path Conventions

- **Documentation files**: `specs/004-legal-pages/`
- Paths use absolute references to documentation directories at repository root

---

## Phase 1: Setup

**Purpose**: Verify prerequisites and access to documentation files

- [ ] T001 Verify current branch is 007-fix-legal-pages-docs using `git branch --show-current`
- [ ] T002 [P] Verify access to 004 spec files: ls specs/004-legal-pages/ should show spec.md, plan.md, tasks.md, research.md
- [ ] T003 [P] Verify access to implementation files: ls src/pages/privacy-policy.astro src/pages/terms.astro should succeed
- [ ] T004 [P] Verify access to constitution: ls .specify/memory/constitution.md should succeed
- [ ] T005 [P] Verify access to astro config: ls astro.config.mjs should succeed

**Checkpoint**: All prerequisites verified - documentation files accessible, implementation files readable

---

## Phase 2: Foundational (No Foundational Tasks)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**Status**: ✅ SKIPPED - No foundational tasks required. Feature updates existing documentation files without shared dependencies.

**Checkpoint**: Foundation ready - user story implementation can begin immediately

---

## Phase 3: User Story 1 - Developer Debugging (Priority: P1) 🎯 MVP

**Goal**: Fix critical documentation issues (C1-C3) so developers can trust spec documents when debugging or extending legal pages implementation.

**Independent Test**: Read spec.md, plan.md, tasks.md and compare statements against src/pages/privacy-policy.astro, src/pages/terms.astro, astro.config.mjs. Verify all claims match code reality (constitution compliance, section counts, TOC status).

### Critical Issue Fixes (FR-001 to FR-006)

- [ ] T006 [US1] Update plan.md constitution check section (lines ~34-45) to state "Hybrid mode permitted exclusively for /api/* serverless functions; all pages including legal pages remain pre-rendered static" to match actual astro.config.mjs configuration in specs/004-legal-pages/plan.md
- [ ] T007 [P] [US1] Verify FR-024 table of contents requirement in specs/004-legal-pages/spec.md: either document actual TOC implementation in privacy-policy.astro/terms.astro OR remove FR-024 and add to "Out of Scope" section with note "Simple scroll navigation used instead of TOC"
- [ ] T008 [P] [US1] Update FR-003 in specs/004-legal-pages/spec.md to state "Privacy policy MUST include 10 conversational sections combining related topics for readability" instead of claiming 16 mandatory sections (verify against grep -c "^      <section" src/pages/privacy-policy.astro which returns 10)
- [ ] T009 [P] [US1] Update FR-008 in specs/004-legal-pages/spec.md to state "Terms & conditions MUST include 10 conversational sections covering all required legal topics" instead of claiming 20 mandatory sections (verify against grep -c "^      <section" src/pages/terms.astro which returns 10)
- [ ] T010 [P] [US1] Update privacy policy sections documentation in specs/004-legal-pages/research.md to document actual 10-section structure with rationale: "Conversational format combines Ukrainian Law 2297-VI + GDPR requirements into 10 readable sections instead of formal 16-section structure"
- [ ] T011 [P] [US1] Update terms & conditions sections documentation in specs/004-legal-pages/research.md to document actual 10-section structure with rationale: "User-friendly format combines Ukrainian consumer protection law requirements into 10 accessible sections"

**Checkpoint**: Critical issues (C1-C3) resolved - plan.md shows accurate hybrid mode explanation, spec.md documents actual 10-section format, FR-024 status matches implementation reality

---

## Phase 4: User Story 2 - QA Testing (Priority: P1) 🎯 MVP

**Goal**: Replace ambiguous requirements with measurable criteria so QA can create objective test cases without guesswork.

**Independent Test**: Extract all functional requirements from spec.md, attempt to write test cases for each, verify all have measurable pass/fail criteria (e.g., typography, colors, spacing instead of "minimal luxury aesthetic").

### High Priority Fixes (FR-007 to FR-011)

- [ ] T012 [US2] Update spec.md status field (line ~5) from "Draft" to "Completed (2025-11-17)" to reflect actual completion date from git commit d7b17fd in specs/004-legal-pages/spec.md
- [ ] T013 [P] [US2] Replace FR-005 "minimal luxury aesthetic" in specs/004-legal-pages/spec.md with measurable criteria: "Typography: Playfair Display headings (font-serif), Inter body text (font-sans); Colors: navy-900/gold-500/sage-50 palette; Layout: max-width 4xl, leading-relaxed line height"
- [ ] T014 [P] [US2] Replace FR-010 "consistent styling" in specs/004-legal-pages/spec.md with same measurable criteria as FR-005 OR consolidate FR-010 into FR-005 if they are duplicates
- [ ] T015 [P] [US2] Update tasks.md T003 "Implement table of contents" in specs/004-legal-pages/tasks.md to either show completion evidence OR mark with note: "Descoped - simple scroll navigation used, no TOC anchor links implemented"
- [ ] T016 [P] [US2] Update tasks.md T010 "Implement table of contents" in specs/004-legal-pages/tasks.md with same note as T003 (consistency)
- [ ] T017 [P] [US2] Update edge case "How does layout handle missing translations?" in specs/004-legal-pages/spec.md (lines ~94-97) to include implementation answer: "If content file missing, Astro build fails (static generation error); if text empty, page renders with layout but no content body"
- [ ] T018 [US2] Add "Monitoring & Verification" section to specs/004-legal-pages/spec.md after Success Criteria section documenting how to measure each criterion (SC-001 to SC-010) with specific tools and methods

**Checkpoint**: Ambiguous requirements eliminated - QA can create objective test cases for 100% of functional requirements, all edge cases have implementation answers

---

## Phase 5: User Story 3 - PM Measuring (Priority: P2)

**Goal**: Update success criteria and status tracking so PM can accurately measure feature completion and outcomes.

**Independent Test**: Review SC-001 to SC-010 in spec.md, verify each has measurement method in Monitoring section, check spec status matches git history (d7b17fd = 2025-11-17).

### Success Criteria Fixes

- [ ] T019 [US3] Verify spec.md status already updated to "Completed (2025-11-17)" in T012, if not completed yet, execute that task first (dependency: T012)
- [ ] T020 [US3] Verify "Monitoring & Verification" section already added in T018, if not completed yet, execute that task first (dependency: T018)
- [ ] T021 [P] [US3] Review SC-008 "users report understanding data rights" in specs/004-legal-pages/spec.md and either mark as "Future Enhancement" with note "Qualitative feedback collection not implemented" OR document measurement method if feedback mechanism exists
- [ ] T022 [P] [US3] Review all success criteria (SC-001 to SC-010) in specs/004-legal-pages/spec.md and verify zero mentions of implementation technologies (Astro, React, Tailwind) - replace any found with user-facing outcomes

**Checkpoint**: Success criteria aligned with implementation - PM can measure feature completion accurately, all metrics are technology-agnostic

---

## Phase 6: User Story 4 - Technical Writer Consistency (Priority: P2)

**Goal**: Consolidate duplicate requirements and document all component behaviors to eliminate terminology drift.

**Independent Test**: Search spec.md for duplicate requirements (FR-004/FR-009, FR-005/FR-010), verify component variant behavior is documented in functional requirements, check all terms are defined.

### Medium Priority Fixes (FR-012 to FR-015)

- [ ] T023 [US4] Consolidate FR-004 and FR-009 duplicate responsive requirements in specs/004-legal-pages/spec.md: FR-004 becomes "Both legal pages MUST be responsive on mobile (375px), tablet (768px), desktop (1920px+)", remove FR-009 entirely
- [ ] T024 [P] [US4] Add new requirement FR-025 to specs/004-legal-pages/spec.md after FR-024 (or renumber as FR-024 if old FR-024 removed): "Legal pages MUST use Header variant='legal' (simplified menu: Home, Privacy, Terms) and Footer variant='legal' (no CTA section)" to document actual component behavior in src/components/layout/Header.astro and Footer.astro
- [ ] T025 [P] [US4] Add validation task to specs/004-legal-pages/tasks.md after implementation tasks: "Validate all documented sections are present in privacy-policy.astro and terms.astro against updated FR-003 and FR-008 requirements"
- [ ] T026 [P] [US4] Update FR-023 "Last Updated date" in specs/004-legal-pages/spec.md to specify format: "MUST use Ukrainian locale format: 'Останнє оновлення: 17 листопада 2025 р.'"

**Checkpoint**: Duplicate requirements eliminated, component variants documented, terminology consistent - technical writers can maintain docs without confusion

---

## Phase 7: User Story 5 - Architect Compliance (Priority: P3)

**Goal**: Verify constitution compliance documentation accurately reflects hybrid mode architecture.

**Independent Test**: Read plan.md constitution check, verify astro.config.mjs shows output: 'hybrid', confirm legal pages are actually static (not SSR), check constitution.md for exception rules.

### Constitution Compliance

- [ ] T027 [US5] Verify plan.md constitution check already updated in T006 to acknowledge hybrid mode for API routes, if not completed yet, execute that task first (dependency: T006)
- [ ] T028 [P] [US5] Verify privacy-policy.astro and terms.astro are pre-rendered at build time by checking they have NO `export const prerender = false` directive (should only appear in src/pages/api/*.ts files)
- [ ] T029 [P] [US5] Check if constitution.md principle I needs exception clause added: "Hybrid mode allowed when ALL pages are static and ONLY /api/* routes use serverless functions" - if not present, document this as future enhancement (no constitution.md editing in this feature scope)

**Checkpoint**: Constitution compliance accurately documented - architects can verify feature follows project principles

---

## Phase 8: Coverage & Validation (FR-018 to FR-021)

**Goal**: Ensure all requirements have tasks, all tasks map to requirements, success criteria are technology-agnostic, and no clarification markers remain.

**Independent Test**: Count requirements vs tasks, verify mapping, search for [NEEDS CLARIFICATION] markers, check SC-001 to SC-010 for technology mentions.

### Low Priority Fixes & Final Validation (FR-016 to FR-021)

- [ ] T030 [P] Standardize FR-001 to FR-003 wording in specs/004-legal-pages/spec.md: all start with "Privacy policy page MUST..." for consistency (currently FR-001 says "System MUST provide route")
- [ ] T031 [P] Simplify task descriptions in specs/004-legal-pages/tasks.md: T002 shortened to "Add Ukrainian privacy policy content with 10 sections per updated research.md" (remove 150+ character section list from parentheses)
- [ ] T032 [P] Verify all 24-25 functional requirements (FR-001 to FR-025) in specs/004-legal-pages/spec.md have corresponding task in tasks.md OR are documented in "Out of Scope" section with rationale
- [ ] T033 [P] Verify all tasks in specs/004-legal-pages/tasks.md (T001-T021 plus any new tasks) map to at least one functional requirement OR user story from spec.md
- [ ] T034 [P] Search specs/004-legal-pages/spec.md success criteria (SC-001 to SC-010) for technology-specific terms (Astro, React, Tailwind, TypeScript) and replace with user-facing outcomes if any found
- [ ] T035 [P] Search specs/004-legal-pages/spec.md for [NEEDS CLARIFICATION] markers using grep, verify zero matches remain

**Checkpoint**: Coverage complete - all requirements mapped to tasks, all tasks mapped to requirements, success criteria are technology-agnostic, no unresolved clarifications

---

## Phase 9: Polish & Final Verification

**Goal**: Run final validation commands from quickstart.md to ensure all documentation changes are correct and complete.

**Independent Test**: Execute all verification commands from specs/007-fix-legal-pages-docs/quickstart.md and confirm all pass.

### Final Validation

- [ ] T036 Run section count verification: `grep -c "^      <section" src/pages/privacy-policy.astro` should return 10, `grep -c "^      <section" src/pages/terms.astro` should return 10
- [ ] T037 [P] Run spec.md section count claim verification: `grep "10 conversational sections" specs/004-legal-pages/spec.md` should return matches in FR-003 and FR-008
- [ ] T038 [P] Run duplicate requirements check: `grep -c "responsive on mobile (375px)" specs/004-legal-pages/spec.md` should return 1 (not 2)
- [ ] T039 [P] Run measurable aesthetic criteria check: `grep "Playfair Display headings" specs/004-legal-pages/spec.md` should return match in FR-005
- [ ] T040 [P] Run status verification: `grep "^**Status**:" specs/004-legal-pages/spec.md` should show "Completed (2025-11-17)"
- [ ] T041 [P] Run clarification markers check: `grep -c "NEEDS CLARIFICATION" specs/004-legal-pages/spec.md` should return 0
- [ ] T042 [P] Run FR-025 existence check: `grep "FR-025" specs/004-legal-pages/spec.md` should return match documenting variant behavior
- [ ] T043 Test all markdown links in specs/004-legal-pages/spec.md in GitHub preview (manual verification): data-model.md references, research.md references, quickstart.md references should all resolve without 404 errors
- [ ] T044 Complete manual review checklist from specs/007-fix-legal-pages-docs/quickstart.md verifying C1-C3, H1-H5, M1-M4, L1-L2, FR-018 to FR-021 all resolved

**Checkpoint**: All verification commands pass - documentation alignment complete and verified

---

## Dependencies & Parallel Execution

### User Story Completion Order

1. **US1 (Critical) + US2 (Ambiguity)**: Can run in PARALLEL (T006-T011 updates plan.md/research.md, T012-T018 updates spec.md different sections)
2. **US3 (PM Measuring)**: Depends on T012 (status) and T018 (monitoring section) from US2
3. **US4 (Consistency)**: Independent, can run in parallel with US3
4. **US5 (Constitution)**: Depends on T006 from US1, otherwise independent

### Parallel Execution Opportunities

**Within US1** (all tasks are [P] except T006):
- T007, T008, T009, T010, T011 can run in parallel (different sections of different files)
- T006 must complete first (plan.md constitution check)

**Within US2** (all tasks are [P] except T012 which blocks nothing):
- T013, T014, T015, T016, T017 can run in parallel
- T018 is independent

**Within US4** (all tasks are [P]):
- T023, T024, T025, T026 can run fully in parallel

**Phase 8 & 9** (all tasks are [P]):
- T030-T035 can run in parallel
- T036-T044 validation tasks can run in parallel after implementation tasks complete

### Suggested MVP Scope

**Minimum Viable Documentation Fix** (deploy immediately):
- **User Story 1** (T006-T011): Critical issues - constitution violation, section count mismatch
- **User Story 2** (T012-T018): High priority - ambiguous requirements, measurable criteria

This delivers:
- ✅ Accurate constitution compliance documentation (C1)
- ✅ Correct section counts documented (C3)
- ✅ Measurable aesthetic criteria for QA testing (H2)
- ✅ Updated spec status (H5)
- ✅ Monitoring & Verification section (FR-011)

**Incremental Additions**:
- **+US3**: PM can measure success criteria
- **+US4**: Technical writers have consistent terminology
- **+US5**: Architects verify constitution compliance
- **+Phase 8-9**: Full coverage validation and final checks

---

## Implementation Strategy

**Total Tasks**: 44 tasks across 9 phases

**Task Distribution**:
- Setup: 5 tasks (T001-T005)
- US1 (Critical): 6 tasks (T006-T011)
- US2 (Ambiguity): 7 tasks (T012-T018)
- US3 (PM): 4 tasks (T019-T022)
- US4 (Consistency): 4 tasks (T023-T026)
- US5 (Constitution): 3 tasks (T027-T029)
- Coverage: 6 tasks (T030-T035)
- Validation: 9 tasks (T036-T044)

**Parallel Opportunities**: 31 tasks marked [P] can run in parallel (70% of total)

**Independent Test Criteria**:
- **US1**: Compare spec.md/plan.md claims vs actual code (privacy-policy.astro, terms.astro, astro.config.mjs)
- **US2**: Extract requirements, write test cases, verify all have measurable criteria
- **US3**: Review success criteria, check measurement methods, verify status matches git history
- **US4**: Search for duplicates, verify variant documentation, check terminology consistency
- **US5**: Verify constitution compliance documentation matches actual architecture

**Estimated Time**: ~2-3 hours for full implementation (MVP: ~1 hour for US1+US2)

---

**Ready for implementation via `/speckit.implement` or manual execution following task order**
