import { hasAnyDep } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import createConfig from "../../utils/create-config";
import { consoleLog } from "../../utils/loggers";
import bestPracticesConfig from "../best-practices";
import errorsConfig from "../errors";
import styleConfig from "../style";

const bestPracticesRules = bestPracticesConfig.rules as Linter.RulesRecord;
const errorsRules = errorsConfig.rules as Linter.RulesRecord;
const styleRules = styleConfig.rules as Linter.RulesRecord;

let prettierRules: Linter.RulesRecord = {};

if (
    hasAnyDep(["prettier"], {
        peerDeps: false,
    })
) {
    // Workaround VS Code trying to run this file twice!
    if (!global.hasAnolilabEsLintConfigBabelPrettier) {
        global.hasAnolilabEsLintConfigBabelPrettier = true;

        consoleLog("\nFound prettier as dependency, disabling some rules to fix wrong behavior of the rule with eslint and prettier");
    }

    prettierRules = {
        "babel/quotes": 0,

        "@babel/object-curly-spacing": "off",
        "@babel/semi": "off",
    };
}

const config: Linter.Config = createConfig("all", {
    plugins: ["babel"],
    rules: {
        camelcase: "off",
        "babel/camelcase": [
            // Deep clone to avoid object mutation wierdness
            (styleRules["camelcase"] as any[])[0],
            { ...(styleRules["camelcase"] as any[])[1] },
        ],

        "new-cap": "off",
        "babel/new-cap": styleRules["new-cap"],

        "no-invalid-this": "off",
        "babel/no-invalid-this": bestPracticesRules["no-invalid-this"],

        "object-curly-spacing": "off",
        "babel/object-curly-spacing": styleRules["object-curly-spacing"],

        quotes: "off",
        "babel/quotes": styleRules["quotes"],

        semi: "off",
        "babel/semi": styleRules["semi"],

        "no-unused-expressions": "off",
        "babel/no-unused-expressions": bestPracticesRules["no-unused-expressions"],

        "valid-typeof": "off",
        "babel/valid-typeof": errorsRules["valid-typeof"],

        ...prettierRules,
    },
});

export default config;
