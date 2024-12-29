import { createConfig } from "../../utils/create-config";
import type { OptionsFiles, OptionsHasPrettier, OptionsIsInEditor, OptionsOverrides } from "../../types";
import interopDefault from "../../utils/interop-default";

// Hold the reference so we don't redeclare the plugin on each call
let _pluginTest: any;

export default createConfig<OptionsFiles & OptionsOverrides & OptionsIsInEditor & OptionsHasPrettier>("all", async (config, oFiles) => {
    const { files = oFiles, overrides, isInEditor = false, prettier } = config;

    const [vitestPlugin, noOnlyTestsPlugin] = await Promise.all([
        interopDefault(import("@vitest/eslint-plugin")),
        // @ts-expect-error missing types
        interopDefault(import("eslint-plugin-no-only-tests")),
    ] as const);

    _pluginTest = _pluginTest || {
        ...vitestPlugin,
        rules: {
            ...vitestPlugin.rules,
            // extend `test/no-only-tests` rule
            ...noOnlyTestsPlugin.rules,
        },
    };

    return [
        {
            name: "anolilab/vitest/setup",
            plugins: {
                vitest: _pluginTest,
            },
        },
        {
            files,
            name: "anolilab/vitest/rules",
            rules: {
                ...vitestPlugin.configs.all.rules,
                ...vitestPlugin.configs.recommended.rules,

                // Enforce a maximum number of expect per test
                // https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/max-expects.md
                // This rule should be set on the root config
                "vitest/max-expects": "off",

                // Enforce valid expect() usage
                // https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-hooks.md
                "vitest/no-hooks": "off",

                // Disallow setup and teardown hooks
                // https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-mocks-import.md
                "vitest/no-mocks-import": "off",

                // Disallow importing from mocks directory
                // https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-restricted-vi-methods.md
                "vitest/no-restricted-vi-methods": "off",

                // Disallow specific vi. methods
                // https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/no-standalone-expect.md
                "vitest/no-standalone-expect": "error",

                // Disallow using expect outside of it or test blocks
                // https://github.com/veritem/eslint-plugin-vitest/blob/main/docs/rules/valid-expect.md
                "vitest/valid-expect": ["error", { alwaysAwait: true, maxArgs: 2, minArgs: 1 }],

                // Disables
                "antfu/no-top-level-await": "off",
                "no-unused-expressions": "off",
                "node/prefer-global/process": "off",
                "@typescript-eslint/explicit-function-return-type": "off",

                "vitest/no-only-tests": isInEditor ? "off" : "error",
                "vitest/consistent-test-it": ["error", { fn: "it", withinDescribe: "it" }],

                ...overrides,

                ...(prettier ? {
                    "vitest/padding-around-after-all-blocks": "off",
                    "vitest/padding-around-after-each-blocks": "off",
                    "vitest/padding-around-before-all-blocks": "off",
                    "vitest/padding-around-before-each-blocks": "off",
                    "vitest/padding-around-describe-blocks": "off",
                    "vitest/padding-around-expect-blocks": "off",
                    "vitest/padding-around-test-blocks": "off",
                    "vitest/padding-around-all": "off",
                } : {}),
            },
            // TODO: hide this behind a config flag
            settings: {
                vitest: {
                    typecheck: true,
                },
            },
            // TODO: hide this behind a config flag
            languageOptions: {
                globals: {
                    ...vitestPlugin.environments.env.globals,
                },
            },
        },
    ];
});
