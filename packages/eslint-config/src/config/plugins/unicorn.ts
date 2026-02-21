import globals from "globals";

import type { OptionsFiles, OptionsHasPrettier, OptionsOverrides, OptionsPackageJson, OptionsStylistic } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

const FILENAME_IGNORE_PATTERN = /(FUNDING\.yml|README\.md|CHANGELOG\.md|CONTRIBUTING\.md|CODE_OF_CONDUCT\.md|SECURITY\.md|LICENSE)/u;

export default createConfig<OptionsFiles & OptionsHasPrettier & OptionsOverrides & OptionsPackageJson & OptionsStylistic>("all", async (config, oFiles) => {
    const { files = oFiles, overrides, packageJson, prettier, stylistic = true } = config;

    const { indent = 4 } = typeof stylistic === "boolean" ? {} : stylistic;

    const pluginUnicorn = await interopDefault(import("eslint-plugin-unicorn"));

    return [
        {
            languageOptions: {
                globals: globals.builtin,
            },
            name: "anolilab/unicorn/plugin",
            plugins: {
                unicorn: pluginUnicorn,
            },
        },
        {
            files,
            name: "anolilab/unicorn/rules",
            rules: {
                ...pluginUnicorn.configs.recommended.rules,

                // Disabled because of eslint-plugin-regexp
                "unicorn/better-regex": "off",
                // TODO: Disabled for now until it becomes more stable: https://github.com/sindresorhus/eslint-plugin-unicorn/search?q=consistent-destructuring+is:issue&state=open&type=issues
                "unicorn/consistent-destructuring": "off",
                // TODO: Remove this override when the rule is more stable.
                "unicorn/consistent-function-scoping": "off",

                "unicorn/filename-case": [
                    "error",
                    {
                        case: "kebabCase",
                        ignore: [FILENAME_IGNORE_PATTERN],
                    },
                ],

                "unicorn/import-style": [
                    "error",
                    {
                        styles: {
                            "node:path": {
                                named: true,
                            },
                            "node:util": {
                                named: true,
                            },
                            path: {
                                named: true,
                            },
                            util: {
                                named: true,
                            },
                        },
                    },
                ],

                "unicorn/no-abusive-eslint-disable": "error",

                "unicorn/no-array-for-each": "off",

                "unicorn/no-instanceof-builtins": "error",

                // Disabled because of the use of sonarjs/no-nested-conditional
                "unicorn/no-nested-ternary": "off",

                // TODO: Temporarily disabled until it becomes more mature.
                "unicorn/no-useless-undefined": "off",

                // Disabled to use faster alternatives.
                "unicorn/prefer-at": "off",

                // It will be disabled in the next version of eslint-plugin-unicorn.
                "unicorn/prefer-json-parse-buffer": "off",

                "unicorn/prefer-module": packageJson.type === "module" ? "error" : "off",

                "unicorn/prefer-node-protocol": "error",

                // We only enforce it for single-line statements to not be too opinionated.
                "unicorn/prefer-ternary": ["error", "only-single-line"],

                // https://github.com/sindresorhus/eslint-plugin-unicorn/blob/898fcb4/docs/rules/prevent-abbreviations.md
                "unicorn/prevent-abbreviations": [
                    "error",
                    {
                        allowList: {
                            // for-loop index
                            i: true,
                            j: true,
                        },
                        replacements: {
                            args: false,
                            dev: false,
                            dist: false,
                            env: false,
                            // Common abbreviation (e.g. URLSearchParams)
                            params: false,

                            pkg: false,
                            // Vue.js
                            prop: false,

                            props: false,
                            ref: false,
                            src: false,
                            utils: false,
                        },
                    },
                ],

                ...prettier
                    ? {
                        "unicorn/empty-brace-spaces": "off",
                        // Its disabled
                        // "unicorn/no-nested-ternary": "off",
                        "unicorn/number-literal-case": "off",
                        "unicorn/template-indent": "off",
                    }
                    : {
                        "unicorn/template-indent": ["error", { indent }],
                    },

                ...overrides,
            },
        },
        {
            files: ["tsconfig.dev.json", "tsconfig.prod.json"],
            name: "anolilab/unicorn/tsconfig-overrides",
            rules: {
                "unicorn/prevent-abbreviations": "off",
            },
        },
        {
            files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
            name: "anolilab/unicorn/ts-overrides",
            rules: {
                "unicorn/import-style": "off",
            },
        },
    ];
});
