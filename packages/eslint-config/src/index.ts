/**
 * rushstack eslint-patch is used to include plugins as dev
 * dependencies instead of imposing them as peer dependencies
 *
 * {@link https://www.npmjs.com/package/@rushstack/eslint-patch}
 * {@link https://stackoverflow.com/a/74478635/1392749}
 * {@link https://github.com/eslint/eslint/issues/3458}
 * {@link https://eslint.org/blog/2022/08/new-config-system-part-1/}
 * {@link https://eslint.org/blog/2022/08/new-config-system-part-2/}
 * {@link https://eslint.org/blog/2022/08/new-config-system-part-3/}
 * {@link https://eslint.org/docs/latest/user-guide/configuring/configuration-files-new}
 */
import "@rushstack/eslint-patch/modern-module-resolution";

import { hasDependency, hasDevDependency, pkg } from "@anolilab/package-json-utils";
import type { Linter } from "eslint";
import { join } from "node:path";
import semver from "semver";

import { pluginRules, possiblePluginRules, rules } from "./config";
import engineRules from "./engine-node-overwrite";
import anolilabEslintConfig from "./utils/eslint-config";
import { consoleLog, consolePlugin } from "./utils/loggers";

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabEsLintConfigLoaded) {
    if (process.env["DEBUG"]) {
        consoleLog("\n@anolilab/eslint-config loaded the following plugins:\n");

        consoleLog("  @rushstack/eslint-plugin-security");
        [
            "compat",
            "eslint-comments",
            "i",
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
    }

    let hasLogged = false;

    Object.entries(possiblePluginRules).forEach(([plugin, dependencies]) => {
        const hasOneDependency = Object.values(dependencies).some(Boolean);

        if (hasOneDependency) {
            hasLogged = true;
            consoleLog(
                `\nYour package.json container dependencies for the "${plugin}" eslint-plugin, please add the following dependencies with your chosen package manager to enable this plugin:`,
            );

            Object.entries(dependencies).forEach(([dependency, installed]) => {
                if (!installed) {
                    consoleLog(`    ${dependency}`);
                }
            });
        }
    });

    if (hasLogged) {
        consoleLog("\nTo disable this message, add the following to your package.json:");
        consoleLog('    "anolilab": { "eslint-config": { plugin: { "plugin-name": false } } }\n');
    }

    consoleLog('To disable all logging, add the following to your eslint command call "NO_LOGS=true eslint ..."');

    global.hasAnolilabEsLintConfigLoaded = true;
}

const configRules: Linter.RulesRecord = {};
let nodeVersion: string | undefined;

if (pkg?.engines?.["node"]) {
    nodeVersion = pkg.engines["node"];
}

Object.entries(engineRules).forEach(([rule, ruleConfig]) => {
    Object.keys(ruleConfig)
        .sort(semver.rcompare)
        .forEach((minVersion) => {
            if (nodeVersion && semver.intersects(nodeVersion, `<${minVersion}`)) {
                // eslint-disable-next-line security/detect-object-injection
                configRules[rule] = ruleConfig[minVersion as keyof typeof ruleConfig] as Linter.RuleEntry;
            }
        });
});

// Workaround VS Code trying to run this file twice!
if (!global.hasAnolilabEsLintConfigPrettier && (hasDependency("prettier") || hasDevDependency("prettier"))) {
    global.hasAnolilabEsLintConfigPrettier = true;

    if (anolilabEslintConfig?.["info_on_disabling_prettier_conflict_rule"] !== false) {
        consoleLog("\nFound prettier as dependency, disabling some rules to fix wrong behavior of the rule with eslint and prettier");
    }
}

const config: Linter.Config = {
    // After an .eslintrc.js file is loaded, ESLint will normally continue visiting all parent folders
    // to look for other .eslintrc.js files, and also consult a personal file ~/.eslintrc.js.  If any files
    // are found, their options will be merged.  This is difficult for humans to understand, and it will cause
    // nondeterministic behavior if files are loaded from outside the Git working folder.
    //
    // Setting root=true causes ESLint to stop looking for other config files after the first .eslintrc.js
    extends: [
        ...rules.map((plugin) => join(__dirname, `./config/${plugin}.js`)),

        ...pluginRules.map((plugin) => join(__dirname, `./config/plugins/${plugin}.js`)),
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

        "pnpm-lock.yaml",
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
    // Disable the parser by default
    parser: "",
    // is loaded.
    root: true,
    rules: {
        ...configRules,
    },
};

export default config;
