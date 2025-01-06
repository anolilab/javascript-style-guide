import type {
    OptionsFiles,
    OptionsHasPrettier,
    OptionsOverrides,
    OptionsStylistic,
} from "../../types";
import { createConfig } from "../../utils/create-config";
import interopDefault from "../../utils/interop-default";

export default createConfig<OptionsFiles & OptionsHasPrettier & OptionsOverrides & OptionsStylistic>("yaml", async (options, oFiles) => {
    const {
        files = oFiles,
        overrides = {},
        prettier,
        stylistic = true,
    } = options;

    const { indent = 4, quotes = "double" } = typeof stylistic === "boolean" ? {} : stylistic;

    const [pluginYaml, parserYaml] = await Promise.all([interopDefault(import("eslint-plugin-yml")), interopDefault(import("yaml-eslint-parser"))] as const);

    return [
        {
            files,
            languageOptions: {
                parser: parserYaml,
            },
            name: "anolilab/yaml",
            plugins: {
                yaml: pluginYaml,
            },
            rules: {
                "@stylistic/spaced-comment": "off",

                "yaml/block-mapping": "error",
                "yaml/block-sequence": "error",
                "yaml/no-empty-key": "error",
                "yaml/no-empty-sequence-entry": "error",
                "yaml/no-irregular-whitespace": "error",
                "yaml/plain-scalar": "error",

                "yaml/vue-custom-block/no-parsing-error": "error",

                ...stylistic
                    ? {
                        "yaml/block-mapping-question-indicator-newline": "error",
                        "yaml/block-sequence-hyphen-indicator-newline": "error",
                        "yaml/flow-mapping-curly-newline": "error",
                        "yaml/flow-mapping-curly-spacing": "error",
                        "yaml/flow-sequence-bracket-newline": "error",
                        "yaml/flow-sequence-bracket-spacing": "error",
                        "yaml/indent": [prettier ? "off" : "error", indent === "tab" ? 2 : indent],
                        "yaml/key-spacing": "error",
                        "yaml/no-tab-indent": "error",
                        "yaml/quotes": ["error", { avoidEscape: true, prefer: quotes === "backtick" ? "single" : quotes }],
                        "yaml/spaced-comment": "error",
                    }
                    : {},

                ...prettier ? pluginYaml.configs.prettier.rules : {},

                ...overrides,
            },
        },
    ];
});
