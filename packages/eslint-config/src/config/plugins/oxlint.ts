import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve as resolvePath } from "node:path";

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

type OxlintRuleSetting = string | number | ReadonlyArray<unknown>;

/** An `overrides` entry. `files` and `excludeFiles` are absolute glob patterns once read by `readOxlintFile`. */
type OxlintOverride = {
    excludeFiles?: string[];
    files?: string[];
    rules?: Record<string, OxlintRuleSetting>;
};

/** The parts of an `.oxlintrc.json` that decide which rules oxlint runs through a JS plugin. */
type OxlintFileRules = {
    extends?: string[];
    jsPlugins?: (string | { name: string; specifier: string })[];
    overrides?: OxlintOverride[];
    rules?: Record<string, OxlintRuleSetting>;
};

const isOxlintFileRules = (value: unknown): value is OxlintFileRules => typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Resolves an override's glob pattern against the directory of the file that declares it. A pattern
 * without a slash matches at any depth below that directory, as it does in oxlint.
 */
const anchorPattern = (pattern: string, directory: string): string => (pattern.includes("/") ? join(directory, pattern) : join(directory, "**", pattern));

const resolveOverride = (override: OxlintOverride, directory: string): OxlintOverride => {
    return {
        excludeFiles: override.excludeFiles?.map((pattern) => anchorPattern(pattern, directory)),
        files: override.files?.map((pattern) => anchorPattern(pattern, directory)),
        rules: override.rules,
    };
};

/**
 * Reads an oxlint config together with every config it `extends`, the extending file winning.
 * A consumer usually extends the shared config, so the JS-plugin rules live in the parent.
 */
