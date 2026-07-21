import { existsSync, statSync } from "node:fs";
import { isAbsolute, join } from "node:path";

import type { OptionsOverrides, TypedFlatConfigItem } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

const OXLINT_CONFIG_FILENAME = ".oxlintrc.json";

/** eslint-plugin-oxlint is loosely typed; describe the parts we use. */
type OxlintPlugin = {
    buildFromOxlintConfigFile: (file: string) => TypedFlatConfigItem[];
    configs: Record<string, TypedFlatConfigItem[] | undefined>;
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
    const { configFile, cwd = process.cwd(), mode = "all", overrides } = config;

    const oxlintPlugin = (await interopDefault(import("eslint-plugin-oxlint"))) as unknown as OxlintPlugin;

    const resolvedConfigFile = resolveConfigFile(configFile, cwd);

    const fallbackKey = mode === "recommended" ? "flat/recommended" : "flat/all";

    const baseConfigs = resolvedConfigFile ? buildFromFileCached(oxlintPlugin, resolvedConfigFile) : (oxlintPlugin.configs[fallbackKey] ?? []);

    if (Object.keys(overrides ?? {}).length === 0) {
        return baseConfigs;
    }

    return [
        ...baseConfigs,
        {
            name: "anolilab/oxlint/overrides",
            rules: overrides,
        },
    ];
});
