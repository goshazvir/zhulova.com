# API Contract: Logger Utility

**Feature**: 011-server-error-logging
**Date**: 2025-11-23
**Status**: Design Phase
**Input**: [data-model.md](../data-model.md) - LogEntry entity schema

---

## Overview

The Logger utility provides a centralized, type-safe API for structured logging in Vercel serverless functions. All functions are synchronous, dependency-free, and optimized for <5ms overhead per call.

**File Location**: `src/utils/logger.ts`

**Import Path**: `@utils/logger` (via tsconfig path alias)

**Usage**:
```typescript
import { logError, logWarn, logInfo } from '@utils/logger';
```

---

## Public API

### Function: `logError`

Logs an ERROR-level event requiring immediate attention (database failures, API errors, missing config).

**Signature**:
```typescript
function logError(
  message: string,
  context: LogContext,
  endpoint?: string
): void
```

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | Human-readable error description (max 500 chars) |
| `context` | `LogContext` | Yes | Structured debugging information (sanitized automatically) |
| `endpoint` | `string` | No | API route path (defaults to `import.meta.env.ENDPOINT` if available) |

**Returns**: `void` (outputs to stderr via `console.error`)

**Side Effects**:
- Writes structured JSON to stderr
- Generates UUID v4 for request correlation
- Sanitizes sensitive data in message and context
- Truncates context if >1KB

**Error Handling**: Never throws. If logging itself fails (circular reference, serialization error), falls back to basic console.error with minimal info.

**Example**:
```typescript
import { logError } from '@utils/logger';

try {
  const { data, error } = await supabase
    .from('leads')
    .insert({ name, email });

  if (error) throw error;
} catch (error) {
  logError(
    'Database insert failed: connection timeout',
    {
      action: 'submit_lead',
      duration: 10500,
      errorCode: error.code,
      affectedResource: 'leads',
      httpStatus: 500
    },
    '/api/submit-lead'
  );

  return new Response(
    JSON.stringify({ error: 'Failed to save submission' }),
    { status: 500 }
  );
}
```

**Output** (JSON to stderr):
```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "level": "ERROR",
  "message": "Database insert failed: connection timeout",
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

---

### Function: `logWarn`

Logs a WARN-level event indicating degraded functionality with fallback (rate limits, retry attempts).

**Signature**:
```typescript
function logWarn(
  message: string,
  context: LogContext,
  endpoint?: string
): void
```

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | Human-readable warning description (max 500 chars) |
| `context` | `LogContext` | Yes | Structured debugging information (sanitized automatically) |
| `endpoint` | `string` | No | API route path (defaults to `import.meta.env.ENDPOINT` if available) |

**Returns**: `void` (outputs to stdout via `console.warn`)

**Side Effects**: Same as `logError` (UUID generation, sanitization, truncation)

**Error Handling**: Same as `logError` (never throws, falls back gracefully)

**Example**:
```typescript
import { logWarn } from '@utils/logger';

try {
  const response = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL,
    to: process.env.NOTIFICATION_EMAIL,
    subject: 'New consultation request',
    html: emailBody
  });
} catch (error) {
  if (error.statusCode === 429) {
    logWarn(
      'Email service rate limit reached, will retry',
      {
        action: 'send_notification',
        errorCode: '429',
        retryAttempt: 1,
        affectedResource: '[ADMIN]'
      },
      '/api/submit-lead'
    );

    // Continue - form was saved to DB successfully
  }
}
```

**Output** (JSON to stdout):
```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7",
  "level": "WARN",
  "message": "Email service rate limit reached, will retry",
  "error_type": "email_error",
  "context": {
    "action": "send_notification",
    "errorCode": "429",
    "retryAttempt": 1,
    "affectedResource": "[ADMIN]"
  }
}
```

---

### Function: `logInfo`

Logs an INFO-level event for operational awareness (cold starts, config validation). **Use sparingly** to avoid log noise.

**Signature**:
```typescript
function logInfo(
  message: string,
  context: LogContext,
  endpoint?: string
): void
```

**Parameters**:

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `message` | `string` | Yes | Human-readable informational message (max 500 chars) |
| `context` | `LogContext` | Yes | Structured context information (sanitized automatically) |
| `endpoint` | `string` | No | API route path (defaults to `import.meta.env.ENDPOINT` if available) |

**Returns**: `void` (outputs to stdout via `console.log`)

**Side Effects**: Same as `logError` (UUID generation, sanitization, truncation)

**Error Handling**: Same as `logError` (never throws, falls back gracefully)

**Example**:
```typescript
import { logInfo } from '@utils/logger';

