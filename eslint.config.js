import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';

export default [
  // Ignore patterns
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      '.vercel/',
      'coverage/',
      '*.min.js',
      'playwright-report/',
      'test-results/',
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript-specific rules
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'warn',

      // Disable base rules that conflict with TypeScript
      'no-unused-vars': 'off',
      'no-undef': 'off', // TypeScript handles this
    },
  },

  // Astro files
  ...astroPlugin.configs.recommended,

  // Test files - more relaxed rules
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
];
