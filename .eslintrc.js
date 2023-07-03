module.exports = {
  env: {
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'google'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'eslint-plugin-import'],
  rules: {
    camelcase: 0,
    'arrow-body-style': ['error', 'as-needed'],
    'object-curly-spacing': [2, 'always'],
    'no-else-return': 1,
    'no-shadow': 0,
    '@typescript-eslint/no-redeclare': 0,
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/no-use-before-define': 2,
    '@typescript-eslint/no-shadow': 2,
    '@typescript-eslint/no-empty-function': 0,
    'require-await': 'warn',
    'import/newline-after-import': 1,
    'import/order': [
      1,
      {
        groups: ['builtin', 'external'],
        'newlines-between': 'always',
      },
    ],
    'react/require-default-props': 0,
    'max-len': ['error', { code: 120 }],
    indent: 'off',
  },
};
