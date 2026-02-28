import type { OptionsOverrides, TypedFlatConfigItem } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsOverrides>("storybook", async (config) => {
    const { overrides } = config;

    const storybookPlugin = await interopDefault(import("eslint-plugin-storybook"));

    const options = [...storybookPlugin.configs["flat/recommended"]] as TypedFlatConfigItem[];

    if (options[0]) {
        options[0].rules = {
            ...options[0].rules,
            ...overrides,
        };
    }

    return options as unknown as Omit<TypedFlatConfigItem, "files">[];
});
