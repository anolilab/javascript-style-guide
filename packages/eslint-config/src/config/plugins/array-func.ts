// eslint-disable-next-line unicorn/prevent-abbreviations
import type { Linter } from "eslint";

import createConfig from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    plugins: ["array-func"],
    extends: ["plugin:array-func/recommended"],
    rules: {
        // Rule disabled due to clash with Unicorn
        "array-func/prefer-array-from": "off",

        // Rules not in recommended config
        "array-func/prefer-flat": 0,
        "array-func/prefer-flat-map": 0,
    },
});

export default config;
