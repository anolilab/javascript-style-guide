import type { Linter } from "eslint";

import { createConfigs } from "../../utils/create-config";

// @see https://github.com/SonarSource/eslint-plugin-sonarjs
const config: Linter.Config = createConfigs([
    {
        config: {
            excludedFiles: ["**/?(*.)+(test).{js,jsx,ts,tsx}", "**/*.stories.{js,ts,jsx,tsx}"],
            extends: ["plugin:sonarjs/recommended"],
            rules: {
                "sonarjs/no-nested-template-literals": "off",
            },
        },
        type: "all",
    },
    {
        config: {
            rules: {
                // relax complexity for react code
                "sonarjs/cognitive-complexity": ["error", 15],
                // relax duplicate strings
                "sonarjs/no-duplicate-string": "off",
            },
        },
        type: "js_and_ts",
    },
    {
        config: {
            parser: "espree",
            parserOptions: {
                ecmaVersion: 2020,
            },
            rules: {
                "sonarjs/no-all-duplicated-branches": "off",
                "sonarjs/no-duplicate-string": "off",
            },
        },
        type: "javascript",
    },
]);

export default config;
