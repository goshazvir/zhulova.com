#!/usr/bin/env node

/**
 * Component Structure Analysis
 * Analyzes current component organization and proposes new structure
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(process.cwd(), 'src', 'components');
const REPORTS_DIR = path.join(__dirname, '..', 'reports');

// Ensure reports directory exists
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

/**
 * Analyze current component structure
 */
function analyzeCurrentStructure() {
  console.log('🔍 Analyzing current component structure...\n');

  const components = {
    flat: [],
    folderBased: [],
    total: 0,
    byCategory: {
      common: [],
      layout: [],
      sections: [],
      forms: [],
      cards: []
    }
  };

  const scanDir = (dir, category = null) => {
    if (!fs.existsSync(dir)) return;

    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);

      if (stat.isDirectory()) {
        // Check if it's a component folder (has index file)
        const hasIndex = fs.existsSync(path.join(itemPath, 'index.tsx')) ||
                         fs.existsSync(path.join(itemPath, 'index.astro'));

        if (hasIndex) {
          components.folderBased.push({
            name: item,
            path: path.relative(COMPONENTS_DIR, itemPath),
            hasTest: fs.existsSync(path.join(itemPath, `${item}.test.tsx`))
          });
        } else {
          // It's a category folder
          const newCategory = path.basename(itemPath);
          scanDir(itemPath, newCategory);
        }
      } else if (item.endsWith('.tsx') || item.endsWith('.astro')) {
        const name = item.replace(/\.(tsx|astro)$/, '');
        const component = {
          name,
          file: item,
          path: path.relative(COMPONENTS_DIR, itemPath),
          category: category || 'root',
          type: item.endsWith('.tsx') ? 'React' : 'Astro',
          lines: fs.readFileSync(itemPath, 'utf-8').split('\n').length
        };

        components.flat.push(component);
        components.total++;

        if (category && components.byCategory[category]) {
          components.byCategory[category].push(component);
        }
      }
    });
  };

  scanDir(COMPONENTS_DIR);

  return components;
}

/**
 * Propose new folder-based structure
 */
function proposeNewStructure(current) {
  console.log('📐 Proposing new folder-based structure...\n');

  const proposed = {
    migrations: [],
    structure: {},
    benefits: [],
    effort: 0
  };

  // Create migration plan for each component
  current.flat.forEach(comp => {
    const migration = {
      from: comp.path,
      to: `${comp.category}/${comp.name}/`,
      files: [
        `index.${comp.type === 'React' ? 'tsx' : 'astro'}`,
        `${comp.name}.test.${comp.type === 'React' ? 'tsx' : 'ts'}`,
        `${comp.name}.stories.tsx` // Optional Storybook
      ],
      effort: comp.lines > 200 ? 'high' : comp.lines > 100 ? 'medium' : 'low'
    };

    proposed.migrations.push(migration);

    // Update effort score
    if (migration.effort === 'high') proposed.effort += 3;
    else if (migration.effort === 'medium') proposed.effort += 2;
    else proposed.effort += 1;
  });

  // Define new structure
  proposed.structure = {
    'components/': {
      'common/': {
        'Button/': ['index.tsx', 'Button.test.tsx', 'Button.stories.tsx'],
        'Card/': ['index.tsx', 'Card.test.tsx'],
        'Input/': ['index.tsx', 'Input.test.tsx'],
        'Modal/': ['index.tsx', 'Modal.test.tsx']
      },
      'layout/': {
        'Header/': ['index.astro', 'Header.test.ts'],
        'Footer/': ['index.astro', 'Footer.test.ts'],
        'Navigation/': ['index.astro', 'Navigation.test.ts'],
        'MobileMenu/': ['index.tsx', 'MobileMenu.test.tsx']
      },
      'sections/': {
        'HeroSection/': ['index.astro', 'HeroSection.test.ts', 'components/'],
        'TestimonialsSection/': ['index.astro', 'TestimonialsSection.test.ts'],
        'CoursesSection/': ['index.astro', 'CoursesSection.test.ts']
      },
      'forms/': {
        'ConsultationModal/': ['index.tsx', 'ConsultationModal.test.tsx', 'validation.ts'],
        'ContactForm/': ['index.tsx', 'ContactForm.test.tsx']
      }
    }
  };

  proposed.benefits = [
    'Co-located tests with components',
    'Better organization and discoverability',
    'Easier to maintain and scale',
    'Supports Storybook stories',
    'Clear separation of concerns',
    'Enables code splitting per component',
    'Facilitates component documentation'
  ];

  return proposed;
}

