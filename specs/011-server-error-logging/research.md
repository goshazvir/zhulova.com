# Research: Production Error Logging for Serverless Functions

**Feature**: 011-server-error-logging
**Date**: 2025-11-23
**Purpose**: Resolve technical unknowns for implementing structured error logging in Vercel serverless functions

---

## Research Summary

This document consolidates findings from three research areas:
1. Vercel serverless logging infrastructure behavior
2. OWASP security guidelines for structured logging
3. Performance impact analysis of console logging

**Key Decision**: Use **native console API** (no external dependencies) with **structured JSON output** and **pattern-based sanitization** for sensitive data. This approach meets the <5ms performance budget while ensuring GDPR/OWASP compliance.

---

## 1. Vercel Serverless Logging Infrastructure

### Decision: Use stdout/stderr with JSON formatting

**How Vercel Captures Logs**:
- All `console.log`, `console.warn`, `console.error` output automatically captured via stdout/stderr redirection
- Logs streamed in real-time to Vercel Dashboard → Logs tab
- Each function invocation gets unique `requestId` (automatically added by Vercel infrastructure)
- Metadata enriched: timestamp, HTTP status, domain, user agent, runtime details

**Log Size Limits** (updated 2025):
- Per log line: **256 KB** (previously 4 KB)
- Lines per request: **256 lines**
- Total per request: **1 MB**
- Truncation behavior: Silent truncation if limits exceeded (no error thrown)

**Critical Reliability Issue** ⚠️:
- **Unawaited async operations cause log loss**: If function returns before async tasks complete (Supabase insert, Resend email), logs from those operations may be lost
- **Orphaned task logs misattributed**: Logs from Request A completing during Request B execution get Request B's `requestId`
- **Mitigation**: Always `await` all promises before returning HTTP response

```typescript
// ❌ BAD: Logs may be lost
export const POST: APIRoute = async ({ request }) => {
  console.log('Starting request');
  supabase.from('leads').insert(data); // Fire-and-forget - logs lost!
  return new Response(JSON.stringify({ success: true }));
};

// ✅ GOOD: Logs guaranteed
export const POST: APIRoute = async ({ request }) => {
  console.log('Starting request');
  await supabase.from('leads').insert(data); // Wait for completion
  return new Response(JSON.stringify({ success: true }));
};
```

**Dashboard Filtering Limitations**:
- ✅ Can filter by: log level (error/warn), function name, HTTP status, domain
- ❌ Cannot filter by custom JSON fields (e.g., `error_type`) in native Vercel dashboard
- ✅ Workaround: Third-party integrations (Logflare, Axiom, Better Stack) can parse JSON and filter by custom fields
- **Implication**: Structured JSON logs are still valuable for readability and future integration, even if not immediately queryable

**Request Correlation**:
- Vercel adds `requestId` to log metadata automatically
- **Cannot access `requestId` programmatically** in function code
- **Solution**: Generate our own correlation ID using `crypto.randomUUID()` and include in all log entries

**Rationale**: Native console API is sufficient for zhulova.com's low-traffic consultation form. No need for third-party logging libraries (pino, winston) that add bundle size and complexity.

**Alternatives Considered**:
- ❌ **Pino/Winston**: Adds 20-50KB to bundle, overkill for single endpoint
- ❌ **AWS Lambda Powertools**: Vercel-specific logging is simpler
- ✅ **Native console + structured JSON**: Zero dependencies, automatic Vercel capture

