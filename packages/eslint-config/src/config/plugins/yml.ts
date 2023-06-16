import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.yaml", "*.yml"],
            extends: ["plugin:yml/standard"],
            parser: "yaml-eslint-parser",
            rules: {
                "spaced-comment": "off",
            },
        },
    ],
};

export default config;
