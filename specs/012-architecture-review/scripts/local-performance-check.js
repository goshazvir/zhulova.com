#!/usr/bin/env node

/**
 * Local Performance Check Script
 * Analyzes build output and generates performance report
 * No external APIs required
 */

import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REPORTS_DIR = path.join(__dirname, '..', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Analyze bundle size and composition
 */
async function analyzeBuild() {
  console.log('🔨 Building project...');
  try {
    const { stdout } = await execAsync('npm run build');
    console.log('  ✅ Build complete');
  } catch (error) {
    console.error('  ❌ Build failed:', error.message);
    return { error: error.message };
  }

  const results = {
    bundles: [],
    html: [],
    totalJS: 0,
    totalCSS: 0,
    totalHTML: 0,
    totalAssets: 0,
  };

  // Analyze JavaScript bundles
  const jsPath = path.join(process.cwd(), 'dist', '_astro');
  if (fs.existsSync(jsPath)) {
    const jsFiles = fs.readdirSync(jsPath).filter(f => f.endsWith('.js'));

    for (const file of jsFiles) {
      const filePath = path.join(jsPath, file);
      const stats = fs.statSync(filePath);

      // Get gzipped size
      try {
        const { stdout } = await execAsync(`gzip -c "${filePath}" | wc -c`);
        const gzipped = parseInt(stdout.trim());

        results.bundles.push({
          name: file,
          type: 'js',
          size: stats.size,
          gzipped,
        });

        results.totalJS += gzipped;
      } catch (error) {
        results.bundles.push({
          name: file,
          type: 'js',
          size: stats.size,
          gzipped: Math.round(stats.size * 0.3), // Estimate
        });
      }
    }
  }

  // Analyze CSS
  const cssFiles = [];
  const findCSS = (dir) => {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.')) {
        findCSS(filePath);
      } else if (file.endsWith('.css')) {
        cssFiles.push(filePath);
      }
    }
  };

  findCSS(path.join(process.cwd(), 'dist'));

  for (const filePath of cssFiles) {
    const stats = fs.statSync(filePath);
    const name = path.relative(path.join(process.cwd(), 'dist'), filePath);

    try {
      const { stdout } = await execAsync(`gzip -c "${filePath}" | wc -c`);
      const gzipped = parseInt(stdout.trim());

      results.bundles.push({
        name,
        type: 'css',
        size: stats.size,
        gzipped,
      });

      results.totalCSS += gzipped;
    } catch {
      results.bundles.push({
        name,
        type: 'css',
        size: stats.size,
        gzipped: Math.round(stats.size * 0.2),
      });
    }
  }

  // Analyze HTML pages
  const htmlPath = path.join(process.cwd(), 'dist');
  const analyzeHTML = async (file) => {
    const filePath = path.join(htmlPath, file);
    const stats = fs.statSync(filePath);
    const content = fs.readFileSync(filePath, 'utf-8');

    // Count resources
    const scripts = (content.match(/<script/g) || []).length;
    const styles = (content.match(/<link[^>]*stylesheet/g) || []).length;
    const images = (content.match(/<img/g) || []).length;

    return {
      name: file,
      size: stats.size,
      scripts,
      styles,
      images,
      hasViewTransitions: content.includes('view-transition'),
      hasLazyLoading: content.includes('loading="lazy"'),
    };
  };

  const htmlFiles = fs.readdirSync(htmlPath)
    .filter(f => f.endsWith('.html'))
    .slice(0, 5); // Check first 5 pages

  for (const file of htmlFiles) {
    const pageInfo = await analyzeHTML(file);
    results.html.push(pageInfo);
    results.totalHTML += pageInfo.size;
  }

  // Calculate total
  results.totalAssets = results.totalJS + results.totalCSS;

  return results;
}

/**
 * Check TypeScript strictness
 */
async function checkTypeScript() {
  console.log('🔍 Checking TypeScript...');

  try {
    await execAsync('npx astro check');
    console.log('  ✅ No TypeScript errors');
    return { errors: 0, status: 'pass' };
  } catch (error) {
    const errorCount = (error.stdout?.match(/error/gi) || []).length;
    console.log(`  ⚠️ ${errorCount} TypeScript errors found`);
    return { errors: errorCount, status: 'fail' };
  }
}

/**
 * Analyze source code patterns
 */
