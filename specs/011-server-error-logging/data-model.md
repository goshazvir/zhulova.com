# Data Model: Server-Side Error Logging

**Feature**: 011-server-error-logging
**Date**: 2025-11-23
**Status**: Design Phase
**Input**: [research.md](./research.md) - Research findings on logging best practices

---

## Entity: LogEntry

Represents a single structured log event captured during server-side operations.

### Schema

```typescript
interface LogEntry {
  // WHEN - Timestamp information
  timestamp: string;              // ISO 8601 format: "2025-11-23T14:30:00.000Z"

  // WHERE - Location context
  endpoint: string;               // API route path: "/api/submit-lead"
  environment: string;            // "production" | "development" | "preview"

  // WHO - Request correlation
  requestId: string;              // Self-generated correlation ID (crypto.randomUUID())
  userIdHash?: string;            // SHA-256 hash of user ID (optional, for authenticated requests)

  // WHAT - Error information
  level: LogLevel;                // "ERROR" | "WARN" | "INFO"
  message: string;                // Human-readable description of the event
  error_type: string;             // Categorization: "validation_error", "db_error", "email_error"

  // CONTEXT - Debugging information (sanitized)
  context?: LogContext;           // Optional structured data for debugging
}

type LogLevel = "ERROR" | "WARN" | "INFO";

interface LogContext {
  action?: string;                // Business action: "submit_lead", "send_email"
  duration?: number;              // Operation duration in milliseconds
  httpStatus?: number;            // HTTP status code (if applicable)
  errorCode?: string;             // Service-specific error code (e.g., Supabase error code)
  affectedResource?: string;      // Table name, email recipient (anonymized)
  retryAttempt?: number;          // Retry count (for transient failures)
  [key: string]: unknown;         // Additional safe context data
}
```

### Field Definitions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `timestamp` | string | Yes | ISO 8601 timestamp with timezone (UTC) | `"2025-11-23T14:30:00.000Z"` |
| `endpoint` | string | Yes | API route path where event occurred | `"/api/submit-lead"` |
| `environment` | string | Yes | Deployment environment | `"production"` |
| `requestId` | string | Yes | Unique identifier for request correlation | `"a1b2c3d4-..."` (UUID v4) |
| `userIdHash` | string | No | Pseudonymized user identifier (SHA-256 hash) | `"8f4c9a2b..."` (12 chars) |
| `level` | LogLevel | Yes | Severity level for filtering and alerting | `"ERROR"` |
| `message` | string | Yes | Human-readable event description | `"Database connection failed"` |
| `error_type` | string | Yes | Category for log aggregation and filtering | `"db_error"` |
| `context` | LogContext | No | Additional debugging information (sanitized) | `{ action: "submit_lead" }` |

### Log Levels

Based on OWASP guidelines and operational requirements:

#### ERROR
**When to use**: Operation failed completely, requires immediate attention

**Examples**:
- Database connection failures
- Email service API errors (non-transient)
- Missing required environment variables
- Invalid configuration (e.g., malformed Supabase URL)
- Unhandled exceptions in API endpoints

**User Impact**: Feature is broken, user action failed

**Sample Entry**:
```json
{
  "timestamp": "2025-11-23T14:30:00.000Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "level": "ERROR",
  "message": "Database connection failed: connection timeout",
  "error_type": "db_error",
  "context": {
    "action": "submit_lead",
    "duration": 10500,
    "errorCode": "ETIMEDOUT",
    "affectedResource": "leads"
  }
}
```

#### WARN
**When to use**: Potentially harmful situation, degraded functionality with fallback

**Examples**:
- Rate limits reached (429 errors)
- Retry attempts for transient failures
- Validation warnings (non-critical)
- Fallback mechanisms triggered
- Performance degradation detected

**User Impact**: Feature works but with reduced functionality or performance

**Sample Entry**:
```json
{
  "timestamp": "2025-11-23T14:30:00.000Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "level": "WARN",
  "message": "Email service rate limit reached, queueing for retry",
  "error_type": "email_error",
  "context": {
    "action": "send_notification",
    "errorCode": "429",
    "retryAttempt": 1,
    "affectedResource": "[ADMIN]"
  }
}
```

#### INFO
**When to use**: Critical events for operational awareness (use sparingly)

**Examples**:
- Serverless function cold starts
- Environment variable validation on startup
- Configuration changes
- Feature flag toggles

