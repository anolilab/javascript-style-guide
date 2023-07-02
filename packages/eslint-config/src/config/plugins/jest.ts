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
            env: {
                es6: true,
                jest: true,
                node: true,
            },
            extends: ["plugin:jest/recommended", "plugin:jest/style"],
            files: [
                // Test files
                "**/*.spec.{js,ts,tsx}",
                "**/*.test.{js,ts,tsx}",
                "**/test/*.{js,ts,tsx}",

                // Facebook convention
                "**/__mocks__/*.{js,ts,tsx}",
                "**/__tests__/*.{js,ts,tsx}",
            ],
            plugins: ["jest"],
            rules: {
                "@typescript-eslint/ban-ts-comment": "off",

                "@typescript-eslint/no-empty-function": "off",

                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-object-literal-type-assertion": "off",
                // you should turn the original rule off *only* for test files
                "@typescript-eslint/unbound-method": "off",
                "import/default": "off",
                // Relax rules that are known to be slow and less useful in a test context
                "import/namespace": "off",
                "import/no-duplicates": "off",

                // Relax rules that makes writing tests easier
                "import/no-named-as-default-member": "off",
                "jest/consistent-test-it": ["error", { fn: "it" }],
                "jest/no-disabled-tests": "off",
                "jest/no-duplicate-hooks": "error",

                "jest/no-test-return-statement": "error",
                "jest/prefer-hooks-in-order": "error",
                "jest/prefer-hooks-on-top": "error",
                "jest/prefer-strict-equal": "error",
                "jest/prefer-to-have-length": "error",

                // Disabled this rule because jest doc blocks clash with jsdoc/check-tag-names
                "jsdoc/check-tag-names": "off",
            },
        },
    ],
};

export default config;
