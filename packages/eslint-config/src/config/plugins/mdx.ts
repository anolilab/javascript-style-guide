import type { Linter } from "eslint";

// @see https://github.com/mdx-js/eslint-mdx/tree/master/packages/eslint-plugin-mdx
const config: Linter.Config = {
    overrides: [
        {
            files: ["*.mdx"],
            extends: ["plugin:mdx/recommended"],
        },
    ],
};

export default config;
