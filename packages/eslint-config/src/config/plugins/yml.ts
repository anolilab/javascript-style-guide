import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import styleConfig from "../style";

const styleRules = styleConfig.rules as Linter.RulesRecord;

if (!global.hasAnolilabEsLintConfigYamlPrettier) {
    global.hasAnolilabEsLintConfigYamlPrettier = hasDependency("prettier") || hasDevDependency("prettier");
}

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.yaml", "*.yml"],
            extends: ["plugin:yml/recommended", ...(global.hasAnolilabEsLintConfigYamlPrettier ? ["plugin:yml/prettier"] : [])],
            parser: "yaml-eslint-parser",
            rules: {
                "spaced-comment": "off",
                indent: ["error", (styleRules["indent"] as any[])[1] as number],
            },
        },
    ],
};

export default config;
