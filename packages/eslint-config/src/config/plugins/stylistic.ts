import type {
    OptionsHasPrettier,
    OptionsOverrides,
    StylisticConfig,
    TypedFlatConfigItem,
} from "../../types";
import interopDefault from "../../utils/interop-default";

const specialRule = 0;

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
        flat: true,
        indent,
        jsx,
        pluginName: "@stylistic",
        quotes: prettier ? undefined : quotes,
        semi: prettier ? false : semi,
    });

    return [
        {
            name: "anolilab/stylistic/rules",
            plugins: {
                "@stylistic": pluginStylistic,
            },
            rules: {
                ...config.rules,

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
                "@stylistic/func-call-spacing": ["error", "never"],

                "@stylistic/indent": [
                    "error",
                    indent,
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
                        enforceForArrowConditionals: false,
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

                ...overrides,

                ...prettier
                    ? {
                        "@stylistic/array-bracket-newline": "off",
                        "@stylistic/array-bracket-spacing": "off",
                        "@stylistic/array-element-newline": "off",
                        "@stylistic/arrow-parens": "off",
                        "@stylistic/arrow-spacing": "off",
                        "@stylistic/block-spacing": "off",
                        "@stylistic/brace-style": "off",
                        "@stylistic/comma-dangle": "off",
                        "@stylistic/comma-spacing": "off",
                        "@stylistic/comma-style": "off",
                        "@stylistic/computed-property-spacing": "off",
                        "@stylistic/dot-location": "off",
                        "@stylistic/eol-last": "off",
                        "@stylistic/func-call-spacing": "off",
                        "@stylistic/function-call-argument-newline": "off",
                        "@stylistic/function-call-spacing": "off",
                        "@stylistic/function-paren-newline": "off",
                        "@stylistic/generator-star-spacing": "off",
                        "@stylistic/implicit-arrow-linebreak": "off",
                        "@stylistic/indent": "off",
                        "@stylistic/indent-binary-ops": "off",
                        "@stylistic/js/array-bracket-newline": "off",
                        "@stylistic/js/array-bracket-spacing": "off",
                        "@stylistic/js/array-element-newline": "off",
                        "@stylistic/js/arrow-parens": "off",
                        "@stylistic/js/arrow-spacing": "off",
                        "@stylistic/js/block-spacing": "off",
                        "@stylistic/js/brace-style": "off",
                        "@stylistic/js/comma-dangle": "off",
                        "@stylistic/js/comma-spacing": "off",
                        "@stylistic/js/comma-style": "off",
                        "@stylistic/js/computed-property-spacing": "off",
                        "@stylistic/js/dot-location": "off",
                        "@stylistic/js/eol-last": "off",
                        "@stylistic/js/func-call-spacing": "off",
                        "@stylistic/js/function-call-argument-newline": "off",
                        "@stylistic/js/function-call-spacing": "off",
                        "@stylistic/js/function-paren-newline": "off",
                        "@stylistic/js/generator-star-spacing": "off",
                        "@stylistic/js/implicit-arrow-linebreak": "off",
                        "@stylistic/js/indent": "off",
                        "@stylistic/js/jsx-quotes": "off",
                        "@stylistic/js/key-spacing": "off",
                        "@stylistic/js/keyword-spacing": "off",
                        "@stylistic/js/linebreak-style": "off",
                        "@stylistic/js/lines-around-comment": specialRule,
                        "@stylistic/js/max-len": specialRule,
                        "@stylistic/js/max-statements-per-line": "off",
                        "@stylistic/js/multiline-ternary": "off",
                        "@stylistic/js/new-parens": "off",
                        "@stylistic/js/newline-per-chained-call": "off",
                        "@stylistic/js/no-confusing-arrow": specialRule,
                        "@stylistic/js/no-extra-parens": "off",
                        "@stylistic/js/no-extra-semi": "off",
                        "@stylistic/js/no-floating-decimal": "off",
                        "@stylistic/js/no-mixed-operators": specialRule,
                        "@stylistic/js/no-mixed-spaces-and-tabs": "off",
                        "@stylistic/js/no-multi-spaces": "off",
                        "@stylistic/js/no-multiple-empty-lines": "off",
                        "@stylistic/js/no-tabs": specialRule,
                        "@stylistic/js/no-trailing-spaces": "off",
                        "@stylistic/js/no-whitespace-before-property": "off",
                        "@stylistic/js/nonblock-statement-body-position": "off",
                        "@stylistic/js/object-curly-newline": "off",
                        "@stylistic/js/object-curly-spacing": "off",
                        "@stylistic/js/object-property-newline": "off",
                        "@stylistic/js/one-var-declaration-per-line": "off",
                        "@stylistic/js/operator-linebreak": "off",
                        "@stylistic/js/padded-blocks": "off",
                        "@stylistic/js/quote-props": "off",
                        "@stylistic/js/quotes": specialRule,
                        "@stylistic/js/rest-spread-spacing": "off",
                        "@stylistic/js/semi": "off",
                        "@stylistic/js/semi-spacing": "off",
                        "@stylistic/js/semi-style": "off",
                        "@stylistic/js/space-before-blocks": "off",
                        "@stylistic/js/space-before-function-paren": "off",
                        "@stylistic/js/space-in-parens": "off",
                        "@stylistic/js/space-infix-ops": "off",
                        "@stylistic/js/space-unary-ops": "off",
                        "@stylistic/js/switch-colon-spacing": "off",
                        "@stylistic/js/template-curly-spacing": "off",
                        "@stylistic/js/template-tag-spacing": "off",
                        "@stylistic/js/wrap-iife": "off",
                        "@stylistic/js/wrap-regex": "off",
                        "@stylistic/js/yield-star-spacing": "off",
                        "@stylistic/jsx-child-element-spacing": "off",
                        "@stylistic/jsx-closing-bracket-location": "off",
                        "@stylistic/jsx-closing-tag-location": "off",
                        "@stylistic/jsx-curly-newline": "off",
                        "@stylistic/jsx-curly-spacing": "off",
                        "@stylistic/jsx-equals-spacing": "off",
                        "@stylistic/jsx-first-prop-new-line": "off",
                        "@stylistic/jsx-indent": "off",
                        "@stylistic/jsx-indent-props": "off",
                        "@stylistic/jsx-max-props-per-line": "off",
                        "@stylistic/jsx-newline": "off",
                        "@stylistic/jsx-one-expression-per-line": "off",
                        "@stylistic/jsx-props-no-multi-spaces": "off",
                        "@stylistic/jsx-quotes": "off",
                        "@stylistic/jsx-tag-spacing": "off",
                        "@stylistic/jsx-wrap-multilines": "off",
                        "@stylistic/jsx/jsx-child-element-spacing": "off",
                        "@stylistic/jsx/jsx-closing-bracket-location": "off",
                        "@stylistic/jsx/jsx-closing-tag-location": "off",
                        "@stylistic/jsx/jsx-curly-newline": "off",
                        "@stylistic/jsx/jsx-curly-spacing": "off",
                        "@stylistic/jsx/jsx-equals-spacing": "off",
                        "@stylistic/jsx/jsx-first-prop-new-line": "off",
                        "@stylistic/jsx/jsx-indent": "off",
                        "@stylistic/jsx/jsx-indent-props": "off",
                        "@stylistic/jsx/jsx-max-props-per-line": "off",
                        "@stylistic/key-spacing": "off",
                        "@stylistic/keyword-spacing": "off",
                        "@stylistic/linebreak-style": "off",
                        "@stylistic/lines-around-comment": specialRule,
                        "@stylistic/max-len": specialRule,
                        "@stylistic/max-statements-per-line": "off",
                        "@stylistic/member-delimiter-style": "off",
                        "@stylistic/multiline-ternary": "off",
                        "@stylistic/new-parens": "off",
                        "@stylistic/newline-per-chained-call": "off",
                        "@stylistic/no-confusing-arrow": specialRule,
                        "@stylistic/no-extra-parens": "off",
                        "@stylistic/no-extra-semi": "off",
                        "@stylistic/no-floating-decimal": "off",
                        "@stylistic/no-mixed-operators": specialRule,
                        "@stylistic/no-mixed-spaces-and-tabs": "off",
                        "@stylistic/no-multi-spaces": "off",
                        "@stylistic/no-multiple-empty-lines": "off",
                        "@stylistic/no-tabs": specialRule,
                        "@stylistic/no-trailing-spaces": "off",
                        "@stylistic/no-whitespace-before-property": "off",
                        "@stylistic/nonblock-statement-body-position": "off",
                        "@stylistic/object-curly-newline": "off",
                        "@stylistic/object-curly-spacing": "off",
                        "@stylistic/object-property-newline": "off",
                        "@stylistic/one-var-declaration-per-line": "off",
                        "@stylistic/operator-linebreak": "off",
                        "@stylistic/padded-blocks": "off",
                        "@stylistic/quote-props": "off",
                        "@stylistic/quotes": specialRule,
                        "@stylistic/rest-spread-spacing": "off",
                        "@stylistic/semi": "off",
                        "@stylistic/semi-spacing": "off",
                        "@stylistic/semi-style": "off",
                        "@stylistic/space-before-blocks": "off",
                        "@stylistic/space-before-function-paren": "off",
                        "@stylistic/space-in-parens": "off",
                        "@stylistic/space-infix-ops": "off",
                        "@stylistic/space-unary-ops": "off",
                        "@stylistic/switch-colon-spacing": "off",
                        "@stylistic/template-curly-spacing": "off",
                        "@stylistic/template-tag-spacing": "off",
                        "@stylistic/ts/block-spacing": "off",
                        "@stylistic/ts/brace-style": "off",
                        "@stylistic/ts/comma-dangle": "off",
                        "@stylistic/ts/comma-spacing": "off",
                        "@stylistic/ts/func-call-spacing": "off",
                        "@stylistic/ts/function-call-spacing": "off",
                        "@stylistic/ts/indent": "off",
                        "@stylistic/ts/key-spacing": "off",
                        "@stylistic/ts/keyword-spacing": "off",
                        "@stylistic/ts/lines-around-comment": specialRule,
                        "@stylistic/ts/member-delimiter-style": "off",
                        "@stylistic/ts/no-extra-parens": "off",
                        "@stylistic/ts/no-extra-semi": "off",
                        "@stylistic/ts/object-curly-spacing": "off",
                        "@stylistic/ts/quotes": specialRule,
                        "@stylistic/ts/semi": "off",
                        "@stylistic/ts/space-before-blocks": "off",
                        "@stylistic/ts/space-before-function-paren": "off",
                        "@stylistic/ts/space-infix-ops": "off",
                        "@stylistic/ts/type-annotation-spacing": "off",
                        "@stylistic/type-annotation-spacing": "off",
                        "@stylistic/type-generic-spacing": "off",
                        "@stylistic/type-named-tuple-spacing": "off",
                        "@stylistic/wrap-iife": "off",
                        "@stylistic/wrap-regex": "off",
                        "@stylistic/yield-star-spacing": "off",
                    }
                    : {},
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
