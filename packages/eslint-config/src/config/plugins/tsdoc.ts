import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("typescript", {
    plugins: ["eslint-plugin-tsdoc"],
    rules: {
        "tsdoc/syntax": "error",
    },
});

export default config;
