import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { createConfig } from "../../utils/create-config";
import bestPracticesConfig from "../best-practices";
import errorsConfig from "../errors";
import styleConfig from "../style";

const bestPracticesRules = bestPracticesConfig.rules as Linter.RulesRecord;
const errorsRules = errorsConfig.rules as Linter.RulesRecord;
const styleRules = styleConfig.rules as Linter.RulesRecord;

if (global.anolilabEslintConfigBabelPrettierRules === undefined && (hasDependency("prettier") || hasDevDependency("prettier"))) {
    global.anolilabEslintConfigBabelPrettierRules = {
        "@babel/object-curly-spacing": "off",

        "@babel/semi": "off",
        "babel/quotes": 0,
    };
}

const config: Linter.Config = createConfig("all", {
    plugins: ["babel"],
    rules: {
        // Deep clone to avoid object mutation weirdness
        "babel/camelcase": [...(styleRules["camelcase"] as unknown[])] as Linter.RuleEntry,
        "babel/new-cap": styleRules["new-cap"],

        "babel/no-invalid-this": bestPracticesRules["no-invalid-this"],
        "babel/no-unused-expressions": bestPracticesRules["no-unused-expressions"],

        "babel/object-curly-spacing": styleRules["object-curly-spacing"],
        "babel/quotes": styleRules["quotes"],

        "babel/semi": styleRules["semi"],
        "babel/valid-typeof": errorsRules["valid-typeof"],

        camelcase: "off",
        "new-cap": "off",

        "no-invalid-this": "off",
        "no-unused-expressions": "off",

        "object-curly-spacing": "off",
        quotes: "off",

        semi: "off",
        "valid-typeof": "off",

        ...global.anolilabEslintConfigBabelPrettierRules,
    },
});

export default config;
