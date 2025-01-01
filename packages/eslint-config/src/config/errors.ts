import type { Linter } from "eslint";

import type { OptionsFiles } from "../types";
import { createConfig, getFilesGlobs } from "../utils/create-config";

export const errorsRules: Partial<Linter.RulesRecord> = {
    // Enforce “for” loop update clause moving the counter in the right direction
    // https://eslint.org/docs/rules/for-direction
    "for-direction": "error",

    // Enforces that a return statement is present in property getters
    // https://eslint.org/docs/rules/getter-return
    "getter-return": ["error", { allowImplicit: true }],

    // disallow using an async function as a Promise executor
    // https://eslint.org/docs/rules/no-async-promise-executor
    "no-async-promise-executor": "error",

    // Disallow await inside of loops
    // https://eslint.org/docs/rules/no-await-in-loop
    "no-await-in-loop": "error",

    // Disallow comparisons to negative zero
    // https://eslint.org/docs/rules/no-compare-neg-zero
    "no-compare-neg-zero": "error",

    // disallow assignment in conditional expressions
    "no-cond-assign": ["error", "always"],

    // disallow use of console
    "no-console": "warn",

    // disallow use of constant expressions in conditions
    "no-constant-condition": "warn",

    // Disabled because of eslint-plugin-regexp
    // disallow control characters in regular expressions
    "no-control-regex": "off",

    // disallow use of debugger
    "no-debugger": "error",

    // disallow duplicate arguments in functions
    "no-dupe-args": "error",

    // Disallow duplicate conditions in if-else-if chains
    // https://eslint.org/docs/rules/no-dupe-else-if
    "no-dupe-else-if": "error",

    // disallow duplicate keys when creating object literals
    "no-dupe-keys": "error",

    // disallow a duplicate case label.
    "no-duplicate-case": "error",

    // disallow empty statements
    "no-empty": "error",

    // disallow the use of empty character classes in regular expressions
    "no-empty-character-class": "error",

    // disallow assigning to the exception in a catch block
    "no-ex-assign": "error",

    // disallow double-negation boolean casts in a boolean context
    // https://eslint.org/docs/rules/no-extra-boolean-cast
    "no-extra-boolean-cast": "error",

    // disallow overwriting functions written as function declarations
    "no-func-assign": "error",

    // https://eslint.org/docs/rules/no-import-assign
    "no-import-assign": "error",

    // disallow function or variable declarations in nested blocks
    "no-inner-declarations": "error",

    // Disabled because of eslint-plugin-regexp
    // disallow invalid regular expression strings in the RegExp constructor
    "no-invalid-regexp": "off",

    // disallow irregular whitespace outside of strings and comments
    "no-irregular-whitespace": "error",

    // Disallow Number Literals That Lose Precision
    // https://eslint.org/docs/rules/no-loss-of-precision
    "no-loss-of-precision": "error",

    // Disallow characters which are made with multiple code points in character class syntax
    // https://eslint.org/docs/rules/no-misleading-character-class
    "no-misleading-character-class": "error",

    // deprecated in favor of no-unsafe-negation
    "no-negated-in-lhs": "off",

    // Disallow new operators with global non-constructor functions
    // https://eslint.org/docs/latest/rules/no-new-native-nonconstructor
    "no-new-native-nonconstructor": "error",

    // Disallow returning values from Promise executor functions
    // disallow the use of object properties of the global object (Math and JSON) as functions
    "no-obj-calls": "error",

    // disallow use of Object.prototypes builtins directly
    // https://eslint.org/docs/rules/no-promise-executor-return
    "no-promise-executor-return": "error",

    // https://eslint.org/docs/rules/no-prototype-builtins
    "no-prototype-builtins": "error",

    // Disabled because of eslint-plugin-regexp
    // disallow multiple spaces in a regular expression literal
    "no-regex-spaces": "off",

    // https://eslint.org/docs/rules/no-setter-return
    "no-setter-return": "error",

    // Disallow template literal placeholder syntax in regular strings
    // disallow sparse arrays
    "no-sparse-arrays": "error",

    // Avoid code that looks like two expressions but is actually one
    // https://eslint.org/docs/rules/no-template-curly-in-string
    "no-template-curly-in-string": "error",

    // https://eslint.org/docs/rules/no-unexpected-multiline
    "no-unexpected-multiline": "error",

    // Disallow loops with a body that allows only one iteration
    // disallow unreachable statements after a return, throw, continue, or break statement
    "no-unreachable": "error",

    // disallow return/throw/break/continue inside finally blocks
    // https://eslint.org/docs/rules/no-unreachable-loop
    "no-unreachable-loop": "off", // error with typescript

    // disallow negating the left operand of relational operators
    // https://eslint.org/docs/rules/no-unsafe-finally
    "no-unsafe-finally": "error",

    // disallow use of optional chaining in contexts where the undefined value is not allowed
    // https://eslint.org/docs/rules/no-unsafe-negation
    "no-unsafe-negation": "error",

    // Disallow useless backreferences in regular expressions
    // https://eslint.org/docs/rules/no-unsafe-optional-chaining
    "no-unsafe-optional-chaining": ["error", { disallowArithmeticOperators: true }],

    // disallow negation of the left operand of an in expression
    // https://eslint.org/docs/rules/no-useless-backreference
    "no-useless-backreference": "error",

    // Disallow assignments that can lead to race conditions due to usage of await or yield
    // https://eslint.org/docs/rules/require-atomic-updates
    // note: not enabled because it is very buggy
    "require-atomic-updates": "off",

    // disallow comparisons with the value NaN
    "use-isnan": "error",

    // ensure JSDoc comments are valid
    // https://eslint.org/docs/rules/valid-jsdoc
    "valid-jsdoc": "off",

    // ensure that the results of typeof are compared against a valid string
    // https://eslint.org/docs/rules/valid-typeof
    "valid-typeof": ["error", { requireStringLiterals: true }],
};

export default createConfig<OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles } = config;

    return [
        {
            files,
            name: "anolilab/errors/rules",
            rules: errorsRules,
        },
        // The following rules are enabled in config, but are already checked (more thoroughly) by the TypeScript compiler
        // Some rules also fail in TypeScript files, for example: https://github.com/typescript-eslint/typescript-eslint/issues/662#issuecomment-507081586
        {
            files: getFilesGlobs("ts"),
            name: "anolilab/errors/ts-rules",
            rules: {
                "getter-return": "off",

                // Enforce using @ts-expect-error over @ts-ignore.
                "no-dupe-args": "off",

                // Require explicit accessibility modifiers on class properties and methods.
                "no-dupe-keys": "off",

                // Enforce using a particular method signature syntax.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
                "no-extra-parens": "off",

                "no-extra-semi": "off",

                // Disallow duplicate enum member values.
                "no-func-assign": "off",

                // Disallow non-null assertions in the left operand of a nullish coalescing operator.
                "no-obj-calls": "off",

                // Disallow calling a function with a value with type any.
                "no-unreachable": "off",

                // Disallow assigning a value with type any to variables and properties.
                "no-unsafe-negation": "off",

                // Enforce using the nullish coalescing operator instead of logical chaining.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-infix-ops.md
                "space-infix-ops": "off",

                "valid-typeof": "off",
            },
        },
    ];
});
