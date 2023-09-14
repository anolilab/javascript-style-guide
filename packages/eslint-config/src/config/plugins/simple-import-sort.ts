import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    env: { es6: true },
    parserOptions: {
        sourceType: "module",
    },
    plugins: ["simple-import-sort"],
    rules: {
        "simple-import-sort/exports": "error",
        "simple-import-sort/imports": "error",
    },
});

export default config;
