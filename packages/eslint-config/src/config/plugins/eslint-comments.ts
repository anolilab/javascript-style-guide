import type { Linter } from "eslint";

const config: Linter.Config = {
    extends: ["plugin:eslint-comments/recommended"],
    plugins: ["eslint-comments"],
    rules: {
        // Rules are not in recommended config
        "eslint-comments/no-restricted-disable": "off",

        // Disabled as it's already covered by the `unicorn/no-abusive-eslint-disable` rule.
        "eslint-comments/no-unlimited-disable": "off",
        "eslint-comments/no-unused-disable": "error",
        "eslint-comments/no-unused-enable": "error",

        "eslint-comments/no-use": "off",
        "eslint-comments/require-description": "off",
    },
};

export default config;
