# Quickstart Guide: Server-Side Error Logging

**Feature**: 011-server-error-logging
**Date**: 2025-11-23
**Audience**: Developers integrating the logger utility into Astro serverless functions

---

## Overview

This guide shows you how to add production-ready structured logging to your Vercel serverless functions in 5 minutes.

**What you'll learn**:
- How to import and use the logger utility
- When to use ERROR vs WARN vs INFO levels
- How to log database errors, validation failures, and email errors
- How to view logs in Vercel Dashboard
- Common troubleshooting scenarios

**Prerequisites**:
- Existing Astro project with Vercel adapter (`output: 'hybrid'` or `output: 'server'`)
- At least one API endpoint in `src/pages/api/`
- Vercel deployment (local or production)

---

## Installation

No installation needed! The logger utility uses only native Node.js APIs (zero dependencies).

**File created by implementation**: `src/utils/logger.ts`

**TypeScript path alias** (already configured in `tsconfig.json`):
```json
{
  "compilerOptions": {
    "paths": {
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

---

## Basic Usage

### Step 1: Import the Logger

```typescript
import { logError, logWarn, logInfo } from '@utils/logger';
```

### Step 2: Log an Error

```typescript
import type { APIRoute } from 'astro';
import { logError } from '@utils/logger';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Your API logic here
    const result = await someOperation();

    if (!result.success) {
      logError(
        'Operation failed: database timeout',
        {
          action: 'some_operation',
          duration: 1500,
          errorCode: 'ETIMEDOUT'
        },
        '/api/your-endpoint'
      );

      return new Response(
        JSON.stringify({ error: 'Operation failed' }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    logError(
      `Unexpected error: ${error.message}`,
      { action: 'some_operation' },
      '/api/your-endpoint'
    );

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
};
```

### Step 3: View Logs in Vercel Dashboard

1. Open [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (e.g., `zhulova-com`)
3. Go to **Logs** tab
4. Filter by:
   - **Function**: Select your API endpoint
   - **Level**: Error, Warn, or All
   - **Search**: Use JSON fields like `"error_type":"db_error"`

**Expected output**:
```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/your-endpoint",
  "environment": "production",
  "requestId": "a1b2c3d4-...",
  "level": "ERROR",
  "message": "Operation failed: database timeout",
  "error_type": "db_error",
  "context": {
    "action": "some_operation",
    "duration": 1500,
    "errorCode": "ETIMEDOUT"
  }
}
```

---

## Common Use Cases

### Use Case 1: Database Errors (Supabase)

**Scenario**: Database insert/query fails due to connection timeout, RLS policy, or invalid data.

**Code**:
```typescript
import type { APIRoute } from 'astro';
import { logError } from '@utils/logger';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const startTime = Date.now();
  const body = await request.json();

  const { data, error } = await supabase
    .from('leads')
    .insert({
      name: body.name,
      email: body.email,
      message: body.message
    });

  if (error) {
    const duration = Date.now() - startTime;

    logError(
      `Database insert failed: ${error.message}`,
      {
        action: 'insert_lead',
        duration,
        errorCode: error.code,         // Supabase error code (e.g., "PGRST301")
        affectedResource: 'leads',      // Table name
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
    JSON.stringify({ success: true, id: data[0].id }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
```

**What gets logged**:
- ✅ Error message from Supabase
- ✅ Supabase error code (for debugging)
- ✅ Operation duration (detect slow queries)
- ✅ Affected table name
- ❌ **NOT** logged: User PII (email sanitized automatically)

---

### Use Case 2: Validation Errors (Zod)

**Scenario**: User submits invalid data, Zod schema validation fails.

**Code**:
```typescript
import { z } from 'zod';
import { logWarn } from '@utils/logger';

const LeadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/, 'Invalid phone format'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  const result = LeadSchema.safeParse(body);

  if (!result.success) {
    // Extract validation errors
    const errors = result.error.errors.map(e => `${e.path.join('.')}: ${e.message}`);

    logWarn(
      'Request validation failed',
      {
        action: 'validate_request',
        duration: 1,
        errorCode: 'VALIDATION_ERROR',
        validationErrors: errors.slice(0, 10),  // Log first 10 errors only
        httpStatus: 400
      },
      '/api/submit-lead'
    );

    return new Response(
      JSON.stringify({
        error: 'Validation failed',
        details: errors
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Continue with valid data...
};
```

**Why WARN level?**
- User error (invalid input), not server failure
- Helps identify common validation issues for UX improvements
- Not critical (user can retry with correct data)

---

### Use Case 3: Email Service Errors (Resend)

**Scenario**: Email delivery fails due to rate limit, invalid sender, or API downtime.

**Code**:
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
      subject: `New consultation request from ${leadData.name}`,
      html: `
        <h2>New Lead Submission</h2>
        <p><strong>Name:</strong> ${leadData.name}</p>
        <p><strong>Email:</strong> ${leadData.email}</p>
        <p><strong>Message:</strong> ${leadData.message}</p>
      `
    });

    if (error) {
      const duration = Date.now() - startTime;

      // Distinguish transient vs permanent failures
      if (error.statusCode === 429) {
        // Rate limit - WARN (transient, will retry)
        logWarn(
          'Email service rate limit reached, will retry',
          {
            action: 'send_notification',
            duration,
            errorCode: '429',
            retryAttempt: 1,
            affectedResource: '[ADMIN]'  // Anonymized recipient
          },
          '/api/submit-lead'
        );
      } else {
        // Permanent error - ERROR (requires fix)
        logError(
          `Email service error: ${error.message}`,
          {
            action: 'send_notification',
            duration,
            errorCode: error.name,
            affectedResource: '[ADMIN]',
            httpStatus: 200  // API succeeded, email failed separately
          },
          '/api/submit-lead'
        );
      }
    }
  } catch (error) {
    // Unexpected error
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

// In your API endpoint
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();

  // Save to database first
  const { data, error } = await supabase.from('leads').insert(body);

  if (error) {
    // Log database error (see Use Case 1)
    return new Response(JSON.stringify({ error: 'Failed to save' }), { status: 500 });
  }

  // Send email notification (fire and AWAIT - don't forget!)
  await sendNotificationEmail(body);

  // Return success even if email fails (lead is saved)
  return new Response(
    JSON.stringify({ success: true }),
    { status: 200 }
  );
};
```

**Critical**: Always `await` email operations! (See research.md section 1: "Unawaited async operations cause log loss")

---

### Use Case 4: Missing Environment Variables

**Scenario**: Required env var is missing on cold start (RESEND_API_KEY, SUPABASE_URL, etc.)

**Code**:
```typescript
import { logError, logInfo } from '@utils/logger';

export const prerender = false;

// Module-level flag to track if env vars validated
let envValidated = false;

export const POST: APIRoute = async ({ request }) => {
  // Run once per cold start
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
      // Log each missing variable
      missing.forEach(varName => {
        logError(
          `Missing required environment variable: ${varName}`,
          {
            action: 'validate_env',
            duration: 1,
            missingVar: varName,
            setupInstructions: `Add ${varName} to Vercel → Settings → Environment Variables`
          },
          '/api/submit-lead'
        );
      });

      return new Response(
        JSON.stringify({
          error: 'Server misconfiguration',
          details: 'Required environment variables missing'
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // All env vars present - log success (optional, use INFO sparingly)
    logInfo(
      `Cold start: validated ${requiredVars.length} environment variables`,
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

**Why log config errors?**
- Helps diagnose deployment issues quickly
- Provides clear fix instructions in log message
- Catches misconfigurations before they affect users

---

## Log Level Decision Tree

Use this flowchart to decide which log level to use:

```
Is the operation completely broken?
├─ YES → ERROR
│  └─ Examples: Database connection failed, missing env var, unhandled exception
│
└─ NO → Is functionality degraded but working?
   ├─ YES → WARN
   │  └─ Examples: Rate limit reached (will retry), validation error, fallback triggered
   │
   └─ NO → Is this an important operational event?
      ├─ YES → INFO (use sparingly!)
      │  └─ Examples: Cold start, env validation success, feature flag toggle
      │
      └─ NO → Don't log (avoid noise!)
         └─ Examples: Successful operations, routine processing
```

**Golden Rule**: Log only what helps debugging. Avoid logging successful operations.

---

## Viewing Logs in Vercel Dashboard

### Access Logs

1. **Vercel Dashboard** → Select project → **Logs** tab
2. Logs appear within **5-30 seconds** of event (near real-time)

### Filter Logs

**By log level**:
- Click **Error** to show only ERROR-level logs
- Click **Warn** to show ERROR + WARN logs
- Click **All** to show all levels

**By function**:
- Dropdown: Select specific API endpoint (e.g., `/api/submit-lead`)

**By search (JSON fields)**:
```
"error_type":"db_error"          # Database errors only
"action":"submit_lead"           # Specific action
"errorCode":"429"                # Rate limit errors
"affectedResource":"leads"       # Errors affecting leads table
```

**By time range**:
- Last 1 hour, 24 hours, 7 days, or custom range

### Interpret Log Entries

**Example log entry**:
```json
{
  "timestamp": "2025-11-23T14:30:00.123Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6",
  "level": "ERROR",
  "message": "Database insert failed: connection timeout after 10s",
  "error_type": "db_error",
  "context": {
    "action": "insert_lead",
    "duration": 10500,
    "errorCode": "ETIMEDOUT",
    "affectedResource": "leads",
    "httpStatus": 500
  }
}
```

**What each field tells you**:
- `timestamp`: When error occurred (UTC timezone)
- `endpoint`: Which API route failed
- `requestId`: Unique ID to correlate multiple logs from same request
- `level`: Severity (ERROR requires immediate attention)
- `message`: **Start here** - human-readable error description
- `error_type`: Category for filtering (db_error, email_error, validation_error)
- `context.action`: Business operation that failed (insert_lead, send_email)
- `context.duration`: How long operation took before failing (10.5 seconds)
- `context.errorCode`: Service-specific code (Supabase, Resend, etc.)
- `context.httpStatus`: HTTP status code returned to user

**Debugging workflow**:
1. Read `message` - what failed?
2. Check `context.errorCode` - why did it fail?
3. Check `context.duration` - was it a timeout?
4. Check `context.affectedResource` - which table/service?
5. Search for `requestId` to see all logs from that request
6. Check timestamp for patterns (does error occur at specific times?)

---

## Troubleshooting

### Problem: Logs not appearing in Vercel Dashboard

**Possible causes**:

1. **Logs buffered but not flushed** (function returned too early)
   - **Solution**: Always `await` all async operations before returning response
   ```typescript
   // ❌ BAD: Email logs may be lost
   supabase.from('leads').insert(data);  // Fire-and-forget
   return new Response(JSON.stringify({ success: true }));

   // ✅ GOOD: Wait for completion
   await supabase.from('leads').insert(data);
   return new Response(JSON.stringify({ success: true }));
   ```

2. **Function crashed before logging**
   - **Solution**: Wrap entire handler in try-catch with logging
   ```typescript
   export const POST: APIRoute = async ({ request }) => {
     try {
       // Your logic here
     } catch (error) {
       logError(`Unhandled error: ${error.message}`, { action: 'handler' }, '/api/endpoint');
       return new Response(JSON.stringify({ error: 'Internal error' }), { status: 500 });
     }
   };
   ```

3. **Wrong log level filter in dashboard**
   - **Solution**: Click **All** to show ERROR + WARN + INFO levels

4. **Looking at wrong deployment**
   - **Solution**: Ensure you're viewing logs for correct environment (production vs preview)

### Problem: Sensitive data appearing in logs

**Examples**: Email addresses, API keys, phone numbers visible in log output

**Cause**: Sanitization patterns not covering all cases

**Solution**: Add custom redaction patterns to `sanitizeString()` function in `src/utils/logger.ts`

**Verify after fix**:
```bash
# Export logs, scan for PII
grep -i 'user@example.com' vercel-logs.json  # Should return 0 matches
grep -E 'sk_live_\w+' vercel-logs.json        # Should return 0 matches
```

### Problem: Logs truncated (missing context fields)

**Cause**: Context object exceeds 1KB size limit

**Solution**: Log only essential debugging info
```typescript
// ❌ BAD: Logging entire request body (may be >1KB)
logError('Validation failed', { requestBody: body }, '/api/endpoint');

// ✅ GOOD: Log only failed fields
logError('Validation failed', {
  failedFields: ['email', 'phone'],
  validationErrors: errors.slice(0, 10)  // First 10 only
}, '/api/endpoint');
```

### Problem: Performance degradation after adding logging

**Symptoms**: API response time increased >5ms at p95

**Diagnosis**:
1. Check Vercel Speed Insights → API response times
2. Compare before/after logging deployment

**Possible causes**:

1. **Too many log calls per request**
   - **Solution**: Limit to 3-5 log calls per request (start, error, end)
   - Remove INFO-level logs in hot paths

2. **Logging inside loops**
   - **Solution**: Never log inside loops (O(n) overhead)
   ```typescript
   // ❌ BAD: Logs 100 times
   items.forEach(item => {
     logInfo('Processing item', { item }, '/api/endpoint');
   });

   // ✅ GOOD: Log once with summary
   logInfo('Processing items', { count: items.length }, '/api/endpoint');
   ```

3. **Logging large objects**
   - **Solution**: Truncate before logging
   ```typescript
   // ❌ BAD: Logging 100KB object
   logError('Failed', { hugeObject }, '/api/endpoint');

   // ✅ GOOD: Log only relevant fields
   logError('Failed', {
     objectId: hugeObject.id,
     objectType: hugeObject.type,
     errorField: hugeObject.errorDetails
   }, '/api/endpoint');
   ```

---

## Best Practices

### ✅ DO

1. **Log errors, not successes**
   ```typescript
   // ✅ GOOD
   if (error) {
     logError('Database insert failed', { errorCode: error.code }, '/api/endpoint');
   }

   // ❌ BAD (creates log noise)
   logInfo('Database insert succeeded', { id: data.id }, '/api/endpoint');
   ```

2. **Always await async operations**
   ```typescript
   // ✅ GOOD
   await supabase.from('leads').insert(data);
   await sendEmail(data);
   return new Response(JSON.stringify({ success: true }));
   ```

3. **Include operation duration**
   ```typescript
   const startTime = Date.now();
   // ... operation ...
   const duration = Date.now() - startTime;
   logError('Operation failed', { duration }, '/api/endpoint');
   ```

4. **Use specific error types**
   ```typescript
   // Logger infers error_type from message
   logError('Database connection timeout', { ... });      // → "db_error"
   logError('Email delivery failed', { ... });            // → "email_error"
   logError('Validation failed', { ... });                // → "validation_error"
   logError('Missing RESEND_API_KEY', { ... });           // → "config_error"
   ```

5. **Anonymize user data**
   ```typescript
   // ✅ GOOD (automatic sanitization)
   logError('Failed for user', {
     userEmail: 'john@example.com'  // Automatically becomes [EMAIL]
   }, '/api/endpoint');

   // ✅ EVEN BETTER (don't include email at all)
   logError('Failed for user', {
     userId: hashUserId(user.id)  // Pseudonymized ID
   }, '/api/endpoint');
   ```

### ❌ DON'T

1. **Don't log inside loops**
   ```typescript
   // ❌ BAD: O(n) logging overhead
   items.forEach(item => logInfo('Processing', { item }));

   // ✅ GOOD: Single log with summary
   logInfo('Processed items', { count: items.length });
   ```

2. **Don't log raw request bodies**
   ```typescript
   // ❌ BAD: May contain PII, API keys
   logError('Request failed', { body: await request.json() });

   // ✅ GOOD: Log only relevant fields
   logError('Request failed', { action: 'submit_lead', hasEmail: !!body.email });
   ```

3. **Don't use console.log/error directly**
   ```typescript
   // ❌ BAD: Unstructured, no sanitization
   console.error('Database error:', error);

   // ✅ GOOD: Structured, sanitized, filterable
   logError(`Database error: ${error.message}`, {
     errorCode: error.code
   }, '/api/endpoint');
   ```

4. **Don't log sensitive config**
   ```typescript
   // ❌ BAD: Leaks API key
   logError('Resend error', {
     apiKey: import.meta.env.RESEND_API_KEY
   });

   // ✅ GOOD: Omit sensitive values
   logError('Resend error', {
     hasApiKey: !!import.meta.env.RESEND_API_KEY,
     errorCode: error.code
   });
   ```

5. **Don't over-log (avoid INFO in production)**
   ```typescript
   // ❌ BAD: Creates noise, no debugging value
   logInfo('Request received', { endpoint: '/api/submit-lead' });
   logInfo('Validating request', { ... });
   logInfo('Saving to database', { ... });
   logInfo('Sending email', { ... });
   logInfo('Request completed', { ... });

   // ✅ GOOD: Log only failures
   if (error) {
     logError('Database save failed', { ... });
   }
   ```

---

## Performance Checklist

Before deploying logging to production, verify:

- [ ] **<3 log calls per request** (start, error, end only)
- [ ] **No logging inside loops** (O(n) overhead)
- [ ] **Context objects <1KB** (large objects truncated)
- [ ] **All async operations awaited** (prevents log loss)
- [ ] **No INFO-level logs in hot paths** (ERROR/WARN only)
- [ ] **API response time increase <5ms at p95** (Vercel Speed Insights)

**Measurement**: Check Speed Insights before/after logging deployment
```
Before: p95 = 150ms
After:  p95 = 152ms  ✅ (+2ms, acceptable)
After:  p95 = 160ms  ❌ (+10ms, investigate)
```

---

## Security Checklist

Before deploying logging to production, verify:

- [ ] **No email addresses in logs** (grep for `@`)
- [ ] **No API keys in logs** (grep for `sk_`, `pk_`, `re_`)
- [ ] **No phone numbers in logs** (grep for `+1`, `\d{10}`)
- [ ] **No passwords/tokens in logs** (grep for `password`, `token`, `Bearer`)
- [ ] **No raw request bodies logged** (may contain PII)
- [ ] **User IDs pseudonymized** (hashed, not raw)

**Verification method** (from spec.md SC-003):
```bash
# Export 100 production logs from Vercel
# Run these commands to detect PII leaks:

grep -E 'sk_live_\w+' logs.json          # API keys
grep -E '\b[\w\.-]+@[\w\.-]+\.\w+\b' logs.json  # Emails
grep -E '\+?\d{10,}' logs.json           # Phone numbers

# All commands should return 0 matches
```

---

## Example: Full Integration in `/api/submit-lead`

**Complete example** showing all patterns in one endpoint:

```typescript
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { logError, logWarn, logInfo } from '@utils/logger';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Environment validation (once per cold start)
let envValidated = false;

// Zod schema for validation
const LeadSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9]{10,15}$/),
  message: z.string().min(10)
});

// Initialize clients
const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const endpoint = '/api/submit-lead';
  const startTime = Date.now();

  try {
    // Step 1: Validate environment (cold start only)
    if (!envValidated) {
      const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'RESEND_API_KEY'];
      const missing = requiredVars.filter(v => !import.meta.env[v]);

      if (missing.length > 0) {
        missing.forEach(varName => {
          logError(`Missing required environment variable: ${varName}`, {
            action: 'validate_env',
            missingVar: varName,
            setupInstructions: `Add ${varName} to Vercel environment variables`
          }, endpoint);
        });

        return new Response(
          JSON.stringify({ error: 'Server misconfiguration' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      logInfo('Cold start: environment validated', {
        action: 'validate_env',
        duration: Date.now() - startTime
      }, endpoint);

      envValidated = true;
    }

    // Step 2: Parse and validate request
    const body = await request.json();
    const validationResult = LeadSchema.safeParse(body);

    if (!validationResult.success) {
      const errors = validationResult.error.errors.map(e =>
        `${e.path.join('.')}: ${e.message}`
      );

      logWarn('Request validation failed', {
        action: 'validate_request',
        duration: Date.now() - startTime,
        errorCode: 'VALIDATION_ERROR',
        validationErrors: errors.slice(0, 10),
        httpStatus: 400
      }, endpoint);

      return new Response(
        JSON.stringify({ error: 'Validation failed', details: errors }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const leadData = validationResult.data;

    // Step 3: Save to database
    const { data: dbData, error: dbError } = await supabase
      .from('leads')
      .insert({
        name: leadData.name,
        email: leadData.email,
        phone: leadData.phone,
        message: leadData.message
      })
      .select()
      .single();

    if (dbError) {
      logError(`Database insert failed: ${dbError.message}`, {
        action: 'insert_lead',
        duration: Date.now() - startTime,
        errorCode: dbError.code,
        affectedResource: 'leads',
        httpStatus: 500
      }, endpoint);

      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Step 4: Send email notification
    try {
      const { error: emailError } = await resend.emails.send({
        from: import.meta.env.RESEND_FROM_EMAIL,
        to: import.meta.env.NOTIFICATION_EMAIL,
        subject: `New consultation request from ${leadData.name}`,
        html: `
          <h2>New Lead Submission</h2>
          <p><strong>Name:</strong> ${leadData.name}</p>
          <p><strong>Email:</strong> ${leadData.email}</p>
          <p><strong>Phone:</strong> ${leadData.phone}</p>
          <p><strong>Message:</strong> ${leadData.message}</p>
        `
      });

      if (emailError) {
        if (emailError.statusCode === 429) {
          logWarn('Email rate limit reached', {
            action: 'send_notification',
            duration: Date.now() - startTime,
            errorCode: '429',
            retryAttempt: 1,
            affectedResource: '[ADMIN]'
          }, endpoint);
        } else {
          logError(`Email delivery failed: ${emailError.message}`, {
            action: 'send_notification',
            duration: Date.now() - startTime,
            errorCode: emailError.name,
            affectedResource: '[ADMIN]',
            httpStatus: 200  // API succeeded, email failed
          }, endpoint);
        }
      }
    } catch (emailException) {
      logError(`Unexpected email error: ${emailException.message}`, {
        action: 'send_notification',
        duration: Date.now() - startTime,
        httpStatus: 200
      }, endpoint);
    }

    // Step 5: Return success (even if email failed)
    return new Response(
      JSON.stringify({
        success: true,
        id: dbData.id
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    // Catch-all for unexpected errors
    logError(`Unhandled error in ${endpoint}: ${error.message}`, {
      action: 'submit_lead',
      duration: Date.now() - startTime,
      httpStatus: 500
    }, endpoint);

    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

**What this example demonstrates**:
- ✅ Environment validation on cold start (INFO level)
- ✅ Validation error logging (WARN level)
- ✅ Database error logging (ERROR level)
- ✅ Email error logging (ERROR/WARN based on severity)
- ✅ Catch-all error handler
- ✅ Duration tracking
- ✅ All async operations awaited
- ✅ Return success even if email fails (degraded functionality)

---

## Next Steps

**After integrating logging**:

1. **Test locally**
   ```bash
   npm run dev
   # Trigger errors, check console output for structured JSON logs
   ```

2. **Deploy to Vercel**
   ```bash
   git add src/utils/logger.ts src/pages/api/submit-lead.ts
   git commit -m "feat: add structured error logging"
   git push
   ```

3. **Verify in Vercel Dashboard**
   - Trigger test errors (invalid input, missing env var)
   - Check Logs tab within 30 seconds
   - Verify structured JSON logs appear

4. **Monitor performance**
   - Check Speed Insights before/after deployment
   - Verify API response time increase <5ms at p95

5. **Security audit**
   - Export 100 production logs
   - Run grep commands to check for PII leaks
   - Fix any sanitization gaps

---

## Support

**Questions or issues?**

1. **Check documentation**:
   - [spec.md](./spec.md) - Feature specification
   - [data-model.md](./data-model.md) - LogEntry schema
   - [contracts/logger-api.md](./contracts/logger-api.md) - API reference

2. **Common issues**:
   - See **Troubleshooting** section above

3. **Performance concerns**:
   - See **Performance Checklist** section above

4. **Security concerns**:
   - See **Security Checklist** section above

---

**That's it!** You're now ready to add production-ready logging to your serverless functions. 🎉
