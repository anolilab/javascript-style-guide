import { FlatConfigComposer } from "eslint-flat-config-utils";
import type { Awaitable, OptionsConfig, TypedFlatConfigItem, ConfigNames } from "./types";
import type { Linter } from "eslint";
import isInEditorEnv from "./utils/is-in-editor";
import interopDefault from "./utils/interop-default";
import type { RuleOptions } from "./typegen";
import { hasPackageJsonAnyDependency, parsePackageJson } from "@visulima/package";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const flatConfigProps = ["name", "languageOptions", "linterOptions", "processor", "plugins", "rules", "settings"] satisfies (keyof TypedFlatConfigItem)[];

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): ResolvedOptions<OptionsConfig[K]> {
    return typeof options[key] === "boolean" ? ({} as any) : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): Partial<Linter.RulesRecord & RuleOptions> {
    const sub = resolveSubOptions(options, key);

    return {
        ...(options.overrides as any)?.[key],
        ...("overrides" in sub ? sub.overrides : {}),
    };
}

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
export const createConfig = (
    options: OptionsConfig & Omit<TypedFlatConfigItem, "files"> = {},
    ...userConfigs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[] | FlatConfigComposer<any, any> | Linter.Config[]>[]
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> => {
    if ("files" in options) {
        throw new Error(
            '[@anolilab/eslint-config] The first argument should not contain the "files" property as the options are supposed to be global. Place it in the second or later config instead.',
        );
    }

    const cwd = options.cwd ?? process.cwd();

    const packageJson = parsePackageJson(readFileSync(join(cwd, "package.json"), "utf-8"));

    const enablePrettier = hasPackageJsonAnyDependency(packageJson, ["prettier"]);

    const {
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
