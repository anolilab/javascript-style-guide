import { FlatConfigComposer } from "eslint-flat-config-utils";
import type { Awaitable, OptionsConfig, TypedFlatConfigItem, ConfigNames } from "./types";
import type { Linter } from "eslint";
import isInEditorEnv from "./utils/is-in-editor";
import interopDefault from "./utils/interop-default";
import type { RuleOptions } from "./typegen";
import { hasPackageJsonAnyDependency, parsePackageJson } from "@visulima/package";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import yaml from "./config/plugins/yml";
import toml from "./config/plugins/toml";
import markdown from "./config/plugins/markdown";
import comments from "./config/plugins/comments";
import node from "./config/plugins/node";
import jsdoc from "./config/plugins/jsdoc";
import imports from "./config/plugins/imports";
import perfectionist from "./config/plugins/perfectionist";
import unicorn from "./config/plugins/unicorn";
import { getFilesGlobs } from "./utils/create-config";
import stylistic from "./config/plugins/stylistic";
import react from "./config/plugins/react";
import regexp from "./config/plugins/regexp";
import vitest from "./config/plugins/vitest";
// import typescript from "./config/plugins/typescript";
import jsonc from "./config/plugins/jsonc";
import antfu from "./config/plugins/antfu";
import compat from "./config/plugins/compat";
import html from "./config/plugins/html";
import jsxA11y from "./config/plugins/jsx-a11y";
import noSecrets from "./config/plugins/no-secrets";
import noUnsanitized from "./config/plugins/no-unsanitized";
import playwright from "./config/plugins/playwright";
import promise from "./config/plugins/promise";
import simpleImportSort from "./config/plugins/simple-import-sort";
import sonarjs from "./config/plugins/sonarjs";
import storybook from "./config/plugins/storybook";
import tailwindcss from "./config/plugins/tailwindcss";
import tanstackQuery from "./config/plugins/tanstack-query";
import tsdoc from "./config/plugins/tsdoc";
import validateJsxNesting from "./config/plugins/validate-jsx-nesting";
import bestPractices from "./config/best-practices";
import variables from "./config/variables";
import style from "./config/style";
import errors from "./config/errors";

const flatConfigProps = ["name", "languageOptions", "linterOptions", "processor", "plugins", "rules", "settings"] satisfies (keyof TypedFlatConfigItem)[];

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export const resolveSubOptions = <K extends keyof OptionsConfig>(options: OptionsConfig, key: K): ResolvedOptions<OptionsConfig[K]> => {
    return typeof options[key] === "boolean" ? ({} as any) : options[key] || {};
};

export const getOverrides = <K extends keyof OptionsConfig>(options: OptionsConfig, key: K): Partial<Linter.RulesRecord & RuleOptions> => {
    const sub = resolveSubOptions(options, key);

    return {
        ...(options.overrides as any)?.[key],
        ...("overrides" in sub ? sub.overrides : {}),
    };
};

export const getFiles = <K extends keyof OptionsConfig>(options: OptionsConfig, key: K): string[] | undefined => {
    const sub = resolveSubOptions(options, key);

    if ("files" in sub) {
        if (typeof sub.files === "string") {
            return [sub.files];
        }

        return sub.files;
    }

    return undefined;
};

/**
 * Construct an array of ESLint flat config items.
 *
 * @param {OptionsConfig & TypedFlatConfigItem} options
 *  The options for generating the ESLint configurations.
 * @param {Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]} userConfigs
 *  The user configurations to be merged with the generated configurations.
 * @returns {Promise<TypedFlatConfigItem[]>}
 *  The merged ESLint configurations.
 */
