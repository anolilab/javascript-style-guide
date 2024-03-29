import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

if (!global.hasAnolilabEsLintVitestGlobalsPlugin) {
    global.hasAnolilabEsLintVitestGlobalsPlugin = hasDependency("eslint-plugin-vitest-globals") || hasDevDependency("eslint-plugin-vitest-globals");
}

const plugins = ["plugin:vitest/recommended", "plugin:vitest/all"];

if (global.hasAnolilabEsLintVitestGlobalsPlugin) {
    plugins.push("plugin:vitest-globals/recommended");
}

const config: Linter.Config = {
    overrides: [
        {
            extends: plugins,
            files: ["**/__tests__/**/*.?(c|m)[jt]s?(x)", "**/?(*.){test,spec}.?(c|m)[jt]s?(x)"],
            plugins: ["vitest"],
            // TODO: transform all rules to error
            rules: {
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
            },
        },
    ],
};

export default config;