/**
 * Generate testability report
 */
function analyzeTestability(current, proposed) {
  console.log('🧪 Analyzing testability...\n');

  const analysis = {
    currentTestability: 0,
    proposedTestability: 0,
    blockers: [],
    improvements: []
  };

  // Analyze current testability
  current.flat.forEach(comp => {
    // Check for testability issues
    if (comp.lines > 300) {
      analysis.blockers.push(`${comp.name}: Too large (${comp.lines} lines) - needs splitting`);
    }

    if (comp.type === 'Astro') {
      // Astro components need different testing approach
      analysis.improvements.push(`${comp.name}: Astro component - use @astrojs/testing-library`);
    }

    // Simple testability score
    if (comp.lines < 200 && comp.category !== 'sections') {
      analysis.currentTestability++;
    }
  });

  // Calculate testability percentage
  analysis.currentTestability = Math.round((analysis.currentTestability / current.total) * 100);
  analysis.proposedTestability = 85; // Expected after restructure

  return analysis;
}

/**
 * Generate migration script
 */
function generateMigrationScript(proposed) {
  let script = `#!/bin/bash
# Component Structure Migration Script
# Generated: ${new Date().toISOString()}

echo "🚀 Starting component migration to folder-based structure..."

# Create backup
echo "📦 Creating backup..."
cp -r src/components src/components.backup

`;

  proposed.migrations.forEach((migration, i) => {
    const componentName = migration.from.split('/').pop().replace(/\.(tsx|astro)$/, '');
    const newDir = `src/components/${migration.to}`;

    script += `
# Migration ${i + 1}: ${componentName}
echo "  Migrating ${componentName}..."
mkdir -p ${newDir}
mv src/components/${migration.from} ${newDir}index.${migration.from.endsWith('.tsx') ? 'tsx' : 'astro'}

# Create test file template
cat > ${newDir}${componentName}.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ${componentName} from './index';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    const { container } = render(<${componentName} />);
    expect(container).toBeTruthy();
  });
});
EOF
`;
  });

  script += `
echo "✅ Migration complete!"
echo "📝 Next steps:"
echo "  1. Update imports in all files"
echo "  2. Run tests to verify nothing broke"
echo "  3. Remove backup: rm -rf src/components.backup"
`;

  return script;
}

/**
 * Generate report
 */
