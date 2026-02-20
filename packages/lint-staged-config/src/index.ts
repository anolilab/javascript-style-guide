import { existsSync } from "node:fs";

import { findPackageManagerSync, hasPackageJsonAnyDependency, parsePackageJsonSync } from "@visulima/package";
// eslint-disable-next-line e18e/ban-dependencies
import type { Configuration } from "lint-staged";

import type { EslintConfig } from "./types";
import concatFiles from "./utils/concat-files";
import getNearestConfigPath from "./utils/get-nearest-config-path";

interface StylesheetsConfig {
    extensions?: (typeof stylesheetsExtensions)[number][];
}

interface TypescriptConfig {
    exclude?: string[];
    extensions?: (typeof typescriptExtensions)[number][];
}

export const eslintExtensions = ["cjs", "js", "mjs", "cts", "ts", "mts", "yml", "yaml", "jsx", "tsx", "mdx", "toml", "json", "json5", "jsonc"] as const;
export const typescriptExtensions = ["cts", "ts", "mts", "tsx", "ctsx"] as const;
export const stylesheetsExtensions = ["css", "scss", "sass", "less", "styl", "stylus", "pcss", "postcss", "sss"] as const;

export const defineConfig = (
    options: {
        cwd?: string;
        debug?: boolean;
        eslint?: EslintConfig | false;
        json?: false;
        markdown?: false;
        secretlint?: false;
        stylesheets?: StylesheetsConfig | false;
        tests?: false;
        typescript?: TypescriptConfig | false;
    } = {},
    // eslint-disable-next-line sonarjs/cognitive-complexity
): Configuration => {
    const config = {
        debug: false,
        eslint: {
            extensions: eslintExtensions,
        },
        stylesheets: {
            extensions: stylesheetsExtensions,
        },
        typescript: {
            exclude: [],
            extensions: typescriptExtensions,
        },
        ...options,
    };
    const cwd = config.cwd || process.cwd();

    if (!existsSync(`${cwd}/package.json`)) {
        throw new Error(`No package.json found in the current working directory: ${cwd}; Please adjust the "cwd" option.`);
    }

    const packageJson = parsePackageJsonSync(`${cwd}/package.json`, {
        resolveCatalogs: true,
    });
    const { packageManager } = findPackageManagerSync(cwd);

    if (config.debug) {
        // eslint-disable-next-line no-console
        console.debug("Package manager found:", packageManager);
    }

    const hasMarkdownCli = hasPackageJsonAnyDependency(packageJson, ["markdownlint-cli"]);
    const hasMarkdownCli2 = hasPackageJsonAnyDependency(packageJson, ["markdownlint-cli2"]);

    const hasPrettier = hasPackageJsonAnyDependency(packageJson, ["prettier"]);

    let loadedPlugins: Extract<Configuration, Record<string, unknown>> = {};

    if (config.eslint !== false && hasPackageJsonAnyDependency(packageJson, ["eslint"])) {
        if (!Array.isArray((config.eslint as EslintConfig).extensions) || ((config.eslint as EslintConfig).extensions as string[]).length === 0) {
            throw new Error("The `extensions` option is required for the ESLint configuration.");
        }

        if (!hasMarkdownCli && !hasMarkdownCli2) {
            ((config.eslint as EslintConfig).extensions as string[]).push("md");
        }

        loadedPlugins[`**/*.{${((config.eslint as EslintConfig).extensions as string[]).join(",")}}`] = async (filenames: ReadonlyArray<string>) => {
            const { default: createEslintCommands } = await import("./eslint/create-eslint-commands");

            return [
                ...hasPrettier ? [`${packageManager} exec prettier --write ${concatFiles(filenames)}`] : [],
                ...await createEslintCommands(packageManager, packageJson, config.eslint as EslintConfig, filenames),
            ];
        };
    }

    if (config.json !== false && hasPackageJsonAnyDependency(packageJson, ["sort-package-json"])) {
        loadedPlugins["**/package.json"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec sort-package-json ${concatFiles(filenames)}`];
    }

    if (config.markdown !== false && hasMarkdownCli) {
        loadedPlugins = {
            ...loadedPlugins,
            "**/*.md": (filenames: ReadonlyArray<string>) => [
                ...hasPrettier ? [`${packageManager} exec prettier --write ${concatFiles(filenames)}`] : [],
                ...hasMarkdownCli
                    ? [`${packageManager} exec markdownlint --fix --ignore '**/node_modules/**' --ignore '**/CHANGELOG.md' ${concatFiles(filenames)}`]
                    : [],
                ...hasMarkdownCli2
                    ? [`${packageManager} exec markdownlint-cli2 --fix '!**/node_modules/**' '!**/CHANGELOG.md' ${concatFiles(filenames)}`]
                    : [],
            ],
            "**/*.mdx": (filenames: ReadonlyArray<string>) => [...hasPrettier ? [`${packageManager} exec prettier --write ${concatFiles(filenames)}`] : []],
        };
    }

    if (config.secretlint !== false && hasPackageJsonAnyDependency(packageJson, ["secretlint"])) {
        loadedPlugins["**/*"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec secretlint ${concatFiles(filenames)}`];
    }

    if (config.stylesheets !== false && hasPackageJsonAnyDependency(packageJson, ["stylelint"])) {
        if (
            !Array.isArray((config.stylesheets as StylesheetsConfig).extensions)
            || ((config.stylesheets as StylesheetsConfig).extensions as string[]).length === 0
        ) {
            throw new Error("The `extensions` option is required for the Stylesheets configuration.");
        }

        loadedPlugins[`**/*.{${((config.stylesheets as StylesheetsConfig).extensions as string[]).join(",")}}`] = (filenames: ReadonlyArray<string>) => [
            ...hasPrettier ? [`${packageManager} exec prettier --ignore-unknown --write ${concatFiles(filenames)}`] : [],
            `${packageManager} exec stylelint --fix`,
        ];
    }

    if (config.typescript !== false && hasPackageJsonAnyDependency(packageJson, ["typescript"])) {
        if (
            !Array.isArray((config.typescript as TypescriptConfig).extensions)
            || ((config.typescript as TypescriptConfig).extensions as string[]).length === 0
        ) {
            throw new Error("The `extensions` option is required for the TypeScript configuration.");
        }

        loadedPlugins[`**/*.{${((config.typescript as TypescriptConfig).extensions as string[]).join(",")}}`] = (
            filenames: ReadonlyArray<string>,
        ): string[] => {
            const commands = new Set<string>();

            filenames.forEach((filePath) => {
                if (typeof (config.typescript as TypescriptConfig)?.exclude === "object" && Array.isArray((config.typescript as TypescriptConfig).exclude)) {
                    let exclude = false;

                    ((config.typescript as TypescriptConfig).exclude as string[]).forEach((value) => {
                        if (!exclude && filePath.includes(value)) {
                            exclude = true;
                        }
                    });

                    if (exclude) {
                        if (config.debug) {
                            // eslint-disable-next-line no-console
                            console.info(`Skipping ${filePath} as it's excluded in the settings.`);
                        }

                        return;
                    }
                }

                try {
                    const tsconfigPath = getNearestConfigPath(
                        "tsconfig.json",
                        // eslint-disable-next-line no-template-curly-in-string
                        filePath as "/${string}",
                    ) as string;

                    commands.add(`${packageManager} exec tsc --noEmit --project ${tsconfigPath}`);
                } catch (error) {
                    if (config.debug) {
                        // eslint-disable-next-line no-console
                        console.error(error);
                    }
                }
            });

            return [...commands];
        };
    }

    if (hasPackageJsonAnyDependency(packageJson, ["vitest"])) {
        loadedPlugins["**/?(*.){test,spec}.?(c|m)[jt]s?(x)"] = ["vitest related --run"];
        loadedPlugins["**/__tests__/**/*.?(c|m)[jt]s?(x)"] = [`${packageManager} exec vitest related --run`];
    }

    if (hasPackageJsonAnyDependency(packageJson, ["jest"])) {
        loadedPlugins["**/*.spec.{js,ts,tsx}"] = [`${packageManager} exec jest --findRelatedTests`];
        loadedPlugins["**/*.test.{js,ts,tsx}"] = [`${packageManager} exec jest --findRelatedTests`];
        loadedPlugins["**/?(*.){test,spec}.?(c|m)[jt]s?(x)"] = [`${packageManager} exec jest --findRelatedTests`];
        loadedPlugins["**/__mocks__/*.{js,ts,tsx}"] = [`${packageManager} exec jest --findRelatedTests`];
        loadedPlugins["**/__tests__/**/*.?(c|m)[jt]s?(x)"] = [`${packageManager} exec jest --findRelatedTests`];
        loadedPlugins["**/__tests__/*.{js,ts,tsx}"] = [`${packageManager} exec jest --findRelatedTests`];
        loadedPlugins["**/test/*.{js,ts,tsx}"] = [`${packageManager} exec jest --findRelatedTests`];
    }

    if (hasPackageJsonAnyDependency(packageJson, ["ava"])) {
        loadedPlugins["**/(test|tests|__tests__)/**/*.js"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec ava ${concatFiles(filenames)}`];
        loadedPlugins["**/*.(spec|test).js"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec ava ${concatFiles(filenames)}`];
        loadedPlugins["**/test.js"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec ava ${concatFiles(filenames)}`];
        loadedPlugins["**/test-*.js"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec ava ${concatFiles(filenames)}`];
    }

    return loadedPlugins;
};
