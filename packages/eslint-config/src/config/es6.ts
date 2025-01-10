import type { Linter } from "eslint";

import type { OptionsFiles } from "../types";
import { createConfig, getFilesGlobs } from "../utils/create-config";

export const es6Rules: Partial<Linter.RulesRecord> = {
    // enforces no braces where they can be omitted
    // https://eslint.org/docs/rules/arrow-body-style
    "arrow-body-style": [
        "error",
        "as-needed",
        {
            requireReturnForObjectLiteral: true,
        },
    ],

    // require parens in arrow function arguments
    // https://eslint.org/docs/rules/arrow-parens
    "arrow-parens": ["error", "always"],

    // require space before/after arrow function's arrow
    // https://eslint.org/docs/rules/arrow-spacing
    "arrow-spacing": ["error", { after: true, before: true }],

    // verify super() callings in constructors
    "constructor-super": "error",

    // enforce the spacing around the * in generator functions
    // https://eslint.org/docs/rules/generator-star-spacing
    "generator-star-spacing": ["error", { after: true, before: false }],

    // disallow modifying variables of class declarations
    // https://eslint.org/docs/rules/no-class-assign
    "no-class-assign": "error",

    // disallow arrow functions where they could be confused with comparisons
    // https://eslint.org/docs/rules/no-confusing-arrow
    "no-confusing-arrow": [
        "error",
        {
            allowParens: true,
        },
    ],

    // disallow modifying variables that are declared using const
    "no-const-assign": "error",

    // disallow duplicate class members
    // https://eslint.org/docs/rules/no-dupe-class-members
    "no-dupe-class-members": "error",

    // disallow importing from the same path more than once
    // https://eslint.org/docs/rules/no-duplicate-imports
    // replaced by https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-duplicates.md
    "no-duplicate-imports": "off",

    // disallow symbol constructor
    // https://eslint.org/docs/rules/no-new-symbol
    "no-new-symbol": "error",

    // Disallow specified names in exports
    // https://eslint.org/docs/rules/no-restricted-exports
    "no-restricted-exports": [
        "error",
        {
            // default export while still blocking other "default" exports.
            // The 'default' entry in restrictedNamedExports must also be removed.
            // See https://github.com/airbnb/javascript/issues/2500 and https://github.com/eslint/eslint/pull/16785
            restrictDefaultExports: {
                defaultFrom: false, // permits `export { default } from 'foo';` declarations
                direct: false, // permits `export default` declarations
                named: true, // restricts `export { foo as default };` declarations
                namedFrom: false, // permits `export { foo as default } from 'foo';` declarations
                namespaceFrom: true, // restricts `export * as default from 'foo';` declarations
            },
            // this will cause tons of confusion when your module is dynamically `import()`ed
            restrictedNamedExports: ["then"],
        },
    ],

    // disallow specific imports
    // https://eslint.org/docs/rules/no-restricted-imports
    "no-restricted-imports": [
        "error",
        {
            paths: [
                {
                    message: "Lodash modularised (and lodash < 4.17.11) have CVE vulnerabilities. Please use tree-shakeable imports like lodash/xxx instead",
                    name: "lodash.isequal",
                },
                {
                    message: "Lodash modularised (and lodash < 4.17.11) have CVE vulnerabilities. Please use tree-shakeable imports like lodash/xxx instead",
                    name: "lodash.uniqueId",
                },
                {
                    message: "Lodash modularised (and lodash < 4.17.11) have CVE vulnerabilities. Please use tree-shakeable imports like lodash/xxx instead",
                    name: "lodash.mergewith",
                },
                {
                    message: "Lodash modularised (and lodash < 4.17.11) have CVE vulnerabilities. Please use tree-shakeable imports like lodash/xxx instead",
                    name: "lodash.pick",
                },
                {
                    name: "error",
                },
                {
                    name: "domain",
                },
                {
                    name: "freelist",
                },
                {
                    name: "smalloc",
                },
                {
                    name: "punycode",
                },
                {
                    name: "sys",
                },
                {
                    message: "Is legacy, npm version got deprecated, migrate to URLSearchParams as recommended or try \"qs\" as a package",
                    name: "querystring",
                },
                {
                    message: "Please use one of the following instead: chalk, kleur, ansi-colors, @colors/colors",
                    name: "colors",
                },
                {
                    message: "node v10.12 mkdir supports recursive option",
                    name: "mkdirp",
                },
                {
                    message: "Please use \"@faker-js/faker\" as a replacement",
                    name: "faker",
                },
                {
                    message: "Please use Object.assign or spread { ...obj }",
                    name: "xtend",
                },
                {
                    message: "Please use Object.assign or spread { ...obj }",
                    name: "object-assign",
                },
                {
                    message: "Please use Object.assign or spread { ...obj }",
                    name: "extend-shallow",
                },
                {
                    message: "node supports recursive option now",
                    name: "rimraf",
                },
                {
                    message: "just use \"\".padStart() and \"\".padEnd()",
                    name: "pad-left",
                },
                {
                    message: "just use \"\".padStart() and \"\".padEnd()",
                    name: "pad-right",
                },
                {
                    message: "just use \"\".padStart() and \"\".padEnd()",
                    name: "left-pad",
                },
                {
                    message: "just use \"\".padStart() and \"\".padEnd()",
                    name: "right-pad",
                },
                {
                    message: "just use \"\".padStart() and \"\".padEnd()",
                    name: "pad",
                },
                {
                    name: "safe-buffer",
                },
                {
                    name: "safer-buffer",
                },
                {
                    message: "just use [].flat() or some other polyfill",
                    name: "array-flatten",
                },
                {
                    message: "Been deprecated",
                    name: "request",
                },
                {
                    message: "use async/await instead",
                    name: "co",
                },
                {
                    message: "Please use TextDecoder instead",
                    name: "windows-1252",
                },
                {
                    message: "Please use TextDecoder instead",
                    name: "string_decoder",
                },
                {
                    message: "Please use array.prototype.flatMap instead",
                    name: "concat-map",
                },
                {
                    name: "buffer-alloc",
                },
            ],
            // catch-all for any lodash modularized.
            // The CVE is listed against the entire family for lodash < 4.17.11
            patterns: ["lodash.*"],
        },
    ],

    // disallow to use this/super before super() calling in constructors.
    // https://eslint.org/docs/rules/no-this-before-super
    "no-this-before-super": "error",

    // disallow useless computed property keys
    // https://eslint.org/docs/rules/no-useless-computed-key
    "no-useless-computed-key": "error",

    // disallow unnecessary constructor
    // https://eslint.org/docs/rules/no-useless-constructor
    "no-useless-constructor": "error",

    // disallow renaming import, export, and destructured assignments to the same name
    // https://eslint.org/docs/rules/no-useless-rename
    "no-useless-rename": [
        "error",
        {
            ignoreDestructuring: false,
            ignoreExport: false,
            ignoreImport: false,
        },
    ],

    // require let or const instead of var
    "no-var": "error",

    // require method and property shorthand syntax for object literals
    // https://eslint.org/docs/rules/object-shorthand
    "object-shorthand": [
        "error",
        "always",
        {
            avoidQuotes: true,
            ignoreConstructors: false,
        },
    ],

    // suggest using arrow functions as callbacks
    "prefer-arrow-callback": [
        "error",
        {
            allowNamedFunctions: false,
            allowUnboundThis: true,
        },
    ],

    // suggest using of const declaration for variables that are never modified after declared
    "prefer-const": [
        "error",
        {
            destructuring: "any",
            ignoreReadBeforeAssign: true,
        },
    ],

    // Prefer destructuring from arrays and objects
    // https://eslint.org/docs/rules/prefer-destructuring
    "prefer-destructuring": [
        "error",
        {
            AssignmentExpression: {
                array: true,
                object: false,
            },
            VariableDeclarator: {
                array: false,
                object: true,
            },
        },
        {
            enforceForRenamedProperties: false,
        },
    ],

    // disallow parseInt() in favor of binary, octal, and hexadecimal literals
    // https://eslint.org/docs/rules/prefer-numeric-literals
    "prefer-numeric-literals": "error",

    // suggest using Reflect methods where applicable
    // https://eslint.org/docs/rules/prefer-reflect
    "prefer-reflect": "off",

    // use rest parameters instead of arguments
    // https://eslint.org/docs/rules/prefer-rest-params
    "prefer-rest-params": "error",

    // suggest using the spread operator instead of .apply()
    // https://eslint.org/docs/rules/prefer-spread
    "prefer-spread": "error",

    // suggest using template literals instead of string concatenation
    // https://eslint.org/docs/rules/prefer-template
    "prefer-template": "error",

    // disallow generator functions that do not have yield
    // https://eslint.org/docs/rules/require-yield
    "require-yield": "error",

    // enforce spacing between object rest-spread
    // https://eslint.org/docs/rules/rest-spread-spacing
    "rest-spread-spacing": ["error", "never"],

    // import sorting
    // https://eslint.org/docs/rules/sort-imports
    "sort-imports": [
        "off",
        {
            ignoreCase: false,
            ignoreDeclarationSort: false,
            ignoreMemberSort: false,
            memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        },
    ],

    // require a Symbol description
    // https://eslint.org/docs/rules/symbol-description
    "symbol-description": "error",

    // enforce usage of spacing in template strings
    // https://eslint.org/docs/rules/template-curly-spacing
    "template-curly-spacing": "error",

    // enforce spacing around the * in yield* expressions
    // https://eslint.org/docs/rules/yield-star-spacing
    "yield-star-spacing": ["error", "after"],
};

