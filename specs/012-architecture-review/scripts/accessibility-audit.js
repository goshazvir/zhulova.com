#!/usr/bin/env node

/**
 * Accessibility Audit Script
 * Checks for WCAG AA compliance issues
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
 * Check for common accessibility issues in source code
 */
async function checkAccessibilityPatterns() {
  console.log('🔍 Checking accessibility patterns...\n');

  const results = {
    missingAltText: [],
    missingAriaLabels: [],
    headingHierarchy: [],
    colorContrastIssues: [],
    focusIndicators: [],
    semanticHTML: [],
    keyboardAccessibility: []
  };

  // Check for images without alt text
  console.log('  Checking images for alt text...');
  try {
    const { stdout } = await execAsync('grep -r "<Image\\|<img" src/ --include="*.astro" --include="*.tsx" | grep -v "alt="');
    const lines = stdout.trim().split('\n').filter(Boolean);
    results.missingAltText = lines.map(line => {
      const [file] = line.split(':');
      return file.replace('src/', '');
    });
  } catch {
    // No issues found (grep returns error when no matches)
  }

  // Check for buttons/links without aria-labels
  console.log('  Checking interactive elements...');
  try {
    const { stdout } = await execAsync('grep -r "<button\\|<a" src/ --include="*.astro" --include="*.tsx"');
    const lines = stdout.trim().split('\n').filter(Boolean);

    lines.forEach(line => {
      if (!line.includes('aria-label') && !line.includes('>') && line.includes('icon')) {
        const [file] = line.split(':');
        results.missingAriaLabels.push(file.replace('src/', ''));
      }
    });
  } catch {
    // Ignore
  }

  // Check heading hierarchy
  console.log('  Checking heading hierarchy...');
  const checkHeadings = async (dir) => {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory() && !file.startsWith('.')) {
        await checkHeadings(filePath);
      } else if (file.endsWith('.astro') || file.endsWith('.tsx')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        const headings = content.match(/<h[1-6]/g) || [];

        let lastLevel = 0;
        let hasIssue = false;

        headings.forEach(h => {
          const level = parseInt(h.charAt(2));
          if (lastLevel > 0 && level > lastLevel + 1) {
            hasIssue = true;
          }
          lastLevel = level;
        });

        if (hasIssue) {
          results.headingHierarchy.push(path.relative('src', filePath));
        }

        // Check for multiple h1s
        const h1Count = (content.match(/<h1/g) || []).length;
        if (h1Count > 1) {
          results.headingHierarchy.push(`${path.relative('src', filePath)} (multiple h1)`);
        }
      }
    }
  };

  await checkHeadings(path.join(process.cwd(), 'src'));

  // Check color usage for contrast issues
  console.log('  Checking color contrast...');
  const colorPatterns = [
    { pattern: 'text-gold-[1-4]00', issue: 'Gold text may have low contrast' },
    { pattern: 'text-sage-[1-4]00', issue: 'Sage text may have low contrast' },
    { pattern: 'text-gray-[1-4]00', issue: 'Light gray text may have low contrast' },
  ];

  for (const { pattern, issue } of colorPatterns) {
    try {
      const { stdout } = await execAsync(`grep -r "${pattern}" src/ --include="*.astro" --include="*.tsx"`);
      const lines = stdout.trim().split('\n').filter(Boolean);

      lines.forEach(line => {
        const [file] = line.split(':');
        results.colorContrastIssues.push({
          file: file.replace('src/', ''),
          issue
        });
      });
    } catch {
      // No issues
    }
  }

  // Check for focus indicators
  console.log('  Checking focus indicators...');
  try {
    const globalCSS = fs.readFileSync(path.join(process.cwd(), 'src/styles/global.css'), 'utf-8');

    if (!globalCSS.includes('focus:') && !globalCSS.includes('focus-visible')) {
      results.focusIndicators.push('Missing global focus styles');
    }
  } catch {
    results.focusIndicators.push('global.css not found');
  }

  // Check semantic HTML
  console.log('  Checking semantic HTML...');
  const semanticChecks = [
    { tag: '<main', required: true, name: 'main' },
    { tag: '<nav', required: true, name: 'nav' },
    { tag: '<header', required: true, name: 'header' },
    { tag: '<footer', required: true, name: 'footer' },
    { tag: '<article', required: false, name: 'article' },
    { tag: '<section', required: false, name: 'section' },
  ];

  for (const check of semanticChecks) {
    try {
      const { stdout } = await execAsync(`grep -r "${check.tag}" src/layouts/ src/components/ --include="*.astro"`);
      const count = stdout.trim().split('\n').filter(Boolean).length;

      if (check.required && count === 0) {
        results.semanticHTML.push(`Missing ${check.name} element`);
      }
    } catch {
      if (check.required) {
        results.semanticHTML.push(`Missing ${check.name} element`);
      }
    }
  }

  // Check keyboard accessibility
  console.log('  Checking keyboard accessibility...');
  try {
    const { stdout } = await execAsync('grep -r "onClick" src/ --include="*.tsx" --include="*.astro"');
    const lines = stdout.trim().split('\n').filter(Boolean);

    lines.forEach(line => {
      if (!line.includes('onKeyDown') && !line.includes('onKeyPress')) {
        const [file] = line.split(':');
        const fileName = file.replace('src/', '');
        if (!results.keyboardAccessibility.includes(fileName)) {
          results.keyboardAccessibility.push(fileName);
        }
      }
    });
  } catch {
    // No onClick handlers found
  }

  return results;
}

