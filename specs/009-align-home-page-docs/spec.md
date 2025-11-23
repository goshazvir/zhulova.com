# Feature Specification: Align Home Page Documentation

**Feature Branch**: `009-align-home-page-docs`
**Created**: 2025-11-23
**Status**: Completed (2025-11-23)
**Input**: User description: "Align 002-home-page specification with actual implementation completed 2025-11-16. Fix 13 inconsistencies: (CRITICAL) Status shows 'Draft' but feature completed and deployed; Wrong creation date (2025-01-16 vs actual 2025-11-16); Missing Edge Cases section documenting form validation, API error handling, database connection failures, concurrent submissions, email delivery failures, rate limiting behavior. (HIGH) Functional requirements lack code references to implementation files (ConsultationModal.tsx, submit-lead.ts API endpoint, Supabase schema, Resend email config); Success criteria SC-001 to SC-010 lack measurement methods and monitoring tools; Duplicate validation rules in data-model.md (Lead entity validation appears twice); Missing tasks.md file; CLAUDE.md shows incorrect completion status. (MEDIUM) plan.md constitution check needs server mode clarification for /api/submit-lead endpoint; Assumptions don't reflect actual form fields implemented (name, email, phone, message vs spec claims); Missing quickstart verification steps. Goal: Update spec.md, plan.md, data-model.md to accurately document what was built (consultation modal with Zod validation, serverless API endpoint, Supabase + Resend integration, error handling, rate limiting) OR identify missing implementation. Documentation-only feature, no code changes to src/ files."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Developer Understanding Consultation Form Implementation (Priority: P1)

A new developer needs to understand how the consultation form works (modal, form validation, API endpoint, database integration, email notifications) by reading the 002-home-page specification. They expect the spec to accurately reflect what was actually built, not aspirational or outdated requirements.

**Why this priority**: Inaccurate documentation is a critical blocker for developer onboarding and bug fixes. If the spec claims different form fields or validation rules than implemented, developers will waste time investigating discrepancies and potentially introduce bugs when modifying the form.

**Independent Test**: Can be fully tested by reading specs/002-home-page/spec.md and plan.md, then verifying every claim against actual implementation files (ConsultationModal.tsx, src/pages/api/submit-lead.ts, Supabase schema, Resend email configuration). All documented behavior must match code reality.

**Acceptance Scenarios**:

1. **Given** developer reads spec.md status field, **When** they check git history, **Then** status shows "Completed (2025-11-16)" matching actual merge date from git log
2. **Given** developer reads spec.md creation date, **When** they verify git log, **Then** date shows "2025-11-16" not "2025-01-16"
3. **Given** developer reads edge cases section, **When** they look for API error handling behavior, **Then** spec documents how system handles database failures, concurrent submissions, email delivery errors, and rate limiting
4. **Given** developer reads functional requirements, **When** checking FR for form validation, **Then** requirement includes code reference to Zod schema in ConsultationModal.tsx with line numbers

---

### User Story 2 - QA Creating Test Plan for Consultation Submission (Priority: P1)

A QA engineer creates test cases for the consultation form submission flow by reading functional requirements and success criteria. They need concrete, testable requirements with measurement methods, not ambiguous claims like "form works reliably" without knowing how to verify.

**Why this priority**: Ambiguous requirements block QA from creating actionable test plans. Success criteria without measurement tools lead to subjective testing and missed validation. Missing code references make it impossible to verify requirements match implementation.

**Independent Test**: Can be tested by extracting all functional requirements and success criteria from spec.md, attempting to create objective test cases for each, and verifying each requirement has code reference or database schema reference showing where it's implemented.

**Acceptance Scenarios**:

1. **Given** QA reads SC-001 about form submission success rate, **When** they check spec for measurement method, **Then** spec includes "Monitoring & Verification" section explaining: "Query Supabase leads table → Check success_count / total_submissions ratio ≥95%"
2. **Given** QA reads FR about email validation, **When** they create test case, **Then** requirement includes code reference: "ConsultationModal.tsx:45-52 defines Zod email schema with .email() validator"
3. **Given** QA reads FR about API error responses, **When** they test edge cases, **Then** requirement references submit-lead.ts:78-95 showing actual error handling code
4. **Given** QA reads success criteria SC-005 about response time, **When** they measure performance, **Then** spec documents tool: "Vercel Function Logs → Check p95 latency for /api/submit-lead endpoint"

---

### User Story 3 - PM Measuring Feature Completion (Priority: P2)

A project manager reviews spec.md to verify feature 002 completion status and measure success criteria. They need accurate status ("Completed" vs "Draft") and documented methods to verify each success criterion was achieved.

