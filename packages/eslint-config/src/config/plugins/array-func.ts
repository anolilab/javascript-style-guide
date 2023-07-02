// eslint-disable-next-line unicorn/prevent-abbreviations
import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    extends: ["plugin:array-func/recommended"],
    plugins: ["array-func"],
    rules: {
        // Rule disabled due to clash with Unicorn
        "array-func/prefer-array-from": "off",

        // Rules not in recommended config
        "array-func/prefer-flat": 0,
        "array-func/prefer-flat-map": 0,
    },
});

export default config;
