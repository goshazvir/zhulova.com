# Tasks: Server-Side Error Logging

**Input**: Design documents from `/specs/011-server-error-logging/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/logger-api.md, quickstart.md

**Tests**: Manual testing only (no automated tests requested in spec.md). All verification done via Vercel Dashboard logs inspection.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

Single project structure:
- `src/utils/` - Logger utility and types
- `src/pages/api/` - API endpoints (serverless functions)
- `.claude/docs/` - Documentation updates

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create logger utility structure and TypeScript types

- [x] T001 Create logger utility file at src/utils/logger.ts with placeholder exports
- [x] T002 [P] Create TypeScript types file at src/types/logger.ts with LogEntry, LogLevel, LogContext interfaces per data-model.md

**Checkpoint**: Logger structure created, ready for core implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Implement generateRequestId() helper in src/utils/logger.ts using crypto.randomUUID()
- [x] T004 [P] Implement safeStringify() helper in src/utils/logger.ts with try-catch for circular references
- [x] T005 [P] Implement sanitizeString() helper in src/utils/logger.ts with 7 regex patterns for PII redaction (emails, API keys, passwords, phone numbers, database URLs, bearer tokens, passwords)
- [x] T006 Implement sanitizeContext() helper in src/utils/logger.ts using sanitizeString() for all string values and field-based redaction for sensitive keys
- [x] T007 [P] Implement truncateContext() helper in src/utils/logger.ts to limit context to 1KB max size
- [x] T008 [P] Implement inferErrorType() helper in src/utils/logger.ts to categorize errors (db_error, email_error, validation_error, config_error, system_error, cold_start)

**Checkpoint**: Foundation ready - all helper functions complete, user story implementation can now begin

---

## Phase 3: User Story 1 - Debug Production API Failures (Priority: P1) 🎯 MVP

**Goal**: Enable developers to diagnose production API failures (database errors, validation errors, configuration errors) within minutes using structured logs in Vercel Dashboard.

**Independent Test**: Trigger a database connection failure in /api/submit-lead (e.g., temporarily set invalid SUPABASE_URL), submit form, check Vercel Dashboard → Logs within 30 seconds, verify structured JSON log appears with endpoint, error_type "db_error", error message, timestamp. Developer should be able to identify root cause immediately.

### Implementation for User Story 1

- [x] T009 [US1] Implement logError() function in src/utils/logger.ts following contracts/logger-api.md (signature, sanitization, truncation, JSON output to stderr)
- [x] T010 [P] [US1] Implement logWarn() function in src/utils/logger.ts following contracts/logger-api.md (signature, sanitization, truncation, JSON output to stdout)
- [x] T011 [P] [US1] Implement logInfo() function in src/utils/logger.ts following contracts/logger-api.md (signature, sanitization, truncation, JSON output to stdout)
- [x] T012 [US1] Add environment validation on cold start in src/pages/api/submit-lead.ts to check required env vars (SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, RESEND_FROM_EMAIL, NOTIFICATION_EMAIL) and log ERROR with logError() if missing
- [x] T013 [US1] Add database error logging in src/pages/api/submit-lead.ts for Supabase insert failures using logError() with context (action: "insert_lead", duration, errorCode, affectedResource: "leads", httpStatus: 500)
- [x] T014 [US1] Add validation error logging in src/pages/api/submit-lead.ts for Zod schema validation failures using logWarn() with context (action: "validate_request", validationErrors array, httpStatus: 400)
- [x] T015 [US1] Add catch-all error handler in src/pages/api/submit-lead.ts to log unhandled exceptions using logError() with context (action: "submit_lead", duration, httpStatus: 500)

**Manual Testing for User Story 1**:
- [ ] T016 [US1] Deploy to Vercel and trigger database error by temporarily setting invalid SUPABASE_URL, verify ERROR log appears in Vercel Dashboard within 30 seconds with correct structured JSON format
- [ ] T017 [US1] Trigger validation error by submitting form with invalid phone format, verify WARN log appears in Vercel Dashboard with validation errors list
- [ ] T018 [US1] Trigger missing env var error by temporarily removing RESEND_API_KEY, restart function (cold start), verify ERROR log with setup instructions appears
- [ ] T019 [US1] Verify no sensitive data in logs: export 10 test logs, run grep for email patterns, API key patterns, phone patterns - all should return 0 matches (SC-003 verification)
- [ ] T020 [US1] Measure API response time p95 before and after logging using Vercel Speed Insights, verify increase is <5ms (SC-004 verification)

**Checkpoint**: At this point, User Story 1 should be fully functional - all database errors, validation errors, and config errors are logged with actionable context. Developer can diagnose 90% of issues from logs alone.

---

## Phase 4: User Story 2 - Monitor Email Service Health (Priority: P2)

**Goal**: Enable developers to detect email delivery failures (rate limits, invalid sender, API downtime) proactively before users report missing emails.

**Independent Test**: Trigger an email delivery failure by using an invalid "from" email address in Resend configuration (set RESEND_FROM_EMAIL to "invalid@notverified.com"), submit a form, verify Vercel logs show WARN/ERROR entry with Resend error code, anonymized recipient [ADMIN], timestamp. Developer knows exactly when and why emails are failing.

### Implementation for User Story 2

- [x] T021 [US2] Add email error logging in src/pages/api/submit-lead.ts for Resend API failures using logError() for permanent failures (invalid sender, API errors) with context (action: "send_notification", errorCode, affectedResource: "[ADMIN]", httpStatus: 200)
- [x] T022 [US2] Add email rate limit logging in src/pages/api/submit-lead.ts for Resend 429 errors using logWarn() with context (action: "send_notification", errorCode: "429", retryAttempt: 1, affectedResource: "[ADMIN]")
- [x] T023 [US2] Add email timeout logging in src/pages/api/submit-lead.ts for Resend API timeouts using logWarn() with context (action: "send_notification", duration, affectedResource: "[ADMIN]")

**Manual Testing for User Story 2**:
- [ ] T024 [US2] Deploy to Vercel and trigger email error by setting invalid RESEND_FROM_EMAIL, submit form, verify ERROR log appears with clear error message and setup instructions
- [ ] T025 [US2] Simulate email rate limit (429 error) if possible, verify WARN log appears with retry attempt number and does not block form submission (lead saved to database)
- [ ] T026 [US2] Verify email error logs show clear distinction between transient (WARN) and permanent (ERROR) failures in Vercel Dashboard

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - developers can diagnose both API failures and email service issues from logs.

---

## Phase 5: User Story 3 - Analyze Error Patterns for System Improvements (Priority: P3)

**Goal**: Enable developers to review error logs over time to identify patterns (frequent validation errors, database timeouts during peak hours) for data-driven prioritization of improvements.

**Independent Test**: Generate 10+ errors of different types over a week (validation errors, database timeouts, email failures), query Vercel logs with filters (e.g., "error_type:validation_error"), verify logs can be aggregated to show most common error types, error frequency trends, affected endpoints.

### Implementation for User Story 3

- [ ] T027 [US3] Verify structured JSON logs are filterable by error_type field in Vercel Dashboard (manual verification with test errors)
- [ ] T028 [US3] Verify structured JSON logs are filterable by endpoint field in Vercel Dashboard (manual verification with test errors)
- [ ] T029 [US3] Verify structured JSON logs are filterable by timestamp for time-range queries in Vercel Dashboard

**Manual Testing for User Story 3**:
- [ ] T030 [US3] Generate 5 different error types (db_error, validation_error, email_error, config_error, system_error) and verify each can be filtered independently in Vercel Dashboard
- [ ] T031 [US3] Verify logs contain consistent structured fields (error_type, endpoint, context) enabling automated aggregation
- [ ] T032 [US3] Document log filtering patterns in quickstart.md section "Viewing Logs in Vercel Dashboard" with examples for common queries

**Long-term Validation** (after 7 days in production):
- [ ] T033 [US3] Query logs for "error_type:validation_error" and identify which validation rules fail most often to inform UX improvements (SC-002 verification: pattern analysis enables prioritization)

**Checkpoint**: All user stories should now be independently functional - logs are filterable, aggregatable, and support long-term pattern analysis.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, performance validation, security audit, cross-story improvements

- [x] T034 [P] Update .claude/docs/technical-spec.md with new "Logging & Monitoring" section documenting logger utility, log levels, sanitization patterns, Vercel Dashboard usage
- [x] T035 [P] Add logger utility documentation to CLAUDE.md under "Active Technologies" section: "Native Console API (Vercel logging)" with link to contracts/logger-api.md
- [ ] T036 Run full security audit: export 100 production logs from Vercel, run grep commands for PII patterns (emails, API keys, phone numbers, passwords), verify zero matches (SC-003 final verification)
- [ ] T037 Run performance validation: measure API response time p95 in Vercel Speed Insights after 7 days of production traffic, verify increase is <5ms compared to baseline (SC-004 final verification)
- [ ] T038 Validate SC-001: time how long it takes to locate an error log in Vercel Dashboard after incident report, verify <30 seconds
- [ ] T039 Validate SC-002: review 10 real production errors, attempt to diagnose each using only log entries (no local reproduction), verify 90% success rate (diagnosable from logs alone)
- [ ] T040 [P] Validate SC-005: filter Vercel logs by each error_type category and verify only relevant errors returned without noise from successful operations
- [ ] T041 [P] Validate SC-006: review configuration error logs (missing env vars) and verify each includes clear fix instructions ("Add [VAR] to Vercel environment variables")
- [x] T042 Code review: verify all logging calls follow best practices (no logging in loops, context objects <1KB, all async operations awaited, anonymized user data)
- [x] T043 Update plan.md status sections: mark Phase 0 (Research) as COMPLETE ✅, Phase 1 (Design) as COMPLETE ✅, update "Next Command" to deployment

**Final Checkpoint**: Feature complete - all user stories functional, all success criteria validated, documentation updated.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup (T001-T002) - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (T003-T008) - MVP implementation
- **User Story 2 (Phase 4)**: Depends on User Story 1 (T009-T011 for logger functions) - Independent of US3
- **User Story 3 (Phase 5)**: Depends on User Story 1 (T009-T011 for logger functions) - Independent of US2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Depends on US1 core logger functions (logError, logWarn) - Otherwise independent
- **User Story 3 (P3)**: Depends on US1 core logger functions (logError, logWarn) - Otherwise independent
- **US2 and US3 can proceed in parallel** after US1 completes (if staffed)

### Within Each User Story

**User Story 1**:
- T009, T010, T011 (logger functions) can run in parallel (marked [P])
- T012-T015 (integration into /api/submit-lead) must run sequentially (modify same file)
- T016-T020 (manual testing) must run after implementation

**User Story 2**:
- T021-T023 (email error logging) must run sequentially (modify same file)
- T024-T026 (manual testing) must run after implementation

**User Story 3**:
- T027-T029 (verification) can run in parallel
- T030-T032 (manual testing) must run after verification
- T033 (long-term validation) runs independently after 7 days

### Parallel Opportunities

**Setup (Phase 1)**:
- T002 (types file) can run in parallel with T001 (logger file) - marked [P]

**Foundational (Phase 2)**:
- T003, T004, T005, T007, T008 can all run in parallel (marked [P]) - different helper functions
- T006 depends on T005 (uses sanitizeString)

**User Story 1 (Phase 3)**:
- T009, T010, T011 can run in parallel (marked [P]) - three separate logger functions

**User Story 3 (Phase 5)**:
- T027-T029 can run in parallel - independent verification tasks

**Polish (Phase 6)**:
- T034, T035 can run in parallel (marked [P]) - different documentation files
- T036, T037, T040, T041 can run in parallel (marked [P]) - independent verification tasks

---

## Parallel Example: Foundational Phase

```bash
# Launch all helper functions together (Phase 2):
Task: "Implement generateRequestId() helper in src/utils/logger.ts"
Task: "Implement safeStringify() helper in src/utils/logger.ts"
Task: "Implement sanitizeString() helper in src/utils/logger.ts"
Task: "Implement truncateContext() helper in src/utils/logger.ts"
Task: "Implement inferErrorType() helper in src/utils/logger.ts"

