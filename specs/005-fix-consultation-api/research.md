# Research: Fix Consultation Modal API Endpoint

**Feature**: 005-fix-consultation-api
**Date**: 2025-11-17
**Phase**: Phase 0 Research

## Overview

This document consolidates research findings for implementing the consultation form API fix. All NEEDS CLARIFICATION markers have been resolved through industry best practices and existing codebase patterns.

---

## 1. Zod Optional Field Transforms

### Decision

Use chained `.optional()`, `.or(z.literal(''))`, and `.transform()` with explicit null/undefined checks:

```typescript
telegram: z.string()
  .regex(/^@?[a-zA-Z0-9_]{5,32}$/, 'Error message')
  .optional()
  .or(z.literal(''))
  .transform(val => {
    if (!val || val === '') return undefined;
    return val.startsWith('@') ? val : `@${val}`;
  })
```

### Rationale

- **Type Safety**: Explicit `!val` check satisfies TypeScript strict null checking
- **UX**: Accepts both `@username` and `username`, normalizes to `@username`
- **Database Consistency**: Always stores with `@` prefix
- **Existing Pattern**: Already implemented in `src/types/consultationForm.ts`

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| **Preprocess hook** | Less readable, harder to debug validation errors |
| **Separate normalization function** | Duplicates validation logic, requires two passes |
| **Frontend-only normalization** | Breaks if API called directly, violates defense-in-depth |

### Performance Impact

- Negligible (<1ms per validation)
- Transform runs only after successful regex validation
- No measurable impact on API response time

---

## 2. Partial Failure Handling

### Decision

**Fail-Fast Strategy**: Both database insert AND email send must succeed. If either fails, return error to user.

**Implementation Pattern**:

```typescript
try {
  // 1. Validate input
  const validatedData = schema.parse(body);

  // 2. Save to database (MUST succeed)
  const { data, error: dbError } = await supabase
    .from('leads')
    .insert([leadData])
    .select()
    .single();

  if (dbError) {
    console.error('[API] Database insert failed:', dbError);
    return new Response(JSON.stringify({
      success: false,
      error: 'Failed to save your request'
    }), { status: 500 });
  }

  // 3. Send email notification (MUST succeed)
  const { error: emailError } = await resend.emails.send({...});

  if (emailError) {
    console.error('[API] Email send failed:', emailError);
    // Database already saved, log this as partial success
    console.warn(`[API] Lead ${data.id} saved but notification failed`);
    return new Response(JSON.stringify({
      success: false,
      error: 'Your request was saved, but we couldn\'t send confirmation. We\'ll contact you soon.'
    }), { status: 500 });
  }

  // 4. Both succeeded
  return new Response(JSON.stringify({
    success: true,
    message: 'Thank you! We\'ll contact you soon.',
    leadId: data.id
  }), { status: 200 });

} catch (error) {
  console.error('[API] Unexpected error:', error);
  return new Response(JSON.stringify({
    success: false,
    error: 'Something went wrong. Please try again.'
  }), { status: 500 });
}
```

### Rationale

