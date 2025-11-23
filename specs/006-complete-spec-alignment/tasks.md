# Tasks: Complete Specification Documentation Alignment

**Input**: Design documents from `/specs/006-complete-spec-alignment/`
**Prerequisites**: plan.md ✅, spec.md ✅, quickstart.md ✅

**Feature Type**: Documentation-only alignment (no code changes)
**Target Files**: All documentation in `specs/005-fix-consultation-api/`
**Tests**: Manual verification using quickstart.md validation commands

**Organization**: Tasks grouped by user story to enable independent documentation fixes and validation.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task serves (US1, US2, US3, US4, US5)
- Exact file paths included in descriptions

## Path Conventions

- **Documentation**: `specs/005-fix-consultation-api/` (target files to update)
- **Reference Code**: `src/pages/api/submit-lead.ts` (read-only for line number references)
- **Verification**: Commands from `specs/006-complete-spec-alignment/quickstart.md`

---

## Phase 1: Setup & Verification

**Purpose**: Verify current state and prepare for documentation updates

**Checkpoint**: Understand baseline before making changes

- [ ] T001 Verify git branch is 006-complete-spec-alignment or 005-fix-consultation-api
- [ ] T002 [P] Verify access to all target files in specs/005-fix-consultation-api/
- [ ] T003 [P] Run baseline grep search: `grep -r "consultation request" specs/005-fix-consultation-api/` and count matches (expected: multiple)
- [ ] T004 [P] Verify src/pages/api/submit-lead.ts exists and is readable for code reference lookups
- [ ] T005 Create backup of specs/005-fix-consultation-api/ directory (optional safety measure)

**Expected Outcome**:
- Branch confirmed
- All files accessible
- Baseline metrics captured (number of "consultation request" instances, edge case question count)

---

## Phase 2: Foundational (None Required)

**Purpose**: Core infrastructure that MUST be complete before user stories

**Status**: ✅ **SKIP THIS PHASE**

**Rationale**: All infrastructure exists - this is markdown editing only, no setup needed

**Checkpoint**: Foundation ready - proceed directly to User Story 1

---

## Phase 3: User Story 1 - Developer Understanding Edge Cases (Priority: P1) 🎯 MVP

**Goal**: Document all 6 edge case behaviors with code references so developers can debug production issues

**Independent Test**: Read specs/005-fix-consultation-api/spec.md edge cases section - all 6 questions should have answers with `src/pages/api/submit-lead.ts` line references

### Implementation for User Story 1

- [ ] T006 [US1] Update specs/005-fix-consultation-api/spec.md edge cases section - replace question 1 (duplicate submissions) with documented behavior from 006 spec.md lines 89-96
- [ ] T007 [US1] Update specs/005-fix-consultation-api/spec.md edge cases section - replace question 2 (network failures) with documented behavior from 006 spec.md lines 98-103
- [ ] T008 [US1] Update specs/005-fix-consultation-api/spec.md edge cases section - replace question 3 (Supabase down) with documented behavior from 006 spec.md lines 105-111
- [ ] T009 [US1] Update specs/005-fix-consultation-api/spec.md edge cases section - replace question 4 (email fails) with documented behavior from 006 spec.md lines 113-118
- [ ] T010 [US1] Update specs/005-fix-consultation-api/spec.md edge cases section - replace question 5 (special characters) with documented behavior from 006 spec.md lines 120-125
- [ ] T011 [US1] Update specs/005-fix-consultation-api/spec.md edge cases section - replace question 6 (missing metadata) with documented behavior from 006 spec.md lines 127-131
- [ ] T012 [US1] Add code line references to each edge case answer (e.g., "Implementation: lines 59-83 in src/pages/api/submit-lead.ts")
- [ ] T013 [US1] Verify edge cases section formatting - use bold for edge case titles, consistent structure across all 6

**Verification**:
```bash
grep -A 10 "### Edge Cases" specs/005-fix-consultation-api/spec.md
# Should show 6 documented behaviors (not questions)
```

**Checkpoint**: All 6 edge cases documented with code references

---

## Phase 4: User Story 2 - QA Engineer Creating Test Plans (Priority: P2)

**Goal**: Fix inaccurate requirements (FR-010, SC-006) so QA doesn't waste time testing non-existent features

**Independent Test**: Read FR-010 and SC-006 in specs/005-fix-consultation-api/spec.md - should NOT claim timestamp or duplicate tracking exist

### Implementation for User Story 2

