import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("e2e", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginPlaywright = await interopDefault(import("eslint-plugin-playwright"));

    return [
        {
            files,
            plugins: {
                playwright: pluginPlaywright,
            },
            rules: {
                ...pluginPlaywright.configs["recommended"].rules,
                ...overrides,
            },
        },
    ];
});
