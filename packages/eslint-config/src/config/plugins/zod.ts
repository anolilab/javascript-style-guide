import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["zod"],
    rules: {
        "zod/prefer-enum": 2,
        "zod/require-strict": 2,
    },
};

export default config;
