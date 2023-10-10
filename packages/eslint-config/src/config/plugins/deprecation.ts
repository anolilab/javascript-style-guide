import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
const config: Linter.Config = createConfig("typescript", {
    plugins: ["deprecation"],
    extends: ["plugin:deprecation/recommended"],
    rules: {
        // Disabled because of deprecation/deprecation
        "etc/no-deprecated": "off",
    },
});

export default config;
