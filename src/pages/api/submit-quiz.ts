import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { logError, logInfo, logWarn } from '@utils/logger';
import { QUESTIONS } from '@utils/quiz/questions';
import { scoreQuiz } from '@utils/quiz/scoring';
import { validateInstagramNick, INSTAGRAM_NOT_FOUND_ERROR } from '@utils/quiz/instagram';
import { checkInstagramNick } from '@utils/quiz/instagramCheck';
import type { InstagramCheckOutcome } from '@utils/quiz/instagramCheck';

// Render on-demand as a Vercel serverless function. In Astro 5 static mode
// endpoints prerender by default, which a POST handler cannot do — without
// this the route 404s in production.
export const prerender = false;

// Environment validation flag (for cold start logging)
let envValidated = false;

const REQUIRED_ENV_VARS = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'NOTIFICATION_EMAIL',
];

const answerSchema = z.object({
  question: z.number().int().min(0).max(11),
  option: z.number().int().min(0).max(3),
});

// Client sends only raw answer indices + handle. Any client-computed score
// fields are stripped by Zod (unknown keys) — the server NEVER trusts them.
const submitQuizSchema = z.object({
  // Canonical bare lowercase nick via the shared validator (ADR-0002 #1/#2)
  instagram: z.string().transform((val, ctx) => {
    const result = validateInstagramNick(val);
    if (!result.valid) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: result.error });
      return z.NEVER;
    }
    return result.nick;
  }),
  answers: z
    .array(answerSchema)
    .length(12, 'Exactly 12 answers are required')
    .refine(
      (answers) => new Set(answers.map((a) => a.question)).size === answers.length,
      'Question indices must be unique'
    ),
});

