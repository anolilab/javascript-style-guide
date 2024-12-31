import { configs } from "eslint-plugin-regexp";

import type {
    OptionsFiles,
    OptionsOverrides,
    OptionsRegExp,
    TypedFlatConfigItem,
} from "../../types";
import { createConfig } from "../../utils/create-config";

export default createConfig<OptionsFiles & OptionsOverrides & OptionsRegExp>("all", async (config, oFiles) => {
    const { files = oFiles, level, overrides } = config;
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