// On cold start, validate environment variables
export const prerender = false;

let envValidated = false;

export const POST: APIRoute = async ({ request }) => {
  if (!envValidated) {
    // Cold start - validate required env vars
    const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'RESEND_API_KEY'];
    const missing = requiredVars.filter(v => !import.meta.env[v]);

    if (missing.length === 0) {
      logInfo(
        'Cold start: environment variables validated successfully',
        {
          action: 'validate_env',
          duration: 1,
          validatedVars: requiredVars
        },
        '/api/submit-lead'
      );
    }

    envValidated = true;
  }

  // Process request...
};
```

**Output** (JSON to stdout):
```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "c3d4e5f6-7g8h-9i0j-1k2l-m3n4o5p6q7r8",
  "level": "INFO",
  "message": "Cold start: environment variables validated successfully",
  "error_type": "cold_start",
  "context": {
    "action": "validate_env",
    "duration": 1,
    "validatedVars": ["SUPABASE_URL", "SUPABASE_SERVICE_KEY", "RESEND_API_KEY"]
  }
}
```

---

## Types

### `LogContext`

Structured context object for debugging information. All fields are optional.

**Definition**:
```typescript
interface LogContext {
  action?: string;                // Business action: "submit_lead", "send_email"
  duration?: number;              // Operation duration in milliseconds
  httpStatus?: number;            // HTTP response status code
  errorCode?: string;             // Service-specific error code (Supabase, Resend)
  affectedResource?: string;      // Table name, recipient (anonymized)
  retryAttempt?: number;          // Retry count for transient failures
  validationErrors?: string[];    // Validation error messages (first 10 only)
  missingVar?: string;            // Missing environment variable name
  setupInstructions?: string;     // How to fix configuration error
  [key: string]: unknown;         // Additional safe context data
}
```

**Common Patterns**:

#### Database Operations
```typescript
{
  action: 'insert_lead' | 'query_leads' | 'update_lead',
  duration: 234,  // ms
  errorCode: 'PGRST301',  // Supabase error code
  affectedResource: 'leads',  // table name
  httpStatus: 500
}
```

#### Email Operations
```typescript
{
  action: 'send_notification' | 'send_confirmation',
  duration: 450,  // ms
  errorCode: '429' | 'invalid_sender',
  affectedResource: '[ADMIN]' | '[USER]',  // anonymized recipient
  retryAttempt: 1,
  httpStatus: 200  // API succeeded, email failed
}
```

#### Validation Errors
```typescript
{
  action: 'validate_request',
  duration: 2,  // ms
  errorCode: 'VALIDATION_ERROR',
  validationErrors: ['Invalid email format', 'Phone number too short'],
  httpStatus: 400
}
```

#### Configuration Errors
```typescript
{
  action: 'validate_env',
  duration: 1,  // ms
  missingVar: 'RESEND_API_KEY',
  setupInstructions: 'Add RESEND_API_KEY to Vercel environment variables'
}
```

---

## Internal Helpers (Not Exported)

These functions are implementation details and should NOT be used directly.

### `sanitizeString(str: string): string`

Applies pattern-based redaction to remove sensitive data from strings.

**Patterns**:
- Email addresses → `[EMAIL]`
- API keys (Stripe, Resend) → `[REDACTED]`
- Bearer tokens → `[REDACTED]`
- Phone numbers → `[PHONE]`
- Database URLs → credentials masked
- Passwords → `[REDACTED]`

**Example**:
```typescript
sanitizeString('Error for user@example.com with key sk_live_abc123')
// Returns: "Error for [EMAIL] with key sk_live_[REDACTED]"
```

### `sanitizeContext(context: LogContext): LogContext`

Recursively sanitizes all string values in context object.

**Field-based redaction**: Removes values for keys containing:
- `password`, `passwd`, `pwd`
- `apiKey`, `api_key`, `token`
- `email`, `phone`, `ssn`
- `secret`, `credential`, `authorization`

**Example**:
```typescript
sanitizeContext({
  userEmail: 'john@example.com',
  apiKey: 'sk_live_abc123',
  errorMessage: 'Invalid token'
})
// Returns:
{
  userEmail: '[EMAIL]',
  apiKey: 'sk_live_[REDACTED]',
  errorMessage: 'Invalid token'  // no sensitive pattern detected
}
```

### `truncateContext(context: LogContext, maxSize: number): LogContext`

Truncates context to fit within size limit (default 1KB).

**Strategy**:
1. Remove optional fields (duration, retryAttempt)
2. Truncate large string arrays (keep first 10 items)
3. Add `_truncated: true` flag if modified

**Example**:
```typescript
truncateContext({
  validationErrors: ['Error 1', 'Error 2', ..., 'Error 50']  // 2KB
}, 1024)
// Returns:
{
  validationErrors: ['Error 1', ..., 'Error 10'],
  _truncated: true,
  _originalSize: 2048
}
```

### `inferErrorType(message: string, context: LogContext): string`

Determines `error_type` category based on message and context.

**Rules**:
- Message contains "database", "supabase", "postgres" → `db_error`
- Message contains "email", "resend" → `email_error`
- Message contains "validation", "invalid" → `validation_error`
- Context has `missingVar` → `config_error`
- Message contains "cold start" → `cold_start`
- Default → `system_error`

**Example**:
```typescript
inferErrorType('Database connection timeout', { errorCode: 'ETIMEDOUT' })
// Returns: "db_error"