**Why this priority**: Outdated status prevents accurate project tracking. Success criteria without verification methods are aspirational, not measurable. PM cannot report completion confidence or demonstrate value without measurement tools.

**Independent Test**: Can be tested by checking spec.md status matches git log completion date, reviewing all success criteria (SC-001 to SC-010) have documented verification methods referencing specific tools or database queries.

**Acceptance Scenarios**:

1. **Given** PM reads spec.md status, **When** they verify completion date, **Then** status shows "Completed (2025-11-16)" matching git merge commit date
2. **Given** PM reviews SC-002 about Lighthouse performance score, **When** they check how to measure, **Then** spec documents: "Run Lighthouse audit on https://zhulova.com → Check Performance score ≥90"
3. **Given** PM validates SC-006 about email delivery rate, **When** they verify this criterion, **Then** spec documents: "Check Resend dashboard → Verify delivery rate ≥98% for last 30 days"
4. **Given** PM reads all 10 success criteria, **When** checking measurement methods, **Then** every SC-001 to SC-010 has documented tool/location/query for verification

---

### User Story 4 - Architect Reviewing API and Database Integration (Priority: P2)

An architect reviews plan.md and data-model.md to understand how the consultation form integrates with backend services (Supabase database, Resend email, serverless API endpoint). They need accurate documentation of the /api/submit-lead endpoint architecture and data model.

**Why this priority**: Incorrect architecture documentation risks future features being built on wrong assumptions. If plan.md doesn't document the serverless API endpoint or data-model.md has duplicate validation rules, architects may make wrong decisions about system design.

**Independent Test**: Can be tested by reading plan.md constitution check section, verifying it accurately describes /api/submit-lead as serverless endpoint, checking data-model.md has no duplicate Lead entity validation rules, and comparing documented schema against actual Supabase table structure.

**Acceptance Scenarios**:

1. **Given** architect reads plan.md constitution check, **When** they verify server mode usage, **Then** plan states: "Server mode permitted for /api/submit-lead endpoint (serverless function); consultation form page remains pre-rendered static"
2. **Given** architect checks data-model.md, **When** reviewing Lead entity validation, **Then** validation rules appear only once (not duplicated) with accurate Zod schema reference
3. **Given** architect validates Supabase schema, **When** comparing against data-model.md, **Then** all documented fields (name, email, phone, message, created_at) match actual table columns
4. **Given** architect reviews API error handling, **When** checking edge cases, **Then** spec documents behavior for database connection failures, concurrent submissions, and rate limiting

---

### User Story 5 - Technical Writer Fixing Documentation Debt (Priority: P3)

A technical writer updates 002-home-page specification and notices duplicate validation rules in data-model.md, missing tasks.md file, incorrect CLAUDE.md completion status, and assumptions that don't match actual form fields implemented.

**Why this priority**: Duplicate content creates maintenance burden and sync risk. Missing tasks.md reduces consistency with other features. Incorrect CLAUDE.md status reduces trust in project documentation. While lower priority than developer/QA blockers, these issues accumulate as technical debt.

**Independent Test**: Can be tested by searching data-model.md for duplicate Lead entity sections, verifying tasks.md exists in specs/002-home-page/ directory, checking CLAUDE.md shows correct completion status for 002, comparing assumptions section against actual form implementation.

**Acceptance Scenarios**:

1. **Given** writer checks data-model.md, **When** searching for Lead entity validation, **Then** validation rules appear exactly once (duplicates removed)
2. **Given** writer verifies specs/002-home-page/ directory, **When** listing files, **Then** tasks.md exists with implementation breakdown
3. **Given** writer checks CLAUDE.md "Recent Changes" section, **When** finding 002-home-page entry, **Then** status shows "Completed (2025-11-16)" not "Draft"
4. **Given** writer reviews assumptions section, **When** checking form fields, **Then** assumptions document actual fields (name, email, phone, message) not placeholder/different field names

---

### Edge Cases

**Current State**: spec.md lacks Edge Cases section. Below are edge cases that need documentation based on actual implementation:

**Q1: What happens when user submits form with invalid email format?**
- **Expected Answer**: Zod validation catches invalid email before API call, displays inline error message "Please enter a valid email address", prevents form submission
- **Code**: ConsultationModal.tsx:45-52 (Zod email schema), ConsultationModal.tsx:120-135 (error display)

**Q2: What happens when /api/submit-lead endpoint fails due to database connection error?**
- **Expected Answer**: API returns 500 error with message "Unable to save your request. Please try again.", form shows error toast, lead data not saved to Supabase
- **Code**: src/pages/api/submit-lead.ts:78-95 (error handling), ConsultationModal.tsx:95-110 (error display)

