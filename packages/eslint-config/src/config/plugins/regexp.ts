import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    plugins: ["regexp"],
    extends: ["plugin:regexp/recommended"],
});

export default config;
