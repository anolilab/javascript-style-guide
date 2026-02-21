import { createConfig } from "./packages/eslint-config/dist/index.js";

export default createConfig(
    {
        zod: true,
        unocss: false,
        ignores: [
            ".github/**",
            "eslint.config.js",
            "scripts/**",
            "packages/eslint-config/__fixtures__/**",
            "packages/eslint-config/README.md",
            "packages/eslint-config/scripts/**",
            "packages/eslint-config/src/vender/**",
        ],
    },
    {
        files: ["packages/eslint-config/**/*.ts"],
        rules: {
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/require-await": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "no-secrets/no-secrets": "off",
        },
    },
    {
        files: ["packages/eslint-config/eslint.config.js", "**/.prettierrc.*"],
        rules: {
            "antfu/no-import-dist": "off",
        },
    },
    {
        files: ["**/e18e.ts"],
        rules: {
            "unicorn/prevent-abbreviations": "off",
        },
    },
);
