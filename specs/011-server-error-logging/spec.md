# Feature Specification: Server-Side Error Logging

**Feature Branch**: `011-server-error-logging`
**Created**: 2025-11-23
**Updated**: 2025-11-24
**Status**: ✅ Implementation Complete (22/43 tasks - 51%) | ⏳ Production Testing Pending (21 manual validation tasks)
**Input**: User description: "Add production-ready error logging and monitoring for server-side operations

**Context**:
The zhulova.com coaching website currently lacks structured logging for server-side operations. When errors occur in API endpoints (form submissions, database writes, email sending), there's no visibility into what went wrong, making debugging production issues difficult.

**Goal**:
Implement strategic error logging in critical failure points (API routes, Supabase operations, Resend email service) using industry best practices. The solution must be lightweight, production-ready, and follow the "log only what matters" principle.

**Key Requirements**:

1. **Scope** (where to log):
   - API endpoint errors (src/pages/api/submit-lead.ts)
   - Database connection/write failures (Supabase operations)
   - Email delivery failures (Resend API calls)
   - Request validation errors (Zod schema failures)
   - Environment variable misconfiguration errors

2. **What NOT to log**:
   - Client-side errors (already handled by Vercel Analytics)
   - Successful operations (avoid noise)
   - Sensitive data (PII, API keys, passwords)
   - Static page renders (no server interaction)

3. **Technical Constraints**:
   - Use Vercel native logging (console.log/error automatically captured)
   - No heavy logging libraries (keep bundle size minimal)
   - Structured logging format (JSON for parsing)
   - Include context: timestamp, endpoint, error type, user-facing impact
   - No performance degradation (<5ms overhead per request)

4. **Best Practices Research**:
   - Review Context7 MCP documentation for logging patterns
   - Research Next.js/Astro serverless logging best practices
   - Follow OWASP logging guidelines (no sensitive data leaks)
   - Implement log levels: ERROR (failures), WARN (degraded), INFO (critical events only)

5. **Integration Points**:
   - /api/submit-lead endpoint (existing consultation form API)
   - Supabase client error handlers
   - Resend email error handlers
   - Environment variable validation on cold start

6. **Success Criteria**:
   - All server-side errors logged with actionable context
   - Logs viewable in Vercel Dashboard → Logs
   - Zero sensitive data leaked in logs
   - No new dependencies added (use native console API)
   - Documentation: logging strategy in technical-spec.md

**Non-Goals**:
- Client-side error tracking (use existing Vercel Analytics)
- Log aggregation service (Vercel built-in is sufficient)
- Alerting/notifications (out of scope for MVP)
- Performance monitoring (use existing Speed Insights)

