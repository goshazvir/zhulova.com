/**
 * Regression guard for GEO-34: the homepage courses block must reflect the
 * ACTUAL current offering — the «Опора на себе» 3-day mini-course that lives
 * at /courses/opora — and must never again advertise the defunct
 * «МІНІ КУРС — ГРОШІ КОЖЕН ДЕНЬ» course, which no longer exists.
 *
 * Written FIRST (TDD) before the data rewrite.
 */
import { describe, it, expect } from 'vitest';
import { featuredCourse, testimonials } from './homePageContent';

describe('featuredCourse (homepage courses block)', () => {
  it('advertises the real «Опора» offering', () => {
    expect(featuredCourse.title).toMatch(/Опора/i);
  });

  it('never resurrects the defunct «ГРОШІ КОЖЕН ДЕНЬ» course', () => {
    const serialized = JSON.stringify(featuredCourse).toUpperCase();
    expect(serialized).not.toContain('ГРОШІ КОЖЕН ДЕНЬ');
    expect(serialized).not.toContain('МІНІ КУРС - ГРОШІ');
  });

  it('links to the live Опора course page, not the generic /courses index', () => {
    expect(featuredCourse.link).toBe('/courses/opora');
  });

  it('carries structured benefits the block can render without hardcoding copy', () => {
    expect(Array.isArray(featuredCourse.benefits)).toBe(true);
    expect(featuredCourse.benefits.length).toBeGreaterThanOrEqual(3);
    for (const benefit of featuredCourse.benefits) {
      expect(typeof benefit).toBe('string');
      expect(benefit.length).toBeGreaterThan(0);
    }
  });

  it('states the price and keeps a CTA label', () => {
    expect(featuredCourse.price).toMatch(/9/);
    expect(featuredCourse.ctaText.length).toBeGreaterThan(0);
  });
});

describe('testimonials (carousel data)', () => {
  it('exposes at least 3 well-formed testimonials for the carousel', () => {
    expect(testimonials.length).toBeGreaterThanOrEqual(3);
    for (const t of testimonials) {
      expect(t.quote.length).toBeGreaterThan(0);
      expect(t.clientName.length).toBeGreaterThan(0);
      expect(t.role.length).toBeGreaterThan(0);
    }
  });

  it('keeps stable unique ids so the carousel can key/track slides', () => {
    const ids = testimonials.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
