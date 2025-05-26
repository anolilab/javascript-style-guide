import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginTanstackRouter = await interopDefault(import("@tanstack/eslint-plugin-router"));

    return [
        {
            files,
            plugins: {
                "@tanstack/router": pluginTanstackRouter,
            },
            rules: {
                ...pluginTanstackRouter.configs["recommended"].rules,
                ...overrides,
            },
        },
    ];
});
