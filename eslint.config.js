import { createConfig } from "./packages/eslint-config/dist/index.mjs";

export default createConfig({
    zod: true,
    unocss: true,
    ignores: [
        "eslint.config.js"
    ]
});
