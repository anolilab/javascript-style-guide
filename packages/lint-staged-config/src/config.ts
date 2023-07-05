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
    config: Config;
    configName: string;
    dependencies: string[];
}[];

const groups: Groups = [
    {
        config: eslintConfig,
        configName: "eslint",
        dependencies: ["prettier", "eslint"],
    },
    {
        config: jsonConfig,
        configName: "json",
        dependencies: ["prettier", "sort-package-json"],
    },
    {
        config: markdownConfig,
        configName: "markdown",
        dependencies: ["prettier", "markdownlint-cli", "markdownlint-cli2"],
    },
    {
        config: secretlintConfig,
        configName: "secretlint",
        dependencies: ["secretlint"],
    },
    {
        config: stylesheetsConfig,
        configName: "stylesheets",
        dependencies: ["stylelint"],
    },
    {
        config: testsConfig,
        configName: "tests",
        dependencies: ["vite", "jest", "ava"],
    },
    {
        config: typescriptConfig,
        configName: "typescript",
        dependencies: ["typescript"],
    },
];

let loadedPlugins: Config = {};
const loadedPluginsNames: string[] = [];

const possiblePlugins: { [rule: string]: { [packageName: string]: boolean } } = {};

groups.forEach((plugin) => {
    const { config, configName, dependencies } = plugin;

    // eslint-disable-next-line security/detect-object-injection
    if ((anolilabLintStagedConfig as unknown as { [key: string]: { [key: string]: false | undefined } })["plugin"]?.[configName] !== false) {
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
            // eslint-disable-next-line security/detect-object-injection
            possiblePlugins[configName] = {};

            dependencies.forEach((dependency) => {
                // eslint-disable-next-line security/detect-object-injection
                (possiblePlugins[configName] as { [key: string]: boolean })[dependency] = hasDependency(dependency) || hasDevDependency(dependency);
            });
        }
    }
});

const loaded: Config = { ...loadedPlugins };

export { loaded as loadedPlugins, loadedPluginsNames, possiblePlugins };
