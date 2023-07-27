import type { Linter } from "eslint";
import { createConfigs } from "../utils/create-config";

const config: Linter.Config = createConfigs([
    {
        config: {
            rules: {
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

                // disallow control characters in regular expressions
                "no-control-regex": "error",

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

                // disallow unnecessary parentheses
                // https://eslint.org/docs/rules/no-extra-parens
                "no-extra-parens": [
                    "error",
                    "all",
                    {
                        conditionalAssign: true,
                        enforceForArrowConditionals: false,
                        ignoreJSX: "all", // delegate to eslint-plugin-react
                        nestedBinaryExpressions: false,
                        returnAssign: false,
                    },
                ],

                // disallow unnecessary semicolons
                "no-extra-semi": "error",

                // disallow overwriting functions written as function declarations
                "no-func-assign": "error",

                // https://eslint.org/docs/rules/no-import-assign
                "no-import-assign": "error",

                // disallow function or variable declarations in nested blocks
                "no-inner-declarations": "error",

                // disallow invalid regular expression strings in the RegExp constructor
                "no-invalid-regexp": "error",

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

                // Disallow returning values from Promise executor functions
                // disallow the use of object properties of the global object (Math and JSON) as functions
                "no-obj-calls": "error",

                // disallow use of Object.prototypes builtins directly
                // https://eslint.org/docs/rules/no-promise-executor-return
                "no-promise-executor-return": "error",

                // https://eslint.org/docs/rules/no-prototype-builtins
                "no-prototype-builtins": "error",

                // Disallow returning values from setters
                // disallow multiple spaces in a regular expression literal
                "no-regex-spaces": "error",

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
            },
        },
        type: "all",
    },
    {
        config: {
            rules: {
                // Some built-in types have aliases, while some types are considered dangerous or harmful.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/ban-types.md
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
                "no-array-constructor": "off",

                // Enforce constituents of a type union/intersection to be sorted alphabetically.
                "no-const-assign": "off",

                // Enforce using @ts-expect-error over @ts-ignore.
                "no-dupe-args": "off",

                // Enforce specifying generic type arguments on constructor name of a constructor call.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
                "no-dupe-class-members": "off",

                // Require explicit accessibility modifiers on class properties and methods.
                "no-dupe-keys": "off",

                // Require explicit return and argument types on exported functions' and classes' public class methods.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-empty-function.md
                "no-empty-function": "off",

                // Enforce using a particular method signature syntax.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
                "no-extra-parens": "off",

                // Disallow non-null assertion in locations that may be confusing.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-semi.md
                "no-extra-semi": "off",

                // Disallow duplicate enum member values.
                "no-func-assign": "off",

                // Disallow using to delete operator on computed key expressions.
                // Disable the "no-implied-eval" and "no-new-func" rule, as it can report incorrect errors on TypeScript code
                "no-implied-eval": "off",

                // Disallow extra non-null assertions.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-loop-func.md
                "no-loop-func": "off",

                // Disallow void type outside of generic or return types.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-magic-numbers.md
                "no-magic-numbers": "off",

                // Enforce valid definition of new and constructor.
                "no-new-func": "off",

                // Disallow TypeScript namespaces.
                "no-new-symbol": "off",

                // Disallow non-null assertions in the left operand of a nullish coalescing operator.
                "no-obj-calls": "off",

                // Disallow non-null assertions after an optional chain expression.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-redeclare.md
                "no-redeclare": "off",

                // Disallow non-null assertions using the ! postfix operator.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/return-await.md
                "no-return-await": "off",

                // Disallow invocation of require().
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-shadow.md
                "no-shadow": "off",

                // Disallow aliasing this.
                "no-this-before-super": "off",

                // Disallow type assertions that do not change the type of expression.
                // Disable the "no-throw-literal" rule, as it can report incorrect errors on TypeScript code
                "no-throw-literal": "off",

                // Disallow unnecessary constraints on generic types.
                "no-undef": "off",

                // Disallow calling a function with a value with type any.
                "no-unreachable": "off",

                // Disallow assigning a value with type any to variables and properties.
                "no-unsafe-negation": "off",

                // Disallow calling a value with type any.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-expressions.md
                "no-unused-expressions": "off",

                // Disallow unsafe declaration merging.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-unused-vars.md
                "no-unused-vars": "off",

                // Disallow member access on a value with type any.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-use-before-define.md
                "no-use-before-define": "off",

                // Disallow returning a value with type any from a function.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
                "no-useless-constructor": "off",

                // Enforce using function types instead of interfaces with call signatures.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.md
                "space-before-function-paren": "off",

                // Enforce using the nullish coalescing operator instead of logical chaining.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-infix-ops.md
                "space-infix-ops": "off",

                "valid-typeof": "off",
            },
        },
        type: "typescript",
    },
]);

export default config;
