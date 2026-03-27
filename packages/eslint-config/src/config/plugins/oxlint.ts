import type { OptionsOverrides, TypedFlatConfigItem } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export interface OptionsOxlint extends OptionsOverrides {
    /**
     * Path to the oxlint config file (.oxlintrc.json).
     * When provided, only the rules listed in the config will be disabled in ESLint.
     * @see https://github.com/oxc-project/eslint-plugin-oxlint?tab=readme-ov-file#usage-with-oxlintrc
     */
    configFile?: string;
}

// @see https://github.com/oxc-project/eslint-plugin-oxlint
export default createConfig<OptionsOxlint>("all", async (config) => {
    const { configFile, overrides } = config;

    const oxlintPlugin = await interopDefault(import("eslint-plugin-oxlint"));

    const baseConfigs = (configFile
        ? oxlintPlugin.buildFromOxlintConfigFile(configFile)
        : oxlintPlugin.configs["flat/recommended"]) as unknown as TypedFlatConfigItem[];

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
