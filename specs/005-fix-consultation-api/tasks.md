# Tasks: Fix Consultation Modal API Endpoint

**Input**: Design documents from `/specs/005-fix-consultation-api/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Feature Type**: Bug Fix (not new feature)
**Impact**: Backend-only API endpoint fix (~50 lines in single file)
**Frontend Status**: ✅ Already fixed (consultationForm.ts, ConsultationModal.tsx)

**Tests**: Not generating separate test tasks - using existing test scripts and manual E2E testing per quickstart.md

**Organization**: Tasks grouped by user story, though all stories are enabled by the same API fix. Each story represents a test scenario that validates the fix works for different use cases.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task serves (US1, US2, US3)
- Exact file paths included in descriptions

## Path Conventions

- **Project Structure**: Single static web app with serverless functions
- **API**: `api/submit-lead.ts` (Vercel serverless function)
- **Frontend**: `src/types/`, `src/components/` (already updated)
- **Tests**: `.claude/scripts/` (test scripts)

---

## Phase 1: Setup & Verification

**Purpose**: Verify environment configuration and frontend status before fixing API

**Checkpoint**: Confirm environment ready and frontend code is correct

- [ ] T001 Verify environment variables in `.env` file (SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, NOTIFICATION_EMAIL=goshazvir@gmail.com)
- [ ] T002 [P] Verify Supabase database connectivity using `npm run test:supabase`
- [ ] T003 [P] Verify frontend validation in `src/types/consultationForm.ts` has telegram normalization transform
- [ ] T004 [P] Verify frontend UI in `src/components/forms/ConsultationModal.tsx` has updated helper text
- [ ] T005 Review existing API code in `api/submit-lead.ts` to understand current broken state

**Expected Outcome**:
- Environment variables configured
- Database accessible
- Frontend code verified as correct (no changes needed)
- Current API bugs identified

---

## Phase 2: Foundational (None Required)

**Purpose**: Core infrastructure that MUST be complete before user stories

**Status**: ✅ **SKIP THIS PHASE**

**Rationale**: All infrastructure already exists:
- Database schema exists (`leads` table from 002-home-page feature)
- Frontend components exist and are correct
- Test infrastructure exists (`test-supabase.js`)
- Serverless function runtime configured (Vercel)

**Checkpoint**: Foundation ready - proceed directly to User Story 1 implementation

---

## Phase 3: User Story 1 - Successful Consultation Booking (Priority: P1) 🎯 MVP

**Goal**: Fix API endpoint to accept form data, save to database, and send email notification for full field submissions

**Independent Test**: Submit form with all fields (name, phone, telegram, email) → verify database record created + email received

**Why This Fixes All Stories**: The API fix enables all three user stories:
- US1: Full field submission (4 fields)
- US2: Minimal field submission (2 required fields)
- US3: Validation and normalization (telegram with/without @)

All scenarios are handled by the same validation schema and logic.

### Implementation Tasks

- [ ] T006 [US1] Update Zod validation schema in `api/submit-lead.ts` to match form fields (name, phone, telegram?, email?)
- [ ] T007 [US1] Remove old schema fields (message) from `api/submit-lead.ts`
- [ ] T008 [US1] Add telegram normalization transform in API validation schema (prepend @ if missing)
- [ ] T009 [US1] Add metadata population in `api/submit-lead.ts` (source='consultation_modal', user_agent, referrer)
- [ ] T010 [US1] Uncomment Supabase insert code in `api/submit-lead.ts` (currently lines 49-54 are commented)
- [ ] T011 [US1] Update Supabase insert to use correct data variable (leadData with metadata, not just validatedData)
- [ ] T012 [US1] Update email template in `api/submit-lead.ts` to match new form fields (phone, telegram, no message)
- [ ] T013 [US1] Add conditional rendering for optional fields in email template (telegram?, email?)
- [ ] T014 [US1] Update success response to include leadId from database insert
- [ ] T015 [US1] Add error handling for partial failures (DB success but email fails)
- [ ] T016 [US1] Add console logging for debugging (DB errors, email errors, successful submissions)

**File Modified**: `api/submit-lead.ts` (all tasks target same file - must be done sequentially)

**Detailed Implementation Notes**:

**T006-T008: Validation Schema** (replace lines ~6-10):
```typescript
const leadSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name is too long')
    .trim(),

  phone: z.string()
    .regex(/^\+380\d{9}$/, 'Phone must be in format +380XXXXXXXXX')
    .trim(),

  telegram: z.string()
    .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Telegram must be 5-32 alphanumeric characters')
    .optional()
    .or(z.literal(''))
    .transform(val => {
      if (!val || val === '') return undefined;
      return val.startsWith('@') ? val : `@${val}`;
    }),

  email: z.string()
    .email('Invalid email address')
    .max(255, 'Email is too long')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
});
```

**T009: Metadata Population** (add after validation):
```typescript
const leadData = {
  ...validatedData,
  source: 'consultation_modal',
  user_agent: request.headers.get('user-agent') || null,
  referrer: request.headers.get('referer') || null,
};
```

**T010-T011: Uncomment Supabase Insert** (replace commented lines 49-54):
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const { data, error: dbError } = await supabase
  .from('leads')
  .insert([leadData])
  .select()
  .single();

if (dbError) {
  console.error('[API] Database insert failed:', dbError);
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Failed to save your request'
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
```