/**
 * Check ARIA patterns
 */
async function checkARIAPatterns() {
  console.log('\n🏷️ Checking ARIA patterns...\n');

  const results = {
    modalAccessibility: [],
    formLabels: [],
    liveRegions: [],
    landmarks: []
  };

  // Check modals for proper ARIA
  console.log('  Checking modals...');
  try {
    const { stdout } = await execAsync('grep -r "Modal\\|modal" src/components/ --include="*.tsx"');
    const files = stdout.trim().split('\n').filter(Boolean).map(line => line.split(':')[0]);

    for (const file of [...new Set(files)]) {
      const content = fs.readFileSync(file, 'utf-8');

      if (!content.includes('role="dialog"')) {
        results.modalAccessibility.push(`${file}: Missing role="dialog"`);
      }
      if (!content.includes('aria-modal')) {
        results.modalAccessibility.push(`${file}: Missing aria-modal`);
      }
      if (!content.includes('aria-labelledby')) {
        results.modalAccessibility.push(`${file}: Missing aria-labelledby`);
      }
    }
  } catch {
    // No modals found
  }

  // Check form labels
  console.log('  Checking form labels...');
  try {
    const { stdout } = await execAsync('grep -r "<input\\|<textarea\\|<select" src/ --include="*.tsx" --include="*.astro"');
    const lines = stdout.trim().split('\n').filter(Boolean);

    lines.forEach(line => {
      if (!line.includes('aria-label') && !line.includes('id=')) {
        const [file] = line.split(':');
        results.formLabels.push(file.replace('src/', ''));
      }
    });
  } catch {
    // No form elements
  }

  return results;
}

/**
 * Generate accessibility report
 */