function generateReport(current, proposed, testability) {
  const timestamp = new Date().toISOString();
  let report = `# Component Structure Analysis Report\n\n`;
  report += `**Generated**: ${timestamp}\n\n`;

  // Current Structure
  report += `## 📊 Current Structure\n\n`;
  report += `**Total Components**: ${current.total}\n`;
  report += `**Structure Type**: Flat (files in category folders)\n\n`;

  report += `### Component Distribution\n\n`;
  report += `| Category | Count | Components |\n`;
  report += `|----------|-------|------------|\n`;

  Object.entries(current.byCategory).forEach(([category, components]) => {
    if (components.length > 0) {
      const names = components.slice(0, 3).map(c => c.name).join(', ');
      const more = components.length > 3 ? ` (+${components.length - 3} more)` : '';
      report += `| ${category} | ${components.length} | ${names}${more} |\n`;
    }
  });

  // Large Components
  const largeComponents = current.flat.filter(c => c.lines > 300);
  if (largeComponents.length > 0) {
    report += `\n### ⚠️ Large Components (>300 lines)\n\n`;
    largeComponents.forEach(comp => {
      report += `- **${comp.name}**: ${comp.lines} lines (${comp.type})\n`;
    });
  }

  // Testability Analysis
  report += `\n## 🧪 Testability Analysis\n\n`;
  report += `**Current Testability Score**: ${testability.currentTestability}%\n`;
  report += `**Expected After Migration**: ${testability.proposedTestability}%\n\n`;

  if (testability.blockers.length > 0) {
    report += `### Blockers\n\n`;
    testability.blockers.forEach(blocker => {
      report += `- ${blocker}\n`;
    });
    report += '\n';
  }

  // Proposed Structure
  report += `## 🏗️ Proposed Folder-Based Structure\n\n`;
  report += `### Benefits\n\n`;
  proposed.benefits.forEach(benefit => {
    report += `- ✅ ${benefit}\n`;
  });

  report += `\n### Example Structure\n\n`;
  report += '```\n';
  report += `src/components/
├── common/
│   ├── Button/
│   │   ├── index.tsx           # Component
│   │   ├── Button.test.tsx     # Unit tests
│   │   └── Button.stories.tsx  # Storybook
│   └── Modal/
│       ├── index.tsx
│       └── Modal.test.tsx
├── layout/
│   ├── Header/
│   │   ├── index.astro
│   │   └── Header.test.ts
│   └── Footer/
│       ├── index.astro
│       └── Footer.test.ts
└── forms/
    └── ConsultationModal/
        ├── index.tsx
        ├── ConsultationModal.test.tsx
        └── validation.ts        # Co-located utilities\n`;
  report += '```\n';

  // Migration Effort
  report += `\n## 📈 Migration Plan\n\n`;
  report += `**Total Effort Score**: ${proposed.effort} points\n`;
  report += `**Estimated Time**: ${Math.ceil(proposed.effort / 10)} days\n\n`;

  report += `### Migration Priority\n\n`;
  report += `1. **Phase 1** (Day 1): Common components (Button, Modal, Input)\n`;
  report += `2. **Phase 2** (Day 2): Form components (ConsultationModal, ContactForm)\n`;
  report += `3. **Phase 3** (Day 3): Layout components (Header, Footer, Navigation)\n`;
  report += `4. **Phase 4** (Day 4-5): Section components (split large ones first)\n`;

  // Testing Strategy
  report += `\n## 🎯 Testing Strategy\n\n`;
  report += `### Unit Testing Stack\n\n`;
  report += `- **Framework**: Vitest\n`;
  report += `- **React Testing**: @testing-library/react\n`;
  report += `- **Astro Testing**: @astrojs/testing-library\n`;
  report += `- **Coverage Goal**: 80%\n\n`;

  report += `### Test File Conventions\n\n`;
  report += `- React components: \`ComponentName.test.tsx\`\n`;
  report += `- Astro components: \`ComponentName.test.ts\`\n`;
  report += `- Integration tests: \`tests/integration/*.test.ts\`\n`;
  report += `- E2E tests: \`tests/e2e/*.spec.ts\`\n\n`;

  // Recommendations
  report += `## 💡 Recommendations\n\n`;
  report += `1. **Start with new components** - Use folder structure for any new components\n`;
  report += `2. **Migrate incrementally** - One category at a time\n`;
  report += `3. **Split large components** - Before migration, refactor components >300 lines\n`;
  report += `4. **Add tests during migration** - Write at least one test per component\n`;
  report += `5. **Update imports gradually** - Use path aliases to simplify imports\n`;
  report += `6. **Document as you go** - Add JSDoc comments and README files\n`;

  return report;
}

/**
 * Main execution
 */
function main() {
  console.log('🏗️ Component Structure Analysis\n');
  console.log('=' . repeat(50) + '\n');

  // Analyze current structure
  const current = analyzeCurrentStructure();
  console.log(`📦 Found ${current.total} components\n`);

  // Propose new structure
  const proposed = proposeNewStructure(current);
  console.log(`🎯 Proposed ${proposed.migrations.length} migrations\n`);

  // Analyze testability
  const testability = analyzeTestability(current, proposed);

  // Generate report
  console.log('📝 Generating reports...');

  const report = generateReport(current, proposed, testability);
  const reportPath = path.join(REPORTS_DIR, 'component-structure.md');
  fs.writeFileSync(reportPath, report);
  console.log(`  ✅ Analysis report: ${reportPath}`);

  // Generate migration script
  const script = generateMigrationScript(proposed);
  const scriptPath = path.join(REPORTS_DIR, 'migrate-components.sh');
  fs.writeFileSync(scriptPath, script);
  fs.chmodSync(scriptPath, '755');
  console.log(`  ✅ Migration script: ${scriptPath}`);

  // Summary
  console.log('\n' + '=' . repeat(50));
  console.log('\n📊 Summary:\n');
  console.log(`  Current: ${current.total} components (flat structure)`);
  console.log(`  Testability: ${testability.currentTestability}% → ${testability.proposedTestability}%`);
  console.log(`  Migration effort: ${proposed.effort} points (~${Math.ceil(proposed.effort / 10)} days)`);
  console.log('\n✨ Analysis complete!');
}

// Run the script
main();