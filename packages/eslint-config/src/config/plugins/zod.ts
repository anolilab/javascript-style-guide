import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const zodPlugin = await interopDefault(import("eslint-plugin-zod"));

    return [
        {
            files,
            plugins: {
                zod: zodPlugin,
            },
            rules: {
                "zod/prefer-enum": "error",
                "zod/require-strict": "error",
                ...overrides,
            },
        },
    ];
});
