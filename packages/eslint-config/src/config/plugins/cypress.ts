import type { Linter } from "eslint";

const config: Linter.Config = {
    env: {
        "cypress/globals": true,
    },
    extends: ["plugin:cypress/recommended"],
    plugins: ["cypress"],
    rules: {
        // Rules not in recommend config
        "cypress/assertion-before-screenshot": 0,
        "cypress/no-force": 0,
        "cypress/require-data-selectors": 0,
    },
};

export default config;
