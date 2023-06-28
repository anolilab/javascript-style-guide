import { hasDependency, hasDevDependency, hasTypescript } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { consoleLog } from "../../utils/loggers";

if (global.anolilabEslintConfigJsDocRules === undefined && hasTypescript) {
    if (hasDependency("eslint-plugin-tsdoc") || hasDevDependency("eslint-plugin-tsdoc")) {
        consoleLog("\nFound eslint-plugin-tsdoc as dependency, disabling the jsdoc rules for *.ts and *.tsx files.");
    } else {
        global.anolilabEslintConfigJsDocRules = [
            {
                files: ["*.ts", "*.tsx", "*.mts", "*.cts"],
                plugins: ["jsdoc"],
                extends: ["plugin:jsdoc/recommended-typescript-error"],
            },
        ];
    }
}

const config: Linter.Config = {
    overrides: [
        {
            files: ["*.js", "*.jsx", "*.mjs", "*.cjs"],
            plugins: ["jsdoc"],
            extends: ["plugin:jsdoc/recommended-error"],
        },
        ...global.anolilabEslintConfigJsDocRules ?? [],
    ],
};

export default config;
