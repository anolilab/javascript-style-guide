import { fixupPluginRules } from "@eslint/compat";

import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import type { OptionsFiles, OptionsOverrides } from "../../types";

export default createConfig<OptionsOverrides & OptionsFiles>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginYouDontNeedLodashUnderscore = await interopDefault(import("eslint-plugin-you-dont-need-lodash-underscore"));

    return [
        {
            files,
            plugins: {
                "you-dont-need-lodash-underscore": fixupPluginRules(pluginYouDontNeedLodashUnderscore),
            },
            rules: {
                ...pluginYouDontNeedLodashUnderscore.configs["all"].rules,
                ...overrides,
            },
        },
    ];
});
