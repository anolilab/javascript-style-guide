import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginComments = await interopDefault(import("@eslint-community/eslint-plugin-eslint-comments"));

    return [
        {
            files,
            name: "anolilab/eslint-comments/rules",
            plugins: {
                "eslint-comments": pluginComments,
            },
            rules: {
                "eslint-comments/no-aggregating-enable": "error",

                "eslint-comments/no-duplicate-disable": "error",
                // Rules are not in recommended config
                "eslint-comments/no-restricted-disable": "off",
                // Disabled as it's already covered by the `unicorn/no-abusive-eslint-disable` rule.
                "eslint-comments/no-unlimited-disable": "off",

                "eslint-comments/no-unused-disable": "error",
                "eslint-comments/no-unused-enable": "error",

                "eslint-comments/no-use": "off",
                "eslint-comments/require-description": "off",

                ...overrides,
            },
        },
    ];
});
