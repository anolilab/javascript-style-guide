/* eslint-disable antfu/no-import-dist, import/no-relative-packages */
import {
    defineConfig,
    eslintExtensions,
} from "./packages/lint-staged-config/dist/index.mjs";
/* eslint-enable antfu/no-import-dist, import/no-relative-packages */

export default defineConfig({
    eslint: {
        config: "./eslint.config.js",
        extensions: eslintExtensions,
    },
    typescript: false,
});