- [ ] T014 [P] [US2] Check src/pages/api/submit-lead.ts lines 64-71 (email template) - confirm NO timestamp in HTML
- [ ] T015 [US2] Update specs/005-fix-consultation-api/spec.md FR-010 - remove timestamp claim OR change to "Email notification MUST include: visitor name, phone, telegram (if provided), email (if provided), source" (no timestamp mention)
- [ ] T016 [US2] Search src/pages/api/submit-lead.ts for "duplicate" - confirm zero results
- [ ] T017 [US2] Update specs/005-fix-consultation-api/spec.md SC-006 - remove "Duplicate submissions tracked" criterion entirely OR move to "Future Enhancements" section
- [ ] T018 [US2] Add "Future Enhancements" section to specs/005-fix-consultation-api/spec.md after "Out of Scope" section (if not exists)
- [ ] T019 [US2] Move removed features (timestamp, duplicate tracking) to Future Enhancements section with rationale (if keeping for reference)

**Verification**:
```bash
grep -A 2 "FR-010" specs/005-fix-consultation-api/spec.md
# Should NOT mention "Ukrainian timezone" or "timestamp"

grep "SC-006" specs/005-fix-consultation-api/spec.md
# Should return zero results OR show "Future Enhancement" note
```

**Checkpoint**: Inaccurate requirements removed or clarified

---

## Phase 5: User Story 3 - Product Manager Verifying Success Metrics (Priority: P3)

**Goal**: Add monitoring verification strategy so PM knows how to measure each success criterion

**Independent Test**: Read specs/005-fix-consultation-api/spec.md or quickstart.md - should find table/section explaining how to verify SC-001 to SC-005

### Implementation for User Story 3

- [ ] T020 [P] [US3] Create "Monitoring & Verification" section in specs/005-fix-consultation-api/spec.md after "Success Criteria" section
- [ ] T021 [P] [US3] Add verification table to new section with columns: Criterion, How to Measure, Tool/Location
- [ ] T022 [US3] Document SC-001 verification: "Check Vercel function logs for errors → Vercel Dashboard → Functions → submit-lead logs"
- [ ] T023 [US3] Document SC-002 verification: "Check Resend email delivery times → Resend Dashboard → Emails → filter by date"
- [ ] T024 [US3] Document SC-003 verification: "Monitor 400 validation errors → Vercel Logs → filter status:400"
- [ ] T025 [US3] Document SC-004 verification: "Audit Supabase leads table count vs Vercel function success count → Compare via SQL + logs"
- [ ] T026 [US3] Document SC-005 verification: "Check API p95 response time → Vercel Speed Insights → Functions → submit-lead"

**Verification**:
```bash
grep -A 15 "Monitoring" specs/005-fix-consultation-api/spec.md
# Should show table with SC-001 to SC-005 verification methods
```

**Checkpoint**: All success criteria have documented measurement strategy

---

## Phase 6: User Story 4 - Future Developer Maintaining Consistency (Priority: P2)

**Goal**: Consolidate validation rules to single source of truth (data-model.md) to prevent future inconsistencies

**Independent Test**: Search specs/005-fix-consultation-api/spec.md for detailed validation rules - should find references to data-model.md (not full duplication)

### Implementation for User Story 4

- [ ] T027 [US4] Review specs/005-fix-consultation-api/spec.md FR-001 to FR-006 - identify which ones duplicate validation details from data-model.md
- [ ] T028 [US4] Replace FR-002 (phone validation) in specs/005-fix-consultation-api/spec.md with: "API endpoint MUST validate phone field per international format defined in [data-model.md](./data-model.md#validation-rules-summary)"
- [ ] T029 [US4] Replace FR-003 (telegram validation) in specs/005-fix-consultation-api/spec.md with: "API endpoint MUST validate telegram field per pattern defined in [data-model.md](./data-model.md#validation-rules-summary)"
- [ ] T030 [US4] Replace FR-005 (email validation) in specs/005-fix-consultation-api/spec.md with: "API endpoint MUST validate email field per standard format defined in [data-model.md](./data-model.md#validation-rules-summary)"
- [ ] T031 [US4] Replace FR-006 (name validation) in specs/005-fix-consultation-api/spec.md with: "API endpoint MUST validate name field per length requirements defined in [data-model.md](./data-model.md#validation-rules-summary)"
- [ ] T032 [US4] Verify data-model.md validation rules summary table exists at lines 278-286 (single source of truth)
- [ ] T033 [US4] Test markdown link: Open specs/005-fix-consultation-api/spec.md in GitHub preview and click data-model.md links - should jump to validation table

**Verification**:
```bash
grep -A 1 "FR-00[2-6]" specs/005-fix-consultation-api/spec.md
# Should show links to data-model.md (not full validation details)
```

**Checkpoint**: Validation rules consolidated, spec.md references data-model.md as single source of truth

---

## Phase 7: User Story 5 - Technical Writer Maintaining Terminology (Priority: P3)

**Goal**: Standardize all terminology to "lead" (replace "consultation request") for clarity and searchability

