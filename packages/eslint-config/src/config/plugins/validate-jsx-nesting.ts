import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
const config: Linter.Config = createConfig("jsx_and_tsx", {
    plugins: ["validate-jsx-nesting"],
    rules: {
        "validate-jsx-nesting/no-invalid-jsx-nesting": "error",
    },
});

export default config;