**T012-T013: Email Template** (update email send):
```typescript
const { error: emailError } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
  to: process.env.NOTIFICATION_EMAIL!,
  subject: `New Consultation Request from ${validatedData.name}`,
  html: `
    <h2>New Consultation Request</h2>
    <p><strong>Name:</strong> ${validatedData.name}</p>
    <p><strong>Phone:</strong> ${validatedData.phone}</p>
    ${validatedData.telegram ? `<p><strong>Telegram:</strong> ${validatedData.telegram}</p>` : ''}
    ${validatedData.email ? `<p><strong>Email:</strong> ${validatedData.email}</p>` : ''}
    <p><strong>Source:</strong> ${leadData.source}</p>
    <p><strong>Submitted:</strong> ${new Date().toLocaleString('uk-UA', { timeZone: 'Europe/Kyiv' })}</p>
  `
});
```

**T014: Success Response**:
```typescript
return new Response(
  JSON.stringify({
    success: true,
    message: 'Thank you! We\'ll contact you soon.',
    leadId: data.id
  }),
  { status: 200, headers: { 'Content-Type': 'application/json' } }
);
```

**T015-T016: Error Handling**:
```typescript
if (emailError) {
  console.error('[API] Email send failed:', emailError);
  console.warn(`[API] Lead ${data.id} saved but notification failed`);
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Your request was saved, but we couldn\'t send confirmation. We\'ll contact you soon.'
    }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
```

**Checkpoint**: At this point, API endpoint should accept form submissions, save to database, and send emails. All three user stories (US1, US2, US3) are now functional.

---

## Phase 4: User Story 2 - Minimal Information Submission (Priority: P2)

**Goal**: Verify that API correctly handles submissions with only required fields (name + phone)

**Independent Test**: Submit form with only name and phone → verify database record created with telegram/email as NULL

**Status**: ✅ **Already implemented in Phase 3**

**Rationale**: The API validation schema from US1 already handles optional fields correctly. This phase verifies it works.

### Verification Tasks

- [ ] T017 [US2] Test minimal submission locally using `npm run dev:vercel`
- [ ] T018 [US2] Submit form with only name="Test User" and phone="+380501234567"
- [ ] T019 [US2] Verify success message appears in browser
- [ ] T020 [US2] Verify database record in Supabase has telegram=NULL and email=NULL
- [ ] T021 [US2] Verify email notification shows only name and phone (no empty field lines)

