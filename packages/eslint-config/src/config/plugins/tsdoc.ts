import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.ts", "*.tsx"],
            plugins: ["eslint-plugin-tsdoc"],
            rules: {
                "tsdoc/syntax": "error",
            },
        },
    ],
};

export default config;
