import { fixupPluginRules } from "@eslint/compat";

import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/xjamundx/eslint-plugin-promise#readme
export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
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
