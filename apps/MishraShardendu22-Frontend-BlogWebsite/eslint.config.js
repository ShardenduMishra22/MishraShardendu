import eslintPluginAstro from 'eslint-plugin-astro'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import jsxA11y from 'eslint-plugin-jsx-a11y'

export default [
  // Ignore patterns
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'public/',
      'Blog-Temp-Folders/',
      'Blog-Temp/',
      'NextJS/',
    ],
  },

  // Base configuration for all files
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,astro}'],
    plugins: {
      '@typescript-eslint': tseslint,
    },
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'prefer-const': 'warn',
      'no-var': 'error',
    },
  },

  // TypeScript and TSX files
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
    },
  },

  // Astro files
  ...eslintPluginAstro.configs.recommended,
]
