import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://github.com/mdx-js/eslint-mdx/tree/master/packages/eslint-plugin-mdx
const config: Linter.Config = createConfig("mdx", {
    extends: ["plugin:mdx/recommended"],
    parser: "eslint-mdx",
    parserOptions: {
        ecmaVersion: "latest",
    },
    processor: "mdx/remark",
    rules: {
        "@typescript-eslint/comma-dangle": "off",
        "@typescript-eslint/no-redeclare": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "off",

        "global-require": "off",

        "import/namespace": "off",

        "import/no-extraneous-dependencies": "off",
        "import/no-unresolved": "off",
        "import/order": "off",
        "no-alert": "off",

        "no-console": "off",
        "no-restricted-imports": "off",
        "no-undef": "off",
        "no-unused-expressions": "off",
        "no-unused-vars": "off",
        "prefer-reflect": "off",

        "react/jsx-no-undef": "off",
        "react-hooks/rules-of-hooks": "off",

        "sonar/no-dead-store": "off",
    },
    settings: {
        "mdx/code-blocks": true,
    },
});

export default config;
