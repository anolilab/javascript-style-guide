import { fixupPluginRules } from "@eslint/compat";
import type { ESLint } from "eslint";

import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import { configRules } from "../../utils/plugin-config";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginYouDontNeedLodashUnderscore: ESLint.Plugin = await interopDefault(import("eslint-plugin-you-dont-need-lodash-underscore"));

    return [
        {
            files,
            plugins: {
                "you-dont-need-lodash-underscore": fixupPluginRules(pluginYouDontNeedLodashUnderscore),
            },
            rules: {
                ...configRules(pluginYouDontNeedLodashUnderscore.configs?.["all"]),
                ...overrides,
            },
        },
    ];
});
