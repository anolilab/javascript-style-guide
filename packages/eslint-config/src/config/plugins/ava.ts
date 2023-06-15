import type { Linter } from "eslint";

// eslint-disable-next-line unicorn/prevent-abbreviations
const config: Linter.Config = {
    overrides: [
        {
            // Default ava test search patterns
            files: [
                "test.js",
                "src/test.js",
                "source/test.js",
                "**/test-*.js",
                "**/*.spec.js",
                "**/*.test.js",
                "**/test/**/*.js",
                "**/tests/**/*.js",
                "**/__tests__/**/*.js",
            ],
            plugins: ["ava"],
            env: {
                es6: true,
            },
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            extends: "plugin:ava/recommended",
        },
    ],
};

export default config;