**Independent Test**: Run `grep -r "consultation request" specs/005-fix-consultation-api/` - should return zero results

### Implementation for User Story 5

- [ ] T034 [P] [US5] Global find/replace in specs/005-fix-consultation-api/spec.md: "consultation request" → "lead"
- [ ] T035 [P] [US5] Global find/replace in specs/005-fix-consultation-api/tasks.md: "consultation request" → "lead" (note: tasks.md might have completion summary)
- [ ] T036 [P] [US5] Global find/replace in specs/005-fix-consultation-api/quickstart.md: "consultation request" → "lead"
- [ ] T037 [P] [US5] Review specs/005-fix-consultation-api/data-model.md for "consultation request" - replace if found (likely already uses "lead")
- [ ] T038 [P] [US5] Review specs/005-fix-consultation-api/plan.md for "consultation request" - replace if found
- [ ] T039 [US5] Final search verification: `grep -ri "consultation request" specs/005-fix-consultation-api/*.md` - should return zero results
- [ ] T040 [US5] Check entity naming consistency: database uses "leads" table, code uses "leadData" variable - ensure all docs match

**Verification**:
```bash
grep -c "consultation request" specs/005-fix-consultation-api/*.md
# Should output: 0 for all files

grep -c "lead" specs/005-fix-consultation-api/spec.md
# Should output: multiple (confirming standardized terminology)
```

**Checkpoint**: 100% terminology consistency across all documentation

---

## Phase 8: Configuration & Polish

**Purpose**: Fix configuration documentation and final validation

- [ ] T041 [P] Update specs/005-fix-consultation-api/quickstart.md environment variables section - find RESEND_FROM_EMAIL line
- [ ] T042 Update specs/005-fix-consultation-api/quickstart.md - change RESEND_FROM_EMAIL comment from "# Optional" to "# Required for email notifications"
- [ ] T043 [P] Run all verification commands from specs/006-complete-spec-alignment/quickstart.md Step 1-8
- [ ] T044 [P] Validate markdown links - open specs/005-fix-consultation-api/spec.md in GitHub preview, click all [link](./file.md) references
- [ ] T045 Create final verification report: count edge cases (should be 6 with answers), grep "consultation request" (should be 0), check FR-010/SC-006 (removed/updated)
- [ ] T046 Review all changes against specs/006-complete-spec-alignment/spec.md success criteria SC-001 to SC-007

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies - start immediately
- **Phase 2: Foundational**: ✅ SKIPPED (no infrastructure needed)
- **Phase 3: US1 (Edge Cases)**: Can start after Setup - independent from other stories
- **Phase 4: US2 (Fix Requirements)**: Can start after Setup - independent from other stories
- **Phase 5: US3 (Monitoring)**: Can start after Setup - independent from other stories
- **Phase 6: US4 (Consolidate Validation)**: Can start after Setup - independent from other stories
- **Phase 7: US5 (Terminology)**: Can start after Setup - independent from other stories
- **Phase 8: Polish**: Depends on all user stories (US1-US5) completion

### User Story Dependencies

- **US1 (P1) - Edge Cases**: Independent - can complete alone (MVP)
- **US2 (P2) - Fix Requirements**: Independent - can complete alone
- **US3 (P3) - Monitoring**: Independent - can complete alone
- **US4 (P2) - Consolidate Validation**: Independent - can complete alone
- **US5 (P3) - Terminology**: Independent - can complete alone

**Note**: All user stories are independent - can be executed in any order or in parallel

### Within Each User Story

**US1 (Edge Cases)**:
- T006-T011: Can run sequentially (editing same section)
- T012-T013: Add references after content updates

**US2 (Fix Requirements)**:
- T014, T016: Code verification first (parallel)
- T015, T017-T019: Documentation updates (sequential, same file)

**US3 (Monitoring)**:
- T020-T021: Setup section and table (sequential)
- T022-T026: Add verification rows (can be parallel if using different editors)

**US4 (Consolidate Validation)**:
- T027: Analysis first
- T028-T031: Update FRs (can be parallel - different lines)
- T032-T033: Verification (sequential)

**US5 (Terminology)**:
- T034-T038: Global replacements (all parallel - different files)
- T039-T040: Final verification (sequential)

### Parallel Opportunities

**Maximum Parallelization**:
- All 5 user stories (US1-US5) can execute in parallel if team capacity allows
- Within US1: T006-T011 are sequential (same section), T012-T013 can be parallel after
- Within US2: T014+T016 parallel, then T015+T017-T019 sequential
- Within US3: T020-T021 sequential, then T022-T026 can be parallel
- Within US4: T028-T031 all parallel (different FR numbers)
- Within US5: T034-T038 all parallel (different files)

