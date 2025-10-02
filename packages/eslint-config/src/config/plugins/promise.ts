import { fixupPluginRules } from "@eslint/compat";

import type { OptionsFiles, OptionsOverrides, Rules } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/xjamundx/eslint-plugin-promise#readme
export default createConfig<OptionsFiles & OptionsOverrides>(
    "all",
    async (config, oFiles) => {
        const { files = oFiles, overrides } = config;

        // @ts-expect-error missing types
        const promisesPlugin = await interopDefault(
            import("eslint-plugin-promise"),
        );

        return [
            {
                files,
                name: "anolilab/promise/rules",
                plugins: {
                    promise: promisesPlugin,
                },
                rules: {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                    ...(fixupPluginRules(
                        promisesPlugin.configs["flat/recommended"].rules,
                    ) as Rules),

                    "promise/prefer-await-to-callbacks": "off",
                    "promise/prefer-await-to-then": "off",
                    ...overrides,
                },
            },
        ];
    },
);