export const createConfig = async (
    options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
    ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): Promise<FlatConfigComposer<TypedFlatConfigItem, ConfigNames>> => {
    if ("files" in options) {
        throw new Error(
            '[@anolilab/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
        );
    }

    const cwd = options.cwd ?? process.cwd();

    const packageJson = parsePackageJson(readFileSync(join(cwd, "package.json"), "utf-8"));

    const enablePrettier = hasPackageJsonAnyDependency(packageJson, ["prettier"]);

    const {
        html: enableHtml = false,
        playwright: enablePlaywright = false,
        storybook: enableStorybook = false,
        tailwindcss: enableTailwindCss = false,
        tanstack: enableTanstack = false,
        tsdoc: enableTsdoc = false,
        astro: enableAstro = false,
        autoRenamePlugins = true,
        componentExts = [],
        gitignore: enableGitignore = true,
        jsx: enableJsx = true,
        react: enableReact = false,
        regexp: enableRegexp = true,
        solid: enableSolid = false,
        svelte: enableSvelte = false,
        typescript: enableTypeScript = hasPackageJsonAnyDependency(packageJson, ["typescript"]),
        unicorn: enableUnicorn = true,
        unocss: enableUnoCSS = false,
        test: enableTest = true,
    } = options;

    let isInEditor = options.isInEditor;

    if (isInEditor == null) {
        isInEditor = isInEditorEnv();

        if (isInEditor) {
            // eslint-disable-next-line no-console
            console.log("[@anolilab/eslint-config] Detected running in editor, some rules are disabled.");
        }
    }

    const stylisticOptions = options.stylistic === false ? false : typeof options.stylistic === "object" ? options.stylistic : {};

    if (stylisticOptions && !("jsx" in stylisticOptions)) {
        stylisticOptions.jsx = enableJsx;
    }

    const configs: Awaitable<TypedFlatConfigItem[]>[] = [];

    if (enableGitignore) {
        if (typeof enableGitignore !== "boolean") {
            configs.push(
                interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
                    r({
                        name: "anolilab/gitignore",
                        ...enableGitignore,
                    }),
                ]),
            );
        } else {
            configs.push(
                interopDefault(import("eslint-config-flat-gitignore")).then((r) => [
                    r({
                        name: "anolilab/gitignore",
                        strict: false,
                    }),
                ]),
            );
        }
    }

    const typescriptOptions = resolveSubOptions(options, "typescript");
    const tsconfigPath = "tsconfigPath" in typescriptOptions ? typescriptOptions.tsconfigPath : undefined;

    // Base configs
    configs.push(
        // ignores(options.ignores),
        bestPractices({}),
        errors({}),
        style({}),
        variables({}),
        comments({
            files: getFiles(options, "comments"),
            overrides: getOverrides(options, "comments"),
        }),
        node({
            files: getFiles(options, "node"),
            overrides: getOverrides(options, "node"),
            packageJson,
        }),
        jsdoc({
            stylistic: stylisticOptions,
            files: getFiles(options, "jsdoc"),
            // overrides: getFiles(options, "jsdoc"),
            packageJson,
        }),
        imports({
            stylistic: stylisticOptions,
            overrides: getOverrides(options, "imports"),
            packageJson,
            cwd,
            files: getFiles(options, "imports"),
            tsconfigPath,
        }),
        simpleImportSort({
            overrides: getOverrides(options, "simpleImportSort"),
            files: getFiles(options, "simpleImportSort"),
        }),
        antfu({
            overrides: getOverrides(options, "antfu"),
            files: getFiles(options, "antfu"),
            packageJson,
            lessOpinionated: options.lessOpinionated,
        }),
        compat({
            files: getFiles(options, "compat"),
        }),
        noSecrets({
            overrides: getOverrides(options, "noSecrets"),
        }),
        noUnsanitized({
            overrides: getOverrides(options, "noUnsanitized"),
        }),
        promise({
            overrides: getOverrides(options, "promise"),
            files: getFiles(options, "promise"),
        }),
        sonarjs({
            overrides: getOverrides(options, "sonarjs"),
            files: getFiles(options, "sonarjs"),
        }),
        perfectionist({
            overrides: getOverrides(options, "perfectionist"),
            files: getFiles(options, "perfectionist"),
            packageJson,
        }),
    );
    //
    if (enableUnicorn) {
        configs.push(
            unicorn({
                overrides: getOverrides(options, "unicorn"),
                files: getFiles(options, "unicorn"),
                stylistic: stylisticOptions,
                prettier: enablePrettier,
                packageJson,
            }),
        );
    }

    if (enableJsx) {
        configs.push([
            {
                files: getFilesGlobs("jsx_and_tsx"),
                languageOptions: {
                    parserOptions: {
                        ecmaFeatures: {
                            jsx: true,
                        },
                    },
                },
                name: "anolilab/jsx/setup",
            },
        ]);
        configs.push(
            jsxA11y({
                overrides: getOverrides(options, "jsx-a11y"),
                files: getFiles(options, "jsx-a11y"),
            }),
        );
        configs.push(
            validateJsxNesting({
                overrides: getOverrides(options, "validateJsxNesting"),
                files: getFiles(options, "validateJsxNesting"),
            }),
        );
    }

    // if (enableTypeScript) {
    //     configs.push(
    //         typescript({
    //             ...typescriptOptions,
    //             componentExts,
    //             overrides: getOverrides(options, "typescript"),
    //             type: options.type,
    //         }),
    //     );
    // }

    if (stylisticOptions) {
        configs.push(
            stylistic({
                ...stylisticOptions,
                overrides: getOverrides(options, "stylistic"),
            }),
        );
    }

    if (enableRegexp) {
        configs.push(regexp(typeof enableRegexp === "boolean" ? {} : enableRegexp));
    }

    if (enableTest) {
        configs.push(
            vitest({
                isInEditor,
                overrides: getOverrides(options, "test"),
                files: getFiles(options, "test"),
                prettier: enablePrettier,
            }),
        );
    }

    if (enablePlaywright) {
        configs.push(
            playwright({
                overrides: getOverrides(options, "playwright"),
                files: getFiles(options, "playwright"),
            }),
        );
    }

    if (enableStorybook) {
        configs.push(
            storybook({
                overrides: getOverrides(options, "storybook"),
            }),
        );
    }

    if (enableTailwindCss) {
        configs.push(
            tailwindcss({
                overrides: getOverrides(options, "tailwind"),
            }),
        );
    }

    if (enableTanstack) {
        configs.push(
            tanstackQuery({
                overrides: getOverrides(options, "tanstack"),
                files: getFiles(options, "tanstack"),
            }),
        );
    }

    if (enableHtml) {
        configs.push(
            html({
                overrides: getOverrides(options, "html"),
                files: getFiles(options, "html"),
                prettier: enablePrettier,
                stylistic: stylisticOptions,
            }),
        );
    }

    if (enableTsdoc) {
        configs.push(
            tsdoc({
                overrides: getOverrides(options, "tsdoc"),
                files: getFiles(options, "tsdoc"),
            }),
        );
    }

    if (enableReact) {
        configs.push(
            react({
                ...typescriptOptions,
                overrides: getOverrides(options, "react"),
                tsconfigPath,
            }),
        );
    }

    // if (enableUnoCSS) {
    //     configs.push(
    //         unocss({
    //             ...resolveSubOptions(options, "unocss"),
    //             overrides: getOverrides(options, "unocss"),
    //         }),
    //     );
    // }

    // if (enableAstro) {
    //     configs.push(
    //         astro({
    //             overrides: getOverrides(options, "astro"),
    //             stylistic: stylisticOptions,
    //         }),
    //     );
    // }

    if (options.jsonc ?? true) {
        configs.push(
            jsonc({
                overrides: getOverrides(options, "jsonc"),
                stylistic: stylisticOptions,
                prettier: enablePrettier,
                packageJson,
            }),
        );
    }

    if (options.toml ?? true) {
        configs.push(
            toml({
                overrides: getOverrides(options, "toml"),
                stylistic: stylisticOptions,
                files: getFiles(options, "toml"),
            }),
        );
    }

    if (options.markdown ?? true) {
        configs.push(
            markdown({
                componentExts,
                overrides: getOverrides(options, "markdown"),
                files: getFiles(options, "markdown"),
            }),
        );
    }

    if (options.yaml ?? true) {
        configs.push(
            yaml({
                overrides: getOverrides(options, "yaml"),
                stylistic: stylisticOptions,
                prettier: enablePrettier,
                files: getFiles(options, "yaml"),
            }),
        );
    }

    // User can optionally pass a flat config item to the first argument
    // We pick the known keys as ESLint would do schema validation
    const fusedConfig = flatConfigProps.reduce((acc, key) => {
        if (key in options) acc[key] = options[key] as any;
        return acc;
    }, {} as TypedFlatConfigItem);

    if (Object.keys(fusedConfig).length) {
        configs.push([fusedConfig]);
    }

    let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

    composer = composer.append(...configs, ...(userConfigs as any));

    // if (autoRenamePlugins) {
    //     composer = composer.renamePlugins(defaultPluginRenaming);
    // }

    return composer;
};
