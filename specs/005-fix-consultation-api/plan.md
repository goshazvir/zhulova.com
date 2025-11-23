# Implementation Plan: Fix Consultation Modal API Endpoint

**Branch**: `005-fix-consultation-api` | **Date**: 2025-11-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/005-fix-consultation-api/spec.md`

## Summary

Fix critical bug in consultation form submission: API validation schema doesn't match form fields, causing 100% submission failure. The API expects `{name, email, message}` but the form sends `{name, phone, telegram?, email?}`. Additionally, database insert code is commented out, preventing data persistence.

**Technical Approach**: Update Zod validation schema in `/api/submit-lead.ts` to match form fields, uncomment Supabase insert with metadata population, update email template, and create comprehensive test script.

**Impact**: Zero-code-change for frontend (already correct). Backend-only fix affecting ~50 lines in single API file.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode), Node.js runtime (Vercel serverless)
**Primary Dependencies**:
- Zod 3.x (validation)
- @supabase/supabase-js 2.x (database client)
- Resend SDK (email service)

**Storage**: Supabase PostgreSQL with RLS policies (existing `leads` table, schema documented in `specs/002-home-page/data-model.md`)
**Testing**:
- Existing: `.claude/scripts/test-supabase.js` (database connectivity)
- New: `.claude/scripts/test-consultation-api.js` (API endpoint + full flow)

**Target Platform**: Vercel Serverless Functions (Node.js 18.x runtime)
**Project Type**: Static web application with serverless API endpoints
**Performance Goals**:
- API response time <2 seconds (95th percentile)
- Email delivery within 5 seconds
- Zero data loss for valid submissions

**Constraints**:
- Vercel function timeout: 10 seconds (default)
- Environment variables: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, NOTIFICATION_EMAIL
- Database RLS: Only service role can insert to `leads` table

**Scale/Scope**:
- ~100 submissions/month initially
- Single API endpoint modification
- Bug fix (not new feature)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Static-First Delivery ✅ PASS

- ✅ Hybrid mode (`output: 'hybrid'`) used for API endpoints only - pages remain static
- ✅ Fix applies only to serverless API endpoint (not static pages)
- ✅ Frontend remains fully static (no changes required)
- ✅ No client-side secrets (service keys server-only)
- ✅ Static pages pre-rendered at build time, API endpoints run as serverless functions

### II. Performance-First Development ✅ PASS

- ✅ API fix improves reliability, not performance regression
- ✅ No bundle size impact (API is server-side only)
- ✅ Target: <2s API response time (within budget)
- ✅ No additional client-side JavaScript

### III. Simplicity Over Tooling ✅ PASS

- ✅ No new dependencies added
- ✅ Uses existing stack: Zod, Supabase, Resend
- ✅ Minimal code change (~50 lines in single file)
- ✅ No framework additions

### IV. Accessibility & SEO ✅ N/A

- ✅ No UI changes (backend-only fix)
- ✅ Form already has proper ARIA labels
- ✅ No impact on accessibility or SEO

### V. TypeScript Strict Mode ✅ PASS

- ✅ All validation schemas use Zod with TypeScript inference
- ✅ Strict mode enabled in `tsconfig.json`
- ✅ No `any` types used

### VI. Design System Consistency ✅ N/A

- ✅ No UI component changes
- ✅ Design system unaffected

**Overall Status**: ✅ **ALL GATES PASSED** — No violations, proceed to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/005-fix-consultation-api/
├── spec.md              # Feature specification (COMPLETE)
├── plan.md              # This file
├── research.md          # Phase 0 output (validation patterns, error handling)
├── data-model.md        # Phase 1 output (references existing 002-home-page/data-model.md)
├── quickstart.md        # Phase 1 output (testing guide)
├── contracts/           # Phase 1 output (API endpoint contract)
│   └── submit-lead.openapi.yaml
└── checklists/
    └── requirements.md  # Quality validation (COMPLETE)
```

