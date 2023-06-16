import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["optimize-regex"],
    rules: {
        "optimize-regex/optimize-regex": "warn",
    },
};

export default config;
