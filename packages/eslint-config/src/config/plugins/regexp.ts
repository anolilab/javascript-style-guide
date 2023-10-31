import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    extends: ["plugin:regexp/recommended"],
    plugins: ["regexp"],
    rules: {
        // disallow control characters
        "regexp/no-control-character": "error",
    },
});

export default config;
