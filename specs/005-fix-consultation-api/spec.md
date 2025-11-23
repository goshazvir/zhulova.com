# Feature Specification: Fix Consultation Modal API Endpoint

**Feature Branch**: `005-fix-consultation-api`
**Created**: 2025-11-17
**Status**: Completed (2025-11-17)
**Input**: User description: "Fix Consultation Modal API endpoint to correctly handle form submissions and save to database. The consultation modal form sends {name, phone, telegram?, email?} but the API endpoint expects {name, email, message}. This causes form submissions to fail. Additionally, the Supabase insert is commented out, so no data is being saved to the database."

## Problem Statement

The consultation modal form on the homepage is currently non-functional. When visitors attempt to book a free consultation, their submissions fail silently because:

1. The API endpoint validation schema doesn't match the form fields being submitted
2. The database insert code is commented out, preventing data persistence
3. Metadata fields (source tracking, user agent, referrer) are not being populated

**Impact**:
- 100% of leads are being lost
- Potential clients cannot book consultations
- Business cannot track lead sources or conversion data
- Email notifications contain incorrect field data

## User Scenarios & Testing

### User Story 1 - Successful Consultation Booking (Priority: P1)

A website visitor wants to book a free diagnostic coaching session by filling out the consultation form with all available contact information.

**Why this priority**: This is the primary business goal of the homepage - capturing qualified leads. Without this working, the website fails its core purpose.

**Independent Test**: Can be fully tested by submitting the form with all fields (name, phone, telegram, email) and verifying the data appears in the Supabase database and email is received.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they click "Записатись на консультацію" button, **Then** the consultation modal opens with an empty form
2. **Given** the consultation modal is open, **When** visitor enters valid data in all fields (name: "Олена Коваленко", phone: "+380501234567", telegram: "@olena_coach", email: "olena@example.com") and clicks "Відправити заявку", **Then** the form submits successfully, shows success message, and modal auto-closes after 3 seconds
3. **Given** a successful form submission, **When** checking the Supabase `leads` table, **Then** a new record exists with all submitted fields plus auto-populated metadata (source, user_agent, referrer, timestamps)
4. **Given** a successful form submission, **When** checking the configured notification email, **Then** an email is received within 5 seconds containing all visitor contact details

---

### User Story 2 - Minimal Information Submission (Priority: P2)

A privacy-conscious visitor wants to book a consultation using only the required fields (name and phone), without providing optional telegram or email.

**Why this priority**: Not all visitors want to share multiple contact methods. Supporting minimal submissions increases conversion rates while respecting privacy preferences.

**Independent Test**: Can be tested by submitting only required fields (name + phone) and verifying successful save and email notification.

**Acceptance Scenarios**:

1. **Given** the consultation modal is open, **When** visitor enters only required fields (name: "Іван Петренко", phone: "+380671234567") and leaves telegram/email empty, then clicks "Відправити заявку", **Then** the form submits successfully
2. **Given** a minimal submission, **When** checking the database, **Then** the record shows name and phone populated, telegram and email as NULL
3. **Given** a minimal submission, **When** checking the notification email, **Then** the email shows only the provided contact information without empty field placeholders

---

### User Story 3 - Invalid Data Prevention (Priority: P3)

A visitor accidentally enters incorrect data (invalid phone format, incorrect email) and the system guides them to correct it before submission.

**Why this priority**: Data quality is essential for follow-up. Preventing invalid submissions reduces manual data cleanup and ensures contactability.

**Independent Test**: Can be tested by attempting submissions with various invalid inputs and verifying appropriate error messages appear without data being saved.

**Acceptance Scenarios**:

1. **Given** the consultation modal is open, **When** visitor enters phone "+38050" (incomplete) and clicks submit, **Then** validation error appears: "Введіть номер у форматі +380XXXXXXXXX"
2. **Given** visitor enters telegram "username123" (without @), **When** submitting the form, **Then** form accepts the input and automatically normalizes it to "@username123" before saving to database
3. **Given** visitor enters telegram "@username123" (with @), **When** submitting the form, **Then** form accepts the input as-is and saves "@username123" to database
4. **Given** invalid email "notanemail", **When** attempting submit, **Then** validation error appears: "Введіть коректну email адресу"
5. **Given** validation errors present, **When** checking the database, **Then** no partial or invalid records are created

---

### Edge Cases

1. **Duplicate submissions** (same phone within short time):
   - **Current behavior**: System ALLOWS duplicate submissions - no detection, rate limiting, or prevention
   - **Implementation**: No duplicate checking logic in `src/pages/api/submit-lead.ts`
   - **Database**: No UNIQUE constraint on phone field, no time-based checking
   - **Future**: Could be implemented with Redis cache or DB trigger (out of current scope)

2. **Network failures during submission**:
   - **Current behavior**: Returns generic HTTP 500 error with message "An unexpected error occurred"
   - **Implementation**: No retry logic, no queue, no special network error handling (lines 136-159 in `src/pages/api/submit-lead.ts`)
   - **User experience**: User sees error and must manually retry
   - **Future**: Could implement client-side retry or queue (out of current scope)

