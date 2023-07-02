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
            rules: {
                "@typescript-eslint/consistent-type-exports": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/naming-convention": "off",
                "@typescript-eslint/no-unused-vars": "off",
                "import/namespace": "off",
                "import/order": "off",
            },
        },
    ],
};

export default config;