### Source Code (repository root)

```text
api/
└── submit-lead.ts       #修改: Main file to fix (validation + database insert)

src/
├── types/
│   └── consultationForm.ts  # ✅ UPDATED: Frontend validation (Telegram normalization)
└── components/
    └── forms/
        └── ConsultationModal.tsx  # ✅ UPDATED: UI helper text

.claude/scripts/
├── test-supabase.js            # ✅ Existing: Database connectivity test
└── test-consultation-api.js     # 新規: New comprehensive API test script

specs/
├── 002-home-page/
│   └── data-model.md            # 📖 Reference: Database schema documentation
└── 005-fix-consultation-api/    # 📁 This feature directory
```

**Structure Decision**: Single-project web application (Astro static site + Vercel serverless functions). This is a bug fix affecting only the `/api/submit-lead.ts` endpoint. Frontend components already correct; no structural changes needed.

## Complexity Tracking

> **No violations detected** — All constitution principles satisfied.

## Phase 0: Research & Unknowns

**Research Objectives:**

1. **Validation Patterns**: How to handle optional fields with Zod transforms (telegram normalization)?
2. **Error Handling**: Best practices for partial failure scenarios (DB succeeds, email fails)?
3. **Testing Strategy**: How to test serverless function locally vs production?
4. **Email Templates**: Resend HTML email best practices for dynamic optional fields?

**Research Tasks**: See [research.md](./research.md) (to be generated)

## Phase 1: Design Artifacts

**Deliverables:**
1. **data-model.md**: Reference existing `specs/002-home-page/data-model.md` for `leads` table schema
2. **contracts/submit-lead.openapi.yaml**: API contract for `/api/submit-lead` endpoint
3. **quickstart.md**: Testing guide (how to run test scripts, verify database, check email)

**Design Tasks**: See Phase 1 section below

## Phase 2: Task Breakdown

**Note**: Generated by `/speckit.tasks` command (not part of `/speckit.plan` output)

---

## Implementation Phases

### Phase 0: Research (COMPLETE BEFORE PHASE 1)

**Objective**: Resolve all NEEDS CLARIFICATION markers and document implementation patterns

**Research Agents Dispatched:**

1. **Zod Transform Patterns**:
   - **Task**: Research Zod schema patterns for optional field normalization (telegram: `username` → `@username`)
   - **Output**: Document recommended pattern in `research.md` → "Zod Optional Field Transforms"
   - **Questions**:
     - How to handle `optional()` + `or(z.literal(''))` + `transform()` chain?
     - Type safety concerns with transforms returning `undefined`?
     - Performance impact of transforms in validation pipeline?

2. **Partial Failure Handling**:
   - **Task**: Research error handling patterns for multi-step API operations (DB insert → email send)
   - **Output**: Document pattern in `research.md` → "Graceful Degradation Strategy"
   - **Questions**:
     - If DB save succeeds but email fails, should we rollback?
     - How to log partial failures for monitoring?
     - Should user see success or error message?

3. **Serverless Function Testing**:
   - **Task**: Research local testing patterns for Vercel serverless functions
   - **Output**: Document in `research.md` → "Testing Strategy"
   - **Questions**:
     - `npm run dev` vs `npm run dev:vercel` for API testing?
     - How to mock Supabase/Resend in test scripts?
     - Integration test patterns for serverless endpoints?

4. **Resend Dynamic Templates**:
   - **Task**: Research Resend HTML email patterns for optional fields (telegram/email not always present)
   - **Output**: Document in `research.md` → "Email Template Patterns"
   - **Questions**:
     - How to conditionally render optional fields in HTML?
     - Should empty fields show "Not provided" or be omitted entirely?
     - Best practices for plain text fallback?

**Research Output**: [research.md](./research.md) — Generated by Phase 0 agents

---

### Phase 1: Design & Contracts

**Prerequisites**: `research.md` complete, all NEEDS CLARIFICATION resolved

