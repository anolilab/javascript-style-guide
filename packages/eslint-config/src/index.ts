import { readFileSync } from "node:fs";
import { join } from "node:path";

import { hasPackageJsonAnyDependency, parsePackageJson } from "@visulima/package";
import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";

import bestPractices from "./config/best-practices";
import errors from "./config/errors";
import ignores from "./config/ignores";
import antfu from "./config/plugins/antfu";
import comments from "./config/plugins/comments";
import compat from "./config/plugins/compat";
import html from "./config/plugins/html";
import imports from "./config/plugins/imports";
import javascript from "./config/plugins/javascript";
import jsdoc from "./config/plugins/jsdoc";
import jsonc from "./config/plugins/jsonc";
import jsxA11y from "./config/plugins/jsx-a11y";
import markdown from "./config/plugins/markdown";
import noSecrets from "./config/plugins/no-secrets";
import noUnsanitized from "./config/plugins/no-unsanitized";
import node from "./config/plugins/node";
import perfectionist from "./config/plugins/perfectionist";
import playwright from "./config/plugins/playwright";
import promise from "./config/plugins/promise";
import react from "./config/plugins/react";
import regexp from "./config/plugins/regexp";
import simpleImportSort from "./config/plugins/simple-import-sort";
import sonarjs from "./config/plugins/sonarjs";
import storybook from "./config/plugins/storybook";
import stylistic from "./config/plugins/stylistic";
import tailwindcss from "./config/plugins/tailwindcss";
import tanstackQuery from "./config/plugins/tanstack-query";
import toml from "./config/plugins/toml";
import tsdoc from "./config/plugins/tsdoc";
import typescript from "./config/plugins/typescript";
import unicorn from "./config/plugins/unicorn";
import validateJsxNesting from "./config/plugins/validate-jsx-nesting";
import vitest from "./config/plugins/vitest";
import yaml from "./config/plugins/yml";
import style from "./config/style";
import variables from "./config/variables";
import type { RuleOptions } from "./typegen";
import type {
    Awaitable,
    ConfigNames,
    OptionsConfig,
    TypedFlatConfigItem,
} from "./types";
import { getFilesGlobs } from "./utils/create-config";
import interopDefault from "./utils/interop-default";
import isInEditorEnv from "./utils/is-in-editor";

const flatConfigProps = ["name", "languageOptions", "linterOptions", "processor", "plugins", "rules", "settings"] satisfies (keyof TypedFlatConfigItem)[];

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export const resolveSubOptions = <K extends keyof OptionsConfig>(options: OptionsConfig, key: K): ResolvedOptions<OptionsConfig[K]> => {
    return typeof options[key] === "boolean" ? ({} as any) : options[key] || {};
};

