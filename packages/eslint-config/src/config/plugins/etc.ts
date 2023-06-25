import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("typescript", {
    plugins: ["etc"],
    extends: ["plugin:etc/recommended"],
});

export default config;
