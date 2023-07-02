import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            env: {
                es6: true,
            },
            extends: "plugin:ava/recommended",
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
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
            plugins: ["ava"],
        },
    ],
};

export default config;
