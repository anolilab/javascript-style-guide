import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsIsInEditor } from "../../types";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsIsInEditor>("js", async (config, oFiles) => {
    const { isInEditor, files = oFiles } = config;

    const pluginUnusedImports = await interopDefault(import("eslint-plugin-unused-imports"));

    return [
        {
            name: "anolilab/unused-imports/rules",
            plugins: {
                "unused-imports": pluginUnusedImports,
            },
            files,
            rules: {
                "unused-imports/no-unused-imports": isInEditor ? "off" : "error",
                "unused-imports/no-unused-vars": [
                    "error",
                    {
                        args: "after-used",
                        argsIgnorePattern: "^_",
                        ignoreRestSiblings: true,
                        vars: "all",
                        varsIgnorePattern: "^_",
                    },
                ],
            },
        },
    ];
});
