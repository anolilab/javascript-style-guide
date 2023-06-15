/**
 * @rushstack/eslint-patch is used to include plugins as dev
 * dependencies instead of imposing them as peer dependencies
 *
 * https://www.npmjs.com/package/@rushstack/eslint-patch
 */
import "@rushstack/eslint-patch/modern-module-resolution";

import { packageIsTypeModule } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import { join } from "node:path";

import { pluginRules, possiblePluginRules, rules } from "./config";
import { consoleLog, consolePlugin } from "./utils/loggers";

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabEsLintConfigLoaded) {
    consoleLog("\n@anolilab/eslint-config loaded the following plugins:\n");

    consoleLog("  @rushstack/eslint-plugin-security");
    [
        "compat",
        "eslint-comments",
        "i",
        "optimize-regex",
        "promise",
        "simple-import-sort",
        "unicorn",
        "no-secrets",
        "sonarjs",
        "json",
        "jsonc",
        "markdown",
        "toml",
        "yml",
        "es",
        ...pluginRules,
    ].forEach((plugin) => consolePlugin(plugin));

    Object.entries(possiblePluginRules).forEach(([plugin, dependencies]) => {
        const hasOneDependency = Object.values(dependencies).some(Boolean);

        if (hasOneDependency) {
            consoleLog(
                `\nYour package.json container dependencies for "${plugin}" eslint-plugin, please add the following dependencies with your chosen package manager to enable this plugin:`,
            );

            Object.entries(dependencies).forEach(([dependency, installed]) => {
                if (!installed) {
                    consoleLog(`    ${dependency}`);
                }
            });
        }
    });

    if (Object.keys(possiblePluginRules).length > 0) {
        consoleLog("\nTo disable this message, add the following to your package.json:");
        consoleLog('    "anolilab": { "eslint-config": { "plugin-name": false } }\n');
    }

    global.hasAnolilabEsLintConfigLoaded = true;
}

const config: Linter.Config = {
    // After an .eslintrc.js file is loaded, ESLint will normally continue visiting all parent folders
    // to look for other .eslintrc.js files, and also consult a personal file ~/.eslintrc.js.  If any files
    // are found, their options will be merged.  This is difficult for humans to understand, and it will cause
    // nondeterministic behavior if files are loaded from outside the Git working folder.
    //
    // Setting root=true causes ESLint to stop looking for other config files after the first .eslintrc.js
    // is loaded.
    root: true,
    // Disable the parser by default
    parser: "",

    extends: [
        ...rules
            // eslint-disable-next-line no-undef
            .map((plugin) => join(__dirname, `./config/${plugin}.${packageIsTypeModule ? "m" : ""}js`)),
        // eslint-disable-next-line no-undef
        ...pluginRules.map((plugin) => join(__dirname, `./config/plugins/${plugin}.${packageIsTypeModule ? "m" : ""}js`)),
    ],
    overrides: [
        {
            files: ["**/migrations/*.{js,ts}"],
            rules: {
                "filenames/match-regex": "off",
            },
        },
        {
            files: [
                // Test files
                "**/*.spec.{js,ts,tsx}",
                "**/*.test.{js,ts,tsx}",

                // Facebook convention
                "**/__mocks__/*.{js,ts,tsx}",
                "**/__tests__/*.{js,ts,tsx}",

                // Microsoft convention
                "**/test/*.{js,ts,tsx}",
            ],
            rules: {
                "no-magic-numbers": "off",
                "sonarjs/no-duplicate-string": "off",
            },
        },
    ],
    ignorePatterns: [
        "!.*",

        ".git/",
        "node_modules/",
        "bower_components/",
        "jspm_packages/",
        ".npm/",

        "lib-cov/",
        "coverage/",
        ".nyc_output/",
        ".cache/",

        "build/",
        "dist/",
        "tmp/",

        "**/*.min.*",

        // Manually authored .d.ts files are generally used to describe external APIs that are  not expected
        // to follow our coding conventions.  Linting those files tends to produce a lot of spurious suppressions,
        // so we simply ignore them.
        "*.d.ts",
    ],
};

export default config;