#### 1.1 Data Model

**Task**: Create `data-model.md` referencing existing schema

**Content**:
- Reference `specs/002-home-page/data-model.md` for full `leads` table schema
- Document API input schema (Zod validation)
- Document API output schema (success/error responses)
- Document transformation rules (telegram normalization, metadata population)

**Validation Rules** (from spec):
- `name`: 2-255 chars, trimmed
- `phone`: `+380XXXXXXXXX` (regex validation)
- `telegram`: 5-32 chars alphanumeric/underscore, optional, auto-prepend `@` if missing
- `email`: standard email format, optional

**Output**: `data-model.md`

#### 1.2 API Contracts

**Task**: Generate OpenAPI 3.0 contract for `/api/submit-lead` endpoint

**Contract Specification**:
```yaml
# contracts/submit-lead.openapi.yaml

openapi: 3.0.0
info:
  title: Consultation Lead Submission API
  version: 1.0.0

paths:
  /api/submit-lead:
    post:
      summary: Submit consultation booking request
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [name, phone]
              properties:
                name:
                  type: string
                  minLength: 2
                  maxLength: 255
                phone:
                  type: string
                  pattern: '^\+380\d{9}$'
                telegram:
                  type: string
                  minLength: 5
                  maxLength: 32
                  nullable: true
                email:
                  type: string
                  format: email
                  nullable: true
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    const: true
                  message:
                    type: string
                  leadId:
                    type: string
                    format: uuid
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                    const: false
                  error:
                    type: string
                  details:
                    type: array
        '500':
          description: Server error
```

**Output**: `contracts/submit-lead.openapi.yaml`

#### 1.3 Quickstart Guide

**Task**: Create testing and verification guide

**Content**:
1. **Prerequisites**: Environment variables setup
2. **Database Test**: How to run `npm run test:supabase`
3. **API Test**: How to run new `test-consultation-api.js` script
4. **Manual Browser Test**: Step-by-step form submission
5. **Verification**: Check Supabase dashboard + email inbox
6. **Troubleshooting**: Common errors and solutions

**Output**: `quickstart.md`

#### 1.4 Agent Context Update

**Task**: Run `.specify/scripts/bash/update-agent-context.sh claude`

**Purpose**: Update `.claude/` agent context with new patterns from this implementation

**New Context to Add**:
- Zod optional field transforms pattern
- Telegram handle normalization logic
- Serverless function error handling pattern
- Partial failure logging strategy

**Output**: Updated `.claude/` agent context file

---

## Implementation Checklist

**Before coding (Phase 0-1):**
- [x] Constitution Check passed
- [x] Feature specification complete (`spec.md`)
- [ ] Research complete (`research.md`)
- [ ] Data model documented (`data-model.md`)
- [ ] API contract generated (`contracts/submit-lead.openapi.yaml`)
- [ ] Quickstart guide created (`quickstart.md`)
- [ ] Agent context updated

**After coding (Phase 2 - via `/speckit.tasks`):**
- [ ] API validation schema fixed
- [ ] Supabase insert uncommented and corrected
- [ ] Metadata population implemented
- [ ] Email template updated
- [ ] Test script created
- [ ] All tests passing
- [ ] Manual E2E test verified

---

## Next Steps

1. **Run Phase 0 Research**: Execute research agents to fill `research.md`
2. **Run Phase 1 Design**: Generate `data-model.md`, `contracts/`, `quickstart.md`
3. **Update Agent Context**: Run `update-agent-context.sh claude`
4. **Re-validate Constitution**: Confirm no violations introduced during design
5. **Ready for `/speckit.tasks`**: Generate implementation task list

**Command to Continue**:
```bash
# Phase 0-1 complete automatically by /speckit.plan
# Then run:
/speckit.tasks  # Generate actionable task breakdown
```

---

**Status**: 🟡 **Phase 0 Pending** — Research agents dispatched, awaiting consolidation
