import type { OptionsOverrides, TypedFlatConfigItem } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export interface OptionsOxlint extends OptionsOverrides {
    /**
     * Path to the oxlint config file (.oxlintrc.json).
     * When provided, only the rules enabled in that config are disabled in ESLint, so ESLint and
     * oxlint never report the same rule twice. Takes precedence over `mode`.
     * @see https://github.com/oxc-project/eslint-plugin-oxlint?tab=readme-ov-file#usage-with-oxlintrc
     */
    configFile?: string;

    /**
     * Which set of oxlint-covered rules to turn off in ESLint when no `configFile` is given.
     * - `"all"` (default) disables every ESLint rule that oxlint supports, so oxlint owns them.
     * - `"recommended"` disables only the rules in oxlint's recommended set.
     * @default "all"
     */
    mode?: "all" | "recommended";
}

// @see https://github.com/oxc-project/eslint-plugin-oxlint
export default createConfig<OptionsOxlint>("all", async (config) => {
    const { configFile, mode = "all", overrides } = config;

    const oxlintPlugin = await interopDefault(import("eslint-plugin-oxlint"));

    const modeConfigKey = mode === "recommended" ? "flat/recommended" : "flat/all";

    const baseConfigs = (configFile
        ? oxlintPlugin.buildFromOxlintConfigFile(configFile)
        : oxlintPlugin.configs[modeConfigKey]) as unknown as TypedFlatConfigItem[];

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
