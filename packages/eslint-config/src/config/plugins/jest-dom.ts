import type { Linter } from "eslint";

const config: Linter.Config = {
    extends: ["plugin:jest-dom/recommended"],
};

export default config;
