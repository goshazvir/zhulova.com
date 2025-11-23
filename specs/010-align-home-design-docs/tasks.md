# Tasks: Align Home Design Refinement Documentation

**Input**: Design documents from `/specs/010-align-home-design-docs/`
**Prerequisites**: plan.md (completed), spec.md (completed), research.md (completed), data-model.md (completed), quickstart.md (completed)

**Tests**: No automated tests required - this is a documentation-only feature with manual validation

**Organization**: Tasks are grouped by user story to enable independent implementation. Each phase represents a complete, testable increment of documentation alignment work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Target documentation**: `specs/003-home-design-refinement/` (spec.md, plan.md, tasks.md)
- **Reference materials**: `specs/003-home-design-refinement/PROGRESS.md`, `src/components/sections/*.astro`
- **Planning docs**: `specs/010-align-home-design-docs/` (research.md, data-model.md, quickstart.md)

---

## Phase 1: Setup (Shared Prerequisites)

**Purpose**: Environment setup and reference material preparation

**Checkpoint**: All reference materials accessible, git branch verified

- [X] T001 Verify git branch is `010-align-home-design-docs` and working directory is clean
- [X] T002 [P] Verify all target files exist: `specs/003-home-design-refinement/spec.md`, `plan.md`, `tasks.md`
- [X] T003 [P] Verify all implementation files accessible: `src/components/sections/StatsSection.astro`, `Footer.astro`, `CaseStudiesSection.astro`, `QuestionsSection.astro`, `TestimonialsSection.astro`
- [X] T004 [P] Open reference materials: `specs/003-home-design-refinement/PROGRESS.md`, `specs/010-align-home-design-docs/research.md`, `quickstart.md`
- [X] T005 Extract git commit SHAs for T005-T009 using `git log --oneline --merges | grep -E "#9|#10|#11"` and save mapping to `/tmp/commits-003.txt`

---

## Phase 2: User Story 1 - Developer Understanding Component Implementation (Priority: P1) 🎯 MVP

**Goal**: Add code references to all 30 functional requirements and document 6 edge cases so developers can understand implementation without consulting original implementers

**Independent Test**: Give spec.md to new developer, ask them to locate StatsSection grid implementation, Footer CTA section, and carousel navigation code - they should find exact file:line references in <2 minutes

**Why MVP**: This is the highest priority story (P1) because without code references, developers cannot maintain or extend the codebase effectively. Edge cases prevent common bugs during future modifications.

### Implementation for User Story 1

- [X] T006 [P] [US1] Add code references to FR-001 to FR-005 (StatsSection requirements) in `specs/003-home-design-refinement/spec.md` with format `*(StatsSection.astro:line-range description)*`
- [X] T007 [P] [US1] Add code references to FR-006 to FR-010 (Footer requirements) in `specs/003-home-design-refinement/spec.md` with format `*(Footer.astro:line-range description)*`
- [X] T008 [P] [US1] Add code references to FR-011 to FR-015 (CaseStudiesSection requirements) in `specs/003-home-design-refinement/spec.md` with format `*(CaseStudiesSection.astro:line-range description)*`
- [X] T009 [P] [US1] Add code references to FR-016 to FR-022 (QuestionsSection requirements) in `specs/003-home-design-refinement/spec.md` with format `*(QuestionsSection.astro:line-range description)*`
- [X] T010 [P] [US1] Add code references to FR-023 to FR-030 (TestimonialsSection and general requirements) in `specs/003-home-design-refinement/spec.md` with format `*(TestimonialsSection.astro:line-range description)*`
- [X] T011 [US1] Replace edge case Q1 (carousel navigation boundaries) with 5-field Q&A format (Question, Answer, Code, Behavior, User Impact) in `specs/003-home-design-refinement/spec.md`
- [X] T012 [US1] Replace edge case Q2 (responsive breakpoint at 768px) with 5-field Q&A format in `specs/003-home-design-refinement/spec.md`
- [X] T013 [US1] Replace edge case Q3 (tab switching mid-scroll) with 5-field Q&A format in `specs/003-home-design-refinement/spec.md`
- [X] T014 [US1] Replace edge case Q4 (white space calculations) with 5-field Q&A format in `specs/003-home-design-refinement/spec.md`
- [X] T015 [US1] Replace edge case Q5 (footer height on small viewports) with 5-field Q&A format in `specs/003-home-design-refinement/spec.md`
- [X] T016 [US1] Replace edge case Q6 (JavaScript fallback behavior) with 5-field Q&A format in `specs/003-home-design-refinement/spec.md`

