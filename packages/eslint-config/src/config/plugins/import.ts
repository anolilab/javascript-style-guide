import { fromRoot, packageIsTypeModule, projectPath } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { createConfigs } from "../../utils/create-config";
import anolilabEslintConfig from "../../utils/eslint-config";

if (global.anolilabEslintImportNoUnusedModulesConfig === undefined && anolilabEslintConfig["import_ignore_exports"]) {
    if (!Array.isArray(anolilabEslintConfig["import_ignore_exports"])) {
        throw new TypeError("import.ignore_exports must be a array");
    }

    global.anolilabEslintImportNoUnusedModulesConfig = anolilabEslintConfig["import_ignore_exports"] as string[];
}

const config: Linter.Config = createConfigs([
    {
        config: {
            env: {
                es6: true,
            },

            parserOptions: {
                ecmaVersion: 6,
                sourceType: "module",
            },
            plugins: ["import"],
            rules: {
                // enforce a consistent style for type specifiers (inline or top-level)
                // https://github.com/un-es/eslint-plugin-i/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/consistent-type-specifier-style.md
                "import/consistent-type-specifier-style": ["error", "prefer-top-level"],

                // ensure named imports coupled with named exports
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/default.md#when-not-to-use-it
                "import/default": "off",

                // dynamic imports require a leading comment with a webpackChunkName
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/dynamic-import-chunkname.md
                "import/dynamic-import-chunkname": [
                    "off",
                    {
                        importFunctions: [],
                        webpackChunknameFormat: "[0-9a-zA-Z-_/.]+",
                    },
                ],

                // disallow invalid exports, e.g. multiple defaults
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/export.md
                "import/export": "error",

                // This rule enforces that all exports are declared at the bottom of the file.
                // https://github.com/import-js/eslint-plugin-import/blob/98acd6afd04dcb6920b81330114e146dc8532ea4/docs/rules/exports-last.md
                "import/exports-last": "error",

                // Ensure consistent use of file extension within the import path
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/extensions.md
                "import/extensions": [
                    "error",
                    "ignorePackages",
                    packageIsTypeModule
                        ? {
                            cjs: "always",
                            js: "always",
                            jsx: "always",
                            mjs: "always",
                            json: "always",
                        }
                        : {
                            cjs: "never",
                            js: "never",
                            jsx: "never",
                            mjs: "never",
                            json: "always",
                        },
                ],

                // disallow non-import statements appearing before import statements
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/first.md
                "import/first": "error",

                // Reports when named exports are not grouped together in a single export declaration
                // or when multiple assignments to CommonJS module.exports or exports object are present
                // in a single file.
                // https://github.com/import-js/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/group-exports.md
                "import/group-exports": "off",

                // disallow non-import statements appearing before import statements
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/imports-first.md
                // deprecated: use `import/first`
                "import/imports-first": "off",

                // "import/max-dependencies" is not super useful
                // Either you will disable the eslint rule because it's "normal"
                // to have a lot of dependencies or feel compelled to reduce the number of imports.
                // It's already visible that a file has many imports and that ideally they should be
                // less imports, no need for ESLint, let's keep ESLint for more valuable things.
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/max-dependencies.md
                "import/max-dependencies": ["off", { max: 10 }],

                // disallow require()
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/named.md#when-not-to-use-it
                "import/named": "error",

                // disallow AMD require/define
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/namespace.md
                "import/namespace": "off",

                // Require a newline after the last import/require in a group
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/newline-after-import.md
                "import/newline-after-import": "error",

                // Forbid import of modules using absolute paths
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-absolute-path.md
                "import/no-absolute-path": "error",

                // disallow AMD require/define
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-amd.md
                "import/no-amd": "error",

                // Reports if a module's default export is unnamed
                // https://github.com/import-js/eslint-plugin-import/blob/d9b712ac7fd1fddc391f7b234827925c160d956f/docs/rules/no-anonymous-default-export.md
                "import/no-anonymous-default-export": [
                    "off",
                    {
                        allowAnonymousClass: false,
                        allowAnonymousFunction: false,
                        allowArray: false,
                        allowArrowFunction: false,
                        allowLiteral: false,
                        allowObject: false,
                    },
                ],

                // disallow require()
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-commonjs.md
                "import/no-commonjs": packageIsTypeModule ? ["error", { allowPrimitiveModules: true }] : "off",

                // Forbid cyclical dependencies between modules
                // https://medium.com/@steven-lemon182/are-typescript-barrel-files-an-anti-pattern-72a713004250
                "import/no-cycle": ["error", { maxDepth: "∞" }],

                // forbid default exports. this is a terrible rule, do not use it.
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-default-export.md
                "import/no-default-export": "off",

                // disallow use of jsdoc-marked-deprecated imports
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-deprecated.md
                "import/no-deprecated": "off",

                // disallow duplicate imports
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-duplicates.md
                "import/no-duplicates": "error",

                // Forbid require() calls with expressions
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-dynamic-require.md
                "import/no-dynamic-require": "error",

                // Reports the use of empty named import blocks.
                // https://github.com/un-es/eslint-plugin-i/blob/d5fc8b670dc8e6903dbb7b0894452f60c03089f5/docs/rules/no-empty-named-blocks.md
                "import/no-empty-named-blocks": "error",

                // Forbid the use of extraneous packages
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-extraneous-dependencies.md
                // paths are treated both as absolute paths, and relative to process.cwd()
                "import/no-extraneous-dependencies": [
                    "error",
                    {
                        devDependencies: [
                            "test/**", // tape, common npm pattern
                            "tests/**", // also common npm pattern
                            "spec/**", // mocha, rspec-like pattern
                            "**/fixture/**", // jest pattern
                            "**/__mocks__/**", // jest pattern
                            "test.{js,jsx}", // repos with a single test file
                            "test-*.{js,jsx}", // repos with multiple top-level test files
                            "**/*{.,_}{test,spec}.{js,jsx}", // tests where the extension or filename suffix denotes that it is a test
                            "**/jest.config.cjs", // jest config
                            "**/jest.setup.js", // jest setup
                            "**/vue.config.cjs", // vue-cli config
                            "**/webpack.config.cjs", // webpack config
                            "**/webpack.config.*.js", // webpack config
                            "**/rollup.config.cjs", // rollup config
                            "**/rollup.config.*.js", // rollup config
                            "**/gulpfile.js", // gulp config
                            "**/gulpfile.*.js", // gulp config
                            "**/Gruntfile{,.js}", // grunt config
                            "**/protractor.conf.js", // protractor config
                            "**/protractor.conf.*.js", // protractor config
                            "**/karma.conf.js", // karma config
                            "**/.eslintrc.js", // eslint config
                            "**/.eslintrc.cjs", // eslint config
                            "**/.eslintrc.mjs", // eslint config
                            "**/eslint.config.js", // eslint flat config
                            "**/eslint.config.mjs", // eslint flat config
                            "**/eslint.config.cjs", // eslint flat config
                            "**/vite.config.js", // vite config
                            "**/vite.config.ts", // vite config
                            "**/vitest.config.js", // vitest config
                            "**/vitest.config.ts", // vitest config
                            "**/__tests__/**/*.?(c|m)[jt]s?(x)", // vitest config test include
                            "**/?(*.){test,spec}.?(c|m)[jt]s?(x)", // vitest config test include
                        ],
                        optionalDependencies: false,
                    },
                ],

                // prevent importing the submodules of other modules
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-internal-modules.md
                "import/no-internal-modules": [
                    "off",
                    {
                        allow: [],
                    },
                ],

                // Forbid mutable exports
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-mutable-exports.md
                "import/no-mutable-exports": "error",

                // Warn if a module could be mistakenly parsed as a script by a consumer
                // leveraging Unambiguous JavaScript Grammar
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/unambiguous.md
                // this should not be enabled until this proposal has at least been *presented* to TC39.
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-as-default.md
                "import/no-named-as-default": "error",

                // warn on accessing default export property names that are also named exports
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-as-default-member.md
                "import/no-named-as-default-member": "error",

                // Prevent importing the default as if it were named
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-named-default.md
                "import/no-named-default": "error",

                // Prohibit named exports. this is a terrible rule, do not use it.
                // https://github.com/import-js/eslint-plugin-import/blob/1ec80fa35fa1819e2d35a70e68fb6a149fb57c5e/docs/rules/no-named-export.md
                "import/no-named-export": "off",

                // disallow namespace imports
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-namespace.md
                "import/no-namespace": "error",

                // No Node.js builtin modules
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-nodejs-modules.md
                // TODO: enable?
                "import/no-nodejs-modules": "off",

                // Use this rule to prevent imports to folders in relative parent paths.
                // https://github.com/import-js/eslint-plugin-import/blob/c34f14f67f077acd5a61b3da9c0b0de298d20059/docs/rules/no-relative-parent-imports.md
                "import/no-relative-parent-imports": "off",

                // Restrict which files can be imported in a given folder
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-restricted-paths.md
                "import/no-restricted-paths": "off",

                // Forbid a module from importing itself
                // https://github.com/import-js/eslint-plugin-import/blob/44a038c06487964394b1e15b64f3bd34e5d40cde/docs/rules/no-self-import.md
                "import/no-self-import": "error",

                // Forbid a module from importing itself
                // importing for side effects is perfectly acceptable, if you need side effects.
                "import/no-unassigned-import": "off",

                // ensure imports point to files/modules that can be resolved
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-unresolved.md
                "import/no-unresolved": ["error", { caseSensitive: true, commonjs: true }],

                // Reports modules without any exports, or with unused exports
                // https://github.com/import-js/eslint-plugin-import/blob/f63dd261809de6883b13b6b5b960e6d7f42a7813/docs/rules/no-unused-modules.md
                "import/no-unused-modules": [
                    packageIsTypeModule ? "error" : "off",
                    {
                        ignoreExports: global.anolilabEslintImportNoUnusedModulesConfig ?? [],
                        missingExports: true,
                        unusedExports: true,
                    },
                ],

                // Reports the use of import declarations with CommonJS exports in any module except for the main module.
                // https://github.com/import-js/eslint-plugin-import/blob/1012eb951767279ce3b540a4ec4f29236104bb5b/docs/rules/no-import-module-exports.md
                "import/no-import-module-exports": [
                    packageIsTypeModule ? "off" : "error",
                    {
                        exceptions: [],
                    },
                ],

                // Use this rule to prevent importing packages through relative paths.
                // https://github.com/import-js/eslint-plugin-import/blob/1012eb951767279ce3b540a4ec4f29236104bb5b/docs/rules/no-relative-packages.md
                "import/no-relative-packages": "error",

                // Ensures that there are no useless path segments
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-useless-path-segments.md
                "import/no-useless-path-segments": ["error", { commonjs: true, noUselessIndex: true }],

                // Forbid Webpack loader syntax in imports
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/no-webpack-loader-syntax.md
                "import/no-webpack-loader-syntax": "error",

                // ensure absolute imports are above relative imports and that unassigned imports are ignored
                // https://github.com/import-js/eslint-plugin-import/blob/f63dd261809de6883b13b6b5b960e6d7f42a7813/docs/rules/no-unused-modules.md
                // simple-import-sort does this better
                "import/order": "off",

                // Require modules with a single export to use a default export
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/prefer-default-export.md
                "import/prefer-default-export": "error",

                // Warn if a module could be mistakenly parsed as a script by a consumer
                // leveraging Unambiguous JavaScript Grammar
                // https://github.com/import-js/eslint-plugin-import/blob/main/docs/rules/unambiguous.md
                // this should not be enabled until this proposal has at least been *presented* to TC39.
                // At the moment, it's not a thing.
                "import/unambiguous": "off",
            },
            settings: {
                "import/core-modules": [],
                // https://github.com/un-es/eslint-plugin-i/blob/main/docs/rules/extensions.md
                "import/extensions": [".js", ".cjs", ".mjs", ".jsx"],
                // Ensure consistent use of file extension within the import path
                "import/ignore": ["\\.(coffee|scss|css|less|hbs|svg|json)$"],
            },
        },
        type: "all",
    },
    {
        config: {
            settings: {
                "import/resolver": {
                    "@jsenv/eslint-import-resolver": {
                        rootDirectoryUrl: projectPath,
                        packageConditions: ["node", "import"],
                    },
                },
            },
        },
        type: "javascript",
    },
    {
        config: {
            extends: ["plugin:import/typescript"],
            rules: {
                // Does not work when the TS definition exports a default const.
                "import/default": "off",

                // Disabled because of https://github.com/import-js/eslint-plugin-import/issues/1590
                "import/export": "off",

                // Disabled as it doesn't work with TypeScript.
                "import/extensions": [
                    "error",
                    "ignorePackages",
                    {
                        js: "never",
                        jsx: "never",
                        mjs: "never",
                        cjs: "never",
                        ts: "never",
                        tsx: "never",
                        json: "always",
                        svg: "always",
                    },
                ],

                // This issue and some others: https://github.com/import-js/eslint-plugin-import/issues/1341
                "import/named": "off",

                // ensure imports point to files/modules that can be resolved
                "import/no-unresolved": "off",
            },
            settings: {
                // Append 'ts' extensions to 'import/extensions' setting
                "import/extensions": [".js", ".mjs", ".jsx", ".ts", ".tsx", ".d.ts", ".cjs", ".cts", ".mts"],

                // Resolve type definition packages
                "import/external-module-folders": ["node_modules", "node_modules/@types"],

                // Apply special parsing for TypeScript files
                "import/parsers": {
                    "@typescript-eslint/parser": [".ts", ".cts", ".mts", ".tsx", ".d.ts"],
                },

                // Append 'ts' extensions to 'import/resolver' setting
                "import/resolver": {
                    typescript: {
                        alwaysTryTypes: true, // always try to resolve types under `<root>@types` directory even it doesn't contain any source code, like `@types/unist`
                        project: fromRoot("tsconfig.json"),
                    },
                },
            },
        },
        type: "typescript",
    },
    {
        config: {
            rules: {
                "import/no-duplicates": "off",
            },
        },
        type: "d.ts",
    },
]);

export default config;
