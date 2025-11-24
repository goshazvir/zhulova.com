import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';
import { logError, logWarn, logInfo } from '@utils/logger';

// Environment validation flag (for cold start logging)
let envValidated = false;

// Validation schema for consultation form
const leadSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z
    .string()
    .min(7, 'Phone number is required')
    .max(20, 'Phone number is too long')
    .trim()
    .refine(
      (val) => /^[\d\s\-+()]+$/.test(val) && /\d{7,}/.test(val.replace(/\D/g, '')),
      'Please enter a valid phone number'
    ),
  telegram: z
    .string()
    .regex(/^@?[a-zA-Z0-9_]{3,32}$/, 'Telegram handle must be 3-32 characters')
    .optional()
    .or(z.literal(''))
    .transform((val) => {
      if (!val || val === '') return undefined;
      return val.startsWith('@') ? val : `@${val}`;
    }),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
});

export const POST: APIRoute = async ({ request }) => {
  const endpoint = '/api/submit-lead';
  const startTime = Date.now();

  try {
    // T012: Environment validation on cold start
    if (!envValidated) {
      const requiredVars = [
        'RESEND_API_KEY',
        'NOTIFICATION_EMAIL',
        'RESEND_FROM_EMAIL',
        'SUPABASE_URL',
        'SUPABASE_SERVICE_KEY',
      ];

      const missing = requiredVars.filter((varName) => !import.meta.env[varName]);

      if (missing.length > 0) {
        // Log each missing variable
        missing.forEach((varName) => {
          logError(`Missing required environment variable: ${varName}`, {
            action: 'validate_env',
            duration: Date.now() - startTime,
            missingVar: varName,
            setupInstructions: `Add ${varName} to Vercel environment variables`,
          }, endpoint);
        });

        return new Response(
          JSON.stringify({
            success: false,
            error: 'Server misconfiguration',
          }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // All env vars present - log success
      logInfo(`Cold start: validated ${requiredVars.length} environment variables`, {
        action: 'validate_env',
        duration: Date.now() - startTime,
        validatedVars: requiredVars,
      }, endpoint);

      envValidated = true;
    }

    // Validate all required environment variables (fail fast)
    const apiKey = import.meta.env.RESEND_API_KEY;
    const notificationEmail = import.meta.env.NOTIFICATION_EMAIL;
    const fromEmail = import.meta.env.RESEND_FROM_EMAIL;

    // Initialize Resend
    const resend = new Resend(apiKey);

    // Parse request body
    const body = await request.json();

    // T014: Validate input with error logging
    let validatedData;
    try {
      validatedData = leadSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);

        logWarn('Request validation failed', {
          action: 'validate_request',
          duration: Date.now() - startTime,
          errorCode: 'VALIDATION_ERROR',
          validationErrors: errors.slice(0, 10), // First 10 only
          httpStatus: 400,
        }, endpoint);

        return new Response(
          JSON.stringify({
            success: false,
            error: 'Validation failed',
            details: error.errors,
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
      throw error; // Re-throw non-validation errors
    }

    // Send email notification via Resend
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: notificationEmail,
      replyTo: validatedData.email || undefined,
      subject: `New Consultation Request from ${validatedData.name}`,
      html: `
        <h2>New Consultation Request</h2>
        <p><strong>Name:</strong> ${validatedData.name}</p>
        <p><strong>Phone:</strong> ${validatedData.phone}</p>
        ${validatedData.telegram ? `<p><strong>Telegram:</strong> ${validatedData.telegram}</p>` : ''}
        ${validatedData.email ? `<p><strong>Email:</strong> ${validatedData.email}</p>` : ''}
        <p><strong>Source:</strong> consultation_modal</p>
      `,
    });

    if (error) {
      // T021-T023: Enhanced email error logging (User Story 2)
      const emailDuration = Date.now() - startTime;

      // Check if this is a transient failure (rate limit, timeout)
      const isRateLimit = error.statusCode === 429 || error.message?.includes('rate limit');
      const isTimeout = error.message?.includes('timeout') || error.message?.includes('ETIMEDOUT');

      if (isRateLimit) {
        // T022: Rate limit - WARN level (transient failure)
        logWarn('Email service rate limit reached, will retry', {
          action: 'send_notification',
          duration: emailDuration,
          errorCode: '429',
          retryAttempt: 1,
          affectedResource: '[ADMIN]',
        }, endpoint);
      } else if (isTimeout) {
        // T023: Timeout - WARN level (transient failure)
        logWarn(`Email service timeout: ${error.message}`, {
          action: 'send_notification',
          duration: emailDuration,
          errorCode: 'TIMEOUT',
          affectedResource: '[ADMIN]',
        }, endpoint);
      } else {
        // T021: Permanent failure - ERROR level (invalid config, API error)
        logError(`Email delivery failed: ${error.message || 'Unknown error'}`, {
          action: 'send_notification',
          duration: emailDuration,
          errorCode: error.name || 'EMAIL_ERROR',
          affectedResource: '[ADMIN]',
          httpStatus: 500,
        }, endpoint);
      }

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Save to Supabase database
    const { createClient } = await import('@supabase/supabase-js');
    const supabaseUrl = import.meta.env.SUPABASE_URL;
    const supabaseKey = import.meta.env.SUPABASE_SERVICE_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Prepare data for database with metadata
    const leadData = {
      name: validatedData.name,
      phone: validatedData.phone,
      telegram: validatedData.telegram || null,
      email: validatedData.email || null,
      source: 'consultation_modal',
      user_agent: request.headers.get('user-agent') || null,
      referrer: request.headers.get('referer') || null,
    };

    const { data: dbData, error: dbError } = await supabase
      .from('leads')
      .insert([leadData])
      .select('id')
      .single();

    if (dbError) {
      // T013: Database error logging
      logError(`Database insert failed: ${dbError.message}`, {
        action: 'insert_lead',
        duration: Date.now() - startTime,
        errorCode: dbError.code || 'DB_ERROR',
        affectedResource: 'leads',
        httpStatus: 500,
      }, endpoint);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to save lead to database',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent.',
        leadId: dbData.id,
        emailId: data?.id
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // T015: Catch-all error handler with logging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logError(`Unhandled error in ${endpoint}: ${errorMessage}`, {
      action: 'submit_lead',
      duration: Date.now() - startTime,
      errorCode: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
      httpStatus: 500,
    }, endpoint);

    // Handle validation errors (should not reach here due to T014, but keep as fallback)
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Handle other errors
    return new Response(
      JSON.stringify({
        success: false,
        error: 'An unexpected error occurred',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
