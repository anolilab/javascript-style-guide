import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    extends: ["plugin:editorconfig/all"],
    plugins: ["editorconfig"],
});

export default config;
