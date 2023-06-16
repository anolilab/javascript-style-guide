import type { Linter } from "eslint";

const config: Linter.Config = {
    extends: ["plugin:you-dont-need-lodash-underscore/compatible"],
};

export default config;