**User Impact**: No direct impact, informational only

**Sample Entry**:
```json
{
  "timestamp": "2025-11-23T14:30:00.000Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "level": "INFO",
  "message": "Cold start: environment variables validated successfully",
  "error_type": "cold_start",
  "context": {
    "action": "validate_env",
    "duration": 12
  }
}
```

### Error Type Categories

Standardized `error_type` values for consistent filtering:

| Category | Value | Description | Examples |
|----------|-------|-------------|----------|
| **Validation** | `validation_error` | User input validation failures | Zod schema errors, missing required fields |
| **Database** | `db_error` | Supabase database operations | Connection failures, query errors, RLS violations |
| **Email** | `email_error` | Resend email service issues | API failures, invalid recipients, rate limits |
| **Configuration** | `config_error` | Environment or setup issues | Missing env vars, invalid URLs, malformed config |
| **System** | `system_error` | Infrastructure or runtime errors | Out of memory, timeouts, circular references |
| **Cold Start** | `cold_start` | Serverless function initialization | Env validation, module loading |

### Validation Rules

#### Size Constraints

Based on Vercel logging limits (research.md section 1):

| Constraint | Limit | Enforcement |
|------------|-------|-------------|
| Per log entry | 256 KB | Truncate `context` object before serialization |
| Context object size | 1 KB (recommended) | Truncate fields with `[TRUNCATED]` suffix |
| Message length | 500 characters | Truncate with `...` suffix |
| Total logs per request | 1 MB | Limit to ~10 log calls per request |

#### Required Field Validation

All fields marked "Required: Yes" must be present. Missing required fields will cause logging to fail gracefully (fallback to basic console.error).

```typescript
// Example validation logic
function validateLogEntry(entry: LogEntry): boolean {
  return !!(
    entry.timestamp &&
    entry.endpoint &&
    entry.environment &&
    entry.requestId &&
    entry.level &&
    entry.message &&
    entry.error_type
  );
}
```

#### Timestamp Format

Must be valid ISO 8601 with timezone (UTC):
- ✅ Valid: `"2025-11-23T14:30:00.000Z"`
- ❌ Invalid: `"2025-11-23 14:30:00"`, `"11/23/2025"`, `1732371000000` (Unix timestamp)

Generated using: `new Date().toISOString()`

#### Request ID Format

Must be valid UUID v4 format (36 characters):
- ✅ Valid: `"a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6"`
- ❌ Invalid: `"abc123"`, `"request-1"`, empty string

Generated using: `crypto.randomUUID()`

### Sensitive Data Sanitization

**CRITICAL SECURITY REQUIREMENT** (FR-007, FR-011): All log entries MUST be sanitized before output.

#### Pattern-Based Redaction

Apply regex-based redaction to `message` and all `context` string values:

| Pattern | Regex | Replacement | Example |
|---------|-------|-------------|---------|
| **Email addresses** | `/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z\|a-z]{2,}\b/g` | `[EMAIL]` | `user@example.com` → `[EMAIL]` |
| **API keys (Stripe)** | `/sk_(test\|live)_[a-zA-Z0-9]{24,}/g` | `sk_$1_[REDACTED]` | `sk_live_abc123...` → `sk_live_[REDACTED]` |
| **API keys (Resend)** | `/re_[a-zA-Z0-9]{20,}/g` | `re_[REDACTED]` | `re_abc123...` → `re_[REDACTED]` |
| **Bearer tokens** | `/Bearer\s+[a-zA-Z0-9\-._~+\/]+=*/gi` | `Bearer [REDACTED]` | `Bearer abc123...` → `Bearer [REDACTED]` |
| **Phone numbers (US)** | `/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g` | `[PHONE]` | `+1-555-123-4567` → `[PHONE]` |
| **Database URLs** | `/(postgres\|mysql\|mongodb):\/\/[^:]+:[^@]+@/gi` | `$1://[REDACTED]@` | `postgres://user:pass@host` → `postgres://[REDACTED]@host` |
| **Passwords** | `/(password\|passwd\|pwd)[\s:=]+[^\s&]+/gi` | `$1=[REDACTED]` | `password=abc123` → `password=[REDACTED]` |

#### Field-Based Redaction

Redact entire field values if key name suggests sensitive data:

```typescript
const SENSITIVE_KEYS = [
  'password', 'passwd', 'pwd',
  'apiKey', 'api_key', 'token',
  'email', 'phone', 'ssn',
  'secret', 'credential', 'authorization'
];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k));
}
```

