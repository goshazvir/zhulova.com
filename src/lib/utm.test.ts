import { describe, it, expect } from 'vitest';
import { captureUtmParams, getStoredUtmParams, createUtmStorage, type UtmStorage } from './utm';

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

function storageFor(raw: Storage): UtmStorage {
  return createUtmStorage(() => raw);
}

describe('captureUtmParams — first-touch capture (spec §4)', () => {
  it('stores utm_source/medium/campaign/term/content when present in the URL', () => {
    const storage = storageFor(createMemoryStorage());

    captureUtmParams('?utm_source=facebook&utm_medium=cpc&utm_campaign=launch', storage);

    expect(getStoredUtmParams(storage)).toEqual({
      utm_source: 'facebook',
      utm_medium: 'cpc',
      utm_campaign: 'launch',
    });
  });

  it('captures utm_term and utm_content too', () => {
    const storage = storageFor(createMemoryStorage());

    captureUtmParams('?utm_source=ig&utm_term=coach&utm_content=story1', storage);

    expect(getStoredUtmParams(storage)).toEqual({
      utm_source: 'ig',
      utm_term: 'coach',
      utm_content: 'story1',
    });
  });

  it('does nothing when the URL carries no utm params', () => {
    const storage = storageFor(createMemoryStorage());

    captureUtmParams('?ref=newsletter', storage);

    expect(getStoredUtmParams(storage)).toEqual({});
  });

  it('preserves first-touch attribution: a later capture call does not overwrite an existing record', () => {
    const storage = storageFor(createMemoryStorage());
    captureUtmParams('?utm_source=facebook&utm_medium=cpc', storage);

    captureUtmParams('?utm_source=google&utm_medium=organic', storage);

    expect(getStoredUtmParams(storage)).toEqual({ utm_source: 'facebook', utm_medium: 'cpc' });
  });
});

describe('getStoredUtmParams', () => {
  it('returns an empty object when nothing has been captured', () => {
    const storage = storageFor(createMemoryStorage());
    expect(getStoredUtmParams(storage)).toEqual({});
  });
});

describe('createUtmStorage — degrades safely without throwing (Safari private mode / quota errors)', () => {
  it('falls back to an in-memory copy when the underlying storage throws', () => {
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
    const storage = createUtmStorage(() => throwing);

    expect(() => captureUtmParams('?utm_source=facebook', storage)).not.toThrow();
    expect(getStoredUtmParams(storage)).toEqual({ utm_source: 'facebook' });
  });
});