- **User Experience**: Clear, honest feedback (don't claim success if email fails)
- **Data Integrity**: Database is source of truth; email failure doesn't lose lead
- **Monitoring**: Console logs enable tracking partial failures in Vercel logs
- **No Rollback**: Database insert is permanent (rollback adds complexity without benefit)

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| **Always return success if DB saves** | Misleading to user; email failure is unacceptable for business |
| **Rollback DB if email fails** | Loses valid lead data; email failures are transient |
| **Queue email for retry** | Over-engineering for MVP; Resend has internal retry logic |
| **Silent failure logging** | User should know something went wrong |

### Logging Strategy

- **Error Level**: Database errors, email errors, unexpected exceptions
- **Warn Level**: Partial successes (DB saved, email failed)
- **Info Level**: Successful submissions (optional, for metrics)

**Log Format**: `[API] {operation}: {details}` (searchable in Vercel logs)

---

## 3. Serverless Function Testing

### Decision

Use **`npm run dev:vercel`** for API testing (not `npm run dev`)

### Rationale

| Command | Astro Dev | Serverless API | Use Case |
|---------|-----------|----------------|----------|
| `npm run dev` | ✅ Port 4321 | ❌ Not available | UI/styling work only |
| `npm run dev:vercel` | ✅ Port 3000 | ✅ Available | Testing forms + API |

**Testing Strategy**:

1. **Unit Tests** (validation logic):
   - Not implemented (Zod handles validation)
   - Manual testing sufficient for bug fix

2. **Integration Tests** (API endpoint):
   - Script: `.claude/scripts/test-consultation-api.js`
   - Sends HTTP POST to `http://localhost:3000/api/submit-lead`
   - Validates responses for success/error cases
   - Requires `npm run dev:vercel` running

3. **Database Tests** (Supabase connectivity):
   - Script: `.claude/scripts/test-supabase.js` (existing)
   - Tests: Connection, insert, read, delete
   - Command: `npm run test:supabase`

4. **E2E Tests** (manual browser):
   - Open `http://localhost:3000` in browser
   - Fill form and submit
   - Verify success message, database record, email received

### Test Script Structure

```javascript
// .claude/scripts/test-consultation-api.js

const testCases = [
  {
    name: 'Valid submission (all fields)',
    input: { name: 'Test User', phone: '+380501234567', telegram: 'testuser', email: 'test@example.com' },
    expectedStatus: 200,
    expectedSuccess: true
  },
  {
    name: 'Valid submission (required fields only)',
    input: { name: 'Test User', phone: '+380501234567' },
    expectedStatus: 200,
    expectedSuccess: true
  },
  {
    name: 'Invalid phone format',
    input: { name: 'Test User', phone: '+38050' },
    expectedStatus: 400,
    expectedSuccess: false
  },
  // More test cases...
];

for (const testCase of testCases) {
  const response = await fetch('http://localhost:3000/api/submit-lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(testCase.input)
  });

  // Assert status, response body, etc.
}
```

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| **Jest/Vitest unit tests** | Over-engineering for simple bug fix; adds dependencies |
| **Mock Supabase/Resend** | Integration tests with real services more valuable |
| **Postman collection** | Script is more automatable and version-controlled |

---

## 4. Resend Dynamic Email Templates

### Decision

Use **conditional template strings** with JavaScript ternary operators:

```typescript
const { error } = await resend.emails.send({
  from: process.env.RESEND_FROM_EMAIL || 'noreply@example.com',
  to: process.env.NOTIFICATION_EMAIL || 'admin@example.com',
  replyTo: validatedData.email || undefined,  // Only set if provided
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

### Rationale

- **Simplicity**: No template engine needed (complexity violation)
- **Dynamic Rendering**: Optional fields only shown if provided
- **Readability**: Clear HTML structure with inline conditionals
- **Maintainability**: Easy to modify without external dependencies

### Optional Field Handling

| Field Provided | Rendered Output |
|----------------|-----------------|
| `telegram: "@user"` | `<p><strong>Telegram:</strong> @user</p>` |
| `telegram: undefined` | (nothing) |
| `email: "test@example.com"` | `<p><strong>Email:</strong> test@example.com</p>` |
| `email: undefined` | (nothing) |

**Design Principle**: Omit empty fields entirely (cleaner than "Not provided" placeholder)

### Plain Text Fallback

Resend automatically generates plain text from HTML. No manual plain text version needed.

### Alternatives Considered

| Alternative | Rejected Because |
|-------------|------------------|
| **Handlebars/Pug template engine** | Adds dependency, violates simplicity principle |
| **Resend template UI** | Requires manual template management outside codebase |
| **Always show "Not provided"** | Clutters email with unnecessary information |

---

## 5. Environment Variable Configuration

### Required Variables

| Variable | Purpose | Example Value |
|----------|---------|---------------|
| `SUPABASE_URL` | Database connection | `https://project.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Server-side DB access | `eyJ...` (secret) |
| `RESEND_API_KEY` | Email service auth | `re_...` (secret) |
| `NOTIFICATION_EMAIL` | Recipient for lead notifications | `coach@example.com` |
| `RESEND_FROM_EMAIL` | Sender address (optional) | `noreply@zhulova.com` |

**Setup**:
1. Local: `.env` file (already configured per `CLAUDE.md`)
2. Vercel: Dashboard → Settings → Environment Variables

**Validation**: Existing `test-supabase.js` checks `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`

---

## 6. Error Messages (User-Facing)

### Decision

Use **user-friendly, non-technical** error messages:

| Scenario | Error Message |
|----------|---------------|
| Validation failed (name too short) | "Ім'я має містити мінімум 2 символи" |
| Validation failed (invalid phone) | "Введіть номер у форматі +380XXXXXXXXX" |
| Database insert failed | "Не вдалося зберегти вашу заявку. Спробуйте пізніше." |
| Email send failed (DB saved) | "Вашу заявку збережено, але ми не змогли надіслати підтвердження. Ми зв'яжемося з вами найближчим часом." |
| Unexpected error | "Щось пішло не так. Спробуйте ще раз." |
| Success | "Дякуємо за вашу заявку! Ми зв'яжемося з вами найближчим часом." |

**Language**: Ukrainian (matches site locale)

**Tone**: Professional, reassuring, actionable

---

## Summary of Research Findings

| Research Area | Decision | Status |
|---------------|----------|--------|
| Zod Transforms | Explicit null checks + chain pattern | ✅ Implemented |
| Partial Failures | Fail-fast, clear user feedback | ✅ Documented |
| Testing Strategy | `dev:vercel` + integration script | ✅ Documented |
| Email Templates | Conditional template strings | ✅ Documented |
| Environment Setup | Existing `.env` + Vercel vars | ✅ Verified |
| Error Messages | User-friendly Ukrainian text | ✅ Documented |

**All NEEDS CLARIFICATION markers resolved.** Ready for Phase 1 (Design & Contracts).

---

**Next Steps**:
1. Generate `data-model.md` (references existing schema)
2. Generate `contracts/submit-lead.openapi.yaml`
3. Generate `quickstart.md` (testing guide)
4. Update agent context with patterns
