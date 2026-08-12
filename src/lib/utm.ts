/**
 * First-touch UTM capture (spec §4). GA4 auto-captures UTM params on
 * page_view already; this only exists to attach the *first-touch* values to
 * later custom events (e.g. `consultation_lead`) fired later in the same
 * session. Stored in sessionStorage, not a cookie, to keep it off the
 * consent-banner surface.
 *
 * Storage wrapper mirrors `promoTrigger.ts`'s `createPromoStorage` pattern:
 * an injectable `getStorage`, an in-memory fallback, and try/catch around
 * every storage access (Safari private mode / quota errors degrade to the
 * in-memory copy instead of throwing).
 */

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export interface UtmStorage {
  read: () => UtmParams;
  write: (params: UtmParams) => void;
}

const STORAGE_KEY = 'zh_utm_first_touch_v1';

function isUtmParams(value: unknown): value is UtmParams {
  if (typeof value !== 'object' || value === null) return false;
  return Object.entries(value as Record<string, unknown>).every(
    ([key, val]) => (UTM_KEYS as readonly string[]).includes(key) && typeof val === 'string'
  );
}

export function createUtmStorage(
  getStorage: () => Storage = () => window.sessionStorage,
  key: string = STORAGE_KEY
): UtmStorage {
  let memory: UtmParams = {};

  return {
    read: () => {
      try {
        const raw = getStorage().getItem(key);
        if (raw === null) return memory;
        const parsed: unknown = JSON.parse(raw);
        return isUtmParams(parsed) ? parsed : memory;
      } catch {
        return memory;
      }
    },
    write: (params) => {
      memory = params;
      try {
        getStorage().setItem(key, JSON.stringify(params));
      } catch {
        // Keep the in-memory copy — storage is unavailable.
      }
    },
  };
}

function parseUtmParams(search: string): UtmParams {
  const query = new URLSearchParams(search);
  const result: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = query.get(key);
    if (value) result[key] = value;
  }
  return result;
}

/** Captures UTM params from `search` into storage, once per session (first touch wins). */
export function captureUtmParams(search: string, storage: UtmStorage): void {
  if (Object.keys(storage.read()).length > 0) return;

  const params = parseUtmParams(search);
  if (Object.keys(params).length > 0) {
    storage.write(params);
  }
}

export function getStoredUtmParams(storage: UtmStorage): UtmParams {
  return storage.read();
}
