import { existsSync } from "node:fs";

import { findPackageManagerSync, hasPackageJsonAnyDependency, parsePackageJsonSync } from "@visulima/package";
import type { Configuration } from "lint-staged";

import type { EslintConfig } from "./types";
import concatFiles from "./utils/concat-files";
import getNearestConfigPath, { isAbsolutePath } from "./utils/get-nearest-config-path";

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
    // Copies, not the exported tuples themselves: the ESLint branch below pushes "md" onto this
    // array, which would otherwise mutate the shared constant for every subsequent call.
    const defaultEslint: EslintConfig = { extensions: [...eslintExtensions] };
    const defaultStylesheets: StylesheetsConfig = { extensions: [...stylesheetsExtensions] };
    const defaultTypescript: TypescriptConfig = { exclude: [], extensions: [...typescriptExtensions] };

    const config = {
        debug: false,
        eslint: defaultEslint,
        stylesheets: defaultStylesheets,
        typescript: defaultTypescript,
        ...options,
    };
    const cwd = config.cwd ?? process.cwd();

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

    // `Extract` here selects lint-staged's object task-map from its config union; it is a union
    // filter rather than a dictionary contract, which is what the rule is guarding against.
    // eslint-disable-next-line @typescript-eslint/no-restricted-types -- see comment above
    let loadedPlugins: Extract<Configuration, Record<string, unknown>> = {};

    if (config.eslint !== false && hasPackageJsonAnyDependency(packageJson, ["eslint"])) {
        const eslintConfig: EslintConfig = config.eslint;
        const { extensions } = eslintConfig;

        if (!Array.isArray(extensions) || extensions.length === 0) {
            throw new Error("The `extensions` option is required for the ESLint configuration.");
        }

        if (!hasMarkdownCli && !hasMarkdownCli2) {
            extensions.push("md");
        }

        loadedPlugins[`**/*.{${extensions.join(",")}}`] = async (filenames: ReadonlyArray<string>) => {
            const { default: createEslintCommands } = await import("./eslint/create-eslint-commands");

            return [
                ...(hasPrettier ? [`${packageManager} exec prettier --write ${concatFiles(filenames)}`] : []),
                ...(await createEslintCommands(packageManager, packageJson, eslintConfig, filenames)),
            ];
        };
    }

    if (config.json !== false && hasPackageJsonAnyDependency(packageJson, ["sort-package-json"])) {
        loadedPlugins["**/package.json"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec sort-package-json ${concatFiles(filenames)}`];
    }

    if (hasMarkdownCli && config.markdown !== false) {
        loadedPlugins = {
            ...loadedPlugins,
            "**/*.md": (filenames: ReadonlyArray<string>) => [
                ...(hasPrettier ? [`${packageManager} exec prettier --write ${concatFiles(filenames)}`] : []),
                `${packageManager} exec markdownlint --fix --ignore '**/node_modules/**' --ignore '**/CHANGELOG.md' ${concatFiles(filenames)}`,
                ...(hasMarkdownCli2
                    ? [`${packageManager} exec markdownlint-cli2 --fix '!**/node_modules/**' '!**/CHANGELOG.md' ${concatFiles(filenames)}`]
                    : []),
            ],
            "**/*.mdx": (filenames: ReadonlyArray<string>) => [...(hasPrettier ? [`${packageManager} exec prettier --write ${concatFiles(filenames)}`] : [])],
        };
    }

    if (config.secretlint !== false && hasPackageJsonAnyDependency(packageJson, ["secretlint"])) {
        loadedPlugins["**/*"] = (filenames: ReadonlyArray<string>) => [`${packageManager} exec secretlint ${concatFiles(filenames)}`];
    }

    if (config.stylesheets !== false && hasPackageJsonAnyDependency(packageJson, ["stylelint"])) {
        const stylesheetsConfig: StylesheetsConfig = config.stylesheets;
        const { extensions } = stylesheetsConfig;

        if (!Array.isArray(extensions) || extensions.length === 0) {
            throw new Error("The `extensions` option is required for the Stylesheets configuration.");
        }

        loadedPlugins[`**/*.{${extensions.join(",")}}`] = (filenames: ReadonlyArray<string>) => [
            ...(hasPrettier ? [`${packageManager} exec prettier --ignore-unknown --write ${concatFiles(filenames)}`] : []),
            `${packageManager} exec stylelint --fix`,
        ];
    }

    if (config.typescript !== false && hasPackageJsonAnyDependency(packageJson, ["typescript"])) {
        const typescriptConfig: TypescriptConfig = config.typescript;
        const { extensions } = typescriptConfig;

        if (!Array.isArray(extensions) || extensions.length === 0) {
            throw new Error("The `extensions` option is required for the TypeScript configuration.");
        }

        loadedPlugins[`**/*.{${extensions.join(",")}}`] = (
            filenames: ReadonlyArray<string>,
        ): string[] => {
            const commands = new Set<string>();

            filenames.forEach((filePath) => {
                const { exclude } = typescriptConfig;

                if (Array.isArray(exclude) && exclude.some((value) => filePath.includes(value))) {
                    return;
                }

                if (!isAbsolutePath(filePath)) {
                    return;
                }

                try {
                    const tsconfigPath = getNearestConfigPath("tsconfig.json", filePath);

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
