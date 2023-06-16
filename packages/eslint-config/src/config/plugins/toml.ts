import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.toml"],
            extends: ["plugin:toml/standard"],
            parser: "toml-eslint-parser",
        },
    ],
};

export default config;