3. **Supabase down, Resend email working**:
   - **Current behavior**: Email-first strategy means email sends successfully, then DB insert fails with 500 error
   - **Implementation**: Email sent at lines 59-72, DB insert at lines 86-125 in `src/pages/api/submit-lead.ts`
   - **Result**: Coach receives email but lead not in database - requires manual database entry
   - **Rationale**: Acceptable trade-off; email ensures coach is notified even if DB fails

4. **Email fails, database succeeds**:
   - **Current behavior**: IMPOSSIBLE due to email-first implementation strategy
   - **Implementation**: Email validated and sent BEFORE database insert (lines 59-83 before 86-125 in `src/pages/api/submit-lead.ts`)
   - **Result**: If email fails, function returns 500 before reaching DB insert code
   - **Design decision**: Prevents "invisible leads" (saved but coach never notified)

5. **Special characters in names** (apostrophes, hyphens, Cyrillic):
   - **Current behavior**: Fully supported - no restrictions beyond length (2-255 characters)
   - **Implementation**: Zod string validation (`z.string().min(2).trim()` at line 10 in `src/pages/api/submit-lead.ts`) accepts all Unicode
   - **Database**: VARCHAR(255) stores UTF-8 characters without issues
   - **No special handling needed**: Standard string validation is sufficient

6. **Missing metadata** (user_agent, referrer blocked by privacy tools):
   - **Current behavior**: Gracefully handled with NULL fallback
   - **Implementation**: `request.headers.get('user-agent') || null` at lines 106-107 in `src/pages/api/submit-lead.ts`
   - **Database**: Columns allow NULL, no constraint violations
   - **No errors thrown**: Missing headers don't break submission

## Requirements

### Functional Requirements