**Checkpoint**: User Story 1 complete - all 30 FRs have code references, all 6 edge cases documented. Developer can now navigate from spec to implementation independently.

---

## Phase 3: User Story 2 - QA Test Plan Creation (Priority: P2)

**Goal**: Add measurement methods to all 10 success criteria so QA engineers can create reliable, repeatable test plans

**Independent Test**: Give spec.md to QA engineer, ask them to write test plan for SC-001 (visual hierarchy) - they should identify exact tool (Chrome DevTools), metric (spacing ratios), and acceptance threshold without clarification questions

**Why this priority**: P2 because QA testing can happen after implementation is documented (dependent on US1 code references), but blocks production release verification

### Implementation for User Story 2

- [X] T017 [US2] Add "Monitoring & Verification" section after Success Criteria in `specs/003-home-design-refinement/spec.md`
- [X] T018 [P] [US2] Document measurement methods for SC-001 to SC-003 (Lighthouse Performance, Accessibility, SEO) with Tool, Metric, Method, Threshold format in `specs/003-home-design-refinement/spec.md`
- [X] T019 [P] [US2] Document measurement methods for SC-004 to SC-006 (Core Web Vitals, Visual Hierarchy, Responsive Layout) with Tool, Metric, Method, Threshold format in `specs/003-home-design-refinement/spec.md`
- [X] T020 [P] [US2] Document measurement methods for SC-007 to SC-010 (Component Consistency, Carousel Usability, Footer CTA Visibility, Testimonials Display) with Tool, Metric, Method, Threshold format in `specs/003-home-design-refinement/spec.md`

**Checkpoint**: User Story 2 complete - all 10 success criteria have actionable measurement methods. QA can create comprehensive test plan independently.

---

## Phase 4: User Story 3 - PM Feature Completion Verification (Priority: P2)

**Goal**: Update spec status, integrate user feedback, and document task completion so PM can accurately report feature delivery to stakeholders

**Independent Test**: Give spec.md to PM, ask them to prepare status report - they should state correct completion date (2025-11-17), list all 5 components delivered, reference user approval quotes, without consulting developers

**Why this priority**: P2 because PM reporting can happen in parallel with QA test plan creation (both depend on US1 code references), critical for stakeholder communication

### Implementation for User Story 3

- [X] T021 [P] [US3] Update spec.md status from "Draft" to "Completed (2025-11-17)" in `specs/003-home-design-refinement/spec.md:5`
- [X] T022 [P] [US3] Extract minimum 3 user feedback quotes from `specs/003-home-design-refinement/PROGRESS.md` ("отлично мне очень нравится", "отпад", "да сейчас супер")
- [X] T023 [US3] Integrate user feedback quote for StatsSection as blockquote after FR-005 in `specs/003-home-design-refinement/spec.md`
- [X] T024 [US3] Integrate user feedback quote for Footer as blockquote after FR-002 with 45% height reduction metric in `specs/003-home-design-refinement/spec.md`
- [X] T025 [US3] Integrate user feedback quote for CaseStudiesSection as blockquote after FR-001 in `specs/003-home-design-refinement/spec.md`
- [X] T026 [US3] Mark T005-T009 as completed (✅) with commit SHAs from `/tmp/commits-003.txt` in `specs/003-home-design-refinement/tasks.md` Phase 3 section
- [X] T027 [US3] Document T010-T012 verification status (⏳ pending or ✅ completed) with criteria, evidence needed, blockers in `specs/003-home-design-refinement/tasks.md` Phase 3 section

