import type { Linter } from "eslint";

// @see https://github.com/SonarSource/eslint-plugin-sonarjs
const config: Linter.Config = {
    extends: ["plugin:sonarjs/recommended"],
    plugins: ["sonarjs"],
};

export default config;
