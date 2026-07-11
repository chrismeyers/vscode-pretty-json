import { defineConfig } from 'oxlint';

export default defineConfig({
  options: {
    typeAware: true,
    maxWarnings: 0,
  },
  env: {
    node: true,
  },
  ignorePatterns: ['dist', 'out', 'coverage', 'node_modules'],
  rules: {
    'no-param-reassign': ['error', { props: false }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'no-console': 'warn',
    'no-process-exit': 'off',
    'typescript/no-explicit-any': 'off',
    'typescript/require-await': 'off',
    'typescript/no-floating-promises': 'off',
    'typescript/return-await': ['error', 'in-try-catch'],
  },
});
