import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
const config: Linter.Config = createConfig(
    "jsx_and_tsx",
    {
        extends: ["plugin:tailwindcss/recommended"],
        plugins: ["tailwindcss"],
    },
    {
        browser: true,
        es6: true,
        node: true,
    },
);

export default config;
