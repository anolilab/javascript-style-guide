import { hasAnyDep, hasTypescript } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { consoleLog } from "../../utils/loggers";

const overrides: Linter.Config["overrides"] = [
    {
        files: [
"*.js",
"*.jsx",
"*.mjs",
"*.cjs",
],
        plugins: ["jsdoc"],
        extends: ["plugin:jsdoc/recommended-error"],
    },
];

if (hasTypescript) {
    if (hasAnyDep(["eslint-plugin-tsdoc"])) {
        consoleLog("\nFound eslint-plugin-tsdoc as dependency, disabling the jsdoc rules for *.ts and *.tsx files.");
    } else {
        overrides.push({
            files: ["*.ts", "*.tsx"],
            plugins: ["jsdoc"],
            extends: ["plugin:jsdoc/recommended-typescript-error"],
        });
    }
}

const config: Linter.Config = {
    overrides,
};

export default config;
