// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettier from 'eslint-config-prettier';

export default [
  // =========================
  // 無視設定
  // =========================
  {
    ignores: ['dist', 'coverage', '.storybook/**/*'],
  },

  // =========================
  // JS / TS 共通ベース
  // =========================
  js.configs.recommended,

  /** @see https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/recommended-type-checked.ts */
  ...tseslint.configs.recommended,

  // =========================
  // TypeScript / React 対象
  // =========================
  {
    files: ['**/*.{ts,tsx}'],

    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },

    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },

    rules: {
      /* ---------------------
       * React Hooks
       * ------------------- */
      ...reactHooks.configs.recommended.rules,

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      /* ---------------------
       * Console
       * ------------------- */
      'no-console': ['warn', { allow: ['warn', 'error'] }],

      /* ---------------------
       * React
       * ------------------- */
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-curly-brace-presence': ['error'],

      /* ---------------------
       * コーディング規約
       * ------------------- */
      'no-else-return': ['error'],
      eqeqeq: 'error',
      'no-fallthrough': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',

      /* ---------------------
       * import
       * ------------------- */
      'no-restricted-imports': ['warn', { patterns: ['./', '../'] }],
      'import/prefer-default-export': 'off',

      /* ---------------------
       * その他
       * ------------------- */
      'no-irregular-whitespace': 'off',
    },
  },

  // =========================
  // Storybook ファイル用設定
  // =========================
  {
    files: ['**/*.stories.{ts,tsx}', '.storybook/**/*.{ts,tsx}'],
    rules: {
      // TypeScriptの型チェック関連のエラーを無効化
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      // 相対インポートの制限を無効化（Storybookでは相対インポートが一般的）
      'no-restricted-imports': 'off',
    },
  },

  // =========================
  // Prettier（必ず最後）
  // =========================
  prettier,
  ...storybook.configs['flat/recommended'],
];
