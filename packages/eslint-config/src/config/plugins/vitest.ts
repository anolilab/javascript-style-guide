import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["**/__tests__/**/*.?(c|m)[jt]s?(x)", "**/?(*.){test,spec}.?(c|m)[jt]s?(x)"],
            plugins: ["vitest"],
            extends: ["plugin:vitest/recommended", "plugin:vitest/all"],
            rules: {
                "vitest/max-expects": "off",
            },
        },
    ],
};

export default config;
