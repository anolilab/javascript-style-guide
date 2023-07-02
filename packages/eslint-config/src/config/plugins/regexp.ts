import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    extends: ["plugin:regexp/recommended"],
    plugins: ["regexp"],
});

export default config;