#### Anonymization Examples

**Before sanitization:**
```typescript
const context = {
  userEmail: "john.doe@example.com",
  apiKey: "sk_live_abc123xyz456",
  errorMessage: "Invalid credentials for user@example.com"
};
```

**After sanitization:**
```typescript
const context = {
  userEmail: "[EMAIL]",
  apiKey: "sk_live_[REDACTED]",
  errorMessage: "Invalid credentials for [EMAIL]"
};
```

### Context Truncation

To prevent oversized log entries, truncate context objects exceeding 1KB:

```typescript
function truncateContext(context: LogContext, maxSize: number = 1024): LogContext {
  const serialized = JSON.stringify(context);

  if (serialized.length <= maxSize) {
    return context;
  }

  // Strategy 1: Remove least important fields first
  const { duration, retryAttempt, ...essential } = context;

  const truncated = JSON.stringify(essential);
  if (truncated.length <= maxSize) {
    return essential;
  }

  // Strategy 2: Truncate large string values
  return {
    ...essential,
    _truncated: true,
    _originalSize: serialized.length
  };
}
```

### GDPR Compliance

Following GDPR log management requirements (research.md section 2):

#### Personal Data Handling

| Data Type | Requirement | Implementation |
|-----------|-------------|----------------|
| **User IDs** | Pseudonymize | Hash with SHA-256: `crypto.createHash('sha256').update(userId + SALT).digest('hex').slice(0, 12)` |
| **IP Addresses** | Anonymize | Mask last octet: `192.168.1.xxx` (NOT LOGGING IPs currently) |
| **Email addresses** | Redact or hash | Replace with `[EMAIL]` or hash if needed for correlation |
| **Phone numbers** | Redact | Replace with `[PHONE]` |
| **Session IDs** | Redact | Replace with first 8 chars + `...` |

#### Log Retention

- **Automatic retention**: Managed by Vercel (30 days for Hobby plan, 60+ for Pro/Enterprise)
- **Right to erasure**: All user identifiers are pseudonymized (hashed), so logs remain non-identifiable after user deletion
- **Data minimization**: Only log what's necessary for debugging (no excessive context)

### Circular Reference Handling

Edge case (research.md section 2, Edge Case Q1):

```typescript
function safeStringify(obj: unknown): string {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    // Circular reference or non-serializable object
    return JSON.stringify({
      error: 'Failed to serialize context',
      errorType: error instanceof Error ? error.name : 'Unknown'
    });
  }
}
```

### State Transitions

Logging is **stateless** - each log entry is independent. No state machine required.

**Lifecycle**:
1. Error occurs in serverless function
2. Logger utility called with level, message, context
3. Context sanitized (sensitive data removed)
4. Context truncated (if >1KB)
5. Log entry serialized to JSON
6. Output to stdout/stderr (console.error/warn/log)
7. Vercel captures and displays in Dashboard

---

## Relationships

### LogEntry → API Endpoint
- **Cardinality**: Many-to-One
- **Description**: Multiple log entries can originate from the same API endpoint
- **Implementation**: `endpoint` field contains route path (e.g., `/api/submit-lead`)

### LogEntry → Request
- **Cardinality**: Many-to-One
- **Description**: Multiple log entries can be correlated to a single HTTP request
- **Implementation**: `requestId` field contains UUID generated at request start
- **Usage**: Filter logs by `requestId` to trace all events in a single request lifecycle

### LogEntry → User (optional)
- **Cardinality**: Many-to-One
- **Description**: Log entries may be associated with a user (for authenticated requests)
- **Implementation**: `userIdHash` field contains pseudonymized user identifier
- **Usage**: Trace errors affecting specific users without exposing PII

---

## Examples

### Database Connection Error

```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "level": "ERROR",
  "message": "Database connection failed: connection timeout after 10s",
  "error_type": "db_error",
  "context": {
    "action": "submit_lead",
    "duration": 10500,
    "errorCode": "ETIMEDOUT",
    "affectedResource": "leads",
    "httpStatus": 500
  }
}
```

### Validation Error (Zod)

```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7",
  "level": "WARN",
  "message": "Request validation failed: invalid phone format",
  "error_type": "validation_error",
  "context": {
    "action": "validate_request",
    "duration": 2,
    "errorCode": "VALIDATION_ERROR",
    "failedFields": ["phone"],
    "httpStatus": 400
  }
}
```

