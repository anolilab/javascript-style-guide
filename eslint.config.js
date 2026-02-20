import { createConfig } from "./packages/eslint-config/dist/index.js";

export default createConfig({
    zod: true,
    unocss: false,
    ignores: [
        ".github/**",
        "eslint.config.js",
        "scripts/**",
        "packages/eslint-config/__fixtures__/**",
        "packages/eslint-config/README.md",
        "packages/eslint-config/src/vender/**",
    ],
});
