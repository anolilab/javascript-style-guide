import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["zod"],
    rules: {
        "zod/prefer-enum": "error",
        "zod/require-strict": "error",
    },
};

export default config;
