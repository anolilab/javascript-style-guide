import { createConfig } from "../../utils/create-config";
import type { OptionsOverrides, OptionsRegExp, OptionsFiles, TypedFlatConfigItem } from "../../types";

import { configs } from "eslint-plugin-regexp";

export default createConfig<OptionsRegExp & OptionsOverrides & OptionsFiles>("all", async (config, oFiles) => {
    const { overrides, level, files = oFiles } = config;
    const recommended = configs["flat/recommended"] as TypedFlatConfigItem;

    const rules = {
        ...recommended.rules,
    };

    if (level === "warn") {
        for (const key in rules) {
            if (rules[key] === "error") {
                rules[key] = "warn";
            }
        }
    }
    return [
        {
            ...recommended,
            files,
            name: "anolilab/regexp/rules",
            rules: {
                ...rules,
                ...overrides,
            },
        },
    ];
});