**Checkpoint**: Minimal field submissions work correctly (required fields only)

---

## Phase 5: User Story 3 - Invalid Data Prevention (Priority: P3)

**Goal**: Verify that API validation prevents invalid data and normalizes telegram handles

**Independent Test**: Submit various invalid inputs → verify validation errors shown, no database records created

**Status**: ✅ **Already implemented in Phase 3**

**Rationale**: The API validation schema from US1 already includes all validation rules. This phase verifies it works.

### Verification Tasks

- [ ] T022 [US3] Test invalid phone format ("+38050") → verify 400 validation error
- [ ] T023 [US3] Test telegram without @ ("username123") → verify submission succeeds and database stores "@username123"
- [ ] T024 [US3] Test telegram with @ ("@username123") → verify submission succeeds and database stores "@username123" unchanged
- [ ] T025 [US3] Test invalid email ("notanemail") → verify 400 validation error
- [ ] T026 [US3] Test name too short ("A") → verify 400 validation error
- [ ] T027 [US3] Verify no partial records in database after validation failures

**Checkpoint**: All validation rules working, telegram normalization functional, invalid data blocked

---

## Phase 6: Testing Infrastructure & Automation

**Purpose**: Create automated test script for repeatable validation

**Checkpoint**: Automated tests pass, ready for deployment

- [ ] T028 [P] Create test script at `.claude/scripts/test-consultation-api.js`
- [ ] T029 [P] Add test case: valid submission (all fields)
- [ ] T030 [P] Add test case: valid submission (required only)
- [ ] T031 [P] Add test case: telegram normalization (without @)
- [ ] T032 [P] Add test case: invalid phone format
- [ ] T033 [P] Add test case: invalid email format
- [ ] T034 [P] Add test case: missing required field
- [ ] T035 Run test script: `node .claude/scripts/test-consultation-api.js`
- [ ] T036 Verify all test cases pass

**Test Script Template** (`.claude/scripts/test-consultation-api.js`):
```javascript
#!/usr/bin/env node

const testCases = [
  {
    name: 'Valid submission (all fields)',
    input: {
      name: 'Test User',
      phone: '+380501234567',
      telegram: 'testuser',
      email: 'test@example.com'
    },
    expectedStatus: 200
  },
  {
    name: 'Valid submission (required only)',
    input: {
      name: 'Test User',
      phone: '+380501234567'
    },
    expectedStatus: 200
  },
  {
    name: 'Telegram normalization',
    input: {
      name: 'Test User',
      phone: '+380501234567',
      telegram: 'username123'  // Should become @username123
    },
    expectedStatus: 200
  },
  {
    name: 'Invalid phone format',
    input: {
      name: 'Test User',
      phone: '+38050'
    },
    expectedStatus: 400
  },
  {
    name: 'Invalid email',
    input: {
      name: 'Test User',
      phone: '+380501234567',
      email: 'notanemail'
    },
    expectedStatus: 400
  },
  {
    name: 'Missing required field',
    input: {
      name: 'Test User'
      // phone missing
    },
    expectedStatus: 400
  }
];

async function runTests() {
  console.log('🧪 Testing: /api/submit-lead endpoint\n');

  for (const testCase of testCases) {
    const response = await fetch('http://localhost:3000/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testCase.input)
    });

    const data = await response.json();
    const passed = response.status === testCase.expectedStatus;

    console.log(`${passed ? '✅' : '❌'} ${testCase.name}`);
    if (!passed) {
      console.log(`   Expected ${testCase.expectedStatus}, got ${response.status}`);
      console.log(`   Response:`, data);
    }
  }
}

runTests().catch(console.error);
```

---

## Phase 7: End-to-End Testing & Deployment Preparation

**Purpose**: Manual testing and pre-deployment verification

**Checkpoint**: All tests pass, ready for production deployment

