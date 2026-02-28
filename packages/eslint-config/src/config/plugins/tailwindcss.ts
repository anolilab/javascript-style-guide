import type { OptionsFiles, OptionsOverrides, TypedFlatConfigItem } from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

// @see https://github.com/francoismassart/eslint-plugin-tailwindcss,
export default createConfig<OptionsFiles & OptionsOverrides>("jsx_and_tsx", async (config, oFiles) => {
    const { files = oFiles, overrides } = config;

    const validateJsxNestingPlugin = await interopDefault(import("eslint-plugin-tailwindcss"));

    const options = [...validateJsxNestingPlugin.configs["flat/recommended"]] as TypedFlatConfigItem[];

    if (options[1]) {
        options[1].files = files;
        options[1].rules = {
            ...options[1].rules,
            ...overrides,
        };
    }

    return options as unknown as Omit<TypedFlatConfigItem, "files">[];
});
