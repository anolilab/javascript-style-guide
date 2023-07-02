import type { Linter } from "eslint";

const config: Linter.Config = {
    overrides: [
        {
            extends: ["plugin:toml/standard"],
            files: ["*.toml"],
            parser: "toml-eslint-parser",
        },
    ],
};

export default config;