- [ ] T037 Follow quickstart.md Step 1: Run database test (`npm run test:supabase`)
- [ ] T038 Follow quickstart.md Step 2: Start dev server (`npm run dev:vercel`)
- [ ] T039 Follow quickstart.md Step 2: Run API test script
- [ ] T040 Follow quickstart.md Step 3: Manual browser test (all fields)
- [ ] T041 Follow quickstart.md Step 3: Verify database record in Supabase
- [ ] T042 Follow quickstart.md Step 3: Verify email received at goshazvir@gmail.com
- [ ] T043 Follow quickstart.md Step 3: Manual browser test (required fields only)
- [ ] T044 Follow quickstart.md Step 3: Test validation errors
- [ ] T045 Delete all test records from Supabase database
- [ ] T046 Verify Vercel environment variables match local `.env` (NOTIFICATION_EMAIL, etc.)

**Reference**: Follow `/specs/005-fix-consultation-api/quickstart.md` for detailed testing steps

---

## Phase 8: Documentation & Cleanup

**Purpose**: Update documentation and prepare for handoff

- [ ] T047 [P] Update CLAUDE.md Recent Changes section with this fix
- [ ] T048 [P] Add note to `.claude/docs/before-prod.md` reminder to change email before production
- [ ] T049 [P] Verify all spec documents are accurate (spec.md, plan.md, data-model.md)
- [ ] T050 Create git commit with clear message explaining the fix
- [ ] T051 Push to branch 005-fix-consultation-api (do NOT push to main without approval)

**Commit Message Template**:
```
fix: consultation API endpoint validation and database insert

Problem:
- API validation schema didn't match form fields (expected message, not phone/telegram)
- Supabase insert code was commented out
- Metadata fields (source, user_agent, referrer) not populated
- Email template referenced wrong fields

Solution:
- Updated Zod schema to match form: name, phone, telegram?, email?
- Added telegram normalization (prepend @ if missing)
- Uncommented Supabase insert with metadata population
- Updated email template with conditional optional fields
- Added error handling for partial failures

Testing:
- Created test-consultation-api.js script
- Manual E2E testing per quickstart.md
- All 6 test cases passing

Fixes: 100% form submission failure
Enables: US1 (full fields), US2 (minimal fields), US3 (validation)

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1: Setup**: No dependencies - start immediately
- **Phase 2: Foundational**: ✅ SKIPPED (infrastructure exists)
- **Phase 3: US1 Implementation**: Depends on Phase 1 completion - BLOCKS all other phases
- **Phase 4: US2 Verification**: Depends on Phase 3 completion (API must be fixed)
- **Phase 5: US3 Verification**: Depends on Phase 3 completion (API must be fixed)
- **Phase 6: Testing Infrastructure**: Can start after Phase 3, parallel with Phase 4-5
- **Phase 7: E2E Testing**: Depends on Phases 3-6 completion
- **Phase 8: Documentation**: Depends on Phase 7 completion (all tests passing)

### User Story Dependencies

- **US1 (P1)**: No dependencies - primary implementation that enables all stories
- **US2 (P2)**: Depends on US1 - verification only (no new code)
- **US3 (P3)**: Depends on US1 - verification only (no new code)

**Critical Path**: Phase 1 → Phase 3 (US1) → Phase 7 (E2E) → Phase 8 (Docs)

**Note**: US2 and US3 are verification phases, not separate implementations. The API fix in US1 enables all three user stories simultaneously.

### Within Phase 3 (US1 - API Fix)

Tasks T006-T016 must be done **sequentially** (all modify same file `api/submit-lead.ts`):

1. T006-T008: Update validation schema
2. T009: Add metadata population
3. T010-T011: Uncomment Supabase insert
4. T012-T013: Update email template
5. T014: Update success response
6. T015-T016: Add error handling

**No parallel opportunities within Phase 3** - single file modification

### Parallel Opportunities

- **Phase 1**: T002, T003, T004 can run in parallel (different verifications)
- **Phase 6**: T028-T034 can run in parallel (adding test cases to script)
- **Phase 8**: T047, T048, T049 can run in parallel (different documentation files)

**Minimal Parallel Potential**: This is a focused bug fix in a single file, limiting parallelization opportunities.

---

## Parallel Example: Phase 6 (Testing)

```bash
# Launch all test case additions in parallel:
Task: "Add test case: valid submission (all fields)"
Task: "Add test case: valid submission (required only)"
Task: "Add test case: telegram normalization"
Task: "Add test case: invalid phone format"
Task: "Add test case: invalid email format"
Task: "Add test case: missing required field"