**Q3: What happens when multiple users submit consultation forms simultaneously?**
- **Expected Answer**: Each submission handled independently by separate serverless function invocation. Database uses auto-increment ID + timestamp to prevent conflicts. No rate limiting between different users.
- **Code**: src/pages/api/submit-lead.ts (stateless function), Supabase leads table (id primary key, created_at timestamp)

**Q4: What happens when Resend email delivery fails but database save succeeds?**
- **Expected Answer**: User sees success message (form submitted), but admin doesn't receive email notification. Lead saved in Supabase for manual follow-up. API logs email failure to Vercel logs but doesn't fail the request.
- **Code**: src/pages/api/submit-lead.ts:45-65 (email sending), src/pages/api/submit-lead.ts:95-110 (error logging)

**Q5: What happens when same user submits consultation form multiple times in quick succession?**
- **Answer**: No rate limiting implemented. Each submission creates separate lead record in database and sends new email notification. Client-side prevents double-click during active submission (disabled button), but user can submit multiple times after modal resets (3 seconds auto-close). No server-side duplicate detection or IP-based rate limiting.
- **Code**: ConsultationModal.tsx:163 (disabled during submit prevents double-click), submit-lead.ts:110-114 (insert without duplicate check)
- **Behavior**: Multiple submissions from same user create multiple database records and emails. This is acceptable for low-traffic scenarios and legitimate re-submissions, but vulnerable to spam/abuse if becomes a problem.
- **Recommendation**: If duplicate submissions become an issue, implement rate limiting (see Future Enhancements section for 3-tier protection strategy)

**Q6: What happens when user closes modal/navigates away before form submission completes?**
- **Expected Answer**: API request may complete in background (serverless function continues), but user won't see success/error message. If submission succeeds, lead saved but user unaware. No automatic retry mechanism.
- **Code**: ConsultationModal.tsx:85-95 (submission handler - no abort signal), browser behavior (request continues after navigation)

## Requirements *(mandatory)*

### Functional Requirements

**Critical Issue Fixes:**

- **FR-001**: spec.md status field MUST show "Completed (2025-11-16)" instead of "Draft" to reflect actual completion date from git merge to master
- **FR-002**: spec.md creation date MUST show "2025-11-16" instead of incorrect "2025-01-16"
- **FR-003**: spec.md MUST add Edge Cases section documenting 6 edge cases with answers: form validation errors, API/database failures, concurrent submissions, email delivery failures, rate limiting behavior, incomplete submissions
- **FR-004**: CLAUDE.md "Recent Changes" section MUST show correct 002-home-page completion status as "Completed (2025-11-16)"

**High Priority Issue Fixes:**

- **FR-005**: All functional requirements in spec.md MUST include code references using file:line pattern (e.g., "ConsultationModal.tsx:45-52", "submit-lead.ts:78-95") pointing to actual implementation
- **FR-006**: spec.md MUST add "Monitoring & Verification" section documenting how to measure each success criterion (SC-001 to SC-010) with specific tools, database queries, or dashboard locations
- **FR-007**: data-model.md MUST remove duplicate Lead entity validation rules (keep only one comprehensive validation section with Zod schema reference)
- **FR-008**: specs/002-home-page/ directory MUST include tasks.md file documenting implementation breakdown (if missing, create based on actual work completed)

**Medium Priority Issue Fixes:**

- **FR-009**: plan.md constitution check MUST clarify that server mode is permitted exclusively for /api/submit-lead serverless function; consultation form page remains pre-rendered static
- **FR-010**: spec.md assumptions section MUST update form fields to match actual implementation (name, email, phone, message fields) if different from current documentation
- **FR-011**: quickstart.md MUST include verification steps for testing consultation form submission end-to-end (form validation, API call, database save, email notification)

**Coverage and Validation:**

- **FR-012**: All functional requirements from original 002 spec MUST have corresponding code reference OR be marked in "Out of Scope" section with rationale if not implemented
- **FR-013**: All edge case answers MUST reference specific implementation files and line numbers where behavior is defined
- **FR-014**: plan.md assumptions section MUST reflect actual implementation decisions about database schema, email service configuration, and error handling strategy

### Key Entities

- **Documentation Artifact**: Represents a specification document (spec.md, plan.md, data-model.md)
  - Attributes: filePath (string), lastUpdated (date), status (Draft | Completed), requirementCount (number), issueCount (number)
  - Relationships: References implementation files (ConsultationModal.tsx, submit-lead.ts, Supabase schema)
  - Lifecycle: Created during planning, updated during implementation, finalized after deployment

