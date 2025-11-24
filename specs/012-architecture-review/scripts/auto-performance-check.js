#!/usr/bin/env node

/**
 * Automated Performance Check Script
 * Runs performance audits without manual intervention
 *
 * Features:
 * - PageSpeed Insights API for production
 * - Local bundle size analysis
 * - Accessibility checks
 * - Automatic report generation
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const REPORTS_DIR = path.join(__dirname, '..', 'reports');
const PAGESPEED_API_KEY = process.env.PAGESPEED_API_KEY; // Required: Get from Google Cloud Console

// Pages to test
const PAGES = [
  { name: 'home', url: 'https://zhulova.com/' },
  { name: 'courses', url: 'https://zhulova.com/courses' },
  { name: 'contacts', url: 'https://zhulova.com/contacts' },
];

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Fetch PageSpeed Insights data
 */
async function getPageSpeedInsights(url) {
  const apiUrl = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  apiUrl.searchParams.append('url', url);
  apiUrl.searchParams.append('key', PAGESPEED_API_KEY);
  apiUrl.searchParams.append('category', 'performance');
  apiUrl.searchParams.append('category', 'accessibility');
  apiUrl.searchParams.append('category', 'best-practices');
  apiUrl.searchParams.append('category', 'seo');
  apiUrl.searchParams.append('strategy', 'desktop');

  return new Promise((resolve, reject) => {
    https.get(apiUrl.toString(), (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`PageSpeed API error: ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

/**
 * Analyze local bundle size
 */
async function analyzeBundleSize() {
  try {
    console.log('📦 Building project for bundle analysis...');
    await execAsync('npm run build');

    const distPath = path.join(process.cwd(), 'dist', '_astro');
    if (!fs.existsSync(distPath)) {
      return { error: 'Build directory not found' };
    }

    const files = fs.readdirSync(distPath)
      .filter(file => file.endsWith('.js') || file.endsWith('.css'));

    const bundles = [];
    let totalSize = 0;
    let totalGzipped = 0;

    for (const file of files) {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath);

      // Simulate gzip compression
      const { stdout } = await execAsync(`gzip -c "${filePath}" | wc -c`);
      const gzippedSize = parseInt(stdout.trim());

      bundles.push({
        name: file,
        size: stats.size,
        gzipped: gzippedSize,
      });

      totalSize += stats.size;
      totalGzipped += gzippedSize;
    }

    return {
      bundles,
      totalSize,
      totalGzipped,
      withinLimit: totalGzipped < 51200, // 50KB limit
    };
  } catch (error) {
    return { error: error.message };
  }
}

/**
 * Generate markdown report
 */
function generateReport(results) {
  const timestamp = new Date().toISOString();
  let report = `# Automated Performance Report\n\n`;
  report += `**Generated**: ${timestamp}\n`;
  report += `**Type**: Automated Check\n\n`;

  // PageSpeed Insights Results
  report += `## PageSpeed Insights Results\n\n`;
  report += `| Page | Performance | Accessibility | Best Practices | SEO | Status |\n`;
  report += `|------|------------|---------------|----------------|-----|--------|\n`;

  for (const result of results.pagespeed) {
    if (result.error) {
      report += `| ${result.page} | Error | Error | Error | Error | ❌ |\n`;
    } else {
      const scores = result.data.lighthouseResult.categories;
      const perf = Math.round(scores.performance.score * 100);
      const a11y = Math.round(scores.accessibility.score * 100);
      const bp = Math.round(scores['best-practices'].score * 100);
      const seo = Math.round(scores.seo.score * 100);

      const status = (perf >= 95 && a11y >= 95 && bp >= 95 && seo >= 95) ? '✅' :
                    (perf >= 85 && a11y >= 85) ? '⚠️' : '❌';

      report += `| ${result.page} | ${perf} | ${a11y} | ${bp} | ${seo} | ${status} |\n`;

      // Core Web Vitals
      if (result.data.lighthouseResult.audits) {
        const audits = result.data.lighthouseResult.audits;
        if (result.page === 'home') {
          report += `\n### Core Web Vitals (Home)\n\n`;
          report += `| Metric | Value | Target | Status |\n`;
          report += `|--------|-------|--------|--------|\n`;

          const lcp = audits['largest-contentful-paint']?.numericValue || 0;
          const cls = audits['cumulative-layout-shift']?.numericValue || 0;
          const tbt = audits['total-blocking-time']?.numericValue || 0;

          report += `| LCP | ${(lcp/1000).toFixed(2)}s | <2.5s | ${lcp < 2500 ? '✅' : '❌'} |\n`;
          report += `| CLS | ${cls.toFixed(3)} | <0.1 | ${cls < 0.1 ? '✅' : '❌'} |\n`;
          report += `| TBT | ${tbt}ms | <200ms | ${tbt < 200 ? '✅' : '❌'} |\n`;
        }
      }
    }
  }

  // Bundle Size Analysis
  report += `\n## Bundle Size Analysis\n\n`;
  if (results.bundleSize.error) {
    report += `❌ Error: ${results.bundleSize.error}\n`;
  } else {
    report += `| File | Size | Gzipped |\n`;
    report += `|------|------|---------||\n`;

    for (const bundle of results.bundleSize.bundles) {
      report += `| ${bundle.name} | ${(bundle.size/1024).toFixed(1)}KB | ${(bundle.gzipped/1024).toFixed(1)}KB |\n`;
    }

    report += `\n**Total**: ${(results.bundleSize.totalSize/1024).toFixed(1)}KB (${(results.bundleSize.totalGzipped/1024).toFixed(1)}KB gzipped)\n`;
    report += `**Status**: ${results.bundleSize.withinLimit ? '✅ Within 50KB limit' : '❌ Exceeds 50KB limit'}\n`;
  }

  // Recommendations
  report += `\n## Recommendations\n\n`;
  let hasIssues = false;

  for (const result of results.pagespeed) {
    if (!result.error && result.data.lighthouseResult.categories) {
      const scores = result.data.lighthouseResult.categories;
      if (scores.performance.score < 0.95) {
        hasIssues = true;
        report += `- **${result.page}**: Performance score below 95. Check LCP and TBT.\n`;
      }
      if (scores.accessibility.score < 0.95) {
        hasIssues = true;
        report += `- **${result.page}**: Accessibility issues detected. Run detailed a11y audit.\n`;
      }
    }
  }

  if (!results.bundleSize.withinLimit) {
    hasIssues = true;
    report += `- Bundle size exceeds 50KB limit. Consider code splitting or removing unused dependencies.\n`;
  }

  if (!hasIssues) {
    report += `✅ All checks passed! Performance is within acceptable limits.\n`;
  }

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting automated performance check...\n');

  const results = {
    pagespeed: [],
    bundleSize: null,
  };

  // Run PageSpeed Insights for each page
  console.log('📊 Running PageSpeed Insights...');
  for (const page of PAGES) {
    console.log(`  Checking ${page.name}...`);
    try {
      const data = await getPageSpeedInsights(page.url);
      results.pagespeed.push({
        page: page.name,
        url: page.url,
        data,
      });

      const score = Math.round(data.lighthouseResult.categories.performance.score * 100);
      console.log(`    ✅ Performance: ${score}/100`);
    } catch (error) {
      console.log(`    ❌ Error: ${error.message}`);
      results.pagespeed.push({
        page: page.name,
        url: page.url,
        error: error.message,
      });
    }
  }

  // Analyze bundle size
  console.log('\n📦 Analyzing bundle size...');
  results.bundleSize = await analyzeBundleSize();
  if (results.bundleSize.error) {
    console.log(`  ❌ Error: ${results.bundleSize.error}`);
  } else {
    console.log(`  ✅ Total size: ${(results.bundleSize.totalGzipped/1024).toFixed(1)}KB gzipped`);
  }

  // Generate report
  console.log('\n📝 Generating report...');
  const report = generateReport(results);

  const reportPath = path.join(REPORTS_DIR, `performance-auto-${Date.now()}.md`);
  fs.writeFileSync(reportPath, report);
  console.log(`  ✅ Report saved to: ${reportPath}`);

  // Also save latest report
  const latestPath = path.join(REPORTS_DIR, 'performance-latest.md');
  fs.writeFileSync(latestPath, report);

  // Save raw data as JSON
  const jsonPath = path.join(REPORTS_DIR, 'performance-data.json');
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));

  console.log('\n✨ Performance check complete!');

  // Return exit code based on results
  const allPassed = results.pagespeed.every(r => {
    if (r.error) return false;
    const scores = r.data.lighthouseResult.categories;
    return scores.performance.score >= 0.95 &&
           scores.accessibility.score >= 0.95;
  }) && results.bundleSize.withinLimit;

  process.exit(allPassed ? 0 : 1);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});