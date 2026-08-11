/**
 * Unit tests for the pure quiz scoring module (GEO-16).
 *
 * Test matrix from docs/architecture/quiz-opora.md §4:
 * 1. pct math (all-max → 100, all-zero → 0, Math.round semantics)
 * 2. Band boundaries (70/69, 45/44, 25/24, 0)
 * 3. sebe-override rule (pct >= 70 branch, pct >= 50 + margin branch, boundaries)
 * 4. External tie-break order (mama, tato, rodyna, partner, kontrol — first wins)
 * 5. Full 12-answer fixtures — one per result type
 */
import { describe, expect, it } from 'vitest';

import { QUESTIONS, type Category } from './questions';
import {
  computeInternalSum,
  countCategories,
  pctFromInternal,
  resolveBand,
  resolveResultType,
  scoreQuiz,
  type AnswerScore,
  type CategoryCounts,
} from './scoring';

/** Build an AnswerScore list from one option index per question (12 total). */
function pick(optionIndexes: readonly number[]): AnswerScore[] {
  return optionIndexes.map((optionIndex, questionIndex) => {
    const option = QUESTIONS[questionIndex].options[optionIndex];
    return { category: option.category, internal: option.internal };
  });
}

/** Category counts with zero defaults, overridable per test. */
function counts(partial: Partial<CategoryCounts>): CategoryCounts {
  return {
    mama: 0,
    tato: 0,
    rodyna: 0,
    partner: 0,
    kontrol: 0,
    sebe: 0,
    ...partial,
  };
}

// Option indexes of the max-internal (sebe, internal 3) option per question.
const ALL_MAX = [0, 0, 0, 3, 0, 3, 3, 3, 3, 3, 3, 3];
// Option indexes of an internal-0 option per question.
const ALL_ZERO = [3, 1, 1, 0, 1, 0, 1, 2, 0, 0, 0, 0];

describe('computeInternalSum', () => {
  it('sums internal scores of all answers', () => {
    expect(computeInternalSum(pick(ALL_MAX))).toBe(36);
    expect(computeInternalSum(pick(ALL_ZERO))).toBe(0);
  });
});

describe('pctFromInternal', () => {
  it('returns 100 for the maximum internal sum', () => {
    expect(pctFromInternal(36)).toBe(100);
  });

  it('returns 0 for a zero internal sum', () => {
    expect(pctFromInternal(0)).toBe(0);
  });

  it('rounds with Math.round semantics', () => {
    expect(pctFromInternal(17)).toBe(47); // 47.22... → 47
    expect(pctFromInternal(13)).toBe(36); // 36.11... → 36
    expect(pctFromInternal(25)).toBe(69); // 69.44... → 69
    expect(pctFromInternal(18)).toBe(50); // exact 50
  });
});

describe('resolveBand', () => {
  it.each([
    [70, '70'],
    [69, '45'],
    [45, '45'],
    [44, '25'],
    [25, '25'],
    [24, '0'],
    [0, '0'],
    [100, '70'],
  ])('pct %i → band "%s"', (pct, band) => {
    expect(resolveBand(pct)).toBe(band);
  });
});

describe('countCategories', () => {
  it('counts answers per category with zero defaults', () => {
    const result = countCategories(pick(ALL_MAX));
    expect(result).toEqual(counts({ sebe: 12 }));
  });
});

describe('resolveResultType — sebe override', () => {
  it('returns sebe when pct >= 70 regardless of counts', () => {
    expect(resolveResultType(70, counts({ mama: 12 }))).toBe('sebe');
  });

  it('returns sebe at pct 50 when count(sebe) equals max(external) + 2', () => {
    expect(resolveResultType(50, counts({ sebe: 6, mama: 4, tato: 2 }))).toBe('sebe');
  });

  it('does NOT return sebe at pct 50 with only a +1 margin', () => {
    expect(resolveResultType(50, counts({ sebe: 5, mama: 4, tato: 3 }))).toBe('mama');
  });

  it('does NOT return sebe at pct 49 even with a +2 margin', () => {
    expect(resolveResultType(49, counts({ sebe: 6, mama: 4, tato: 2 }))).toBe('mama');
  });
});

describe('resolveResultType — external tie-break (first wins: mama, tato, rodyna, partner, kontrol)', () => {
  it('tato == rodyna resolves to tato', () => {
    expect(resolveResultType(20, counts({ tato: 4, rodyna: 4, partner: 2, sebe: 2 }))).toBe('tato');
  });

  it('mama == kontrol resolves to mama', () => {
    expect(resolveResultType(20, counts({ mama: 4, kontrol: 4, tato: 2, sebe: 2 }))).toBe('mama');
  });

  it('partner == kontrol resolves to partner', () => {
    expect(resolveResultType(20, counts({ partner: 5, kontrol: 5, mama: 1, sebe: 1 }))).toBe(
      'partner'
    );
  });

  it('falls back to mama when all external counts are equal (all zero)', () => {
    expect(resolveResultType(40, counts({ sebe: 12 }))).toBe('mama');
  });
});

describe('scoreQuiz — full 12-answer fixtures (one per result type)', () => {
  it.each<[Category, readonly number[], number, number, string]>([
    // [expected result type, option index per question, internal sum, expected pct, expected band]
    ['sebe', [0, 3, 0, 3, 0, 1, 3, 3, 3, 1, 3, 3], 30, 83, '70'],
    ['mama', [3, 1, 2, 1, 1, 1, 2, 2, 2, 0, 0, 0], 2, 6, '0'],
    ['tato', [1, 2, 1, 0, 3, 0, 1, 0, 1, 1, 1, 1], 5, 14, '0'],
    ['rodyna', [1, 2, 1, 2, 2, 0, 0, 2, 1, 1, 2, 0], 6, 17, '0'],
    ['partner', [3, 2, 2, 1, 2, 2, 0, 1, 0, 2, 2, 2], 7, 19, '0'],
    ['kontrol', [2, 3, 2, 2, 1, 2, 2, 2, 0, 2, 0, 1], 6, 17, '0'],
  ])('resolves %s with expected pct and band', (resultType, optionIndexes, internal, pct, band) => {
    const result = scoreQuiz(pick(optionIndexes));
    expect(result).toEqual({ internal, pct, band, resultType });
  });

  it('all-max answers score 100 / band "70" / sebe', () => {
    expect(scoreQuiz(pick(ALL_MAX))).toEqual({
      internal: 36,
      pct: 100,
      band: '70',
      resultType: 'sebe',
    });
  });

  it('all-zero answers score 0 / band "0"', () => {
    const result = scoreQuiz(pick(ALL_ZERO));
    expect(result.internal).toBe(0);
    expect(result.pct).toBe(0);
    expect(result.band).toBe('0');
  });
});
