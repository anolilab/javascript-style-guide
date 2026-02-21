import type { OptionsFiles, OptionsIsInEditor, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsIsInEditor & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, isInEditor, overrides } = config;

    const pluginUnusedImports = await interopDefault(import("eslint-plugin-unused-imports"));

    return [
        {
            files,
            name: "anolilab/unused-imports/rules",
            plugins: {
                "unused-imports": pluginUnusedImports,
            },
            rules: {
                "@typescript-eslint/no-unused-vars": "off",
                "no-unused-vars": "off",
                "unused-imports/no-unused-imports": isInEditor ? "off" : "error",
                "unused-imports/no-unused-vars": [
                    isInEditor ? "warn" : "error",
                    {
                        args: "after-used",
                        argsIgnorePattern: "^_",
                        vars: "all",
                        varsIgnorePattern: "^_",
                    },
                ],
                ...overrides,
            },
        },
    ];
});
