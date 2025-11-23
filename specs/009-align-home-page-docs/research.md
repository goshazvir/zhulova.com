# Research: Align Home Page Documentation

**Feature**: 009-align-home-page-docs | **Date**: 2025-11-23 | **Phase**: 0 (Research)

## Overview

This document identifies 13 documentation inconsistencies between 002-home-page specification and actual implementation completed 2025-11-16. Research completed through manual inspection of spec files and implementation code.

## Research Method

**Approach**: Manual comparison of specification documents vs. deployed implementation
- Read specs/002-home-page/spec.md, plan.md, data-model.md
- Read implementation files: ConsultationModal.tsx, submit-lead.ts, consultationSchema.ts
- Check git log for accurate completion dates
- Cross-reference CLAUDE.md Recent Changes section

**Timeline**: Feature 002 completed 2025-11-16, deployed to zhulova.com same date

---

## Critical Issues (Priority P1)

### R1: Status Field Shows "Draft" Instead of "Completed"

**Issue**: `specs/002-home-page/spec.md:5` shows `Status: Draft` but feature was completed and deployed 2025-11-16.

**Evidence**:
- Git log shows merge commit for 002-home-page on 2025-11-16
- CLAUDE.md line 753 confirms "002-home-page (2025-11-16): ✅ COMPLETED & DEPLOYED"
- Site live at https://zhulova.com with all 6 user stories implemented

**Required Fix**: Change status from "Draft" to "Completed (2025-11-16)"

**User Story**: US3 (PM measuring feature completion)

---

### R2: Creation Date Incorrect

**Issue**: `specs/002-home-page/spec.md:4` shows `Created: 2025-01-16` but actual creation date is `2025-11-16` (typo: 01 vs 11).

**Evidence**:
- Git log shows feature branch created 2025-11-16
- CLAUDE.md Recent Changes section lists "2025-11-16" for 002-home-page
- All other feature docs reference November 2025 timeline

**Required Fix**: Change "2025-01-16" to "2025-11-16"

**User Story**: US5 (Technical writer fixing documentation debt)

---

### R3: Missing Edge Cases Section

**Issue**: `specs/002-home-page/spec.md:~111-120` has Edge Cases section but contains only QUESTIONS, not ANSWERS with code references.

**Current State** (6 questions without answers):
1. What happens when visitor submits form but loses internet connection?
2. How does system handle duplicate consultation requests?
3. What happens when email notification service unavailable?
4. How does form validation handle international phone numbers?
5. What happens when same user submits multiple times quickly?
6. How does form handle browsers with JavaScript disabled?

**Required Fix**: Convert questions to documented answers with code references following pattern from 008-align-base-infra-docs:
```markdown
**Q1: [Question]**
- **Answer**: [Documented behavior]
- **Code**: [file.ext:line-numbers]
- **Behavior**: [Additional context]
```

**User Story**: US1 (Developer understanding implementation)

---

### R4: CLAUDE.md Shows Incorrect Completion Status

**Issue**: `CLAUDE.md:753` shows "002-home-page (2025-11-16): ✅ COMPLETED & DEPLOYED" with note "52/62 tasks (84%) - Production ready"

**Problem**: This is confusing - it says "COMPLETED & DEPLOYED" but also "52/62 tasks" implying incomplete status.

**Evidence**:
- Feature is fully deployed and functional
- All 6 user stories implemented
- Remaining 10 tasks were optional (image optimization, end-to-end testing)

**Required Fix**: Update CLAUDE.md to clarify completion criteria or mark as "100% Complete (core features)" to avoid ambiguity

**User Story**: US3 (PM measuring feature completion)

---

### R5: Functional Requirements Missing Code References

**Issue**: `specs/002-home-page/spec.md:~136-220` has 20+ functional requirements but NONE include code references.

**Example**:
- FR-001: "Consultation modal MUST be triggered by CTA buttons" - WHERE is this code?
- FR-005: "Form MUST include fields: name, phone, telegram, email" - WHERE is validation logic?
- FR-008: "Form submission MUST save lead to Supabase leads table" - WHERE is database insert?