**Sources**: [Vercel Function Logs](https://vercel.com/docs/functions/logs), [Troubleshooting Inconsistent Logs](https://vercel.com/guides/troubleshooting-inconsistent-logs-in-vercel-functions), [Better Stack Vercel Logging Guide](https://betterstack.com/community/guides/logging/platforms/vercel-logging/)

---

## 2. OWASP Security Guidelines & Structured Logging

### Decision: Implement pattern-based sanitization with OWASP-compliant schema

**Log Structure** (OWASP "When, Where, Who, What" framework):

```typescript
interface LogEntry {
  // WHEN
  timestamp: string;              // ISO 8601: "2025-11-23T14:30:00.000Z"

  // WHERE
  endpoint: string;               // "/api/submit-lead"
  environment: string;            // "production" | "staging"

  // WHO
  requestId: string;              // Correlation ID (self-generated)
  userIdHash?: string;            // SHA-256 hash (not raw user ID)

  // WHAT
  level: "ERROR" | "WARN" | "INFO";
  message: string;                // Human-readable description
  error_type: string;             // "validation_error" | "db_error" | "email_error"

  // CONTEXT (sanitized)
  context?: {
    action?: string;              // "submit_lead"
    duration?: number;            // Request duration in ms
    [key: string]: unknown;       // Additional safe context
  };
}
```

**Sensitive Data Patterns to Redact** (OWASP Cheat Sheet):

Must NEVER log:
- ❌ API keys: `/sk_(test|live)_[a-zA-Z0-9]{24,}/g`
- ❌ Emails: `/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}\b/g`
- ❌ Phone numbers: `/(\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g`
- ❌ Passwords: `/(password|passwd|pwd)[\s:=]+[^\s&]+/gi`
- ❌ Database URLs: `/(postgres|mysql|mongodb):\/\/[^:]+:[^@]+@/gi`
- ❌ Bearer tokens: `/Bearer\s+[a-zA-Z0-9\-._~+\/]+=*/gi`
- ❌ Session IDs: `/\b[a-f0-9]{32,}\b/gi`

**Sanitization Strategy**:

```typescript
// Field-based: Redact by key name
const SENSITIVE_KEYS = ['password', 'apiKey', 'token', 'email', 'phone', 'ssn'];

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEYS.some(k => key.toLowerCase().includes(k));
}

// Pattern-based: Redact by regex match
function sanitizeString(str: string): string {
  return str
    .replace(/\b[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]')
    .replace(/sk_(test|live)_[a-zA-Z0-9]{24,}/g, 'sk_$1_[REDACTED]')
    .replace(/Bearer\s+[a-zA-Z0-9\-._~+\/]+=*/gi, 'Bearer [REDACTED]');
}
```

**Log Levels** (OWASP guidance):
- **ERROR**: Operation failed, requires immediate attention (database errors, API failures, missing env vars)
- **WARN**: Potentially harmful situation, degraded functionality (rate limits, retry attempts, fallbacks triggered)
- **INFO**: Normal business events (request received, form submitted successfully) - use sparingly in production

**GDPR/CCPA Compliance**:
- IP addresses are considered PII under GDPR - anonymize if logged: `192.168.1.xxx`
- User IDs must be hashed: `crypto.createHash('sha256').update(userId + SALT).digest('hex').slice(0, 12)`
- Log retention: 30-60 days recommended (Vercel handles automatically per plan tier)
- Right to erasure: Use pseudonymized IDs (hashed) so logs remain non-identifiable after user deletion

**Circular References & Large Objects**:
- Native `JSON.stringify` fails on circular references
- Solution: Use try-catch with fallback: `JSON.stringify({ error: 'Failed to serialize' })`
- Alternative: Use `fast-safe-stringify` (adds 3KB dependency) if circular refs expected
- **Decision**: Stick with native + try-catch (our log contexts are simple objects, circular refs unlikely)

**Rationale**: Pattern-based sanitization catches sensitive data even when developers forget to filter it manually. OWASP-compliant schema ensures logs are useful for debugging while meeting security standards.

**Alternatives Considered**:
- ❌ **Pino redaction**: Requires external dependency, adds bundle size
- ❌ **No sanitization**: Security risk (PII leaks violate GDPR)
- ✅ **Custom pattern matching**: Zero dependencies, flexible, catches dynamic content

**Sources**: [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html), [GDPR Log Management Guide](https://last9.io/blog/gdpr-log-management/), [Pino Redaction Best Practices](https://arrangeactassert.com/posts/pino-redaction-a-simple-solution-to-secure-logging-in-node-js-applications/)

---

## 3. Performance Impact Analysis

### Decision: Console logging overhead is acceptable (<1-3ms for typical use)

**JSON.stringify Performance**:
- Small objects (1KB): **0.1-0.5ms** per stringify
- Medium objects (10KB): **1-3ms** per stringify
- Large objects (>100KB): **10-50ms** - must truncate before logging
- **Conclusion**: Standard error contexts (<10KB) fit well within <5ms budget

**Console Blocking Behavior**:
- `console.log` is **synchronous** when output is a terminal/file
- In serverless (stdout redirected to pipes): **effectively asynchronous** (queued to libuv thread pool)
- **Event loop blocking**: Minimal (~microseconds) for typical log sizes
- **Becomes problematic**: 20+ log calls per request (3-15ms overhead), logging in loops

**Cold Start Impact**:
- Module-level logging (outside handler): Adds to INIT phase
- Each console.log during cold start: **+0.1-0.5ms**
- Heavy logging (10+ lines at startup): **+5-10ms to cold start**
- **Mitigation**: Avoid logging during module initialization, log only inside handler

**Stdout Buffering Risks**:
- Node.js buffers stdout/stderr (8KB-64KB typical)
- **Critical**: Using `process.exit()` may truncate logs before flush
- **Serverless-safe**: Return responses naturally, runtime handles flush automatically
- **For zhulova.com**: Already using proper async/await patterns - no risk

**Performance Budget Breakdown** (for typical API request):

| Operation | Overhead | Count | Total |
|-----------|----------|-------|-------|
| Request start log | 0.5ms | 1 | 0.5ms |
| Error log (if failure) | 1-2ms | 1 | 2ms |
| Request end log | 0.5ms | 1 | 0.5ms |
| **Total** | | | **3ms** ✅ |

**When Overhead Becomes Problematic**:
- ❌ Logging inside loops (O(n) overhead)
- ❌ Logging objects >100KB without truncation
- ❌ 20+ console calls per request
- ❌ High-frequency endpoints (>1000 req/sec) with verbose logging

**Optimization Techniques** (if needed later):
- Lazy evaluation: Only stringify when log level enabled
- Truncation: Cap context size at 1KB before stringify
- Sampling: Log 10% of requests for high-volume endpoints
- Schema-based stringifiers: Use `fast-json-stringify` (2-10x faster) for predefined schemas

**Rationale**: For zhulova.com's low-traffic consultation form (~10-100 submissions/day), console logging overhead is negligible. No optimization needed beyond basic best practices (avoid logging in loops, truncate large objects).

**Alternatives Considered**:
- ❌ **Async logging libraries**: Adds complexity, risk of log loss on function termination
- ❌ **fast-json-stringify**: 2-10x faster but requires schema definition, adds 20KB dependency
- ✅ **Native console + minimal calls**: Simple, predictable performance

**Sources**: [JSON.stringify Performance - Stack Overflow](https://stackoverflow.com/questions/45513821/json-stringify-is-very-slow-for-large-objects), [Node.js Event Loop Docs](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), [AWS Lambda Cold Start Analysis](https://aws.amazon.com/blogs/compute/understanding-and-remediating-cold-starts-an-aws-lambda-perspective/), [Lambda Performance Optimization](https://www.serverless.com/blog/aws-lambda-performance-optimization)

---

## 4. Context7 MCP Integration (Optional)

**Research Result**: Context7 MCP is a documentation/research tool, not a logging service. No direct integration applicable for this feature.

**Relevant Findings**:
- Context7 can query logging best practices (as used in this research)
- No Claude MCP tools exist for log analysis/aggregation (as of 2025-11-23)
- For log analysis: Use third-party tools (Logflare, Axiom, Better Stack) integrated with Vercel

**Decision**: No Context7 integration needed for this feature. Standard web research was sufficient.

---

## Final Architecture Decisions

### Logger Utility Design

**File**: `src/utils/logger.ts` (~100-150 lines)

**API**:
```typescript
export function logError(message: string, context: LogContext): void;
export function logWarn(message: string, context: LogContext): void;
export function logInfo(message: string, context: LogContext): void;
```

**Key Features**:
1. ✅ Structured JSON output (OWASP schema)
2. ✅ Pattern-based sanitization (emails, API keys, passwords)
3. ✅ Automatic correlation ID generation
4. ✅ Try-catch for JSON.stringify failures
5. ✅ Context truncation (max 1KB per entry)
6. ✅ Zero external dependencies

### Integration Points

**Primary**: `/api/submit-lead` endpoint
- Log validation errors (WARN level)
- Log database failures (ERROR level)
- Log email failures (ERROR/WARN level)
- Log missing env vars on cold start (ERROR level)

**Future**: Reusable across all `/api/*` endpoints as they're added

### Performance Validation

**Budget**: <5ms per request
**Expected Overhead**: 1-3ms (3 log calls average)
**Measurement**: Vercel Speed Insights p95 API response time before/after deployment

### Security Validation

**Zero sensitive data in logs**:
- Manual grep: `/sk_live_\w+/`, `/\b[\w\.-]+@[\w\.-]+\.\w+\b/`, `/\+?\d{10,}/`
- Export 100 production logs, scan for patterns
- GDPR compliance: All user identifiers pseudonymized (hashed)

---

## Open Questions (All Resolved)

~~1. How does Vercel capture console output?~~ → Answered: stdout/stderr redirection, automatic capture
~~2. What are log size limits?~~ → Answered: 256KB/line, 256 lines, 1MB total
~~3. Can we filter by custom JSON fields?~~ → Answered: Not in native dashboard, need third-party integration
~~4. What's JSON.stringify performance?~~ → Answered: 0.1-3ms for typical objects (<10KB)
~~5. Does console.log block event loop?~~ → Answered: Minimal blocking (~microseconds) in serverless
~~6. What's OWASP recommendation for log structure?~~ → Answered: "When, Where, Who, What" framework
~~7. How to sanitize sensitive data?~~ → Answered: Pattern-based regex + field-name detection

**All research complete** - ready for Phase 1 (Design)

---

## Next Steps

**Phase 1 Deliverables**:
1. `data-model.md` - LogEntry entity schema with validation rules
2. `contracts/logger-api.md` - Logger utility function signatures
3. `quickstart.md` - Developer integration guide with examples
4. Agent context update - Add "Native Console API Logging" to CLAUDE.md

**Phase 2** (via `/speckit.tasks`):
- Detailed task breakdown for implementation
- Test scenarios for each user story
- Verification steps for success criteria
