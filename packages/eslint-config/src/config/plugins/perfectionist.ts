import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";

import { createConfigs } from "../../utils/create-config";
import { consoleLog } from "../../utils/loggers";

if (
    !global.hasAnolilabEsLintConfigPerfectionistTypescriptSortKeys &&
    (hasDependency("eslint-plugin-typescript-sort-keys") || hasDevDependency("eslint-plugin-typescript-sort-keys"))
) {
    global.hasAnolilabEsLintConfigPerfectionistTypescriptSortKeys = true;

    consoleLog('\nPlease remove "eslint-plugin-typescript-sort-keys" from your package.json, it conflicts with "eslint-plugin-perfectionist".\n');
}

// @see https://github.com/azat-io/eslint-plugin-perfectionist
const config: Linter.Config = createConfigs([
    {
        config: {
            extends: ["plugin:perfectionist/recommended-natural"],
            plugins: ["perfectionist"],
            rules: {
                // Disabled because of sort-imports
                "perfectionist/sort-imports": "off",
                // Disabled because of @typescript-eslint/sort-type-constituents
                "perfectionist/sort-union-types": "off",

                // Disabled because of simple-import-sort/imports
                "perfectionist/sort-named-imports": "off",
            },
        },
        type: "all",
    },
    {
        config: {
            rules: {
                "perfectionist/sort-objects": "off",
            },
        },
        type: "postcss",
    },
]);

export default config;
