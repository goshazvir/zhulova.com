/**
 * Unit tests for the shared Instagram nick validator (GEO-24).
 *
 * Written FIRST (TDD) from ADR-0002 #1/#2: canonical form is the bare
 * lowercase nick (no `@`), 1-30 chars of [a-z0-9._], no leading/trailing
 * dot, no consecutive dots. Pure module — imported by both the QuizApp
 * island and the /api/submit-quiz Zod schema.
 */
import { describe, it, expect } from 'vitest';
import {
  normalizeInstagramNick,
  validateInstagramNick,
  INSTAGRAM_FORMAT_ERROR,
} from './instagram';

describe('normalizeInstagramNick', () => {
  it('trims surrounding whitespace', () => {
    expect(normalizeInstagramNick('  nick  ')).toBe('nick');
  });

  it('strips a single leading @', () => {
    expect(normalizeInstagramNick('@viktoria.zh')).toBe('viktoria.zh');
  });

  it('strips only one leading @ (double @@ stays malformed)', () => {
    expect(normalizeInstagramNick('@@nick')).toBe('@nick');
  });

  it('lowercases the nick', () => {
    expect(normalizeInstagramNick('Viktoria.ZH')).toBe('viktoria.zh');
  });

  it('applies trim, @-strip and lowercase together', () => {
    expect(normalizeInstagramNick('  @Viktoria.Zh ')).toBe('viktoria.zh');
  });
});

describe('validateInstagramNick', () => {
  describe('valid nicks → canonical bare lowercase form', () => {
    it.each([
      { raw: 'viktoria.zh', nick: 'viktoria.zh' },
      { raw: '@Viktoria.Zh', nick: 'viktoria.zh' },
      { raw: ' v_z.123 ', nick: 'v_z.123' },
      { raw: 'a', nick: 'a' }, // 1 char is valid per ADR-0002 (supersedes {2,30})
      { raw: '_', nick: '_' },
      { raw: 'a'.repeat(30), nick: 'a'.repeat(30) },
    ])('accepts "$raw" as "$nick"', ({ raw, nick }) => {
      expect(validateInstagramNick(raw)).toEqual({ valid: true, nick });
    });
  });

  describe('invalid nicks → friendly Ukrainian error', () => {
    it.each([
      { name: 'empty string', raw: '' },
      { name: 'whitespace only', raw: '   ' },
      { name: 'lone @', raw: '@' },
      { name: '31 chars', raw: 'a'.repeat(31) },
      { name: 'space inside', raw: 'bad handle' },
      { name: 'forbidden punctuation', raw: 'nick!' },
      { name: 'cyrillic letters', raw: 'нік' },
      { name: 'leading dot', raw: '.nick' },
      { name: 'trailing dot', raw: 'nick.' },
      { name: 'consecutive dots', raw: 'ni..ck' },
      { name: 'double @', raw: '@@nick' },
    ])('rejects $name ("$raw")', ({ raw }) => {
      const result = validateInstagramNick(raw);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.error).toBe(INSTAGRAM_FORMAT_ERROR);
      }
    });

    it('exposes a Ukrainian, user-facing format error message', () => {
      expect(INSTAGRAM_FORMAT_ERROR).toMatch(/нік/i);
    });
  });
});
