import type { Linter } from "eslint";

// @see https://github.com/storybookjs/eslint-plugin-storybook
const config: Linter.Config = {
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    overrides: [
        {
            extends: ["plugin:storybook/recommended"],
            // For performance run storybook/recommended on test files, not regular code
            files: ["**/*.stories.{ts,tsx,mdx}"],
        },
    ],
};

export default config;
