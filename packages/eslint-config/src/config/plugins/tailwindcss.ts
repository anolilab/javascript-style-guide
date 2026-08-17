import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import { configItem } from "../../utils/plugin-config";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
export default createConfig<OptionsFiles & OptionsOverrides>("jsx_and_tsx", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const tailwindcssPlugin = await interopDefault(import("eslint-plugin-tailwindcss"));

    // eslint-plugin-tailwindcss v4 renamed `configs["flat/recommended"]` to `configs.recommended`
    // and collapsed it from a two-element array into a single flat config object.
    const recommended = configItem(tailwindcssPlugin.configs.recommended);

    return [
        {
            ...recommended,
            files,
            name: "anolilab/tailwindcss/setup",
            rules: {
                ...recommended.rules,
                ...overrides,
            },
        },
    ];
});
