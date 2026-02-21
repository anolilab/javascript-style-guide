import type { OptionsFiles, OptionsOverrides, Rules } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/e18e/eslint-plugin#readme
export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const e18ePlugin = await interopDefault(import("@e18e/eslint-plugin"));

    return [
        {
            files,
            name: "anolilab/e18e/rules",
            plugins: {
                e18e: e18ePlugin,
            },
            rules: {
                ...(e18ePlugin.configs?.["recommended"] as { rules: Rules }).rules,

                // Conflicts with e18e/prefer-nullish-coalescing
                "@typescript-eslint/prefer-nullish-coalescing": "off",

                // Conflicts with e18e/prefer-exponentiation-operator
                "prefer-exponentiation-operator": "off",

                // Conflicts with e18e/prefer-spread-syntax
                "prefer-spread": "off",

                ...overrides,
            },
        },
    ];
});