- **Documentation Issue**: Represents a discrepancy between spec and implementation
  - Attributes: issueId (string), category (Critical | High | Medium), location (file path + line number), summary (string), recommendation (string)
  - Relationships: Linked to functional requirement fix (FR-001 to FR-014)
  - Lifecycle: Identified during analysis, resolved via documentation update, verified via testing

- **Functional Requirement**: Represents a documented capability in spec.md
  - Attributes: requirementId (string, e.g., FR-003), description (string), implementation status (Implemented | Partial | Not Implemented), codeReference (string, file:line)
  - Relationships: Maps to implementation files, validates against actual code behavior
  - Lifecycle: Defined in spec, validated against implementation, updated when misaligned

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of critical issues (FR-001 to FR-004) are resolved - spec status updated to Completed, creation date corrected, edge cases documented, CLAUDE.md status fixed
- **SC-002**: 100% of high priority issues (FR-005 to FR-008) are resolved - code references added, monitoring section created, duplicate validation rules removed, tasks.md exists
- **SC-003**: All edge case questions (Q1-Q6) have documented answers with code references to actual implementation behavior
- **SC-004**: All success criteria (SC-001 to SC-010 from original 002 spec) have documented measurement methods in "Monitoring & Verification" section with specific tools or database queries
- **SC-005**: Constitution check in plan.md accurately documents server mode usage for /api/submit-lead endpoint with proper justification
- **SC-006**: data-model.md has zero duplicate validation sections - Lead entity validation appears exactly once
- **SC-007**: Assumptions section reflects actual implementation - form fields (name, email, phone, message), database schema, email service configuration all match code reality
- **SC-008**: All functional requirements from original 002 spec have code references OR documented in "Out of Scope" section - 100% requirement coverage
- **SC-009**: Zero ambiguous requirements - QA can create objective test cases for 100% of functional requirements using code references and edge case documentation
- **SC-010**: Date accuracy achieved - spec.md creation date, CLAUDE.md completion date, git history all show consistent, factually correct dates (2025-11-16)

### Monitoring & Verification

How to verify each success criterion:

- **SC-001**: Read specs/002-home-page/spec.md:5 (status field), spec.md:4 (creation date), spec.md:edge-cases-section, CLAUDE.md:line (Recent Changes) - verify all show corrected values
- **SC-002**: Read spec.md functional requirements for code references, spec.md for Monitoring section, data-model.md for duplicate check, ls specs/002-home-page/tasks.md - verify all present
- **SC-003**: Read spec.md Edge Cases section - verify Q1-Q6 each have Answer + Code reference with actual file:line numbers
- **SC-004**: Read spec.md Monitoring & Verification section - verify SC-001 to SC-010 from original spec each have tool/query/dashboard location documented
- **SC-005**: Read plan.md constitution check - verify accurate server mode description with /api/submit-lead clarification
- **SC-006**: Search data-model.md for "Lead entity" or "Lead validation" - verify appears exactly once (not duplicated)
- **SC-007**: Compare spec.md assumptions against ConsultationModal.tsx form fields, Supabase schema columns, Resend config - verify 100% match
- **SC-008**: Create mapping table of all FRs from original 002 spec → implementation files - verify 100% have code reference or Out of Scope note
- **SC-009**: Extract all FR from spec.md - verify each has testable criteria and code reference enabling objective test case creation
- **SC-010**: Run `git log --grep="002-home-page" --date=short` - verify dates in spec.md and CLAUDE.md match git history (2025-11-16)

## Scope *(optional)*

### In Scope

- Update spec.md status to "Completed (2025-11-16)"
- Fix spec.md creation date from "2025-01-16" to "2025-11-16"
- Create Edge Cases section in spec.md with 6 documented edge cases
- Add code references (file:line) to all functional requirements
- Add "Monitoring & Verification" section for success criteria
- Remove duplicate Lead entity validation from data-model.md
- Create tasks.md if missing
- Fix CLAUDE.md completion status for 002-home-page
- Update plan.md constitution check for /api/submit-lead endpoint
- Update assumptions section to match actual form fields
- Add quickstart verification steps

### Out of Scope

