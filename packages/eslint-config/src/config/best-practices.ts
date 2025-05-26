import type { Linter } from "eslint";

import type { OptionsFiles } from "../types";
import { createConfig, getFilesGlobs } from "../utils/create-config";

export const bestPracticesRules: Partial<Linter.RulesRecord> = {
    // Disable the "dot-notation" rule, as it can report incorrect errors on TypeScript code
    "dot-notation": "off",

    // Require explicit return and argument types on exported functions' and classes' public class methods.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
    "no-empty-function": "off",

    // Disallow using to delete operator on computed key expressions.
    // Disable the "no-implied-eval" and "no-new-func" rule, as it can report incorrect errors on TypeScript code
    "no-implied-eval": "off",

    // Disallow extra non-null assertions.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
    "no-loop-func": "off",

    // Disallow void type outside of generic or return types.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
    "no-magic-numbers": "off",

    "no-new-func": "off",

    // Disallow non-null assertions after an optional chain expression.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
    "no-redeclare": "off",
    // Disallow non-null assertions using the ! postfix operator.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
    "no-return-await": "off",

    // Disallow type assertions that do not change the type of expression.
    // Disable the "no-throw-literal" rule, as it can report incorrect errors on TypeScript code
    "no-throw-literal": "off",

    // Disallow calling a value with type any.
    // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
    "no-unused-expressions": "off",

    // Disallow empty exports that don't change anything in a module file.
    // Breaks @typescript-eslint/parser
    strict: "off",
};