# Then implement sanitizeContext() (depends on sanitizeString):
Task: "Implement sanitizeContext() helper in src/utils/logger.ts"
```

## Parallel Example: User Story 1

```bash
# Launch all logger functions together (Phase 3):
Task: "Implement logError() function in src/utils/logger.ts"
Task: "Implement logWarn() function in src/utils/logger.ts"
Task: "Implement logInfo() function in src/utils/logger.ts"

# Then integrate into API endpoint sequentially (same file):
Task: "Add environment validation on cold start in src/pages/api/submit-lead.ts"
Task: "Add database error logging in src/pages/api/submit-lead.ts"
Task: "Add validation error logging in src/pages/api/submit-lead.ts"
Task: "Add catch-all error handler in src/pages/api/submit-lead.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T002)
2. Complete Phase 2: Foundational (T003-T008) - CRITICAL, blocks all stories
3. Complete Phase 3: User Story 1 (T009-T020)
4. **STOP and VALIDATE**: Test User Story 1 independently (T016-T020)
5. Deploy to production if ready

**Estimated Time**: 4-6 hours for MVP (single developer)

**Value Delivered**: Developers can diagnose 90% of production issues (database errors, validation errors, config errors) from logs within minutes instead of hours of guesswork.

### Incremental Delivery

1. Complete Setup + Foundational (T001-T008) → Foundation ready
2. Add User Story 1 (T009-T020) → Test independently → Deploy to production (MVP!)
3. Add User Story 2 (T021-T026) → Test independently → Deploy to production
4. Add User Story 3 (T027-T033) → Test independently → Validate over 7 days
5. Polish (T034-T043) → Final validation and documentation