function generateReport(patterns, aria) {
  const timestamp = new Date().toISOString();
  let report = `# Accessibility Audit Report\n\n`;
  report += `**Generated**: ${timestamp}\n`;
  report += `**Standard**: WCAG AA Compliance\n\n`;

  // Summary
  const totalIssues =
    patterns.missingAltText.length +
    patterns.missingAriaLabels.length +
    patterns.headingHierarchy.length +
    patterns.colorContrastIssues.length +
    patterns.focusIndicators.length +
    patterns.semanticHTML.length +
    patterns.keyboardAccessibility.length +
    aria.modalAccessibility.length +
    aria.formLabels.length;

  report += `## 📊 Summary\n\n`;
  report += `**Total Issues Found**: ${totalIssues}\n\n`;

  const criticalCount = patterns.missingAltText.length + patterns.semanticHTML.length;
  const seriousCount = patterns.missingAriaLabels.length + patterns.keyboardAccessibility.length;
  const moderateCount = patterns.headingHierarchy.length + patterns.colorContrastIssues.length;
  const minorCount = patterns.focusIndicators.length;

  report += `| Severity | Count | Status |\n`;
  report += `|----------|-------|--------|\n`;
  report += `| Critical | ${criticalCount} | ${criticalCount === 0 ? '✅' : '❌'} |\n`;
  report += `| Serious | ${seriousCount} | ${seriousCount === 0 ? '✅' : '⚠️'} |\n`;
  report += `| Moderate | ${moderateCount} | ${moderateCount === 0 ? '✅' : '⚠️'} |\n`;
  report += `| Minor | ${minorCount} | ${minorCount === 0 ? '✅' : 'ℹ️'} |\n`;

  // Detailed Issues
  report += `\n## 🔍 Detailed Findings\n\n`;

  // Critical Issues
  if (patterns.missingAltText.length > 0) {
    report += `### ❌ Critical: Images Without Alt Text\n\n`;
    patterns.missingAltText.forEach(file => {
      report += `- ${file}\n`;
    });
    report += '\n';
  }

  if (patterns.semanticHTML.length > 0) {
    report += `### ❌ Critical: Missing Semantic HTML Elements\n\n`;
    patterns.semanticHTML.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += '\n';
  }

  // Serious Issues
  if (patterns.missingAriaLabels.length > 0) {
    report += `### ⚠️ Serious: Interactive Elements Without ARIA Labels\n\n`;
    patterns.missingAriaLabels.forEach(file => {
      report += `- ${file}\n`;
    });
    report += '\n';
  }

  if (patterns.keyboardAccessibility.length > 0) {
    report += `### ⚠️ Serious: Keyboard Accessibility Issues\n\n`;
    report += `Files with onClick but no keyboard handlers:\n\n`;
    patterns.keyboardAccessibility.forEach(file => {
      report += `- ${file}\n`;
    });
    report += '\n';
  }

  // Moderate Issues
  if (patterns.headingHierarchy.length > 0) {
    report += `### ⚠️ Moderate: Heading Hierarchy Issues\n\n`;
    patterns.headingHierarchy.forEach(file => {
      report += `- ${file}\n`;
    });
    report += '\n';
  }

  if (patterns.colorContrastIssues.length > 0) {
    report += `### ⚠️ Moderate: Potential Color Contrast Issues\n\n`;
    patterns.colorContrastIssues.forEach(({ file, issue }) => {
      report += `- ${file}: ${issue}\n`;
    });
    report += '\n';
  }

  // ARIA Issues
  if (aria.modalAccessibility.length > 0) {
    report += `### ⚠️ Modal Accessibility Issues\n\n`;
    aria.modalAccessibility.forEach(issue => {
      report += `- ${issue}\n`;
    });
    report += '\n';
  }

  if (aria.formLabels.length > 0) {
    report += `### ⚠️ Form Label Issues\n\n`;
    aria.formLabels.forEach(file => {
      report += `- ${file}: Form element may need proper label\n`;
    });
    report += '\n';
  }

  // Recommendations
  report += `## 💡 Recommendations\n\n`;
  report += `### Immediate Actions (Critical)\n\n`;

  if (patterns.missingAltText.length > 0) {
    report += `1. **Add alt text to all images**\n`;
    report += `   - Use descriptive text for informative images\n`;
    report += `   - Use alt="" for decorative images\n\n`;
  }

  if (patterns.semanticHTML.length > 0) {
    report += `2. **Add missing semantic HTML elements**\n`;
    report += `   - Ensure each page has <main>, <nav>, <header>, <footer>\n`;
    report += `   - Use <section> and <article> appropriately\n\n`;
  }

  report += `### Short-term Improvements (Serious)\n\n`;

  if (patterns.keyboardAccessibility.length > 0) {
    report += `1. **Improve keyboard accessibility**\n`;
    report += `   - Add onKeyDown handlers for all onClick events\n`;
    report += `   - Ensure all interactive elements are keyboard accessible\n\n`;
  }

  if (patterns.missingAriaLabels.length > 0) {
    report += `2. **Add ARIA labels to icon buttons**\n`;
    report += `   - Use aria-label for icon-only buttons\n`;
    report += `   - Provide screen reader context\n\n`;
  }

  // Compliance Score
  const score = Math.max(0, 100 - (criticalCount * 20) - (seriousCount * 10) - (moderateCount * 5) - (minorCount * 2));
  report += `\n## 🏆 Compliance Score\n\n`;
  report += `**WCAG AA Compliance**: ${score}%\n\n`;

  if (score >= 95) {
    report += `✅ **Excellent!** Minor issues only.\n`;
  } else if (score >= 80) {
    report += `⚠️ **Good** but needs improvement.\n`;
  } else {
    report += `❌ **Needs Work** - Critical issues found.\n`;
  }

  return report;
}

/**
 * Main execution
 */
async function main() {
  console.log('♿ Starting accessibility audit...\n');

  const patterns = await checkAccessibilityPatterns();
  const aria = await checkARIAPatterns();

  // Generate report
  console.log('\n📝 Generating report...');
  const report = generateReport(patterns, aria);

  // Save report
  const reportPath = path.join(REPORTS_DIR, 'accessibility.md');
  fs.writeFileSync(reportPath, report);
  console.log(`  ✅ Report saved to: ${reportPath}`);

  // Show summary
  const totalIssues =
    patterns.missingAltText.length +
    patterns.missingAriaLabels.length +
    patterns.headingHierarchy.length +
    patterns.colorContrastIssues.length;

  console.log('\n📊 Summary:');
  console.log(`  Missing alt text: ${patterns.missingAltText.length} ${patterns.missingAltText.length === 0 ? '✅' : '❌'}`);
  console.log(`  Missing ARIA labels: ${patterns.missingAriaLabels.length} ${patterns.missingAriaLabels.length === 0 ? '✅' : '⚠️'}`);
  console.log(`  Heading issues: ${patterns.headingHierarchy.length} ${patterns.headingHierarchy.length === 0 ? '✅' : '⚠️'}`);
  console.log(`  Keyboard issues: ${patterns.keyboardAccessibility.length} ${patterns.keyboardAccessibility.length === 0 ? '✅' : '⚠️'}`);

  console.log(`\n✨ Audit complete! Total issues: ${totalIssues}`);

  process.exit(totalIssues === 0 ? 0 : 1);
}

// Run the script
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});