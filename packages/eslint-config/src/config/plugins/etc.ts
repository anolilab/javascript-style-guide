import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("typescript", {
    extends: ["plugin:etc/recommended"],
    plugins: ["etc"],
});

export default config;