**Checkpoint**: User Story 3 complete - spec status accurate, user feedback integrated, task completion documented. PM can generate accurate status report.

---

## Phase 5: User Story 4 - Architect Design Decision Documentation (Priority: P3)

**Goal**: Document rationale for 4 key design decisions (Results-First, Gold Lines, Compact Footer, Carousel Navigation) so architects can maintain design system consistency

**Independent Test**: Give plan.md to architect, present new section design scenario, ask them to decide layout approach - they should reference documented rationale (e.g., "use Results-First approach per D1") and make consistent decision

**Why this priority**: P3 because design rationale documentation supports long-term maintenance but doesn't block immediate feature delivery or testing

### Implementation for User Story 4

- [X] T028 [US4] Add "Design Decisions" section after "Project Structure" in `specs/003-home-design-refinement/plan.md`
- [X] T029 [P] [US4] Document D1: Minimalist Grid with Vertical Dividers (StatsSection) with Decision, Rationale, User Feedback, Alternatives, Impact in `specs/003-home-design-refinement/plan.md`
- [X] T030 [P] [US4] Document D2: Gold Vertical Line Pattern (QuestionsSection) with Decision, Rationale, User Feedback, Alternatives, Impact in `specs/003-home-design-refinement/plan.md`
- [X] T031 [P] [US4] Document D3: Compact Footer Redesign (45% height reduction) with Decision, Rationale, User Feedback ("отпад"), Alternatives, Impact in `specs/003-home-design-refinement/plan.md`
- [X] T032 [P] [US4] Document D4: Carousel vs Grid Navigation (CaseStudiesSection) with Decision, Rationale, User Feedback ("да сейчас супер"), Alternatives, Impact in `specs/003-home-design-refinement/plan.md`

**Checkpoint**: User Story 4 complete - all 4 design decisions documented with rationale. Architects can make consistent decisions for future features.

---

## Phase 6: User Story 5 - Technical Writer Documentation Debt Resolution (Priority: P3)

**Goal**: Update assumptions to reflect actual design iterations so technical writers can create accurate release notes

**Independent Test**: Give spec.md to technical writer, ask them to draft release notes - they should accurately describe design iteration process (asymmetric grid rejection, AI-template feedback, final minimalist choice) without developer interviews

**Why this priority**: P3 because assumptions updates support release documentation but don't block development, testing, or PM reporting

### Implementation for User Story 5

- [X] T033 [P] [US5] Update assumptions section to document user rejection of asymmetric grid design in `specs/003-home-design-refinement/spec.md` Assumptions section
- [X] T034 [P] [US5] Update assumptions section to document AI-template feedback leading to minimalist aesthetic choice in `specs/003-home-design-refinement/spec.md` Assumptions section
- [X] T035 [P] [US5] Update assumptions section to document design iteration count (3 attempts to final approval) in `specs/003-home-design-refinement/spec.md` Assumptions section
- [X] T036 [P] [US5] Update assumptions section to clarify responsive breakpoint strategy (Tailwind defaults: 640px sm, 768px md) in `specs/003-home-design-refinement/spec.md` Assumptions section
- [X] T037 [P] [US5] Update assumptions section to document gold accent usage pattern (CTAs, indicators, accents only - never large backgrounds) in `specs/003-home-design-refinement/spec.md` Assumptions section
- [X] T038 [P] [US5] Update assumptions section to state white space philosophy (breathing room over content density, 80px between sections) in `specs/003-home-design-refinement/spec.md` Assumptions section

**Checkpoint**: User Story 5 complete - all assumptions updated to reflect actual design iterations. Technical writers can create accurate documentation.

---

## Phase 7: Validation & Polish (Cross-Cutting Concerns)

**Purpose**: Comprehensive validation to ensure all documentation changes are accurate, consistent, and follow established patterns

**Checkpoint**: All validation checks pass, all changes committed to git