**Sequential Requirements**:
- Phase 1 → Phase 3-7 (any order or parallel)
- Phase 3-7 ALL → Phase 8

---

## Parallel Example: Terminology Standardization (US5)

```bash
# Launch all file replacements in parallel:
Task: "Global replace in spec.md: 'consultation request' → 'lead'"
Task: "Global replace in tasks.md: 'consultation request' → 'lead'"
Task: "Global replace in quickstart.md: 'consultation request' → 'lead'"
Task: "Global replace in data-model.md: 'consultation request' → 'lead'"
Task: "Global replace in plan.md: 'consultation request' → 'lead'"

# Then run sequentially:
Task: "Final search verification"
Task: "Check entity naming consistency"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup & Verification (T001-T005)
2. Complete Phase 3: User Story 1 - Edge Cases (T006-T013)
3. **STOP and VALIDATE**: Read spec.md edge cases section, verify all 6 have answers
4. If working, commit and optionally deploy docs

**Total Tasks for MVP**: 13 tasks (Phases 1 + 3)
**Estimated Time**: 45-60 minutes

### Incremental Delivery (All User Stories)

1. Complete Phase 1: Setup (5 tasks)
2. Complete Phase 3: US1 - Edge Cases (8 tasks) ← **MVP CHECKPOINT**
3. Complete Phase 4: US2 - Fix Requirements (6 tasks)
4. Complete Phase 5: US3 - Monitoring (7 tasks)
5. Complete Phase 6: US4 - Consolidate Validation (7 tasks)
6. Complete Phase 7: US5 - Terminology (7 tasks)
7. Complete Phase 8: Polish & Verification (6 tasks)

**Total Tasks**: 46 tasks
**Estimated Time**: 90-120 minutes (comprehensive alignment)

### Parallel Team Strategy

With multiple contributors:

1. Team completes Phase 1 together (Setup)
2. Once Setup is done:
   - **Person A**: User Story 1 (Edge Cases) - Priority P1
   - **Person B**: User Story 2 (Fix Requirements) - Priority P2
   - **Person C**: User Story 4 (Consolidate Validation) - Priority P2
   - **Person D**: User Story 5 (Terminology) - Priority P3
   - **Person E**: User Story 3 (Monitoring) - Priority P3
3. All stories complete independently
4. Team reconvenes for Phase 8 (Polish) together

**Parallel Execution Time**: ~30-40 minutes (if 5 people working simultaneously)

---

## Notes

- **[P] marker**: Tasks that can run in parallel (different files, no dependencies)
- **[Story] label**: Maps task to specific user story for traceability
- **No code changes**: All tasks are documentation-only markdown editing
- **Verification commands**: Defined in specs/006-complete-spec-alignment/quickstart.md
- **Reference code**: src/pages/api/submit-lead.ts is read-only (for line number lookups only)
- **Git commits**: Suggest committing after each user story phase completion
- **Avoid**: Modifying source code, changing database schema, adding new features

---

## Success Criteria Verification

After all tasks complete, verify against specs/006-complete-spec-alignment/spec.md success criteria:

- [ ] **SC-001**: All 6 edge cases have answers with code references (verify: grep edge cases section)
- [ ] **SC-002**: FR-010 and SC-006 removed or clarified (verify: grep both requirement IDs)
- [ ] **SC-003**: Validation rules consolidated (verify: spec.md FR-002-006 reference data-model.md)
- [ ] **SC-004**: 100% "lead" terminology (verify: `grep -c "consultation request"` returns 0)
- [ ] **SC-005**: Monitoring section added with verification strategies (verify: grep "Monitoring")
- [ ] **SC-006**: RESEND_FROM_EMAIL marked required (verify: grep quickstart.md)
- [ ] **SC-007**: All links work in GitHub markdown preview (verify: manual click-through)

**All criteria met**: ✅ Documentation alignment complete!

---

**Critical Success Factor**: Each user story (US1-US5) is independently completable and testable. Completing just US1 (edge cases) delivers value even if other stories are deferred.

**Commit Strategy**:
- Commit after Phase 3: "docs: document edge case behaviors with code references"
- Commit after Phase 4: "docs: remove unimplemented feature claims"
- Commit after Phase 5: "docs: add monitoring verification strategy"
- Commit after Phase 6: "docs: consolidate validation rules to data-model"
- Commit after Phase 7: "docs: standardize terminology to 'lead'"
- Commit after Phase 8: "docs: final verification and polish"

**Avoid**:
- ❌ Modifying src/pages/api/submit-lead.ts (read-only reference)
- ❌ Adding new functional requirements (alignment only, no new features)
- ❌ Breaking existing markdown links
- ❌ Leaving unanswered questions in edge cases section
