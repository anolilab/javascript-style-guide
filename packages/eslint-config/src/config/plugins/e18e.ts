import { fixupPluginRules } from "@eslint/compat";

import type { OptionsFiles, OptionsOverrides, Rules } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/e18e/eslint-plugin#readme
export default createConfig<OptionsFiles & OptionsOverrides>(
    "all",
    async (config, oFiles) => {
        const { files = oFiles, overrides } = config;

        const e18ePlugin = await interopDefault(
            import("@e18e/eslint-plugin"),
        );

        return [
            {
                files,
                name: "anolilab/e18e/rules",
                plugins: {
                    e18e: e18ePlugin,
                },
                rules: {
                    ...(fixupPluginRules(
                        // @ts-expect-error - plugin may not have proper types
                        e18ePlugin?.configs?.recommended?.rules,
                    ) as Rules),

                    ...overrides,
                },
            },
        ];
    },
);