- [ ] T039 Create validation script `.specify/scripts/validate-010.sh` based on quickstart.md validation checklist (9 checks)
- [ ] T040 Run validation script to check: status updated, code references added, edge cases answered, monitoring section exists, user feedback integrated, design decisions documented
- [ ] T041 [P] Manual spot-check validation: verify FR-001 code reference by opening `src/components/sections/StatsSection.astro` and checking line numbers match implementation
- [ ] T042 [P] Manual spot-check validation: verify FR-010 code reference by opening `src/components/sections/Footer.astro` and checking line numbers match implementation
- [ ] T043 [P] Manual spot-check validation: verify FR-020 code reference by opening `src/components/sections/CaseStudiesSection.astro` and checking line numbers match implementation
- [ ] T044 Review all changes in `specs/003-home-design-refinement/spec.md` using `git diff` to verify no typos, correct formatting, code references valid
- [ ] T045 Review all changes in `specs/003-home-design-refinement/plan.md` using `git diff` to verify Design Decisions section properly formatted
- [ ] T046 Review all changes in `specs/003-home-design-refinement/tasks.md` using `git diff` to verify task status correctly updated
- [ ] T047 Verify zero changes to `src/` directory using `git status` and `git diff --name-only` (documentation-only feature)
- [ ] T048 Stage all updated files: `git add specs/003-home-design-refinement/spec.md plan.md tasks.md`
- [ ] T049 Commit changes with descriptive message following quickstart.md commit template (includes "docs: align 003-home-design-refinement spec with implementation" subject line)
- [ ] T050 Final verification: view updated spec.md in markdown preview, check status shows "Completed (2025-11-17)", FR-001 has code reference, edge case Q1 has 5-field Q&A

**Checkpoint**: All tasks complete - documentation alignment finished, changes committed to git, ready for PR creation

---

## Dependencies Between User Stories

```
Setup Phase (T001-T005)
         ↓
         ├──→ US1: Developer Understanding (P1) [T006-T016] 🎯 MVP - MUST COMPLETE FIRST
         │         ↓
         │         ├──→ US2: QA Test Plan (P2) [T017-T020] - Can run in parallel with US3
         │         │
         │         └──→ US3: PM Feature Completion (P2) [T021-T027] - Can run in parallel with US2
         │                   ↓
         │                   ├──→ US4: Architect Design Decisions (P3) [T028-T032] - Can run in parallel with US5
         │                   │
         │                   └──→ US5: Technical Writer (P3) [T033-T038] - Can run in parallel with US4
         │                             ↓
         └──────────────────────────────→ Validation & Polish [T039-T050]
```

**Critical Path**: Setup → US1 → US2/US3 → US4/US5 → Validation

**Parallel Opportunities**:
- Setup tasks T002-T004 can run in parallel
- US1 tasks T006-T010 (code references) can run in parallel (different file groups)
- US1 tasks T011-T016 (edge cases) can run sequentially or parallel if different developers
- US2 tasks T018-T020 (measurement methods) can run in parallel (different SC groups)
- US2 and US3 can run completely in parallel after US1 completes
- US3 tasks T021-T022 can run in parallel
- US3 tasks T023-T025 (user feedback integration) can run sequentially
- US4 tasks T029-T032 (design decisions) can run in parallel (different decisions)
- US4 and US5 can run completely in parallel after US3 completes
- US5 tasks T033-T038 (assumptions updates) can run in parallel (different assumptions)
- Validation tasks T041-T043 (spot-checks) can run in parallel
- Validation tasks T044-T046 (git diff reviews) can run in parallel

---

## Parallel Execution Examples

### Example 1: Minimum Time to Complete MVP (US1 only)

**Strategy**: Single developer working sequentially

1. Complete Setup Phase (T001-T005): ~10 minutes
2. Add code references in 5 batches (T006-T010): ~60 minutes (12 min per component group)
3. Document 6 edge cases (T011-T016): ~30 minutes (5 min per edge case)

**Total**: ~100 minutes (1 hour 40 minutes) for MVP

### Example 2: Parallel Development (2 Developers)

**Developer A**: Focuses on US1 code references
- T001-T005 (Setup): 10 minutes
- T006, T007, T008, T009, T010 (Code references): 60 minutes

