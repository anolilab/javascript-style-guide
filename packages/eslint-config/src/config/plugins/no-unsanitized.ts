import type { Linter } from "eslint";

// @see https://github.com/mozilla/eslint-plugin-no-unsanitized
const config: Linter.Config = {
    plugins: ["no-unsanitized"],
    rules: {
        "no-unsanitized/method": "error",
        "no-unsanitized/property": "error",
    },
};

export default config;