const readOxlintFile = (file: string, seen: ReadonlySet<string> = new Set()): OxlintFileRules => {
    const parsed: unknown = JSON.parse(readFileSync(file, "utf8"));

    if (!isOxlintFileRules(parsed)) {
        return {};
    }

    const merged: Required<OxlintFileRules> = { extends: [], jsPlugins: [], overrides: [], rules: {} };

    const parents = parsed.extends ?? [];

    // oxlint resolves every `extends` value as a path relative to the file that declares it. A missing
    // parent is skipped here; eslint-plugin-oxlint reports it when it reads the same file.
    for (const parent of parents) {
        const parentFile = resolvePath(dirname(file), parent);

        if (!seen.has(parentFile) && existsSync(parentFile)) {
            const inherited = readOxlintFile(parentFile, new Set([...seen, file]));

            merged.jsPlugins.push(...(inherited.jsPlugins ?? []));
            Object.assign(merged.rules, inherited.rules);
            merged.overrides.push(...(inherited.overrides ?? []));
        }
    }

    merged.jsPlugins.push(...(parsed.jsPlugins ?? []));
    Object.assign(merged.rules, parsed.rules);
    merged.overrides.push(...(parsed.overrides ?? []).map((override) => resolveOverride(override, dirname(file))));

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

const isOff = (setting: OxlintRuleSetting): boolean => {
    const severity = Array.isArray(setting) ? setting[0] : setting;

    return severity === "off" || severity === 0;
};

/** `../` segments that a `**` follows, the only case where an ancestor pattern still matches below `cwd`. */
const ANCESTOR_SEGMENTS = /^(?:\.\.\/)+(?=\*\*(?:\/|$))/;

/** Expresses an absolute oxlint glob as a pattern relative to `cwd`, which is where ESLint resolves `files`. */
const toEslintPattern = (pattern: string, cwd: string): string => {
    const relativePattern = relative(cwd, pattern).replaceAll("\\", "/");

    // A `**` after `../` segments still covers everything below `cwd`. Any other `../` pattern points
    // outside `cwd`, and ESLint cannot match it, so it stays as it is.
    return relativePattern.replace(ANCESTOR_SEGMENTS, "");
};

/** ESLint rejects a present `ignores` that is not an array, so the key is left out when there is nothing to ignore. */
const ignoresOf = (ignores: string[] | undefined): { ignores?: string[] } => (ignores === undefined || ignores.length === 0 ? {} : { ignores });

const turnOffItem = (files: string[], eslintRule: string, ignores?: string[]): TypedFlatConfigItem => {
    return {
        files,
        ...ignoresOf(ignores),
        name: "anolilab/oxlint/js-plugins",
        rules: { [eslintRule]: "off" },
    };
};

/** The files an override applies to, and the files it excludes, as ESLint patterns. */
type OverrideScope = { excludeFiles: string[]; files: string[] };

type OverrideState = { disabledFiles: Record<string, string[]>; items: TypedFlatConfigItem[] };

/** What one override rule contributes: the items it adds, and the files where oxlint no longer runs the base rule. */
type RuleEffect = { disabledFiles: string[]; items: TypedFlatConfigItem[] };

const overrideRuleEffect = (eslintRule: string, setting: OxlintRuleSetting, scope: OverrideScope, baseOff: Record<string, "off">): RuleEffect => {
    if (!isOff(setting)) {
        return { disabledFiles: [], items: scope.files.length > 0 ? [turnOffItem(scope.files, eslintRule, scope.excludeFiles)] : [] };
    }

    // Oxlint still runs the base rule on the excluded files, so ESLint stays off there.
    const excluded = scope.excludeFiles.length > 0 && Object.hasOwn(baseOff, eslintRule) ? [turnOffItem(scope.excludeFiles, eslintRule)] : [];

    return { disabledFiles: scope.files, items: excluded };
};

const overrideTurnOffs = (oxlintFile: OxlintFileRules, loadedRulePrefixes: ReadonlySet<string>, cwd: string, baseOff: Record<string, "off">): OverrideState => {
    const state: OverrideState = { disabledFiles: {}, items: [] };
    const overrides = oxlintFile.overrides ?? [];

    for (const override of overrides) {
        const scope: OverrideScope = {
            excludeFiles: (override.excludeFiles ?? []).map((pattern) => toEslintPattern(pattern, cwd)),
            files: (override.files ?? []).map((pattern) => toEslintPattern(pattern, cwd)),
        };
        const rules = Object.entries(override.rules ?? {});

        for (const [rule, setting] of rules) {
            const eslintRule = eslintCounterpartOf(rule, loadedRulePrefixes);

            if (eslintRule !== undefined) {
                const effect = overrideRuleEffect(eslintRule, setting, scope, baseOff);

                state.items.push(...effect.items);
                state.disabledFiles[eslintRule] = [...(state.disabledFiles[eslintRule] ?? []), ...effect.disabledFiles];
            }
        }
    }

    return state;
};

/** One item per distinct ignore list, so rules that share an exclusion stay a single entry. */
const globalTurnOffItems = (baseOff: Record<string, "off">, disabledFiles: Record<string, string[]>): TypedFlatConfigItem[] => {
    const byIgnores = new Map<string, Record<string, "off">>();

    for (const eslintRule of Object.keys(baseOff)) {
        const ignores = [...new Set(disabledFiles[eslintRule])];
        const key = ignores.join("\n");
        const rules = byIgnores.get(key) ?? {};

        rules[eslintRule] = "off";
        byIgnores.set(key, rules);
    }

    return [...byIgnores].map(([key, rules]) => {
        return {
            files: ["**/*"],
            ...ignoresOf(key === "" ? undefined : key.split("\n")),
            name: "anolilab/oxlint/js-plugins",
            rules,
        };
    });
};

/**
 * Builds the ESLint items that turn off JS-plugin counterparts for the files oxlint runs them on.
 * A rule an override turns off stays on for that override's files, so those files are excluded
 * from the turn-off. A rule an override turns on gets a turn-off for that override's files.
 */
const jsPluginConfigItems = (oxlintFile: OxlintFileRules, loadedRulePrefixes: ReadonlySet<string>, cwd: string): TypedFlatConfigItem[] => {
    const baseOff = jsPluginRuleOverrides(oxlintFile, loadedRulePrefixes);
    const state = overrideTurnOffs(oxlintFile, loadedRulePrefixes, cwd, baseOff);

    return [...state.items, ...globalTurnOffItems(baseOff, state.disabledFiles)];
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
    const jsPluginItems = resolvedConfigFile ? jsPluginConfigItems(readOxlintFile(resolvedConfigFile), new Set(["", ...loadedRulePrefixes]), cwd) : [];

    if (overrides === undefined || Object.keys(overrides).length === 0) {
        return [...baseConfigs, ...jsPluginItems];
    }

    return [
        ...baseConfigs,
        ...jsPluginItems,
        {
            name: "anolilab/oxlint/overrides",
            rules: overrides,
        },
    ];
});

export { jsPluginConfigItems, jsPluginRuleOverrides };