- Modifying implementation code in src/ directory (ConsultationModal.tsx, submit-lead.ts, etc.)
- Adding missing features to consultation form (documentation-only feature)
- Changing Supabase schema or Resend configuration (align docs with existing setup)
- Implementing new functional requirements (align docs with existing implementation only)
- Creating monitoring dashboards or tools (spec documents how to measure, doesn't build tools)

### Future Enhancements

**Documentation Tooling:**
- **Automated spec validation script**: Create tool that compares spec claims against actual code implementation files
- **Schema validation**: Build script that compares data-model.md against actual Supabase table schema
- **API contract testing**: Add tests that verify /api/submit-lead behavior matches spec edge cases

**Rate Limiting Protection** (if duplicate submissions become a problem):

Currently, the consultation form has no rate limiting. If spam/abuse becomes an issue, implement one of these protection levels:

- **Level 1: Minimal Protection (Recommended for quick fix)**
  - Implementation: Client-side debounce - disable submit button for 30 seconds after successful submission
  - Code changes: Add localStorage check + timer in ConsultationModal.tsx
  - Effect: Prevents accidental duplicate clicks and casual spam
  - Effort: ~10 minutes implementation
  - Use case: Low-traffic sites with occasional duplicate submissions

- **Level 2: Moderate Protection (Optimal balance)**
  - Implementation: Level 1 + Server-side duplicate check - query Supabase for submissions from same phone/email in last 5 minutes
  - Code changes: Add duplicate detection query in submit-lead.ts before insert, return user-friendly error message "You've already submitted a request recently. Please wait 5 minutes before trying again."
  - Effect: Prevents spam + provides good UX for legitimate users
  - Effort: ~30 minutes implementation
  - Use case: Medium-traffic sites experiencing regular duplicates or light spam

- **Level 3: Full Protection (For critical spam issues)**
  - Implementation: Level 2 + IP-based rate limiting - track IP addresses, max 3 submissions per hour from single IP
  - Code changes: Add Redis/KV store or Vercel Edge Config for IP tracking, implement sliding window rate limiter
  - Effect: Complete protection from abuse, even from different phone/email combinations
  - Effort: ~1-2 hours implementation (requires additional infrastructure)
  - Use case: High-traffic sites under active spam attack

**Recommendation**: Start with Level 1 if duplicates appear, escalate to Level 2 if spam continues, use Level 3 only if facing coordinated abuse

## Assumptions *(optional)*

- **A-001**: Implementation in ConsultationModal.tsx, src/pages/api/submit-lead.ts, Supabase schema is correct and complete - documentation conforms to code, not vice versa
- **A-002**: No code changes are permitted in this feature - this is documentation-only alignment work
- **A-003**: Git commit history is accurate source of truth for dates and completion status
- **A-004**: Original 002 spec has Success Criteria SC-001 to SC-010 that need measurement method documentation
- **A-005**: Edge case behaviors documented reflect current implementation reality, not ideal/future behavior
- **A-006**: Monitoring tools mentioned (Vercel logs, Supabase dashboard, Resend dashboard, Lighthouse) are already accessible to team
- **A-007**: Stakeholders (developers, QA, PM, architect) prefer accurate documentation over preserving outdated requirements
- **A-008**: Consultation form is production-ready and deployed (zhulova.com) - no missing implementation to document
- **A-009**: Current traffic levels don't require rate limiting - system can tolerate occasional duplicate submissions; Future Enhancements section documents escalation path if spam becomes issue

## Dependencies *(optional)*

- **D-001**: Access to implementation files: ConsultationModal.tsx, src/pages/api/submit-lead.ts, Supabase schema documentation
- **D-002**: Access to existing spec documentation in specs/002-home-page/ (spec.md, plan.md, data-model.md, research.md, quickstart.md)
- **D-003**: Access to git history to verify completion dates and merge timeline
- **D-004**: Access to CLAUDE.md to verify project documentation accuracy
- **D-005**: Access to Vercel logs, Supabase dashboard, Resend dashboard for verification method documentation

## Constraints *(optional)*

- **Documentation-only changes**: MUST NOT modify implementation code in src/ directory (ConsultationModal.tsx, submit-lead.ts, etc.)
- **Preserve git history**: MUST NOT rewrite commits, amend messages, or alter existing git log
- **Constitution authority**: Constitution principles are non-negotiable - cannot claim static-only if /api endpoint uses server mode
- **Single source of truth**: When spec.md, plan.md conflict with implementation, code is authoritative - update all documents to match
- **No retroactive planning**: Cannot change what was originally planned, only update documentation to reflect what was actually built
- **Backward compatibility**: Updated documentation must not break references from other features that may depend on 002 consultation form

## Open Questions *(optional)*

- **Q1**: Is rate limiting implemented for consultation form submissions? If yes, what is the mechanism (client-side, server-side, time window) and where is the code? This affects Edge Case Q5 documentation.
