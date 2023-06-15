import { hasAnyDep, packageIsTypeModule } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import semver from "semver";

import styleConfig from "../style";

const styleRules = styleConfig.rules as Linter.RulesRecord;

let identLevel: Linter.RuleLevel = "error";

if (hasAnyDep(["prettier"])) {
    identLevel = "off";
}

// @see https://github.com/sindresorhus/eslint-plugin-unicorn
const config: Linter.Config = {
    plugins: ["unicorn"],
    extends: ["plugin:unicorn/recommended"],
    rules: {
        "unicorn/prefer-node-protocol": semver.gte(process.version, "v16.0.0") ? "error" : "off",
        "unicorn/template-indent": [identLevel, { indent: (styleRules["indent"] as any[])[1] as number }],
        "unicorn/no-array-for-each": "off",
        "unicorn/prefer-module": packageIsTypeModule ? "error" : "off",

        // The character class sorting is a bit buggy at the moment.
        "unicorn/better-regex": [
            "error",
            {
                sortCharacterClasses: false,
            },
        ],

        // TODO: Disabled for now until it becomes more stable: https://github.com/sindresorhus/eslint-plugin-unicorn/search?q=consistent-destructuring+is:issue&state=open&type=issues
        "unicorn/consistent-destructuring": "off",

        // TODO: Disabled for now as I don't have time to deal with the backslash that might come from this. Try to enable this rule in 2021.
        "unicorn/no-null": "off",

        // We only enforce it for single-line statements to not be too opinionated.
        "unicorn/prefer-ternary": ["error", "only-single-line"],

        // It will be disabled in the next version of eslint-plugin-unicorn.
        "unicorn/prefer-json-parse-buffer": "off",

        // TODO: Remove this override when the rule is more stable.
        "unicorn/consistent-function-scoping": "off",

        // TODO: Temporarily disabled until it becomes more mature.
        "unicorn/no-useless-undefined": "off",

        // TODO: Temporarily disabled as the rule is buggy.
        "function-call-argument-newline": "off",
    },
    overrides: [
        {
            files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
            rules: {
                "unicorn/import-style": "off",
            },
        },
    ],
};

export default config;
