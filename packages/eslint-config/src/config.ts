import { hasDependency, hasDevDependency, resolvePackage } from "@anolilab/package-json-utils";

import type { PackageRules } from "./types";
import anolilabEslintConfig from "./utils/eslint-config";

const baseConfig = ["best-practices", "errors", "style", "es6", "variables"];

// eslint-disable-next-line import/exports-last
export const internalPluginConfig = [
    "compat",
    "eslint-comments",
    "import",
    "promise",
    "simple-import-sort",
    "no-extend-native",
    "node",
    // Security Rules
    "no-secrets",
    "sonarjs",
    "security",
    "regexp",
    // file rules
    "jsonc",
    "markdown",
    "toml",
    "yml",
    "html",

    // custom rules
    "antfu",
    "unicorn",
    "es",
    "perfectionist",
];

const pluginConfig: PackageRules = [
    {
        configName: "array-func",
        dependencies: ["eslint-plugin-array-func"],
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
        oneOfDependency: ["nextra", "docz", "@docusaurus/core", "gatsby-plugin-mdx"],
        resolve: ["@mdx-js/mdx", "remark-mdx", "@mdx-js/loader", "@mdx-js/rollup", "@mdx-js/react"],
    },
    {
        configName: "no-unsanitized",
        dependencies: ["eslint-plugin-no-unsanitized"],
    },
    {
        configName: "react",
        dependencies: ["react", "react-dom", "eslint-plugin-react"],
    },
    {
        configName: "react-redux",
        dependencies: ["eslint-plugin-react-redux"],
        oneOfDependency: ["@reduxjs/toolkit", "redux"],
    },
    {
        configName: "jsx-a11y",
        dependencies: ["react", "react-dom", "eslint-plugin-jsx-a11y"],
    },
    {
        configName: "react-hooks",
        dependencies: ["react", "react-dom", "eslint-plugin-react-hooks"],
    },
    {
        configName: "react-usememo",
        dependencies: ["react", "react-dom", "@arthurgeron/eslint-plugin-react-usememo"],
    },
    {
        configName: "you-dont-need-momentjs",
        dependencies: ["moment", "eslint-plugin-you-dont-need-momentjs"],
    },
    {
        configName: "you-dont-need-momentjs",
        dependencies: ["moment-timezone", "eslint-plugin-you-dont-need-momentjs"],
    },
    {
        configName: "tailwindcss",
        dependencies: ["eslint-plugin-tailwindcss"],
    },
    {
        configName: "cypress",
        dependencies: ["cypress", "eslint-plugin-cypress"],
    },
    {
        configName: "jest",
        dependencies: ["jest", "eslint-plugin-jest"],
    },
    {
        configName: "jest-dom",
        dependencies: ["jest", "@testing-library/jest-dom", "eslint-plugin-jest-dom"],
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
        configName: "testing-library-dom",
        dependencies: ["@testing-library/dom", "eslint-plugin-testing-library"],
    },
    {
        configName: "testing-library-react",
        dependencies: ["react", "@testing-library/react", "eslint-plugin-testing-library"],
    },
    {
        configName: "typescript",
        dependencies: ["typescript"],
    },
    {
        configName: "etc",
        dependencies: ["typescript", "eslint-plugin-etc"],
    },
    {
        configName: "vitest",
        dependencies: ["vitest", "eslint-plugin-vitest"],
    },
    {
        configName: "zod",
        dependencies: ["zod", "eslint-plugin-zod"],
    },
    {
        configName: "ava",
        dependencies: ["ava", "eslint-plugin-ava"],
    },
    {
        configName: "storybook",
        dependencies: ["storybook", "eslint-plugin-storybook"],
    },
    {
        configName: "playwright",
        dependencies: ["playwright", "eslint-plugin-playwright"],
    },
    {
        configName: "tanstack-query",
        dependencies: ["@tanstack/react-query", "@tanstack/eslint-plugin-query"],
    },
];

const loadedPlugins: string[] = [...internalPluginConfig];
const possiblePlugins: Record<string, Record<string, boolean>> = {};

// eslint-disable-next-line sonarjs/cognitive-complexity
pluginConfig.forEach((plugin) => {
    const { configName, dependencies } = plugin;

    // eslint-disable-next-line security/detect-object-injection
    if ((anolilabEslintConfig as unknown as Record<string, Record<string, false | undefined>>)["plugin"]?.[configName] !== false) {
        const foundDependencies = [];

        dependencies.forEach((dependency) => {
            if (hasDependency(dependency) || hasDevDependency(dependency)) {
                foundDependencies.push(dependency);
            }
        });

        // eslint-disable-next-line security/detect-object-injection
        possiblePlugins[configName] = {};

        if (foundDependencies.length === 0 && plugin.resolve !== undefined) {
            plugin.resolve.forEach((rdependency) => {
                if (resolvePackage(rdependency) !== undefined) {
                    dependencies.forEach((dependency) => {
                        // eslint-disable-next-line security/detect-object-injection
                        (possiblePlugins[configName] as Record<string, boolean>)[dependency] = hasDependency(dependency) || hasDevDependency(dependency);
                    });
                }
            });
        }

        if (foundDependencies.length === dependencies.length) {
            // eslint-disable-next-line security/detect-object-injection,@typescript-eslint/no-dynamic-delete
            delete possiblePlugins[configName];

            loadedPlugins.push(configName);
        } else {
            dependencies.forEach((dependency) => {
                // eslint-disable-next-line security/detect-object-injection
                (possiblePlugins[configName] as Record<string, boolean>)[dependency] = hasDependency(dependency) || hasDevDependency(dependency);
            });
        }
    }
});

export const rules = baseConfig;
export const pluginRules = loadedPlugins;

export const possiblePluginRules = possiblePlugins;
