import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import eslintConfig from "./groups/eslint";
import jsonConfig from "./groups/json";
import markdownConfig from "./groups/markdown";
import secretlintConfig from "./groups/secretlint";
import stylesheetsConfig from "./groups/stylesheets";
import testsConfig from "./groups/tests";
import typescriptConfig from "./groups/typescript";
import anolilabLintStagedConfig from "./utils/lint-staged-config";

type Groups = {
    configName: string;
    config: Config;
    dependencies: string[];
}[];

const groups: Groups = [
    {
        configName: "eslint",
        config: eslintConfig,
        dependencies: ["prettier", "eslint"],
    },
    {
        configName: "json",
        config: jsonConfig,
        dependencies: ["prettier", "sort-package-json"],
    },
    {
        configName: "markdown",
        config: markdownConfig,
        dependencies: ["prettier", "markdownlint-cli", "markdownlint-cli2"],
    },
    {
        configName: "secretlint",
        config: secretlintConfig,
        dependencies: ["secretlint"],
    },
    {
        configName: "stylesheets",
        config: stylesheetsConfig,
        dependencies: ["stylelint"],
    },
    {
        configName: "tests",
        config: testsConfig,
        dependencies: ["vite", "jest", "ava"],
    },
    {
        configName: "typescript",
        config: typescriptConfig,
        dependencies: ["typescript"],
    },
];

let loadedPlugins: Config = {};
const loadedPluginsNames: string[] = [];

const possiblePlugins: { [rule: string]: { [packageName: string]: boolean } } = {};

groups.forEach((plugin) => {
    const { dependencies, config, configName } = plugin;

    if ((anolilabLintStagedConfig as unknown as { [key: string]: { [key: string]: false | undefined } })?.["plugin"]?.[configName] !== false) {
        const foundDependencies = [];

        dependencies.forEach((dependency) => {
            if (hasDependency(dependency) || hasDevDependency(dependency)) {
                foundDependencies.push(dependency);
            }
        });

        if (foundDependencies.length > 0) {
            loadedPlugins = { ...loadedPlugins, ...config };
            loadedPluginsNames.push(configName);
        } else {
            possiblePlugins[configName] = {};

            dependencies.forEach((dependency) => {
                (possiblePlugins[configName] as { [key: string]: boolean })[dependency] = hasDependency(dependency) || hasDevDependency(dependency);
            });
        }
    }
});

const loaded: Config = { ...loadedPlugins };

export { loaded as loadedPlugins, loadedPluginsNames, possiblePlugins };
