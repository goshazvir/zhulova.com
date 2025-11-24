#!/bin/bash
# Component Structure Migration Script
# Generated: 2025-11-24T10:38:23.809Z

echo "🚀 Starting component migration to folder-based structure..."

# Create backup
echo "📦 Creating backup..."
cp -r src/components src/components.backup


# Migration 1: Button
echo "  Migrating Button..."
mkdir -p src/components/common/Button/
mv src/components/common/Button.tsx src/components/common/Button/index.tsx

# Create test file template
cat > src/components/common/Button/Button.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Button from './index';

describe('Button', () => {
  it('renders without crashing', () => {
    const { container } = render(<Button />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 2: Input
echo "  Migrating Input..."
mkdir -p src/components/common/Input/
mv src/components/common/Input.tsx src/components/common/Input/index.tsx

# Create test file template
cat > src/components/common/Input/Input.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Input from './index';

describe('Input', () => {
  it('renders without crashing', () => {
    const { container } = render(<Input />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 3: Modal
echo "  Migrating Modal..."
mkdir -p src/components/common/Modal/
mv src/components/common/Modal.tsx src/components/common/Modal/index.tsx

# Create test file template
cat > src/components/common/Modal/Modal.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Modal from './index';

describe('Modal', () => {
  it('renders without crashing', () => {
    const { container } = render(<Modal />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 4: ConsultationModal
echo "  Migrating ConsultationModal..."
mkdir -p src/components/forms/ConsultationModal/
mv src/components/forms/ConsultationModal.tsx src/components/forms/ConsultationModal/index.tsx

# Create test file template
cat > src/components/forms/ConsultationModal/ConsultationModal.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import ConsultationModal from './index';

describe('ConsultationModal', () => {
  it('renders without crashing', () => {
    const { container } = render(<ConsultationModal />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 5: Footer
echo "  Migrating Footer..."
mkdir -p src/components/layout/Footer/
mv src/components/layout/Footer.astro src/components/layout/Footer/index.astro

# Create test file template
cat > src/components/layout/Footer/Footer.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Footer from './index';

describe('Footer', () => {
  it('renders without crashing', () => {
    const { container } = render(<Footer />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 6: Header
echo "  Migrating Header..."
mkdir -p src/components/layout/Header/
mv src/components/layout/Header.astro src/components/layout/Header/index.astro

# Create test file template
cat > src/components/layout/Header/Header.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Header from './index';

describe('Header', () => {
  it('renders without crashing', () => {
    const { container } = render(<Header />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 7: MobileMenu
echo "  Migrating MobileMenu..."
mkdir -p src/components/layout/MobileMenu/
mv src/components/layout/MobileMenu.tsx src/components/layout/MobileMenu/index.tsx

# Create test file template
cat > src/components/layout/MobileMenu/MobileMenu.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MobileMenu from './index';

describe('MobileMenu', () => {
  it('renders without crashing', () => {
    const { container } = render(<MobileMenu />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 8: CaseStudiesSection
echo "  Migrating CaseStudiesSection..."
mkdir -p src/components/sections/CaseStudiesSection/
mv src/components/sections/CaseStudiesSection.astro src/components/sections/CaseStudiesSection/index.astro

# Create test file template
cat > src/components/sections/CaseStudiesSection/CaseStudiesSection.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CaseStudiesSection from './index';

describe('CaseStudiesSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<CaseStudiesSection />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 9: CoursesPreview
echo "  Migrating CoursesPreview..."
mkdir -p src/components/sections/CoursesPreview/
mv src/components/sections/CoursesPreview.astro src/components/sections/CoursesPreview/index.astro

# Create test file template
cat > src/components/sections/CoursesPreview/CoursesPreview.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import CoursesPreview from './index';

describe('CoursesPreview', () => {
  it('renders without crashing', () => {
    const { container } = render(<CoursesPreview />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 10: HeroSection
echo "  Migrating HeroSection..."
mkdir -p src/components/sections/HeroSection/
mv src/components/sections/HeroSection.astro src/components/sections/HeroSection/index.astro

# Create test file template
cat > src/components/sections/HeroSection/HeroSection.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import HeroSection from './index';

describe('HeroSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<HeroSection />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 11: MotivationalQuote
echo "  Migrating MotivationalQuote..."
mkdir -p src/components/sections/MotivationalQuote/
mv src/components/sections/MotivationalQuote.astro src/components/sections/MotivationalQuote/index.astro

# Create test file template
cat > src/components/sections/MotivationalQuote/MotivationalQuote.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MotivationalQuote from './index';

describe('MotivationalQuote', () => {
  it('renders without crashing', () => {
    const { container } = render(<MotivationalQuote />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 12: QuestionsSection
echo "  Migrating QuestionsSection..."
mkdir -p src/components/sections/QuestionsSection/
mv src/components/sections/QuestionsSection.astro src/components/sections/QuestionsSection/index.astro

# Create test file template
cat > src/components/sections/QuestionsSection/QuestionsSection.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import QuestionsSection from './index';

describe('QuestionsSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<QuestionsSection />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 13: StatsSection
echo "  Migrating StatsSection..."
mkdir -p src/components/sections/StatsSection/
mv src/components/sections/StatsSection.astro src/components/sections/StatsSection/index.astro

# Create test file template
cat > src/components/sections/StatsSection/StatsSection.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import StatsSection from './index';

describe('StatsSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<StatsSection />);
    expect(container).toBeTruthy();
  });
});
EOF

# Migration 14: TestimonialsSection
echo "  Migrating TestimonialsSection..."
mkdir -p src/components/sections/TestimonialsSection/
mv src/components/sections/TestimonialsSection.astro src/components/sections/TestimonialsSection/index.astro

# Create test file template
cat > src/components/sections/TestimonialsSection/TestimonialsSection.test.tsx << 'EOF'
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import TestimonialsSection from './index';

describe('TestimonialsSection', () => {
  it('renders without crashing', () => {
    const { container } = render(<TestimonialsSection />);
    expect(container).toBeTruthy();
  });
});
EOF

echo "✅ Migration complete!"
echo "📝 Next steps:"
echo "  1. Update imports in all files"
echo "  2. Run tests to verify nothing broke"
echo "  3. Remove backup: rm -rf src/components.backup"