# Then run sequentially:
Task: "Run test script"
Task: "Verify all test cases pass"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup & Verification (T001-T005)
2. **SKIP Phase 2**: Foundational (infrastructure exists)
3. Complete Phase 3: User Story 1 Implementation (T006-T016)
4. **STOP and VALIDATE**: Manual test in browser, verify database + email
5. If US1 works, US2 and US3 automatically work too (same fix)

**Total Tasks for MVP**: 21 tasks (Phases 1 + 3)
**Estimated Time**: 2-3 hours (including testing)

### Full Implementation (All User Stories)

1. Complete Phase 1: Setup (5 tasks)
2. Complete Phase 3: US1 Implementation (11 tasks) ← **CRITICAL**
3. Complete Phase 4: US2 Verification (5 tasks)
4. Complete Phase 5: US3 Verification (6 tasks)
5. Complete Phase 6: Testing Infrastructure (9 tasks)
6. Complete Phase 7: E2E Testing (10 tasks)
7. Complete Phase 8: Documentation (5 tasks)

**Total Tasks**: 51 tasks
**Estimated Time**: 4-6 hours (including comprehensive testing)

### Incremental Delivery

**Option 1 - Quick Fix** (recommended for bug fix):
1. Phases 1 + 3 → API fixed → Test manually → Deploy if working

**Option 2 - Comprehensive** (recommended for quality):
1. Phases 1-3 → API fixed
2. Phases 4-5 → Verify all scenarios
3. Phase 6 → Automated tests
4. Phases 7-8 → Full E2E + docs → Deploy

**Option 3 - Test-Driven**:
1. Phase 1 → Setup
2. Phase 6 → Write tests first (they should fail)
3. Phase 3 → Implement API fix (tests should pass)
4. Phases 4-5, 7-8 → Verification and docs

---

## Notes

- **[P] marker**: Tasks that can run in parallel (different files, no conflicts)
- **[US#] label**: Maps task to specific user story for traceability
- **File paths**: All tasks include exact file locations
- **Sequential constraint**: Phase 3 tasks MUST be sequential (single file modification)
- **Story overlap**: US1 implementation enables US2 and US3 (verification only)
- **Testing approach**: No separate test file creation - using test scripts + manual E2E
- **Deployment**: Do NOT push to main without user approval (see before-prod.md)

**Critical Success Factor**: Phase 3 (US1) is the ONLY implementation phase. All other phases are verification, testing, or documentation.

**Commit Strategy**:
- Commit after Phase 3 completion: "fix: consultation API endpoint"
- Commit after Phase 6 completion: "test: add consultation API test script"
- Commit after Phase 8 completion: "docs: update for consultation API fix"

**Avoid**:
- ❌ Pushing to production without testing email deliverability
- ❌ Leaving test records in production database
- ❌ Changing NOTIFICATION_EMAIL without following before-prod.md guide
- ❌ Skipping manual browser testing (automated tests don't cover UI integration)

**Reference Documents**:
- Validation patterns: `/specs/005-fix-consultation-api/research.md`
- Database schema: `/specs/002-home-page/data-model.md`
- Testing guide: `/specs/005-fix-consultation-api/quickstart.md`
- Email configuration: `.claude/docs/before-prod.md`