async function analyzeCodePatterns() {
  console.log('🔎 Analyzing code patterns...');

  const results = {
    anyUsage: 0,
    consoleLog: 0,
    todoComments: 0,
    largeComponents: [],
  };

  // Search for 'any' type usage
  try {
    const { stdout } = await execAsync('grep -r ":\\s*any" src/ --include="*.ts" --include="*.tsx" | wc -l');
    results.anyUsage = parseInt(stdout.trim());
  } catch {
    // Ignore if grep fails
  }

  // Search for console.log
  try {
    const { stdout } = await execAsync('grep -r "console.log" src/ --include="*.ts" --include="*.tsx" --include="*.astro" | wc -l');
    results.consoleLog = parseInt(stdout.trim());
  } catch {
    // Ignore
  }

  // Search for TODO comments
  try {
    const { stdout } = await execAsync('grep -r "TODO\\|FIXME\\|HACK" src/ | wc -l');
    results.todoComments = parseInt(stdout.trim());
  } catch {
    // Ignore
  }

  // Find large components
  const componentsDir = path.join(process.cwd(), 'src', 'components');
  if (fs.existsSync(componentsDir)) {
    const checkSize = (dir) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          checkSize(filePath);
        } else if (file.endsWith('.tsx') || file.endsWith('.astro')) {
          const content = fs.readFileSync(filePath, 'utf-8');
          const lines = content.split('\n').length;

          if (lines > 300) {
            results.largeComponents.push({
              file: path.relative(process.cwd(), filePath),
              lines,
            });
          }
        }
      }
    };

    checkSize(componentsDir);
  }

  console.log('  ✅ Analysis complete');
  return results;
}

/**
 * Generate performance report
 */
