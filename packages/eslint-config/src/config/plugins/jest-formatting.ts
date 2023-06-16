import type { Linter } from "eslint";

const config: Linter.Config = {
    extends: ["plugin:jest-formatting/recommended"],
};

export default config;
