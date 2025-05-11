// eslint.config.mjs
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import pluginImport from 'eslint-plugin-import';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginReactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist', 'node_modules'] },

  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      'import': pluginImport,
      'react': pluginReact,
      'react-hooks': pluginReactHooks,
      'react-refresh': pluginReactRefresh
    },
    languageOptions: {
      ecmaVersion: 2022,
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
    rules: {
      ...js.configs.recommended.rules,
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,

      // Вимкнути правило про обов'язковий імпорт React
      'react/react-in-jsx-scope': 'off',
      
      // Інші React правила
      'react/prop-types': 'off', // Вимкнути, якщо не використовуєте PropTypes
      'react/jsx-uses-react': 'error', // Допомагає ESLint розпізнавати використання React
      'react/jsx-uses-vars': 'error', // Попереджає про невикористані JSX змінні

      // Правила для імпортів
      'import/no-unresolved': ['error', {
        commonjs: true,
        caseSensitive: true,
        ignore: ['^@/'] // Ігнорувати aliases (@/)
      }],
      
      // Правила для змінних
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_'
      }],

      // Правила для хуків
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Правило для React Refresh
      'react-refresh/only-export-components': 'warn'
    },
    settings: {
      react: {
        version: 'detect' // Автовизначення версії React
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.json'],
          moduleDirectory: ['node_modules', 'src']
        },
        alias: {
          map: [
            ['@', './src'] // Налаштуйте ваші aliases
          ],
          extensions: ['.js', '.jsx']
        }
      }
    }
  }
];