export const getOverrides = <K extends keyof OptionsConfig>(options: OptionsConfig, key: K): Partial<Linter.RulesRecord & RuleOptions> => {
    const sub = resolveSubOptions(options, key);

    return {
        ...(options.overrides as any)?.[key],
        ..."overrides" in sub ? sub.overrides : {},
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
    options: Omit<TypedFlatConfigItem, "files"> & OptionsConfig = {},
    ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): Promise<FlatConfigComposer<TypedFlatConfigItem, ConfigNames>> => {
    if ("files" in options) {
        throw new Error(
            "[@anolilab/eslint-config] The first argument should not contain the \"files\" property as the options are supposed to be global. Place it in the second or later config instead.",
        );
    }

    const cwd = options.cwd ?? process.cwd();

    const packageJson = parsePackageJson(readFileSync(join(cwd, "package.json"), "utf-8"));

    const enablePrettier = hasPackageJsonAnyDependency(packageJson, ["prettier"]);

    const {
        astro: enableAstro = false,
        componentExts = [],
        gitignore: enableGitignore = true,
        html: enableHtml = false,
        jsx: enableJsx = true,
        playwright: enablePlaywright = false,
        react: enableReact = hasPackageJsonAnyDependency(packageJson, ["react", "react-dom"]),
        regexp: enableRegexp = true,
        solid: enableSolid = false,
        storybook: enableStorybook = false,
        svelte: enableSvelte = false,
        tailwindcss: enableTailwindCss = false,
        tanstack: enableTanstack = false,
        test: enableTest = true,
        tsdoc: enableTsdoc = false,
        typescript: enableTypeScript = hasPackageJsonAnyDependency(packageJson, ["typescript"]),
        unicorn: enableUnicorn = true,
        unocss: enableUnoCSS = false,
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
                interopDefault(import("eslint-config-flat-gitignore")).then(r => [
                    r({
                        name: "anolilab/gitignore",
                        ...enableGitignore,
                    }),
                ]),
            );
        } else {
            configs.push(
                interopDefault(import("eslint-config-flat-gitignore")).then(r => [
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
        ignores(options.ignores),
        javascript({}),
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
            files: getFiles(options, "jsdoc"),
            // overrides: getFiles(options, "jsdoc"),
            packageJson,
            stylistic: stylisticOptions,
        }),
        imports({
            cwd,
            files: getFiles(options, "imports"),
            overrides: getOverrides(options, "imports"),
            packageJson,
            stylistic: stylisticOptions,
            tsconfigPath,
        }),
        simpleImportSort({
            files: getFiles(options, "simpleImportSort"),
            overrides: getOverrides(options, "simpleImportSort"),
        }),
        antfu({
            files: getFiles(options, "antfu"),
            lessOpinionated: options.lessOpinionated,
            overrides: getOverrides(options, "antfu"),
            packageJson,
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
            files: getFiles(options, "promise"),
            overrides: getOverrides(options, "promise"),
        }),
        sonarjs({
            files: getFiles(options, "sonarjs"),
            overrides: getOverrides(options, "sonarjs"),
        }),
        perfectionist({
            files: getFiles(options, "perfectionist"),
            overrides: getOverrides(options, "perfectionist"),
            packageJson,
        }),
    );

    if (enableUnicorn) {
        configs.push(
            unicorn({
                files: getFiles(options, "unicorn"),
                overrides: getOverrides(options, "unicorn"),
                packageJson,
                prettier: enablePrettier,
                stylistic: stylisticOptions,
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
                files: getFiles(options, "jsx-a11y"),
                overrides: getOverrides(options, "jsx-a11y"),
            }),
        );
        configs.push(
            validateJsxNesting({
                files: getFiles(options, "validateJsxNesting"),
                overrides: getOverrides(options, "validateJsxNesting"),
            }),
        );
    }

    if (enableTypeScript) {
        configs.push(
            typescript({
                ...typescriptOptions,
                componentExts,
                overrides: getOverrides(options, "typescript"),
                prettier: enablePrettier,
                stylistic: stylisticOptions,
            }),
        );
    }

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

    // if (enableTest) {
    //     configs.push(
    //         vitest({
    //             isInEditor,
    //             overrides: getOverrides(options, "test"),
    //             files: getFiles(options, "test"),
    //             prettier: enablePrettier,
    //         }),
    //     );
    // }

    if (enablePlaywright) {
        configs.push(
            playwright({
                files: getFiles(options, "playwright"),
                overrides: getOverrides(options, "playwright"),
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
                files: getFiles(options, "tanstack"),
                overrides: getOverrides(options, "tanstack"),
            }),
        );
    }

    if (enableHtml) {
        configs.push(
            html({
                files: getFiles(options, "html"),
                overrides: getOverrides(options, "html"),
                prettier: enablePrettier,
                stylistic: stylisticOptions,
            }),
        );
    }

    if (enableTsdoc) {
        configs.push(
            tsdoc({
                files: getFiles(options, "tsdoc"),
                overrides: getOverrides(options, "tsdoc"),
            }),
        );
    }

    if (enableReact) {
        configs.push(
            react({
                ...typescriptOptions,
                overrides: getOverrides(options, "react"),
                packageJson,
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
                packageJson,
                prettier: enablePrettier,
                stylistic: stylisticOptions,
            }),
        );
    }

    if (options.toml ?? true) {
        configs.push(
            toml({
                files: getFiles(options, "toml"),
                overrides: getOverrides(options, "toml"),
                stylistic: stylisticOptions,
            }),
        );
    }

    if (options.markdown ?? true) {
        configs.push(
            markdown({
                componentExts,
                files: getFiles(options, "markdown"),
                overrides: getOverrides(options, "markdown"),
            }),
        );
    }

    if (options.yaml ?? true) {
        configs.push(
            yaml({
                files: getFiles(options, "yaml"),
                overrides: getOverrides(options, "yaml"),
                prettier: enablePrettier,
                stylistic: stylisticOptions,
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
