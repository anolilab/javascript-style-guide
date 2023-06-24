import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

let hasJest = false;

if (hasDependency("jest") || hasDevDependency("jest") || hasDevDependency("eslint-plugin-jest") || hasDevDependency("@types/jest")) {
    hasJest = true;
}

// @see https://github.com/playwright-community/eslint-plugin-playwright
const config: Linter.Config = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    overrides: [
        {
            // To ensure best performance enable only on e2e test files
            files: ["**/e2e/**/*.test.{js,ts}"],
            extends: [hasJest ? "plugin:playwright/jest-playwright" : "plugin:playwright/recommended"],
            rules: {
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-object-literal-type-assertion": "off",
                "@typescript-eslint/no-empty-function": "off",
            },
        },
    ],
};

export default config;
