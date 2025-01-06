import type { OptionsUnoCSS, TypedFlatConfigItem } from "../../types";
import interopDefault from "../../utils/interop-default";

const unocss = async (options: OptionsUnoCSS): Promise<TypedFlatConfigItem[]> => {
    const { attributify = true, strict = false } = options;

    const pluginUnoCSS = await interopDefault(import("@unocss/eslint-plugin"));

    return [
        {
            name: "anolilab/unocss",
            plugins: {
                unocss: pluginUnoCSS,
            },
            rules: {
                "unocss/order": "warn",
                ...attributify
                    ? {
                        "unocss/order-attributify": "warn",
                    }
                    : {},
                ...strict
                    ? {
                        "unocss/blocklist": "error",
                    }
                    : {},
            },
        },
    ];
};

export default unocss;
