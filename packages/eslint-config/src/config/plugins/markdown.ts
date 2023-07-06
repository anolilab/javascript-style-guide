import type { Linter } from "eslint";

import { createConfigs } from "../../utils/create-config";

const config: Linter.Config = createConfigs([
    {
        config: {
            extends: "plugin:markdown/recommended",
            plugins: ["markdown"],
            processor: "markdown/markdown",
        },
        type: "markdown",
    },
    {
        config: {
            extends: "plugin:markdown/recommended",
            parserOptions: {
                ecmacFeatures: {
                    impliedStrict: true,
                },
            },
            plugins: ["markdown"],
            processor: "markdown/markdown",
            rules: {
                "@typescript-eslint/comma-dangle": "off",
                "@typescript-eslint/no-redeclare": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "@typescript-eslint/no-use-before-define": "off",
                "@typescript-eslint/no-var-requires": "off",

                "global-require": "off",

                "import/no-unresolved": "off",
                "import/order": "off",

                "no-alert": "off",
                "no-console": "off",
                "no-restricted-imports": "off",
                "no-undef": "off",
                "no-unused-expressions": "off",
                "no-unused-vars": "off",

                "prefer-reflect": "off",
                "sonar/no-dead-store": "off",

                strict: "off",
            },
        },
        type: "markdown_inline_js_jsx",
    },
]);

export default config;
