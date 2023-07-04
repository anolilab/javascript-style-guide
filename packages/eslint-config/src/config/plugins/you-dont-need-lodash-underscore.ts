import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    extends: ["plugin:you-dont-need-lodash-underscore/compatible"],
});

export default config;
