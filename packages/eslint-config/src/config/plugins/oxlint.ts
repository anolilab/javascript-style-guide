import { existsSync, readFileSync, statSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, isAbsolute, join, resolve as resolvePath } from "node:path";

import type { OptionsOverrides, TypedFlatConfigItem } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";
import reactDoctorEslintCounterparts from "./oxlint-react-doctor";

const OXLINT_CONFIG_FILENAME = ".oxlintrc.json";

/** eslint-plugin-oxlint is loosely typed; describe the parts we use. */
type OxlintPlugin = {
    buildFromOxlintConfigFile: (file: string) => TypedFlatConfigItem[];
    configs: Record<string, TypedFlatConfigItem[] | undefined>;
};

/** Checks that the loaded module actually exposes the parts of `eslint-plugin-oxlint` used here. */
const isOxlintPlugin = (value: unknown): value is OxlintPlugin =>
    typeof value === "object" &&
    value !== null &&
    "buildFromOxlintConfigFile" in value &&
    typeof value.buildFromOxlintConfigFile === "function" &&
    "configs" in value &&
    typeof value.configs === "object" &&
    value.configs !== null;

/** The parts of an `.oxlintrc.json` that decide which rules oxlint runs through a JS plugin. */
type OxlintFileRules = {
    extends?: string[];
    jsPlugins?: (string | { name: string; specifier: string })[];
    rules?: Record<string, OxlintRuleSetting>;
};

type OxlintRuleSetting = string | number | ReadonlyArray<unknown>;

const isOxlintFileRules = (value: unknown): value is OxlintFileRules => typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Reads an oxlint config together with every config it `extends`, the extending file winning.
 * A consumer usually extends the shared config, so the JS-plugin rules live in the parent.
 */
const readOxlintFile = (file: string, seen: ReadonlySet<string> = new Set()): OxlintFileRules => {
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));

    if (!isOxlintFileRules(parsed)) {
        return {};
    }

    const merged: Required<OxlintFileRules> = { extends: [], jsPlugins: [], rules: {} };

    const parents = parsed.extends ?? [];

    for (const parent of parents) {
        const parentFile = parent.startsWith(".") || isAbsolute(parent) ? resolvePath(dirname(file), parent) : createRequire(file).resolve(parent);

        if (!seen.has(parentFile)) {
            const inherited = readOxlintFile(parentFile, new Set([...seen, file]));

            merged.jsPlugins.push(...(inherited.jsPlugins ?? []));
            Object.assign(merged.rules, inherited.rules);
        }
    }

    merged.jsPlugins.push(...(parsed.jsPlugins ?? []));
    Object.assign(merged.rules, parsed.rules);

    return merged;
};

/**
 * JS plugins whose rule names match the ESLint plugin of the same name, so an enabled oxlint rule
 * means the ESLint rule of that name is redundant. Other JS plugins are mapped explicitly.
 */
const SAME_NAME_JS_PLUGINS = new Set(["eslint-comments", "no-secrets", "regexp", "sonarjs"]);

/**
 * Turns off the ESLint rules the oxlint file runs through a JS plugin. eslint-plugin-oxlint only
 * covers native oxlint rules, and a JS-plugin rule shares its name with the ESLint rule, so
 * without this both tools would report it. Rules the file already turns off are left alone.
 * An ESLint rule is only turned off when its plugin prefix is in `loadedRulePrefixes`; turning off
 * a rule of a plugin that is not loaded makes ESLint fail to build the config.
 */
const eslintCounterpartOf = (rule: string, loadedRulePrefixes: ReadonlySet<string>): string | undefined => {
    const counterpart = reactDoctorEslintCounterparts[rule];

    if (counterpart !== undefined) {
        const prefix = counterpart.includes("/") ? counterpart.slice(0, counterpart.indexOf("/")) : "";

        return loadedRulePrefixes.has(prefix) ? counterpart : undefined;
    }

    const separator = rule.indexOf("/");

    return separator !== -1 && SAME_NAME_JS_PLUGINS.has(rule.slice(0, separator)) ? rule : undefined;
};

const jsPluginRuleOverrides = (oxlintFile: OxlintFileRules, loadedRulePrefixes: ReadonlySet<string>): Record<string, "off"> => {
    const overrides: Record<string, "off"> = {};
    const enabledRules = Object.entries(oxlintFile.rules ?? {});

    for (const [rule, setting] of enabledRules) {
        const severity = Array.isArray(setting) ? setting[0] : setting;
        const eslintRule = severity === "off" || severity === 0 ? undefined : eslintCounterpartOf(rule, loadedRulePrefixes);

        if (eslintRule !== undefined) {
            overrides[eslintRule] = "off";
        }
    }

    return overrides;
};

