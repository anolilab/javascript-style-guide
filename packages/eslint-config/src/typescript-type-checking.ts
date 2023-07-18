import type { Linter } from "eslint";
import { env } from "node:process";

import bestPracticesConfig from "./config/best-practices";
import { createConfig } from "./utils/create-config";
import anolilabEslintConfig from "./utils/eslint-config";

const bestPracticesRules = bestPracticesConfig.rules as Linter.RulesRecord;

let showUnsupportedTypeScriptVersionWarning: boolean = env["DISABLE_ESLINT_WARN_UNSUPPORTED_TYPESCRIPT_VERSION"] !== "true";

if (anolilabEslintConfig["warn_on_unsupported_typescript_version"] !== undefined) {
    showUnsupportedTypeScriptVersionWarning = anolilabEslintConfig["warn_on_unsupported_typescript_version"];
}

const config = createConfig("typescript", {
    extends: [
        "plugin:@typescript-eslint/recommended-type-checked",
        "plugin:@typescript-eslint/strict-type-checked",
        "plugin:@typescript-eslint/stylistic-type-checked",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        sourceType: "module",
        warnOnUnsupportedTypeScriptVersion: showUnsupportedTypeScriptVersionWarning,
    },
    plugins: ["@typescript-eslint"],
    rules: {
        // Disallows awaiting a value that is not a Thenable
        "@typescript-eslint/await-thenable": "error",

        "@typescript-eslint/consistent-type-exports": [
            "error",
            {
                fixMixedExportsWithInlineTypeSpecifier: true,
            },
        ],

        // Replace 'dot-notation' rule with '@typescript-eslint' version
        "@typescript-eslint/dot-notation": ["error", { allowKeywords: true }],
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-base-to-string.md
        "@typescript-eslint/no-base-to-string": [
            "error",
            {
                ignoredTypeNames: ["RegExp"],
            },
        ],

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-confusing-void-expression.md
        "@typescript-eslint/no-confusing-void-expression": [
            "error",
            {
                ignoreArrowShorthand: true,
                ignoreVoidOperator: false,
            },
        ],

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-floating-promises.md
        "@typescript-eslint/no-floating-promises": [
            "error",
            {
                ignoreIIFE: true,
                ignoreVoid: true,
            },
        ],

        // Disallow iterating over an array with a for-in loop
        "@typescript-eslint/no-for-in-array": "error",

        "@typescript-eslint/no-implied-eval": bestPracticesRules["no-implied-eval"],

        // Replace 'no-throw-literal' rule with '@typescript-eslint' version
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-meaningless-void-operator.md
        "@typescript-eslint/no-meaningless-void-operator": ["error", { checkNever: true }],
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-misused-promises.md
        "@typescript-eslint/no-misused-promises": [
            "error",
            {
                checksConditionals: true,
                checksVoidReturn: {
                    arguments: true,
                    attributes: false,
                    properties: true,
                    returns: true,
                    variables: true,
                },
            },
        ],

        // Replace 'no-implied-eval' and 'no-new-func' rules with '@typescript-eslint' version
        "@typescript-eslint/no-throw-literal": bestPracticesRules["no-throw-literal"],
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-condition.md
        "@typescript-eslint/no-unnecessary-condition": "error",
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-qualifier.md
        "@typescript-eslint/no-unnecessary-qualifier": "error",

        // Disallow the void operator except when used to discard a value.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/no-unnecessary-type-arguments.md
        "@typescript-eslint/no-unnecessary-type-arguments": "error",

        // Disallow Promises in places not designed to handle them.
        // Disabling here because in most cases the explicitness is still valuable
        "@typescript-eslint/no-unnecessary-type-assertion": "off",

        // Warns if a type assertion does not change the type of an expression
        "@typescript-eslint/non-nullable-type-assertion-style": "off",

        // Enforce includes method over indexOf method.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-includes.md
        "@typescript-eslint/prefer-includes": "error",

        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md
        "@typescript-eslint/prefer-nullish-coalescing": [
            "error",
            {
                ignoreConditionalTests: true,
                ignoreMixedLogicalExpressions: true,
            },
        ],

        // Enforce RegExp#exec over String#match if no global flag is provided.
        // Requires that private members are marked as readonly if they're never modified outside of the constructor
        "@typescript-eslint/prefer-readonly": ["error", { onlyInlineLambdas: false }],

        // Enforce that this is used when only this type is returned.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-reduce-type-parameter.md
        "@typescript-eslint/prefer-reduce-type-parameter": "error",

        // Enforce using String#startsWith and String#endsWith over other equivalent methods of checking substrings.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-regexp-exec.md
        "@typescript-eslint/prefer-regexp-exec": "error",

        // Replace 'require-await' rule with '@typescript-eslint' version
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-return-this-type.md
        "@typescript-eslint/prefer-return-this-type": "error",
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-string-starts-ends-with.md
        "@typescript-eslint/prefer-string-starts-ends-with": "error",

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/promise-function-async.md
        "@typescript-eslint/promise-function-async": "error",

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/require-array-sort-compare.md
        "@typescript-eslint/require-array-sort-compare": [
            "error",
            {
                ignoreStringArrays: false,
            },
        ],

        "@typescript-eslint/require-await": bestPracticesRules["require-await"],

        // When adding two variables, operands must both be of type number or of type string
        "@typescript-eslint/restrict-plus-operands": "error",

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
        "@typescript-eslint/return-await": ["error", "always"],

        // Disallow unnecessary namespace qualifiers.
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md
        "@typescript-eslint/switch-exhaustiveness-check": "error",

        // Enforces unbound methods are called with their expected scope
        "@typescript-eslint/unbound-method": ["error", { ignoreStatic: false }],
    },
});

export default config;
