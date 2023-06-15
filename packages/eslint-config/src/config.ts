import {
 hasAnyDep, hasDependency, hasDevDependency, pkg,
} from "@anolilab/package-json-utils";

import type { PackageRules } from "./types";

const baseConfig = [
"best-practices",
"errors",
"style",
"es6",
"variables",
];

const internalPluginConfig = [
    "compat",
    "eslint-comments",
    "import",
    "optimize-regex",
    "promise",
    "simple-import-sort",
    "unicorn",
    // Security Rules
    "no-secrets",
    "sonarjs",
    "security",
    // file rules
    "jsonc",
    "markdown",
    "toml",
    "yml",
    "es",

    // custom rules
    "antfu",
];

const pluginConfig: PackageRules = [
    {
        configName: "array-func",
        dependencies: ["eslint-plugin-array-func"],
    },
    {
        configName: "html",
        dependencies: ["eslint-plugin-html"],
    },
    {
        configName: "jsdoc",
        dependencies: ["eslint-plugin-jsdoc"],
    },
    {
        configName: "tsdoc",
        dependencies: ["eslint-plugin-tsdoc", "typescript"],
    },
    {
        configName: "lodash",
        dependencies: ["lodash", "eslint-plugin-lodash"],
    },
    {
        configName: "lodash-fp",
        dependencies: ["lodash", "eslint-plugin-lodash-fp"],
    },
    {
        configName: "you-dont-need-lodash-underscore",
        dependencies: ["lodash", "eslint-plugin-you-dont-need-lodash-underscore"],
    },
    {
        configName: "mdx",
        dependencies: ["eslint-plugin-mdx"],
    },
    {
        configName: "no-unsanitized",
        dependencies: ["eslint-plugin-no-unsanitized"],
    },
    {
        configName: "react",
        dependencies: [
"react",
"react-dom",
"eslint-plugin-react",
],
    },
    {
        configName: "react-redux",
        dependencies: ["eslint-plugin-react-redux"],
    },
    {
        configName: "jsx-a11y",
        dependencies: [
"react",
"react-dom",
"eslint-plugin-jsx-a11y",
],
    },
    {
        configName: "react-hooks",
        dependencies: [
"react",
"react-dom",
"eslint-plugin-react-hooks",
],
    },
    {
        configName: "you-dont-need-momentjs",
        dependencies: [
"moment",
"moment-timezone",
"eslint-plugin-you-dont-need-momentjs",
],
    },
    {
        configName: "tailwindcss",
        dependencies: ["eslint-plugin-tailwindcss"],
    },
    {
        configName: "cypress",
        dependencies: ["eslint-plugin-cypress"],
    },
    {
        configName: "jest",
        dependencies: ["jest", "eslint-plugin-jest"],
    },
    {
        configName: "jest-dom",
        dependencies: [
"jest",
"@testing-library/jest-dom",
"eslint-plugin-jest-dom",
],
    },
    {
        configName: "jest-async",
        dependencies: ["jest", "eslint-plugin-jest-async"],
    },
    {
        configName: "jest-formatting",
        dependencies: ["jest", "eslint-plugin-jest-formatting"],
    },
    {
        configName: "tailwindcss",
        dependencies: ["tailwindcss"],
    },
    {
        configName: "testing-library",
        dependencies: ["@testing-library/dom", "eslint-plugin-testing-library"],
    },
    {
        configName: "typescript",
        dependencies: ["typescript"],
    },
    {
        configName: "typescript-sort-keys",
        dependencies: ["typescript", "eslint-plugin-typescript-sort-keys"],
    },
    {
        configName: "vitest",
        dependencies: ["vitest", "eslint-plugin-vitest"],
    },
    {
        configName: "zod",
        dependencies: ["zod", "eslint-plugin-zod"],
    },
];

const loadedPlugins: string[] = [...internalPluginConfig];
const possiblePlugins: { [rule: string]: { [packageName: string]: boolean } } = {};

let anolilabEslintConfig: { [key: string]: false | undefined } = {};

if (pkg) {
    anolilabEslintConfig = pkg?.["anolilab"]?.["eslint-config"];
}

pluginConfig.forEach((plugin) => {
    const { dependencies, configName } = plugin;

    if (anolilabEslintConfig?.[configName] !== false) {
        if (
            hasAnyDep(dependencies, {
                peerDeps: false,
                strict: true,
            })
        ) {
            loadedPlugins.push(configName);
        } else {
            possiblePlugins[configName] = {};

            dependencies.forEach((dependency) => {
                (possiblePlugins[configName] as { [key: string]: boolean })[dependency] = hasDependency(dependency) ?? hasDevDependency(dependency);
            });
        }
    }
});

export const rules = baseConfig;
export const pluginRules = loadedPlugins;

export const possiblePluginRules = possiblePlugins;
