import type { Linter } from "eslint";

import bestPracticesConfig from "./config/best-practices";
import { createConfig } from "./utils/create-config";

const bestPracticesRules = bestPracticesConfig.rules as Linter.RulesRecord;

const config = createConfig("typescript", {
    // TODO: enable the rule when typescript-eslint 6.0.0 is released
    // extends: [
    // "plugin:@typescript-eslint/recommended-type-checked",
    // "plugin:@typescript-eslint/strict-type-checked",
    // "plugin:@typescript-eslint/stylistic-type-checked"
    // ],
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
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-includes.md
        "@typescript-eslint/prefer-includes": "error",

        // Enforce includes method over indexOf method.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-nullish-coalescing.md
        "@typescript-eslint/prefer-nullish-coalescing": [
            "error",
            {
                ignoreConditionalTests: true,
                ignoreMixedLogicalExpressions: true,
            },
        ],

        // Requires that private members are marked as readonly if they're never modified outside of the constructor
        "@typescript-eslint/prefer-readonly": ["error", { onlyInlineLambdas: false }],

        // Enforce RegExp#exec over String#match if no global flag is provided.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-reduce-type-parameter.md
        "@typescript-eslint/prefer-reduce-type-parameter": "error",

        // Enforce that this is used when only this type is returned.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-regexp-exec.md
        "@typescript-eslint/prefer-regexp-exec": "error",

        // Enforce using String#startsWith and String#endsWith over other equivalent methods of checking substrings.
        // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/prefer-return-this-type.md
        "@typescript-eslint/prefer-return-this-type": "error",

        // Replace 'require-await' rule with '@typescript-eslint' version
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

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/switch-exhaustiveness-check.md
        "@typescript-eslint/switch-exhaustiveness-check": "error",

        // Disallow unnecessary namespace qualifiers.
        // Enforces unbound methods are called with their expected scope
        "@typescript-eslint/unbound-method": ["error", { ignoreStatic: false }],

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/dot-notation.md
        "dot-notation": "off",

        // Disallow conditionals where the type is always truthy or always falsy.
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-implied-eval.md
        "no-implied-eval": "off",

        // Disallow type arguments that are equal to the default.
        "no-new-func": "off",

        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-throw-literal.md
        "no-throw-literal": "off",

        // Enforce using type parameter when calling Array#reduce instead of casting.
        // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/require-await.md
        "require-await": "off",
    },
});

export default config;
