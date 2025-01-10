import { createConfig } from "./dist/index.mjs";

export default createConfig(
    {
        ignores: ["eslint.config.js", "src/typegen.d.ts", "__fixtures__/**/*"],
        react: false,
        playwright: false,
        storybook: false,
        tailwindcss: false,
        tanstackQuery: false,
        tanstackRouter: false,
        testingLibrary: false,
        tsdoc: false,
        unocss: false,
        zod: false,
        lodash: false,
        jsx: false,
        html: false,
        astro: false,
    },
    {
        files: ["**/*.ts"],
        rules: {
            "no-secrets/no-secrets": "off",
        },
    },
    {
        files: ["debug-eslint.config.mjs"],
        rules: {
            "antfu/no-import-dist": "off",
        },
    },
    {
        files: ["README.md"],
        rules: {
            "import/no-commonjs": "off",
            "unicorn/prefer-module": "off",
            "jsdoc/check-tag-names": "off",
        },
    },
);
