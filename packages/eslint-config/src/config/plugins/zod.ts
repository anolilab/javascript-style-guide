import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    plugins: ["zod"],
    rules: {
        "zod/prefer-enum": "error",
        "zod/require-strict": "error",
    },
});

export default config;
