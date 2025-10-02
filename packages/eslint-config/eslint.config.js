import { createConfig, getFilesGlobs } from "./dist/index.mjs";

export default createConfig(
    {
        ignores: [
            "./eslint.config.js",
            "./debug-eslint.config.mjs",
            "./src/typegen.d.ts",
            "./src/utils/vitest-globals.ts",
            "./__fixtures__/**/*",
            "./__tests__/**/*",
        ],
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
        jsonc: false,
        typescript: {
            tsconfigPath: "./tsconfig.json",
        },
    },
    {
        files: ["**/*.ts"],
        rules: {
            "no-secrets/no-secrets": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
        },
    },
    {
        files: ["__fixtures__/**"],
        rules: {
            "@unocss/order-attributify": "off",
            "@unocss/order": "off",
        },
    },
    {
        files: ["**/*"],
        rules: {
            "@unocss/order-attributify": "off",
            "@unocss/order": "off",
        },
    },
    {
        files: ["debug-eslint.config.mjs"],
        rules: {
            "antfu/no-import-dist": "off",
        },
    },
    {
        files: ["./README.md"],
        rules: {
            "import/no-commonjs": "off",
            "unicorn/prefer-module": "off",
            "jsdoc/check-tag-names": "off",
        },
    },
    {
        files: getFilesGlobs("markdown_inline_js_jsx"),
        rules: {
            "import/no-unresolved": "off",
            "jsonc/no-comments": "off",
        },
    },
);
