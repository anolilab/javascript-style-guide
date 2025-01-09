import type { Linter } from "eslint";

import type { OptionsFiles, OptionsHasPrettier } from "../types";
import { createConfig, getFilesGlobs } from "../utils/create-config";

export const noUnderscoreDangle = {
    allow: ["__DEV__", "__STORYBOOK_CLIENT_API__", "__STORYBOOK_ADDONS_CHANNEL__", "__STORYBOOK_STORY_STORE__"],
    allowAfterSuper: false,
    allowAfterThis: false,
    enforceInMethodNames: true,
};

export const styleRules: Partial<Linter.RulesRecord> = {
    // enforce line breaks after opening and before closing array brackets
    // https://eslint.org/docs/rules/array-bracket-newline
    "array-bracket-newline": "off",

    // enforce line breaks between array elements
    // enforce spacing inside array brackets
    "array-bracket-spacing": ["error", "never"],

    // https://eslint.org/docs/rules/array-element-newline
    "array-element-newline": "off",

    // require camel case names
    camelcase: ["error", { ignoreDestructuring: false, properties: "never" }],

    // enforce or disallow capitalization of the first letter of a comment
    // https://eslint.org/docs/rules/capitalized-comments
    "capitalized-comments": [
        "off",
        "never",
        {
            block: {
                ignoreConsecutiveComments: true,
                ignoreInlineComments: true,
                ignorePattern: ".*",
            },
            line: {
                ignoreConsecutiveComments: true,
                ignoreInlineComments: true,
                ignorePattern: ".*",
            },
        },
    ],

    // enforce one true comma style
    "comma-style": [
        "error",
        "last",
        {
            exceptions: {
                ArrayExpression: false,
                ArrayPattern: false,
                ArrowFunctionExpression: false,
                CallExpression: false,
                FunctionDeclaration: false,
                FunctionExpression: false,
                ImportDeclaration: false,
                NewExpression: false,
                ObjectExpression: false,
                ObjectPattern: false,
                VariableDeclaration: false,
            },
        },
    ],

    // disallow padding inside computed properties
    "computed-property-spacing": ["error", "never"],

    // enforces consistent naming when capturing the current execution context
    "consistent-this": "off",

    // enforce that default parameters should come last
    "default-param-last": ["error"],

    // enforce newline at the end of file, with no multiple empty lines
    "eol-last": ["error", "always"],

    // enforce spacing between functions and their invocations
    // https://eslint.org/docs/rules/func-name-matching
    "func-name-matching": [
        "off",
        "always",
        {
            considerPropertyDescriptor: true,
            includeCommonJSModuleExports: false,
        },
    ],

    // requires function names to match the name of the variable or property to which they are
    // assigned
    // https://eslint.org/docs/rules/func-names
    "func-names": ["error", "as-needed"],

    // require function expressions to have a name
    // https://eslint.org/docs/rules/func-style
    "func-style": ["error", "expression"],

    // enforces use of function declarations or expressions
    // https://eslint.org/docs/rules/function-call-argument-newline
    "function-call-argument-newline": ["error", "consistent"],

    // enforce consistent line breaks inside function parentheses
    // https://eslint.org/docs/rules/function-paren-newline
    "function-paren-newline": ["error", "consistent"],

    // Blacklist certain identifiers to prevent them being used
    // https://eslint.org/docs/rules/id-blacklist
    "id-blacklist": "error",

    // disallow specified identifiers
    // https://eslint.org/docs/rules/id-denylist
    "id-denylist": "off",

    // this option enforces minimum and maximum identifier lengths
    // (variable names, property names etc.)
    "id-length": "off",

    // require identifiers to match the provided regular expression
    "id-match": "off",

    // Enforce the location of arrow function bodies with implicit returns
    // https://eslint.org/docs/rules/implicit-arrow-linebreak
    "implicit-arrow-linebreak": ["error", "beside"],

    // specify whether double or single quotes should be used in JSX attributes
    // https://eslint.org/docs/rules/jsx-quotes
    "jsx-quotes": ["off", "prefer-double"],

    // enforce position of line comments
    // https://eslint.org/docs/rules/line-comment-position
    "line-comment-position": "off",

    // disallow mixed 'LF' and 'CRLF' as linebreaks
    // https://eslint.org/docs/rules/linebreak-style
    "linebreak-style": ["error", "unix"],

    // https://eslint.org/docs/rules/lines-around-directive
    "lines-around-directive": [
        "error",
        {
            after: "always",
            before: "always",
        },
    ],

    // specify the maximum depth that blocks can be nested
    "max-depth": ["off", 4],

    // specify the maximum length of a line in your program
    // https://eslint.org/docs/rules/max-len
    "max-len": [
        "error",
        160,
        2,
        {
            ignoreComments: false,
            ignoreRegExpLiterals: true,
            ignoreStrings: true,
            ignoreTemplateLiterals: true,
            ignoreUrls: true,
        },
    ],

    // specify the max number of lines in a file
    // https://eslint.org/docs/rules/max-lines
    "max-lines": [
        "off",
        {
            max: 300,
            skipBlankLines: true,
            skipComments: true,
        },
    ],

    // enforce a maximum function length
    // https://eslint.org/docs/rules/max-lines-per-function
    "max-lines-per-function": [
        "off",
        {
            IIFEs: true,
            max: 50,
            skipBlankLines: true,
            skipComments: true,
        },
    ],

    // specify the maximum depth callbacks can be nested
    "max-nested-callbacks": "off",

    // limits the number of parameters that can be used in the function declaration.
    "max-params": ["off", 3],

    // specify the maximum number of statement allowed in a function
    "max-statements": ["off", 10],

    // restrict the number of statements per line
    // https://eslint.org/docs/rules/max-statements-per-line
    "max-statements-per-line": ["off", { max: 1 }],

    // enforce a particular style for multiline comments
    // https://eslint.org/docs/rules/multiline-comment-style
    "multiline-comment-style": ["off", "starred-block"],

    // require multiline ternary
    // https://eslint.org/docs/rules/multiline-ternary
    "multiline-ternary": ["off", "never"],

    // require a capital letter for constructors
    "new-cap": [
        "error",
        {
            capIsNew: false,
            capIsNewExceptions: ["Immutable.Map", "Immutable.Set", "Immutable.List"],
            newIsCap: true,
            newIsCapExceptions: [],
        },
    ],

    // disallow the omission of parentheses when invoking a constructor with no arguments
    // https://eslint.org/docs/rules/new-parens
    "new-parens": "error",

    // allow/disallow an empty newline after var statement
    "newline-after-var": "off",

    // https://eslint.org/docs/rules/newline-before-return
    "newline-before-return": "off",

    // enforces new line after each method call in the chain to make it
    // more readable and easy to maintain
    // https://eslint.org/docs/rules/newline-per-chained-call
    "newline-per-chained-call": ["error", { ignoreChainWithDepth: 4 }],

    // disallow use of the Array constructor
    "no-array-constructor": "error",

    // disallow use of bitwise operators
    // https://eslint.org/docs/rules/no-bitwise
    "no-bitwise": "error",

    // disallow use of the continue statement
    // https://eslint.org/docs/rules/no-continue
    "no-continue": "error",

    // disallow comments inline after code
    "no-inline-comments": "off",

    // disallow if as the only statement in an else block
    // https://eslint.org/docs/rules/no-lonely-if
    "no-lonely-if": "error",

    // disallow un-paren'd mixes of different operators
    // https://eslint.org/docs/rules/no-mixed-operators
    "no-mixed-operators": [
        "error",
        {
            // the list of arithmetic groups disallows mixing `%` and `**`
            allowSamePrecedence: false,
            // with other arithmetic operators.
            groups: [
                ["%", "**"],
                ["%", "+"],
                ["%", "-"],
                ["%", "*"],
                ["%", "/"],
                ["/", "*"],
                ["&", "|", "<<", ">>", ">>>"],
                ["==", "!=", "===", "!=="],
                ["&&", "||"],
                ["in", "instanceof"],
            ],
        },
    ],

    // disallow mixed spaces and tabs for indentation
    "no-mixed-spaces-and-tabs": "error",

    // disallow use of chained assignment expressions
    // https://eslint.org/docs/rules/no-multi-assign
    "no-multi-assign": ["error"],

    // disallow multiple empty lines, only one newline at the end, and no new lines at the beginning
    // https://eslint.org/docs/rules/no-multiple-empty-lines
    "no-multiple-empty-lines": ["error", { max: 1, maxBOF: 0, maxEOF: 0 }],

    // disallow negated conditions
    // https://eslint.org/docs/rules/no-negated-condition
    "no-negated-condition": "off",

    // disallow nested ternary expressions
    "no-nested-ternary": "error",

    // disallow use of the Object constructor
    "no-new-object": "error",

    // disallow use of unary operators, ++ and --
    // https://eslint.org/docs/rules/no-plusplus
    "no-plusplus": "error",

    // disallow certain syntax forms
    // https://eslint.org/docs/rules/no-restricted-syntax
    "no-restricted-syntax": [
        "error",
        {
            message:
                "for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.",
            selector: "ForInStatement",
        },
        {
            message:
                "iterators/generators require regenerator-runtime, which is too heavyweight for this guide to allow them. Separately, loops should be avoided in favor of array iterations.",
            selector: "ForOfStatement",
        },
        {
            message: "Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.",
            selector: "LabeledStatement",
        },
        {
            message: "`with` is disallowed in strict mode because it makes code impossible to predict and optimize.",
            selector: "WithStatement",
        },
        {
            message: "`useMemo` with an empty dependency array can't provide a stable reference, use `useRef` instead.",
            selector: "CallExpression[callee.name=useMemo][arguments.1.type=ArrayExpression][arguments.1.elements.length=0]",
        },
        {
            message: "Use `.key` instead of `.keyCode`",
            selector: "MemberExpression > .property[type=Identifier][name=keyCode]",
        },
        {
            message: "Do not use full-width tilde. Use wave dash instead.",
            // eslint-disable-next-line no-restricted-syntax
            selector: ":matches(Literal[value=/～/],TemplateElement[value.raw=/～/])",
        },
        {
            message: "Use `.toString()` instead of template literal if you want to convert a value to string.",
            selector: "TemplateLiteral[quasis.0.value.raw=\"\"][quasis.1.tail=true][quasis.1.value.raw=\"\"]",
        },
    ],

    // disallow space between function identifier and application
    // deprecated in favor of func-call-spacing
    "no-spaced-func": "off",

    // disallow tab characters entirely
    "no-tabs": "error",

    // disallow the use of ternary operators
    "no-ternary": "off",

    // disallow trailing whitespace at the end of lines
    "no-trailing-spaces": [
        "error",
        {
            ignoreComments: false,
            skipBlankLines: false,
        },
    ],

    // disallow dangling underscores in identifiers
    // https://eslint.org/docs/rules/no-underscore-dangle
    "no-underscore-dangle": ["error", noUnderscoreDangle],

    // disallow the use of Boolean literals in conditional expressions
    // also, prefer `a || b` over `a ? a : b`
    // https://eslint.org/docs/rules/no-unneeded-ternary
    "no-unneeded-ternary": ["error", { defaultAssignment: false }],

    // disallow whitespace before properties
    // https://eslint.org/docs/rules/no-whitespace-before-property
    "no-whitespace-before-property": "error",

    // enforce the location of single-line statements
    // https://eslint.org/docs/rules/nonblock-statement-body-position
    "nonblock-statement-body-position": ["error", "beside", { overrides: {} }],

    // https://eslint.org/docs/rules/object-curly-newline
    "object-curly-newline": [
        "error",
        {
            ExportDeclaration: { consistent: true, minProperties: 4, multiline: true },
            ImportDeclaration: { consistent: true, minProperties: 4, multiline: true },
            ObjectExpression: { consistent: true, minProperties: 4, multiline: true },
            ObjectPattern: { consistent: true, minProperties: 4, multiline: true },
        },
    ],

    // enforce line breaks between braces
    // require padding inside curly braces
    "object-curly-spacing": ["error", "always"],

    // enforce "same line" or "multiple line" on object properties.
    // https://eslint.org/docs/rules/object-property-newline
    "object-property-newline": [
        "error",
        {
            allowAllPropertiesOnSameLine: true,
        },
    ],

    // allow just one var statement per function
    "one-var": ["error", "never"],

    // require a newline around variable declaration
    // https://eslint.org/docs/rules/one-var-declaration-per-line
    "one-var-declaration-per-line": ["error", "always"],

    // require assignment operator shorthand where possible or prohibit it entirely
    // https://eslint.org/docs/rules/operator-assignment
    "operator-assignment": ["error", "always"],

    // Requires operator at the beginning of the line in multiline statements
    // https://eslint.org/docs/rules/operator-linebreak
    "operator-linebreak": ["error", "before", { overrides: { "=": "none" } }],

    // disallow padding within blocks
    "padded-blocks": [
        "error",
        {
            blocks: "never",
            classes: "never",
            switches: "never",
        },
        {
            allowSingleLineBlocks: true,
        },
    ],

    // Require or disallow padding lines between statements
    // https://eslint.org/docs/rules/padding-line-between-statements
    "padding-line-between-statements": "off",

    // Disallow the use of Math.pow in favor of the ** operator
    // https://eslint.org/docs/rules/prefer-exponentiation-operator
    "prefer-exponentiation-operator": "error",

    // Prefer use of an object spread over Object.assign
    // https://eslint.org/docs/rules/prefer-object-spread
    "prefer-object-spread": "error",

    // do not require jsdoc
    // https://eslint.org/docs/rules/require-jsdoc
    "require-jsdoc": "off",

    // enforce spacing before and after semicolons
    "semi-spacing": ["error", { after: true, before: false }],

    // Enforce location of semicolons
    // https://eslint.org/docs/rules/semi-style
    "semi-style": ["error", "last"],

    // requires object keys to be sorted
    // Disabled because of perfectionist/sort-objects
    "sort-keys": "off",

    // sort variables within the same declaration block
    "sort-vars": "off",

    // require or disallow spaces inside parentheses
    "space-in-parens": ["error", "never"],

    // Require or disallow spaces before/after unary operators
    // https://eslint.org/docs/rules/space-unary-ops
    "space-unary-ops": [
        "error",
        {
            nonwords: false,
            overrides: {},
            words: true,
        },
    ],

    // require or disallow a space immediately following the // or /* in a comment
    // https://eslint.org/docs/rules/spaced-comment
    "spaced-comment": [
        "error",
        "always",
        {
            block: {
                balanced: true,
                exceptions: ["-", "+"],
                markers: ["=", "!", ":", "::"], // space here to support sprockets directives and flow comment types
            },
            line: {
                exceptions: ["-", "+", "*"],
                markers: ["=", "!", "/"], // space here to support sprockets directives, slash for TS /// comments
            },
        },
    ],

    // Enforce spacing around colons of switch statements
    // https://eslint.org/docs/rules/switch-colon-spacing
    "switch-colon-spacing": ["error", { after: true, before: false }],

    // Require or disallow spacing between template tags and their literals
    // https://eslint.org/docs/rules/template-tag-spacing
    "template-tag-spacing": ["error", "never"],

    // require or disallow the Unicode Byte Order Mark
    // https://eslint.org/docs/rules/unicode-bom
    "unicode-bom": ["error", "never"],

    // require regex literals to be wrapped in parentheses
    "wrap-regex": "off",
};

