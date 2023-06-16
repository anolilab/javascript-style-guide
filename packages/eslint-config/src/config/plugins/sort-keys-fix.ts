import type { Linter } from "eslint";

const config: Linter.Config = {
    plugins: ["sort-keys-fix"],
    rules: {
        "sort-keys-fix/sort-keys-fix": "error",
    },
};

export default config;
