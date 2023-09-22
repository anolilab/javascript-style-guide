import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
const config: Linter.Config = createConfig("jsx_and_tsx", {
    plugins: ["ssr-friendly"],
    extends: ["plugin:ssr-friendly/recommended"],
});

export default config;