export default createConfig<OptionsFiles & OptionsHasPrettier>("all", async (config, oFiles) => {
    const { files = oFiles, prettier } = config;

    return [
        {
            files,
            name: "anolilab/style/rules",
            rules: {
                ...styleRules,
                "quote-props": "off",

                ...prettier
                    ? {
                        // The rest are rules that you never need to enable when using Prettier.
                        "array-bracket-newline": "off",
                        "array-bracket-spacing": "off",
                        "array-element-newline": "off",
                        "arrow-parens": "off",
                        "arrow-spacing": "off",
                        "block-spacing": "off",
                        "brace-style": "off",
                        "comma-dangle": "off",

                        "comma-spacing": "off",
                        "comma-style": "off",
                        "computed-property-spacing": "off",
                        // script can distinguish them.
                        curly: 0,
                        "dot-location": "off",
                        "eol-last": "off",
                        "func-call-spacing": "off",
                        "function-call-argument-newline": "off",
                        "function-paren-newline": "off",
                        "generator-star-spacing": "off",
                        "implicit-arrow-linebreak": "off",
                        indent: "off",
                        "jsx-quotes": "off",
                        "key-spacing": "off",
                        "keyword-spacing": "off",
                        "linebreak-style": "off",
                        "lines-around-comment": 0,
                        "max-len": 0,
                        "max-statements-per-line": "off",
                        "multiline-ternary": "off",
                        "new-parens": "off",
                        "newline-per-chained-call": "off",
                        "no-confusing-arrow": 0,
                        "no-extra-parens": "off",
                        "no-extra-semi": "off",
                        "no-floating-decimal": "off",
                        "no-mixed-operators": 0,
                        "no-mixed-spaces-and-tabs": "off",
                        "no-multi-spaces": "off",
                        "no-multiple-empty-lines": "off",
                        "no-tabs": 0,
                        "no-trailing-spaces": "off",
                        "no-unexpected-multiline": 0,
                        "no-whitespace-before-property": "off",
                        "nonblock-statement-body-position": "off",
                        "object-curly-newline": "off",
                        "object-curly-spacing": "off",
                        "object-property-newline": "off",
                        "one-var-declaration-per-line": "off",
                        "operator-linebreak": "off",
                        "padded-blocks": "off",
                        quotes: 0,
                        "rest-spread-spacing": "off",
                        semi: "off",
                        "semi-spacing": "off",
                        "semi-style": "off",
                        "space-before-blocks": "off",
                        "space-before-function-paren": "off",
                        "space-in-parens": "off",
                        "space-unary-ops": "off",
                        "switch-colon-spacing": "off",
                        "template-curly-spacing": "off",
                        "template-tag-spacing": "off",
                        "wrap-iife": "off",
                        "wrap-regex": "off",
                        "yield-star-spacing": "off",
                    }
                    : {},
            },
        },
        {
            files: getFilesGlobs("ts"),
            name: "anolilab/style/ts-rules",
            rules: {
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/brace-style.md
                "brace-style": "off",
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
                camelcase: "off",
                // The TypeScript version also adds 3 new options, all of which should be set to the same value as the base config
                "comma-dangle": "off",

                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/comma-spacing.md
                "comma-spacing": "off",

                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/func-call-spacing.md
                "func-call-spacing": "off",

                // Require that function overload signatures be consecutive.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/indent.md
                indent: "off",

                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/keyword-spacing.md
                "keyword-spacing": "off",

                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/lines-between-class-members.md
                "lines-between-class-members": "off",

                // Some built-in types have aliases, while some types are considered dangerous or harmful.
                // https://github.com/typescript-eslint/typescript-eslint/tree/main/packages/eslint-plugin/docs/rules/ban-types.md
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-array-constructor.md
                "no-array-constructor": "off",

                // Enforce using concise optional chain expressions instead of chained logical ands, negated logical ors, or empty objects.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/quotes.md
                quotes: "off",

                // Require each enum member value to be explicitly initialized.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/semi.md
                semi: "off",

                // Enforce using function types instead of interfaces with call signatures.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/space-before-function-paren.md
                "space-before-function-paren": "off",
            },
        },
    ];
});
