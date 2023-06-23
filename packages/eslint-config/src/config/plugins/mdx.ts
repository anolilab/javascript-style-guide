import type { Linter } from "eslint";

// @see https://github.com/mdx-js/eslint-mdx/tree/master/packages/eslint-plugin-mdx
const config: Linter.Config = {
    overrides: [
        {
            files: ["*.mdx"],
            extends: ["plugin:mdx/recommended"],
            parser: "eslint-mdx",
            parserOptions: {
                ecmaVersion: "latest",
            },
            rules: {
                "import/namespace": "off",
                "import/order": "off",
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/consistent-type-exports": "off",
                "@typescript-eslint/no-unused-vars": "off",
            },
        },
    ],
};

export default config;