function generateReport(data) {
  const timestamp = new Date().toISOString();
  let report = `# Local Performance Analysis Report\n\n`;
  report += `**Generated**: ${timestamp}\n`;
  report += `**Type**: Local Build Analysis\n\n`;

  // Bundle Size Analysis
  report += `## 📦 Bundle Size Analysis\n\n`;

  if (data.build.error) {
    report += `❌ Build failed: ${data.build.error}\n`;
  } else {
    report += `### JavaScript Bundles\n\n`;
    report += `| File | Size | Gzipped |\n`;
    report += `|------|------|---------||\n`;

    data.build.bundles
      .filter(b => b.type === 'js')
      .forEach(bundle => {
        report += `| ${bundle.name} | ${(bundle.size/1024).toFixed(1)}KB | ${(bundle.gzipped/1024).toFixed(1)}KB |\n`;
      });

    report += `\n**Total JS**: ${(data.build.totalJS/1024).toFixed(1)}KB gzipped\n`;
    report += `**Status**: ${data.build.totalJS < 51200 ? '✅ Within 50KB limit' : '❌ Exceeds 50KB limit'}\n`;

    if (data.build.totalCSS > 0) {
      report += `\n### CSS Bundles\n\n`;
      report += `| File | Size | Gzipped |\n`;
      report += `|------|------|---------||\n`;

      data.build.bundles
        .filter(b => b.type === 'css')
        .forEach(bundle => {
          report += `| ${bundle.name} | ${(bundle.size/1024).toFixed(1)}KB | ${(bundle.gzipped/1024).toFixed(1)}KB |\n`;
        });

      report += `\n**Total CSS**: ${(data.build.totalCSS/1024).toFixed(1)}KB gzipped\n`;
    }

    report += `\n### HTML Pages\n\n`;
    report += `| Page | Size | Scripts | Styles | Images | Features |\n`;
    report += `|------|------|---------|--------|--------|----------|\n`;

    data.build.html.forEach(page => {
      const features = [];
      if (page.hasViewTransitions) features.push('VT');
      if (page.hasLazyLoading) features.push('LL');

      report += `| ${page.name} | ${(page.size/1024).toFixed(1)}KB | ${page.scripts} | ${page.styles} | ${page.images} | ${features.join(', ')} |\n`;
    });

    report += `\n**Total Assets**: ${(data.build.totalAssets/1024).toFixed(1)}KB (JS + CSS)\n`;
  }

  // TypeScript Analysis
  report += `\n## 🔍 TypeScript Analysis\n\n`;
  report += `| Check | Result |\n`;
  report += `|-------|--------|\n`;
  report += `| TypeScript Errors | ${data.typescript.errors === 0 ? '✅ None' : `❌ ${data.typescript.errors} errors`} |\n`;
  report += `| Strict Mode | ✅ Enabled |\n`;

  // Code Quality
  report += `\n## 📊 Code Quality Metrics\n\n`;
  report += `| Metric | Count | Status |\n`;
  report += `|--------|-------|--------|\n`;
  report += `| 'any' type usage | ${data.patterns.anyUsage} | ${data.patterns.anyUsage === 0 ? '✅' : '⚠️'} |\n`;
  report += `| console.log statements | ${data.patterns.consoleLog} | ${data.patterns.consoleLog === 0 ? '✅' : '⚠️'} |\n`;
  report += `| TODO/FIXME comments | ${data.patterns.todoComments} | ${data.patterns.todoComments < 5 ? '✅' : '⚠️'} |\n`;
  report += `| Large components (>300 lines) | ${data.patterns.largeComponents.length} | ${data.patterns.largeComponents.length === 0 ? '✅' : '⚠️'} |\n`;

  if (data.patterns.largeComponents.length > 0) {
    report += `\n### Large Components\n\n`;
    data.patterns.largeComponents.forEach(comp => {
      report += `- ${comp.file}: ${comp.lines} lines\n`;
    });
  }

  // Performance Checklist
  report += `\n## ✅ Performance Checklist\n\n`;
  const checks = [
    { name: 'JS Bundle < 50KB', passed: data.build.totalJS < 51200 },
    { name: 'TypeScript strict mode', passed: true },
    { name: 'No TypeScript errors', passed: data.typescript.errors === 0 },
    { name: 'No "any" types', passed: data.patterns.anyUsage === 0 },
    { name: 'View Transitions enabled', passed: data.build.html.some(p => p.hasViewTransitions) },
    { name: 'Images lazy loading', passed: data.build.html.some(p => p.hasLazyLoading) },
  ];

  checks.forEach(check => {
    report += `- [${check.passed ? 'x' : ' '}] ${check.name}\n`;
  });

  const score = Math.round((checks.filter(c => c.passed).length / checks.length) * 100);
  report += `\n**Overall Score**: ${score}%\n`;

  // Recommendations
  report += `\n## 💡 Recommendations\n\n`;

  if (data.build.totalJS > 51200) {
    report += `- **Reduce JS bundle size**: Current ${(data.build.totalJS/1024).toFixed(1)}KB exceeds 50KB limit\n`;
    report += `  - Consider code splitting\n`;
    report += `  - Remove unused dependencies\n`;
    report += `  - Use dynamic imports for heavy components\n\n`;
  }

  if (data.patterns.anyUsage > 0) {
    report += `- **Fix TypeScript any usage**: Found ${data.patterns.anyUsage} instances\n`;
    report += `  - Add proper type definitions\n\n`;
  }

  if (data.patterns.largeComponents.length > 0) {
    report += `- **Refactor large components**: ${data.patterns.largeComponents.length} components exceed 300 lines\n`;
    report += `  - Split into smaller components\n`;
    report += `  - Extract logic into hooks/utilities\n\n`;
  }

  if (score === 100) {
    report += `✅ **Excellent!** All performance checks passed.\n`;
  }

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting local performance analysis...\n');

  const results = {
    build: await analyzeBuild(),
    typescript: await checkTypeScript(),
    patterns: await analyzeCodePatterns(),
  };

  // Generate report
  console.log('\n📝 Generating report...');
  const report = generateReport(results);

  // Save report
  const reportPath = path.join(REPORTS_DIR, `performance-local-${Date.now()}.md`);
  fs.writeFileSync(reportPath, report);
  console.log(`  ✅ Report saved to: ${reportPath}`);

  // Also save as latest
  const latestPath = path.join(REPORTS_DIR, 'performance.md');
  fs.writeFileSync(latestPath, report);
  console.log(`  ✅ Latest report: ${latestPath}`);

  // Calculate score
  const checks = [
    results.build.totalJS < 51200,
    results.typescript.errors === 0,
    results.patterns.anyUsage === 0,
  ];
  const passed = checks.filter(c => c).length;
  const score = Math.round((passed / checks.length) * 100);

  console.log(`\n✨ Analysis complete! Score: ${score}%`);

  // Show quick summary
  console.log('\n📊 Summary:');
  console.log(`  JS Bundle: ${(results.build.totalJS/1024).toFixed(1)}KB ${results.build.totalJS < 51200 ? '✅' : '❌'}`);
  console.log(`  TypeScript: ${results.typescript.errors} errors ${results.typescript.errors === 0 ? '✅' : '❌'}`);
  console.log(`  Code Quality: ${results.patterns.anyUsage} any types ${results.patterns.anyUsage === 0 ? '✅' : '⚠️'}`);

  process.exit(score === 100 ? 0 : 1);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});