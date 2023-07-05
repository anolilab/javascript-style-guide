import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import { env } from "node:process";

import anolilabEslintConfig from "../../utils/eslint-config";
import { consoleLog } from "../../utils/loggers";

const extendedPlugins: string[] = [];

if (hasDependency("prettier") || hasDevDependency("prettier")) {
    extendedPlugins.push("plugin:jsonc/prettier");
}

const hasSortPackageJson = hasDependency("sort-package-json") || hasDevDependency("sort-package-json");

if (hasSortPackageJson) {
    let showLog: boolean = env["DISABLE_INFO_ON_DISABLING_JSONC_SORT_KEYS_RULE"] !== "true";

    if (showLog && anolilabEslintConfig["info_on_disabling_jsonc_sort_keys_rule"] !== undefined) {
        showLog = anolilabEslintConfig["info_on_disabling_jsonc_sort_keys_rule"];
    }

    if (showLog) {
        consoleLog(`\n@anolilab/eslint-config found sort-package-json. \n
    Following rules are disabled: jsonc/sort-keys for all package.json files. \n`);
    }
}

const config: Linter.Config = {
    overrides: [
        {
            extends: extendedPlugins,
            files: ["*.json", "*.json5", "*.jsonc"],
            parser: "jsonc-eslint-parser",
        },
        {
            extends: ["plugin:jsonc/recommended-with-json5"],
            files: ["*.json5"],
        },
        {
            extends: ["plugin:jsonc/recommended-with-jsonc"],
            files: ["*.jsonc"],
        },
        {
            extends: ["plugin:jsonc/recommended-with-json"],
            files: ["*.json"],
        },
        {
            extends: ["plugin:jsonc/recommended-with-json"],
            files: ["package.json"],
            rules: {
                // When the package "sort-package-json" is installed, we disable the rule "jsonc/sort-keys" because, the package "sort-package-json" is responsible for sorting the keys.
                "jsonc/sort-keys": hasSortPackageJson
                    ? "off"
                    : [
                          "error",
                          {
                              order: [
                                  "publisher",
                                  "name",
                                  "displayName",
                                  "type",
                                  "version",
                                  "private",
                                  "packageManager",
                                  "description",
                                  "author",
                                  "license",
                                  "funding",
                                  "homepage",
                                  "repository",
                                  "bugs",
                                  "keywords",
                                  "categories",
                                  "sideEffects",
                                  "exports",
                                  "main",
                                  "module",
                                  "unpkg",
                                  "jsdelivr",
                                  "types",
                                  "typesVersions",
                                  "bin",
                                  "icon",
                                  "files",
                                  "engines",
                                  "activationEvents",
                                  "contributes",
                                  "scripts",
                                  "peerDependencies",
                                  "peerDependenciesMeta",
                                  "dependencies",
                                  "optionalDependencies",
                                  "devDependencies",
                                  "pnpm",
                                  "overrides",
                                  "resolutions",
                                  "husky",
                                  "simple-git-hooks",
                                  "lint-staged",
                                  "eslintConfig",
                              ],
                              pathPattern: "^$",
                          },
                          {
                              order: { type: "asc" },
                              pathPattern: "^(?:dev|peer|optional|bundled)?[Dd]ependencies$",
                          },
                          {
                              order: ["types", "require", "import"],
                              pathPattern: "^exports.*$",
                          },
                      ],
            },
        },
    ],
};

export default config;
