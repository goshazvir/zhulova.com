import type { Article } from '../types/article';
import articlesData from '../data/en-journal-articles.json';

const articles: Article[] = articlesData as Article[];

/**
 * Get all published articles (publishDate <= today), sorted newest first
 */
export function getPublishedArticles(): Article[] {
  const today = new Date().toISOString().split('T')[0];
  return articles
    .filter((a) => a.publishDate <= today)
    .sort((a, b) => b.publishDate.localeCompare(a.publishDate));
}

/**
 * Get a single article by slug
 */
export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

/**
 * Get all slugs for published articles (for static path generation)
 */
export function getPublishedSlugs(): string[] {
  const today = new Date().toISOString().split('T')[0];
  return articles
    .filter((a) => a.publishDate <= today)
    .map((a) => a.slug);
}

/**
 * Get all unique tags from published articles
 */
export function getAllTags(): string[] {
  const published = getPublishedArticles();
  const tags = new Set(published.map((a) => a.tag));
  return Array.from(tags).sort();
}

/**
 * Get first N published articles
 */
export function getLatestArticles(count: number): Article[] {
  return getPublishedArticles().slice(0, count);
}

/**
 * Get related articles by same tag, excluding current slug
 */
export function getRelatedArticles(slug: string, tag: string, count: number = 3): Article[] {
  return getPublishedArticles()
    .filter((a) => a.slug !== slug && a.tag === tag)
    .slice(0, count);
}

/**
 * Get related articles, falling back to latest if not enough by tag
 */
export function getRelatedOrLatest(slug: string, tag: string, count: number = 3): Article[] {
  const byTag = getRelatedArticles(slug, tag, count);
  if (byTag.length >= count) return byTag;
  const rest = getPublishedArticles()
    .filter((a) => a.slug !== slug && !byTag.find(b => b.slug === a.slug))
    .slice(0, count - byTag.length);
  return [...byTag, ...rest];
}