export const POST: APIRoute = async ({ request }) => {
  const endpoint = '/api/submit-quiz';
  const startTime = Date.now();

  try {
    // Environment validation on cold start (fail-fast, no fallback values)
    if (!envValidated) {
      const missing = REQUIRED_ENV_VARS.filter((varName) => !import.meta.env[varName]);

      if (missing.length > 0) {
        missing.forEach((varName) => {
          logError(`Missing required environment variable: ${varName}`, {
            action: 'validate_env',
            duration: Date.now() - startTime,
            missingVar: varName,
            setupInstructions: `Add ${varName} to Vercel environment variables`,
          }, endpoint);
        });

        return new Response(
          JSON.stringify({ success: false, error: 'Server misconfiguration' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      logInfo(`Cold start: validated ${REQUIRED_ENV_VARS.length} environment variables`, {
        action: 'validate_env',
        duration: Date.now() - startTime,
        validatedVars: REQUIRED_ENV_VARS,
      }, endpoint);

      envValidated = true;
    }

    // Parse request body (malformed JSON is a client error, not a server one)
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      logWarn('Request body is not valid JSON', {
        action: 'validate_request',
        duration: Date.now() - startTime,
        errorCode: 'INVALID_JSON',
        httpStatus: 400,
      }, endpoint);

      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const parsed = submitQuizSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`);

      logWarn('Request validation failed', {
        action: 'validate_request',
        duration: Date.now() - startTime,
        errorCode: 'VALIDATION_ERROR',
        validationErrors: errors.slice(0, 10),
        httpStatus: 400,
      }, endpoint);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'Validation failed',
          details: parsed.error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { instagram, answers } = parsed.data;

    // Best-effort existence check (ADR-0002 #4/#5): fail-open — only a
    // confirmed-missing account rejects; a blocked/timed-out probe (unknown)
    // must never cost a lead. The module never throws, but a rejection here
    // still maps to 'unknown' so the endpoint cannot 5xx on the check.
    const instagramVerified: InstagramCheckOutcome = await checkInstagramNick(
      instagram
    ).catch(() => 'unknown' as const);
    const instagramCheckedAt = new Date().toISOString();

    if (instagramVerified === 'missing') {
      logWarn('Instagram account confirmed missing — submission rejected', {
        action: 'check_instagram',
        duration: Date.now() - startTime,
        errorCode: 'INSTAGRAM_NOT_FOUND',
        httpStatus: 400,
      }, endpoint);

      return new Response(
        JSON.stringify({
          success: false,
          error: 'instagram_not_found',
          message: INSTAGRAM_NOT_FOUND_ERROR,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Resolve category/internal from the canonical questions module and
    // recompute all scores server-side (ADR-0001 #3: client scores are
    // never trusted or read).
    const resolvedAnswers = answers.map(({ question, option }) => {
      const { category, internal } = QUESTIONS[question].options[option];
      return { question, option, category, internal };
    });

    const result = scoreQuiz(resolvedAnswers);

    const row = {
      quiz_slug: 'opora',
      instagram_handle: instagram,
      answers: resolvedAnswers,
      score_internal: result.internal,
      score_pct: result.pct,
      band: result.band,
      result_type: result.resultType,
      instagram_verified: instagramVerified,
      instagram_checked_at: instagramCheckedAt,
      user_agent: request.headers.get('user-agent') || null,
      referrer: request.headers.get('referer') || null,
    };

    // Dual persistence (ADR-0001 #6): DB insert is primary, Resend
    // notification is secondary. Each failure alone is non-fatal — the lead
    // survives through the other channel. Both failing loses the lead → 500.
    let dbOk = false;
    try {
      const supabase = createClient(
        import.meta.env.SUPABASE_URL,
        import.meta.env.SUPABASE_SERVICE_KEY
      );

      const { error: dbError } = await supabase
        .from('quiz_submissions')
        .insert([row])
        .select('id')
        .single();

      if (dbError) {
        logError(`Database insert failed: ${dbError.message}`, {
          action: 'insert_submission',
          duration: Date.now() - startTime,
          errorCode: dbError.code || 'DB_ERROR',
          affectedResource: 'quiz_submissions',
        }, endpoint);
      } else {
        dbOk = true;
      }
    } catch (dbException) {
      const message = dbException instanceof Error ? dbException.message : 'Unknown DB error';
      logError(`Database insert threw: ${message}`, {
        action: 'insert_submission',
        duration: Date.now() - startTime,
        errorCode: 'DB_EXCEPTION',
        affectedResource: 'quiz_submissions',
      }, endpoint);
    }

    let emailOk = false;
    try {
      const resend = new Resend(import.meta.env.RESEND_API_KEY);
      const { error: emailError } = await resend.emails.send({
        from: import.meta.env.RESEND_FROM_EMAIL,
        to: import.meta.env.NOTIFICATION_EMAIL,
        subject: `New quiz submission: @${instagram}`,
        html: `
          <h2>New quiz submission (opora)</h2>
          <p><strong>Instagram:</strong> @${instagram} (${instagramVerified})</p>
          <p><strong>Score:</strong> ${result.pct}%</p>
          <p><strong>Result type:</strong> ${result.resultType}</p>
        `,
      });

      if (emailError) {
        logError(`Email notification failed: ${emailError.message || 'Unknown error'}`, {
          action: 'send_notification',
          duration: Date.now() - startTime,
          errorCode: emailError.name || 'EMAIL_ERROR',
          affectedResource: '[ADMIN]',
        }, endpoint);
      } else {
        emailOk = true;
      }
    } catch (emailException) {
      const message =
        emailException instanceof Error ? emailException.message : 'Unknown email error';
      logError(`Email notification threw: ${message}`, {
        action: 'send_notification',
        duration: Date.now() - startTime,
        errorCode: 'EMAIL_EXCEPTION',
        affectedResource: '[ADMIN]',
      }, endpoint);
    }

    if (!dbOk && !emailOk) {
      logError('Submission lost: both database insert and email notification failed', {
        action: 'submit_quiz',
        duration: Date.now() - startTime,
        errorCode: 'PERSISTENCE_FAILED',
        httpStatus: 500,
      }, endpoint);

      return new Response(
        JSON.stringify({ success: false, error: 'Failed to save submission' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        resultType: result.resultType,
        scorePct: result.pct,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logError(`Unhandled error in ${endpoint}: ${errorMessage}`, {
      action: 'submit_quiz',
      duration: Date.now() - startTime,
      errorCode: error instanceof Error ? error.name : 'UNKNOWN_ERROR',
      httpStatus: 500,
    }, endpoint);

    return new Response(
      JSON.stringify({ success: false, error: 'An unexpected error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
