import type { OptionsFiles, OptionsOverrides } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import { configRules } from "../../utils/plugin-config";

// @see https://github.com/xjamundx/eslint-plugin-promise#readme
export default createConfig<OptionsFiles & OptionsOverrides>("all", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    // eslint-plugin-promise ships no types; describe only what is read, and let `configRules`
    // handle the shape not being there.
    // @ts-expect-error missing types
    const promisesPlugin: { configs?: { "flat/recommended"?: unknown } } = await interopDefault(import("eslint-plugin-promise"));

    return [
        {
            files,
            name: "anolilab/promise/rules",
            plugins: {
                promise: promisesPlugin,
            },
            rules: {
                ...configRules(promisesPlugin.configs?.["flat/recommended"]),

                "promise/prefer-await-to-callbacks": "off",
                "promise/prefer-await-to-then": "off",
                ...overrides,
            },
        },
    ];
});
