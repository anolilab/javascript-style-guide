import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig, getFilesGlobs } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/SonarSource/eslint-plugin-sonarjs
export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const sonarJsPlugin = await interopDefault(import("eslint-plugin-sonarjs"));

    return [
        {
            name: "anolilab/sonarjs/plugin",
            plugins: {
                sonarjs: sonarJsPlugin,
            },
        },
        {
            files,
            name: "anolilab/sonarjs/rules",
            rules: {
                ...sonarJsPlugin.configs["recommended"].rules,
                "sonarjs/file-name-differ-from-class": "error",
                "sonarjs/no-collapsible-if": "error",
                "sonarjs/no-nested-template-literals": "off",
                "sonarjs/no-tab": "error",

                // This rule does not work will with disable next line
                "sonarjs/todo-tag": "off",

                ...overrides,
            },
        },
        {
            files: getFilesGlobs("js_and_ts"),
            name: "anolilab/sonarjs/js-and-ts-rules",
            rules: {
                // relax complexity for react code
                "sonarjs/cognitive-complexity": ["error", 15],
                // relax duplicate strings
                "sonarjs/no-duplicate-string": "off",
            },
        },
        {
            files: getFilesGlobs("js"),
            languageOptions: {
                ecmaVersion: 2020,
            },
            name: "anolilab/sonarjs/js-rules",
            rules: {
                "sonarjs/no-all-duplicated-branches": "off",
                "sonarjs/no-duplicate-string": "off",
            },
        },
    ];
});
