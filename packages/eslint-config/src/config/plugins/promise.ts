import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsOverrides } from "../../types";
import interopDefault from "../../utils/interop-default";
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";

// @see https://github.com/xjamundx/eslint-plugin-promise#readme
export default createConfig<OptionsOverrides & OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const promisesPlugin = await interopDefault(import("eslint-plugin-promise"));

    return [
        {
            files,
            name: "anolilab/promise/rules",
            plugins: {
                promise: promisesPlugin,
            },
            rules: {
                ...fixupPluginRules(promisesPlugin.configs["flat/recommended"].rules),

                "promise/prefer-await-to-callbacks": "off",
                "promise/prefer-await-to-then": "off",
                ...overrides,
            },
        },
    ];
});
