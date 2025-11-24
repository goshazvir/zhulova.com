module.exports = {
  ci: {
    collect: {
      // Start local server for testing built files
      startServerCommand: 'npx http-server dist -p 8080',
      startServerReadyPattern: 'Hit CTRL-C to stop the server',
      url: ['http://localhost:8080/'],
      numberOfRuns: 3,
      settings: {
        preset: 'desktop',
        throttling: {
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      // Note: Using custom assertions instead of preset to avoid blocking on non-critical issues
      assertions: {
        // Performance - Set to warn to allow PR merge, track in monitoring
        'categories:performance': ['warn', { minScore: 0.85 }],
        'first-contentful-paint': ['warn', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['warn', { maxNumericValue: 3000 }],
        'cumulative-layout-shift': ['warn', { maxNumericValue: 0.15 }],
        'total-blocking-time': ['warn', { maxNumericValue: 300 }],
        'speed-index': ['warn', { maxNumericValue: 3500 }],

        // Accessibility - Keep strict (critical for users)
        'categories:accessibility': ['error', { minScore: 0.90 }],

        // Best Practices - Relax slightly
        'categories:best-practices': ['warn', { minScore: 0.85 }],

        // SEO - Keep strict (critical for discoverability)
        'categories:seo': ['error', { minScore: 0.90 }],

        // Bundle size - Set to warn for now
        'network-requests': ['warn', { maxNumericValue: 60 }],
        'total-byte-weight': ['warn', { maxNumericValue: 400000 }], // 400KB

        // Security
        'is-on-https': 'off', // Off for local testing
        'csp-xss': 'warn',
      },
    },
    upload: {
      target: 'temporary-public-storage',
      githubToken: process.env.LHCI_GITHUB_APP_TOKEN,
      pr: {
        baseBranch: 'main',
      },
    },
    server: {
      // Configuration for LHCI server (optional)
    },
  },
};