**Required Fix**: Add code references to all FRs using pattern: `[requirement text] *(file.ext:line-numbers)*`

**Examples of code references needed**:
- ConsultationModal.tsx:25-56 (form submission handler)
- submit-lead.ts:9-30 (Zod validation schema)
- submit-lead.ts:110-114 (Supabase insert)
- submit-lead.ts:127-144 (Resend email notification)

**User Story**: US1 (Developer understanding implementation)

---

### R6: Success Criteria Lack Measurement Methods

**Issue**: `specs/002-home-page/spec.md:~245-254` has SC-001 to SC-010 success criteria but NO "Monitoring & Verification" section explaining HOW to measure them.

**Current State**: Success criteria listed without measurement methods
- SC-001: Consultation modal opens within 100ms - HOW to measure?
- SC-005: Form validation errors shown within 50ms - HOW to test?
- SC-008: Lead data saved to Supabase within 2 seconds - HOW to verify?

**Required Fix**: Add "Monitoring & Verification" section (same pattern as feature 008) with format:
```markdown
- **SC-001**: Tool: [tool name] | Method: [step-by-step measurement process]
```

**User Story**: US2 (QA creating test plan)

---

### R7: Missing tasks.md File

**Issue**: `specs/002-home-page/` directory lacks `tasks.md` file. All other features (001, 003, 004, 005, 006, 007, 008) have tasks.md.

**Problem**: No task breakdown document exists for 002-home-page, making it impossible to:
- Understand implementation sequence
- See task dependencies
- Track completion progress
- Reference for future similar features

**Required Fix**: Create `specs/002-home-page/tasks.md` documenting the implementation sequence (retroactively, since feature already complete)

**User Story**: US1 (Developer understanding implementation), US3 (PM measuring completion)

---

## High Priority Issues (Priority P2)

### R8: Constitution Check Needs Server Mode Clarification

**Issue**: `specs/002-home-page/plan.md:~28` constitution check says "✅ Static-First Architecture" but doesn't explain why server mode is OK for /api/submit-lead.

**Context**:
- Constitution (v1.1.0) prohibits `output: 'server'` or `output: 'hybrid'`
- Actual astro.config.mjs has `output: 'server'`
- Feature 002 includes /api/submit-lead serverless function

**Required Fix**: Add clarification in plan.md constitution check:
"Server mode permitted exclusively for /api/* serverless functions; all pages remain pre-rendered static at build time"

**Precedent**: Feature 008 documented this same clarification in 001-base-infrastructure plan.md

**User Story**: US4 (Architect reviewing API integration)

---

### R9: Assumptions Don't Reflect Actual Form Fields

**Issue**: `specs/002-home-page/spec.md:~238-243` assumptions section doesn't document actual form field requirements.

**Missing Assumptions**:
- Phone field is required (Zod validation enforces minimum 7 digits)
- Telegram and email are optional (schema uses `.optional().or(z.literal(''))`)
- Telegram handles auto-prefixed with @ symbol if missing
- No rate limiting implemented (each submission creates new DB record)

**Required Fix**: Update assumptions to match implemented validation rules

**User Story**: US1 (Developer understanding implementation)

---

### R10: Duplicate Validation Rules in data-model.md

**Issue**: `specs/002-home-page/data-model.md` has duplicate validation rules - some in Lead entity definition, same rules repeated in Validation Rules section.

**Example**: Phone validation appears in:
1. Lead entity "phone" field description
2. "Validation Rules" section under "Phone Validation"

**Required Fix**: Consolidate - keep validation rules in entity definition only, remove duplicate Validation Rules section

**User Story**: US5 (Technical writer fixing documentation debt)

---

## Medium Priority Issues (Priority P3)

### R11: Missing Quickstart Verification Steps

**Issue**: `specs/002-home-page/quickstart.md` may lack step-by-step verification guide for testing consultation form.

**Required Content** (if missing):
1. How to test form locally
2. How to verify Supabase connection
3. How to confirm email notifications work
4. How to validate all edge cases

