import type { Linter } from "eslint";

// @see https://github.com/xjamundx/eslint-plugin-promise#readme
const config: Linter.Config = {
    extends: ["plugin:promise/recommended"],
    plugins: ["promise"],
    rules: {
        "promise/prefer-await-to-callbacks": "error",
        "promise/prefer-await-to-then": "error",
    },
};

export default config;
