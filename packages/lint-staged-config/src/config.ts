import { hasDependency, hasDevDependency, pkg } from "@anolilab/package-json-utils";
import type { Config } from "lint-staged";

import eslintConfig from "./groups/eslint";
import packageJsonConfig from "./groups/package-json";
import prettierConfig from "./groups/prettier";
import secretlintConfig from "./groups/secretlint";
import stylesheetsConfig from "./groups/stylesheets";
import testsConfig from "./groups/tests";
import typescriptConfig from "./groups/typescript";

type Groups = {
    configName: string;
    config: Config;
    dependencies: string[];
}[];

const groups: Groups = [
    {
        configName: "eslint",
        config: eslintConfig,
        dependencies: ["eslint"],
    },
    {
        configName: "package-json",
        config: packageJsonConfig,
        dependencies: [],
    },
    {
        configName: "prettier",
        config: prettierConfig,
        dependencies: ["prettier", "pretty-quick"],
    },
    {
        configName: "secretlint",
        config: secretlintConfig,
        dependencies: ["secretlint"],
    },
    {
        configName: "stylesheets",
        config: stylesheetsConfig,
        dependencies: [],
    },
    {
        configName: "tests",
        config: testsConfig,
        dependencies: ["vite", "jest"],
    },
    {
        configName: "typescript",
        config: typescriptConfig,
        dependencies: ["typescript"],
    },
];

let anolilabEslintConfig: { [key: string]: { [key: string]: false | undefined } } = {};

if (pkg) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access
    anolilabEslintConfig = pkg?.["anolilab"]?.["lint-staged-config"];
}

let loadedPlugins: Config = {};
const loadedPluginsNames: string[] = [];

const possiblePlugins: { [rule: string]: { [packageName: string]: boolean } } = {};

groups.forEach((plugin) => {
    const { dependencies, config, configName } = plugin;

    if (anolilabEslintConfig?.["plugin"]?.[configName] !== false) {
        const foundDependencies = [];

        dependencies.forEach((dependency) => {
            if (hasDependency(dependency) || hasDevDependency(dependency)) {
                foundDependencies.push(dependency);
            }
        });

        if (foundDependencies.length === dependencies.length) {
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
