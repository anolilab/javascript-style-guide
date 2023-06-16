import type { Linter } from "eslint";

// @see https://github.com/dustinspecker/eslint-plugin-no-use-extend-native
const config: Linter.Config = {
    plugins: ["no-use-extend-native"],
    rules: {
        "no-use-extend-native/no-use-extend-native": "error",
    },
};

export default config;
