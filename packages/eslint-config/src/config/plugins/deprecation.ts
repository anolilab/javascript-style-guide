import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
const config: Linter.Config = createConfig("typescript", {
    plugins: ["deprecation"],
    extends: ["plugin:deprecation/recommended"],
});

export default config;
