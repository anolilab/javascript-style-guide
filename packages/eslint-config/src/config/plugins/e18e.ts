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

                // these are a bit opinionated and dangerous (introducing behavioral changes), so we'll disable them by default for now
                "e18e/prefer-array-at": "off",
                "e18e/prefer-array-from-map": "off",
                "e18e/prefer-array-to-reversed": "off",
                "e18e/prefer-array-to-sorted": "off",
                "e18e/prefer-array-to-spliced": "off",
                "e18e/prefer-spread-syntax": "off",

                // Conflicts with e18e/prefer-exponentiation-operator
                "prefer-exponentiation-operator": "off",

                // Conflicts with e18e/prefer-spread-syntax
                "prefer-spread": "off",

                ...overrides,
            },
        },
    ];
});
