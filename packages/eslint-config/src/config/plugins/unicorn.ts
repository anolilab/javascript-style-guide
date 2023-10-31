import { hasDependency, hasDevDependency, packageIsTypeModule } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import indent from "../../utils/indent";

if (global.anolilabEslintConfigUnicornPrettierRules === undefined && (hasDependency("prettier") || hasDevDependency("prettier"))) {
    global.anolilabEslintConfigUnicornPrettierRules = {
        "unicorn/empty-brace-spaces": "off",
        "unicorn/no-nested-ternary": "off",
        "unicorn/number-literal-case": "off",
        "unicorn/template-indent": "off",
    };
}

// @see https://github.com/sindresorhus/eslint-plugin-unicorn
const config: Linter.Config = {
    extends: ["plugin:unicorn/recommended"],
    overrides: [
        {
            files: ["tsconfig.dev.json", "tsconfig.prod.json"],
            rules: {
                "unicorn/prevent-abbreviations": "off",
            },
        },
        {
            files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
            rules: {
                "unicorn/import-style": "off",
            },
        },
    ],
    plugins: ["unicorn"],
    rules: {
        // TODO: Temporarily disabled as the rule is buggy.
        "function-call-argument-newline": "off",
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
                ignore: [/(FUNDING\.yml|README\.md|CHANGELOG\.md|CONTRIBUTING\.md|CODE_OF_CONDUCT\.md|SECURITY\.md|LICENSE)/u],
            },
        ],

        "unicorn/no-array-for-each": "off",

        // TODO: Disabled for now as I don't have time to deal with the backslash that might come from this. Try to enable this rule in 2024.
        "unicorn/no-null": "off",

        // TODO: Temporarily disabled until it becomes more mature.
        "unicorn/no-useless-undefined": "off",

        // It will be disabled in the next version of eslint-plugin-unicorn.
        "unicorn/prefer-json-parse-buffer": "off",

        "unicorn/prefer-module": packageIsTypeModule ? "error" : "off",

        "unicorn/prefer-node-protocol": "error",

        // We only enforce it for single-line statements to not be too opinionated.
        "unicorn/prefer-ternary": ["error", "only-single-line"],

        "unicorn/template-indent": ["error", { indent }],

        ...global.anolilabEslintConfigUnicornPrettierRules,
    },
};

export default config;
