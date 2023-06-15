import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
            plugins: ["typescript-sort-keys"],
            rules: {
                "typescript-sort-keys/interface": "error",
                "typescript-sort-keys/string-enum": "error",
            },
        },
        {
            files: ["*.js", "*.cjs", "*.mjs"],
            rules: {
                "typescript-sort-keys/interface": "off",
                "typescript-sort-keys/string-enum": "off",
            },
        },
    ],
};

export default config;