export default createConfig<OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles } = config;

    return [
        {
            files,
            languageOptions: {
                parserOptions: {
                    ecmaFeatures: {
                        generators: false,
                        objectLiteralDuplicateProperties: false,
                    },
                    ecmaVersion: 6,
                    sourceType: "module",
                },
            },
            name: "anolilab/es6/rules",
            rules: es6Rules,
        },
        // The following rules are enabled in config, but are already checked (more thoroughly) by the TypeScript compiler
        // Some rules also fail in TypeScript files, for example: https://github.com/typescript-eslint/typescript-eslint/issues/662#issuecomment-507081586
        {
            files: getFilesGlobs("ts"),
            name: "anolilab/es6/ts-rules",
            rules: {
                "constructor-super": "off",

                // Enforce constituents of a type union/intersection to be sorted alphabetically.
                "no-const-assign": "off",

                // Enforce specifying generic type arguments on constructor name of a constructor call.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-dupe-class-members.md
                "no-dupe-class-members": "off",

                // Disallow TypeScript namespaces.
                "no-new-symbol": "off",

                // Disallow aliasing this.
                "no-this-before-super": "off",

                // Disallow returning a value with type any from a function.
                // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/no-useless-constructor.md
                "no-useless-constructor": "off",
            },
        },
    ];
});
