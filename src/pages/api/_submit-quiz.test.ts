/**
 * Unit tests for POST /api/submit-quiz (GEO-17, extended by GEO-24).
 *
 * Written FIRST (TDD) from the acceptance criteria in GEO-17/GEO-24 and the
 * contracts in docs/architecture/quiz-opora.md §7, ADR-0001 #6, ADR-0002.
 * Supabase, Resend and the Instagram existence check are mocked; the
 * live-table round-trip is QA scope. No test contacts real Instagram.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { APIRoute } from 'astro';
import { QUESTIONS } from '@utils/quiz/questions';
import { INSTAGRAM_NOT_FOUND_ERROR } from '@utils/quiz/instagram';

const {
  sendMock,
  singleMock,
  selectMock,
  insertMock,
  fromMock,
  createClientMock,
  checkNickMock,
  logErrorMock,
  logWarnMock,
  logInfoMock,
} = vi.hoisted(() => ({
  sendMock: vi.fn(),
  singleMock: vi.fn(),
  selectMock: vi.fn(),
  insertMock: vi.fn(),
  fromMock: vi.fn(),
  createClientMock: vi.fn(),
  checkNickMock: vi.fn(),
  logErrorMock: vi.fn(),
  logWarnMock: vi.fn(),
  logInfoMock: vi.fn(),
}));

vi.mock('resend', () => ({
  // A class (not an arrow-fn vi.fn) so the route's `new Resend(...)` works.
  Resend: class {
    emails = { send: sendMock };
  },
}));

vi.mock('@supabase/supabase-js', () => ({
  createClient: createClientMock,
}));

vi.mock('@utils/logger', () => ({
  logError: logErrorMock,
  logWarn: logWarnMock,
  logInfo: logInfoMock,
}));

// The real module talks to Instagram — mocked everywhere (ADR-0002 #8)
vi.mock('@utils/quiz/instagramCheck', () => ({
  checkInstagramNick: checkNickMock,
}));

const TEST_ENV: Record<string, string> = {
  SUPABASE_URL: 'https://test-project.supabase.co',
  SUPABASE_SERVICE_KEY: 'service-role-test-key',
  RESEND_API_KEY: 're_test_api_key',
  RESEND_FROM_EMAIL: 'onboarding@test.dev',
  NOTIFICATION_EMAIL: 'founder@test.dev',
};

function stubEnv(overrides: Record<string, string> = {}): void {
  const env = { ...TEST_ENV, ...overrides };
  for (const [key, value] of Object.entries(env)) {
    vi.stubEnv(key, value);
  }
}

async function loadRoute(): Promise<APIRoute> {
  const mod = await import('./submit-quiz');
  return mod.POST;
}

function makeRequest(body: unknown, headers: Record<string, string> = {}): Request {
  return new Request('http://localhost/api/submit-quiz', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

async function callRoute(
  body: unknown,
  headers: Record<string, string> = {}
): Promise<Response> {
  const POST = await loadRoute();
  const request = makeRequest(body, headers);
  // Only `request` is used by the handler; the rest of APIContext is irrelevant here.
  return POST({ request } as never);
}

/**
 * Picks, for every question, the option index whose category is `sebe`
 * (internal 3 on every question) — deterministic 36/36 → 100% → 'sebe'.
 */
const ALL_SEBE_ANSWERS = QUESTIONS.map((q, question) => ({
  question,
  option: q.options.findIndex((o) => o.category === 'sebe'),
}));

/**
 * Option 0 on every question. From questions.ts this yields:
 * internal sum 14 → pct 39 → band '25', dominant external 'mama'
 * (mama/tato/rodyna tied at 2, first-wins order).
 */
const MIXED_ANSWERS = QUESTIONS.map((_, question) => ({ question, option: 0 }));

const VALID_PAYLOAD = { instagram: '@test.handle', answers: ALL_SEBE_ANSWERS };

