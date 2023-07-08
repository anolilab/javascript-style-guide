import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    env: { es6: true },
    parserOptions: {
        sourceType: "module",
    },
    plugins: ["simple-import-sort"],
    rules: {
        "import/first": "error",
        "import/newline-after-import": "error",
        "import/no-duplicates": "error",

        "simple-import-sort/exports": "off",
        "simple-import-sort/imports": "off",
    },
});

export default config;
