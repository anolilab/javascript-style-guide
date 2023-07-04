import type { Linter } from "eslint";

// @see https://github.com/mdx-js/eslint-mdx/tree/master/packages/eslint-plugin-mdx
const config: Linter.Config = {
    overrides: [
        {
            extends: ["plugin:mdx/recommended"],
            files: ["*.mdx"],
            parser: "eslint-mdx",
            parserOptions: {
                ecmaVersion: "latest",
            },
            processor: "mdx/remark",
            rules: {
                "@typescript-eslint/consistent-type-exports": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "import/namespace": "off",
                "import/no-extraneous-dependencies": "off",
                "import/no-unresolved": "off",
                "import/order": "off",
                "no-console": "off",
                "no-undef": "off",
                "react/jsx-no-undef": "off",
                "react-hooks/rules-of-hooks": "off",
                "sonar/no-dead-store": "off",
            },
            settings: {
                "mdx/code-blocks": true,
            },
        },
    ],
};

export default config;