**Developer B**: Focuses on US1 edge cases (starts after T005)
- T011-T016 (Edge cases): 30 minutes

**Then both work on US2-US5**:
- Developer A: US2 (T017-T020), US4 (T028-T032): 40 minutes
- Developer B: US3 (T021-T027), US5 (T033-T038): 50 minutes

**Both collaborate on Validation** (T039-T050): 20 minutes

**Total**: ~120 minutes (2 hours) with 2 developers vs ~180 minutes (3 hours) sequential

### Example 3: Maximum Parallelization (3 Developers)

**Developer A**: US1 code references (T006-T010): 60 minutes
**Developer B**: US1 edge cases (T011-T016): 30 minutes, then US2 (T017-T020): 30 minutes
**Developer C**: US3 (T021-T027): 40 minutes, then US4 (T028-T032): 30 minutes

**All three**: US5 (T033-T038 split): 15 minutes, Validation (T039-T050 split): 15 minutes

**Total**: ~90 minutes (1 hour 30 minutes) with 3 developers

---

## Implementation Strategy

**MVP-First Approach**:
1. **Phase 1 MVP**: Complete US1 only (code references + edge cases)
   - Deliverable: Developers can navigate from spec to implementation
   - Value: Immediate improvement in code maintainability
   - Risk: Low - documentation-only, no code changes

2. **Phase 2 Extension**: Add US2 (QA measurement methods)
   - Deliverable: QA can create test plans
   - Value: Enables systematic quality verification
   - Risk: Low - adds testing guidance without changing code

3. **Phase 3 Reporting**: Add US3 (PM status + user feedback)
   - Deliverable: PM can report accurate status to stakeholders
   - Value: Improves stakeholder communication and trust
   - Risk: Low - status updates don't affect functionality

4. **Phase 4 Governance**: Add US4 + US5 (design decisions + assumptions)
   - Deliverable: Architects and technical writers have complete context
   - Value: Long-term design system consistency and documentation quality
   - Risk: Low - supports future work but doesn't block current delivery

**Incremental Delivery**:
- Ship US1 → US2 → US3 → US4+US5 as separate commits/PRs if needed
- Each phase is independently valuable and testable
- No dependencies on external systems or deployments

**Quality Gates**:
- After each user story: Run validation script subset for that story
- Before commit: Run full validation script (T039-T040)
- After commit: Final verification (T050)

---

## Task Summary

**Total Tasks**: 50
- Setup Phase: 5 tasks (T001-T005)
- User Story 1 (P1): 11 tasks (T006-T016) 🎯 MVP
- User Story 2 (P2): 4 tasks (T017-T020)
- User Story 3 (P2): 7 tasks (T021-T027)
- User Story 4 (P3): 5 tasks (T028-T032)
- User Story 5 (P3): 6 tasks (T033-T038)
- Validation & Polish: 12 tasks (T039-T050)

**Parallelizable Tasks**: 25 tasks marked with [P]
- Setup: 2 tasks (T002-T003, T004)
- US1: 5 tasks (T006-T010)
- US2: 3 tasks (T018-T020)
- US3: 2 tasks (T021-T022)
- US4: 4 tasks (T029-T032)
- US5: 6 tasks (T033-T038)
- Validation: 3 tasks (T041-T043), 3 tasks (T044-T046)

**Estimated Effort**:
- Sequential: ~3 hours (180 minutes)
- 2 Developers: ~2 hours (120 minutes)
- 3 Developers: ~1.5 hours (90 minutes)

**Success Metrics**:
- ✅ All 30 FRs have code references (US1)
- ✅ All 6 edge cases documented with 5-field Q&A (US1)
- ✅ All 10 SCs have measurement methods (US2)
- ✅ Spec status updated to "Completed (2025-11-17)" (US3)
- ✅ 3+ user feedback quotes integrated (US3)
- ✅ 4 design decisions documented in plan.md (US4)
- ✅ 6 assumptions updated to reflect iterations (US5)
- ✅ All validation checks pass (Validation Phase)
- ✅ Zero changes to src/ directory (documentation-only constraint)
