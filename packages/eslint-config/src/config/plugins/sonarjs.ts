import { createConfig, getFilesGlobs } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides } from "../../types";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/SonarSource/eslint-plugin-sonarjs
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
            name: "anolilab/sonarjs/rules",
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
            name: "anolilab/sonarjs/js-and-ts-rules",
            files: getFilesGlobs("js_and_ts"),
            rules: {
                // relax complexity for react code
                "sonarjs/cognitive-complexity": ["error", 15],
                // relax duplicate strings
                "sonarjs/no-duplicate-string": "off",
            },
        },
        {
            name: "anolilab/sonarjs/js-rules",
            files: getFilesGlobs("js"),
            languageOptions: {
                ecmaVersion: 2020,
            },
            rules: {
                "sonarjs/no-all-duplicated-branches": "off",
                "sonarjs/no-duplicate-string": "off",
            },
        },
    ];
});
