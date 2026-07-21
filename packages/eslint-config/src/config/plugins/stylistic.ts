import type { OptionsHasPrettier, OptionsOverrides, StylisticConfig, TypedFlatConfigItem } from "../../types";
import interopDefault from "../../utils/interop-default";
import getPrettierConflictRules from "../../utils/prettier-conflict-rules";

const stylistic = async (options: OptionsHasPrettier & OptionsOverrides & StylisticConfig): Promise<TypedFlatConfigItem[]> => {
    const {
        indent,
        jsx,
        overrides = {},
        prettier,
        quotes,
        semi,
    } = {
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        ...StylisticConfigDefaults,
        ...options,
    };

    const pluginStylistic = await interopDefault(import("@stylistic/eslint-plugin"));

    const config = pluginStylistic.configs.customize({
        indent,
        jsx,
        pluginName: "@stylistic",
        quotes: prettier ? undefined : quotes,
        semi: prettier ? false : semi,
    });

    // When a JS/TS formatter owns styling, defer to eslint-config-prettier's canonical list of the
    // rules that conflict with Prettier (and the Prettier-compatible oxfmt) instead of a
    // hand-maintained copy, so exactly the fighting rules are turned off and non-conflicting ones
    // (e.g. @stylistic/padding-line-between-statements) stay on.
    const prettierConflictRules = prettier ? await getPrettierConflictRules() : {};

    return [
        {
            name: "anolilab/stylistic/rules",
            plugins: {
                "@stylistic": pluginStylistic,
            },
            rules: {
                ...config.rules,

                // Disable arrow parens rule
                // We are using the arrow-parens
                "@stylistic/arrow-parens": "off",

                // enforce spacing inside single-line blocks
                "@stylistic/block-spacing": ["error", "always"],

                // Replace 'brace-style' rule with '@stylistic' version
                // enforce one true brace style
                "@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],

                // Replace 'comma-dangle' rule with '@stylistic' version
                // The TypeScript version also adds 3 new options, all of which should be set to the same value as the base config
                "@stylistic/comma-dangle": [
                    "error",
                    {
                        arrays: "always-multiline",
                        enums: "always-multiline",
                        exports: "always-multiline",
                        functions: "always-multiline",
                        generics: "always-multiline",
                        imports: "always-multiline",
                        objects: "always-multiline",
                        tuples: "always-multiline",
                    },
                ],

                // Replace 'comma-spacing' rule with '@stylistic' version
                // enforce spacing before and after comma
                "@stylistic/comma-spacing": ["error", { after: true, before: false }],

                // Replace 'func-call-spacing' rule with '@stylistic' version
                "@stylistic/function-call-spacing": ["error", "never"],

                "@stylistic/generator-star-spacing": ["error", { after: true, before: false }],

                "@stylistic/indent": [
                    "error",
                    indent as number | "tab" | undefined,
                    {
                        ArrayExpression: 1,
                        CallExpression: {
                            arguments: 1,
                        },
                        flatTernaryExpressions: false,
                        // MemberExpression: null,
                        FunctionDeclaration: {
                            body: 1,
                            parameters: 1,
                        },
                        FunctionExpression: {
                            body: 1,
                            parameters: 1,
                        },
                        ignoreComments: false,
                        // list derived from https://github.com/benjamn/ast-types/blob/HEAD/def/jsx.js
                        ignoredNodes: [
                            "JSXElement",
                            "JSXElement > *",
                            "JSXAttribute",
                            "JSXIdentifier",
                            "JSXNamespacedName",
                            "JSXMemberExpression",
                            "JSXSpreadAttribute",
                            "JSXExpressionContainer",
                            "JSXOpeningElement",
                            "JSXClosingElement",
                            "JSXFragment",
                            "JSXOpeningFragment",
                            "JSXClosingFragment",
                            "JSXText",
                            "JSXEmptyExpression",
                            "JSXSpreadChild",
                        ],
                        ImportDeclaration: 1,
                        ObjectExpression: 1,
                        outerIIFEBody: 1,
                        SwitchCase: 1,
                        VariableDeclarator: 1,
                    },
                ],

                // enforces spacing between keys and values in object literal properties
                "@stylistic/key-spacing": ["error", { afterColon: true, beforeColon: false }],

                // require a space before & after certain keywords
                "@stylistic/keyword-spacing": [
                    "error",
                    {
                        after: true,
                        before: true,
                        overrides: {
                            case: { after: true },
                            return: { after: true },
                            throw: { after: true },
                        },
                    },
                ],

                // require or disallow an empty line between class members
                // enforces empty lines around comments
                "@stylistic/lines-around-comment": "off",

                // require or disallow newlines around directives
                // https://eslint.org/docs/rules/lines-between-class-members
                "@stylistic/lines-between-class-members": ["error", "always", { exceptAfterSingleLine: false }],

                "@stylistic/member-delimiter-style": "error",

                // disallow unnecessary parentheses
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-parens.md
                "@stylistic/no-extra-parens": [
                    "error",
                    "all",
                    {
                        conditionalAssign: true,
                        ignoreJSX: "all", // delegate to eslint-plugin-react
                        nestedBinaryExpressions: false,
                        returnAssign: false,
                    },
                ],

                // Disallow non-null assertion in locations that may be confusing.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-extra-semi.md
                "@stylistic/no-extra-semi": "error",

                "@stylistic/padding-line-between-statements": [
                    "error",
                    // Require blank lines after all directive prologues (e.g. 'use strict')
                    {
                        blankLine: "always",
                        next: "*",
                        prev: "directive",
                    },
                    // Disallow blank lines between all directive prologues (e.g. 'use strict')
                    {
                        blankLine: "never",
                        next: "directive",
                        prev: "directive",
                    },
                    // Require blank lines after every sequence of variable declarations
                    {
                        blankLine: "always",
                        next: "*",
                        prev: ["const", "let", "var"],
                    },
                    // Blank lines could be between variable declarations
                    {
                        blankLine: "any",
                        next: ["const", "let", "var"],
                        prev: ["const", "let", "var"],
                    },
                    // Require blank lines before all return statements
                    {
                        blankLine: "always",
                        next: "return",
                        prev: "*",
                    },
                    // Require blank lines before and after all following statements
                    {
                        blankLine: "always",
                        next: ["for", "function", "if", "switch", "try"],
                        prev: "*",
                    },
                    {
                        blankLine: "always",
                        next: "*",
                        prev: ["for", "function", "if", "switch", "try"],
                    },
                ],

                // require quotes around object literal property names
                // https://eslint.org/docs/rules/quote-props.html
                "@stylistic/quote-props": ["error", "as-needed", { keywords: false, numbers: false, unnecessary: true }],

                // require or disallow space before blocks
                "@stylistic/space-before-blocks": "error",

                // require or disallow space before function opening parenthesis
                "@stylistic/space-before-function-paren": [
                    "error",
                    {
                        anonymous: "always",
                        asyncArrow: "always",
                        named: "never",
                    },
                ],

                // require spaces around operators
                "@stylistic/space-infix-ops": "error",

                "@stylistic/type-annotation-spacing": "error",

                "@stylistic/yield-star-spacing": ["error", { after: true, before: false }],

                ...overrides,

                ...prettierConflictRules,
            },
        },
    ];
};

export default stylistic;

export const StylisticConfigDefaults: StylisticConfig = {
    indent: 4,
    jsx: true,
    quotes: "double",
    semi: true,
};
