import { hasTypescript, packageIsTypeModule } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";

const config: Linter.Config = createConfig("all", {
    plugins: ["antfu"],
    rules: {
        "antfu/if-newline": "error",
        "antfu/import-dedupe": "error",
        "antfu/generic-spacing": "error",
        "antfu/prefer-inline-type-import": "off",
        "antfu/top-level-function": "off",
        "antfu/no-cjs-exports": packageIsTypeModule ? "error" : "off",
        "antfu/no-ts-export-equal": hasTypescript ? "error" : "off",
    },
});

export default config;
