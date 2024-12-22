import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import type { OptionsFiles, OptionsOverrides } from "../../types";

export default createConfig<OptionsOverrides & OptionsFiles>("all", async (config, oFiles) => {
    const { overrides, files = oFiles } = config;

    const arrayFuncPlugin = await interopDefault(import("eslint-plugin-array-func"));

    return [
        {
            files,
            name: "anolilab/array-func/rules",
            parserOptions: {
                ecmaVersion: 2018,
            },
            rules: {
                ...arrayFuncPlugin.rules,
                ...overrides,
            },
        },
    ];
});