export default createConfig<OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles } = config;

    return [
        {
            files,
            name: "anolilab/best-practices/rules",
            rules: {
                // enforces getter/setter pairs in objects
                "accessor-pairs": "off",

                // enforces return statements in callbacks of array's methods
                // https://eslint.org/docs/rules/array-callback-return
                "array-callback-return": ["error", { allowImplicit: true }],

                // treat var statements as if they were block scoped
                "block-scoped-var": "error",

                // https://eslint.org/docs/rules/class-methods-use-this
                "class-methods-use-this": [
                    "error",
                    {
                        exceptMethods: [],
                    },
                ],

                // enforce that class methods use "this"
                // specify the maximum cyclomatic complexity allowed in a program
                complexity: ["off", 11],

                // require return statements to either always or never specify values
                "consistent-return": "error",

                // specify curly brace conventions for all control statements
                curly: ["error", "multi-line"],

                // require default case in switch statements
                "default-case": ["error", { commentPattern: "^no default$" }],

                // Enforce default clauses in switch statements to be last
                // https://eslint.org/docs/rules/default-case-last
                "default-case-last": "error",

                // https://eslint.org/docs/rules/default-param-last
                "default-param-last": "error",

                // enforces consistent newlines before or after dots
                // https://eslint.org/docs/rules/dot-location
                "dot-location": ["error", "property"],

                // require the use of === and !==
                // encourages use of dot notation whenever possible
                "dot-notation": ["error", { allowKeywords: true }],

                // Require grouped accessor pairs in object literals and classes
                // https://eslint.org/docs/rules/eqeqeq
                eqeqeq: ["error", "always", { null: "ignore" }],

                // https://eslint.org/docs/rules/grouped-accessor-pairs
                "grouped-accessor-pairs": "error",

                // enforce a maximum number of classes per file
                // make sure for-in loops have an if statement
                "guard-for-in": "error",

                // https://eslint.org/docs/rules/max-classes-per-file
                "max-classes-per-file": ["error", 1],

                // disallow the use of alert, confirm, and prompt
                "no-alert": "error",

                // disallow lexical declarations in case/default clauses
                // disallow use of arguments.caller or arguments.callee
                "no-caller": "error",

                // Disallow returning value in constructor
                // https://eslint.org/docs/rules/no-case-declarations.html
                "no-case-declarations": "error",

                // disallow division operators explicitly at beginning of regular expression
                // https://eslint.org/docs/rules/no-constructor-return
                "no-constructor-return": "error",

                // disallow else after a return in an if
                // https://eslint.org/docs/rules/no-div-regex
                "no-div-regex": "off",

                // disallow empty functions, except for standalone funcs/arrows
                // https://eslint.org/docs/rules/no-else-return
                "no-else-return": ["error", { allowElseIf: false }],

                // disallow empty destructuring patterns
                // https://eslint.org/docs/rules/no-empty-function
                "no-empty-function": [
                    "error",
                    {
                        allow: ["arrowFunctions", "functions", "methods"],
                    },
                ],

                // Disallow empty static blocks
                // https://eslint.org/docs/rules/no-empty-pattern
                "no-empty-pattern": "error",

                // https://eslint.org/docs/latest/rules/no-empty-static-block
                "no-empty-static-block": "error",

                // disallow comparisons to null without a type-checking operator
                "no-eq-null": "off",

                // disallow use of eval()
                "no-eval": "error",

                // disallow adding to native types
                "no-extend-native": "error",

                // disallow Unnecessary Labels
                // disallow unnecessary function binding
                "no-extra-bind": "error",

                // https://eslint.org/docs/rules/no-extra-label
                "no-extra-label": "error",

                // disallow fallthrough of case statements
                "no-fallthrough": "error",

                // disallow reassignments of native objects or read-only globals
                // disallow the use of leading or trailing decimal points in numeric literals
                "no-floating-decimal": "error",
                // https://eslint.org/docs/rules/no-global-assign
                "no-global-assign": ["error", { exceptions: [] }],

                // disallow implicit type conversions
                // https://eslint.org/docs/rules/no-implicit-coercion
                "no-implicit-coercion": [
                    "off",
                    {
                        allow: [],
                        boolean: false,
                        number: true,
                        string: true,
                    },
                ],

                // disallow var and named functions in global scope
                // https://eslint.org/docs/rules/no-implicit-globals
                "no-implicit-globals": "off",

                // disallow use of eval()-like methods
                "no-implied-eval": "error",

                // disallow this keywords outside of classes or class-like objects
                "no-invalid-this": "off",

                // disallow usage of __iterator__ property
                "no-iterator": "error",

                // disallow use of labels for anything other than loops and switches
                "no-labels": ["error", { allowLoop: false, allowSwitch: false }],

                // disallow unnecessary nested blocks
                "no-lone-blocks": "error",

                // disallow creation of functions within loops
                "no-loop-func": "error",

                // disallow magic numbers
                // https://eslint.org/docs/rules/no-magic-numbers
                "no-magic-numbers": [
                    "off",
                    {
                        detectObjects: false,
                        enforceConst: true,
                        ignore: [],
                        ignoreArrayIndexes: true,
                    },
                ],

                // disallow use of multiple spaces
                "no-multi-spaces": [
                    "error",
                    {
                        ignoreEOLComments: false,
                    },
                ],

                // disallow use of multiline strings
                "no-multi-str": "error",

                // deprecated in favor of no-global-assign
                "no-native-reassign": "off",

                // disallow use of new operator when not part of the assignment or comparison
                "no-new": "error",

                // disallow use of new operator for Function object
                "no-new-func": "error",

                // Disallow \8 and \9 escape sequences in string literals
                // disallows creating new instances of String, Number, and Boolean
                "no-new-wrappers": "error",

                // https://eslint.org/docs/rules/no-nonoctal-decimal-escape
                "no-nonoctal-decimal-escape": "error",

                // disallow use of octal escape sequences in string literals, such as
                // disallow use of (old style) octal literals
                "no-octal": "error",

                // disallow reassignment of function parameters
                // disallow parameter object manipulation except for specific exclusions
                // var foo = 'Copyright \251';
                "no-octal-escape": "error",

                // rule: https://eslint.org/docs/rules/no-param-reassign.html
                "no-param-reassign": [
                    "error",
                    {
                        ignorePropertyModificationsFor: [
                            "acc", // for reduce accumulators
                            "accumulator", // for reduce accumulators
                            "e", // for e.returnvalue
                            "ctx", // for Koa routing
                            "context", // for Koa routing
                            "req", // for Express requests
                            "request", // for Express requests
                            "res", // for Express responses
                            "response", // for Express responses
                            "$scope", // for Angular 1 scopes
                            "staticContext", // for ReactRouter context
                        ],
                        props: true,
                    },
                ],

                // disallow usage of __proto__ property
                "no-proto": "error",

                // disallow certain object properties
                // disallow declaring the same variable more than once
                "no-redeclare": "error",

                // https://eslint.org/docs/rules/no-restricted-properties
                "no-restricted-properties": [
                    "error",
                    {
                        message: "arguments.callee is deprecated",
                        object: "arguments",
                        property: "callee",
                    },
                    {
                        message: "Please use Number.isFinite instead",
                        object: "global",
                        property: "isFinite",
                    },
                    {
                        message: "Please use Number.isFinite instead",
                        object: "self",
                        property: "isFinite",
                    },
                    {
                        message: "Please use Number.isFinite instead",
                        object: "window",
                        property: "isFinite",
                    },
                    {
                        message: "Please use Number.isNaN instead",
                        object: "global",

                        property: "isNaN",
                    },
                    {
                        message: "Please use Number.isNaN instead",
                        object: "self",
                        property: "isNaN",
                    },
                    {
                        message: "Please use Number.isNaN instead",
                        object: "window",
                        property: "isNaN",
                    },
                    {
                        message: "Please use Object.defineProperty instead.",
                        property: "__defineGetter__",
                    },
                    {
                        message: "Please use Object.defineProperty instead.",
                        property: "__defineSetter__",
                    },
                    {
                        message: "Use the exponentiation operator (**) instead.",
                        object: "Math",
                        property: "pow",
                    },
                    {
                        message: "Use `Number.isNaN` instead.",
                        object: "globalThis",
                        property: "isNaN",
                    },
                    {
                        message: "Use `Number.isFinite` instead.",
                        object: "globalThis",
                        property: "isFinite",
                    },
                    {
                        message: "Use `Number.parseFloat` instead.",
                        object: "globalThis",
                        property: "parseFloat",
                    },
                    {
                        message: "Use `Number.parseInt` instead.",
                        object: "globalThis",
                        property: "parseInt",
                    },
                    {
                        message: "Use `Number.parseFloat` instead.",
                        object: "window",
                        property: "parseFloat",
                    },
                    {
                        message: "Use `Number.parseInt` instead.",
                        object: "window",
                        property: "parseInt",
                    },
                    {
                        message: "Use `Object.getPrototypeOf` or `Object.setPrototypeOf` instead.",
                        property: "__proto__",
                    },
                    {
                        message: "Use `Object.getOwnPropertyDescriptor` instead.",
                        property: "__lookupGetter__",
                    },
                    {
                        message: "Use `Object.getOwnPropertyDescriptor` instead.",
                        property: "__lookupSetter__",
                    },
                ],

                // disallow use of assignment in return statement
                "no-return-assign": ["error", "always"],

                // disallow redundant `return await`
                "no-return-await": "error",

                // disallow self assignment
                // disallow use of `javascript:` urls.
                "no-script-url": "error",

                // https://eslint.org/docs/rules/no-self-assign
                "no-self-assign": [
                    "error",
                    {
                        props: true,
                    },
                ],

                // disallow comparisons where both sides are exactly the same
                "no-self-compare": "error",

                // disallow use of comma operator
                "no-sequences": "error",

                // disallow unmodified conditions of loops
                // restrict what can be thrown as an exception
                "no-throw-literal": "error",

                // https://eslint.org/docs/rules/no-unmodified-loop-condition
                "no-unmodified-loop-condition": "off",

                // disallow unused labels
                // disallow usage of expressions in statement position
                "no-unused-expressions": [
                    "error",
                    {
                        allowShortCircuit: false,
                        allowTaggedTemplates: false,
                        allowTernary: false,
                    },
                ],

                // https://eslint.org/docs/rules/no-unused-labels
                "no-unused-labels": "error",

                // Disallow unnecessary catch clauses
                // disallow unnecessary .call() and .apply()
                "no-useless-call": "off",

                // disallow useless string concatenation
                // https://eslint.org/docs/rules/no-useless-catch
                "no-useless-catch": "error",

                // disallow unnecessary string escaping
                // https://eslint.org/docs/rules/no-useless-concat
                "no-useless-concat": "error",

                // disallow redundant return; keywords
                // https://eslint.org/docs/rules/no-useless-escape
                "no-useless-escape": "error",

                // disallow use of void operator
                // https://eslint.org/docs/rules/no-useless-return
                "no-useless-return": "error",

                // https://eslint.org/docs/rules/no-void
                "no-void": "error",

                // disallow usage of configurable warning terms in comments: e.g. "todo"
                "no-warning-comments": [
                    "off",
                    {
                        location: "start",
                        terms: ["todo", "fixme", "xxx", "@todo"],
                    },
                ],

                // require using Error objects as Promise rejection reasons
                // disallow use of the with statement
                "no-with": "error",

                // Suggest using named capture group in regular expression
                // https://eslint.org/docs/rules/prefer-named-capture-group
                "prefer-named-capture-group": "off",

                // https://eslint.org/docs/rules/prefer-promise-reject-errors
                "prefer-promise-reject-errors": ["error", { allowEmptyReject: true }],

                // Disabled because of eslint-plugin-regexp
                // https://eslint.org/docs/rules/prefer-regex-literals
                "prefer-regex-literals": "off",

                // require `await` in `async function` (note: this is a horrible rule that should never be used)
                // require use of the second argument for parseInt()
                radix: "error",

                // Enforce the use of u flag on RegExp
                // https://eslint.org/docs/rules/require-await
                "require-await": "off",

                // Disabled because of eslint-plugin-regexp
                // https://eslint.org/docs/rules/require-unicode-regexp
                "require-unicode-regexp": "off",

                // require immediate function invocation to be wrapped in parentheses
                // requires to declare all vars on top of their containing scope
                "vars-on-top": "error",

                // https://eslint.org/docs/rules/wrap-iife.html
                "wrap-iife": ["error", "outside", { functionPrototypeMethods: false }],
                // require or disallow Yoda conditions
                yoda: "error",
            },
        },
        {
            files: getFilesGlobs("ts"),
            name: "anolilab/best-practices/ts-rules",
            rules: bestPracticesRules,
        },
    ];
});
