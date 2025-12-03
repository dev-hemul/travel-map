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

// Імпортуємо глобальні змінні браузера і Node
import globals from 'globals';

export default [
  // Ігнорування build/модулів
  { ignores: ['dist', 'node_modules'] },

  // Загальні правила для всіх JS/JSX файлів
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
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
    },
    rules: {
      // Разрешаем только warn/error глобально
      'no-console': ['error', { allow: ['warn', 'error'] }],

      // Базовые рекомендации
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,

      // Не дозволяти невикористані змінні, крім тих, що починаються з великої літери або _
      'no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^[A-Z_]|^colors$',
        },
      ],

      // React Refresh
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Import rules
      'import/no-unresolved': ['error', { ignore: ['@tailwindcss/vite'] }],
      'import/order': [
        'warn',
        {
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

      // React специфічні правила
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Вимикаємо конфліктні правила prettier
      ...prettier.rules,
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        node: { extensions: ['.js', '.jsx'] },
      },
    },
  },

  // Override для Node-файлів, де console.log дозволений
  {
    files: ['server/bin/runners/db.js', 'server/bin/runners/http.js', 'server/bot/grammY.js'],
    rules: {
      'no-console': 'off', // дозволяємо всі console
    },
  },
];
