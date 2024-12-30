import { defineConfig } from "./packages/lint-staged-config/dist/index.mjs";

export default defineConfig({
    eslint: {
        config: "./eslint.config.js",
    }
});