inferErrorType('Invalid email format', { validationErrors: [...] })
// Returns: "validation_error"
```

### `generateRequestId(): string`

Generates UUID v4 for request correlation using Web Crypto API.

**Implementation**: `crypto.randomUUID()`

**Example**: `"a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6"`

### `safeStringify(obj: unknown): string`

Safely serializes object to JSON, handling circular references and non-serializable objects.

**Fallback**: Returns `{ error: 'Failed to serialize context' }` if serialization fails.

**Example**:
```typescript
const circular = { a: 1 };
circular.self = circular;

safeStringify(circular)
// Returns: '{"error":"Failed to serialize context","errorType":"TypeError"}'
```

---

## Error Handling Guarantees

### Never Throws
All logging functions are wrapped in try-catch. If ANY error occurs (circular reference, out of memory, invalid input), the function:

1. Falls back to basic `console.error(message)`
2. Continues execution without crashing serverless function
3. Does NOT retry (to prevent infinite loops)

**Example**:
```typescript
try {
  // Main logging logic
} catch (logError) {
  // Fallback to basic console output
  console.error(`[LOGGER FAILED] ${message}`);
}
```

### Synchronous Execution
All logging operations are **synchronous** - no async/await, no promises. This guarantees:

- ✅ Logs written before function returns
- ✅ No orphaned async operations (research.md section 1)
- ✅ No risk of log loss on early function termination
- ✅ Predictable performance (<5ms)

### Fail-Fast Configuration
Logger utility itself requires **zero configuration**. It will never fail due to missing environment variables (those failures are LOGGED, not thrown).

**Environment Variables** (read only for context, not required for logging):
- `NODE_ENV` → determines `environment` field (defaults to `"production"`)
- No other env vars required by logger

---

## Performance Characteristics

Based on research.md section 3 findings:

| Operation | Overhead | Notes |
|-----------|----------|-------|
| UUID generation | ~0.1ms | `crypto.randomUUID()` |
| Sanitization (pattern matching) | ~0.5ms | 7 regex patterns per string |
| JSON serialization (1KB context) | ~0.5ms | Native `JSON.stringify` |
| Console output | ~0.1ms | Synchronous write to stdout/stderr |
| **Total per log call** | **~1-2ms** | Well within <5ms budget |

**Optimization Notes**:
- No lazy evaluation needed (overhead is minimal)
- No sampling needed (low-traffic site, ~10-100 requests/day)
- No external dependencies (zero bundle impact)

---

## Usage Patterns

### Pattern 1: Database Error Logging

```typescript
import type { APIRoute } from 'astro';
import { logError } from '@utils/logger';
import { supabase } from '@utils/supabaseClient';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();

  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('leads')
      .insert(body);

    if (error) {
      const duration = Date.now() - startTime;

      logError(
        `Database insert failed: ${error.message}`,
        {
          action: 'insert_lead',
          duration,
          errorCode: error.code,
          affectedResource: 'leads',
          httpStatus: 500
        },
        '/api/submit-lead'
      );

      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // Unexpected error
    logError(
      `Unhandled error in /api/submit-lead: ${error.message}`,
      {
        action: 'submit_lead',
        duration: Date.now() - startTime,
        httpStatus: 500
      },
      '/api/submit-lead'
    );

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### Pattern 2: Validation Error Logging

```typescript
import { z } from 'zod';
import { logWarn } from '@utils/logger';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
});

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const result = schema.safeParse(body);

  if (!result.success) {
    const errors = result.error.errors.map(e => `${e.path}: ${e.message}`);

    logWarn(
      'Request validation failed',
      {
        action: 'validate_request',
        duration: 1,
        errorCode: 'VALIDATION_ERROR',
        validationErrors: errors.slice(0, 10),  // First 10 only
        httpStatus: 400
      },
      '/api/submit-lead'
    );

    return new Response(
      JSON.stringify({ error: 'Invalid input', details: errors }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Continue with valid data...
};
```

### Pattern 3: Email Error Logging

```typescript
import { Resend } from 'resend';
import { logError, logWarn } from '@utils/logger';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

async function sendNotificationEmail(leadData: any) {
  const startTime = Date.now();

  try {
    const { data, error } = await resend.emails.send({
      from: import.meta.env.RESEND_FROM_EMAIL,
      to: import.meta.env.NOTIFICATION_EMAIL,
      subject: 'New consultation request',
      html: `<p>New lead: ${leadData.name}</p>`
    });

    if (error) {
      const duration = Date.now() - startTime;

      if (error.statusCode === 429) {
        // Rate limit - WARN level (transient)
        logWarn(
          'Email service rate limit reached',
          {
            action: 'send_notification',
            duration,
            errorCode: '429',
            retryAttempt: 1,
            affectedResource: '[ADMIN]'
          },
          '/api/submit-lead'
        );
      } else {
        // Permanent failure - ERROR level
        logError(
          `Email service error: ${error.message}`,
          {
            action: 'send_notification',
            duration,
            errorCode: error.name,
            affectedResource: '[ADMIN]',
            httpStatus: 200  // API succeeded, email failed
          },
          '/api/submit-lead'
        );
      }
    }
  } catch (error) {
    logError(
      `Unexpected email error: ${error.message}`,
      {
        action: 'send_notification',
        duration: Date.now() - startTime,
        httpStatus: 200
      },
      '/api/submit-lead'
    );
  }
}
```

### Pattern 4: Environment Validation Logging

```typescript
import { logError, logInfo } from '@utils/logger';

export const prerender = false;

let envValidated = false;

export const POST: APIRoute = async ({ request }) => {
  if (!envValidated) {
    const requiredVars = [
      'SUPABASE_URL',
      'SUPABASE_SERVICE_KEY',
      'RESEND_API_KEY',
      'RESEND_FROM_EMAIL',
      'NOTIFICATION_EMAIL'
    ];

    const missing = requiredVars.filter(v => !import.meta.env[v]);

    if (missing.length > 0) {
      // Log each missing variable separately
      missing.forEach(varName => {
        logError(
          `Missing required environment variable: ${varName}`,
          {
            action: 'validate_env',
            duration: 1,
            missingVar: varName,
            setupInstructions: `Add ${varName} to Vercel environment variables`
          },
          '/api/submit-lead'
        );
      });

      return new Response(
        JSON.stringify({ error: 'Server misconfiguration' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // All env vars present - log success
    logInfo(
      'Cold start: environment variables validated successfully',
      {
        action: 'validate_env',
        duration: 1,
        validatedVars: requiredVars
      },
      '/api/submit-lead'
    );

    envValidated = true;
  }

  // Process request...
};
```

---

## Testing

### Unit Test Scenarios

#### Test 1: Basic log entry output
```typescript
import { logError } from '@utils/logger';

// Mock console.error to capture output
const originalError = console.error;
let capturedOutput = '';
console.error = (msg: string) => { capturedOutput = msg; };

logError('Test error', { action: 'test' }, '/api/test');

// Verify JSON structure
const parsed = JSON.parse(capturedOutput);
expect(parsed.level).toBe('ERROR');
expect(parsed.message).toBe('Test error');
expect(parsed.error_type).toBe('system_error');  // inferred

console.error = originalError;
```

#### Test 2: Sensitive data sanitization
```typescript
logError(
  'Failed for user@example.com with key sk_live_abc123',
  { apiKey: 'sk_test_xyz789' },
  '/api/test'
);

// Captured output should NOT contain:
expect(capturedOutput).not.toContain('user@example.com');
expect(capturedOutput).not.toContain('sk_live_abc123');
expect(capturedOutput).not.toContain('sk_test_xyz789');

// Should contain redacted versions:
expect(capturedOutput).toContain('[EMAIL]');
expect(capturedOutput).toContain('[REDACTED]');
```

#### Test 3: Context truncation
```typescript
const largeContext = {
  validationErrors: Array(100).fill('Error message that is quite long'),
  additionalData: 'x'.repeat(2000)
};

logError('Test', largeContext, '/api/test');

const parsed = JSON.parse(capturedOutput);
expect(JSON.stringify(parsed.context).length).toBeLessThan(1024);
expect(parsed.context._truncated).toBe(true);
```

#### Test 4: Circular reference handling
```typescript
const circular: any = { name: 'test' };
circular.self = circular;

// Should not throw
expect(() => {
  logError('Test', circular, '/api/test');
}).not.toThrow();

// Should log fallback JSON
const parsed = JSON.parse(capturedOutput);
expect(parsed.context.error).toContain('Failed to serialize');
```

### Integration Test: Vercel Dashboard Verification

1. Deploy code with logger utility
2. Trigger API errors (database failure, validation error, email error)
3. Open Vercel Dashboard → Logs
4. Verify structured JSON logs appear within 30 seconds
5. Verify logs filterable by `error_type` field
6. Verify no sensitive data visible in logs

---

## Security Considerations

### Data Leakage Prevention

**Automatic protections**:
- ✅ Pattern-based sanitization catches emails, API keys, phone numbers
- ✅ Field-based redaction removes values for sensitive key names
- ✅ Message truncation prevents accidental logging of large payloads

**Developer responsibilities**:
- ⚠️ Do NOT log raw request bodies (may contain PII)
- ⚠️ Do NOT log full database records (use IDs only)
- ⚠️ Do NOT log authentication tokens or session IDs

### GDPR Compliance

**Built-in compliance**:
- ✅ All user identifiers pseudonymized (hashed)
- ✅ No direct PII logged (emails, phones redacted)
- ✅ Logs automatically retained per Vercel plan (30-60 days)
- ✅ Right to erasure: pseudonymized logs remain non-identifiable

**Verification method** (from spec.md SC-003):
```bash
# Export 100 production logs, scan for PII patterns
grep -E 'sk_live_\w+' logs.txt  # Should return 0 matches
grep -E '\b[\w\.-]+@[\w\.-]+\.\w+\b' logs.txt  # Should return 0 matches
grep -E '\+?\d{10,}' logs.txt  # Should return 0 matches
```

---

## Changelog

### Version 1.0.0 (2025-11-23)
- Initial API design based on research findings
- Three log level functions: `logError`, `logWarn`, `logInfo`
- Automatic sanitization and truncation
- Zero dependencies (native console API only)
- Performance budget: <5ms per call

---

## Next Steps

**Phase 1 (Design) Remaining**:
1. ✅ `data-model.md` - LogEntry entity schema (COMPLETE)
2. ✅ `contracts/logger-api.md` (this file) - COMPLETE
3. ⏳ `quickstart.md` - Developer integration guide (NEXT)
4. ⏳ Agent context update - Add logging patterns to CLAUDE.md

**Phase 2 (Implementation)**:
- Generate detailed tasks via `/speckit.tasks` command
- Implement `src/utils/logger.ts` utility
- Integrate into `/api/submit-lead` endpoint
- Manual testing in Vercel Dashboard
- Performance validation (Speed Insights)
