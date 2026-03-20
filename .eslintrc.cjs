/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // Vue 规则
    'vue/multi-word-component-names': 'off',
    'vue/no-unused-vars': 'warn',
    'vue/no-unused-components': 'warn',

    // TypeScript 规则
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',

    // 通用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 'off', // 使用 TypeScript 的规则

    // 代码风格
    'prefer-const': 'error',
    'no-var': 'error',
    'eqeqeq': ['error', 'always', { null: 'ignore' }]
  },
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}'],
      'extends': [
        'plugin:cypress/recommended'
      ]
    }
  ]
}
