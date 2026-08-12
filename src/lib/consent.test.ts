import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  DEFAULT_CONSENT_STATE,
  createConsentStorage,
  getConsentChoice,
  applyConsent,
  type ConsentStorage,
} from './consent';

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
    clear: () => map.clear(),
    key: (index) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size;
    },
  };
}

function storageFor(raw: Storage): ConsentStorage {
  return createConsentStorage(() => raw);
}

beforeEach(() => {
  delete window.gtag;
  delete window.clarity;
});

afterEach(() => {
  vi.unstubAllEnvs();
  delete window.gtag;
  delete window.clarity;
});

describe('DEFAULT_CONSENT_STATE — Consent Mode v2 defaults (spec §8, AC7)', () => {
  it('denies ad_storage, ad_user_data and ad_personalization before any choice is made', () => {
    expect(DEFAULT_CONSENT_STATE.ad_storage).toBe('denied');
    expect(DEFAULT_CONSENT_STATE.ad_user_data).toBe('denied');
    expect(DEFAULT_CONSENT_STATE.ad_personalization).toBe('denied');
  });

  it('grants analytics_storage by default (proposed default, spec §8/§12 open question)', () => {
    expect(DEFAULT_CONSENT_STATE.analytics_storage).toBe('granted');
  });
});

describe('createConsentStorage / getConsentChoice', () => {
  it('returns null when nothing has been stored', () => {
    const storage = storageFor(createMemoryStorage());
    expect(getConsentChoice(storage)).toBeNull();
  });

  it('persists "accepted" and "necessary" choices', () => {
    const storage = storageFor(createMemoryStorage());
    storage.write('accepted');
    expect(getConsentChoice(storage)).toBe('accepted');

    storage.write('necessary');
    expect(getConsentChoice(storage)).toBe('necessary');
  });

  it('write does not throw when the underlying storage is unavailable, and keeps the in-memory fallback', () => {
    const throwing: Storage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
    const storage = createConsentStorage(() => throwing);
    expect(() => storage.write('accepted')).not.toThrow();
    // write() degrades gracefully but keeps the choice in memory for this session
    expect(getConsentChoice(storage)).toBe('accepted');
  });

  it('read degrades to null without throwing when the underlying storage is unavailable', () => {
    const throwing: Storage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {},
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
    const storage = createConsentStorage(() => throwing);
    expect(() => getConsentChoice(storage)).not.toThrow();
    expect(getConsentChoice(storage)).toBeNull();
  });
});

describe('applyConsent — gtag consent update (AC7, AC8)', () => {
  it('reports ad_storage: denied to gtag when the banner has not been accepted', () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    applyConsent('necessary');

    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted',
    });
  });

  it('grants all four signals to gtag when the user accepts', () => {
    const gtag = vi.fn();
    window.gtag = gtag;

    applyConsent('accepted');

    expect(gtag).toHaveBeenCalledWith('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted',
    });
  });

  it('does not throw when window.gtag is undefined', () => {
    expect(() => applyConsent('accepted')).not.toThrow();
  });

  it('calls window.clarity("consent") only when the user accepts', () => {
    const clarity = vi.fn();
    window.clarity = clarity;

    applyConsent('necessary');
    expect(clarity).not.toHaveBeenCalled();

    applyConsent('accepted');
    expect(clarity).toHaveBeenCalledWith('consent');
  });

  it('does not throw when window.clarity is undefined', () => {
    expect(() => applyConsent('accepted')).not.toThrow();
  });
});
