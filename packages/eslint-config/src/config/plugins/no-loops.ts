import type { Linter } from "eslint";

// @see https://github.com/buildo/eslint-plugin-no-loops
const config: Linter.Config = {
    plugins: ["no-loops"],
    rules: {
        "no-loops/no-loops": 2,
    },
};

export default config;