**Required Fix**: Add verification steps to quickstart.md

**User Story**: US1 (Developer understanding implementation)

---

### R12: Code References Must Follow file:line Pattern

**Issue**: All code references across all documents must use consistent format.

**Format**: `filename.ext:startLine-endLine` or `filename.ext:lineNumber`

**Examples**:
- ✅ Good: `ConsultationModal.tsx:25-56`
- ✅ Good: `submit-lead.ts:110`
- ❌ Bad: "in ConsultationModal component"
- ❌ Bad: "ConsultationModal.tsx (form submission)"

**Required Fix**: Ensure all code references use consistent file:line pattern

**User Story**: US1 (Developer understanding implementation)

---

### R13: Out of Scope Section May Be Needed

**Issue**: Some functional requirements may be out of scope for 002-home-page (e.g., multi-step form wizard, file uploads, payment integration).

**Decision Needed**: Should spec.md include "Out of Scope" section listing what was explicitly NOT implemented?

**Benefit**: Clarifies scope boundaries for future features

**Required Fix**: Add "Out of Scope" section if missing, or mark as N/A if not needed

**User Story**: US1 (Developer understanding implementation), US3 (PM measuring completion)

---

## Research Summary

**Total Issues**: 13 (3 critical, 7 high priority, 3 medium priority)

**Key Findings**:
1. **Status/Dates**: Incorrect status and creation date create confusion about feature completion
2. **Code References**: Absence of code references makes spec unusable for developers
3. **Edge Cases**: Questions without answers leave implementation behavior undocumented
4. **Measurement Methods**: Missing verification methods prevent QA from creating test plans
5. **Server Mode**: Constitution compliance needs explicit clarification for serverless functions

**Implementation Strategy**:
- Group R1-R7 (critical/high) into single documentation alignment pass
- R8-R10 (high priority) can be done in parallel with R1-R7
- R11-R13 (medium priority) can be deferred if time-constrained

**Reference Implementation Files**:
- `src/components/forms/ConsultationModal.tsx` - Client-side form logic
- `src/pages/api/submit-lead.ts` - Serverless function with Supabase + Resend
- `src/schemas/consultationSchema.ts` - Zod validation schema
- `specs/002-home-page/data-model.md` - Supabase schema definition

**Validation Method**: Read implementation code, extract line numbers, document behavior, add to spec

---

## Research Decisions

### Decision 1: Use Same Pattern as Feature 008

**Rationale**: Feature 008-align-base-infra-docs successfully aligned 001-base-infrastructure using:
- Edge case Q&A format with code references
- Monitoring & Verification section for success criteria
- Code reference format: `file.ext:line-numbers`
- Constitution check clarification for server mode

**Chosen Approach**: Replicate 008 pattern exactly for consistency

**Alternatives Considered**:
- Create new documentation format (rejected - inconsistent with existing features)
- Skip code references (rejected - makes spec unusable for developers)

---

### Decision 2: Document As-Is (No Code Changes)

**Rationale**: Feature 002 is deployed and functional. Goal is to document reality, not change implementation.

**Chosen Approach**: Zero code changes to `src/` directory. All fixes are documentation edits only.

**Alternatives Considered**:
- Fix code issues while documenting (rejected - scope creep, introduces bugs)
- Mark spec as "outdated" without fixing (rejected - perpetuates documentation debt)

---

### Decision 3: Rate Limiting Documentation Strategy

**Context**: Edge Case Q5 asks about rate limiting. Actual implementation has NO rate limiting.

**User Decision** (from spec.md conversation): Keep code as-is, document actual behavior, add 3-tier protection strategy to Future Enhancements.

**Rationale**: Current traffic levels don't require rate limiting. If spam becomes issue, have escalation path documented.

**Documented Strategy**:
- Level 1: Client-side debounce (30 sec, ~10 min implementation)
- Level 2: Server-side duplicate check (~30 min implementation)
- Level 3: IP-based rate limiting (~1-2 hours implementation)

---

## Next Steps

Phase 0 research complete. Proceed to Phase 1: Data Model definition.
