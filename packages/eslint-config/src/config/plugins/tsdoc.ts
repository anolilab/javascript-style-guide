import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import type { OptionsFiles, OptionsOverrides } from "../../types";

export default createConfig<OptionsFiles & OptionsOverrides>("typescript", async (config, oFiles) => {
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
