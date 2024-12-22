import type { Linter } from "eslint";

import { createConfig, createConfigs, getFilesGlobs } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides } from "../../types";
import interopDefault from "../../utils/interop-default";

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

export default createConfig<OptionsOverrides & OptionsFiles>("all", async (config, oFiles) => {
    const { overrides, files = oFiles } = config;

    const sonarJsPlugin = await interopDefault(import("eslint-plugin-sonarjs"));

    return [
        {
            name: "anolilab/sonarjs/plugin",
            plugins: {
                sonarjs: sonarJsPlugin,
            },
        },
        {
            name: "anolilab/sonarjs/config",
            files,
            rules: {
                ...sonarJsPlugin.configs["recommended"].rules,
                "sonarjs/no-nested-template-literals": "off",
                "sonarjs/file-name-differ-from-class": "error",
                "sonarjs/no-collapsible-if": "error",
                "sonarjs/no-tab": "error",

                ...overrides,
            },
        },
        {
            name: "anolilab/sonarjs/js_and_ts",
            files: getFilesGlobs("js_and_ts"),
            rules: {
                // relax complexity for react code
                "sonarjs/cognitive-complexity": ["error", 15],
                // relax duplicate strings
                "sonarjs/no-duplicate-string": "off",
            },
        },
    ];
});
