import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

if (
    !global.hasAnolilabEsLintConfigPlaywrightJest &&
    (hasDependency("jest") ||
        hasDevDependency("jest") ||
        hasDevDependency("eslint-plugin-jest") ||
        hasDevDependency("eslint-plugin-jest") ||
        hasDevDependency("@types/jest") ||
        hasDevDependency("@types/jest"))
) {
    global.hasAnolilabEsLintConfigPlaywrightJest = true;
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
            extends: [global.hasAnolilabEsLintConfigPlaywrightJest ? "plugin:playwright/jest-playwright" : "plugin:playwright/recommended"],
            // To ensure best performance enable only on e2e test files
            files: ["**/e2e/**/*.test.{js,ts}"],
            rules: {
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-object-literal-type-assertion": "off",
            },
        },
    ],
};

export default config;