- **FR-001**: API endpoint MUST validate incoming form data against a schema matching the consultation modal form fields: name (required), phone (required), telegram (optional), email (optional)
- **FR-002**: API endpoint MUST validate phone field per international phone number format defined in [data-model.md](./data-model.md#validation-rules-summary)
- **FR-003**: API endpoint MUST validate telegram field (when provided) per username format defined in [data-model.md](./data-model.md#validation-rules-summary), accepting both "@username" and "username" formats
- **FR-004**: API endpoint MUST normalize telegram handles by prepending "@" if not present before saving to database (e.g., "username123" becomes "@username123")
- **FR-005**: API endpoint MUST validate email field per standard format defined in [data-model.md](./data-model.md#validation-rules-summary)
- **FR-006**: API endpoint MUST validate name field per length requirements defined in [data-model.md](./data-model.md#validation-rules-summary)
- **FR-007**: API endpoint MUST automatically populate metadata fields from the HTTP request: source (hardcoded to "consultation_modal"), user_agent (from User-Agent header), referrer (from Referer header)
- **FR-008**: API endpoint MUST save validated form data to Supabase `leads` table using service role key (server-side only)
- **FR-009**: API endpoint MUST send email notification to configured address (NOTIFICATION_EMAIL env var) with all submitted contact details
- **FR-010**: Email notification MUST include: visitor name, phone number, telegram handle (if provided, with @ prefix), email (if provided), source
- **FR-011**: API endpoint MUST return appropriate HTTP status codes: 200 for success, 400 for validation errors, 500 for server errors
- **FR-012**: API endpoint MUST return structured JSON responses with success/error status and relevant details
- **FR-013**: System MUST handle failures gracefully using email-first validation strategy: email notification sent before database save to ensure coach can be notified; if email fails, submission rejected without database insert to prevent unnotified leads
- **FR-014**: Optional fields (telegram, email) MUST be saved as NULL in database when not provided, not as empty strings
- **FR-015**: Form submission MUST not expose sensitive environment variables (service keys) to client-side code

### Key Entities

- **Lead**: Represents a lead from a potential client
  - Attributes: id (UUID), name (string), phone (string), telegram (string, nullable), email (string, nullable), source (string), user_agent (string, nullable), referrer (string, nullable), created_at (timestamp), updated_at (timestamp)
  - Relationships: Standalone entity (no foreign keys in MVP)
  - Lifecycle: Created on form submission, persisted indefinitely, may be followed up by coach manually

## Success Criteria

### Measurable Outcomes

- **SC-001**: 100% of valid consultation form submissions result in successful database saves (currently 0% due to bug)
- **SC-002**: Email notifications are delivered within 5 seconds of form submission for 99% of successful submissions
- **SC-003**: Validation errors provide clear, actionable feedback to users, reducing form abandonment by at least 30%
- **SC-004**: Zero data loss for valid submissions - all submitted information (including metadata) is accurately persisted
- **SC-005**: API response time for form submissions is under 2 seconds for 95% of requests

## Assumptions

- **A-001**: Supabase database schema for `leads` table already exists and matches the documented structure (see data-model.md)
- **A-002**: Resend API is configured and RESEND_API_KEY environment variable is available
- **A-003**: NOTIFICATION_EMAIL environment variable is configured with the coach's email address
- **A-004**: Frontend consultation modal form will not be modified - only the API endpoint needs fixing
- **A-005**: The existing consultationFormSchema Zod validation on the frontend is correct and matches the intended form design
- **A-006**: International phone number format is accepted to accommodate clients from different countries (minimum 7 digits, flexible formatting)
- **A-007**: Data retention policy allows indefinite storage of leads (GDPR/privacy policy handled separately)
- **A-008**: Service role key (SUPABASE_SERVICE_KEY) has appropriate permissions for inserting into `leads` table
- **A-009**: No user authentication is required - this is a public form accessible to all website visitors

## Dependencies

- **D-001**: Supabase PostgreSQL database with `leads` table and appropriate RLS policies
- **D-002**: Resend email service account and API key
- **D-003**: Environment variables configured in Vercel: SUPABASE_URL, SUPABASE_SERVICE_KEY, RESEND_API_KEY, NOTIFICATION_EMAIL
- **D-004**: Existing frontend components: ConsultationModal.tsx, consultationFormSchema (Zod validation)
- **D-005**: Existing infrastructure: Vercel serverless functions runtime

## Scope

### In Scope

- Fix API endpoint validation schema to match form fields
- Add metadata field population (source, user_agent, referrer)
- Uncomment and correct Supabase database insert code
- Update email notification template to match new form fields
- Create automated test script for API endpoint validation
- Test full submission flow end-to-end (form → API → database + email)

### Out of Scope

- Modifying frontend consultation modal form (already correct)
- Adding user authentication or lead management dashboard
- Implementing CAPTCHA or advanced anti-spam measures
- Creating admin interface for viewing/managing leads
- Implementing automated follow-up sequences or CRM integration

### Future Enhancements

- **Duplicate detection**: Implement duplicate submission tracking (same phone within 24 hours) using Redis cache or database triggers for analytics purposes
- **Email timestamps**: Add submission timestamp in Ukrainian timezone to email notifications
- **Retry logic**: Implement email retry logic or queuing for failed sends to improve reliability
- **Analytics tracking**: Add advanced analytics tracking beyond basic metadata fields

## Monitoring & Verification

How to measure success criteria after implementation:

| Criterion | How to Measure | Tool/Location |
|-----------|----------------|---------------|
| **SC-001**: 100% DB saves | Check Vercel function logs for database errors | Vercel Dashboard → Functions → submit-lead → Logs (filter for "Database insert failed") |
| **SC-002**: Email <5 seconds | Check Resend email delivery timestamps | Resend Dashboard → Emails → Sort by date, check delivery times |
| **SC-003**: Clear validation errors | Monitor 400 validation error responses | Vercel Logs → Filter status:400, review error messages |
| **SC-004**: Zero data loss | Audit Supabase records vs Vercel function success count | Supabase: `SELECT COUNT(*) FROM leads WHERE created_at > 'date'` vs Vercel successful 200 responses |
| **SC-005**: API <2s (95th percentile) | Check p95 response times for submit-lead function | Vercel Speed Insights → Functions → submit-lead → Response time p95 |

## Notes

### Technical Context

This is a bug fix for existing functionality that was partially implemented but never completed. The frontend form was built correctly, but the backend API endpoint was left in a placeholder state with mismatched validation and no database persistence.

The fix requires minimal code changes (< 50 lines) but high attention to detail for validation rules and error handling.

### UX Design Decision: Flexible Telegram Validation

The system accepts Telegram handles in both formats ("@username" and "username") to improve user experience:

**Rationale**: Users shouldn't be blocked from submitting the form due to a minor formatting detail. Some users naturally include the @ symbol, while others don't. Rejecting valid usernames solely because of @ presence/absence creates unnecessary friction.

**Implementation**: The API validates only the username portion (3-32 alphanumeric/underscore characters) and automatically normalizes by prepending @ if missing before database storage. This ensures:
- Consistent data format in database (always with @)
- Maximum conversion rate (no form abandonment due to @ symbol)
- User-friendly experience (accept what users naturally type)

### Risk Mitigation

- **Risk**: Changing validation schema might break existing frontend code
  **Mitigation**: Frontend already uses correct consultationFormSchema, API just needs to align with it

- **Risk**: Database insert might fail due to RLS policies
  **Mitigation**: Use existing test-supabase.js script to verify permissions before deploying

- **Risk**: Email sending might fail silently without alerting anyone
  **Mitigation**: Log all email send attempts and responses; consider future monitoring integration

- **Risk**: Malformed data could crash the serverless function
  **Mitigation**: Comprehensive Zod validation with try-catch error handling

### Testing Strategy

1. **Unit tests**: Validate Zod schema against various input scenarios (valid, invalid, edge cases)
2. **Integration tests**: Automated script testing API endpoint with mock data
3. **Database tests**: Verify Supabase connection, insert, and constraint enforcement
4. **Email tests**: Confirm Resend integration and template rendering
5. **E2E tests**: Manual browser testing with real form submissions
6. **Monitoring**: Check Vercel function logs and Supabase dashboard post-deployment