**Benefit**: Each story adds value without breaking previous stories. Can deploy MVP first, then incrementally add email monitoring and pattern analysis.

### Parallel Team Strategy

With multiple developers (if applicable):

1. Team completes Setup + Foundational together (T001-T008)
2. Once Foundational is done:
   - Developer A: User Story 1 (T009-T020)
   - Wait for Developer A to complete T009-T011 (logger functions)
   - Developer B: User Story 2 (T021-T026) - can start after T011
   - Developer C: User Story 3 (T027-T033) - can start after T011
3. Stories complete and integrate independently

**Reality Check**: This is a small feature (~43 tasks, ~8-10 hours total). Single developer sequential execution is most practical.

---

## Task Breakdown Summary

**Total Tasks**: 43 tasks across 6 phases

**Task Count by Phase**:
- Phase 1 (Setup): 2 tasks
- Phase 2 (Foundational): 6 tasks
- Phase 3 (User Story 1 - MVP): 12 tasks (7 implementation + 5 manual testing)
- Phase 4 (User Story 2): 6 tasks (3 implementation + 3 manual testing)
- Phase 5 (User Story 3): 7 tasks (3 implementation + 3 manual testing + 1 long-term validation)
- Phase 6 (Polish): 10 tasks (documentation + final validation)

**Parallelizable Tasks**: 15 tasks marked [P] (35% of total)

**Independent Test Criteria**:
- **US1**: Trigger database error, verify structured log in Vercel Dashboard within 30 seconds (T016)
- **US2**: Trigger email error, verify error log with Resend error code appears (T024)
- **US3**: Query logs by error_type filter, verify aggregatable results (T030)

**MVP Scope (User Story 1 Only)**: 20 tasks (T001-T020) - Core logging for API errors

**Estimated Effort**:
- MVP (US1): 4-6 hours
- Full feature (US1+US2+US3): 8-10 hours
- Polish + validation: 2-3 hours
- **Total**: 10-13 hours (single developer, sequential execution)

---

## Notes

- **[P] tasks**: Different files, no dependencies - can run in parallel
- **[Story] label**: Maps task to specific user story for traceability
- **Manual testing only**: No automated tests (not requested in spec.md)
- **No external dependencies**: Native console API only (FR-015)
- **Performance budget**: <5ms per log call (SC-004)
- **Security requirement**: Zero PII leaks (SC-003)
- **Commit strategy**: Commit after each phase checkpoint
- **Deployment strategy**: Deploy after US1 (MVP), US2, US3 incrementally
- **Verification**: All validation done via Vercel Dashboard logs inspection + Vercel Speed Insights
