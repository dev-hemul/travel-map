// Імпортуємо стандартні рекомендовані правила ESLint
import js from '@eslint/js';
// Вимкнення конфліктних стилістичних правил ESLint
import prettier from 'eslint-config-prettier';
// Імпортуємо плагін для перевірки імпортів
import eslintPluginImport from 'eslint-plugin-import';
// Імпортуємо плагін для перевірки React-компонентів
import react from 'eslint-plugin-react';
// Імпортуємо плагін для перевірки правильного використання хуків React
import reactHooks from 'eslint-plugin-react-hooks';
// Імпортуємо плагін для підтримки HMR (react-refresh)
import reactRefresh from 'eslint-plugin-react-refresh';
// Імпортуємо правило для відслідковування імпортів які не використовуються
import unusedImports from 'eslint-plugin-unused-imports';
// Імпортуємо глобальні змінні браузера і Node
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules'] },

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react: react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: eslintPluginImport,
      'unused-imports': unusedImports,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,

      'no-unused-vars': 'off',

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      'import/no-unresolved': ['error', { ignore: ['@', '@tailwindcss/vite'] }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      ...prettier.rules,

      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          argsIgnorePattern: '^_',
        },
      ],

      'no-console': ['error', { allow: ['warn', 'error'] }],
      'react-hooks/exhaustive-deps': 'error',
      'unused-imports/no-unused-imports': 'error',

      'max-lines': [
        'error',
        {
          max: 300,
          skipBlankLines: true,
          skipComments: true,
        },
      ],
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
        alias: {
          map: [['@', './src']],
          extensions: ['.js', '.jsx'],
        },
      },
    },
  },

  {
    files: ['server/bin/runners/db.js', 'server/bin/runners/http.js', 'server/bot/grammY.js'],
    rules: {
      'no-console': 'off',
    },
  },
];