**Example Scenarios**:
1. User submits consultation form → Database connection fails → Log ERROR with: endpoint, error message, fallback action, impact (\"form submission failed\")
2. Email service returns 429 rate limit → Log WARN with: retry attempt, queue status
3. Missing RESEND_API_KEY env var → Log ERROR on cold start with: missing variable name, setup instructions

**Architectural Decisions**:
- Follow existing hybrid static-first architecture (no changes to static pages)
- Use Vercel serverless function logging (automatic CloudWatch integration)
- Centralize logging utility in src/utils/logger.ts
- Follow project TypeScript strict mode and path aliases

This is a production enhancement feature, not a bug fix. Focus on strategic logging that aids debugging without creating log noise."

---

## Implementation Summary

**Completed (22/43 tasks - All code implementation):**
- ✅ Phase 1: Setup (T001-T002) - Logger utility structure and TypeScript types
- ✅ Phase 2: Foundational (T003-T008) - Helper functions (sanitization, truncation, error categorization)
- ✅ Phase 3: User Story 1 Implementation (T009-T015) - Core logging functions and API integration
- ✅ Phase 4: User Story 2 Implementation (T021-T023) - Email error logging
- ✅ Phase 6: Documentation (T034-T035, T042-T043) - technical-spec.md and CLAUDE.md updates

**Pending (21/43 tasks - All manual production testing):**
- ⏳ Phase 3: User Story 1 Testing (T016-T020) - Production validation (database errors, validation errors, PII sanitization)
- ⏳ Phase 4: User Story 2 Testing (T024-T026) - Email error testing in production
- ⏳ Phase 5: User Story 3 (T027-T033) - Log filtering and pattern analysis (requires 7 days of production data)
- ⏳ Phase 6: Final Validation (T036-T041) - Security audit, performance validation, success criteria verification

**Why testing is pending:**
- Requires deployment to production environment
- Needs real error scenarios (invalid env vars, database failures, email errors)
- Requires 7-day observation period for pattern analysis (T033, T037)
- Vercel Dashboard manual verification needed

**Code Status:**
- ✅ Logger utility: `src/utils/logger.ts` (production-ready)
- ✅ API integration: `src/pages/api/submit-lead.ts` (all error handlers integrated)
- ✅ Unit tests: 27 tests passing (sanitization, truncation, error categorization)
- ✅ Documentation: technical-spec.md updated with logging section

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Debug Production API Failures (Priority: P1) 🎯 MVP

As a developer, when a user reports that form submission failed, I need to see exactly what error occurred in the API endpoint (validation failure, database connection issue, or email service problem) with full context (timestamp, request details, error message), so that I can diagnose and fix the issue within minutes instead of hours of guesswork.

**Why this priority**: This is the MVP. Without visibility into API errors, production debugging is impossible. Every form submission failure currently results in hours of manual investigation because there's no logging. This addresses the core pain point mentioned in the context: "no visibility into what went wrong."

**Independent Test**: Trigger a database connection failure in `/api/submit-lead` endpoint (e.g., invalid Supabase credentials), check Vercel Dashboard → Logs, verify structured error log appears with: endpoint name, error type ("database_connection_failed"), error message, timestamp, and user impact ("form submission failed"). Deliverable value: Developer can immediately identify the root cause.

**Acceptance Scenarios**:

1. **Given** a user submits the consultation form, **When** the Supabase database connection fails, **Then** an ERROR log entry is created with: endpoint "/api/submit-lead", error type "database_error", error message from Supabase, timestamp, and context "lead submission failed"
2. **Given** a user submits the consultation form, **When** Zod validation fails (invalid phone format), **Then** a WARN log entry is created with: endpoint "/api/submit-lead", validation errors list, submitted field values (sanitized - no PII), timestamp
3. **Given** the serverless function cold-starts, **When** RESEND_API_KEY environment variable is missing, **Then** an ERROR log entry is created with: missing variable name, setup instructions, timestamp, and impact "email notifications disabled"
4. **Given** an API error is logged, **When** the log entry is viewed in Vercel Dashboard, **Then** it appears as structured JSON with all required fields (level, timestamp, endpoint, error, context) and contains actionable debugging information
5. **Given** any error occurs in the API, **When** the error is logged, **Then** no sensitive data appears in the log (no API keys, no full email addresses, no phone numbers, no user IDs beyond anonymized references)

---

### User Story 2 - Monitor Email Service Health (Priority: P2)

As a developer, I need to be alerted when email delivery fails or Resend API returns errors (rate limits, invalid sender, API downtime), so that I can proactively address issues before users report missing confirmation emails or the problem accumulates into service degradation.

**Why this priority**: Email delivery is a critical part of the user journey, but it's async and fails silently. Without logging, we won't know if emails are failing until users complain. This is P2 because the form still saves to database even if email fails, so user data isn't lost (P1 handles data loss scenarios).

**Independent Test**: Trigger an email delivery failure by using an invalid `from` email address in Resend configuration, submit a form, verify Vercel logs show WARN entry with: Resend error code, email recipient (anonymized), retry status, timestamp. Deliverable value: Developer knows exactly when and why emails are failing.

**Acceptance Scenarios**:

1. **Given** the Resend API returns 429 rate limit error, **When** attempting to send consultation form notification, **Then** a WARN log entry is created with: error code "429_rate_limit", retry attempt number, queued status, timestamp
2. **Given** the Resend API call times out (>10 seconds), **When** sending email notification, **Then** a WARN log entry is created with: timeout duration, recipient (anonymized as "admin"), fallback action ("email queued for retry"), timestamp
3. **Given** Resend API returns 400 invalid sender error, **When** attempting to send email, **Then** an ERROR log entry is created with: error message, RESEND_FROM_EMAIL configuration value (sanitized), setup instructions link, timestamp
4. **Given** email service logs are created, **When** viewed in Vercel Dashboard, **Then** logs show clear distinction between transient failures (WARN with retry info) and permanent failures (ERROR requiring configuration fix)

---

### User Story 3 - Analyze Error Patterns for System Improvements (Priority: P3)

As a developer, I need to review error logs over time to identify patterns (e.g., specific validation errors that occur frequently, database timeouts during peak hours), so that I can prioritize improvements to user experience and system reliability based on real production data rather than guesses.

**Why this priority**: This is P3 because it's about long-term optimization, not immediate debugging. The system works fine without pattern analysis - it's a nice-to-have for continuous improvement. P1 and P2 handle the critical "fix it now" scenarios.

**Independent Test**: Generate 10+ errors of different types over a week (validation errors, database timeouts, email failures), query Vercel logs with filters (e.g., "error_type:validation_error"), verify logs can be aggregated to show: most common error types, error frequency trends, affected endpoints. Deliverable value: Data-driven prioritization for improvements.

**Acceptance Scenarios**:

1. **Given** multiple errors occur across different endpoints, **When** reviewing logs in Vercel Dashboard, **Then** logs can be filtered by error type, endpoint, timestamp range to identify patterns
2. **Given** a specific error type recurs multiple times, **When** analyzing logs, **Then** each log entry contains consistent structured fields (error_type, endpoint, context) enabling automated aggregation
3. **Given** logs have been collected for 7 days, **When** querying logs for "validation_error", **Then** results show which validation rules fail most often and can inform UX improvements (e.g., better phone number format hints)

---

### Edge Cases

**Q1: What happens when logging itself fails (e.g., circular error in logger utility)?**
- **Answer**: Logger utility includes fail-safe: if JSON.stringify fails on log payload (circular reference, large object), fall back to basic console.error with error type and timestamp only. No retry loop to prevent infinite recursion. Error context is lost but application continues functioning.
- **Code**: `src/utils/logger.ts` will implement try-catch around JSON serialization
- **Behavior**: Degraded logging (minimal info) instead of crashing serverless function

**Q2: How are large error payloads handled (e.g., Zod validation failing on 50 fields)?**
- **Answer**: Logger truncates context objects to maximum 1KB per log entry. For validation errors with many fields, log first 10 errors with note "...and N more errors". This prevents log size from impacting function performance while preserving actionable debugging info.
- **Code**: Logger utility implements `truncateContext(obj, maxSize)` helper
- **Behavior**: Partial context logged with indication of truncation

**Q3: What happens if multiple requests log errors concurrently (race condition)?**
- **Answer**: Vercel's serverless architecture handles this natively - each request runs in isolated container with its own console output stream. No race condition possible. Each log entry is tagged with unique request ID by Vercel automatically.
- **Code**: No special handling needed - Vercel infrastructure provides isolation
- **Behavior**: Logs appear independently in Vercel Dashboard with request ID for correlation

**Q4: How does logger handle network failures when writing to Vercel logs?**
- **Answer**: Console output in Vercel functions writes to stdout/stderr, which is buffered locally and flushed after function completes. Network failures don't affect logging - logs are captured by Vercel's infrastructure layer, not sent over network from function code.
- **Code**: Standard console.error/log API - no custom network logic
- **Behavior**: Logs always succeed (or function crashes entirely, which is also logged)

**Q5: What if an error occurs during environment variable validation on cold start?**
- **Answer**: Logger must be dependency-free (no env vars needed for logging itself). If RESEND_API_KEY is missing, logger logs this error using basic console.error without needing any configuration. Logging cannot fail due to missing env vars.
- **Code**: Logger utility has zero dependencies on application config
- **Behavior**: Even misconfigured applications can log their configuration errors

**Q6: How are errors in static page generation handled (even though spec says no static page logging)?**
- **Answer**: Static pages (Astro SSG) run at build time, not production runtime. Build errors appear in Vercel deployment logs (separate from runtime logs). This spec explicitly excludes static page errors - only runtime serverless function errors are logged.
- **Code**: No logger integration in Astro components, only in `/api/*` endpoints
- **Behavior**: Build-time errors visible in Vercel deployments tab, not runtime logs tab

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a centralized logging utility that accepts log level (ERROR, WARN, INFO), message, and optional context object
- **FR-002**: System MUST log all unhandled errors in `/api/submit-lead` endpoint with: endpoint path, error type, error message, timestamp, user-facing impact description
- **FR-003**: System MUST log database operation failures (Supabase connection errors, query failures, timeout errors) with: operation type, error code, affected table (if applicable), timestamp
- **FR-004**: System MUST log email service failures (Resend API errors) with: error code, error message, retry status, timestamp, anonymized recipient reference
- **FR-005**: System MUST log request validation failures (Zod schema errors) with: failed fields list, validation rules violated, sanitized input values (no PII), timestamp
- **FR-006**: System MUST log missing or invalid environment variables on serverless function cold start with: variable name, expected format, setup instructions reference, timestamp
- **FR-007**: System MUST NOT log sensitive data including: API keys, passwords, full email addresses, phone numbers, user IDs (may use anonymized tokens like "user_abc123"), payment information
- **FR-008**: System MUST format all logs as structured JSON with consistent schema: `{ level, timestamp, endpoint, error_type, message, context }`
- **FR-009**: System MUST use appropriate log levels: ERROR for failures requiring immediate action, WARN for degraded functionality with fallbacks, INFO for critical events (cold starts, configuration changes)
- **FR-010**: Logging operations MUST complete in under 5 milliseconds to avoid impacting API response times
- **FR-011**: System MUST sanitize error messages to remove sensitive data before logging (e.g., replace "Invalid API key: sk_live_abc123" with "Invalid API key: [REDACTED]")
- **FR-012**: System MUST include request correlation ID (if available from Vercel) in all log entries to enable tracing related logs across multiple operations
- **FR-013**: System MUST handle circular references and non-serializable objects in context gracefully by falling back to basic error info
- **FR-014**: System MUST truncate oversized context objects (>1KB) while preserving most relevant debugging information
- **FR-015**: System MUST NOT add any external logging library dependencies (use native `console` API only)

### Assumptions

- Vercel automatically captures `console.error`, `console.warn`, `console.log` output from serverless functions and makes it available in Vercel Dashboard → Logs
- Vercel provides request correlation IDs automatically (visible in logs dashboard)
- JSON-formatted console output is parseable/filterable in Vercel's log interface
- Developer has access to Vercel Dashboard with appropriate permissions to view logs
- Current API endpoint (`/api/submit-lead`) is the only server-side code requiring logging (no other API routes exist yet)
- Performance requirement (<5ms) is acceptable given logging is synchronous and only writes to stdout/stderr (no network calls)
- OWASP logging guidelines consider API keys, passwords, full emails, phone numbers as sensitive data requiring redaction
- Existing `.claude/docs/technical-spec.md` is the appropriate place to document logging strategy (will add "Logging & Monitoring" section)

### Key Entities

- **LogEntry**: Represents a single log event with attributes: `level` (ERROR | WARN | INFO), `timestamp` (ISO 8601 string), `endpoint` (API route path), `error_type` (categorization like "database_error", "validation_error"), `message` (human-readable description), `context` (optional object with debugging details, sanitized), `request_id` (correlation ID from Vercel if available)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: When a production error occurs in any server-side operation, developers can locate the error log in Vercel Dashboard within 30 seconds of incident report
- **SC-002**: Error logs contain sufficient context that 90% of production issues can be diagnosed without needing to reproduce the error locally or request additional user information
- **SC-003**: Zero sensitive data (API keys, passwords, full emails, phone numbers) appears in production logs when reviewed manually or via automated PII scanner
- **SC-004**: API response time does not increase by more than 5 milliseconds (measured at 95th percentile) after logging is implemented, ensuring no user-perceivable performance degradation
- **SC-005**: Developers can filter Vercel logs by error type (e.g., "database_error", "validation_error", "email_error") and retrieve only relevant errors without noise from successful operations
- **SC-006**: When a configuration error occurs (missing environment variable), the error log provides clear instructions for resolution (e.g., "Add RESEND_API_KEY to Vercel environment variables") enabling fixes without consulting documentation

### Monitoring & Verification

How to measure each success criterion:

- **SC-001**: Tool: **Vercel Dashboard → Logs** | Method: Simulate production error (e.g., temporarily remove Supabase credentials) → Note error occurrence time → Open Vercel logs → Search for error by endpoint or timestamp → Measure time to locate relevant log entry → Verify <30 seconds
- **SC-002**: Tool: **Manual review + developer survey** | Method: Collect 10 real production errors over 1 week → For each error, developer attempts diagnosis using only log entries (no local reproduction, no user follow-up) → Track success rate → Verify ≥90% diagnosable from logs alone
- **SC-003**: Tool: **Manual log review + grep for patterns** | Method: Export sample of 100 production logs → Run regex scans for common PII patterns: `sk_live_\w+` (API keys), `\b[\w\.-]+@[\w\.-]+\.\w+\b` (emails), `\+?\d{10,}` (phone numbers) → Manual review of flagged entries → Verify zero matches
- **SC-004**: Tool: **Vercel Speed Insights** | Method: Baseline API response time (p95) before logging deployment → Deploy logging feature → Measure API response time (p95) after 24 hours of production traffic → Calculate difference → Verify increase <5ms
- **SC-005**: Tool: **Vercel Dashboard → Logs filters** | Method: Generate errors of different types (validation, database, email) → Apply filter in Vercel logs: `error_type:database_error` → Verify only database errors returned (no validation or email errors in results) → Test filters for each error type
- **SC-006**: Tool: **Manual test + log review** | Method: Remove required env var (e.g., RESEND_API_KEY) from Vercel config → Trigger function cold start → Check logs for error entry → Verify log message includes: variable name, fix instructions ("Add [VAR] to Vercel environment variables"), and link to setup docs (if applicable)
