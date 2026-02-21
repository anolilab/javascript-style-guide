import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("ts", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const eslintPluginTsdoc = await interopDefault(import("eslint-plugin-tsdoc"));

    return [
        {
            files,
            plugins: {
                tsdoc: eslintPluginTsdoc,
            },
            rules: {
                "tsdoc/syntax": "error",

                ...overrides,
            },
        },
    ];
});
