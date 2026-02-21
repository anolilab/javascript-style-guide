import { createConfig, getFilesGlobs } from "./dist/index.js";

export default createConfig(
    {
        astro: false,
        html: false,
        ignores: ["./eslint.config.js", "./debug-eslint.config.mjs", "./src/typegen.d.ts", "./src/utils/vitest-globals.ts", "__fixtures__/**", "__tests__/**"],
        jsonc: false,
        jsx: false,
        lodash: false,
        playwright: false,
        react: false,
        storybook: false,
        tailwindcss: false,
        tanstackQuery: false,
        tanstackRouter: false,
        testingLibrary: false,
        tsdoc: false,
        typescript: {
            tsconfigPath: "./tsconfig.json",
        },
        unocss: false,
        zod: false,
    },
    {
        files: ["**/*.ts"],
        rules: {
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "no-secrets/no-secrets": "off",
        },
    },
    {
        files: ["**/*"],
        rules: {
            "@unocss/order": "off",
            "@unocss/order-attributify": "off",
        },
    },
    {
        files: ["debug-eslint.config.mjs", "eslint.config.js"],
        rules: {
            "antfu/no-import-dist": "off",
        },
    },
    {
        files: ["./README.md"],
        rules: {
            "import/no-commonjs": "off",
            "jsdoc/check-tag-names": "off",
            "unicorn/prefer-module": "off",
        },
    },
    {
        files: getFilesGlobs("markdown_inline_js_jsx"),
        rules: {
            "import/no-unresolved": "off",
            "jsonc/no-comments": "off",
        },
    },
    {
        files: ["**/e18e.ts"],
        rules: {
            "unicorn/prevent-abbreviations": "off",
        },
    },
);
