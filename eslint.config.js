import { createConfig } from "./packages/eslint-config/dist/index.mjs";

export default createConfig({
    zod: true,
    unocss: false,
    ignores: [
        "eslint.config.js",
        ".prettierrc.cjs",
        "scripts/**",
        "packages/eslint-config/__fixtures__/**",
        "packages/eslint-config/README.md",
        "packages/eslint-config/src/vender/**"
    ]
});
