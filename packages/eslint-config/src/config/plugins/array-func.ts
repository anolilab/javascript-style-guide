import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const arrayFuncPlugin = await interopDefault(import("eslint-plugin-array-func"));

    return [
        {
            files,
            languageOptions: {
                ecmaVersion: 2018,
            },
            name: "anolilab/array-func/rules",
            plugins: {
                "array-func": arrayFuncPlugin,
            },
            rules: {
                ...arrayFuncPlugin.rules,
                ...overrides,
            },
        },
    ];
});