### Email Service Rate Limit

```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "c3d4e5f6-7g8h-9i0j-1k2l-m3n4o5p6q7r8",
  "level": "WARN",
  "message": "Email service rate limit reached (429), retry scheduled",
  "error_type": "email_error",
  "context": {
    "action": "send_notification",
    "duration": 450,
    "errorCode": "429",
    "retryAttempt": 1,
    "affectedResource": "[ADMIN]",
    "httpStatus": 200
  }
}
```

### Missing Environment Variable (Cold Start)

```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "d4e5f6g7-8h9i-0j1k-2l3m-n4o5p6q7r8s9",
  "level": "ERROR",
  "message": "Missing required environment variable: RESEND_API_KEY",
  "error_type": "config_error",
  "context": {
    "action": "validate_env",
    "duration": 1,
    "missingVar": "RESEND_API_KEY",
    "setupInstructions": "Add RESEND_API_KEY to Vercel environment variables"
  }
}
```

---

## Design Decisions

### D1: Why self-generated `requestId` instead of Vercel's?

**Problem**: Vercel provides automatic request IDs, but they're not accessible programmatically within serverless function code (research.md section 1).

**Decision**: Generate our own UUID v4 using `crypto.randomUUID()` at request start, include in all log entries.

**Benefits**:
- Can correlate logs within application code
- Can pass to external services for distributed tracing
- Independent of hosting platform

**Trade-offs**: Adds ~0.1ms overhead per request (acceptable within 5ms budget).

### D2: Why 1KB context size limit?

**Problem**: Vercel allows 256KB per log line, but large contexts increase serialization time (research.md section 3).

**Decision**: Cap context at 1KB to keep JSON.stringify overhead <1ms.

**Benefits**:
- Predictable performance (<5ms budget)
- Prevents accidental logging of massive objects
- Forces developers to log only relevant debugging info

**Trade-offs**: May need to manually truncate large validation error arrays (log first 10 errors).

### D3: Why pattern-based sanitization instead of library?

**Problem**: Sensitive data may appear in any string field (error messages, context values).

**Decision**: Apply regex patterns to all strings before logging (research.md section 2).

**Benefits**:
- Catches sensitive data even when developers forget to filter manually
- Zero dependencies (FR-015)
- Flexible - easy to add new patterns

**Trade-offs**: Regex overhead (~0.5ms per log entry) - acceptable within budget.

### D4: Why separate `error_type` from `level`?

**Problem**: Need both severity filtering (ERROR/WARN) and category filtering (db/email/validation).

**Decision**: Use `level` for severity, `error_type` for categorization.

**Benefits**:
- Can filter "all database errors" or "all ERROR-level logs"
- Enables pattern analysis (e.g., "validation errors increased 20%")
- Supports future log aggregation tools

**Trade-offs**: Requires standardized `error_type` vocabulary (documented above).

---

## Verification

### Test Scenarios

#### TS1: Valid LogEntry serialization
**Given** a LogEntry with all required fields
**When** serialized to JSON
**Then** output is valid JSON <256KB
**And** all fields present with correct types

#### TS2: Sensitive data sanitization
**Given** a context containing email "user@example.com" and API key "sk_live_abc123"
**When** LogEntry is created
**Then** email replaced with `[EMAIL]`
**And** API key replaced with `sk_live_[REDACTED]`

#### TS3: Context truncation
**Given** a context object >1KB
**When** LogEntry is created
**Then** context truncated to ≤1KB
**And** `_truncated: true` flag added

#### TS4: Circular reference handling
**Given** a context with circular reference
**When** LogEntry is serialized
**Then** no error thrown
**And** fallback JSON generated with `{ error: 'Failed to serialize' }`

#### TS5: Request correlation
**Given** two log entries from same request
**When** both logged with same `requestId`
**Then** Vercel Dashboard shows both under same request trace

---

## Next Steps

**Phase 1 (Design) Remaining**:
1. ✅ `data-model.md` (this file) - COMPLETE
2. ⏳ `contracts/logger-api.md` - Logger utility function signatures (NEXT)
3. ⏳ `quickstart.md` - Developer integration guide
4. ⏳ Agent context update - Add logging patterns to CLAUDE.md

**Phase 2 (Implementation)**:
- Generated via `/speckit.tasks` command after Phase 1 complete
