import { fixupPluginRules } from "@eslint/compat";

import type { OptionsFiles, OptionsOverrides, Rules } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const pluginYouDontNeedLodashUnderscore = await interopDefault(import("eslint-plugin-you-dont-need-lodash-underscore"));

    return [
        {
            files,
            plugins: {
                "you-dont-need-lodash-underscore": fixupPluginRules(pluginYouDontNeedLodashUnderscore),
            },
            rules: {
                ...(pluginYouDontNeedLodashUnderscore as { configs: { all: { rules: Rules } } }).configs.all.rules,
                ...overrides,
            },
        },
    ];
});
