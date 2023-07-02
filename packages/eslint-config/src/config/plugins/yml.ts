import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import indent from "../../utils/indent";

if (!global.hasAnolilabEsLintConfigPrettier && (hasDependency("prettier") || hasDevDependency("prettier"))) {
    global.hasAnolilabEsLintConfigPrettier = true;
}

const config: Linter.Config = {
    overrides: [
        {
            extends: ["plugin:yml/recommended", ...(global.hasAnolilabEsLintConfigPrettier ? ["plugin:yml/prettier"] : [])],
            files: ["*.yaml", "*.yml"],
            parser: "yaml-eslint-parser",
            rules: {
                indent: [global.hasAnolilabEsLintConfigPrettier ? "off" : "error", indent],
                "spaced-comment": "off",
            },
        },
    ],
};

export default config;