function insertedRow(): Record<string, unknown> {
  expect(insertMock).toHaveBeenCalledTimes(1);
  const arg = insertMock.mock.calls[0][0];
  return Array.isArray(arg) ? arg[0] : arg;
}

beforeEach(() => {
  vi.resetModules();
  stubEnv();

  logErrorMock.mockReset();
  logWarnMock.mockReset();
  logInfoMock.mockReset();

  sendMock.mockReset().mockResolvedValue({ data: { id: 'email-1' }, error: null });
  checkNickMock.mockReset().mockResolvedValue('exists');
  singleMock.mockReset().mockResolvedValue({ data: { id: 'row-1' }, error: null });
  selectMock.mockReset().mockReturnValue({ single: singleMock });
  insertMock.mockReset().mockReturnValue({ select: selectMock });
  fromMock.mockReset().mockReturnValue({ insert: insertMock });
  createClientMock.mockReset().mockReturnValue({ from: fromMock });
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('POST /api/submit-quiz', () => {
  describe('module contract', () => {
    it('exports prerender = false (Astro 5 static mode requirement)', async () => {
      const mod = await import('./submit-quiz');
      expect(mod.prerender).toBe(false);
    });
  });

  describe('success path (AC1)', () => {
    it('returns 200 with server-computed resultType and scorePct', async () => {
      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toMatchObject({ success: true, resultType: 'sebe', scorePct: 100 });
    });

    it('inserts a row with server-recomputed scores and resolved answers', async () => {
      const response = await callRoute({ instagram: '@test.handle', answers: MIXED_ANSWERS });

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toMatchObject({ success: true, resultType: 'mama', scorePct: 39 });

      const row = insertedRow();
      expect(row).toMatchObject({
        quiz_slug: 'opora',
        instagram_handle: 'test.handle',
        score_internal: 14,
        score_pct: 39,
        band: '25',
        result_type: 'mama',
      });

      const answers = row.answers as Array<Record<string, unknown>>;
      expect(answers).toHaveLength(12);
      // Category/internal resolved server-side from questions.ts
      expect(answers[0]).toEqual({ question: 0, option: 0, category: 'sebe', internal: 3 });
      expect(fromMock).toHaveBeenCalledWith('quiz_submissions');
    });

    it('ignores client-sent score fields (unknown keys stripped)', async () => {
      const tamperedPayload = {
        instagram: '@test.handle',
        answers: MIXED_ANSWERS,
        scorePct: 100,
        resultType: 'sebe',
        score_internal: 36,
        band: '70',
      };

      const response = await callRoute(tamperedPayload);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toMatchObject({ success: true, resultType: 'mama', scorePct: 39 });

      const row = insertedRow();
      expect(row.score_pct).toBe(39);
      expect(row.score_internal).toBe(14);
      expect(row.band).toBe('25');
      expect(row.result_type).toBe('mama');
    });

    it('sends a Resend notification with handle, score % and result type', async () => {
      await callRoute(VALID_PAYLOAD);

      expect(sendMock).toHaveBeenCalledTimes(1);
      const email = sendMock.mock.calls[0][0];
      expect(email.from).toBe(TEST_ENV.RESEND_FROM_EMAIL);
      expect(email.to).toBe(TEST_ENV.NOTIFICATION_EMAIL);
      const emailText = `${email.subject} ${email.html}`;
      expect(emailText).toContain('@test.handle');
      expect(emailText).toContain('100');
      expect(emailText).toContain('sebe');
    });
  });

  describe('instagram nick normalization (AC3, ADR-0002 #1)', () => {
    it('stores the canonical bare lowercase nick when sent without @', async () => {
      const response = await callRoute({ instagram: 'viktoria.zh', answers: ALL_SEBE_ANSWERS });

      expect(response.status).toBe(200);
      expect(insertedRow().instagram_handle).toBe('viktoria.zh');
    });

    it('strips the leading @ and lowercases before storing', async () => {
      const response = await callRoute({ instagram: '@Viktoria.Zh', answers: ALL_SEBE_ANSWERS });

      expect(response.status).toBe(200);
      expect(insertedRow().instagram_handle).toBe('viktoria.zh');
    });

    it('accepts a single-character nick (1-30 supersedes the old 2-30)', async () => {
      const response = await callRoute({ instagram: 'a', answers: ALL_SEBE_ANSWERS });

      expect(response.status).toBe(200);
      expect(insertedRow().instagram_handle).toBe('a');
    });
  });

  describe('instagram existence check (GEO-24, ADR-0002 #4/#5)', () => {
    it('checks the canonical bare nick, not the raw input', async () => {
      await callRoute({ instagram: '@Viktoria.Zh', answers: ALL_SEBE_ANSWERS });

      expect(checkNickMock).toHaveBeenCalledTimes(1);
      expect(checkNickMock).toHaveBeenCalledWith('viktoria.zh');
    });

    it('persists instagram_verified=exists with a check timestamp', async () => {
      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      const row = insertedRow();
      expect(row.instagram_verified).toBe('exists');
      expect(typeof row.instagram_checked_at).toBe('string');
      expect(new Date(row.instagram_checked_at as string).toString()).not.toBe('Invalid Date');
    });

    it('accepts an "unknown" outcome (fail-open) and persists it', async () => {
      checkNickMock.mockResolvedValue('unknown');

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toMatchObject({ success: true, resultType: 'sebe', scorePct: 100 });
      expect(insertedRow().instagram_verified).toBe('unknown');
    });

    it('rejects a "missing" outcome with 400 instagram_not_found and persists nothing', async () => {
      checkNickMock.mockResolvedValue('missing');

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.error).toBe('instagram_not_found');
      expect(json.message).toBe(INSTAGRAM_NOT_FOUND_ERROR);
      expect(insertMock).not.toHaveBeenCalled();
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('treats an unexpectedly rejecting check as "unknown" (defensive fail-open)', async () => {
      checkNickMock.mockRejectedValue(new Error('should never happen'));

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      expect(insertedRow().instagram_verified).toBe('unknown');
    });

    it('does not call the check when format validation already failed', async () => {
      const response = await callRoute({ instagram: 'bad handle!', answers: ALL_SEBE_ANSWERS });

      expect(response.status).toBe(400);
      expect(checkNickMock).not.toHaveBeenCalled();
    });
  });

  describe('validation failures (AC2) — 400, nothing persisted, no email', () => {
    const invalidCases: Array<{ name: string; payload: unknown }> = [
      {
        name: '11 answers',
        payload: { instagram: '@ok.handle', answers: ALL_SEBE_ANSWERS.slice(0, 11) },
      },
      {
        name: '13 answers',
        payload: {
          instagram: '@ok.handle',
          answers: [...ALL_SEBE_ANSWERS, { question: 0, option: 0 }],
        },
      },
      {
        name: 'duplicated question index',
        payload: {
          instagram: '@ok.handle',
          answers: [{ question: 0, option: 0 }, ...ALL_SEBE_ANSWERS.slice(0, 11)],
        },
      },
      {
        name: 'option out of range (4)',
        payload: {
          instagram: '@ok.handle',
          answers: [{ question: 0, option: 4 }, ...ALL_SEBE_ANSWERS.slice(1)],
        },
      },
      {
        name: 'question out of range (12)',
        payload: {
          instagram: '@ok.handle',
          answers: [{ question: 12, option: 0 }, ...ALL_SEBE_ANSWERS.slice(1)],
        },
      },
      {
        name: 'empty handle',
        payload: { instagram: '', answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'lone @',
        payload: { instagram: '@', answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'handle too long (31 chars)',
        payload: { instagram: 'a'.repeat(31), answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'handle with invalid characters ("bad handle!")',
        payload: { instagram: 'bad handle!', answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'leading dot (".nick")',
        payload: { instagram: '.nick', answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'trailing dot ("nick.")',
        payload: { instagram: 'nick.', answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'consecutive dots ("ni..ck")',
        payload: { instagram: 'ni..ck', answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'missing instagram field',
        payload: { answers: ALL_SEBE_ANSWERS },
      },
      {
        name: 'missing answers field',
        payload: { instagram: '@ok.handle' },
      },
    ];

    it.each(invalidCases)('rejects $name with 400 and validation details', async ({ payload }) => {
      const response = await callRoute(payload);

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(json.details).toBeDefined();
      expect(insertMock).not.toHaveBeenCalled();
      expect(sendMock).not.toHaveBeenCalled();
    });

    it('rejects malformed JSON body with 400', async () => {
      const response = await callRoute('{not json');

      expect(response.status).toBe(400);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(insertMock).not.toHaveBeenCalled();
      expect(sendMock).not.toHaveBeenCalled();
    });
  });

  describe('request metadata capture (AC5)', () => {
    it('stores user_agent and referrer from request headers', async () => {
      const response = await callRoute(VALID_PAYLOAD, {
        'user-agent': 'Mozilla/5.0 (Test Browser)',
        referer: 'https://zhulova.com/quiz/opora',
      });

      expect(response.status).toBe(200);
      const row = insertedRow();
      expect(row.user_agent).toBe('Mozilla/5.0 (Test Browser)');
      expect(row.referrer).toBe('https://zhulova.com/quiz/opora');
    });

    it('stores null user_agent and referrer when headers are absent', async () => {
      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      const row = insertedRow();
      expect(row.user_agent).toBeNull();
      expect(row.referrer).toBeNull();
    });
  });

  describe('failure matrix (AC4)', () => {
    it('returns 200 when Resend fails but DB insert succeeds (error logged)', async () => {
      sendMock.mockResolvedValue({
        data: null,
        error: { message: 'Email service down', name: 'application_error', statusCode: 500 },
      });

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toMatchObject({ success: true, resultType: 'sebe', scorePct: 100 });
      expect(logErrorMock).toHaveBeenCalled();
    });

    it('returns 200 when Resend throws but DB insert succeeds (error logged)', async () => {
      sendMock.mockRejectedValue(new Error('network exploded'));

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      expect(logErrorMock).toHaveBeenCalled();
    });

    it('returns 200 when DB insert fails but Resend succeeds (error logged)', async () => {
      singleMock.mockResolvedValue({
        data: null,
        error: { message: 'connection refused', code: '08001' },
      });

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      const json = await response.json();
      expect(json).toMatchObject({ success: true, resultType: 'sebe', scorePct: 100 });
      expect(logErrorMock).toHaveBeenCalled();
    });

    it('returns 200 when the DB client throws but Resend succeeds (error logged)', async () => {
      singleMock.mockRejectedValue(new Error('supabase exploded'));

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(200);
      expect(logErrorMock).toHaveBeenCalled();
    });

    it('returns 500 when both DB insert and Resend fail', async () => {
      singleMock.mockResolvedValue({
        data: null,
        error: { message: 'connection refused', code: '08001' },
      });
      sendMock.mockResolvedValue({
        data: null,
        error: { message: 'Email service down', name: 'application_error', statusCode: 500 },
      });

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(logErrorMock).toHaveBeenCalled();
    });
  });

  describe('environment validation (AC6)', () => {
    it.each([
      'SUPABASE_URL',
      'SUPABASE_SERVICE_KEY',
      'RESEND_API_KEY',
      'RESEND_FROM_EMAIL',
      'NOTIFICATION_EMAIL',
    ])('returns 500 and touches nothing when %s is missing', async (varName) => {
      stubEnv({ [varName]: '' });

      const response = await callRoute(VALID_PAYLOAD);

      expect(response.status).toBe(500);
      const json = await response.json();
      expect(json.success).toBe(false);
      expect(insertMock).not.toHaveBeenCalled();
      expect(sendMock).not.toHaveBeenCalled();
      expect(logErrorMock).toHaveBeenCalled();
    });
  });
});
