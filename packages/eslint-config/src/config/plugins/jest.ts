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
                es6: true,
                node: true,
                jest: true,
            },
            rules: {
                // Disabled this rule because jest doc blocks clash with jsdoc/check-tag-names
                "jsdoc/check-tag-names": "off",

                "jest/no-disabled-tests": "off",

                "jest/prefer-hooks-in-order": "error",
                "jest/prefer-hooks-on-top": "error",
                "jest/no-duplicate-hooks": "error",
                "jest/no-test-return-statement": "error",
                "jest/prefer-strict-equal": "error",
                "jest/prefer-to-have-length": "error",
                "jest/consistent-test-it": ["error", { fn: "it" }],

                // Relax rules that are known to be slow and less useful in a test context
                "import/namespace": "off",
                "import/default": "off",
                "import/no-duplicates": "off",
                // Relax rules that makes writing tests easier
                "import/no-named-as-default-member": "off",

                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-object-literal-type-assertion": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/ban-ts-comment": "off",

                // you should turn the original rule off *only* for test files
                "@typescript-eslint/unbound-method": "off",
            },
        },
    ],
};

export default config;
