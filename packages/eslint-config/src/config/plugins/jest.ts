import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["setupJest.js"],
            rules: {
                "import/no-extraneous-dependencies": "off",
            },
        },
        {
            plugins: ["jest"],
            files: [
                // Test files
                "**/*.spec.{js,ts,tsx}",
                "**/*.test.{js,ts,tsx}",
                "**/test/*.{js,ts,tsx}",

                // Facebook convention
                "**/__mocks__/*.{js,ts,tsx}",
                "**/__tests__/*.{js,ts,tsx}",
            ],
            extends: ["plugin:jest/recommended", "plugin:jest/style"],
            env: {
                jest: true,
            },
            rules: {
                // Disabled this rule because jest doc blocks clash with jsdoc/check-tag-names
                "jsdoc/check-tag-names": "off",

                "jest/no-disabled-tests": "off",

                // Not included in jest/recommended
                "jest/consistent-test-it": 0,
                "jest/lowercase-name": 0,
                "jest/no-conditional-expect": 0,
                "jest/no-deprecated-functions": 0,
                "jest/no-duplicate-hooks": 0,
                "jest/no-expect-resolves": 0,
                "jest/no-hooks": 0,
                "jest/no-if": 0,
                "jest/no-interpolation-in-snapshots": 0,
                "jest/no-large-snapshots": 0,
                "jest/no-restricted-matchers": 0,
                "jest/no-test-return-statement": 0,
                "jest/no-truthy-falsy": 0,
                "jest/prefer-called-with": 0,
                "jest/prefer-expect-assertions": 0,
                "jest/prefer-hooks-on-top": 0,
                "jest/prefer-inline-snapshots": 0,
                "jest/prefer-spy-on": 0,
                "jest/prefer-strict-equal": 0,
                "jest/prefer-todo": 0,
                "jest/require-to-throw-message": 0,
                "jest/require-top-level-describe": 0,
                "jest/valid-title": 0,

                // you should turn the original rule off *only* for test files
                "@typescript-eslint/unbound-method": "off",
            },
        },
    ],
};

export default config;
