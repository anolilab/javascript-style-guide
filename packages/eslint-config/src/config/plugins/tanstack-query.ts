import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://tanstack.com/query/v4/docs/react/eslint/eslint-plugin-query
export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginTanstackQuery = await interopDefault(import("@tanstack/eslint-plugin-query"));

    return [
        {
            files,
            plugins: {
                "@tanstack/query": pluginTanstackQuery,
            },
            rules: {
                ...pluginTanstackQuery.configs["recommended"].rules,
                ...overrides,
            },
        },
    ];
});
