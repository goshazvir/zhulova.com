/**
 * Unit tests for the best-effort Instagram existence check (GEO-24).
 *
 * Written FIRST (TDD) from ADR-0002 #3/#4/#7:
 * - single GET to i.instagram.com web_profile_info with x-ig-app-id header,
 *   2.5s AbortController timeout, exactly one attempt, never throws;
 * - three outcomes: exists | missing | unknown;
 * - per-nick in-memory cache: 24h TTL for exists/missing, 10min for unknown,
 *   ~500 entries cap with oldest-first eviction.
 *
 * fetch is always mocked — no test ever contacts real Instagram.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { InstagramCheckOutcome } from './instagramCheck';

type CheckFn = (nick: string) => Promise<InstagramCheckOutcome>;

const fetchMock = vi.fn();

function jsonResponse(status: number, body: unknown): Partial<Response> {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  };
}

function userFound(): Partial<Response> {
  return jsonResponse(200, { data: { user: { username: 'somenick' } } });
}

function userNull(): Partial<Response> {
  return jsonResponse(200, { data: { user: null } });
}

/** Fresh module instance per test — resets the module-level cache. */
async function loadCheck(): Promise<CheckFn> {
  const mod = await import('./instagramCheck');
  return mod.checkInstagramNick;
}

beforeEach(() => {
  vi.resetModules();
  vi.useFakeTimers();
  fetchMock.mockReset().mockResolvedValue(userFound());
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('checkInstagramNick — request shape', () => {
  it('GETs the web_profile_info endpoint with the nick and x-ig-app-id header', async () => {
    const check = await loadCheck();
    await check('viktoria.zh');

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(
      'https://i.instagram.com/api/v1/users/web_profile_info/?username=viktoria.zh'
    );
    expect(init.headers['x-ig-app-id']).toBe('936619743392459');
    expect(init.headers['User-Agent']).toBeDefined();
    expect(init.signal).toBeInstanceOf(AbortSignal);
  });

  it('URL-encodes the nick', async () => {
    const check = await loadCheck();
    // Canonical nicks never contain reserved chars, but the module must not
    // build injectable URLs even if handed a raw string.
    await check('a&b');

    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain('username=a%26b');
  });
});

describe('checkInstagramNick — outcome mapping (ADR-0002 #4)', () => {
  it('maps 200 with a user object to "exists"', async () => {
    fetchMock.mockResolvedValue(userFound());
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('exists');
  });

  it('maps 200 with data.user = null to "missing"', async () => {
    fetchMock.mockResolvedValue(userNull());
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('missing');
  });

  it('maps 404 to "missing"', async () => {
    fetchMock.mockResolvedValue(jsonResponse(404, {}));
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('missing');
  });

  it.each([403, 429, 500, 302])('maps HTTP %i to "unknown"', async (status) => {
    fetchMock.mockResolvedValue(jsonResponse(status, {}));
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('unknown');
  });

  it('maps a network error to "unknown" (never throws)', async () => {
    fetchMock.mockRejectedValue(new TypeError('fetch failed'));
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('unknown');
  });

  it('maps a 200 with malformed JSON to "unknown"', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.reject(new SyntaxError('bad json')),
    });
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('unknown');
  });

  it('maps a 200 with a non-object body to "unknown"', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, 'nope'));
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('unknown');
  });
});

describe('checkInstagramNick — 2.5s hard timeout, single attempt', () => {
  it('resolves "unknown" when Instagram does not answer within 2.5s', async () => {
    fetchMock.mockImplementation(
      (_url: string, init: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          init.signal.addEventListener('abort', () =>
            reject(new DOMException('The operation was aborted', 'AbortError'))
          );
        })
    );
    const check = await loadCheck();

    const pending = check('slow.nick');
    await vi.advanceTimersByTimeAsync(2500);

    await expect(pending).resolves.toBe('unknown');
    expect(fetchMock).toHaveBeenCalledTimes(1); // no retry, no fallback probe
  });
});

describe('checkInstagramNick — per-nick cache (ADR-0002 #7)', () => {
  it('serves a repeat nick from cache without a second fetch', async () => {
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('exists');
    await expect(check('nick')).resolves.toBe('exists');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('caches different nicks independently', async () => {
    fetchMock.mockResolvedValueOnce(userFound()).mockResolvedValueOnce(userNull());
    const check = await loadCheck();
    await expect(check('one')).resolves.toBe('exists');
    await expect(check('two')).resolves.toBe('missing');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('keeps "exists" cached for 24h and refetches after expiry', async () => {
    const check = await loadCheck();
    await check('nick');

    await vi.advanceTimersByTimeAsync(24 * 60 * 60 * 1000 - 1);
    await check('nick');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(2);
    await check('nick');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('keeps "unknown" cached only 10min (blocks are transient)', async () => {
    fetchMock.mockResolvedValue(jsonResponse(403, {}));
    const check = await loadCheck();
    await expect(check('nick')).resolves.toBe('unknown');

    await vi.advanceTimersByTimeAsync(10 * 60 * 1000 - 1);
    await check('nick');
    expect(fetchMock).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(2);
    await check('nick');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('evicts the oldest entry once the cache exceeds 500 nicks', async () => {
    const check = await loadCheck();

    await check('first.nick');
    for (let i = 0; i < 500; i++) {
      await check(`nick.${i}`);
    }
    expect(fetchMock).toHaveBeenCalledTimes(501);

    // 'first.nick' was evicted → a repeat call fetches again
    await check('first.nick');
    expect(fetchMock).toHaveBeenCalledTimes(502);

    // ...while a younger entry is still cached
    await check('nick.499');
    expect(fetchMock).toHaveBeenCalledTimes(502);
  });
});
