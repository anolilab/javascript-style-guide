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
import youDontNeedLodashUnderscore from "./config/plugins/you-dont-need-lodash-underscore";
import style from "./config/style";
import variables from "./config/variables";
import type { RuleOptions } from "./typegen";
import type {
    Awaitable,
    ConfigNames,
    OptionsConfig,
    OptionsFiles,
    OptionsOverrides,
    StylisticConfig,
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

// eslint-disable-next-line no-secrets/no-secrets
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
    ...userConfigs: Awaitable<FlatConfigComposer<any, any> | Linter.Config[] | TypedFlatConfigItem | TypedFlatConfigItem[]>[]
    // eslint-disable-next-line sonarjs/cognitive-complexity
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
        lodash: enableLodash = hasPackageJsonAnyDependency(packageJson, [
            "lodash",
            "underscore",
            "lodash-es",
            "@types/lodash",

            "lodash.chunk",
            "lodash.compact",
            "lodash.concat",
            "lodash.difference",
            "lodash.differenceby",
            "lodash.differencewith",
            "lodash.drop",
            "lodash.dropright",
            "lodash.droprightwhile",
            "lodash.dropwhile",
            "lodash.fill",
            "lodash.findindex",
            "lodash.findlastindex",
            "lodash.flatten",
            "lodash.flattendeep",
            "lodash.flattendepth",
            "lodash.frompairs",
            "lodash.head",
            "lodash.indexof",
            "lodash.initial",
            "lodash.intersection",
            "lodash.intersectionby",
            "lodash.intersectionwith",
            "lodash.join",
            "lodash.last",
            "lodash.lastindexof",
            "lodash.nth",
            "lodash.pull",
            "lodash.pullall",
            "lodash.pullallby",
            "lodash.pullallwith",
            "lodash.pullat",
            "lodash.remove",
            "lodash.reverse",
            "lodash.slice",
            "lodash.sortedindex",
            "lodash.sortedindexby",
            "lodash.sortedindexof",
            "lodash.sortedlastindex",
            "lodash.sortedlastindexby",
            "lodash.sortedlastindexof",
            "lodash.sorteduniq",
            "lodash.sorteduniqby",
            "lodash.tail",
            "lodash.take",
            "lodash.takeright",
            "lodash.takerightwhile",
            "lodash.takewhile",
            "lodash.union",
            "lodash.unionby",
            "lodash.unionwith",
            "lodash.uniq",
            "lodash.uniqby",
            "lodash.uniqwith",
            "lodash.unzip",
            "lodash.unzipwith",
            "lodash.without",
            "lodash.xor",
            "lodash.xorby",
            "lodash.xorwith",
            "lodash.zip",
            "lodash.zipobject",
            "lodash.zipobjectdeep",
            "lodash.zipwith",
            "lodash.countby",
            "lodash.every",
            "lodash.filter",
            "lodash.find",
            "lodash.findlast",
            "lodash.flatmap",
            "lodash.flatmapdeep",
            "lodash.flatmapdepth",
            "lodash.foreach",
            "lodash.foreachright",
            "lodash.groupby",
            "lodash.includes",
            "lodash.invokemap",
            "lodash.keyby",
            "lodash.map",
            "lodash.orderby",
            "lodash.partition",
            "lodash.reduce",
            "lodash.reduceright",
            "lodash.reject",
            "lodash.sample",
            "lodash.samplesize",
            "lodash.shuffle",
            "lodash.size",
            "lodash.some",
            "lodash.sortby",
            "lodash.now",
            "lodash.after",
            "lodash.ary",
            "lodash.before",
            "lodash.bind",
            "lodash.bindkey",
            "lodash.curry",
            "lodash.curryright",
            "lodash.debounce",
            "lodash.defer",
            "lodash.delay",
            "lodash.flip",
            "lodash.memoize",
            "lodash.negate",
            "lodash.once",
            "lodash.overargs",
            "lodash.partial",
            "lodash.partialright",
            "lodash.rearg",
            "lodash.rest",
            "lodash.spread",
            "lodash.throttle",
            "lodash.unary",
            "lodash.wrap",
            "lodash.castarray",
            "lodash.clone",
            "lodash.clonedeep",
            "lodash.clonedeepwith",
            "lodash.clonewith",
            "lodash.conformsto",
            "lodash.eq",
            "lodash.gt",
            "lodash.gte",
            "lodash.isarguments",
            "lodash.isarray",
            "lodash.isarraybuffer",
            "lodash.isarraylike",
            "lodash.isarraylikeobject",
            "lodash.isboolean",
            "lodash.isbuffer",
            "lodash.isdate",
            "lodash.iselement",
            "lodash.isempty",
            "lodash.isequal",
            "lodash.isequalwith",
            "lodash.iserror",
            "lodash.isfinite",
            "lodash.isfunction",
            "lodash.isinteger",
            "lodash.islength",
            "lodash.ismap",
            "lodash.ismatch",
            "lodash.ismatchwith",
            "lodash.isnan",
            "lodash.isnative",
            "lodash.isnil",
            "lodash.isnull",
            "lodash.isnumber",
            "lodash.isobject",
            "lodash.isobjectlike",
            "lodash.isplainobject",
            "lodash.isregexp",
            "lodash.issafeinteger",
            "lodash.isset",
            "lodash.isstring",
            "lodash.issymbol",
            "lodash.istypedarray",
            "lodash.isundefined",
            "lodash.isweakmap",
            "lodash.isweakset",
            "lodash.lt",
            "lodash.lte",
            "lodash.toarray",
            "lodash.tofinite",
            "lodash.tointeger",
            "lodash.tolength",
            "lodash.tonumber",
            "lodash.toplainobject",
            "lodash.tosafeinteger",
            "lodash.tostring",
            "lodash.add",
            "lodash.ceil",
            "lodash.divide",
            "lodash.floor",
            "lodash.max",
            "lodash.maxby",
            "lodash.mean",
            "lodash.meanby",
            "lodash.min",
            "lodash.minby",
            "lodash.multiply",
            "lodash.round",
            "lodash.subtract",
            "lodash.sum",
            "lodash.sumby",
            "lodash.clamp",
            "lodash.inrange",
            "lodash.random",
            "lodash.assign",
            "lodash.assignin",
            "lodash.assigninwith",
            "lodash.assignwith",
            "lodash.at",
            "lodash.create",
            "lodash.defaults",
            "lodash.defaultsdeep",
            "lodash.findkey",
            "lodash.findlastkey",
            "lodash.forin",
            "lodash.forinright",
            "lodash.forown",
            "lodash.forownright",
            "lodash.functions",
            "lodash.functionsin",
            "lodash.get",
            "lodash.has",
            "lodash.hasin",
            "lodash.invert",
            "lodash.invertby",
            "lodash.invoke",
            "lodash.keys",
            "lodash.keysin",
            "lodash.mapkeys",
            "lodash.mapvalues",
            "lodash.merge",
            "lodash.mergewith",
            "lodash.omit",
            "lodash.omitby",
            "lodash.pick",
            "lodash.pickby",
            "lodash.result",
            "lodash.set",
            "lodash.setwith",
            "lodash.topairs",
            "lodash.topairsin",
            "lodash.transform",
            "lodash.unset",
            "lodash.update",
            "lodash.updatewith",
            "lodash.values",
            "lodash.valuesin",
            "lodash.chain",
            "lodash.tap",
            "lodash.thru",
            "lodash.camelcase",
            "lodash.capitalize",
            "lodash.deburr",
            "lodash.endswith",
            "lodash.escape",
            "lodash.escaperegexp",
            "lodash.kebabcase",
            "lodash.lowercase",
            "lodash.lowerfirst",
            "lodash.pad",
            "lodash.padend",
            "lodash.padstart",
            "lodash.parseint",
            "lodash.repeat",
            "lodash.replace",
            "lodash.snakecase",
            "lodash.split",
            "lodash.startcase",
            "lodash.startswith",
            "lodash.template",
            "lodash.tolower",
            "lodash.toupper",
            "lodash.trim",
            "lodash.trimend",
            "lodash.trimstart",
            "lodash.truncate",
            "lodash.unescape",
            "lodash.uppercase",
            "lodash.upperfirst",
            "lodash.words",
            "lodash.attempt",
            "lodash.bindall",
            "lodash.cond",
            "lodash.conforms",
            "lodash.constant",
            "lodash.defaultto",
            "lodash.flow",
            "lodash.flowright",
            "lodash.identity",
            "lodash.iteratee",
            "lodash.matches",
            "lodash.matchesproperty",
            "lodash.method",
            "lodash.methodof",
            "lodash.mixin",
            "lodash.noconflict",
            "lodash.noop",
            "lodash.ntharg",
            "lodash.over",
            "lodash.overevery",
            "lodash.oversome",
            "lodash.property",
            "lodash.propertyof",
            "lodash.range",
            "lodash.rangeright",
            "lodash.runincontext",
            "lodash.stubarray",
            "lodash.stubfalse",
            "lodash.stubobject",
            "lodash.stubstring",
            "lodash.stubtrue",
            "lodash.times",
            "lodash.topath",
            "lodash.uniqueid",
        ]),
        playwright: enablePlaywright = hasPackageJsonAnyDependency(packageJson, ["playwright", "eslint-plugin-playwright"]),
        react: enableReact = hasPackageJsonAnyDependency(packageJson, [
            "react",
            "react-dom",
            "eslint-plugin-react-hooks",
            "eslint-plugin-react-refresh",
            "@eslint-react/eslint-plugin",
        ]),
        regexp: enableRegexp = true,
        storybook: enableStorybook = hasPackageJsonAnyDependency(packageJson, ["storybook", "eslint-plugin-storybook"]),
        tailwindcss: enableTailwindCss = false,
        tanstack: enableTanstack = false,
        test: enableTest = hasPackageJsonAnyDependency(packageJson, ["vitest"]),
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

    let stylisticOptions: boolean | (OptionsFiles & OptionsOverrides & StylisticConfig) = {};

    if (options.stylistic === false) {
        stylisticOptions = false;
    } else if (typeof options.stylistic === "object") {
        stylisticOptions = options.stylistic;
    }

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
        javascript({
            packageJson,
        }),
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

    if (enableLodash) {
        configs.push(
            youDontNeedLodashUnderscore({
                files: getFiles(options, "lodash"),
                overrides: getOverrides(options, "lodash"),
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
                overrides: getOverrides(options, "tailwindcss"),
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
        if (key in options) {
            acc[key] = options[key] as any;
        }

        return acc;
    }, {} as TypedFlatConfigItem);

    if (Object.keys(fusedConfig).length) {
        configs.push([fusedConfig]);
    }

    let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

    composer = composer.append(...configs, ...(userConfigs as any));

    return composer;
};
