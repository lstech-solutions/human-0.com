import tsParser from '@typescript-eslint/parser';

export default [
  {
    files: ['app/**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    rules: {
      'no-restricted-globals': [
        'error',
        {
          name: 'fetch',
          message: 'Use apiClient from lib/api-client instead of raw fetch in app code.',
        },
      ],
    },
  },
  {
    files: ['app/api/**/*.{ts,tsx,js,jsx}'],
    rules: {
      'no-restricted-globals': 'off',
    },
  },
];
