/**
 * Best-effort Instagram account existence check (GEO-24, ADR-0002 #3/#4/#7).
 *
 * Server-side only — never import from the island (CORS + mechanism secrecy).
 * One GET to the web_profile_info endpoint with a hard 2.5s timeout, exactly
 * one attempt, no retries. Instagram blocks many datacenter IPs, so a failed
 * probe proves nothing: every error maps to 'unknown', never to a throw —
 * the submit endpoint must never hang or 5xx because of this check.
 */

export type InstagramCheckOutcome = 'exists' | 'missing' | 'unknown';

const CHECK_URL = 'https://i.instagram.com/api/v1/users/web_profile_info/';
/** Public web-app id Instagram's own frontend sends; required for a JSON reply. */
const IG_APP_ID = '936619743392459';
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const TIMEOUT_MS = 2500;

const TTL_MS: Record<InstagramCheckOutcome, number> = {
  exists: 24 * 60 * 60 * 1000,
  missing: 24 * 60 * 60 * 1000,
  unknown: 10 * 60 * 1000, // blocks/rate-limits are transient
};
const CACHE_MAX_ENTRIES = 500;

interface CacheEntry {
  outcome: InstagramCheckOutcome;
  at: number;
}

// Per warm function instance (Fluid Compute reuses instances). Insertion
// order doubles as age order: entries are re-inserted on refresh.
const cache = new Map<string, CacheEntry>();

function outcomeFromResponse(status: number, body: unknown): InstagramCheckOutcome {
  if (status === 404) {
    return 'missing';
  }
  if (status === 200) {
    const user = (body as { data?: { user?: unknown } } | null)?.data?.user;
    if (user === null) {
      return 'missing';
    }
    return typeof user === 'object' && user !== undefined ? 'exists' : 'unknown';
  }
  return 'unknown';
}

async function probe(nick: string): Promise<InstagramCheckOutcome> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(
      `${CHECK_URL}?username=${encodeURIComponent(nick)}`,
      {
        method: 'GET',
        headers: { 'x-ig-app-id': IG_APP_ID, 'User-Agent': USER_AGENT },
        signal: controller.signal,
      }
    );
    const body: unknown = response.status === 200 ? await response.json() : null;
    return outcomeFromResponse(response.status, body);
  } catch {
    // Timeout, network error, malformed JSON — a blocked probe proves nothing
    return 'unknown';
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Check whether an Instagram account exists. Expects the canonical bare
 * lowercase nick (see `instagram.ts`). Never throws; worst case cost is one
 * ~2.5s probe per nick per TTL window per warm instance.
 */
export async function checkInstagramNick(nick: string): Promise<InstagramCheckOutcome> {
  const cached = cache.get(nick);
  if (cached && Date.now() - cached.at < TTL_MS[cached.outcome]) {
    return cached.outcome;
  }

  const outcome = await probe(nick);

  cache.delete(nick); // re-insert so Map order stays oldest-first
  cache.set(nick, { outcome, at: Date.now() });
  if (cache.size > CACHE_MAX_ENTRIES) {
    const oldest = cache.keys().next().value;
    if (oldest !== undefined) {
      cache.delete(oldest);
    }
  }

  return outcome;
}
