import type { Linter } from "eslint";

const config: Linter.Config = {
    extends: ["plugin:lodash-fp/recommended"],
    plugins: ["lodash-fp"],
    rules: {
        "lodash-fp/use-fp": "off",
    },
};

export default config;
