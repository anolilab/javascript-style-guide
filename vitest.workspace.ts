import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./packages/eslint-config/vitest.config.ts",
  "./packages/stylelint-config/vitest.config.ts",
  "./packages/browserslist-config-anolilab/vitest.config.ts",
  "./packages/lint-staged-config/vitest.config.ts"
]);
