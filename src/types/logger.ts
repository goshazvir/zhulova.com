/**
 * TypeScript Types for Server-Side Error Logging
 *
 * Based on OWASP "When, Where, Who, What" logging framework.
 * All types ensure structured, security-compliant log entries.
 *
 * @see data-model.md for detailed field definitions and validation rules
 */

/**
 * Log severity levels following OWASP guidelines.
 *
 * - ERROR: Operation failed completely, requires immediate attention
 * - WARN: Potentially harmful situation, degraded functionality with fallback
 * - INFO: Critical events for operational awareness (use sparingly)
 */
export type LogLevel = 'ERROR' | 'WARN' | 'INFO';

/**
 * Structured context object for debugging information.
 * All fields are optional to allow flexible logging.
 *
 * Common patterns:
 * - Database: { action: 'insert_lead', duration: 234, errorCode: 'PGRST301', affectedResource: 'leads' }
 * - Email: { action: 'send_notification', errorCode: '429', retryAttempt: 1, affectedResource: '[ADMIN]' }
 * - Validation: { action: 'validate_request', validationErrors: ['Invalid email'], httpStatus: 400 }
 * - Config: { action: 'validate_env', missingVar: 'RESEND_API_KEY', setupInstructions: 'Add to Vercel env vars' }
 */
export interface LogContext {
  /**
   * Business action being performed.
   * Examples: "submit_lead", "send_email", "validate_request", "validate_env"
   */
  action?: string;

  /**
   * Operation duration in milliseconds.
   * Useful for detecting slow queries or timeouts.
   */
  duration?: number;

  /**
   * HTTP response status code.
   * Examples: 200 (success), 400 (validation error), 500 (server error)
   */
  httpStatus?: number;

  /**
   * Service-specific error code.
   * Examples: "PGRST301" (Supabase), "429" (Resend rate limit), "ETIMEDOUT" (database timeout)
   */
  errorCode?: string;

  /**
   * Affected resource (table name, recipient, etc).
   * IMPORTANT: Anonymize recipients (use "[ADMIN]" instead of actual email).
   */
  affectedResource?: string;

  /**
   * Retry attempt number for transient failures.
   * Useful for tracking retry patterns (e.g., retryAttempt: 1, 2, 3...).
   */
  retryAttempt?: number;

  /**
   * Validation error messages (first 10 only to prevent oversized logs).
   * Example: ["email: Invalid format", "phone: Too short"]
   */
  validationErrors?: string[];

  /**
   * Missing environment variable name (for config errors).
   * Example: "RESEND_API_KEY"
   */
  missingVar?: string;

  /**
   * Setup instructions for fixing configuration errors.
   * Example: "Add RESEND_API_KEY to Vercel environment variables"
   */
  setupInstructions?: string;

  /**
   * List of validated environment variables (for cold start success logs).
   * Example: ["SUPABASE_URL", "SUPABASE_SERVICE_KEY", "RESEND_API_KEY"]
   */
  validatedVars?: string[];

  /**
   * Additional safe context data.
   * IMPORTANT: All string values are automatically sanitized for PII.
   */
  [key: string]: unknown;
}

/**
 * Complete log entry structure output to stdout/stderr.
 * Follows OWASP "When, Where, Who, What" framework.
 *
 * This interface represents the JSON structure written to console.
 * Do NOT use this directly - use logError(), logWarn(), logInfo() functions instead.
 *
 * @internal
 */
export interface LogEntry {
  // WHEN - Timestamp information
  /**
   * ISO 8601 timestamp with timezone (UTC).
   * Generated automatically using new Date().toISOString().
   * Example: "2025-11-23T14:30:00.000Z"
   */
  timestamp: string;

  // WHERE - Location context
  /**
   * API route path where event occurred.
   * Example: "/api/submit-lead"
   */
  endpoint: string;

  /**
   * Deployment environment.
   * Detected from NODE_ENV, defaults to "production".
   * Values: "production" | "development" | "preview"
   */
  environment: string;

  // WHO - Request correlation
  /**
   * Self-generated correlation ID for request tracing.
   * Generated using crypto.randomUUID() (UUID v4 format).
   * Example: "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6"
   */
  requestId: string;

  /**
   * Pseudonymized user identifier (SHA-256 hash).
   * Optional - only for authenticated requests.
   * Example: "8f4c9a2b..." (12 characters)
   */
  userIdHash?: string;

  // WHAT - Error information
  /**
   * Log severity level.
   * Values: "ERROR" | "WARN" | "INFO"
   */
  level: LogLevel;

  /**
   * Human-readable description of the event.
   * Max 500 characters (automatically truncated).
   * Example: "Database insert failed: connection timeout"
   */
  message: string;

  /**
   * Error category for filtering and aggregation.
   * Values: "db_error" | "email_error" | "validation_error" | "config_error" | "system_error" | "cold_start"
   * Automatically inferred from message and context.
   */
  error_type: string;

  // CONTEXT - Debugging information (sanitized)
  /**
   * Optional structured data for debugging.
   * Max 1KB per entry (automatically truncated).
   * All string values automatically sanitized for PII (emails, API keys, passwords).
   */
  context?: LogContext;
}
