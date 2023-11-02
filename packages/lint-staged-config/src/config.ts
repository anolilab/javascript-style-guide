import { createRequire } from "node:module";

import { hasDependency, hasDevDependency } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import anolilabLintStagedConfig from "./utils/lint-staged-config";

const require = createRequire(import.meta.url);

type Groups = {
    configName: string;
    dependencies: string[];
}[];

const groups: Groups = [
    {
        configName: "eslint",
        dependencies: ["eslint"],
    },
    {
        configName: "json",
        dependencies: ["prettier"],
    },
    {
        configName: "markdown",
        dependencies: ["markdownlint-cli", "markdownlint-cli2"],
    },
    {
        configName: "secretlint",
        dependencies: ["secretlint"],
    },
    {
        configName: "stylesheets",
        dependencies: ["stylelint"],
    },
    {
        configName: "tests",
        dependencies: ["vite", "jest", "ava"],
    },
    {
        configName: "typescript",
        dependencies: ["typescript"],
    },
];

let loadedPlugins: Config = {};
const loadedPluginsNames: string[] = [];

const possiblePlugins: Record<string, Record<string, boolean>> = {};

groups.forEach((plugin) => {
    const { configName, dependencies } = plugin;

    // eslint-disable-next-line security/detect-object-injection
    if ((anolilabLintStagedConfig as unknown as Record<string, Record<string, false | undefined>>)["plugin"]?.[configName] !== false) {
        const foundDependencies = [];

        dependencies.forEach((dependency) => {
            if (hasDependency(dependency) || hasDevDependency(dependency)) {
                foundDependencies.push(dependency);
            }
        });

        if (foundDependencies.length > 0) {
            // eslint-disable-next-line security/detect-non-literal-require,import/no-dynamic-require
            const config = require(`./groups/${configName}`) as Config;

            loadedPlugins = { ...loadedPlugins, ...config };
            loadedPluginsNames.push(configName);
        } else {
            // eslint-disable-next-line security/detect-object-injection
            possiblePlugins[configName] = {};

            dependencies.forEach((dependency) => {
                // eslint-disable-next-line security/detect-object-injection
                (possiblePlugins[configName] as Record<string, boolean>)[dependency] = hasDependency(dependency) || hasDevDependency(dependency);
            });
        }
    }
});

const loaded: Config = { ...loadedPlugins };

export { loaded as loadedPlugins, loadedPluginsNames, possiblePlugins };