/**
 * Caches the disable-set computed from an oxlint config file, keyed on the file's modification
 * time, so the file is only re-read and re-processed when it changes.
 */
const configFileCache = new Map<string, { configs: TypedFlatConfigItem[]; mtimeMs: number }>();

/** Resolves an explicit or auto-discovered `.oxlintrc.json`, returning it only if it exists. */
const resolveConfigFile = (configFile: string | undefined, cwd: string): string | undefined => {
    let candidate: string;

    if (configFile === undefined) {
        candidate = join(cwd, OXLINT_CONFIG_FILENAME);
    } else if (isAbsolute(configFile)) {
        candidate = configFile;
    } else {
        candidate = join(cwd, configFile);
    }

    return existsSync(candidate) ? candidate : undefined;
};

/** Builds the disable-set from an oxlint config file, reusing the cache while its mtime is unchanged. */
const buildFromFileCached = (plugin: OxlintPlugin, file: string): TypedFlatConfigItem[] => {
    const { mtimeMs } = statSync(file);
    const cached = configFileCache.get(file);

    if (cached?.mtimeMs === mtimeMs) {
        return cached.configs;
    }

    const configs = plugin.buildFromOxlintConfigFile(file);

    configFileCache.set(file, { configs, mtimeMs });

    return configs;
};

export interface OptionsOxlint extends OptionsOverrides {
    /**
     * Path to the oxlint config file (`.oxlintrc.json`), absolute or relative to `cwd`.
     * When set (or when one is auto-discovered in `cwd`), only the rules that config actually
     * enables are disabled in ESLint, so ESLint keeps checking everything oxlint does not run.
     * The computed result is cached until the file's modification time changes.
     * @see https://github.com/oxc-project/eslint-plugin-oxlint?tab=readme-ov-file#usage-with-oxlintrc
     */
    configFile?: string;

    /**
     * Working directory used to auto-discover a `.oxlintrc.json` when `configFile` is not set.
     * @default process.cwd()
     */
    cwd?: string;

    /**
     * ESLint rule prefixes whose plugin is loaded in this config (`""` for core rules). Set by
     * `createConfig` from the enabled framework options. An oxlint rule that counts as an ESLint
     * counterpart only turns off its ESLint rule when that prefix is listed here.
     * @default Core rules only, so no framework counterpart is turned off unless the caller lists its prefix.
     */
    loadedRulePrefixes?: string[];

    /**
     * Fallback used only when no oxlint config file is found.
     * - `"all"` (default) disables every ESLint rule that oxlint supports.
     * - `"recommended"` disables only the rules in oxlint's recommended set.
     *
     * Prefer a config file: `"all"` turns off rules oxlint may not actually run, leaving them
     * checked by neither linter.
     * @default "all"
     */
    mode?: "all" | "recommended";
}

// @see https://github.com/oxc-project/eslint-plugin-oxlint
export default createConfig<OptionsOxlint>("all", async (config) => {
    const { configFile, cwd = process.cwd(), loadedRulePrefixes = [], mode = "all", overrides } = config;

    const oxlintPlugin: unknown = await interopDefault(import("eslint-plugin-oxlint"));

    if (!isOxlintPlugin(oxlintPlugin)) {
        throw new TypeError("[@anolilab/eslint-config] eslint-plugin-oxlint does not expose `buildFromOxlintConfigFile` and `configs`.");
    }

    const resolvedConfigFile = resolveConfigFile(configFile, cwd);

    const fallbackKey = mode === "recommended" ? "flat/recommended" : "flat/all";

    const baseConfigs = resolvedConfigFile ? buildFromFileCached(oxlintPlugin, resolvedConfigFile) : (oxlintPlugin.configs[fallbackKey] ?? []);
    const jsPluginOverrides = resolvedConfigFile ? jsPluginRuleOverrides(readOxlintFile(resolvedConfigFile), new Set(["", ...loadedRulePrefixes])) : {};
    const extraRules = { ...jsPluginOverrides, ...overrides };

    if (Object.keys(extraRules).length === 0) {
        return baseConfigs;
    }

    return [
        ...baseConfigs,
        {
            name: "anolilab/oxlint/overrides",
            rules: extraRules,
        },
    ];
});

export { jsPluginRuleOverrides };
